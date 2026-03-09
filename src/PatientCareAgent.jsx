import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PATIENTS = [
  { patient_id: 1,  patient_name: "Rajesh Kumar",           age: 58, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",    last_value: 9.5,  last_date: "2024-07-10", overdue_days: 120, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 98401 23456", email: "rajesh.k@email.com",    address: "14, Anna Nagar, Chennai",       registered_date: "2021-03-12", doctor_remarks: "HbA1c critically elevated. Increase Metformin dosage and restrict carbohydrate intake. Urgent follow-up required within 2 weeks." },
  { patient_id: 2,  patient_name: "Meena Sundaram",         age: 72, gender: "F", diagnosis: "CKD",             last_test: "Creatinine",last_value: 3.2,  last_date: "2024-06-15", overdue_days: 145, physician_id: 2, preferred_channel: "SMS",      has_smartphone: 0, status: "overdue",   phone: "+91 94401 78901", email: "meena.s@email.com",     address: "7, T Nagar, Chennai",           registered_date: "2020-08-05", doctor_remarks: "Creatinine levels indicate Stage 3 CKD. Avoid NSAIDs. Restrict protein intake. Nephrology consult scheduled." },
  { patient_id: 3,  patient_name: "Suresh Babu",            age: 65, gender: "M", diagnosis: "Hypertension",   last_test: "BP Panel",  last_value: 165,  last_date: "2024-08-20", overdue_days: 74,  physician_id: 3, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 99401 34567", email: "suresh.b@email.com",    address: "22, Adyar, Chennai",            registered_date: "2022-01-18", doctor_remarks: "BP remains uncontrolled. Amlodipine dose reviewed. Salt restriction and daily walking strictly advised." },
  { patient_id: 4,  patient_name: "Lakshmi Patel",          age: 54, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH",       last_value: 8.9,  last_date: "2024-07-05", overdue_days: 95,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 93401 56789", email: "lakshmi.p@email.com",   address: "5, Velachery, Chennai",         registered_date: "2021-11-30", doctor_remarks: "TSH elevated above threshold. Levothyroxine dose to be adjusted. Avoid soy products and excess fiber near medication time." },
  { patient_id: 5,  patient_name: "Vijay Krishnan",         age: 61, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",    last_value: 7.1,  last_date: "2024-09-01", overdue_days: 52,  physician_id: 1, preferred_channel: "SMS",      has_smartphone: 1, status: "pending",   phone: "+91 91401 90123", email: "vijay.k@email.com",     address: "9, Porur, Chennai",             registered_date: "2022-06-14", doctor_remarks: "HbA1c borderline. Continue current medication and monitor diet. Schedule next test before end of month." },
  { patient_id: 6,  patient_name: "Anitha Rajan",           age: 68, gender: "F", diagnosis: "CKD",             last_test: "Creatinine",last_value: 1.8,  last_date: "2024-08-10", overdue_days: 81,  physician_id: 2, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 98001 45678", email: "anitha.r@email.com",    address: "33, Mylapore, Chennai",         registered_date: "2020-05-22", doctor_remarks: "Early CKD — creatinine rising trend. Hydration is key. Avoid contrast dyes. Annual kidney ultrasound due." },
  { patient_id: 7,  patient_name: "Mohan Das",              age: 77, gender: "M", diagnosis: "Hypertension",   last_test: "BP Panel",  last_value: 145,  last_date: "2024-09-15", overdue_days: 38,  physician_id: 3, preferred_channel: "Call",     has_smartphone: 0, status: "pending",   phone: "+91 97001 67890", email: "mohan.d@email.com",     address: "11, Tambaram, Chennai",         registered_date: "2019-09-08", doctor_remarks: "BP marginally elevated. Continue Telmisartan. Morning BP readings to be logged and shared at next visit." },
  { patient_id: 8,  patient_name: "Saranya Iyer",           age: 45, gender: "F", diagnosis: "Diabetes",       last_test: "HbA1c",    last_value: 11.2, last_date: "2024-06-01", overdue_days: 160, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "escalated", phone: "+91 96001 89012", email: "saranya.i@email.com",   address: "18, Guindy, Chennai",           registered_date: "2021-07-03", doctor_remarks: "URGENT: HbA1c at 11.2% is dangerously high. Risk of diabetic ketoacidosis. Insulin therapy initiated. Report any dizziness or vomiting immediately." },
  { patient_id: 9,  patient_name: "Prakash Nair",           age: 70, gender: "M", diagnosis: "CKD",             last_test: "Creatinine",last_value: 4.1,  last_date: "2024-05-20", overdue_days: 173, physician_id: 2, preferred_channel: "SMS",      has_smartphone: 0, status: "escalated", phone: "+91 95001 01234", email: "prakash.n@email.com",   address: "2, Perambur, Chennai",          registered_date: "2018-12-15", doctor_remarks: "URGENT: Creatinine 4.1 mg/dL — Stage 4 CKD. Dialysis evaluation scheduled. Strict fluid and potassium restriction. Do not miss next appointment." },
  { patient_id: 10, patient_name: "Deepa Venkat",           age: 52, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH",       last_value: 5.2,  last_date: "2024-09-10", overdue_days: 43,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "responded", phone: "+91 94001 23456", email: "deepa.v@email.com",     address: "6, Nungambakkam, Chennai",      registered_date: "2022-04-19", doctor_remarks: "TSH slightly above range. Minor Levothyroxine adjustment made. Repeat test in 6 weeks. Home collection confirmed." },
  { patient_id: 11, patient_name: "Ganesh Murthy",          age: 63, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",    last_value: 8.8,  last_date: "2024-07-25", overdue_days: 105, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 93001 45678", email: "ganesh.m@email.com",    address: "44, Kodambakkam, Chennai",      registered_date: "2020-10-27", doctor_remarks: "HbA1c 8.8% — poorly controlled. Review carbohydrate intake. Consider adding DPP-4 inhibitor. Weight loss of 3–5kg recommended." },
  { patient_id: 12, patient_name: "Revathi Chandran",       age: 80, gender: "F", diagnosis: "Hypertension",   last_test: "BP Panel",  last_value: 178,  last_date: "2024-06-30", overdue_days: 130, physician_id: 3, preferred_channel: "Call",     has_smartphone: 0, status: "escalated", phone: "+91 92001 67890", email: "revathi.c@email.com",   address: "3, Chromepet, Chennai",         registered_date: "2017-06-11", doctor_remarks: "URGENT: BP 178 mmHg is hypertensive crisis level. Immediate medication review done. Family to monitor daily. Avoid exertion." },
  { patient_id: 13, patient_name: "Senthil Kumar",          age: 59, gender: "M", diagnosis: "CKD",             last_test: "Creatinine",last_value: 2.4,  last_date: "2024-08-05", overdue_days: 86,  physician_id: 2, preferred_channel: "SMS",      has_smartphone: 1, status: "responded", phone: "+91 91001 89012", email: "senthil.k@email.com",   address: "7, Sholinganallur, Chennai",    registered_date: "2021-02-09", doctor_remarks: "Creatinine slowly rising. Maintain low-protein diet. Avoid dehydration. Annual eGFR measurement scheduled." },
  { patient_id: 14, patient_name: "Usha Balasubramaniam",   age: 66, gender: "F", diagnosis: "Diabetes",       last_test: "HbA1c",    last_value: 6.8,  last_date: "2024-09-20", overdue_days: 33,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "closed",    phone: "+91 90001 01234", email: "usha.b@email.com",      address: "29, Besant Nagar, Chennai",     registered_date: "2022-08-16", doctor_remarks: "HbA1c well managed at 6.8%. Excellent compliance. Continue current regimen. Next review in 3 months." },
  { patient_id: 15, patient_name: "Ravi Subramanian",       age: 74, gender: "M", diagnosis: "Hypothyroidism", last_test: "TSH",       last_value: 12.4, last_date: "2024-07-15", overdue_days: 115, physician_id: 1, preferred_channel: "SMS",      has_smartphone: 0, status: "overdue",   phone: "+91 89001 23456", email: "ravi.s@email.com",      address: "15, Royapuram, Chennai",        registered_date: "2019-04-23", doctor_remarks: "TSH 12.4 — severely hypothyroid. Levothyroxine dose doubled. Monitor for cardiac symptoms. Family member to supervise medication." },
];

const PHYSICIANS = [
  { physician_id: 1, physician_name: "Dr. Priya Sharma",  specialty: "Endocrinology", phone: "+91 044-2345-6789", hospital: "Kathir Memorial Hospital" },
  { physician_id: 2, physician_name: "Dr. Arjun Mehta",   specialty: "Nephrology",    phone: "+91 044-2345-6790", hospital: "Kathir Memorial Hospital" },
  { physician_id: 3, physician_name: "Dr. Kavitha Nair",  specialty: "Cardiology",    phone: "+91 044-2345-6791", hospital: "Kathir Memorial Hospital" },
];

const CARE_PROTOCOLS = [
  { diagnosis_name: "Diabetes",       test_name: "HbA1c",     frequency_days: 90,  normal_range: "4.0–5.6%",       unit: "%",     critical_threshold: 9.0  },
  { diagnosis_name: "CKD",            test_name: "Creatinine",frequency_days: 180, normal_range: "0.7–1.3 mg/dL",  unit: "mg/dL", critical_threshold: 3.0  },
  { diagnosis_name: "Hypertension",   test_name: "BP Panel",  frequency_days: 60,  normal_range: "< 140 mmHg",     unit: "mmHg",  critical_threshold: 160  },
  { diagnosis_name: "Hypothyroidism", test_name: "TSH",       frequency_days: 90,  normal_range: "0.4–4.0 mIU/L",  unit: "mIU/L", critical_threshold: 8.0  },
];

const TEST_HISTORY = {
  1:  [{ date:"2023-04-12",value:7.4 },{ date:"2023-07-18",value:7.9 },{ date:"2023-10-22",value:8.4 },{ date:"2024-01-18",value:8.7 },{ date:"2024-04-22",value:9.0 },{ date:"2024-07-10",value:9.5 }],
  2:  [{ date:"2023-06-05",value:1.6 },{ date:"2023-09-11",value:1.9 },{ date:"2023-12-08",value:2.2 },{ date:"2024-03-20",value:2.9 },{ date:"2024-06-15",value:3.2 }],
  3:  [{ date:"2023-08-10",value:136 },{ date:"2023-11-15",value:141 },{ date:"2024-01-10",value:148 },{ date:"2024-04-15",value:155 },{ date:"2024-06-30",value:158 },{ date:"2024-08-20",value:165 }],
  4:  [{ date:"2023-07-01",value:4.8 },{ date:"2023-10-14",value:6.2 },{ date:"2024-01-20",value:7.4 },{ date:"2024-04-09",value:8.1 },{ date:"2024-07-05",value:8.9 }],
  5:  [{ date:"2023-09-05",value:6.2 },{ date:"2023-12-12",value:6.5 },{ date:"2024-03-18",value:6.8 },{ date:"2024-06-22",value:7.0 },{ date:"2024-09-01",value:7.1 }],
  6:  [{ date:"2023-08-20",value:1.1 },{ date:"2023-11-30",value:1.3 },{ date:"2024-02-14",value:1.5 },{ date:"2024-05-14",value:1.7 },{ date:"2024-08-10",value:1.8 }],
  7:  [{ date:"2024-01-05",value:138 },{ date:"2024-04-20",value:141 },{ date:"2024-07-11",value:143 },{ date:"2024-09-15",value:145 }],
  8:  [{ date:"2023-06-14",value:8.2 },{ date:"2023-09-29",value:9.1 },{ date:"2023-12-07",value:9.9 },{ date:"2024-03-07",value:10.6 },{ date:"2024-06-01",value:11.2 }],
  9:  [{ date:"2023-05-18",value:2.2 },{ date:"2023-08-04",value:2.8 },{ date:"2023-11-22",value:3.3 },{ date:"2024-02-22",value:3.7 },{ date:"2024-05-20",value:4.1 }],
  10: [{ date:"2023-09-18",value:3.8 },{ date:"2023-12-25",value:4.1 },{ date:"2024-03-30",value:4.7 },{ date:"2024-06-30",value:5.0 },{ date:"2024-09-10",value:5.2 }],
  11: [{ date:"2023-07-05",value:7.2 },{ date:"2023-10-14",value:7.7 },{ date:"2024-01-28",value:8.2 },{ date:"2024-04-28",value:8.5 },{ date:"2024-07-25",value:8.8 }],
  12: [{ date:"2023-06-22",value:148 },{ date:"2023-09-08",value:155 },{ date:"2024-01-08",value:162 },{ date:"2024-03-31",value:170 },{ date:"2024-06-30",value:178 }],
  13: [{ date:"2023-08-11",value:1.4 },{ date:"2023-11-18",value:1.7 },{ date:"2024-02-07",value:1.9 },{ date:"2024-05-18",value:2.1 },{ date:"2024-08-05",value:2.4 }],
  14: [{ date:"2023-09-01",value:7.8 },{ date:"2023-12-10",value:7.4 },{ date:"2024-03-15",value:7.1 },{ date:"2024-06-25",value:7.0 },{ date:"2024-09-20",value:6.8 }],
  15: [{ date:"2023-07-28",value:6.8 },{ date:"2023-10-22",value:8.9 },{ date:"2024-01-16",value:10.6 },{ date:"2024-04-16",value:11.8 },{ date:"2024-07-15",value:12.4 }],
};

const OUTREACH_MSGS = {
  1:  [{ date:"2025-02-10", msg:"Your HbA1c is 120 days overdue. Last value 9.5% was critically high. Please book a home collection immediately.", type:"urgent" },
       { date:"2025-01-12", msg:"Reminder: HbA1c test is due. Please schedule at your earliest convenience.", type:"reminder" }],
  8:  [{ date:"2025-03-01", msg:"URGENT: Your HbA1c of 11.2% indicates dangerously uncontrolled diabetes. Dr. Priya Sharma has been alerted. Please call the hospital today.", type:"urgent" },
       { date:"2025-02-01", msg:"Your HbA1c test is overdue by 130 days. Please respond to schedule a home collection.", type:"urgent" }],
  9:  [{ date:"2025-03-02", msg:"ESCALATED: Creatinine 4.1 mg/dL with 173 days overdue. Dr. Arjun Mehta requires you to attend in-person immediately.", type:"urgent" }],
  10: [{ date:"2025-03-07", msg:"Your home sample collection has been confirmed for Saturday. Our technician will arrive between 8–10 AM.", type:"info" },
      { date:"2025-02-25", msg:"TSH test is 43 days overdue. Would you like to book a home collection? Reply YES to confirm.", type:"reminder" }],
  13: [{ date:"2025-03-06", msg:"We received your query 'Is it really urgent?'. Yes — your Creatinine trend is rising. Early intervention prevents dialysis. Please book today.", type:"response" }],
};

const APPOINTMENTS = {
  1:  [{ date:"2024-07-10", type:"Test + Consultation", doc:"Dr. Priya Sharma", result:"HbA1c: 9.5%" },
       { date:"2024-04-22", type:"Test + Consultation", doc:"Dr. Priya Sharma", result:"HbA1c: 9.0%" },
       { date:"2024-01-18", type:"Routine Test",        doc:"Dr. Priya Sharma", result:"HbA1c: 8.7%" }],
  2:  [{ date:"2024-06-15", type:"Nephrology Review",   doc:"Dr. Arjun Mehta",  result:"Creatinine: 3.2 mg/dL" },
       { date:"2024-03-20", type:"Routine Test",        doc:"Dr. Arjun Mehta",  result:"Creatinine: 2.9 mg/dL" }],
  8:  [{ date:"2024-06-01", type:"Emergency Review",    doc:"Dr. Priya Sharma", result:"HbA1c: 11.2% — Insulin started" },
       { date:"2024-03-07", type:"Routine Test",        doc:"Dr. Priya Sharma", result:"HbA1c: 10.6%" }],
  14: [{ date:"2024-09-20", type:"Routine Test",        doc:"Dr. Priya Sharma", result:"HbA1c: 6.8% — Well controlled" },
       { date:"2024-06-25", type:"Routine Test",        doc:"Dr. Priya Sharma", result:"HbA1c: 7.0%" }],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRisk = (p) => {
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  if (!proto) return "low";
  if (p.overdue_days > 120 || p.last_value >= proto.critical_threshold * 1.2) return "critical";
  if (p.overdue_days > 60  || p.last_value >= proto.critical_threshold)        return "high";
  return "moderate";
};
const STATUS_MAP = {
  overdue:   "OVERDUE",
  escalated: "ESCALATED",
  pending:   "PENDING",
  responded: "RESPONDED",
  closed:    "UP TO DATE",
};
const DIAG_ABBR = { Diabetes:"DM", CKD:"CKD", Hypertension:"HTN", Hypothyroidism:"HYPO" };

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function PatientCareAgent() {
  const [screen, setScreen]   = useState("login");   // login | portal
  const [patientId, setPid]   = useState(null);
  const patient = PATIENTS.find(p => p.patient_id === patientId);

  if (screen === "portal" && patient)
    return <Portal patient={patient} onLogout={() => { setScreen("login"); setPid(null); }} />;

  return <Login onLogin={(id) => { setPid(id); setScreen("portal"); }} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function Login({ onLogin }) {
  const [query, setQuery]     = useState("");
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = query.length > 1
    ? PATIENTS.filter(p =>
        p.patient_name.toLowerCase().includes(query.toLowerCase()) ||
        String(p.patient_id).includes(query))
    : [];

  return (
    <div style={s.loginRoot}>
      <style>{CSS}</style>
      {/* grid bg */}
      <div style={s.loginGrid} />

      <div style={s.loginCard}>
        {/* Header */}
        <div style={s.loginTop}>
          <div style={s.loginLogo}>
            <span style={s.loginPlus}>+</span>
            <div>
              <div style={s.loginBrand}>CareAgent</div>
              <div style={s.loginHosp}>Kathir Memorial Hospital, Chennai</div>
            </div>
          </div>
          <div style={s.loginRule} />
          <div style={s.loginTitle}>Patient Portal</div>
          <div style={s.loginSub}>Enter your name or patient ID to access your health records.</div>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <div style={{ ...s.loginField, borderColor: focused ? "#111" : "#ddd" }}>
            <span style={s.loginFieldLabel}>PATIENT SEARCH</span>
            <input
              autoFocus
              placeholder="Type your name or ID…"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              style={s.loginInput}
            />
          </div>

          {filtered.length > 0 && (
            <div style={s.dropdown}>
              {filtered.slice(0, 6).map(p => {
                const risk = getRisk(p);
                return (
                  <button key={p.patient_id}
                    onMouseDown={() => setSelected(p)}
                    style={{ ...s.dropItem, background: selected?.patient_id === p.patient_id ? "#f5f5f5" : "#fff" }}>
                    <div style={s.dropName}>{p.patient_name}</div>
                    <div style={s.dropMeta}>
                      ID {String(p.patient_id).padStart(4,"0")} · {DIAG_ABBR[p.diagnosis]} · {p.age}y
                    </div>
                    <span style={{ ...s.dropStatus,
                      borderColor: p.status === "escalated" ? "#111" : "#bbb",
                      color:       p.status === "escalated" ? "#111" : "#888" }}>
                      {STATUS_MAP[p.status]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selected && (
          <div style={s.selectedBox} className="fadeSlide">
            <div style={s.selectedLabel}>SELECTED PATIENT</div>
            <div style={s.selectedName}>{selected.patient_name}</div>
            <div style={s.selectedMeta}>
              Patient #{String(selected.patient_id).padStart(4,"0")} · {selected.diagnosis} · {selected.age} yrs
            </div>
            <button onClick={() => onLogin(selected.patient_id)} style={s.loginBtn}>
              Access My Records →
            </button>
          </div>
        )}

        {/* Demo quick access */}
        <div style={s.demoWrap}>
          <div style={s.demoLabel}>— QUICK ACCESS —</div>
          <div style={s.demoRow}>
            {[8, 14, 1, 10].map(id => {
              const p = PATIENTS.find(x => x.patient_id === id);
              return (
                <button key={id} onClick={() => onLogin(id)} style={s.demoBtn}>
                  <div style={s.demoBtnName}>{p.patient_name.split(" ")[0]}</div>
                  <div style={s.demoBtnDiag}>{DIAG_ABBR[p.diagnosis]}</div>
                  <div style={{ ...s.demoBtnStatus,
                    fontWeight: p.status === "escalated" ? 700 : 400 }}>
                    {STATUS_MAP[p.status]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function Portal({ patient: p, onLogout }) {
  const [tab, setTab] = useState("overview");
  const risk    = getRisk(p);
  const proto   = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  const doc     = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
  const msgs    = OUTREACH_MSGS[p.patient_id] || [];
  const appts   = APPOINTMENTS[p.patient_id]  || [];
  const hist    = TEST_HISTORY[p.patient_id]  || [];
  const isUrgent = p.status === "escalated";
  const isOverdue = p.overdue_days > 0 && p.status !== "closed";

  const TABS = [
    { id: "overview",     label: "Overview"      },
    { id: "tests",        label: "Test History"  },
    { id: "appointments", label: "Appointments"  },
    { id: "messages",     label: `Messages${msgs.length ? ` (${msgs.length})` : ""}` },
    { id: "profile",      label: "My Profile"    },
  ];

  return (
    <div style={s.portalRoot}>
      <style>{CSS}</style>

      {/* ── Top Bar ── */}
      <header style={s.topbar}>
        <div style={s.topLeft}>
          <span style={s.topPlus}>+</span>
          <div>
            <span style={s.topBrand}>CareAgent</span>
            <span style={s.topSep}>/</span>
            <span style={s.topPortal}>Patient Portal</span>
          </div>
        </div>
        <div style={s.topRight}>
          <div style={s.topPatient}>
            <div style={s.topPatientName}>{p.patient_name}</div>
            <div style={s.topPatientMeta}>#{String(p.patient_id).padStart(4,"0")} · {p.diagnosis}</div>
          </div>
          <div style={{ ...s.topStatusPill,
            borderColor: isUrgent ? "#111" : isOverdue ? "#555" : "#bbb",
            color:       isUrgent ? "#111" : isOverdue ? "#555" : "#888",
            fontWeight:  isUrgent ? 700 : 400 }}>
            {STATUS_MAP[p.status]}
          </div>
          <button onClick={onLogout} style={s.logoutBtn}>Sign Out</button>
        </div>
      </header>

      {/* ── Urgent Banner ── */}
      {isUrgent && (
        <div style={s.urgentBanner} className="fadeSlide">
          <span style={s.urgentMark}>!</span>
          <span style={s.urgentText}>
            Action required — Your {p.last_test} result of <strong>{p.last_value} {proto?.unit}</strong> is
            critically above the safe range. Contact {doc?.physician_name} immediately.
          </span>
          <span style={s.urgentPhone}>{doc?.phone}</span>
        </div>
      )}

      {/* ── Tab Nav ── */}
      <nav style={s.tabNav}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ ...s.tabBtn, ...(tab === t.id ? s.tabActive : {}) }}>
            {t.label}
          </button>
        ))}
        <div style={s.tabFill} />
        <div style={s.tabHosp}>Kathir Memorial · Chennai</div>
      </nav>

      {/* ── Content ── */}
      <div style={s.content} className="fadeIn" key={tab}>
        {tab === "overview"     && <TabOverview     p={p} proto={proto} doc={doc} risk={risk} hist={hist} msgs={msgs} />}
        {tab === "tests"        && <TabTests        p={p} proto={proto} hist={hist} />}
        {tab === "appointments" && <TabAppointments p={p} appts={appts} doc={doc} />}
        {tab === "messages"     && <TabMessages     p={p} msgs={msgs} />}
        {tab === "profile"      && <TabProfile      p={p} doc={doc} proto={proto} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function TabOverview({ p, proto, doc, risk, hist, msgs }) {
  const bad    = proto && p.last_value >= proto.critical_threshold;
  const latest = hist[hist.length - 1];
  const prev   = hist[hist.length - 2];
  const trend  = prev ? (latest?.value > prev.value ? "↑" : latest?.value < prev.value ? "↓" : "→") : "—";
  const trendBad = trend === "↑" && bad;

  return (
    <div style={s.ovGrid}>

      {/* ── Status Card ── */}
      <div style={{ ...s.card, gridColumn: "1 / 3" }}>
        <div style={s.cardLabel}>CURRENT CARE STATUS</div>
        <div style={s.statusRow}>
          <div style={s.statusBlock}>
            <div style={s.statusNum}>{p.last_value}<span style={s.statusUnit}> {proto?.unit}</span></div>
            <div style={s.statusDesc}>Last {p.last_test} · {p.last_date}</div>
            {bad && <div style={s.aboveRange}>ABOVE SAFE RANGE ({proto?.normal_range})</div>}
          </div>
          <div style={s.statusDivider} />
          <div style={s.statusBlock}>
            <div style={{ ...s.statusNum, fontSize: 36 }}>{p.overdue_days}<span style={s.statusUnit}> days</span></div>
            <div style={s.statusDesc}>Test overdue</div>
            {p.overdue_days > 30 && <div style={s.aboveRange}>IMMEDIATE TEST REQUIRED</div>}
          </div>
          <div style={s.statusDivider} />
          <div style={s.statusBlock}>
            <div style={{ ...s.statusNum, fontSize: 36 }}>{trend}</div>
            <div style={s.statusDesc}>Value trend (last 2 results)</div>
            {trendBad && <div style={s.aboveRange}>WORSENING TREND</div>}
          </div>
          <div style={s.statusDivider} />
          <div style={s.statusBlock}>
            <div style={{ ...s.statusNum, fontSize: 20, marginTop: 4 }}>{proto?.frequency_days}d</div>
            <div style={s.statusDesc}>Recommended test frequency</div>
            <div style={s.normalRange}>Normal: {proto?.normal_range}</div>
          </div>
        </div>
      </div>

      {/* ── Mini Chart ── */}
      <div style={s.card}>
        <div style={s.cardLabel}>RESULT TREND — LAST {hist.length} READINGS</div>
        <MiniChart hist={hist} threshold={proto?.critical_threshold} />
      </div>

      {/* ── Doctor Info ── */}
      <div style={s.card}>
        <div style={s.cardLabel}>YOUR PHYSICIAN</div>
        <div style={s.docName}>{doc?.physician_name}</div>
        <div style={s.docSpec}>{doc?.specialty}</div>
        <div style={s.docHosp}>{doc?.hospital}</div>
        <div style={s.docRule} />
        <div style={s.docPhone}>{doc?.phone}</div>
        <div style={s.remarkBox}>
          <div style={s.remarkLabel}>LATEST REMARKS</div>
          <div style={s.remarkText}>{p.doctor_remarks}</div>
        </div>
      </div>

      {/* ── Next Action ── */}
      <div style={{ ...s.card, gridColumn: "1 / 3", borderStyle: p.status === "escalated" ? "solid" : "solid", borderWidth: p.status === "escalated" ? 2 : 1, borderColor: p.status === "escalated" ? "#111" : "#e0e0e0" }}>
        <div style={s.cardLabel}>WHAT YOU NEED TO DO</div>
        <div style={s.actionGrid}>
          {[
            {
              n: "01",
              title: p.status === "closed" ? "Tests Up to Date" : `Book Your ${p.last_test} Test`,
              body: p.status === "closed"
                ? `Your latest result of ${p.last_value} ${proto?.unit} is within acceptable range. Maintain your current medication and lifestyle.`
                : `Your ${p.last_test} is ${p.overdue_days} days overdue. ${bad ? "Your last result was critically high. " : ""}Contact the hospital or reply YES to book a home sample collection.`,
              cta: p.status === "closed" ? null : "Book Home Collection",
            },
            {
              n: "02",
              title: "Follow Medication Protocol",
              body: `Continue your prescribed regimen for ${p.diagnosis}. Do not self-adjust dosage. Contact ${doc?.physician_name} before making any changes.`,
              cta: null,
            },
            {
              n: "03",
              title: "Keep Your Next Appointment",
              body: `Your next in-clinic review with ${doc?.physician_name} (${doc?.specialty}) should be scheduled. Call ${doc?.phone} to confirm your slot.`,
              cta: `Call ${doc?.phone}`,
            },
          ].map((a, i) => (
            <div key={i} style={s.actionItem}>
              <div style={s.actionN}>{a.n}</div>
              <div style={s.actionTitle}>{a.title}</div>
              <div style={s.actionBody}>{a.body}</div>
              {a.cta && <div style={s.actionCta}>{a.cta} →</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Messages ── */}
      {msgs.length > 0 && (
        <div style={{ ...s.card, gridColumn: "1 / 3" }}>
          <div style={s.cardLabel}>RECENT MESSAGES FROM HOSPITAL</div>
          {msgs.slice(0, 2).map((m, i) => (
            <div key={i} style={{ ...s.msgRow, borderLeft: `2px solid ${m.type === "urgent" ? "#111" : "#ccc"}` }}>
              <div style={s.msgDate}>{m.date}</div>
              <div style={s.msgText}>{m.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — TEST HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
function TabTests({ p, proto, hist }) {
  const maxVal = Math.max(...hist.map(h => h.value));
  const normal  = proto?.critical_threshold;
  const normalPct = normal ? (normal / (maxVal * 1.15)) * 100 : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Full Bar Chart */}
      <div style={s.card}>
        <div style={s.cardLabel}>{p.last_test} HISTORY — {hist.length} READINGS</div>
        <div style={s.chartArea}>
          {normalPct && (
            <div style={{ ...s.threshLine, bottom: `${normalPct}%` }}>
              <span style={s.threshLabel}>critical threshold · {normal} {proto?.unit}</span>
            </div>
          )}
          <div style={s.chartBars}>
            {hist.map((h, i) => {
              const pct = (h.value / (maxVal * 1.15)) * 100;
              const isBad = normal && h.value >= normal;
              const isLast = i === hist.length - 1;
              return (
                <div key={i} style={s.barCol}>
                  <div style={s.barValAbove}>{h.value}</div>
                  <div style={s.barTrack}>
                    <div style={{
                      ...s.barFill,
                      height: `${pct}%`,
                      background: isBad ? "#111" : "#aaa",
                      outline: isLast ? "2px solid #111" : "none",
                      outlineOffset: 2,
                    }} />
                  </div>
                  <div style={s.barDate}>{h.date.slice(2, 7)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={s.chartLegend}>
          <span><span style={{ display:"inline-block", width:10, height:10, background:"#111", marginRight:5 }}/>Above threshold</span>
          <span><span style={{ display:"inline-block", width:10, height:10, background:"#aaa", marginRight:5 }}/>Normal range</span>
          {normalPct && <span>— Critical threshold: {normal} {proto?.unit}</span>}
        </div>
      </div>

      {/* Result Table */}
      <div style={s.card}>
        <div style={s.cardLabel}>DETAILED RECORDS</div>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              {["#", "Date", "Test", "Value", "Unit", "Status", "Change from Previous"].map((h, i) => (
                <th key={i} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...hist].reverse().map((h, i) => {
              const orig = hist.length - 1 - i;
              const prev = hist[orig - 1];
              const delta = prev ? (h.value - prev.value) : null;
              const isBad = normal && h.value >= normal;
              return (
                <tr key={i} style={s.tr}>
                  <td style={s.td}><span style={s.mono}>{String(hist.length - i).padStart(2,"0")}</span></td>
                  <td style={s.td}><span style={s.mono}>{h.date}</span></td>
                  <td style={s.td}>{p.last_test}</td>
                  <td style={s.td}>
                    <span style={{ ...s.mono, fontWeight: 700, textDecoration: isBad ? "underline" : "none" }}>
                      {h.value}
                    </span>
                  </td>
                  <td style={s.td}><span style={s.mono}>{proto?.unit}</span></td>
                  <td style={s.td}>
                    <span style={{ fontSize: 9, padding:"2px 7px", border:"1px solid", letterSpacing:1,
                      borderColor: isBad ? "#111" : "#ccc", color: isBad ? "#111" : "#888" }}>
                      {isBad ? "ABOVE RANGE" : "NORMAL"}
                    </span>
                  </td>
                  <td style={s.td}>
                    {delta !== null
                      ? <span style={{ ...s.mono, color: delta > 0 ? "#333" : "#888" }}>
                          {delta > 0 ? "+" : ""}{delta.toFixed(1)} {proto?.unit}
                        </span>
                      : <span style={{ color:"#ccc" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={s.tableNote}>Normal range: {proto?.normal_range} · Critical threshold: ≥ {proto?.critical_threshold} {proto?.unit}</div>
      </div>

      {/* Protocol Info */}
      <div style={s.infoStrip}>
        <div style={s.infoStripItem}>
          <div style={s.infoStripLabel}>DIAGNOSIS</div>
          <div style={s.infoStripVal}>{p.diagnosis}</div>
        </div>
        <div style={s.infoStripItem}>
          <div style={s.infoStripLabel}>TEST REQUIRED</div>
          <div style={s.infoStripVal}>{proto?.test_name}</div>
        </div>
        <div style={s.infoStripItem}>
          <div style={s.infoStripLabel}>FREQUENCY</div>
          <div style={s.infoStripVal}>Every {proto?.frequency_days} days</div>
        </div>
        <div style={s.infoStripItem}>
          <div style={s.infoStripLabel}>NORMAL RANGE</div>
          <div style={s.infoStripVal}>{proto?.normal_range}</div>
        </div>
        <div style={s.infoStripItem}>
          <div style={s.infoStripLabel}>DAYS OVERDUE</div>
          <div style={{ ...s.infoStripVal, textDecoration: p.overdue_days > 0 ? "underline" : "none" }}>{p.overdue_days}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function TabAppointments({ p, appts, doc }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Next */}
      <div style={{ ...s.card, border:"2px solid #111" }}>
        <div style={s.cardLabel}>NEXT APPOINTMENT</div>
        <div style={s.nextApptRow}>
          <div>
            <div style={s.nextApptStatus}>TO BE SCHEDULED</div>
            <div style={s.nextApptDesc}>
              Your {p.last_test} is <strong>{p.overdue_days} days overdue.</strong>{" "}
              Book your next appointment with {doc?.physician_name} at your earliest convenience.
            </div>
          </div>
          <div style={s.nextApptContact}>
            <div style={s.cardLabel}>CONTACT TO BOOK</div>
            <div style={s.nextApptDoc}>{doc?.physician_name}</div>
            <div style={s.nextApptSpec}>{doc?.specialty}</div>
            <div style={s.nextApptPhone}>{doc?.phone}</div>
            <div style={s.nextApptHosp}>{doc?.hospital}</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={s.card}>
        <div style={s.cardLabel}>APPOINTMENT HISTORY</div>
        {appts.length === 0 ? (
          <div style={s.emptyNote}>No recorded appointments found.</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column" }}>
            {appts.map((a, i) => (
              <div key={i} style={s.apptRow}>
                <div style={s.apptIdx}>{String(appts.length - i).padStart(2,"0")}</div>
                <div style={s.apptDate}>{a.date}</div>
                <div style={s.apptMain}>
                  <div style={s.apptType}>{a.type}</div>
                  <div style={s.apptDoc}>{a.doc}</div>
                </div>
                <div style={s.apptResult}>{a.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={s.card}>
        <div style={s.cardLabel}>CARE PROTOCOL REMINDER</div>
        <div style={s.protoReminder}>
          As a patient with <strong>{p.diagnosis}</strong>, your <strong>{p.last_test}</strong> test should
          be conducted every <strong>{CARE_PROTOCOLS.find(c=>c.diagnosis_name===p.diagnosis)?.frequency_days} days</strong>.
          Regular monitoring prevents emergency hospitalizations and helps your physician
          adjust your treatment plan proactively.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════
function TabMessages({ p, msgs }) {
  const [reply, setReply]   = useState("");
  const [sent, setSent]     = useState([]);
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!reply.trim()) return;
    setTyping(true);
    setSent(prev => [...prev, { text: reply, date: new Date().toISOString().slice(0,10), from:"patient" }]);
    setReply("");
    setTimeout(() => setTyping(false), 1200);
  };

  const allMsgs = [...(msgs || [])].reverse();

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={s.card}>
        <div style={s.cardLabel}>MESSAGES FROM KATHIR MEMORIAL HOSPITAL</div>
        {allMsgs.length === 0 && (
          <div style={s.emptyNote}>No messages yet. Your care team will reach out if action is needed.</div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop: allMsgs.length ? 12 : 0 }}>
          {allMsgs.map((m, i) => (
            <div key={i} style={{ ...s.msgBubble, borderLeft:`3px solid ${m.type==="urgent"?"#111":"#ddd"}` }}>
              <div style={s.msgBubbleTop}>
                <span style={s.msgBubbleFrom}>CARE TEAM · {p.preferred_channel}</span>
                <span style={s.msgBubbleDate}>{m.date}</span>
                {m.type === "urgent" && <span style={s.urgTag}>URGENT</span>}
                {m.type === "reminder" && <span style={s.remTag}>REMINDER</span>}
                {m.type === "info" && <span style={s.infoTag}>INFO</span>}
                {m.type === "response" && <span style={s.respTag}>REPLY</span>}
              </div>
              <div style={s.msgBubbleText}>{m.msg}</div>
            </div>
          ))}
          {sent.map((m, i) => (
            <div key={`sent-${i}`} style={{ ...s.msgBubble, background:"#f5f5f5", borderLeft:"3px solid #111", marginLeft:32 }}>
              <div style={s.msgBubbleTop}>
                <span style={s.msgBubbleFrom}>YOU</span>
                <span style={s.msgBubbleDate}>{m.date}</span>
              </div>
              <div style={s.msgBubbleText}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ ...s.msgBubble, color:"#aaa", borderLeft:"3px solid #eee" }}>
              <div style={s.msgBubbleTop}><span style={s.msgBubbleFrom}>CARE TEAM</span></div>
              <div style={{ ...s.msgBubbleText, letterSpacing:3 }}>. . .</div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Box */}
      <div style={s.card}>
        <div style={s.cardLabel}>REPLY TO CARE TEAM</div>
        <div style={s.replyRow}>
          <div style={s.quickReplies}>
            {["YES, book home collection", "Need to reschedule", "I have a question"].map((q, i) => (
              <button key={i} onClick={() => setReply(q)} style={s.quickBtn}>{q}</button>
            ))}
          </div>
          <div style={s.replyInputWrap}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your message…"
              style={s.replyInput}
              rows={3}
            />
            <button onClick={handleSend} style={s.replyBtn}>SEND →</button>
          </div>
        </div>
        <div style={s.replyNote}>Messages are delivered via {p.preferred_channel}. Response time: within 24 hours.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB — PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function TabProfile({ p, doc, proto }) {
  const fields = [
    { section:"PERSONAL INFORMATION", items:[
      { label:"Full Name",       value: p.patient_name },
      { label:"Patient ID",      value: `#${String(p.patient_id).padStart(4,"0")}` },
      { label:"Age",             value: `${p.age} years` },
      { label:"Gender",          value: p.gender === "M" ? "Male" : "Female" },
      { label:"Registered",      value: p.registered_date },
    ]},
    { section:"CONTACT DETAILS", items:[
      { label:"Phone",           value: p.phone },
      { label:"Email",           value: p.email },
      { label:"Address",         value: p.address },
      { label:"Preferred Channel",value: p.preferred_channel },
      { label:"Smartphone",      value: p.has_smartphone ? "Yes" : "No (NOK contact enabled)" },
    ]},
    { section:"MEDICAL INFORMATION", items:[
      { label:"Primary Diagnosis",value: p.diagnosis },
      { label:"Monitoring Test",  value: proto?.test_name },
      { label:"Test Frequency",   value: `Every ${proto?.frequency_days} days` },
      { label:"Normal Range",     value: proto?.normal_range },
      { label:"Last Test Date",   value: p.last_date },
      { label:"Last Result",      value: `${p.last_value} ${proto?.unit}` },
      { label:"Days Overdue",     value: `${p.overdue_days} days` },
      { label:"Care Gap Status",  value: STATUS_MAP[p.status] },
    ]},
    { section:"CARE TEAM", items:[
      { label:"Physician",        value: doc?.physician_name },
      { label:"Specialty",        value: doc?.specialty },
      { label:"Hospital",         value: doc?.hospital },
      { label:"Contact",          value: doc?.phone },
    ]},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {fields.map((sec, si) => (
        <div key={si} style={s.card}>
          <div style={s.cardLabel}>{sec.section}</div>
          <div style={s.profileGrid}>
            {sec.items.map((f, fi) => (
              <div key={fi} style={s.profileField}>
                <div style={s.profileLabel}>{f.label}</div>
                <div style={s.profileVal}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={s.card}>
        <div style={s.cardLabel}>PHYSICIAN REMARKS</div>
        <div style={s.remarkBox}>
          <div style={s.remarkText}>{p.doctor_remarks}</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Mini Chart (for overview)
// ═══════════════════════════════════════════════════════════════════════════════
function MiniChart({ hist, threshold }) {
  const maxVal = Math.max(...hist.map(h => h.value)) * 1.15;
  return (
    <div style={s.miniChartWrap}>
      <svg width="100%" height={80} viewBox={`0 0 ${hist.length * 48} 80`} preserveAspectRatio="none">
        {threshold && (
          <line
            x1={0} y1={80 - (threshold / maxVal) * 78}
            x2={hist.length * 48} y2={80 - (threshold / maxVal) * 78}
            stroke="#bbb" strokeWidth={1} strokeDasharray="4 3"
          />
        )}
        <polyline
          points={hist.map((h, i) => `${i * 48 + 24},${80 - (h.value / maxVal) * 75}`).join(" ")}
          fill="none" stroke="#111" strokeWidth={1.5} strokeLinejoin="round"
        />
        {hist.map((h, i) => (
          <circle key={i} cx={i * 48 + 24} cy={80 - (h.value / maxVal) * 75}
            r={i === hist.length - 1 ? 4 : 2.5}
            fill={threshold && h.value >= threshold ? "#111" : "#888"}
          />
        ))}
      </svg>
      <div style={s.miniChartDates}>
        {hist.map((h, i) => <span key={i} style={s.miniDate}>{h.date.slice(5)}</span>)}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const mono = "'IBM Plex Mono', 'Courier New', monospace";

const s = {
  // Login
  loginRoot: { minHeight:"100vh", background:"#f5f5f3", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:mono, position:"relative" },
  loginGrid: { position:"absolute", inset:0, backgroundImage:"linear-gradient(#e0e0e0 1px,transparent 1px),linear-gradient(90deg,#e0e0e0 1px,transparent 1px)", backgroundSize:"36px 36px", opacity:0.5, pointerEvents:"none" },
  loginCard: { position:"relative", zIndex:1, background:"#fff", border:"1px solid #ddd", padding:"36px 36px 28px", width:"100%", maxWidth:460, display:"flex", flexDirection:"column", gap:20 },
  loginTop: { display:"flex", flexDirection:"column", gap:12 },
  loginLogo: { display:"flex", alignItems:"center", gap:12 },
  loginPlus: { fontSize:28, fontWeight:300, color:"#111" },
  loginBrand: { fontSize:14, fontWeight:700, color:"#111" },
  loginHosp: { fontSize:9, color:"#aaa", letterSpacing:1 },
  loginRule: { height:1, background:"#e8e8e8" },
  loginTitle: { fontSize:20, fontWeight:700, letterSpacing:-0.5 },
  loginSub: { fontSize:11, color:"#888", lineHeight:1.6 },
  loginField: { border:"1px solid #ddd", padding:"10px 14px", transition:"border-color 0.15s" },
  loginFieldLabel: { fontSize:8, color:"#aaa", letterSpacing:2, display:"block", marginBottom:4 },
  loginInput: { width:"100%", border:"none", outline:"none", fontSize:13, fontFamily:mono, color:"#111", background:"transparent" },
  dropdown: { position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"1px solid #ddd", borderTop:"none", zIndex:50, maxHeight:240, overflowY:"auto" },
  dropItem: { display:"flex", alignItems:"center", gap:10, padding:"10px 14px", width:"100%", border:"none", cursor:"pointer", textAlign:"left", fontFamily:mono, borderBottom:"1px solid #f0f0f0" },
  dropName: { flex:1, fontSize:12, fontWeight:700, color:"#111" },
  dropMeta: { fontSize:10, color:"#888" },
  dropStatus: { fontSize:8, padding:"2px 6px", border:"1px solid", letterSpacing:1 },
  selectedBox: { border:"1px solid #111", padding:"16px 16px 14px", display:"flex", flexDirection:"column", gap:6 },
  selectedLabel: { fontSize:8, color:"#aaa", letterSpacing:2 },
  selectedName: { fontSize:18, fontWeight:700 },
  selectedMeta: { fontSize:11, color:"#888" },
  loginBtn: { marginTop:8, background:"#111", color:"#fff", border:"none", padding:"11px 16px", fontSize:12, fontFamily:mono, cursor:"pointer", fontWeight:700, letterSpacing:1, alignSelf:"flex-start" },
  demoWrap: { borderTop:"1px solid #eee", paddingTop:16 },
  demoLabel: { fontSize:8, color:"#ccc", letterSpacing:2, textAlign:"center", marginBottom:12 },
  demoRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 },
  demoBtn: { border:"1px solid #e8e8e8", padding:"10px 6px", background:"#fff", cursor:"pointer", fontFamily:mono, textAlign:"center", transition:"border-color 0.15s" },
  demoBtnName: { fontSize:11, fontWeight:700, color:"#111" },
  demoBtnDiag: { fontSize:9, color:"#888", marginTop:2 },
  demoBtnStatus: { fontSize:8, color:"#aaa", letterSpacing:1, marginTop:4 },

  // Portal shell
  portalRoot: { minHeight:"100vh", background:"#f5f5f3", fontFamily:mono, color:"#80c841", display:"flex", flexDirection:"column" },
  topbar: { background:"#fff", borderBottom:"1px solid #e0e0e0", padding:"12px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  topLeft: { display:"flex", alignItems:"center", gap:10 },
  topPlus: { fontSize:22, fontWeight:300 },
  topBrand: { fontSize:12, fontWeight:700 },
  topSep: { fontSize:12, color:"#ccc", margin:"0 6px" },
  topPortal: { fontSize:12, color:"#888" },
  topRight: { display:"flex", alignItems:"center", gap:14 },
  topPatient: { textAlign:"right" },
  topPatientName: { fontSize:12, fontWeight:700 },
  topPatientMeta: { fontSize:9, color:"#aaa", letterSpacing:1 },
  topStatusPill: { fontSize:9, padding:"3px 8px", border:"1px solid", letterSpacing:1 },
  logoutBtn: { fontSize:10, padding:"5px 10px", border:"1px solid #ddd", background:"transparent", cursor:"pointer", fontFamily:mono },

  urgentBanner: { background:"#111", color:"#fff", padding:"10px 28px", display:"flex", alignItems:"center", gap:14 },
  urgentMark: { fontSize:16, fontWeight:700, flexShrink:0 },
  urgentText: { fontSize:11, lineHeight:1.5, flex:1 },
  urgentPhone: { fontSize:11, fontWeight:700, textDecoration:"underline", flexShrink:0 },

  tabNav: { background:"#fff", borderBottom:"1px solid #e0e0e0", padding:"0 28px", display:"flex", alignItems:"center", gap:0 },
  tabBtn: { padding:"12px 16px", border:"none", borderBottom:"2px solid transparent", background:"transparent", fontSize:11, fontFamily:mono, cursor:"pointer", color:"#888", letterSpacing:0.5, transition:"all 0.15s" },
  tabActive: { borderBottom:"2px solid #111", color:"#111", fontWeight:700 },
  tabFill: { flex:1 },
  tabHosp: { fontSize:9, color:"#ccc", letterSpacing:1 },

  content: { flex:1, padding:"24px 28px", maxWidth:1100, width:"100%", margin:"0 auto" },

  // Cards
  card: { background:"#fff", border:"1px solid #e0e0e0", padding:"18px 20px", marginBottom:0 },
  cardLabel: { fontSize:8, color:"#aaa", letterSpacing:2, paddingBottom:12, borderBottom:"1px solid #f0f0f0", marginBottom:14 },

  // Overview
  ovGrid: { display:"flex", flexDirection:"column", gap:14 },
  statusRow: { display:"flex", alignItems:"stretch", gap:0 },
  statusBlock: { flex:1, padding:"8px 16px 4px" },
  statusNum: { fontSize:42, fontWeight:700, letterSpacing:-2, lineHeight:1.1 },
  statusUnit: { fontSize:14, fontWeight:400, letterSpacing:0 },
  statusDesc: { fontSize:10, color:"#888", marginTop:4 },
  aboveRange: { fontSize:9, fontWeight:700, letterSpacing:1, marginTop:6, textDecoration:"underline" },
  normalRange: { fontSize:9, color:"#aaa", marginTop:4 },
  statusDivider: { width:1, background:"#f0f0f0", margin:"0 4px" },

  miniChartWrap: { paddingTop:8 },
  miniChartDates: { display:"flex", justifyContent:"space-around", marginTop:4 },
  miniDate: { fontSize:8, color:"#ccc" },

  docName: { fontSize:15, fontWeight:700, marginBottom:2 },
  docSpec: { fontSize:11, color:"#555" },
  docHosp: { fontSize:10, color:"#888" },
  docRule: { height:1, background:"#f0f0f0", margin:"12px 0" },
  docPhone: { fontSize:11, fontWeight:700, marginBottom:12 },
  remarkBox: { background:"#f8f8f8", border:"1px solid #eeeeee", padding:12 },
  remarkLabel: { fontSize:8, color:"#aaa", letterSpacing:2, marginBottom:6 },
  remarkText: { fontSize:11, color:"#444", lineHeight:1.8 },

  actionGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginTop:4 },
  actionItem: { display:"flex", flexDirection:"column", gap:6 },
  actionN: { fontSize:24, fontWeight:700, color:"#e0e0e0" },
  actionTitle: { fontSize:12, fontWeight:700, letterSpacing:-0.2 },
  actionBody: { fontSize:11, color:"#555", lineHeight:1.7 },
  actionCta: { fontSize:10, fontWeight:700, letterSpacing:1, marginTop:4 },

  msgRow: { padding:"10px 14px", marginBottom:8, background:"#fafafa" },
  msgDate: { fontSize:9, color:"#aaa", marginBottom:4 },
  msgText: { fontSize:11, color:"#333", lineHeight:1.7 },

  // Tests
  chartArea: { position:"relative", height:180, marginBottom:8, marginTop:8 },
  threshLine: { position:"absolute", left:0, right:0, borderTop:"1px dashed #ccc", display:"flex", alignItems:"center", justifyContent:"flex-end" },
  threshLabel: { fontSize:8, color:"#aaa", background:"#fff", padding:"0 4px" },
  chartBars: { display:"flex", alignItems:"flex-end", height:"100%", gap:6, padding:"0 4px" },
  barCol: { flex:1, display:"flex", flexDirection:"column", alignItems:"center" },
  barValAbove: { fontSize:9, color:"#888", marginBottom:3 },
  barTrack: { width:"100%", height:140, display:"flex", alignItems:"flex-end", background:"#f5f5f5" },
  barFill: { width:"100%", transition:"height 0.8s ease" },
  barDate: { fontSize:8, color:"#aaa", marginTop:4 },
  chartLegend: { display:"flex", gap:16, fontSize:9, color:"#888", paddingTop:10, borderTop:"1px solid #f0f0f0" },
  table: { width:"100%", borderCollapse:"collapse", marginTop:8 },
  thead: { background:"#f8f8f8" },
  th: { padding:"8px 12px", textAlign:"left", fontSize:8, color:"#aaa", letterSpacing:2, borderBottom:"1px solid #e8e8e8", fontWeight:400 },
  tr: { borderBottom:"1px solid #f5f5f5" },
  td: { padding:"9px 12px", fontSize:11 },
  mono: { fontFamily:mono },
  tableNote: { fontSize:9, color:"#aaa", marginTop:12, paddingTop:10, borderTop:"1px solid #f0f0f0" },
  infoStrip: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:"#e0e0e0" },
  infoStripItem: { background:"#fff", padding:"14px 16px" },
  infoStripLabel: { fontSize:8, color:"#aaa", letterSpacing:2, marginBottom:6 },
  infoStripVal: { fontSize:13, fontWeight:700 },

  // Appointments
  nextApptRow: { display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"flex-start", marginTop:4 },
  nextApptStatus: { fontSize:16, fontWeight:700, marginBottom:8, textDecoration:"underline" },
  nextApptDesc: { fontSize:12, color:"#444", lineHeight:1.8 },
  nextApptContact: { border:"1px solid #e0e0e0", padding:"14px 16px", minWidth:200 },
  nextApptDoc: { fontSize:13, fontWeight:700, marginTop:8 },
  nextApptSpec: { fontSize:11, color:"#555" },
  nextApptPhone: { fontSize:12, fontWeight:700, marginTop:8 },
  nextApptHosp: { fontSize:10, color:"#888" },
  apptRow: { display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid #f5f5f5" },
  apptIdx: { fontSize:10, color:"#ccc", fontFamily:mono, width:24, flexShrink:0 },
  apptDate: { fontSize:11, fontFamily:mono, color:"#888", width:96, flexShrink:0 },
  apptMain: { flex:1 },
  apptType: { fontSize:12, fontWeight:700 },
  apptDoc: { fontSize:10, color:"#888" },
  apptResult: { fontSize:11, fontFamily:mono, color:"#333", fontWeight:700 },
  protoReminder: { fontSize:12, color:"#444", lineHeight:1.9, marginTop:4 },
  emptyNote: { fontSize:11, color:"#aaa", padding:"16px 0" },

  // Messages
  msgBubble: { padding:"12px 14px", background:"#fff", borderLeft:"3px solid #ddd" },
  msgBubbleTop: { display:"flex", gap:10, alignItems:"center", marginBottom:8 },
  msgBubbleFrom: { fontSize:8, fontWeight:700, letterSpacing:2, color:"#888" },
  msgBubbleDate: { fontSize:9, color:"#ccc" },
  msgBubbleText: { fontSize:12, color:"#333", lineHeight:1.8 },
  urgTag: { fontSize:8, padding:"1px 6px", border:"1px solid #111", color:"#111", letterSpacing:1 },
  remTag: { fontSize:8, padding:"1px 6px", border:"1px solid #888", color:"#888", letterSpacing:1 },
  infoTag: { fontSize:8, padding:"1px 6px", border:"1px solid #aaa", color:"#aaa", letterSpacing:1 },
  respTag: { fontSize:8, padding:"1px 6px", border:"1px solid #555", color:"#555", letterSpacing:1 },
  replyRow: { display:"flex", flexDirection:"column", gap:10, marginTop:4 },
  quickReplies: { display:"flex", gap:8, flexWrap:"wrap" },
  quickBtn: { fontSize:10, padding:"6px 12px", border:"1px solid #ddd", background:"#fff", cursor:"pointer", fontFamily:mono, color:"#555" },
  replyInputWrap: { display:"flex", gap:10, alignItems:"flex-end" },
  replyInput: { flex:1, border:"1px solid #ddd", padding:"10px 12px", fontSize:11, fontFamily:mono, outline:"none", resize:"none", color:"#111", background:"#fafafa" },
  replyBtn: { padding:"10px 18px", background:"#111", color:"#fff", border:"none", fontSize:11, fontFamily:mono, cursor:"pointer", letterSpacing:1, fontWeight:700, flexShrink:0 },
  replyNote: { fontSize:9, color:"#aaa", marginTop:4 },

  // Profile
  profileGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 },
  profileField: { border:"1px solid #f0f0f0", padding:"10px 12px" },
  profileLabel: { fontSize:8, color:"#aaa", letterSpacing:2, marginBottom:4 },
  profileVal: { fontSize:12, fontWeight:700, color:"#111" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f5f5f3;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fadeIn{animation:fadeIn 0.2s ease}
  .fadeSlide{animation:fadeSlide 0.25s ease}
  button:hover{opacity:0.8}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:#f5f5f5}
  ::-webkit-scrollbar-thumb{background:#ddd}
  tr:hover{background:#fafafa!important}
`;