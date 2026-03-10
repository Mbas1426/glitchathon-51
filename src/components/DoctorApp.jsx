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
import VideoCallModal from './VideoCallModal.jsx'
import { useSocket } from '../SocketContext.jsx';

export default function DoctorApp({ doctor, onLogout }) {
  const SvgBackground = () => (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradOrangeTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3b30" />
          <stop offset="100%" stopColor="#FF9500" />
        </linearGradient>
        <linearGradient id="gradOrangeBot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF3B30" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="#ffffff" />

      <path fill="#F4F6F9" d="M0,900 L0,700 C400,600 500,800 900,600 C1200,450 1350,550 1440,450 L1440,900 Z" />
      <path fill="#EAECEF" d="M0,900 L0,750 C300,700 400,850 800,750 C1100,650 1300,800 1440,700 L1440,900 Z" opacity="0.6" />

      <path fill="#2E557A" d="M600,0 C800,250 1100,150 1440,300 L1440,0 Z" />

      <path fill="url(#gradOrangeTop)" d="M0,0 L600,0 C500,150 600,250 400,350 C250,425 250,550 0,550 Z" />
      <path fill="#FF3B30" opacity="0.8" d="M0,0 L450,0 C350,150 400,250 250,350 C100,450 100,500 0,400 Z" />

      <path fill="url(#gradOrangeBot)" d="M800,900 C900,750 1000,850 1150,650 C1250,500 1350,450 1440,550 L1440,900 Z" />

      <rect x="-30" y="650" width="230" height="70" rx="35" fill="#297FC6" />
    </svg>
  );

  const { PHYSICIANS, PATIENTS, CARE_PROTOCOLS, OUTREACH_RESPONSES, getRiskTier } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.indexOf(id) + 1] || "dashboard";
  const socket = useSocket();

  const [callState, setCallState] = useState({
    isCalling: false,
    receivingCall: false,
    targetUserId: "",
    caller: "",
    roomId: null,
    callAccepted: false,
    callEnded: false,
  });

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

  useEffect(() => {
    if (!socket) return;

  }, [socket, doctor.physician_id]);

  const initiateCall = async (patient) => {
    try {
      const targetUserId = `patient_${patient.patient_id}`;
      const roomId = `CareAgent-${doctor.physician_id}-${patient.patient_id}-${Math.random().toString(36).substring(2, 10)}`;

      setCallState(prev => ({ ...prev, isCalling: true, caller: patient.patient_name, targetUserId, roomId }));

      await fetch(`http://${window.location.hostname}:5002/api/call/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patient.patient_id,
          roomId: roomId,
          doctor_id: doctor.physician_id,
          callerName: `${doctor.physician_name}`
        })
      });

      setSelectedPatient(null);
    } catch (err) {
      console.error("Failed to initiate call", err);
      showToast("Error initiating room", "warning");
    }
  };

  const endCall = async () => {
    const patientId = callState.targetUserId.replace('patient_', '');

    setCallState({ isCalling: false, receivingCall: false, caller: "", targetUserId: "", roomId: null, callAccepted: false, callEnded: true });

    if (patientId) {
      try {
        await fetch(`http://${window.location.hostname}:5002/api/call/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient_id: patientId })
        });
      } catch (e) {
        console.error("Error ending call", e);
      }
    }
  };

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
      const res = await fetch(`http://${window.location.hostname}:5002/doctor/send-outreach`, {
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
      <SvgBackground />
      <div style={{ ...pt.appContainer, zIndex: 1, position: 'relative' }}>
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
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textTitle }}>{doctor?.physician_name}</div>
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
              <Route path="dashboard" element={<DocDashboard doctor={doctor} patients={myPatients} critical={critical} overdue={overdue} closed={closed} escalated={escalated} protocols={CARE_PROTOCOLS} onNavigate={handleTabChange} />} />
              <Route path="patients" element={<DocPatients patients={filtered} filterRisk={filterRisk} setFilterRisk={setFilterRisk} filterDiag={filterDiag} setFilterDiag={setFilterDiag} onSelect={setSelectedPatient} selected={selectedPatient} />} />
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
        <DocPatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} onCall={() => initiateCall(selectedPatient)} />
      )}
      {callState.isCalling && callState.roomId && (
        <VideoCallModal
          roomId={callState.roomId}
          callerName={callState.caller}
          onEndCall={endCall}
        />
      )}
    </div>
  );
}
