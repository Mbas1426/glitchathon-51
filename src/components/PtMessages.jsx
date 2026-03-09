import {pt} from '../styles/patientStyles.jsx';
import {C} from '../styles/homeStyles.jsx';
import { useState } from "react";

export default function PtMessages({ p, msgs }) {
  const [reply, setReply] = useState("");
  const [sent, setSent]   = useState([]);
  const [typing, setTyping] = useState(false);
  const handleSend = () => {
    if (!reply.trim()) return;
    setTyping(true);
    setSent(prev => [...prev, { text:reply, date:new Date().toISOString().slice(0,10) }]);
    setReply("");
    setTimeout(() => setTyping(false), 1200);
  };
  const allMsgs = [...(msgs||[])].reverse();
  const msgBorderColor = (type) => type==="urgent"?C.red:type==="reminder"?C.orange:type==="info"?C.blue:C.green;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={pt.card}>
        <div style={pt.cardLabel}>MESSAGES FROM KATHIR MEMORIAL HOSPITAL</div>
        {allMsgs.length===0 && <div style={{ fontSize:11, color:C.textMuted, padding:"16px 0" }}>No messages yet.</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:allMsgs.length?12:0 }}>
          {allMsgs.map((m,i) => (
            <div key={i} style={{ padding:"12px 14px", background:C.bgDeep, borderLeft:`3px solid ${msgBorderColor(m.type)}`, borderRadius:"0 8px 8px 0" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted }}>CARE TEAM · {p.preferred_channel}</span>
                <span style={{ fontSize:9, color:C.textDim }}>{m.date}</span>
                {m.type==="urgent"   && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.red}`,    color:C.red,    letterSpacing:1, borderRadius:4 }}>URGENT</span>}
                {m.type==="reminder" && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.orange}`, color:C.orange, letterSpacing:1, borderRadius:4 }}>REMINDER</span>}
                {m.type==="info"     && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.blue}`,   color:C.blue,   letterSpacing:1, borderRadius:4 }}>INFO</span>}
                {m.type==="response" && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.green}`,  color:C.green,  letterSpacing:1, borderRadius:4 }}>REPLY</span>}
              </div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>{m.msg}</div>
            </div>
          ))}
          {sent.map((m,i) => (
            <div key={`s${i}`} style={{ padding:"12px 14px", background:C.blueFaint, borderLeft:`3px solid ${C.blue}`, borderRadius:"0 8px 8px 0", marginLeft:32 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}><span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted }}>YOU</span><span style={{ fontSize:9, color:C.textDim }}>{m.date}</span></div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>{m.text}</div>
            </div>
          ))}
          {typing && <div style={{ padding:"12px 14px", background:C.bgDeep, borderLeft:`3px solid ${C.border}`, borderRadius:"0 8px 8px 0" }}><div style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted, marginBottom:8 }}>CARE TEAM</div><div style={{ fontSize:12, color:C.textDimmer, letterSpacing:3 }}>. . .</div></div>}
        </div>
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>REPLY TO CARE TEAM</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["YES, book home collection","Need to reschedule","I have a question"].map((q,i) => (
              <button key={i} onClick={() => setReply(q)} style={{ fontSize:10, padding:"6px 12px", border:`1px solid ${C.border}`, background:C.bgDeep, cursor:"pointer", fontFamily:"monospace", color:C.textSub, borderRadius:8 }}>{q}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your message…" style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", fontSize:11, fontFamily:"monospace", outline:"none", resize:"none", color:C.text, background:C.bgDeep }} rows={3} />
            <button onClick={handleSend} style={{ padding:"10px 18px", background:`linear-gradient(135deg,#1565a8,#2980c4)`, color:"#fff", border:"none", borderRadius:9, fontSize:11, fontFamily:"monospace", cursor:"pointer", letterSpacing:1, fontWeight:700, flexShrink:0 }}>SEND →</button>
          </div>
        </div>
        <div style={{ fontSize:9, color:C.textMuted, marginTop:4 }}>Messages are delivered via {p.preferred_channel}. Response time: within 24 hours.</div>
      </div>
    </div>
  );
}