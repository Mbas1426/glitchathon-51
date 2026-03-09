import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from "react-router-dom";
import { C, h } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx'
import { pt } from '../styles/patientStyles.jsx'
import { CSS } from '../styles/css.jsx'
import { useData } from "../CareAgent_Combined.jsx";
import PulseRing from './PulseRing.jsx'
import DocDashboard from './DocDashboard.jsx'
import DocPatients from './DocPatients.jsx'
import DocOutreach from './DocOutreach.jsx'
import DocCareGaps from './DocCareGaps.jsx'
import DocEscalations from './DocEscalations.jsx'
import DocPatientModal from './DocPatientModal.jsx'

export default function DoctorApp({ doctor, onLogout }) {
  const { PHYSICIANS, PATIENTS, CARE_PROTOCOLS, OUTREACH_RESPONSES, getRiskTier } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Extract active tab correctly by looking for the segment after the ID
  // e.g. /doctor/1/dashboard -> dashboard
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.indexOf(id) + 1] || "dashboard";

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterDiag, setFilterDiag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingMsg, setSendingMsg] = useState(null);
  const [sentMsgs, setSentMsgs] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [gapsLog, setGapsLog] = useState([
    { id: 1, patient: "Usha Balasubramaniam", test: "HbA1c", closedAt: "2025-03-05", status: "Completed" },
  ]);

  const showToast = (msg, type = "success") => { setToastMsg({ msg, type }); setTimeout(() => setToastMsg(null), 3000); };

  const handleTabChange = (tab) => {
    setAnimIn(false);
    setTimeout(() => {
      navigate(`/doctor/${id}/${tab}`);
      setAnimIn(true);
    }, 150);
  };
  const handleSend = async (pid, msg) => {
    setSendingMsg(pid);
    try {
      const res = await fetch("http://localhost:5000/doctor/send-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: pid, message: msg })
      });
      if (res.ok) {
        setSentMsgs(prev => [...prev, pid]);
        showToast("Outreach message sent!");
        setTimeout(() => {
          setSentMsgs(prev => prev.filter(id => id !== pid));
        }, 3000);
        return true;
      } else {
        showToast("Failed to send message", "warning");
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast("Server error", "warning");
      return false;
    } finally {
      setSendingMsg(null);
    }
  };
  const handleEscalate = (p) => { const doc = PHYSICIANS.find(ph => ph.physician_id === p.physician_id); showToast(`Escalated to ${doc?.physician_name}`, "warning"); };

  const myPatients = doctor ? PATIENTS.filter(p => p.physician_id === doctor.physician_id) : PATIENTS;
  const filtered = myPatients.filter(p => {
    const risk = getRiskTier(p);
    return (filterRisk === "all" || risk === filterRisk)
      && (filterDiag === "all" || p.diagnosis === filterDiag)
      && (p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const critical = myPatients.filter(p => getRiskTier(p) === "critical");
  const overdue = myPatients.filter(p => p.status === "overdue" || p.status === "escalated");
  const escalated = myPatients.filter(p => p.status === "escalated");
  const closed = myPatients.filter(p => p.status === "closed");

  const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "patients", label: "Patients" },
    { id: "outreach", label: "Outreach" },
    { id: "gaps", label: "Care Gaps" },
    { id: "escalations", label: "Escalations" },
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
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Doctor Portal</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={d.searchBox}>
              <span style={{ color: C.textMuted, fontSize: 12 }}>⌕</span>
              <input placeholder="Search patients…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={d.searchInput} />
            </div>
            <div style={{ textAlign: "right", marginLeft: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textTitle }}>Dr. {doctor?.physician_name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, fontWeight: 400 }}>{doctor?.specialty}</div>
            </div>
            <button onClick={onLogout} style={{ fontSize: 13, padding: "8px 16px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.5)", cursor: "pointer", color: C.textTitle, borderRadius: 10, fontWeight: 500, transition: "all 0.2s", marginLeft: 12 }}>Sign Out</button>
          </div>
        </header>

        <nav style={{ background: "rgba(255,255,255,0.5)", borderBottom: `1px solid ${C.border}`, padding: "12px 32px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => handleTabChange(n.id)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: activeTab === n.id ? "#fff" : "transparent", fontSize: 13, cursor: "pointer", color: activeTab === n.id ? C.textTitle : C.textMuted, transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)", fontWeight: activeTab === n.id ? 600 : 500, boxShadow: activeTab === n.id ? "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" : "none", transform: activeTab === n.id ? "translateY(-1px)" : "translateY(0)", display: "flex", alignItems: "center", gap: 8 }}>
              {n.label}
              {n.id === "escalations" && escalated.length > 0 && <span style={d.badge}>{escalated.length}</span>}
              {n.id === "patients" && overdue.length > 0 && <span style={{ ...d.badge, background: "rgba(255, 107, 107, 0.1)", color: C.red }}>{overdue.length}</span>}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PulseRing color="#2ecc71" size={7} />
            <span style={{ fontSize: 12, color: "#2ecc71", fontWeight: 700 }}>System Active</span>
          </div>
        </nav>

        <div style={{ flex: 1, padding: "32px 40px", maxWidth: 1400, width: "100%", margin: "0 auto", overflowY: "auto" }} className="fadeIn" key={activeTab}>
          <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)", transition: "all 0.2s ease" }}>
            <Routes>
              <Route path="dashboard" element={ <DocDashboard patients={myPatients} critical={critical} overdue={overdue} closed={closed} escalated={escalated} protocols={CARE_PROTOCOLS} onNavigate={handleTabChange} /> } />
              <Route path="patients" element={ <DocPatients patients={filtered} filterRisk={filterRisk} setFilterRisk={setFilterRisk} filterDiag={filterDiag} setFilterDiag={setFilterDiag} onSelect={setSelectedPatient} selected={selectedPatient} /> } />
              <Route path="outreach" element={<DocOutreach patients={myPatients} responses={OUTREACH_RESPONSES} onSend={handleSend} sentMsgs={sentMsgs} sendingMsg={sendingMsg} />} />
              <Route path="gaps" element={<DocCareGaps patients={myPatients} gapsLog={gapsLog} setGapsLog={setGapsLog} showToast={showToast} />} />
              <Route path="escalations" element={<DocEscalations patients={escalated} physicians={PHYSICIANS} onEscalate={handleEscalate} />} />
              <Route path="/" element={<Navigate to={`/doctor/${id}/dashboard`} replace />} />
            </Routes>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div style={{ ...d.toast, background: toastMsg.type === "warning" ? C.orange : C.green, color: "#fff" }}>
          <span>{toastMsg.type === "warning" ? "⚠" : "✓"}</span> {toastMsg.msg}
        </div>
      )}
      {selectedPatient && (
        <DocPatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}