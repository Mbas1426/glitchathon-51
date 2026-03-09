import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from "react-router-dom";
import { getRiskTier, CARE_PROTOCOLS, PHYSICIANS, OUTREACH_MSGS, APPOINTMENTS, TEST_HISTORY, STATUS_MAP } from "../CareAgent_Combined";
import { pt } from '../styles/patientStyles'
import { C } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx';
import PtOverview from "./PtOverview.jsx";
import PtTests from "./PtTests.jsx";
import PtAppointments from "./PtAppointments.jsx";
import PtMessages from "./PtMessages.jsx";
import PtProfile from "./PtProfile.jsx";
import { CSS } from '../styles/css.jsx';

export default function PatientApp({ patient: p, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [msgs, setMsgs] = useState(OUTREACH_MSGS[p.patient_id] || []);

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/outreach/${p.patient_id}`);
        if (res.ok) {
          const data = await res.json();
          setMsgs(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMsgs();
  }, [p.patient_id]);

  const pathParts = location.pathname.split('/');
  const tab = pathParts[pathParts.indexOf(id) + 1] || "overview";
  const risk = getRiskTier(p);
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  const doc = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
  const appts = APPOINTMENTS[p.patient_id] || [];
  const hist = TEST_HISTORY[p.patient_id] || [];
  const isUrgent = p.status === "escalated";
  const isOverdue = p.overdue_days > 0 && p.status !== "closed";

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "tests", label: "Test History" },
    { id: "appointments", label: "Appointments" },
    { id: "messages", label: `Messages${msgs.length ? ` (${msgs.length})` : ""}` },
    { id: "profile", label: "My Profile" },
  ];

  return (
    <div style={pt.root}>
      <style>{CSS}</style>
      <header style={pt.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={d.logoMark}><span style={{ fontSize: 16, color: "#fff" }}>✚</span></div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>CareAgent</span>
            <span style={{ fontSize: 12, color: C.textDimmer, margin: "0 6px" }}>/</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>Patient Portal</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{p.patient_name}</div>
            <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>#{String(p.patient_id).padStart(4, "0")} · {p.diagnosis}</div>
          </div>
          <span style={{ fontSize: 9, padding: "3px 8px", border: `1px solid ${isUrgent ? C.red : isOverdue ? C.orange : C.border}`, color: isUrgent ? C.red : isOverdue ? C.orange : C.textMuted, borderRadius: 6, letterSpacing: 1, fontWeight: isUrgent ? 700 : 400 }}>{STATUS_MAP[p.status]}</span>
          <button onClick={onLogout} style={{ fontSize: 10, padding: "5px 10px", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", color: C.textMuted, borderRadius: 7 }}>Sign Out</button>
        </div>
      </header>

      {isUrgent && (
        <div style={{ background: C.redDim, borderBottom: `1px solid ${C.red}40`, color: C.red, padding: "10px 28px", display: "flex", alignItems: "center", gap: 14 }} className="fadeSlide">
          <span style={{ fontSize: 16, fontWeight: 700 }}>!</span>
          <span style={{ fontSize: 11, lineHeight: 1.5, flex: 1 }}>Action required — Your {p.last_test} result of <strong>{p.last_value} {proto?.unit}</strong> is critically above the safe range. Contact {doc?.physician_name} immediately.</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{doc?.phone}</span>
        </div>
      )}

      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", alignItems: "center", gap: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(`/patient/${id}/${t.id}`)} style={{ padding: "12px 16px", border: "none", borderBottom: `2px solid ${tab === t.id ? C.blue : "transparent"}`, background: "transparent", fontSize: 11, fontFamily: "monospace", cursor: "pointer", color: tab === t.id ? C.blue : C.textMuted, letterSpacing: 0.5, transition: "all 0.15s", fontWeight: tab === t.id ? 700 : 400 }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 9, color: C.textDimmer, letterSpacing: 1 }}>Kathir Memorial · Chennai</div>
      </nav>

      <div style={{ flex: 1, padding: "24px 28px", maxWidth: 1100, width: "100%", margin: "0 auto", overflowY: "auto" }} className="fadeIn" key={tab}>
        <Routes>
          <Route path="overview" element={<PtOverview p={p} proto={proto} doc={doc} hist={hist} msgs={msgs} />} />
          <Route path="tests" element={<PtTests p={p} proto={proto} hist={hist} />} />
          <Route path="appointments" element={<PtAppointments p={p} appts={appts} doc={doc} proto={proto} />} />
          <Route path="messages" element={<PtMessages p={p} msgs={msgs} />} />
          <Route path="profile" element={<PtProfile p={p} doc={doc} proto={proto} />} />
          <Route path="/" element={<Navigate to={`/patient/${id}/overview`} replace />} />
        </Routes>
      </div>
    </div>
  );
}