import { useState, useEffect, useRef } from "react";
import {C, h} from '../styles/homeStyles.jsx'
import {diagIcon} from '../CareAgent_Combined.jsx'
import { PHYSICIANS, PATIENTS, CARE_PROTOCOLS, OUTREACH_RESPONSES, getRiskTier, getRiskColor, getStatusBadge, getChannelIcon } from  "../CareAgent_Combined.jsx";

export default function DocOutreach({ patients, responses, onSend, sentMsgs, sendingMsg }) {
  const [expanded, setExpanded] = useState(null);
  const overdueList = patients.filter(p => p.status==="overdue"||p.status==="escalated"||p.status==="pending");
  const genMsg = (p) => `Dear ${p.patient_name.split(" ")[0]}, your ${p.last_test} test is now ${p.overdue_days} days overdue. Your last value was ${p.last_value}. Delaying monitoring for ${p.diagnosis} can lead to serious complications. We offer FREE home sample collection — reply YES to book. — Kathir Memorial Care Team`;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:C.bgCard, borderRadius:12, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, color:C.textSub }}><span style={{ color:C.orange }}>◉</span> {overdueList.length} patients awaiting outreach</div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ fontSize:11, color:C.textMuted, padding:"4px 10px", background:C.bgDeep, borderRadius:8, display:"flex", gap:5, alignItems:"center" }}><span style={{ color:C.green }}>✓</span>{sentMsgs.length} sent</div>
          <div style={{ fontSize:11, color:C.textMuted, padding:"4px 10px", background:C.bgDeep, borderRadius:8, display:"flex", gap:5, alignItems:"center" }}><span style={{ color:C.blue }}>◈</span>{responses.length} responded</div>
        </div>
      </div>
      {overdueList.map((p,i) => {
        const rc = getRiskColor(getRiskTier(p));
        const resp = responses.find(r => r.patient_id === p.patient_id);
        const isSent = sentMsgs.includes(p.patient_id);
        const isSending = sendingMsg === p.patient_id;
        const isExp = expanded === p.patient_id;
        return (
          <div key={p.patient_id} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderLeft:`3px solid ${rc}`, borderRadius:14, padding:16, transition:"border-color 0.2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={() => setExpanded(isExp?null:p.patient_id)}>
              <div style={{ width:38, height:38, borderRadius:10, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", background:`${rc}18`, color:rc }}>{p.patient_name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13, color:C.text, fontWeight:600 }}>{p.patient_name}</span>
                  <span style={{ fontSize:10, color:rc, background:`${rc}15`, padding:"2px 6px", borderRadius:8, textTransform:"capitalize" }}>{getRiskTier(p)}</span>
                </div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{diagIcon(p.diagnosis)} {p.diagnosis} · {p.last_test}: <span style={{ color:C.orange }}>{p.last_value}</span> · Overdue: <span style={{ color:C.red }}>{p.overdue_days}d</span></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {resp && <span style={{ fontSize:10, padding:"3px 10px", borderRadius:10, background:resp.type==="agreed"?C.greenDim:resp.type==="declined"?C.redDim:C.blueDim, color:resp.type==="agreed"?C.green:resp.type==="declined"?C.red:C.blue }}>{resp.type==="agreed"?"✓ Agreed":resp.type==="declined"?"✗ Declined":"? Questioned"}</span>}
                <span style={{ fontSize:11, color:C.textMuted }}>{isExp?"▲":"▼"}</span>
              </div>
            </div>
            {isExp && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                <div style={{ background:C.bgDeep, borderRadius:10, padding:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10, color:C.textMuted, marginBottom:6, letterSpacing:1, textTransform:"uppercase" }}>Message Preview</div>
                  <div style={{ fontSize:11, color:C.textSub, lineHeight:1.7 }}>{genMsg(p)}</div>
                </div>
                {resp && (
                  <div style={{ background:C.blueFaint, border:`1px solid ${C.blue}30`, borderRadius:10, padding:12, marginTop:10 }}>
                    <div style={{ fontSize:10, color:C.textMuted, marginBottom:4, letterSpacing:1, textTransform:"uppercase" }}>Patient Response · {resp.date}</div>
                    <div style={{ fontSize:12, color:C.text, fontStyle:"italic" }}>"{resp.message}"</div>
                    {resp.type==="agreed"   && <div style={{ marginTop:8, fontSize:11, color:C.green }}>✓ Home collection booked</div>}
                    {resp.type==="declined" && <div style={{ marginTop:8, fontSize:11, color:C.orange }}>↻ Re-outreach in 30 days</div>}
                    {resp.type==="question" && <div style={{ marginTop:8, fontSize:11, color:C.blue }}>◈ Contextual reply sent</div>}
                  </div>
                )}
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button onClick={() => onSend(p.patient_id)} disabled={isSent||isSending} style={{ background:`linear-gradient(135deg,#1565a8,#2980c4)`, border:"none", color:"#fff", padding:"8px 18px", borderRadius:9, cursor:"pointer", fontSize:11, fontWeight:600, opacity:isSent?0.5:1 }}>
                    {isSending?"Sending…":isSent?"✓ Sent":`Send via ${p.preferred_channel}`}
                  </button>
                  {!p.has_smartphone && <button style={{ background:C.orangeDim, border:`1px solid ${C.orange}50`, color:C.orange, padding:"8px 14px", borderRadius:9, cursor:"pointer", fontSize:11 }}>👨‍👩‍👧 Notify NOK</button>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}