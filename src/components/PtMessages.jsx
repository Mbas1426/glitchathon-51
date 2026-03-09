import { pt } from '../styles/patientStyles.jsx';
import { C } from '../styles/homeStyles.jsx';
import { useState, useRef, useEffect } from "react";

export default function PtMessages({ p, msgs }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Initialize with outreach messages + welcome message on mount
  useEffect(() => {
    const formattedMsgs = msgs.map(m => ({
      date: m.date,
      msg: m.message || m.msg, // handle different json structures
      type: "doctor"
    }));
    
    setMessages(formattedMsgs);
    
    // Only call start conversation if it's actually empty
    if (formattedMsgs.length === 0) {
      startConversation();
    }
  }, [p.patient_id]); // only re-run if patient changes

  // Scroll to bottom on new message

  const startConversation = async () => {
    try {
      const res = await fetch("http://localhost:5001/chat", {
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
      const res = await fetch("http://localhost:5001/chat", {
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: "calc(100vh - 180px)", background: C.bgCard, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.textTitle }}>Care Assistant</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Powered by AI & your Care Team</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {messages.map((m, i) => {
          const isUser = m.type === "user";
          const isDoc = m.type === "doctor";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <div style={{ maxWidth: "75%" }}>
                {!isUser && (
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, marginLeft: 4 }}>
                    {isDoc ? "Doctor's Office" : "Care Assistant"}
                  </div>
                )}
                <div
                  style={{
                    background: isUser ? C.blue : isDoc ? C.bgDeep : "#fff",
                    color: isUser ? "#fff" : C.textTitle,
                    padding: "12px 16px",
                    borderRadius: 18,
                    borderBottomRightRadius: isUser ? 4 : 18,
                    borderBottomLeftRadius: !isUser ? 4 : 18,
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: isUser ? `0 2px 8px rgba(0, 113, 227, 0.2)` : "0 2px 8px rgba(0,0,0,0.03)",
                    border: isUser ? "none" : `1px solid ${C.border}`
                  }}
                >
                  {m.msg}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, padding: "12px 20px", borderRadius: 18, borderBottomLeftRadius: 4 }}>
              <span style={{ fontSize: 18, color: C.textMuted, animation: "pulse 1.5s infinite" }}>•••</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "16px", background: "rgba(255,255,255,0.8)", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, backdropFilter: "blur(10px)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 20,
            border: `1px solid ${C.border}`,
            background: "#fff",
            color: C.textTitle,
            fontSize: 14,
            outline: "none",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)"
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />

        <button 
          onClick={sendMessage} 
          disabled={loading || !input.trim()} 
          style={{ 
            padding: "0 24px", 
            borderRadius: 20,
            background: input.trim() && !loading ? C.blue : C.blueDim,
            color: input.trim() && !loading ? "#fff" : C.blue,
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: input.trim() && !loading ? "pointer" : "default",
            transition: "all 0.2s"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}