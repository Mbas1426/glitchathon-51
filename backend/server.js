const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getJson = (filename) => {
  const filepath = path.join(__dirname, "data", filename);
  if (!fs.existsSync(filepath)) return Array.isArray(filename.match(/msgs|responses|history/)) ? {} : [];
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
};

// Helper to read/write outreach msgs
const msgsPath = path.join(__dirname, "data", "outreach_msgs.json");
const getMsgs = () => getJson("outreach_msgs.json");
const saveMsgs = (data) => fs.writeFileSync(msgsPath, JSON.stringify(data, null, 2));

const usersPath = path.join(__dirname, "data", "users.json");
if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, JSON.stringify({}));
const getUsers = () => JSON.parse(fs.readFileSync(usersPath, "utf-8"));
const saveUsers = (data) => fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send({ status: "Backend running" });
});

// Master data endpoint
app.get("/api/data", (req, res) => {
  try {
    res.json({
      patients: getJson("patients.json"),
      physicians: getJson("physicians.json"),
      protocols: getJson("care_protocols.json"),
      appointments: getJson("appointments.json"),
      testHistory: getJson("test_history.json"),
      outreachMsgs: getJson("outreach_msgs.json"),
      outreachResponses: getJson("outreach_responses.json"),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load data from JSON files" });
  }
});

// Login endpoint
app.post("/login", (req, res) => {
  const { role, id, password } = req.body;
  if (!id || !password || !role) return res.status(400).json({ error: "Missing credentials" });

  const users = getUsers();
  const userKey = `${role}_${id}`;

  if (!users[userKey]) {
    // First time login, save password
    users[userKey] = password;
    saveUsers(users);
    return res.json({ success: true, isNew: true });
  } else {
    // Validate password
    if (users[userKey] === password) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  }
});

// Outreach endpoints
app.get("/outreach/:patient_id", (req, res) => {
  const { patient_id } = req.params;
  const msgs = getMsgs();
  res.json(msgs[patient_id] || []);
});

app.post("/doctor/send-outreach", (req, res) => {
  const { patient_id, message, type = "urgent" } = req.body;

  if (!patient_id || !message) {
    return res.status(400).json({ error: "Patient ID and message are required" });
  }

  const msgs = getMsgs();
  const newMsg = {
    date: new Date().toISOString().slice(0, 10),
    msg: message,
    type: type
  };

  if (!msgs[patient_id]) msgs[patient_id] = [];
  msgs[patient_id].unshift(newMsg); // Newest first

  saveMsgs(msgs);
  res.json({ success: true, message: newMsg });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message, patient_id } = req.body;

  if (!message || !patient_id) {
    return res.status(400).json({ error: "Message and patient_id are required" });
  }

  try {
    const patientsList = getJson("patients.json");
    const testHistData = getJson("test_history.json");
    const patient = patientsList.find(p => p.patient_id === patient_id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const testHistory = testHistData[patient_id] || [];
    const outreach = getMsgs()[patient_id] || [];

    const apiKey = process.env.GEMINI_API_KEY;

    // Detect automatic conversation start
    let userMessage = message;

    if (message === "START_CONVERSATION") {
      userMessage = `
The patient has just opened the chat.
Start the conversation by:
- Greeting the patient by name
- Briefly summarizing their latest test result
- Mentioning any important health risks if relevant
- Encouraging them to attend their doctor appointment or follow the doctor's advice
Keep the message short, supportive, and easy to understand.
`;
    }

    // System prompt with patient context
    const systemPrompt = `
You are CareAgent, an AI healthcare assistant helping patients manage chronic diseases.
Your goals:
1. Explain the patient's health condition in simple language.
2. Highlight risks if their test values are abnormal or if they missed appointments.
3. Encourage the patient to attend their doctor appointment or schedule a visit.
4. Be empathetic, calm, and supportive (never scary).
5. Keep responses short (2-4 sentences).
Patient Information:
Name: ${patient.patient_name}
Age: ${patient.age}
Gender: ${patient.gender}
Diagnosis:
${patient.diagnosis}
Last Test:
${patient.last_test}
Value: ${patient.last_value}
Date: ${patient.last_date}
Overdue Days:
${patient.overdue_days}
Doctor Remarks:
${patient.doctor_remarks}
Test History:
${testHistory.map(h => `${h.date}: ${h.value}`).join(", ")}
Recent Messages From Hospital:
${outreach.map(m => `${m.date}: ${m.msg}`).join(", ")}
Instructions:
- If the patient is overdue or test values are high, strongly encourage a doctor visit.
- Explain possible health risks if they delay care.
- If the patient says they feel fine, remind them many conditions worsen silently.
- Always sound supportive and caring.
`;

    const activeApiKey = process.env.GEMINI_API_KEY || process.env["GEMINI_API_KEY-rem-later"];
    if (!activeApiKey) {
      return res.status(500).json({ error: "API key is missing" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${activeApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content || "No reply from AI";

    res.json({ reply });

  } catch (err) {
    console.error("Error in /chat:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Real-time user connection mapping tracker
const connectedUsers = {}; // Maps { role_id: socket.id }

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // When a user logs in, they identify themselves to the socket server
  socket.on("register", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`User registered: ${userId} -> ${socket.id}`);
  });

  // Handle a call initiation
  socket.on("callUser", (data) => {
    // data: { userToCall, signalData, from, callerName }
    const targetSocket = connectedUsers[data.userToCall];
    if (targetSocket) {
      io.to(targetSocket).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        callerName: data.callerName
      });
    }
  });

  // Handle answering a call
  socket.on("answerCall", (data) => {
    // data: { to, signal }
    const targetSocket = connectedUsers[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("callAccepted", data.signal);
    }
  });

  // Handle declining/ending a call
  socket.on("declineCall", (data) => {
    const targetSocket = connectedUsers[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("callDeclined");
    }
  });

  socket.on("endCall", (data) => {
    const targetSocket = connectedUsers[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    // Cleanup the connection mapping on disconnect
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});