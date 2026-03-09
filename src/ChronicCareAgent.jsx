import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const HOSPITALS = [
  { hospital_id: 1, hospital_name: "Kathir Memorial Hospital", city: "Chennai", state: "Tamil Nadu" },
];

const PHYSICIANS = [
  { physician_id: 1, physician_name: "Dr. Priya Sharma", specialty: "Endocrinology", hospital_id: 1 },
  { physician_id: 2, physician_name: "Dr. Arjun Mehta", specialty: "Nephrology", hospital_id: 1 },
  { physician_id: 3, physician_name: "Dr. Kavitha Nair", specialty: "Cardiology", hospital_id: 1 },
];

const PATIENTS = [
  { patient_id: 1, patient_name: "Rajesh Kumar", age: 58, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 9.5, last_date: "2024-07-10", overdue_days: 120, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue" },
  { patient_id: 2, patient_name: "Meena Sundaram", age: 72, gender: "F", diagnosis: "CKD", last_test: "Creatinine", last_value: 3.2, last_date: "2024-06-15", overdue_days: 145, physician_id: 2, preferred_channel: "SMS", has_smartphone: 0, status: "overdue" },
  { patient_id: 3, patient_name: "Suresh Babu", age: 65, gender: "M", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 165, last_date: "2024-08-20", overdue_days: 74, physician_id: 3, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue" },
  { patient_id: 4, patient_name: "Lakshmi Patel", age: 54, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 8.9, last_date: "2024-07-05", overdue_days: 95, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue" },
  { patient_id: 5, patient_name: "Vijay Krishnan", age: 61, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 7.1, last_date: "2024-09-01", overdue_days: 52, physician_id: 1, preferred_channel: "SMS", has_smartphone: 1, status: "pending" },
  { patient_id: 6, patient_name: "Anitha Rajan", age: 68, gender: "F", diagnosis: "CKD", last_test: "Creatinine", last_value: 1.8, last_date: "2024-08-10", overdue_days: 81, physician_id: 2, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue" },
  { patient_id: 7, patient_name: "Mohan Das", age: 77, gender: "M", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 145, last_date: "2024-09-15", overdue_days: 38, physician_id: 3, preferred_channel: "Call", has_smartphone: 0, status: "pending" },
  { patient_id: 8, patient_name: "Saranya Iyer", age: 45, gender: "F", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 11.2, last_date: "2024-06-01", overdue_days: 160, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "escalated" },
  { patient_id: 9, patient_name: "Prakash Nair", age: 70, gender: "M", diagnosis: "CKD", last_test: "Creatinine", last_value: 4.1, last_date: "2024-05-20", overdue_days: 173, physician_id: 2, preferred_channel: "SMS", has_smartphone: 0, status: "escalated" },
  { patient_id: 10, patient_name: "Deepa Venkat", age: 52, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 5.2, last_date: "2024-09-10", overdue_days: 43, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "responded" },
  { patient_id: 11, patient_name: "Ganesh Murthy", age: 63, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 8.8, last_date: "2024-07-25", overdue_days: 105, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue" },
  { patient_id: 12, patient_name: "Revathi Chandran", age: 80, gender: "F", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 178, last_date: "2024-06-30", overdue_days: 130, physician_id: 3, preferred_channel: "Call", has_smartphone: 0, status: "escalated" },
  { patient_id: 13, patient_name: "Senthil Kumar", age: 59, gender: "M", diagnosis: "CKD", last_test: "Creatinine", last_value: 2.4, last_date: "2024-08-05", overdue_days: 86, physician_id: 2, preferred_channel: "SMS", has_smartphone: 1, status: "responded" },
  { patient_id: 14, patient_name: "Usha Balasubramaniam", age: 66, gender: "F", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 6.8, last_date: "2024-09-20", overdue_days: 33, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "closed" },
  { patient_id: 15, patient_name: "Ravi Subramanian", age: 74, gender: "M", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 12.4, last_date: "2024-07-15", overdue_days: 115, physician_id: 1, preferred_channel: "SMS", has_smartphone: 0, status: "overdue" },
];

const CARE_PROTOCOLS = [
  { diagnosis_name: "Diabetes", test_name: "HbA1c", frequency_days: 90, normal_range: "4.0 – 5.6%", critical_threshold: 9.0 },
  { diagnosis_name: "CKD", test_name: "Creatinine", frequency_days: 180, normal_range: "0.7 – 1.3 mg/dL", critical_threshold: 3.0 },
  { diagnosis_name: "Hypertension", test_name: "BP Panel", frequency_days: 60, normal_range: "< 140 mmHg", critical_threshold: 160 },
  { diagnosis_name: "Hypothyroidism", test_name: "TSH", frequency_days: 90, normal_range: "0.4 – 4.0 mIU/L", critical_threshold: 8.0 },
];

const OUTREACH_RESPONSES = [
  { patient_id: 10, type: "agreed", message: "Yes, please book the home collection for this Saturday.", date: "2025-03-07" },
  { patient_id: 13, type: "question", message: "Is it really urgent? I feel fine.", date: "2025-03-06" },
  { patient_id: 5, type: "declined", message: "I'm traveling next month. Will do it later.", date: "2025-03-08" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRiskTier = (p) => {
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  if (!proto) return "low";
  const critical = proto.critical_threshold;
  if (p.overdue_days > 120 || p.last_value >= critical * 1.2) return "critical";
  if (p.overdue_days > 60 || p.last_value >= critical) return "high";
  return "moderate";
};

const getRiskColor = (tier) => ({
  critical: "#ff4d6d",
  high: "#ff9f1c",
  moderate: "#06d6a0",
  low: "#4cc9f0",
}[tier] || "#4cc9f0");

const getStatusBadge = (status) => ({
  overdue: { label: "Overdue", bg: "rgba(255,77,109,0.15)", color: "#ff4d6d" },
  escalated: { label: "Escalated", bg: "rgba(255,77,109,0.25)", color: "#ff4d6d" },
  pending: { label: "Pending", bg: "rgba(255,159,28,0.15)", color: "#ff9f1c" },
  responded: { label: "Responded", bg: "rgba(6,214,160,0.15)", color: "#06d6a0" },
  closed: { label: "Closed", bg: "rgba(76,201,240,0.15)", color: "#4cc9f0" },
}[status] || { label: status, bg: "#222", color: "#aaa" });

const getChannelIcon = (ch) => ({
  WhatsApp: "💬", SMS: "📱", Call: "📞", Email: "✉️"
}[ch] || "📨");

const diagnosisIcon = (d) => ({
  Diabetes: "🩸", CKD: "🫘", Hypertension: "💓", Hypothyroidism: "🦋"
}[d] || "🏥");

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

// ─── Pulse Ring ───────────────────────────────────────────────────────────────
function PulseRing({ color, size = 10 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{
        width: size, height: size, borderRadius: "50%", background: color,
        display: "block", position: "relative", zIndex: 1
      }} />
      <span style={{
        position: "absolute", width: size * 2.5, height: size * 2.5,
        borderRadius: "50%", border: `2px solid ${color}`,
        animation: "pulseRing 2s infinite", opacity: 0.4
      }} />
    </span>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const w = 80, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 0.0001)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.split(" ").at(-1).split(",")[0]}
        cy={pts.split(" ").at(-1).split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ChronicCareAgent() {
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTabChange = (tab) => {
    setAnimIn(false);
    setTimeout(() => { setActiveTab(tab); setAnimIn(true); }, 150);
  };

  const handleSendOutreach = (pid) => {
    setSendingMsg(pid);
    setTimeout(() => {
      setSentMsgs(prev => [...prev, pid]);
      setSendingMsg(null);
      showToast("Outreach message sent successfully!");
    }, 1800);
  };

  const handleEscalate = (p) => {
    const doc = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
    showToast(`Escalated to ${doc?.physician_name || "physician"}`, "warning");
  };

  const filtered = PATIENTS.filter(p => {
    const risk = getRiskTier(p);
    const matchRisk = filterRisk === "all" || risk === filterRisk;
    const matchDiag = filterDiag === "all" || p.diagnosis === filterDiag;
    const matchSearch = p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRisk && matchDiag && matchSearch;
  });

  const critical = PATIENTS.filter(p => getRiskTier(p) === "critical");
  const high = PATIENTS.filter(p => getRiskTier(p) === "high");
  const overdue = PATIENTS.filter(p => p.status === "overdue" || p.status === "escalated");
  const closed = PATIENTS.filter(p => p.status === "closed");
  const escalated = PATIENTS.filter(p => p.status === "escalated");

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "patients", label: "Patients", icon: "◈" },
    { id: "outreach", label: "Outreach", icon: "◎" },
    { id: "gaps", label: "Care Gaps", icon: "▦" },
    { id: "escalations", label: "Escalations", icon: "△" },
  ];

  return (
    <div style={styles.root}>
      <style>{cssVars}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <span style={{ fontSize: 18 }}>✚</span>
          </div>
          <div>
            <div style={styles.logoTitle}>CareAgent</div>
            <div style={styles.logoSub}>Chronic Care AI</div>
          </div>
        </div>

        <div style={styles.hospitalBadge}>
          <div style={{ fontSize: 10, color: "#4cc9f0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Active Hospital</div>
          <div style={{ fontSize: 12, color: "#e0e6f0", fontWeight: 600 }}>Kathir Memorial</div>
          <div style={{ fontSize: 10, color: "#6b7a99" }}>Chennai, Tamil Nadu</div>
        </div>

        <nav style={styles.nav}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => handleTabChange(n.id)}
              style={{ ...styles.navBtn, ...(activeTab === n.id ? styles.navBtnActive : {}) }}>
              <span style={styles.navIcon}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === "escalations" && escalated.length > 0 &&
                <span style={styles.badge}>{escalated.length}</span>}
              {n.id === "patients" && overdue.length > 0 &&
                <span style={{ ...styles.badge, background: "rgba(255,159,28,0.3)", color: "#ff9f1c" }}>{overdue.length}</span>}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PulseRing color="#06d6a0" size={7} />
            <span style={{ fontSize: 10, color: "#06d6a0" }}>System Active</span>
          </div>
          <div style={{ fontSize: 10, color: "#3a4460", marginTop: 4 }}>Last scan: 5 min ago</div>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div>
            <div style={styles.pageTitle}>
              {NAV.find(n => n.id === activeTab)?.label}
            </div>
            <div style={{ fontSize: 11, color: "#3a4a6b" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.searchBox}>
              <span style={{ color: "#3a4a6b", fontSize: 12 }}>⌕</span>
              <input placeholder="Search patients…" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} style={styles.searchInput} />
            </div>
            <div style={styles.avatar}>DR</div>
          </div>
        </header>

        {/* Content */}
        <div style={{ ...styles.content, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)", transition: "all 0.2s ease" }}>
          {activeTab === "dashboard" && <Dashboard patients={PATIENTS} critical={critical} high={high} overdue={overdue} closed={closed} escalated={escalated} protocols={CARE_PROTOCOLS} onNavigate={handleTabChange} />}
          {activeTab === "patients" && <PatientList patients={filtered} filterRisk={filterRisk} setFilterRisk={setFilterRisk} filterDiag={filterDiag} setFilterDiag={setFilterDiag} onSelect={setSelectedPatient} selected={selectedPatient} getRiskTier={getRiskTier} getRiskColor={getRiskColor} getStatusBadge={getStatusBadge} protocols={CARE_PROTOCOLS} physicians={PHYSICIANS} />}
          {activeTab === "outreach" && <Outreach patients={PATIENTS} responses={OUTREACH_RESPONSES} onSend={handleSendOutreach} sentMsgs={sentMsgs} sendingMsg={sendingMsg} getRiskTier={getRiskTier} getRiskColor={getRiskColor} getStatusBadge={getStatusBadge} />}
          {activeTab === "gaps" && <CareGaps patients={PATIENTS} gapsLog={gapsLog} setGapsLog={setGapsLog} showToast={showToast} getRiskTier={getRiskTier} getRiskColor={getRiskColor} protocols={CARE_PROTOCOLS} />}
          {activeTab === "escalations" && <Escalations patients={escalated} physicians={PHYSICIANS} onEscalate={handleEscalate} getRiskTier={getRiskTier} getRiskColor={getRiskColor} />}
        </div>
      </main>

      {/* Toast */}
      {toastMsg && (
        <div style={{ ...styles.toast, background: toastMsg.type === "warning" ? "rgba(255,159,28,0.95)" : "rgba(6,214,160,0.95)" }}>
          <span>{toastMsg.type === "warning" ? "⚠️" : "✓"}</span> {toastMsg.msg}
        </div>
      )}

      {/* Patient Modal */}
      {selectedPatient && (
        <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)}
          protocols={CARE_PROTOCOLS} physicians={PHYSICIANS}
          getRiskTier={getRiskTier} getRiskColor={getRiskColor} getStatusBadge={getStatusBadge} />
      )}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function Dashboard({ patients, critical, high, overdue, closed, escalated, protocols, onNavigate }) {
  const diagBreakdown = ["Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(d => ({
    name: d, count: patients.filter(p => p.diagnosis === d).length,
    overdue: patients.filter(p => p.diagnosis === d && (p.status === "overdue" || p.status === "escalated")).length,
    icon: diagnosisIcon(d),
  }));

  const sparkData = [3, 5, 4, 7, 6, 9, 8, 12, 10, 11, 14, 15];

  return (
    <div style={styles.dashGrid}>
      {/* KPI Cards */}
      {[
        { label: "Overdue Patients", value: overdue.length, sub: "Require immediate outreach", color: "#ff4d6d", spark: [2,3,4,4,5,6,7,8,9,10,11,overdue.length] },
        { label: "Critical Risk", value: critical.length, sub: "Critically abnormal results", color: "#ff9f1c", spark: [1,1,2,2,3,3,4,4,5,5,6,critical.length] },
        { label: "Escalated", value: escalated.length, sub: "Awaiting physician action", color: "#e040fb", spark: [0,1,1,2,2,3,3,3,3,3,3,escalated.length] },
        { label: "Gaps Closed", value: closed.length, sub: "This month", color: "#06d6a0", spark: [0,0,0,1,1,1,1,1,1,1,1,closed.length] },
      ].map((kpi, i) => (
        <div key={i} style={{ ...styles.kpiCard, animationDelay: `${i * 80}ms` }} className="fadeSlide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "#4a5a7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 36, fontFamily: "'DM Mono', monospace", color: kpi.color, lineHeight: 1 }}>
                <Counter target={kpi.value} />
              </div>
              <div style={{ fontSize: 11, color: "#3a4a6b", marginTop: 6 }}>{kpi.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Sparkline data={kpi.spark} color={kpi.color} />
              <div style={{ fontSize: 10, color: kpi.color, marginTop: 4 }}>↑ trend</div>
            </div>
          </div>
          <div style={{ height: 2, background: `linear-gradient(90deg, ${kpi.color}33, ${kpi.color})`, marginTop: 16, borderRadius: 1 }} />
        </div>
      ))}

      {/* Risk Distribution */}
      <div style={{ ...styles.card, gridColumn: "1 / 3" }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Risk Distribution by Diagnosis</span>
          <button onClick={() => onNavigate("patients")} style={styles.cardAction}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
          {diagBreakdown.map((d, i) => (
            <div key={i} style={styles.diagCard}>
              <div style={{ fontSize: 28 }}>{d.icon}</div>
              <div style={{ fontSize: 13, color: "#c8d4f0", fontWeight: 600, marginTop: 8 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "#4a5a7a", marginTop: 2 }}>{d.count} patients</div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#6b7a99" }}>Overdue</span>
                  <span style={{ fontSize: 10, color: "#ff4d6d" }}>{d.overdue}/{d.count}</span>
                </div>
                <div style={{ height: 4, background: "#f2f2f2", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.overdue / d.count) * 100}%`, background: d.overdue / d.count > 0.6 ? "#ff4d6d" : "#ff9f1c", borderRadius: 2, transition: "width 1s ease" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Overview */}
      <div style={{ ...styles.card, gridColumn: "3 / 5" }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Care Protocols</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {protocols.map((p, i) => (
            <div key={i} style={styles.protocolRow}>
              <span style={{ fontSize: 16 }}>{diagnosisIcon(p.diagnosis_name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#c8d4f0" }}>{p.diagnosis_name} — {p.test_name}</div>
                <div style={{ fontSize: 10, color: "#4a5a7a" }}>Normal: {p.normal_range}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#4cc9f0" }}>Every {p.frequency_days}d</div>
                <div style={{ fontSize: 10, color: "#3a4a6b" }}>Critical ≥ {p.critical_threshold}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ ...styles.card, gridColumn: "1 / 5" }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Recent Activity Feed</span>
          <span style={{ fontSize: 10, color: "#3a4a6b" }}>Live</span>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { time: "09:42", msg: "Outreach sent to Rajesh Kumar (Diabetes — HbA1c overdue 120 days)", color: "#ff9f1c", icon: "◎" },
            { time: "09:38", msg: "Saranya Iyer escalated to Dr. Priya Sharma — HbA1c: 11.2%, no response after 2 attempts", color: "#ff4d6d", icon: "△" },
            { time: "09:30", msg: "Deepa Venkat confirmed home sample collection for Saturday", color: "#06d6a0", icon: "✓" },
            { time: "09:15", msg: "Senthil Kumar responded: 'Is it really urgent?' — Contextual reply sent", color: "#4cc9f0", icon: "◈" },
            { time: "08:50", msg: "Daily scan complete — 11 patients overdue identified", color: "#c8d4f0", icon: "⬡" },
          ].map((a, i) => (
            <div key={i} style={styles.activityRow}>
              <span style={{ fontSize: 11, color: "#3a4a6b", minWidth: 38, fontFamily: "'DM Mono', monospace" }}>{a.time}</span>
              <span style={{ color: a.color, fontSize: 12 }}>{a.icon}</span>
              <span style={{ fontSize: 12, color: "#8a9ab8" }}>{a.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Patient List View ────────────────────────────────────────────────────────
function PatientList({ patients, filterRisk, setFilterRisk, filterDiag, setFilterDiag, onSelect, selected, getRiskTier, getRiskColor, getStatusBadge, protocols, physicians }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "critical", "high", "moderate"].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)}
              style={{ ...styles.filterBtn, ...(filterRisk === r ? { background: "rgba(76,201,240,0.15)", color: "#4cc9f0", borderColor: "#4cc9f0" } : {}) }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(d => (
            <button key={d} onClick={() => setFilterDiag(d)}
              style={{ ...styles.filterBtn, ...(filterDiag === d ? { background: "rgba(76,201,240,0.15)", color: "#4cc9f0", borderColor: "#4cc9f0" } : {}) }}>
              {d === "all" ? "All" : diagnosisIcon(d) + " " + d}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#3a4a6b", marginLeft: "auto" }}>{patients.length} patients</span>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Patient", "Diagnosis", "Last Test", "Result", "Overdue", "Risk", "Status", "Channel", ""].map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => {
              const risk = getRiskTier(p);
              const sb = getStatusBadge(p.status);
              const proto = protocols.find(c => c.diagnosis_name === p.diagnosis);
              const isAbnormal = proto && p.last_value >= proto.critical_threshold;
              return (
                <tr key={p.patient_id} onClick={() => onSelect(p)}
                  style={{ ...styles.tr, background: selected?.patient_id === p.patient_id ? "rgba(76,201,240,0.06)" : "transparent", animationDelay: `${i * 30}ms` }}
                  className="fadeSlide">
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ ...styles.avatarSmall, background: `${getRiskColor(risk)}22`, color: getRiskColor(risk) }}>
                        {p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#c8d4f0", fontWeight: 600 }}>{p.patient_name}</div>
                        <div style={{ fontSize: 10, color: "#4a5a7a" }}>{p.age}y · {p.gender === "M" ? "Male" : "Female"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 11 }}>{diagnosisIcon(p.diagnosis)} {p.diagnosis}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontSize: 11, color: "#8a9ab8" }}>{p.last_test}</div>
                    <div style={{ fontSize: 10, color: "#3a4a6b" }}>{p.last_date}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 12, color: isAbnormal ? "#ff4d6d" : "#06d6a0", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
                      {p.last_value}
                    </span>
                    {isAbnormal && <span style={{ fontSize: 9, color: "#ff4d6d", marginLeft: 4 }}>↑ ABNORMAL</span>}
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 12, color: p.overdue_days > 90 ? "#ff4d6d" : "#ff9f1c", fontFamily: "'DM Mono', monospace" }}>
                      {p.overdue_days}d
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <PulseRing color={getRiskColor(risk)} size={6} />
                      <span style={{ fontSize: 11, color: getRiskColor(risk), textTransform: "capitalize" }}>{risk}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: sb.bg, color: sb.color, fontWeight: 600 }}>
                      {sb.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 13 }}>{getChannelIcon(p.preferred_channel)}</span>
                    {!p.has_smartphone && <span style={{ fontSize: 9, color: "#ff9f1c", marginLeft: 4 }}>NOK</span>}
                  </td>
                  <td style={styles.td}>
                    <button onClick={(e) => { e.stopPropagation(); onSelect(p); }} style={styles.viewBtn}>View →</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Outreach View ────────────────────────────────────────────────────────────
function Outreach({ patients, responses, onSend, sentMsgs, sendingMsg, getRiskTier, getRiskColor, getStatusBadge }) {
  const overduePatients = patients.filter(p => p.status === "overdue" || p.status === "escalated" || p.status === "pending");
  const [expanded, setExpanded] = useState(null);

  const generateMessage = (p) => {
    const risk = getRiskTier(p);
    const riskPhrases = { critical: "critically high", high: "above normal", moderate: "borderline" };
    return `Dear ${p.patient_name.split(" ")[0]}, your ${p.last_test} test is now ${p.overdue_days} days overdue. Your last recorded value was ${p.last_value}, which is ${riskPhrases[risk] || "concerning"}. Delaying further monitoring for ${p.diagnosis} can lead to serious complications. We offer a FREE home sample collection — reply YES to book your preferred slot. — Kathir Memorial Care Team`;
  };

  const getResponseForPatient = (pid) => responses.find(r => r.patient_id === pid);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={styles.outreachHeader}>
        <div style={{ fontSize: 12, color: "#4a5a7a" }}>
          <span style={{ color: "#ff9f1c" }}>◉</span> {overduePatients.length} patients awaiting outreach
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={styles.statPill}><span style={{ color: "#06d6a0" }}>✓</span> {sentMsgs.length} sent</div>
          <div style={styles.statPill}><span style={{ color: "#4cc9f0" }}>◈</span> {responses.length} responded</div>
        </div>
      </div>

      {overduePatients.map((p, i) => {
        const risk = getRiskTier(p);
        const rc = getRiskColor(risk);
        const response = getResponseForPatient(p.patient_id);
        const isSent = sentMsgs.includes(p.patient_id);
        const isSending = sendingMsg === p.patient_id;
        const isExpanded = expanded === p.patient_id;

        return (
          <div key={p.patient_id} style={{ ...styles.outreachCard, borderLeft: `3px solid ${rc}`, animationDelay: `${i * 50}ms` }} className="fadeSlide">
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setExpanded(isExpanded ? null : p.patient_id)}>
              <div style={{ ...styles.avatarMed, background: `${rc}22`, color: rc }}>
                {p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#c8d4f0", fontWeight: 600 }}>{p.patient_name}</span>
                  <span style={{ fontSize: 10, color: rc, background: `${rc}18`, padding: "2px 6px", borderRadius: 8, textTransform: "capitalize" }}>{risk}</span>
                  {!p.has_smartphone && <span style={{ fontSize: 9, color: "#ff9f1c", background: "rgba(255,159,28,0.15)", padding: "2px 6px", borderRadius: 8 }}>👨‍👩‍👧 NOK Mode</span>}
                </div>
                <div style={{ fontSize: 11, color: "#4a5a7a", marginTop: 2 }}>
                  {diagnosisIcon(p.diagnosis)} {p.diagnosis} · {p.last_test}: <span style={{ color: "#ff9f1c" }}>{p.last_value}</span> · Overdue: <span style={{ color: "#ff4d6d" }}>{p.overdue_days}d</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {response && (
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: response.type === "agreed" ? "rgba(6,214,160,0.15)" : response.type === "declined" ? "rgba(255,77,109,0.15)" : "rgba(76,201,240,0.15)", color: response.type === "agreed" ? "#06d6a0" : response.type === "declined" ? "#ff4d6d" : "#4cc9f0" }}>
                    {response.type === "agreed" ? "✓ Agreed" : response.type === "declined" ? "✗ Declined" : "? Questioned"}
                  </span>
                )}
                {getChannelIcon(p.preferred_channel)}
                <span style={{ fontSize: 11, color: "#3a4a6b" }}>{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>

            {isExpanded && (
              <div style={styles.outreachExpanded}>
                <div style={styles.messagePreview}>
                  <div style={{ fontSize: 10, color: "#3a4a6b", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Outreach Message Preview</div>
                  <div style={{ fontSize: 11, color: "#8a9ab8", lineHeight: 1.7 }}>{generateMessage(p)}</div>
                </div>

                {response && (
                  <div style={styles.responseBox}>
                    <div style={{ fontSize: 10, color: "#3a4a6b", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>Patient Response · {response.date}</div>
                    <div style={{ fontSize: 12, color: "#c8d4f0", fontStyle: "italic" }}>"{response.message}"</div>
                    {response.type === "agreed" && <div style={{ marginTop: 8, fontSize: 11, color: "#06d6a0" }}>✓ Home collection booked — confirmation sent</div>}
                    {response.type === "declined" && <div style={{ marginTop: 8, fontSize: 11, color: "#ff9f1c" }}>↻ Re-outreach scheduled in 30 days · Physician notified</div>}
                    {response.type === "question" && <div style={{ marginTop: 8, fontSize: 11, color: "#4cc9f0" }}>◈ Contextual reply sent with result-specific explanation</div>}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => onSend(p.patient_id)} disabled={isSent || isSending} style={{ ...styles.sendBtn, opacity: isSent ? 0.5 : 1 }}>
                    {isSending ? <span className="spin" style={{ display: "inline-block" }}>◌</span> : isSent ? "✓ Sent" : `Send via ${p.preferred_channel}`}
                  </button>
                  {!p.has_smartphone && (
                    <button style={styles.nokBtn}>👨‍👩‍👧 Notify Next-of-Kin</button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Care Gaps View ───────────────────────────────────────────────────────────
function CareGaps({ patients, gapsLog, setGapsLog, showToast, getRiskTier, getRiskColor, protocols }) {
  const [closing, setClosing] = useState(null);

  const closeGap = (p) => {
    setClosing(p.patient_id);
    setTimeout(() => {
      setGapsLog(prev => [...prev, {
        id: prev.length + 1, patient: p.patient_name, test: p.last_test,
        closedAt: new Date().toISOString().slice(0, 10), status: "Completed"
      }]);
      setClosing(null);
      showToast(`Care gap closed for ${p.patient_name}`);
    }, 1500);
  };

  const openGaps = patients.filter(p => p.status !== "closed");
  const byDiag = ["Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(d => ({
    d, total: patients.filter(p => p.diagnosis === d).length,
    open: openGaps.filter(p => p.diagnosis === d).length,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {byDiag.map((b, i) => {
          const pct = Math.round((b.open / b.total) * 100);
          return (
            <div key={i} style={styles.gapCard}>
              <div style={{ fontSize: 22 }}>{diagnosisIcon(b.d)}</div>
              <div style={{ fontSize: 12, color: "#c8d4f0", fontWeight: 600, marginTop: 6 }}>{b.d}</div>
              <div style={{ fontSize: 24, color: pct > 60 ? "#ff4d6d" : "#ff9f1c", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{pct}%</div>
              <div style={{ fontSize: 10, color: "#4a5a7a" }}>{b.open}/{b.total} open gaps</div>
              <div style={{ height: 3, background: "#e6e6e6", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct > 60 ? "#ff4d6d" : "#ff9f1c", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Open Gaps */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Open Care Gaps</span>
            <span style={{ fontSize: 10, color: "#ff4d6d" }}>{openGaps.length} pending</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
            {openGaps.slice(0, 10).map((p, i) => {
              const risk = getRiskTier(p);
              const rc = getRiskColor(risk);
              return (
                <div key={p.patient_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#f6f6f6", borderRadius: 8 }}>
                  <PulseRing color={rc} size={7} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#c8d4f0" }}>{p.patient_name}</div>
                    <div style={{ fontSize: 10, color: "#4a5a7a" }}>{p.last_test} · {p.overdue_days}d overdue</div>
                  </div>
                  <button onClick={() => closeGap(p)} disabled={closing === p.patient_id} style={{ ...styles.smallBtn, borderColor: rc, color: rc }}>
                    {closing === p.patient_id ? "…" : "Close"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closed Log */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Gaps Closed Log</span>
            <span style={{ fontSize: 10, color: "#06d6a0" }}>{gapsLog.length} closed</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {gapsLog.map((g, i) => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#0a1a0a22", border: "1px solid rgba(6,214,160,0.15)", borderRadius: 8 }}>
                <span style={{ color: "#06d6a0", fontSize: 14 }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#c8d4f0" }}>{g.patient}</div>
                  <div style={{ fontSize: 10, color: "#4a5a7a" }}>{g.test} · {g.closedAt}</div>
                </div>
                <span style={{ fontSize: 10, color: "#06d6a0", background: "rgba(6,214,160,0.1)", padding: "2px 8px", borderRadius: 8 }}>{g.status}</span>
              </div>
            ))}
            {gapsLog.length === 0 && <div style={{ fontSize: 12, color: "#3a4a6b", textAlign: "center", padding: 20 }}>No gaps closed yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Escalations View ─────────────────────────────────────────────────────────
function Escalations({ patients, physicians, onEscalate, getRiskTier, getRiskColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {patients.length === 0 ? (
        <div style={{ ...styles.card, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32 }}>✓</div>
          <div style={{ fontSize: 14, color: "#4a5a7a", marginTop: 8 }}>No active escalations</div>
        </div>
      ) : patients.map((p, i) => {
        const risk = getRiskTier(p);
        const rc = getRiskColor(risk);
        const doc = physicians.find(ph => ph.physician_id === p.physician_id);
        const attempts = Math.floor(Math.random() * 2) + 2;

        return (
          <div key={p.patient_id} style={{ ...styles.escalationCard, animationDelay: `${i * 60}ms` }} className="fadeSlide">
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ ...styles.avatarMed, background: `${rc}22`, color: rc, fontSize: 14 }}>
                  {p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span style={{ fontSize: 9, color: "#ff4d6d", background: "rgba(255,77,109,0.15)", padding: "2px 6px", borderRadius: 6, textTransform: "uppercase" }}>⚠ Escalated</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, color: "#e0e6f0", fontWeight: 700 }}>{p.patient_name}</div>
                    <div style={{ fontSize: 11, color: "#4a5a7a", marginTop: 2 }}>
                      {diagnosisIcon(p.diagnosis)} {p.diagnosis} · {p.age}y · {p.gender === "M" ? "Male" : "Female"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, color: "#ff4d6d", fontFamily: "'DM Mono', monospace" }}>{p.last_value}</div>
                    <div style={{ fontSize: 10, color: "#3a4a6b" }}>Last {p.last_test} · {p.last_date}</div>
                  </div>
                </div>

                <div style={styles.escalationDetails}>
                  <div style={styles.detailChip}>
                    <span style={{ color: "#ff9f1c" }}>◌</span> {p.overdue_days} days overdue
                  </div>
                  <div style={styles.detailChip}>
                    <span style={{ color: "#ff4d6d" }}>◎</span> {attempts} outreach attempts failed
                  </div>
                  <div style={styles.detailChip}>
                    <span style={{ color: "#4cc9f0" }}>{getChannelIcon(p.preferred_channel)}</span> via {p.preferred_channel}
                  </div>
                  {!p.has_smartphone && <div style={styles.detailChip}>
                    <span>👨‍👩‍👧</span> NOK contact needed
                  </div>}
                </div>

                <div style={styles.escalationAction}>
                  <div style={{ fontSize: 11, color: "#4a5a7a" }}>
                    Assigned to: <span style={{ color: "#4cc9f0" }}>{doc?.physician_name}</span> · {doc?.specialty}
                  </div>
                  <button onClick={() => onEscalate(p)} style={styles.escalateBtn}>
                    Notify Physician →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Patient Modal ────────────────────────────────────────────────────────────
function PatientModal({ patient: p, onClose, protocols, physicians, getRiskTier, getRiskColor, getStatusBadge }) {
  const risk = getRiskTier(p);
  const rc = getRiskColor(risk);
  const sb = getStatusBadge(p.status);
  const doc = physicians.find(ph => ph.physician_id === p.physician_id);
  const proto = protocols.find(c => c.diagnosis_name === p.diagnosis);
  const isAbnormal = proto && p.last_value >= proto.critical_threshold;

  const mockHistory = [
    { date: "2024-01-15", value: p.last_value * 0.85, status: "normal" },
    { date: "2024-04-20", value: p.last_value * 0.92, status: "borderline" },
    { date: p.last_date, value: p.last_value, status: isAbnormal ? "abnormal" : "normal" },
  ];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ ...styles.avatarLg, background: `${rc}22`, color: rc }}>
              {p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 18, color: "#e0e6f0", fontWeight: 700 }}>{p.patient_name}</div>
              <div style={{ fontSize: 11, color: "#4a5a7a", marginTop: 2 }}>{p.age}y · {p.gender === "M" ? "Male" : "Female"} · {diagnosisIcon(p.diagnosis)} {p.diagnosis}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: sb.bg, color: sb.color }}>{sb.label}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: `${rc}18`, color: rc, textTransform: "capitalize" }}>{risk} risk</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Physician", value: doc?.physician_name, sub: doc?.specialty },
            { label: "Contact", value: `${getChannelIcon(p.preferred_channel)} ${p.preferred_channel}`, sub: p.has_smartphone ? "Smartphone" : "NOK required" },
            { label: "Last Test", value: p.last_test, sub: p.last_date },
            { label: "Last Value", value: `${p.last_value}`, sub: isAbnormal ? "⚠ Abnormal" : "Within range", valueColor: isAbnormal ? "#ff4d6d" : "#06d6a0" },
          ].map((f, i) => (
            <div key={i} style={styles.modalField}>
              <div style={{ fontSize: 10, color: "#3a4a6b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: f.valueColor || "#c8d4f0", fontWeight: 600 }}>{f.value}</div>
              <div style={{ fontSize: 10, color: "#4a5a7a" }}>{f.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "#3a4a6b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Test History</div>
          {mockHistory.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 70, fontSize: 10, color: "#4a5a7a", fontFamily: "'DM Mono', monospace" }}>{h.date}</div>
              <div style={{ flex: 1, height: 4, background: "#1a2240", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(h.value / (p.last_value * 1.3)) * 100}%`, background: h.status === "abnormal" ? "#ff4d6d" : h.status === "borderline" ? "#ff9f1c" : "#06d6a0", borderRadius: 2 }} />
              </div>
              <div style={{ width: 40, fontSize: 11, color: h.status === "abnormal" ? "#ff4d6d" : "#8a9ab8", textAlign: "right", fontFamily: "'DM Mono', monospace" }}>{h.value.toFixed(1)}</div>
            </div>
          ))}
        </div>

        {proto && (
          <div style={{ marginTop: 14, padding: 12, background: "#f6f6f6", borderRadius: 10, fontSize: 11, color: "#4a5a7a" }}>
            Protocol: <span style={{ color: "#4cc9f0" }}>{proto.test_name}</span> every <span style={{ color: "#4cc9f0" }}>{proto.frequency_days} days</span> · Normal range: <span style={{ color: "#06d6a0" }}>{proto.normal_range}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const cssVars = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body{
  background:#ffffff;
  font-family:"JetBrains Mono", monospace;
  color:#111111;
}

.fadeSlide{
  animation:fadeSlide .25s ease both;
}

@keyframes fadeSlide{
  from{
    opacity:0;
    transform:translateY(8px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

@keyframes spin{
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}

.spin{
  animation:spin 1s linear infinite;
}

/* scrollbar */

::-webkit-scrollbar{
  width:6px;
}

::-webkit-scrollbar-thumb{
  background:#cccccc;
  border-radius:3px;
}

::-webkit-scrollbar-track{
  background:#f3f3f3;
}
`;

const styles = {
  root:{
  display:"flex",
  height:"100vh",
  background:"#ffffff",
  fontFamily:"JetBrains Mono, monospace",
  color:"#111111",
  overflow:"hidden"
},
  sidebar:{
  width:220,
  background:"#fafafa",
  borderRight:"1px solid #e5e5e5",
  display:"flex",
  flexDirection:"column",
  padding:"20px 0",
  flexShrink:0
},
  logo: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 20px 20px", borderBottom: "1px solid #0e1a35",
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg, #0a3d6b, #4cc9f0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
  },
  logoTitle: { fontSize: 14, fontWeight: 700, color: "#e0e6f0" },
  logoSub: { fontSize: 9, color: "#2a3a5a", letterSpacing: 1 },
  hospitalBadge: {
    margin: "14px 14px 6px", padding: "10px 12px",
    background: "#ffffff", borderRadius: 10,
    border: "1px solid #0e1a35",
  },
  nav: { padding: "8px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  navBtn:{
  display:"flex",
  alignItems:"center",
  gap:10,
  padding:"10px 14px",
  borderRadius:8,
  border:"none",
  background:"transparent",
  color:"#444444",
  cursor:"pointer",
  fontSize:13,
  textAlign:"left"
},
  navBtnActive:{
  background:"#f3f3f3",
  color:"#000000"
},
  navIcon: { fontSize: 14, width: 16, textAlign: "center" },
  badge: {
    marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px",
    borderRadius: 8, background: "rgba(255,77,109,0.25)", color: "#ff4d6d",
  },
  sidebarFooter: {
    padding: "14px 20px", borderTop: "1px solid #0e1a35",
  },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar:{
  padding:"14px 24px",
  borderBottom:"1px solid #e5e5e5",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  background:"#ffffff"
},
  pageTitle: { fontSize: 16, fontWeight: 700, color: "#e0e6f0" },
  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  searchBox:{
  display:"flex",
  alignItems:"center",
  gap:8,
  padding:"8px 12px",
  background:"#fafafa",
  border:"1px solid #e5e5e5",
  borderRadius:8
},
  searchInput: {
    background: "transparent", border: "none", outline: "none",
    color: "#c8d4f0", fontSize: 12, width: 160,
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #0a3d6b, #4cc9f0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 700, color: "#fff",
  },
  content: {
    flex: 1, overflowY: "auto", padding: 24,
  },
  dashGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14,
  },
  kpiCard:{
  background:"#ffffff",
  border:"1px solid #e5e5e5",
  borderRadius:10,
  padding:18
},
  card:{
  background:"#ffffff",
  border:"1px solid #e5e5e5",
  borderRadius:10,
  padding:18
},
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  cardTitle: { fontSize: 11, color: "#4a5a7a", letterSpacing: 1, textTransform: "uppercase" },
  cardAction: {
    fontSize: 10, color: "#4cc9f0", background: "transparent", border: "none",
    cursor: "pointer",
  },
  diagCard: {
    background: "#f2f2f2", borderRadius: 12, padding: "14px 12px",
    border: "1px solid #0e1a35", textAlign: "center",
  },
  protocolRow: {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
    background: "#f2f2f2", borderRadius: 10,
  },
  activityRow: {
    display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
    borderBottom: "1px solid #0e1a35",
  },
  filterBar: {
    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    padding: "10px 14px", background: "#f2f2f2", borderRadius: 12,
    border: "1px solid #0e1a35",
  },
  filterBtn: {
    fontSize: 10, padding: "5px 10px", borderRadius: 8,
    border: "1px solid #0e1a35", background: "transparent",
    color: "#4a5a7a", cursor: "pointer", transition: "all 0.15s",
  },
 tableWrap:{
  background:"#ffffff",
  border:"1px solid #e5e5e5",
  borderRadius:10,
  overflow:"hidden"
},
  th:{
  padding:"12px 14px",
  textAlign:"left",
  fontSize:11,
  color:"#666666",
  borderBottom:"1px solid #e5e5e5",
  background:"#fafafa"
},
  tr:{
  borderBottom:"1px solid #f0f0f0",
  cursor:"pointer"
},
  td:{
  padding:"12px 14px",
  fontSize:12,
  color:"#111111"
},
  avatarMed: {
    width: 38, height: 38, borderRadius: 10, fontSize: 12, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  avatarLg: {
    width: 50, height: 50, borderRadius: 14, fontSize: 16, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  viewBtn: {
    fontSize: 10, color: "#4cc9f0", background: "transparent",
    border: "1px solid #0e1a35", borderRadius: 6, padding: "4px 8px", cursor: "pointer",
  },
  outreachHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", background: "#e0e0e0", borderRadius: 12,
    border: "1px solid #0e1a35",
  },
  statPill: {
    fontSize: 11, color: "#4a5a7a", padding: "4px 10px",
    background: "#f2f2f2", borderRadius: 8, display: "flex", gap: 5, alignItems: "center",
  },
  outreachCard: {
    background: "#f2f2f2", border: "1px solid #0e1a35", borderRadius: 14, padding: 16,
    transition: "border-color 0.2s",
  },
  outreachExpanded: {
    marginTop: 14, paddingTop: 14, borderTop: "1px solid #0e1a35",
  },
  messagePreview: {
    background: "#f2f2f2", borderRadius: 10, padding: 12,
    border: "1px solid #0e1a35",
  },
  responseBox: {
    background: "rgba(250, 251, 251, 0.76)", border: "1px solid rgba(76,201,240,0.12)",
    borderRadius: 10, padding: 12, marginTop: 10,
  },
  sendBtn: {
    background: "linear-gradient(135deg, #0a3d6b, #1a6ba0)", border: "none",
    color: "#4cc9f0", padding: "8px 18px", borderRadius: 9, cursor: "pointer",
    fontSize: 11, fontWeight: 600, transition: "opacity 0.2s",
  },
  nokBtn: {
    background: "rgba(255,159,28,0.1)", border: "1px solid rgba(255,159,28,0.3)",
    color: "#ff9f1c", padding: "8px 14px", borderRadius: 9, cursor: "pointer", fontSize: 11,
  },
  gapCard: {
    background: "#f2f2f2", border: "1px solid #0e1a35", borderRadius: 14,
    padding: "16px 14px", textAlign: "center",
  },
  smallBtn: {
    fontSize: 10, padding: "4px 10px", borderRadius: 7, background: "transparent",
    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
  },
  escalationCard: {
    background: "#f2f2f2", border: "1px solid rgba(255,77,109,0.2)", borderRadius: 14,
    padding: 18,
  },
  escalationDetails: {
    display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10,
  },
  detailChip: {
    fontSize: 10, padding: "3px 10px", borderRadius: 8,
    background: "#f2f2f2", color: "#4a5a7a", display: "flex", gap: 5, alignItems: "center",
  },
  escalationAction: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 12, paddingTop: 12, borderTop: "1px solid #0e1a35",
  },
  escalateBtn: {
    background: "linear-gradient(135deg, #4d0020, #991040)", border: "none",
    color: "#ff4d6d", padding: "8px 16px", borderRadius: 9, cursor: "pointer",
    fontSize: 11, fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(249, 244, 244, 0.7)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal:{
  background:"#ffffff",
  border:"1px solid #e5e5e5",
  borderRadius:12,
  padding:24,
  width:500,
  maxWidth:"95vw",
  maxHeight:"90vh",
  overflowY:"auto"
},
  modalField: {
    background: "#e7e9f0", borderRadius: 10, padding: "10px 14px",
    border: "1px solid #0e1a35",
  },
  closeBtn: {
    background: "#eaeaea", border: "1px solid #0e1a35", color: "#3a4a6b",
    width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 12,
  },
  toast: {
    position: "fixed", bottom: 24, right: 24, padding: "12px 20px",
    borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#fff",
    zIndex: 200, display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    animation: "fadeSlide 0.3s ease",
  },
};
