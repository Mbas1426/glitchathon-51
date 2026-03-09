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
      <div style={pt.appContainer}>
        <style>{CSS}</style>
        <header style={pt.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={d.logoMark}><span style={{ fontSize: 18, color: "#fff" }}></span></div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.textTitle, letterSpacing: "-0.5px" }}>CareAgent</span>
              <span style={{ fontSize: 13, color: C.textMuted, margin: "0 10px" }}>/</span>
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Patient Portal</span>
            </div>
          </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.textTitle }}>{p.patient_name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, fontWeight: 400 }}>#{String(p.patient_id).padStart(4, "0")} · {p.diagnosis}</div>
          </div>
          <span style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${isUrgent ? C.red : isOverdue ? "#FF9500" : C.border}`, color: isUrgent ? C.red : isOverdue ? "#FF9500" : C.textMuted, borderRadius: 8, letterSpacing: 0.5, fontWeight: 500 }}>{STATUS_MAP[p.status]}</span>
          <button onClick={onLogout} style={{ fontSize: 13, padding: "8px 16px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.5)", cursor: "pointer", color: C.textTitle, borderRadius: 10, fontWeight: 500, transition: "all 0.2s" }}>Sign Out</button>
        </div>
      </header>

      {isUrgent && (
        <div style={{ background: C.redDim, borderBottom: `1px solid ${C.red}40`, color: C.red, padding: "10px 28px", display: "flex", alignItems: "center", gap: 14 }} className="fadeSlide">
          <span style={{ fontSize: 16, fontWeight: 700 }}>!</span>
          <span style={{ fontSize: 11, lineHeight: 1.5, flex: 1 }}>Action required — Your {p.last_test} result of <strong>{p.last_value} {proto?.unit}</strong> is critically above the safe range. Contact {doc?.physician_name} immediately.</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{doc?.phone}</span>
        </div>
      )}

      <nav style={{ background: "rgba(255,255,255,0.5)", borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", alignItems: "center", gap: 0, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(`/patient/${id}/${t.id}`)} style={{ padding: "14px 20px", border: "none", borderBottom: `2px solid ${tab === t.id ? C.blue : "transparent"}`, background: "transparent", fontSize: 14, cursor: "pointer", color: tab === t.id ? C.blue : C.textMuted, transition: "all 0.15s", fontWeight: tab === t.id ? 500 : 400 }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, fontWeight: 500 }}>Kathir Memorial · Chennai</div>
      </nav>

      <div style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, width: "100%", margin: "0 auto", overflowY: "auto" }} className="fadeIn" key={tab}>
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
    </div>
  );
}