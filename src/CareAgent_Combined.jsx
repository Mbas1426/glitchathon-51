import { useState, useEffect, useRef } from "react";
import HomePage from './components/HomePage.jsx';
import DoctorApp from './components/DoctorApp.jsx';
import PtMiniChart from './components/PtMiniChart.jsx';
import {C, h} from './styles/homeStyles.jsx'
import Counter from './components/Counter.jsx'
import PulseRing from './components/PulseRing.jsx'
import Sparkline from './components/Sparkline.jsx'

// ─── Shared Data ──────────────────────────────────────────────────────────────
export const PATIENTS = [
  { patient_id: 1,  patient_name: "Rajesh Kumar",         age: 58, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",     last_value: 9.5,  last_date: "2024-07-10", overdue_days: 120, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 98401 23456", email: "rajesh.k@email.com",   address: "14, Anna Nagar, Chennai",    registered_date: "2021-03-12", doctor_remarks: "HbA1c critically elevated. Increase Metformin dosage and restrict carbohydrate intake. Urgent follow-up required within 2 weeks." },
  { patient_id: 2,  patient_name: "Meena Sundaram",       age: 72, gender: "F", diagnosis: "CKD",             last_test: "Creatinine", last_value: 3.2,  last_date: "2024-06-15", overdue_days: 145, physician_id: 2, preferred_channel: "SMS",      has_smartphone: 0, status: "overdue",   phone: "+91 94401 78901", email: "meena.s@email.com",    address: "7, T Nagar, Chennai",        registered_date: "2020-08-05", doctor_remarks: "Creatinine levels indicate Stage 3 CKD. Avoid NSAIDs. Restrict protein intake. Nephrology consult scheduled." },
  { patient_id: 3,  patient_name: "Suresh Babu",          age: 65, gender: "M", diagnosis: "Hypertension",   last_test: "BP Panel",   last_value: 165,  last_date: "2024-08-20", overdue_days: 74,  physician_id: 3, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 99401 34567", email: "suresh.b@email.com",   address: "22, Adyar, Chennai",         registered_date: "2022-01-18", doctor_remarks: "BP remains uncontrolled. Amlodipine dose reviewed. Salt restriction and daily walking strictly advised." },
  { patient_id: 4,  patient_name: "Lakshmi Patel",        age: 54, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH",        last_value: 8.9,  last_date: "2024-07-05", overdue_days: 95,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 93401 56789", email: "lakshmi.p@email.com",  address: "5, Velachery, Chennai",      registered_date: "2021-11-30", doctor_remarks: "TSH elevated above threshold. Levothyroxine dose to be adjusted. Avoid soy products and excess fiber near medication time." },
  { patient_id: 5,  patient_name: "Vijay Krishnan",       age: 61, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",     last_value: 7.1,  last_date: "2024-09-01", overdue_days: 52,  physician_id: 1, preferred_channel: "SMS",      has_smartphone: 1, status: "pending",   phone: "+91 91401 90123", email: "vijay.k@email.com",    address: "9, Porur, Chennai",          registered_date: "2022-06-14", doctor_remarks: "HbA1c borderline. Continue current medication and monitor diet. Schedule next test before end of month." },
  { patient_id: 6,  patient_name: "Anitha Rajan",         age: 68, gender: "F", diagnosis: "CKD",             last_test: "Creatinine", last_value: 1.8,  last_date: "2024-08-10", overdue_days: 81,  physician_id: 2, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 98001 45678", email: "anitha.r@email.com",   address: "33, Mylapore, Chennai",      registered_date: "2020-05-22", doctor_remarks: "Early CKD — creatinine rising trend. Hydration is key. Avoid contrast dyes. Annual kidney ultrasound due." },
  { patient_id: 7,  patient_name: "Mohan Das",            age: 77, gender: "M", diagnosis: "Hypertension",   last_test: "BP Panel",   last_value: 145,  last_date: "2024-09-15", overdue_days: 38,  physician_id: 3, preferred_channel: "Call",     has_smartphone: 0, status: "pending",   phone: "+91 97001 67890", email: "mohan.d@email.com",    address: "11, Tambaram, Chennai",      registered_date: "2019-09-08", doctor_remarks: "BP marginally elevated. Continue Telmisartan. Morning BP readings to be logged and shared at next visit." },
  { patient_id: 8,  patient_name: "Saranya Iyer",         age: 45, gender: "F", diagnosis: "Diabetes",       last_test: "HbA1c",     last_value: 11.2, last_date: "2024-06-01", overdue_days: 160, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "escalated", phone: "+91 96001 89012", email: "saranya.i@email.com",  address: "18, Guindy, Chennai",        registered_date: "2021-07-03", doctor_remarks: "URGENT: HbA1c at 11.2% is dangerously high. Risk of diabetic ketoacidosis. Insulin therapy initiated. Report any dizziness or vomiting immediately." },
  { patient_id: 9,  patient_name: "Prakash Nair",         age: 70, gender: "M", diagnosis: "CKD",             last_test: "Creatinine", last_value: 4.1,  last_date: "2024-05-20", overdue_days: 173, physician_id: 2, preferred_channel: "SMS",      has_smartphone: 0, status: "escalated", phone: "+91 95001 01234", email: "prakash.n@email.com",  address: "2, Perambur, Chennai",       registered_date: "2018-12-15", doctor_remarks: "URGENT: Creatinine 4.1 mg/dL — Stage 4 CKD. Dialysis evaluation scheduled. Strict fluid and potassium restriction. Do not miss next appointment." },
  { patient_id: 10, patient_name: "Deepa Venkat",         age: 52, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH",        last_value: 5.2,  last_date: "2024-09-10", overdue_days: 43,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "responded", phone: "+91 94001 23456", email: "deepa.v@email.com",    address: "6, Nungambakkam, Chennai",   registered_date: "2022-04-19", doctor_remarks: "TSH slightly above range. Minor Levothyroxine adjustment made. Repeat test in 6 weeks. Home collection confirmed." },
  { patient_id: 11, patient_name: "Ganesh Murthy",        age: 63, gender: "M", diagnosis: "Diabetes",       last_test: "HbA1c",     last_value: 8.8,  last_date: "2024-07-25", overdue_days: 105, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue",   phone: "+91 93001 45678", email: "ganesh.m@email.com",   address: "44, Kodambakkam, Chennai",   registered_date: "2020-10-27", doctor_remarks: "HbA1c 8.8% — poorly controlled. Review carbohydrate intake. Consider adding DPP-4 inhibitor. Weight loss of 3–5kg recommended." },
  { patient_id: 12, patient_name: "Revathi Chandran",     age: 80, gender: "F", diagnosis: "Hypertension",   last_test: "BP Panel",   last_value: 178,  last_date: "2024-06-30", overdue_days: 130, physician_id: 3, preferred_channel: "Call",     has_smartphone: 0, status: "escalated", phone: "+91 92001 67890", email: "revathi.c@email.com",  address: "3, Chromepet, Chennai",      registered_date: "2017-06-11", doctor_remarks: "URGENT: BP 178 mmHg is hypertensive crisis level. Immediate medication review done. Family to monitor daily. Avoid exertion." },
  { patient_id: 13, patient_name: "Senthil Kumar",        age: 59, gender: "M", diagnosis: "CKD",             last_test: "Creatinine", last_value: 2.4,  last_date: "2024-08-05", overdue_days: 86,  physician_id: 2, preferred_channel: "SMS",      has_smartphone: 1, status: "responded", phone: "+91 91001 89012", email: "senthil.k@email.com",  address: "7, Sholinganallur, Chennai", registered_date: "2021-02-09", doctor_remarks: "Creatinine slowly rising. Maintain low-protein diet. Avoid dehydration. Annual eGFR measurement scheduled." },
  { patient_id: 14, patient_name: "Usha Balasubramaniam",age: 66, gender: "F", diagnosis: "Diabetes",       last_test: "HbA1c",     last_value: 6.8,  last_date: "2024-09-20", overdue_days: 33,  physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "closed",    phone: "+91 90001 01234", email: "usha.b@email.com",     address: "29, Besant Nagar, Chennai",  registered_date: "2022-08-16", doctor_remarks: "HbA1c well managed at 6.8%. Excellent compliance. Continue current regimen. Next review in 3 months." },
  { patient_id: 15, patient_name: "Ravi Subramanian",     age: 74, gender: "M", diagnosis: "Hypothyroidism", last_test: "TSH",        last_value: 12.4, last_date: "2024-07-15", overdue_days: 115, physician_id: 1, preferred_channel: "SMS",      has_smartphone: 0, status: "overdue",   phone: "+91 89001 23456", email: "ravi.s@email.com",     address: "15, Royapuram, Chennai",     registered_date: "2019-04-23", doctor_remarks: "TSH 12.4 — severely hypothyroid. Levothyroxine dose doubled. Monitor for cardiac symptoms. Family member to supervise medication." },
];

export const PHYSICIANS = [
  { physician_id: 1, physician_name: "Dr. Priya Sharma",  specialty: "Endocrinology", phone: "+91 044-2345-6789", hospital: "Kathir Memorial Hospital" },
  { physician_id: 2, physician_name: "Dr. Arjun Mehta",   specialty: "Nephrology",    phone: "+91 044-2345-6790", hospital: "Kathir Memorial Hospital" },
  { physician_id: 3, physician_name: "Dr. Kavitha Nair",  specialty: "Cardiology",    phone: "+91 044-2345-6791", hospital: "Kathir Memorial Hospital" },
];

export const CARE_PROTOCOLS = [
  { diagnosis_name: "Diabetes",       test_name: "HbA1c",     frequency_days: 90,  normal_range: "4.0–5.6%",      unit: "%",     critical_threshold: 9.0  },
  { diagnosis_name: "CKD",            test_name: "Creatinine",frequency_days: 180, normal_range: "0.7–1.3 mg/dL", unit: "mg/dL", critical_threshold: 3.0  },
  { diagnosis_name: "Hypertension",   test_name: "BP Panel",  frequency_days: 60,  normal_range: "< 140 mmHg",    unit: "mmHg",  critical_threshold: 160  },
  { diagnosis_name: "Hypothyroidism", test_name: "TSH",       frequency_days: 90,  normal_range: "0.4–4.0 mIU/L", unit: "mIU/L", critical_threshold: 8.0  },
];

export const TEST_HISTORY = {
  1:  [{date:"2023-04-12",value:7.4},{date:"2023-07-18",value:7.9},{date:"2023-10-22",value:8.4},{date:"2024-01-18",value:8.7},{date:"2024-04-22",value:9.0},{date:"2024-07-10",value:9.5}],
  2:  [{date:"2023-06-05",value:1.6},{date:"2023-09-11",value:1.9},{date:"2023-12-08",value:2.2},{date:"2024-03-20",value:2.9},{date:"2024-06-15",value:3.2}],
  3:  [{date:"2023-08-10",value:136},{date:"2023-11-15",value:141},{date:"2024-01-10",value:148},{date:"2024-04-15",value:155},{date:"2024-06-30",value:158},{date:"2024-08-20",value:165}],
  4:  [{date:"2023-07-01",value:4.8},{date:"2023-10-14",value:6.2},{date:"2024-01-20",value:7.4},{date:"2024-04-09",value:8.1},{date:"2024-07-05",value:8.9}],
  5:  [{date:"2023-09-05",value:6.2},{date:"2023-12-12",value:6.5},{date:"2024-03-18",value:6.8},{date:"2024-06-22",value:7.0},{date:"2024-09-01",value:7.1}],
  6:  [{date:"2023-08-20",value:1.1},{date:"2023-11-30",value:1.3},{date:"2024-02-14",value:1.5},{date:"2024-05-14",value:1.7},{date:"2024-08-10",value:1.8}],
  7:  [{date:"2024-01-05",value:138},{date:"2024-04-20",value:141},{date:"2024-07-11",value:143},{date:"2024-09-15",value:145}],
  8:  [{date:"2023-06-14",value:8.2},{date:"2023-09-29",value:9.1},{date:"2023-12-07",value:9.9},{date:"2024-03-07",value:10.6},{date:"2024-06-01",value:11.2}],
  9:  [{date:"2023-05-18",value:2.2},{date:"2023-08-04",value:2.8},{date:"2023-11-22",value:3.3},{date:"2024-02-22",value:3.7},{date:"2024-05-20",value:4.1}],
  10: [{date:"2023-09-18",value:3.8},{date:"2023-12-25",value:4.1},{date:"2024-03-30",value:4.7},{date:"2024-06-30",value:5.0},{date:"2024-09-10",value:5.2}],
  11: [{date:"2023-07-05",value:7.2},{date:"2023-10-14",value:7.7},{date:"2024-01-28",value:8.2},{date:"2024-04-28",value:8.5},{date:"2024-07-25",value:8.8}],
  12: [{date:"2023-06-22",value:148},{date:"2023-09-08",value:155},{date:"2024-01-08",value:162},{date:"2024-03-31",value:170},{date:"2024-06-30",value:178}],
  13: [{date:"2023-08-11",value:1.4},{date:"2023-11-18",value:1.7},{date:"2024-02-07",value:1.9},{date:"2024-05-18",value:2.1},{date:"2024-08-05",value:2.4}],
  14: [{date:"2023-09-01",value:7.8},{date:"2023-12-10",value:7.4},{date:"2024-03-15",value:7.1},{date:"2024-06-25",value:7.0},{date:"2024-09-20",value:6.8}],
  15: [{date:"2023-07-28",value:6.8},{date:"2023-10-22",value:8.9},{date:"2024-01-16",value:10.6},{date:"2024-04-16",value:11.8},{date:"2024-07-15",value:12.4}],
};

const OUTREACH_MSGS = {
  1:  [{date:"2025-02-10",msg:"Your HbA1c is 120 days overdue. Last value 9.5% was critically high. Please book a home collection immediately.",type:"urgent"},{date:"2025-01-12",msg:"Reminder: HbA1c test is due. Please schedule at your earliest convenience.",type:"reminder"}],
  8:  [{date:"2025-03-01",msg:"URGENT: Your HbA1c of 11.2% indicates dangerously uncontrolled diabetes. Dr. Priya Sharma has been alerted. Please call the hospital today.",type:"urgent"},{date:"2025-02-01",msg:"Your HbA1c test is overdue by 130 days. Please respond to schedule a home collection.",type:"urgent"}],
  9:  [{date:"2025-03-02",msg:"ESCALATED: Creatinine 4.1 mg/dL with 173 days overdue. Dr. Arjun Mehta requires you to attend in-person immediately.",type:"urgent"}],
  10: [{date:"2025-03-07",msg:"Your home sample collection has been confirmed for Saturday. Our technician will arrive between 8–10 AM.",type:"info"},{date:"2025-02-25",msg:"TSH test is 43 days overdue. Would you like to book a home collection? Reply YES to confirm.",type:"reminder"}],
  13: [{date:"2025-03-06",msg:"We received your query 'Is it really urgent?'. Yes — your Creatinine trend is rising. Early intervention prevents dialysis. Please book today.",type:"response"}],
};

const APPOINTMENTS = {
  1:  [{date:"2024-07-10",type:"Test + Consultation",doc:"Dr. Priya Sharma",result:"HbA1c: 9.5%"},{date:"2024-04-22",type:"Test + Consultation",doc:"Dr. Priya Sharma",result:"HbA1c: 9.0%"},{date:"2024-01-18",type:"Routine Test",doc:"Dr. Priya Sharma",result:"HbA1c: 8.7%"}],
  2:  [{date:"2024-06-15",type:"Nephrology Review",doc:"Dr. Arjun Mehta",result:"Creatinine: 3.2 mg/dL"},{date:"2024-03-20",type:"Routine Test",doc:"Dr. Arjun Mehta",result:"Creatinine: 2.9 mg/dL"}],
  8:  [{date:"2024-06-01",type:"Emergency Review",doc:"Dr. Priya Sharma",result:"HbA1c: 11.2% — Insulin started"},{date:"2024-03-07",type:"Routine Test",doc:"Dr. Priya Sharma",result:"HbA1c: 10.6%"}],
  14: [{date:"2024-09-20",type:"Routine Test",doc:"Dr. Priya Sharma",result:"HbA1c: 6.8% — Well controlled"},{date:"2024-06-25",type:"Routine Test",doc:"Dr. Priya Sharma",result:"HbA1c: 7.0%"}],
};

export const OUTREACH_RESPONSES = [
  { patient_id: 10, type: "agreed",   message: "Yes, please book the home collection for this Saturday.", date: "2025-03-07" },
  { patient_id: 13, type: "question", message: "Is it really urgent? I feel fine.",                       date: "2025-03-06" },
  { patient_id: 5,  type: "declined", message: "I'm traveling next month. Will do it later.",             date: "2025-03-08" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getRiskTier = (p) => {
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  if (!proto) return "low";
  if (p.overdue_days > 120 || p.last_value >= proto.critical_threshold * 1.2) return "critical";
  if (p.overdue_days > 60  || p.last_value >= proto.critical_threshold)        return "high";
  return "moderate";
};
export const getRiskColor = (tier) => ({
  critical: C.red, high: C.orange, moderate: C.green, low: C.blue,
}[tier] || C.blue);
export const getStatusBadge = (status) => ({
  overdue:   { label: "Overdue",   bg: C.redDim,    color: C.red    },
  escalated: { label: "Escalated", bg: C.redDim,    color: C.red    },
  pending:   { label: "Pending",   bg: C.orangeDim, color: C.orange },
  responded: { label: "Responded", bg: C.greenDim,  color: C.green  },
  closed:    { label: "Closed",    bg: C.blueDim,   color: C.blue   },
}[status] || { label: status, bg: "#f0f0f0", color: "#888" });
export const getChannelIcon = (ch) => ({ WhatsApp:"💬", SMS:"📱", Call:"📞", Email:"✉️" }[ch] || "📨");
export const diagIcon = (d) => ({ Diabetes:"🩸", CKD:"🫘", Hypertension:"💓", Hypothyroidism:"🦋" }[d] || "🏥");
const DIAG_ABBR = { Diabetes:"DM", CKD:"CKD", Hypertension:"HTN", Hypothyroidism:"HYPO" };
const STATUS_MAP = { overdue:"OVERDUE", escalated:"ESCALATED", pending:"PENDING", responded:"RESPONDED", closed:"UP TO DATE" };


// ROOT — routing: home | doctor | patient
// ═══════════════════════════════════════════════════════════════════════════════
export default function CareAgent() {
  const [screen, setScreen] = useState("home"); // home | doctor | patient
  const [doctorId, setDoctorId] = useState(null);
  const [patientId, setPatientId] = useState(null);

  const goHome = () => { setScreen("home"); setDoctorId(null); setPatientId(null); };

  if (screen === "doctor" && doctorId !== null)
    return <DoctorApp doctor={PHYSICIANS.find(p => p.physician_id === doctorId)} onLogout={goHome} />;
  if (screen === "patient" && patientId !== null)
    return <PatientApp patient={PATIENTS.find(p => p.patient_id === patientId)} onLogout={goHome} />;

  return <HomePage onDoctor={(id) => { setDoctorId(id); setScreen("doctor"); }} onPatient={(id) => { setPatientId(id); setScreen("patient"); }} />;
}

// ── Doctor: Outreach ──────────────────────────────────────────────────────────


// ── Doctor: Care Gaps ─────────────────────────────────────────────────────────


// ── Doctor: Escalations ───────────────────────────────────────────────────────


// ── Doctor: Patient Modal ─────────────────────────────────────────────────────


// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT APP — full portal (light-themed)
// ═══════════════════════════════════════════════════════════════════════════════
function PatientApp({ patient: p, onLogout }) {
  const [tab, setTab] = useState("overview");
  const risk   = getRiskTier(p);
  const proto  = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  const doc    = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
  const msgs   = OUTREACH_MSGS[p.patient_id] || [];
  const appts  = APPOINTMENTS[p.patient_id]  || [];
  const hist   = TEST_HISTORY[p.patient_id]  || [];
  const isUrgent  = p.status === "escalated";
  const isOverdue = p.overdue_days > 0 && p.status !== "closed";

  const TABS = [
    { id:"overview",     label:"Overview"     },
    { id:"tests",        label:"Test History" },
    { id:"appointments", label:"Appointments" },
    { id:"messages",     label:`Messages${msgs.length?` (${msgs.length})`:""}`},
    { id:"profile",      label:"My Profile"   },
  ];

  return (
    <div style={pt.root}>
      <style>{CSS}</style>
      <header style={pt.topbar}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={d.logoMark}><span style={{ fontSize:16, color:"#fff" }}>✚</span></div>
          <div>
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>CareAgent</span>
            <span style={{ fontSize:12, color:C.textDimmer, margin:"0 6px" }}>/</span>
            <span style={{ fontSize:12, color:C.textMuted }}>Patient Portal</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{p.patient_name}</div>
            <div style={{ fontSize:9, color:C.textMuted, letterSpacing:1 }}>#{String(p.patient_id).padStart(4,"0")} · {p.diagnosis}</div>
          </div>
          <span style={{ fontSize:9, padding:"3px 8px", border:`1px solid ${isUrgent?C.red:isOverdue?C.orange:C.border}`, color:isUrgent?C.red:isOverdue?C.orange:C.textMuted, borderRadius:6, letterSpacing:1, fontWeight:isUrgent?700:400 }}>{STATUS_MAP[p.status]}</span>
          <button onClick={onLogout} style={{ fontSize:10, padding:"5px 10px", border:`1px solid ${C.border}`, background:"transparent", cursor:"pointer", color:C.textMuted, borderRadius:7 }}>Sign Out</button>
        </div>
      </header>

      {isUrgent && (
        <div style={{ background:C.redDim, borderBottom:`1px solid ${C.red}40`, color:C.red, padding:"10px 28px", display:"flex", alignItems:"center", gap:14 }} className="fadeSlide">
          <span style={{ fontSize:16, fontWeight:700 }}>!</span>
          <span style={{ fontSize:11, lineHeight:1.5, flex:1 }}>Action required — Your {p.last_test} result of <strong>{p.last_value} {proto?.unit}</strong> is critically above the safe range. Contact {doc?.physician_name} immediately.</span>
          <span style={{ fontSize:11, fontWeight:700 }}>{doc?.phone}</span>
        </div>
      )}

      <nav style={{ background:C.bgCard, borderBottom:`1px solid ${C.border}`, padding:"0 28px", display:"flex", alignItems:"center", gap:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"12px 16px", border:"none", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, background:"transparent", fontSize:11, fontFamily:"monospace", cursor:"pointer", color:tab===t.id?C.blue:C.textMuted, letterSpacing:0.5, transition:"all 0.15s", fontWeight:tab===t.id?700:400 }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ fontSize:9, color:C.textDimmer, letterSpacing:1 }}>Kathir Memorial · Chennai</div>
      </nav>

      <div style={{ flex:1, padding:"24px 28px", maxWidth:1100, width:"100%", margin:"0 auto", overflowY:"auto" }} className="fadeIn" key={tab}>
        {tab==="overview"     && <PtOverview     p={p} proto={proto} doc={doc} hist={hist} msgs={msgs} />}
        {tab==="tests"        && <PtTests        p={p} proto={proto} hist={hist} />}
        {tab==="appointments" && <PtAppointments p={p} appts={appts} doc={doc} proto={proto} />}
        {tab==="messages"     && <PtMessages     p={p} msgs={msgs} />}
        {tab==="profile"      && <PtProfile      p={p} doc={doc} proto={proto} />}
      </div>
    </div>
  );
}

// ── Patient: Overview ─────────────────────────────────────────────────────────
function PtOverview({ p, proto, doc, hist, msgs }) {
  const bad = proto && p.last_value >= proto.critical_threshold;
  const latest = hist[hist.length-1], prev = hist[hist.length-2];
  const trend = prev ? (latest?.value > prev.value ? "↑" : latest?.value < prev.value ? "↓" : "→") : "—";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Status strip */}
      <div style={pt.card}>
        <div style={pt.cardLabel}>CURRENT CARE STATUS</div>
        <div style={{ display:"flex", alignItems:"stretch" }}>
          {[
            { num:p.last_value, unit:proto?.unit, desc:`Last ${p.last_test} · ${p.last_date}`, warn:bad?"ABOVE SAFE RANGE ("+proto?.normal_range+")":null, warnColor:C.red },
            { num:p.overdue_days, unit:"days", desc:"Test overdue", warn:p.overdue_days>30?"IMMEDIATE TEST REQUIRED":null, warnColor:C.red },
            { num:trend, unit:"", desc:"Value trend (last 2 results)", warn:trend==="↑"&&bad?"WORSENING TREND":null, warnColor:C.red },
            { num:proto?.frequency_days+"d", unit:"", desc:"Recommended frequency", warn:"Normal: "+proto?.normal_range, warnColor:C.textMuted },
          ].map((item,i) => (
            <div key={i} style={{ flex:1, padding:"8px 16px 4px", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontSize:38, fontWeight:700, letterSpacing:-2, lineHeight:1.1, color:C.text }}>{item.num}<span style={{ fontSize:13, fontWeight:400, color:C.textMuted }}>{item.unit&&" "+item.unit}</span></div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>{item.desc}</div>
              {item.warn && <div style={{ fontSize:9, fontWeight:700, letterSpacing:1, marginTop:6, color:item.warnColor }}>{item.warn}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* Mini chart */}
        <div style={pt.card}>
          <div style={pt.cardLabel}>RESULT TREND — LAST {hist.length} READINGS</div>
          <PtMiniChart hist={hist} threshold={proto?.critical_threshold} />
        </div>
        {/* Doctor */}
        <div style={pt.card}>
          <div style={pt.cardLabel}>YOUR PHYSICIAN</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:2 }}>{doc?.physician_name}</div>
          <div style={{ fontSize:11, color:C.textSub }}>{doc?.specialty}</div>
          <div style={{ fontSize:10, color:C.textMuted }}>{doc?.hospital}</div>
          <div style={{ height:1, background:C.border, margin:"12px 0" }} />
          <div style={{ fontSize:11, fontWeight:700, color:C.blue, marginBottom:12 }}>{doc?.phone}</div>
          <div style={{ background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:10, padding:12 }}>
            <div style={{ fontSize:8, color:C.textMuted, letterSpacing:2, marginBottom:6 }}>LATEST REMARKS</div>
            <div style={{ fontSize:11, color:C.textSub, lineHeight:1.8 }}>{p.doctor_remarks}</div>
          </div>
        </div>
      </div>

      {/* Action items */}
      <div style={{ ...pt.card, border:`1px solid ${p.status==="escalated"?C.red+"60":C.border}` }}>
        <div style={pt.cardLabel}>WHAT YOU NEED TO DO</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginTop:4 }}>
          {[
            { n:"01", title:p.status==="closed"?"Tests Up to Date":`Book Your ${p.last_test} Test`,
              body:p.status==="closed"?`Your latest result of ${p.last_value} ${proto?.unit} is within range. Maintain current medication.`:`Your ${p.last_test} is ${p.overdue_days} days overdue.${bad?" Last result was critically high.":""} Reply YES to book home collection.`,
              cta:p.status==="closed"?null:"Book Home Collection" },
            { n:"02", title:"Follow Medication Protocol", body:`Continue your prescribed regimen for ${p.diagnosis}. Do not self-adjust dosage. Contact ${doc?.physician_name} before any changes.`, cta:null },
            { n:"03", title:"Keep Your Next Appointment", body:`Your next review with ${doc?.physician_name} (${doc?.specialty}) should be scheduled. Call ${doc?.phone} to confirm.`, cta:`Call ${doc?.phone}` },
          ].map((a,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:24, fontWeight:700, color:C.borderBright }}>{a.n}</div>
              <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{a.title}</div>
              <div style={{ fontSize:11, color:C.textSub, lineHeight:1.7 }}>{a.body}</div>
              {a.cta && <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, marginTop:4, color:C.blue }}>{a.cta} →</div>}
            </div>
          ))}
        </div>
      </div>

      {msgs.length > 0 && (
        <div style={pt.card}>
          <div style={pt.cardLabel}>RECENT MESSAGES FROM HOSPITAL</div>
          {msgs.slice(0,2).map((m,i) => (
            <div key={i} style={{ padding:"10px 14px", marginBottom:8, background:C.bgDeep, borderRadius:8, borderLeft:`2px solid ${m.type==="urgent"?C.red:C.border}` }}>
              <div style={{ fontSize:9, color:C.textMuted, marginBottom:4 }}>{m.date}</div>
              <div style={{ fontSize:11, color:C.textSub, lineHeight:1.7 }}>{m.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Patient: Tests ─────────────────────────────────────────────────────────────
function PtTests({ p, proto, hist }) {
  const maxVal = Math.max(...hist.map(h=>h.value));
  const normal = proto?.critical_threshold;
  const normalPct = normal ? (normal/(maxVal*1.15))*100 : null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={pt.card}>
        <div style={pt.cardLabel}>{p.last_test} HISTORY — {hist.length} READINGS</div>
        <div style={{ position:"relative", height:180, marginBottom:8, marginTop:8 }}>
          {normalPct && <div style={{ position:"absolute", left:0, right:0, bottom:`${normalPct}%`, borderTop:`1px dashed ${C.border}`, display:"flex", alignItems:"center", justifyContent:"flex-end" }}><span style={{ fontSize:8, color:C.textMuted, background:C.bgCard, padding:"0 4px" }}>critical · {normal} {proto?.unit}</span></div>}
          <div style={{ display:"flex", alignItems:"flex-end", height:"100%", gap:6, padding:"0 4px" }}>
            {hist.map((h,i) => {
              const pct = (h.value/(maxVal*1.15))*100;
              const isBad = normal && h.value >= normal;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ fontSize:9, color:C.textMuted, marginBottom:3 }}>{h.value}</div>
                  <div style={{ width:"100%", height:140, display:"flex", alignItems:"flex-end", background:C.bgRow, borderRadius:4 }}>
                    <div style={{ width:"100%", height:`${pct}%`, background:isBad?C.red:C.blue, borderRadius:"4px 4px 0 0", transition:"height 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize:8, color:C.textDim, marginTop:4 }}>{h.date.slice(2,7)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display:"flex", gap:16, fontSize:9, color:C.textMuted, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
          <span><span style={{ display:"inline-block", width:10, height:10, background:C.red, borderRadius:2, marginRight:5 }}/>Above threshold</span>
          <span><span style={{ display:"inline-block", width:10, height:10, background:C.blue, borderRadius:2, marginRight:5 }}/>Normal range</span>
        </div>
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>DETAILED RECORDS</div>
        <table style={{ width:"100%", borderCollapse:"collapse", marginTop:8 }}>
          <thead><tr style={{ background:C.bgDeep }}>{["#","Date","Test","Value","Unit","Status","Change"].map((h,i)=><th key={i} style={{ padding:"8px 12px", textAlign:"left", fontSize:8, color:C.textDimmer, letterSpacing:2, borderBottom:`1px solid ${C.border}`, fontWeight:400 }}>{h}</th>)}</tr></thead>
          <tbody>
            {[...hist].reverse().map((h,i) => {
              const orig = hist.length-1-i; const prev = hist[orig-1];
              const delta = prev ? h.value - prev.value : null;
              const isBad = normal && h.value >= normal;
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${C.bgRow}` }}>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{String(hist.length-i).padStart(2,"0")}</td>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{h.date}</td>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub }}>{p.last_test}</td>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub, fontFamily:"monospace", fontWeight:700, textDecoration:isBad?"underline":"none" }}>{h.value}</td>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{proto?.unit}</td>
                  <td style={{ padding:"9px 12px", fontSize:11 }}><span style={{ fontSize:9, padding:"2px 7px", border:`1px solid ${isBad?C.red:C.border}`, color:isBad?C.red:C.textMuted, borderRadius:4, letterSpacing:1 }}>{isBad?"ABOVE RANGE":"NORMAL"}</span></td>
                  <td style={{ padding:"9px 12px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{delta!==null?<span style={{ color:delta>0?C.red:C.green }}>{delta>0?"+":""}{delta.toFixed(1)} {proto?.unit}</span>:<span style={{ color:C.textDimmer }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize:9, color:C.textMuted, marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>Normal range: {proto?.normal_range} · Critical threshold: ≥ {proto?.critical_threshold} {proto?.unit}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:C.border, borderRadius:12, overflow:"hidden" }}>
        {[["DIAGNOSIS",p.diagnosis],["TEST",proto?.test_name],["FREQUENCY",`Every ${proto?.frequency_days} days`],["NORMAL RANGE",proto?.normal_range],["DAYS OVERDUE",p.overdue_days]].map(([label,val],i) => (
          <div key={i} style={{ background:C.bgCard, padding:"14px 16px" }}>
            <div style={{ fontSize:8, color:C.textMuted, letterSpacing:2, marginBottom:6 }}>{label}</div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Patient: Appointments ──────────────────────────────────────────────────────
function PtAppointments({ p, appts, doc, proto }) {
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

// ── Patient: Messages ──────────────────────────────────────────────────────────
function PtMessages({ p, msgs }) {
  const [reply, setReply] = useState("");
  const [sent, setSent]   = useState([]);
  const [typing, setTyping] = useState(false);
  const handleSend = () => {
    if (!reply.trim()) return;
    setTyping(true);
    setSent(prev => [...prev, { text:reply, date:new Date().toISOString().slice(0,10) }]);
    setReply("");
    setTimeout(() => setTyping(false), 1200);
  };
  const allMsgs = [...(msgs||[])].reverse();
  const msgBorderColor = (type) => type==="urgent"?C.red:type==="reminder"?C.orange:type==="info"?C.blue:C.green;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={pt.card}>
        <div style={pt.cardLabel}>MESSAGES FROM KATHIR MEMORIAL HOSPITAL</div>
        {allMsgs.length===0 && <div style={{ fontSize:11, color:C.textMuted, padding:"16px 0" }}>No messages yet.</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:allMsgs.length?12:0 }}>
          {allMsgs.map((m,i) => (
            <div key={i} style={{ padding:"12px 14px", background:C.bgDeep, borderLeft:`3px solid ${msgBorderColor(m.type)}`, borderRadius:"0 8px 8px 0" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted }}>CARE TEAM · {p.preferred_channel}</span>
                <span style={{ fontSize:9, color:C.textDim }}>{m.date}</span>
                {m.type==="urgent"   && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.red}`,    color:C.red,    letterSpacing:1, borderRadius:4 }}>URGENT</span>}
                {m.type==="reminder" && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.orange}`, color:C.orange, letterSpacing:1, borderRadius:4 }}>REMINDER</span>}
                {m.type==="info"     && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.blue}`,   color:C.blue,   letterSpacing:1, borderRadius:4 }}>INFO</span>}
                {m.type==="response" && <span style={{ fontSize:8, padding:"1px 6px", border:`1px solid ${C.green}`,  color:C.green,  letterSpacing:1, borderRadius:4 }}>REPLY</span>}
              </div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>{m.msg}</div>
            </div>
          ))}
          {sent.map((m,i) => (
            <div key={`s${i}`} style={{ padding:"12px 14px", background:C.blueFaint, borderLeft:`3px solid ${C.blue}`, borderRadius:"0 8px 8px 0", marginLeft:32 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}><span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted }}>YOU</span><span style={{ fontSize:9, color:C.textDim }}>{m.date}</span></div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.8 }}>{m.text}</div>
            </div>
          ))}
          {typing && <div style={{ padding:"12px 14px", background:C.bgDeep, borderLeft:`3px solid ${C.border}`, borderRadius:"0 8px 8px 0" }}><div style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:C.textMuted, marginBottom:8 }}>CARE TEAM</div><div style={{ fontSize:12, color:C.textDimmer, letterSpacing:3 }}>. . .</div></div>}
        </div>
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>REPLY TO CARE TEAM</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["YES, book home collection","Need to reschedule","I have a question"].map((q,i) => (
              <button key={i} onClick={() => setReply(q)} style={{ fontSize:10, padding:"6px 12px", border:`1px solid ${C.border}`, background:C.bgDeep, cursor:"pointer", fontFamily:"monospace", color:C.textSub, borderRadius:8 }}>{q}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your message…" style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", fontSize:11, fontFamily:"monospace", outline:"none", resize:"none", color:C.text, background:C.bgDeep }} rows={3} />
            <button onClick={handleSend} style={{ padding:"10px 18px", background:`linear-gradient(135deg,#1565a8,#2980c4)`, color:"#fff", border:"none", borderRadius:9, fontSize:11, fontFamily:"monospace", cursor:"pointer", letterSpacing:1, fontWeight:700, flexShrink:0 }}>SEND →</button>
          </div>
        </div>
        <div style={{ fontSize:9, color:C.textMuted, marginTop:4 }}>Messages are delivered via {p.preferred_channel}. Response time: within 24 hours.</div>
      </div>
    </div>
  );
}

