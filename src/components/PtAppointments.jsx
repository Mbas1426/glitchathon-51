import {pt} from '../styles/patientStyles.jsx';
import {C} from '../styles/homeStyles.jsx';

export default function PtAppointments({ p, appts, doc, proto }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ ...pt.card, border:`2px solid ${C.blue}` }}>
        <div style={pt.cardLabel}>NEXT APPOINTMENT</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"flex-start", marginTop:4 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8, color:C.blue }}>TO BE SCHEDULED</div>
            <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>Your {p.last_test} is <strong>{p.overdue_days} days overdue.</strong> Book your next appointment with {doc?.physician_name} at your earliest convenience.</div>
          </div>
          <div style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", minWidth:200, background:C.bgDeep }}>
            <div style={pt.cardLabel}>CONTACT TO BOOK</div>
            <div style={{ fontSize:13, fontWeight:700, marginTop:8, color:C.text }}>{doc?.physician_name}</div>
            <div style={{ fontSize:11, color:C.textSub }}>{doc?.specialty}</div>
            <div style={{ fontSize:12, fontWeight:700, marginTop:8, color:C.blue }}>{doc?.phone}</div>
            <div style={{ fontSize:10, color:C.textMuted }}>{doc?.hospital}</div>
          </div>
        </div>
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>APPOINTMENT HISTORY</div>
        {appts.length===0 ? <div style={{ fontSize:11, color:C.textMuted, padding:"16px 0" }}>No recorded appointments found.</div> : (
          <div style={{ display:"flex", flexDirection:"column" }}>
            {appts.map((a,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.textDimmer, fontFamily:"monospace", width:24 }}>{String(appts.length-i).padStart(2,"0")}</div>
                <div style={{ fontSize:11, fontFamily:"monospace", color:C.textMuted, width:96 }}>{a.date}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{a.type}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{a.doc}</div>
                </div>
                <div style={{ fontSize:11, fontFamily:"monospace", color:C.blue, fontWeight:700 }}>{a.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>CARE PROTOCOL REMINDER</div>
        <div style={{ fontSize:12, color:C.textSub, lineHeight:1.9, marginTop:4 }}>As a patient with <strong>{p.diagnosis}</strong>, your <strong>{p.last_test}</strong> should be conducted every <strong>{proto?.frequency_days} days</strong>. Regular monitoring prevents emergency hospitalizations.</div>
      </div>
    </div>
  );
}