import { pt } from '../styles/patientStyles.jsx';
import { C } from '../styles/homeStyles.jsx';
import { useState, useRef, useEffect } from "react";

export default function PtMessages({ p, msgs }) {

  const [messages, setMessages] = useState(msgs);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Sync messages with props whenever outreach updates
  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI sends first message when chat opens
  useEffect(() => {
    if (messages.length === 0) startConversation();
  }, []);

  const startConversation = async () => {
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "START_CONVERSATION",
          patient_id: p.patient_id
        })
      });

      const data = await res.json();

      const botMsg = {
        date: new Date().toISOString(),
        msg: data.reply || "Hello! I'm your care assistant.",
        type: "bot"
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Start conversation error:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // Add user message
    const userMsg = { date: new Date().toISOString(), msg: userText, type: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          patient_id: p.patient_id
        })
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      const botMsg = {
        date: new Date().toISOString(),
        msg: data.reply || "No reply",
        type: "bot"
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);

      const errorMsg = {
        date: new Date().toISOString(),
        msg: "Error: Could not get response",
        type: "bot"
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", padding: "12px 16px", background: "#f5f5f7", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.type === "user" ? "right" : "left", margin: "4px 0" }}>
            <span
              style={{
                background: m.type === "user" ? "#d0f0fd" : "#eee",
                padding: "4px 8px",
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              {m.msg}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#f0f0f0",
            color: "#111"
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage} disabled={loading} style={{ padding: "6px 12px", borderRadius: 6 }}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}