// ── Patient: Profile ───────────────────────────────────────────────────────────
function PtProfile({ p, doc, proto }) {
  const sections = [
    { section:"PERSONAL INFORMATION", items:[
      { label:"Full Name",  value:p.patient_name },
      { label:"Patient ID", value:`#${String(p.patient_id).padStart(4,"0")}` },
      { label:"Age",        value:`${p.age} years` },
      { label:"Gender",     value:p.gender==="M"?"Male":"Female" },
      { label:"Registered", value:p.registered_date },
    ]},
    { section:"CONTACT DETAILS", items:[
      { label:"Phone",            value:p.phone },
      { label:"Email",            value:p.email },
      { label:"Address",          value:p.address },
      { label:"Preferred Channel",value:p.preferred_channel },
      { label:"Smartphone",       value:p.has_smartphone?"Yes":"No (NOK contact enabled)" },
    ]},
    { section:"MEDICAL INFORMATION", items:[
      { label:"Primary Diagnosis",value:p.diagnosis },
      { label:"Monitoring Test",  value:proto?.test_name },
      { label:"Test Frequency",   value:`Every ${proto?.frequency_days} days` },
      { label:"Normal Range",     value:proto?.normal_range },
      { label:"Last Test Date",   value:p.last_date },
      { label:"Last Result",      value:`${p.last_value} ${proto?.unit}` },
      { label:"Days Overdue",     value:`${p.overdue_days} days` },
      { label:"Care Gap Status",  value:STATUS_MAP[p.status] },
    ]},
    { section:"CARE TEAM", items:[
      { label:"Physician",  value:doc?.physician_name },
      { label:"Specialty",  value:doc?.specialty },
      { label:"Hospital",   value:doc?.hospital },
      { label:"Contact",    value:doc?.phone },
    ]},
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {sections.map((sec,si) => (
        <div key={si} style={pt.card}>
          <div style={pt.cardLabel}>{sec.section}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {sec.items.map((f,fi) => (
              <div key={fi} style={{ border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", background:C.bgDeep }}>
                <div style={{ fontSize:8, color:C.textMuted, letterSpacing:2, marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={pt.card}>
        <div style={pt.cardLabel}>PHYSICIAN REMARKS</div>
        <div style={{ background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:10, padding:12 }}>
          <div style={{ fontSize:11, color:C.textSub, lineHeight:1.8 }}>{p.doctor_remarks}</div>
        </div>
      </div>
    </div>
  );
}

// ── Patient Mini Chart ─────────────────────────────────────────────────────────


// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f0f4ff;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulseRing{0%{transform:scale(1);opacity:0.3}70%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:0}}
  .fadeIn{animation:fadeIn 0.22s ease}
  .fadeSlide{animation:fadeSlide 0.28s ease}
  button:hover{opacity:0.82;transition:opacity 0.15s}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:#f0f4ff}
  ::-webkit-scrollbar-thumb{background:#d4ddf5}
  tr:hover{background:rgba(14,127,194,0.03)!important}
  input::placeholder,textarea::placeholder{color:#b8c4dc}
`;

// Home styles


// Doctor styles


// Patient portal styles
const pt = {
  root:  { minHeight:"100vh", background:C.bg, fontFamily:"'DM Mono', monospace", color:C.text, display:"flex", flexDirection:"column" },
  topbar:{ background:C.bgCard, borderBottom:`1px solid ${C.border}`, padding:"12px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  card:  { background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" },
  cardLabel:{ fontSize:8, color:C.textMuted, letterSpacing:2, paddingBottom:12, borderBottom:`1px solid ${C.border}`, marginBottom:14 },
};
