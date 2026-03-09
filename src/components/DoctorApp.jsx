import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from "react-router-dom";
import { C, h } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx'
import { PHYSICIANS, PATIENTS, CARE_PROTOCOLS, OUTREACH_RESPONSES, getRiskTier } from "../CareAgent_Combined.jsx";
import PulseRing from './PulseRing.jsx'
import DocDashboard from './DocDashboard.jsx'
import DocPatients from './DocPatients.jsx'
import DocOutreach from './DocOutreach.jsx'
import DocCareGaps from './DocCareGaps.jsx'
import DocEscalations from './DocEscalations.jsx'
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
      <div style={d.appContainer}>
        {/* Sidebar */}
        <aside style={d.sidebar}>
          <div style={d.logo}>
            <div style={d.logoMark}><span style={{ fontSize: 20, color: "#fff" }}>✿</span></div>
            <div>
              <div style={d.logoTitle}>Manabu</div>
              <div style={d.logoSub}>CareAgent Dash</div>
            </div>
          </div>
          <div style={d.hospitalBadge}>
            <div style={{ fontSize: 11, color: C.btnDark, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>Active Hospital</div>
            <div style={{ fontSize: 14, color: C.textTitle, fontWeight: 700 }}>Kathir Memorial</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Chennai, Tamil Nadu</div>
          </div>
          {doctor && (
            <div style={{ margin: "0 20px 16px", padding: "12px 16px", background: "rgba(93, 95, 239, 0.05)", borderRadius: 16 }}>
              <div style={{ fontSize: 10, color: C.btnDark, letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>LOGGED IN AS</div>
              <div style={{ fontSize: 14, color: C.textTitle, fontWeight: 800 }}>{doctor.physician_name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{doctor.specialty}</div>
            </div>
          )}
          <nav style={d.nav}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => handleTabChange(n.id)} style={{ ...d.navBtn, ...(activeTab === n.id ? d.navActive : {}) }}>
                <span style={d.navIcon}>{n.icon}</span>
                <span>{n.label}</span>
                {n.id === "escalations" && escalated.length > 0 && <span style={d.badge}>{escalated.length}</span>}
                {n.id === "patients" && overdue.length > 0 && <span style={{ ...d.badge, background: "rgba(255, 107, 107, 0.1)", color: C.red }}>{overdue.length}</span>}
              </button>
            ))}
          </nav>
          <div style={d.sidebarFooter}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PulseRing color="#2ecc71" size={7} />
              <span style={{ fontSize: 12, color: "#2ecc71", fontWeight: 700 }}>System Active</span>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, fontWeight: 600 }}>Last scan: 5 min ago</div>
            <button onClick={onLogout} style={d.logoutBtn}>Log out</button>
          </div>
        </aside>

        {/* Main */}
        <main style={d.main}>
          <header style={d.topbar}>
            <div>
              <div style={d.pageTitle}>{NAV.find(n => n.id === activeTab)?.label}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4, fontWeight: 500 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
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
            <Route path="outreach" element={<DocOutreach patients={myPatients} responses={OUTREACH_RESPONSES} onSend={handleSend} sentMsgs={sentMsgs} sendingMsg={sendingMsg} />} />
            <Route path="gaps" element={<DocCareGaps patients={myPatients} gapsLog={gapsLog} setGapsLog={setGapsLog} showToast={showToast} />} />
            <Route path="escalations" element={<DocEscalations patients={escalated} physicians={PHYSICIANS} onEscalate={handleEscalate} />} />
            <Route path="/" element={<Navigate to={`/doctor/${id}/dashboard`} replace />} />
          </Routes>
        </div>
        </main>
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