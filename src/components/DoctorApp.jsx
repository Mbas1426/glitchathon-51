import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from "react-router-dom";
import { C, h } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx'
import { PHYSICIANS, PATIENTS, CARE_PROTOCOLS, OUTREACH_RESPONSES, getRiskTier } from "../pages/CareAgent_Combined.jsx";
import PulseRing from './PulseRing.jsx'
import DocDashboard from '../pages/doctor/DocDashboard.jsx'
import DocPatients from '../pages/doctor/DocPatients.jsx'
import DocOutreach from '../pages/doctor/DocOutreach.jsx'
import DocCareGaps from '../pages/doctor/DocCareGaps.jsx'
import DocEscalations from '../pages/doctor/DocEscalations.jsx'
import DocPatientModal from './DocPatientModal.jsx'

export default function DoctorApp({ doctor, onLogout }) {
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
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "patients", label: "Patients", icon: "◈" },
    { id: "outreach", label: "Outreach", icon: "◎" },
    { id: "gaps", label: "Care Gaps", icon: "▦" },
    { id: "escalations", label: "Escalations", icon: "△" },
  ];

  return (
    <div style={d.root}>
      {/* Sidebar */}
      <aside style={d.sidebar}>
        <div style={d.logo}>
          <div style={d.logoMark}><span style={{ fontSize: 18, color: "#fff" }}>✚</span></div>
          <div>
            <div style={d.logoTitle}>CareAgent</div>
            <div style={d.logoSub}>Chronic Care AI</div>
          </div>
        </div>
        <div style={d.hospitalBadge}>
          <div style={{ fontSize: 10, color: C.blue, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Active Hospital</div>
          <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>Kathir Memorial</div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Chennai, Tamil Nadu</div>
        </div>
        {doctor && (
          <div style={{ margin: "0 14px 10px", padding: "10px 12px", background: C.blueDim, borderRadius: 10, border: `1px solid ${C.blue}30` }}>
            <div style={{ fontSize: 10, color: C.blue, letterSpacing: 1, marginBottom: 2 }}>LOGGED IN AS</div>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{doctor.physician_name}</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>{doctor.specialty}</div>
          </div>
        )}
        <nav style={d.nav}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => handleTabChange(n.id)} style={{ ...d.navBtn, ...(activeTab === n.id ? d.navActive : {}) }}>
              <span style={d.navIcon}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === "escalations" && escalated.length > 0 && <span style={d.badge}>{escalated.length}</span>}
              {n.id === "patients" && overdue.length > 0 && <span style={{ ...d.badge, background: C.orangeDim, color: C.orange }}>{overdue.length}</span>}
            </button>
          ))}
        </nav>
        <div style={d.sidebarFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PulseRing color={C.green} size={7} />
            <span style={{ fontSize: 10, color: C.green }}>System Active</span>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Last scan: 5 min ago</div>
          <button onClick={onLogout} style={d.logoutBtn}>← Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={d.main}>
        <header style={d.topbar}>
          <div>
            <div style={d.pageTitle}>{NAV.find(n => n.id === activeTab)?.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={d.searchBox}>
              <span style={{ color: C.textMuted, fontSize: 12 }}>⌕</span>
              <input placeholder="Search patients…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={d.searchInput} />
            </div>
            <div style={d.avatarBtn}>{doctor ? doctor.physician_name.split(" ").map(n => n[0]).join("").slice(0, 2) : "DR"}</div>
          </div>
        </header>

        <div style={{ ...d.content, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)", transition: "all 0.2s ease" }}>
          <Routes>
            <Route
              path="dashboard"
              element={
                <DocDashboard
                  patients={myPatients}
                  critical={critical}
                  overdue={overdue}
                  closed={closed}
                  escalated={escalated}
                  protocols={CARE_PROTOCOLS}
                  onNavigate={handleTabChange}
                />
              }
            />
            <Route
              path="patients"
              element={
                <DocPatients
                  patients={filtered}
                  filterRisk={filterRisk}
                  setFilterRisk={setFilterRisk}
                  filterDiag={filterDiag}
                  setFilterDiag={setFilterDiag}
                  onSelect={setSelectedPatient}
                  selected={selectedPatient}
                />
              }
            />
            <Route
              path="outreach"
              element={
                <DocOutreach
                  patients={myPatients}
                  responses={OUTREACH_RESPONSES}
                  onSend={handleSend}
                  sentMsgs={sentMsgs}
                  sendingMsg={sendingMsg}
                />
              }
            />
            <Route
              path="gaps"
              element={
                <DocCareGaps
                  patients={myPatients}
                  gapsLog={gapsLog}
                  setGapsLog={setGapsLog}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="escalations"
              element={
                <DocEscalations
                  patients={escalated}
                  physicians={PHYSICIANS}
                  onEscalate={handleEscalate}
                />
              }
            />
            <Route
              path="/"
              element={<Navigate to={`/doctor/${id}/dashboard`} replace />}
            />
          </Routes>
        </div>
      </main>

      {toastMsg && (
        <div style={{ ...d.toast, background: toastMsg.type === "warning" ? C.orange : C.green, color: "#fff" }}>
          <span>{toastMsg.type === "warning" ? "⚠" : "✓"}</span> {toastMsg.msg}
        </div>
      )}
      {selectedPatient && (
        <DocPatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}