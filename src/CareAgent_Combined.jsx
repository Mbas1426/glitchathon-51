import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import HomePage from './components/HomePage.jsx';
import DoctorApp from './components/DoctorApp.jsx';
import PatientApp from './components/PatientApp.jsx';
import { C } from './styles/homeStyles.jsx'

// ─── Shared Data ──────────────────────────────────────────────────────────────
export const PATIENTS = [
  { patient_id: 1, patient_name: "Rajesh Kumar", age: 58, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 9.5, last_date: "2024-07-10", overdue_days: 120, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue", phone: "+91 98401 23456", email: "rajesh.k@email.com", address: "14, Anna Nagar, Chennai", registered_date: "2021-03-12", doctor_remarks: "HbA1c critically elevated. Increase Metformin dosage and restrict carbohydrate intake. Urgent follow-up required within 2 weeks." },
  { patient_id: 2, patient_name: "Meena Sundaram", age: 72, gender: "F", diagnosis: "CKD", last_test: "Creatinine", last_value: 3.2, last_date: "2024-06-15", overdue_days: 145, physician_id: 2, preferred_channel: "SMS", has_smartphone: 0, status: "overdue", phone: "+91 94401 78901", email: "meena.s@email.com", address: "7, T Nagar, Chennai", registered_date: "2020-08-05", doctor_remarks: "Creatinine levels indicate Stage 3 CKD. Avoid NSAIDs. Restrict protein intake. Nephrology consult scheduled." },
  { patient_id: 3, patient_name: "Suresh Babu", age: 65, gender: "M", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 165, last_date: "2024-08-20", overdue_days: 74, physician_id: 3, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue", phone: "+91 99401 34567", email: "suresh.b@email.com", address: "22, Adyar, Chennai", registered_date: "2022-01-18", doctor_remarks: "BP remains uncontrolled. Amlodipine dose reviewed. Salt restriction and daily walking strictly advised." },
  { patient_id: 4, patient_name: "Lakshmi Patel", age: 54, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 8.9, last_date: "2024-07-05", overdue_days: 95, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue", phone: "+91 93401 56789", email: "lakshmi.p@email.com", address: "5, Velachery, Chennai", registered_date: "2021-11-30", doctor_remarks: "TSH elevated above threshold. Levothyroxine dose to be adjusted. Avoid soy products and excess fiber near medication time." },
  { patient_id: 5, patient_name: "Vijay Krishnan", age: 61, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 7.1, last_date: "2024-09-01", overdue_days: 52, physician_id: 1, preferred_channel: "SMS", has_smartphone: 1, status: "pending", phone: "+91 91401 90123", email: "vijay.k@email.com", address: "9, Porur, Chennai", registered_date: "2022-06-14", doctor_remarks: "HbA1c borderline. Continue current medication and monitor diet. Schedule next test before end of month." },
  { patient_id: 6, patient_name: "Anitha Rajan", age: 68, gender: "F", diagnosis: "CKD", last_test: "Creatinine", last_value: 1.8, last_date: "2024-08-10", overdue_days: 81, physician_id: 2, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue", phone: "+91 98001 45678", email: "anitha.r@email.com", address: "33, Mylapore, Chennai", registered_date: "2020-05-22", doctor_remarks: "Early CKD — creatinine rising trend. Hydration is key. Avoid contrast dyes. Annual kidney ultrasound due." },
  { patient_id: 7, patient_name: "Mohan Das", age: 77, gender: "M", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 145, last_date: "2024-09-15", overdue_days: 38, physician_id: 3, preferred_channel: "Call", has_smartphone: 0, status: "pending", phone: "+91 97001 67890", email: "mohan.d@email.com", address: "11, Tambaram, Chennai", registered_date: "2019-09-08", doctor_remarks: "BP marginally elevated. Continue Telmisartan. Morning BP readings to be logged and shared at next visit." },
  { patient_id: 8, patient_name: "Saranya Iyer", age: 45, gender: "F", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 11.2, last_date: "2024-06-01", overdue_days: 160, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "escalated", phone: "+91 96001 89012", email: "saranya.i@email.com", address: "18, Guindy, Chennai", registered_date: "2021-07-03", doctor_remarks: "URGENT: HbA1c at 11.2% is dangerously high. Risk of diabetic ketoacidosis. Insulin therapy initiated. Report any dizziness or vomiting immediately." },
  { patient_id: 9, patient_name: "Prakash Nair", age: 70, gender: "M", diagnosis: "CKD", last_test: "Creatinine", last_value: 4.1, last_date: "2024-05-20", overdue_days: 173, physician_id: 2, preferred_channel: "SMS", has_smartphone: 0, status: "escalated", phone: "+91 95001 01234", email: "prakash.n@email.com", address: "2, Perambur, Chennai", registered_date: "2018-12-15", doctor_remarks: "URGENT: Creatinine 4.1 mg/dL — Stage 4 CKD. Dialysis evaluation scheduled. Strict fluid and potassium restriction. Do not miss next appointment." },
  { patient_id: 10, patient_name: "Deepa Venkat", age: 52, gender: "F", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 5.2, last_date: "2024-09-10", overdue_days: 43, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "responded", phone: "+91 94001 23456", email: "deepa.v@email.com", address: "6, Nungambakkam, Chennai", registered_date: "2022-04-19", doctor_remarks: "TSH slightly above range. Minor Levothyroxine adjustment made. Repeat test in 6 weeks. Home collection confirmed." },
  { patient_id: 11, patient_name: "Ganesh Murthy", age: 63, gender: "M", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 8.8, last_date: "2024-07-25", overdue_days: 105, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "overdue", phone: "+91 93001 45678", email: "ganesh.m@email.com", address: "44, Kodambakkam, Chennai", registered_date: "2020-10-27", doctor_remarks: "HbA1c 8.8% — poorly controlled. Review carbohydrate intake. Consider adding DPP-4 inhibitor. Weight loss of 3–5kg recommended." },
  { patient_id: 12, patient_name: "Revathi Chandran", age: 80, gender: "F", diagnosis: "Hypertension", last_test: "BP Panel", last_value: 178, last_date: "2024-06-30", overdue_days: 130, physician_id: 3, preferred_channel: "Call", has_smartphone: 0, status: "escalated", phone: "+91 92001 67890", email: "revathi.c@email.com", address: "3, Chromepet, Chennai", registered_date: "2017-06-11", doctor_remarks: "URGENT: BP 178 mmHg is hypertensive crisis level. Immediate medication review done. Family to monitor daily. Avoid exertion." },
  { patient_id: 13, patient_name: "Senthil Kumar", age: 59, gender: "M", diagnosis: "CKD", last_test: "Creatinine", last_value: 2.4, last_date: "2024-08-05", overdue_days: 86, physician_id: 2, preferred_channel: "SMS", has_smartphone: 1, status: "responded", phone: "+91 91001 89012", email: "senthil.k@email.com", address: "7, Sholinganallur, Chennai", registered_date: "2021-02-09", doctor_remarks: "Creatinine slowly rising. Maintain low-protein diet. Avoid dehydration. Annual eGFR measurement scheduled." },
  { patient_id: 14, patient_name: "Usha Balasubramaniam", age: 66, gender: "F", diagnosis: "Diabetes", last_test: "HbA1c", last_value: 6.8, last_date: "2024-09-20", overdue_days: 33, physician_id: 1, preferred_channel: "WhatsApp", has_smartphone: 1, status: "closed", phone: "+91 90001 01234", email: "usha.b@email.com", address: "29, Besant Nagar, Chennai", registered_date: "2022-08-16", doctor_remarks: "HbA1c well managed at 6.8%. Excellent compliance. Continue current regimen. Next review in 3 months." },
  { patient_id: 15, patient_name: "Ravi Subramanian", age: 74, gender: "M", diagnosis: "Hypothyroidism", last_test: "TSH", last_value: 12.4, last_date: "2024-07-15", overdue_days: 115, physician_id: 1, preferred_channel: "SMS", has_smartphone: 0, status: "overdue", phone: "+91 89001 23456", email: "ravi.s@email.com", address: "15, Royapuram, Chennai", registered_date: "2019-04-23", doctor_remarks: "TSH 12.4 — severely hypothyroid. Levothyroxine dose doubled. Monitor for cardiac symptoms. Family member to supervise medication." },
];

export const PHYSICIANS = [
  { physician_id: 1, physician_name: "Dr. Priya Sharma", specialty: "Endocrinology", phone: "+91 044-2345-6789", hospital: "Kathir Memorial Hospital" },
  { physician_id: 2, physician_name: "Dr. Arjun Mehta", specialty: "Nephrology", phone: "+91 044-2345-6790", hospital: "Kathir Memorial Hospital" },
  { physician_id: 3, physician_name: "Dr. Kavitha Nair", specialty: "Cardiology", phone: "+91 044-2345-6791", hospital: "Kathir Memorial Hospital" },
];

export const CARE_PROTOCOLS = [
  { diagnosis_name: "Diabetes", test_name: "HbA1c", frequency_days: 90, normal_range: "4.0–5.6%", unit: "%", critical_threshold: 9.0 },
  { diagnosis_name: "CKD", test_name: "Creatinine", frequency_days: 180, normal_range: "0.7–1.3 mg/dL", unit: "mg/dL", critical_threshold: 3.0 },
  { diagnosis_name: "Hypertension", test_name: "BP Panel", frequency_days: 60, normal_range: "< 140 mmHg", unit: "mmHg", critical_threshold: 160 },
  { diagnosis_name: "Hypothyroidism", test_name: "TSH", frequency_days: 90, normal_range: "0.4–4.0 mIU/L", unit: "mIU/L", critical_threshold: 8.0 },
];

export const TEST_HISTORY = {
  1: [{ date: "2023-04-12", value: 7.4 }, { date: "2023-07-18", value: 7.9 }, { date: "2023-10-22", value: 8.4 }, { date: "2024-01-18", value: 8.7 }, { date: "2024-04-22", value: 9.0 }, { date: "2024-07-10", value: 9.5 }],
  2: [{ date: "2023-06-05", value: 1.6 }, { date: "2023-09-11", value: 1.9 }, { date: "2023-12-08", value: 2.2 }, { date: "2024-03-20", value: 2.9 }, { date: "2024-06-15", value: 3.2 }],
  3: [{ date: "2023-08-10", value: 136 }, { date: "2023-11-15", value: 141 }, { date: "2024-01-10", value: 148 }, { date: "2024-04-15", value: 155 }, { date: "2024-06-30", value: 158 }, { date: "2024-08-20", value: 165 }],
  4: [{ date: "2023-07-01", value: 4.8 }, { date: "2023-10-14", value: 6.2 }, { date: "2024-01-20", value: 7.4 }, { date: "2024-04-09", value: 8.1 }, { date: "2024-07-05", value: 8.9 }],
  5: [{ date: "2023-09-05", value: 6.2 }, { date: "2023-12-12", value: 6.5 }, { date: "2024-03-18", value: 6.8 }, { date: "2024-06-22", value: 7.0 }, { date: "2024-09-01", value: 7.1 }],
  6: [{ date: "2023-08-20", value: 1.1 }, { date: "2023-11-30", value: 1.3 }, { date: "2024-02-14", value: 1.5 }, { date: "2024-05-14", value: 1.7 }, { date: "2024-08-10", value: 1.8 }],
  7: [{ date: "2024-01-05", value: 138 }, { date: "2024-04-20", value: 141 }, { date: "2024-07-11", value: 143 }, { date: "2024-09-15", value: 145 }],
  8: [{ date: "2023-06-14", value: 8.2 }, { date: "2023-09-29", value: 9.1 }, { date: "2023-12-07", value: 9.9 }, { date: "2024-03-07", value: 10.6 }, { date: "2024-06-01", value: 11.2 }],
  9: [{ date: "2023-05-18", value: 2.2 }, { date: "2023-08-04", value: 2.8 }, { date: "2023-11-22", value: 3.3 }, { date: "2024-02-22", value: 3.7 }, { date: "2024-05-20", value: 4.1 }],
  10: [{ date: "2023-09-18", value: 3.8 }, { date: "2023-12-25", value: 4.1 }, { date: "2024-03-30", value: 4.7 }, { date: "2024-06-30", value: 5.0 }, { date: "2024-09-10", value: 5.2 }],
  11: [{ date: "2023-07-05", value: 7.2 }, { date: "2023-10-14", value: 7.7 }, { date: "2024-01-28", value: 8.2 }, { date: "2024-04-28", value: 8.5 }, { date: "2024-07-25", value: 8.8 }],
  12: [{ date: "2023-06-22", value: 148 }, { date: "2023-09-08", value: 155 }, { date: "2024-01-08", value: 162 }, { date: "2024-03-31", value: 170 }, { date: "2024-06-30", value: 178 }],
  13: [{ date: "2023-08-11", value: 1.4 }, { date: "2023-11-18", value: 1.7 }, { date: "2024-02-07", value: 1.9 }, { date: "2024-05-18", value: 2.1 }, { date: "2024-08-05", value: 2.4 }],
  14: [{ date: "2023-09-01", value: 7.8 }, { date: "2023-12-10", value: 7.4 }, { date: "2024-03-15", value: 7.1 }, { date: "2024-06-25", value: 7.0 }, { date: "2024-09-20", value: 6.8 }],
  15: [{ date: "2023-07-28", value: 6.8 }, { date: "2023-10-22", value: 8.9 }, { date: "2024-01-16", value: 10.6 }, { date: "2024-04-16", value: 11.8 }, { date: "2024-07-15", value: 12.4 }],
};

export const OUTREACH_MSGS = {
  1: [{ date: "2025-02-10", msg: "Your HbA1c is 120 days overdue. Last value 9.5% was critically high. Please book a home collection immediately.", type: "urgent" }, { date: "2025-01-12", msg: "Reminder: HbA1c test is due. Please schedule at your earliest convenience.", type: "reminder" }],
  8: [{ date: "2025-03-01", msg: "URGENT: Your HbA1c of 11.2% indicates dangerously uncontrolled diabetes. Dr. Priya Sharma has been alerted. Please call the hospital today.", type: "urgent" }, { date: "2025-02-01", msg: "Your HbA1c test is overdue by 130 days. Please respond to schedule a home collection.", type: "urgent" }],
  9: [{ date: "2025-03-02", msg: "ESCALATED: Creatinine 4.1 mg/dL with 173 days overdue. Dr. Arjun Mehta requires you to attend in-person immediately.", type: "urgent" }],
  10: [{ date: "2025-03-07", msg: "Your home sample collection has been confirmed for Saturday. Our technician will arrive between 8–10 AM.", type: "info" }, { date: "2025-02-25", msg: "TSH test is 43 days overdue. Would you like to book a home collection? Reply YES to confirm.", type: "reminder" }],
  13: [{ date: "2025-03-06", msg: "We received your query 'Is it really urgent?'. Yes — your Creatinine trend is rising. Early intervention prevents dialysis. Please book today.", type: "response" }],
};

export const APPOINTMENTS = {
  1: [{ date: "2024-07-10", type: "Test + Consultation", doc: "Dr. Priya Sharma", result: "HbA1c: 9.5%" }, { date: "2024-04-22", type: "Test + Consultation", doc: "Dr. Priya Sharma", result: "HbA1c: 9.0%" }, { date: "2024-01-18", type: "Routine Test", doc: "Dr. Priya Sharma", result: "HbA1c: 8.7%" }],
  2: [{ date: "2024-06-15", type: "Nephrology Review", doc: "Dr. Arjun Mehta", result: "Creatinine: 3.2 mg/dL" }, { date: "2024-03-20", type: "Routine Test", doc: "Dr. Arjun Mehta", result: "Creatinine: 2.9 mg/dL" }],
  8: [{ date: "2024-06-01", type: "Emergency Review", doc: "Dr. Priya Sharma", result: "HbA1c: 11.2% — Insulin started" }, { date: "2024-03-07", type: "Routine Test", doc: "Dr. Priya Sharma", result: "HbA1c: 10.6%" }],
  14: [{ date: "2024-09-20", type: "Routine Test", doc: "Dr. Priya Sharma", result: "HbA1c: 6.8% — Well controlled" }, { date: "2024-06-25", type: "Routine Test", doc: "Dr. Priya Sharma", result: "HbA1c: 7.0%" }],
};

export const OUTREACH_RESPONSES = [
  { patient_id: 10, type: "agreed", message: "Yes, please book the home collection for this Saturday.", date: "2025-03-07" },
  { patient_id: 13, type: "question", message: "Is it really urgent? I feel fine.", date: "2025-03-06" },
  { patient_id: 5, type: "declined", message: "I'm traveling next month. Will do it later.", date: "2025-03-08" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getRiskTier = (p) => {
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  if (!proto) return "low";
  if (p.overdue_days > 120 || p.last_value >= proto.critical_threshold * 1.2) return "critical";
  if (p.overdue_days > 60 || p.last_value >= proto.critical_threshold) return "high";
  return "moderate";
};
export const getRiskColor = (tier) => ({
  critical: C.red, high: C.orange, moderate: C.green, low: C.blue,
}[tier] || C.blue);
export const getStatusBadge = (status) => ({
  overdue: { label: "Overdue", bg: C.redDim, color: C.red },
  escalated: { label: "Escalated", bg: C.redDim, color: C.red },
  pending: { label: "Pending", bg: C.orangeDim, color: C.orange },
  responded: { label: "Responded", bg: C.greenDim, color: C.green },
  closed: { label: "Closed", bg: C.blueDim, color: C.blue },
}[status] || { label: status, bg: "#f0f0f0", color: "#888" });
export const getChannelIcon = (ch) => ({ WhatsApp: "💬", SMS: "📱", Call: "📞", Email: "✉️" }[ch] || "📨");
export const diagIcon = (d) => ({ Diabetes: "🩸", CKD: "🫘", Hypertension: "💓", Hypothyroidism: "🦋" }[d] || "🏥");
export const DIAG_ABBR = { Diabetes: "DM", CKD: "CKD", Hypertension: "HTN", Hypothyroidism: "HYPO" };
export const STATUS_MAP = { overdue: "OVERDUE", escalated: "ESCALATED", pending: "PENDING", responded: "RESPONDED", closed: "UP TO DATE" };

function DoctorRouteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = PHYSICIANS.find(p => p.physician_id === parseInt(id));
  if (!doctor) return <div>Doctor not found</div>;
  return <DoctorApp doctor={doctor} onLogout={() => navigate("/")} />;
}

function PatientRouteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = PATIENTS.find(p => p.patient_id === parseInt(id));
  if (!patient) return <div>Patient not found</div>;
  return <PatientApp patient={patient} onLogout={() => navigate("/")} />;
}

export default function CareAgent() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <HomePage
          onDoctor={(id) => navigate(`/doctor/${id}/dashboard`)}
          onPatient={(id) => navigate(`/patient/${id}/overview`)}
        />
      } />
      <Route path="/doctor/:id/*" element={<DoctorRouteWrapper />} />
      <Route path="/patient/:id/*" element={<PatientRouteWrapper />} />
    </Routes>
  );
}
