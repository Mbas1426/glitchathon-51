import { pt } from '../../styles/patientStyles.jsx';
import { C } from '../../styles/homeStyles.jsx';
import { useState, useRef, useEffect } from "react";

export default function PtMessages({ p, msgs }) {

  const [messages, setMessages] = useState(msgs || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Merge hospital outreach messages with current chat state
  useEffect(() => {
    setMessages(prev => {
      // Find messages in the new `msgs` prop that aren't already in our local state
      const newMsgs = (msgs || []).filter(m =>
        !prev.find(curr => curr.msg === m.msg && curr.date === m.date)
      );
      if (newMsgs.length === 0) return prev;
      return [...prev, ...newMsgs];
    });
  }, [msgs]);

  // Scroll to bottom when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start AI conversation if no AI messages exist yet
  useEffect(() => {
    const hasAI = messages.some(m => m.type === "bot" || m.type === "user");
    if (!hasAI) {
      startConversation();
    }
  }, []);

  const startConversation = async () => {
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "START_CONVERSATION", patient_id: p.patient_id })
      });
      const data = await res.json();
      const botMsg = { date: new Date().toISOString(), msg: data.reply || "Hello! I'm your AI care assistant.", type: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    const userMsg = { date: new Date().toISOString(), msg: userText, type: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, patient_id: p.patient_id })
      });
      if (!res.ok) throw new Error("AI failed");
      const data = await res.json();
      setMessages(prev => [...prev, { date: new Date().toISOString(), msg: data.reply, type: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { date: new Date().toISOString(), msg: "Sorry, I'm having trouble connecting to my brain!", type: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  // Sort messages by date for display (oldest at top, newest at bottom text field)
  const sortedMessages = [...messages].sort((a, b) => new Date(a.date) - new Date(b.date));

  const getMsgStyle = (m) => {
    if (m.type === "user") return { background: C.blue, color: "#fff", alignSelf: "flex-end", borderRadius: "12px 12px 2px 12px" };
    if (m.type === "bot") return { background: C.bgDeep, color: C.text, alignSelf: "flex-start", borderRadius: "12px 12px 12px 2px", border: `1px solid ${C.border}` };
    // Hospital styles
    const colors = { urgent: C.red, reminder: C.orange, info: C.blue, response: C.green };
    const color = colors[m.type] || C.textMuted;
    return { background: "#fff", color: C.text, alignSelf: "flex-start", borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0", borderTop: "1px solid #eee", borderRight: "1px solid #eee", borderBottom: "1px solid #eee" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 400, background: C.bgDeep, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {sortedMessages.map((m, i) => (
          <div key={`${m.type}-${m.date}-${i}`} style={{ display: "flex", flexDirection: "column", ...getMsgStyle(m), padding: "8px 12px", maxWidth: "80%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.6, letterSpacing: 1, textTransform: "uppercase" }}>
                {m.type === "user" ? "You" : m.type === "bot" ? "CareAgent AI" : `Care Team (${m.type})`}
              </span>
              <span style={{ fontSize: 8, opacity: 0.5 }}>{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>{m.msg}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 16px", background: "#fff", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: C.bgDeep,
            color: C.text,
            fontSize: 12,
            outline: "none",
            transition: "all 0.2s"
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={loading ? "CareAgent is thinking..." : "Ask about your results, medications..."}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            background: loading || !input.trim() ? C.border : `linear-gradient(135deg, ${C.blue}, #1e40af)`,
            color: "#fff",
            border: "none",
            fontSize: 11,
            fontWeight: 600,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {loading ? "..." : "SEND"}
        </button>
      </div>
    </div>
  );
}