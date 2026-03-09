const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const { PATIENTS, TEST_HISTORY, OUTREACH_MSGS } = require("./data/patientData");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send({ status: "Backend running" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message, patient_id } = req.body;

  if (!message || !patient_id) {
    return res.status(400).json({ error: "Message and patient_id are required" });
  }

  try {
    const patient = PATIENTS.find(p => p.patient_id === patient_id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const testHistory = TEST_HISTORY[patient_id] || [];
    const outreach = OUTREACH_MSGS[patient_id] || [];

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
          Authorization: `Bearer ${apiKey}`,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});