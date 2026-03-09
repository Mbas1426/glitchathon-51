import React, { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import HomePage from './components/HomePage.jsx';
import DoctorApp from './components/DoctorApp.jsx';
import PatientApp from './components/PatientApp.jsx';
import { C } from './styles/homeStyles.jsx'

export const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

// ─── Helpers (Static) ─────────────────────────────────────────────────────────

export const getRiskColor = (tier) => ({
  critical: C.red, high: C.orange, moderate: C.green, low: C.blue,
}[tier] || C.blue);

export const getStatusBadge = (status) => ({
  overdue: { label: "Overdue", bg: "rgba(255, 59, 48, 0.1)", color: C.red },
  escalated: { label: "Escalated", bg: "rgba(255, 59, 48, 0.1)", color: C.red },
  pending: { label: "Pending", bg: "rgba(255, 149, 0, 0.1)", color: "#FF9500" },
  responded: { label: "Responded", bg: "rgba(52, 199, 89, 0.1)", color: "#34C759" },
  closed: { label: "Closed", bg: "rgba(0, 113, 227, 0.1)", color: C.blue },
}[status] || { label: status, bg: "#f0f0f0", color: "#888" });

export const getChannelIcon = (ch) => ({ WhatsApp: "WA", SMS: "SMS", Call: "TEL", Email: "EML" }[ch] || "MSG");
export const diagIcon = (d) => ({ Diabetes: "DM", CKD: "CKD", Hypertension: "HTN", Hypothyroidism: "HYP" }[d] || "MED");
export const DIAG_ABBR = { Diabetes: "DM", CKD: "CKD", Hypertension: "HTN", Hypothyroidism: "HYPO" };
export const STATUS_MAP = { overdue: "OVERDUE", escalated: "ESCALATED", pending: "PENDING", responded: "RESPONDED", closed: "UP TO DATE" };

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  if (!data) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: '-apple-system, sans-serif' }}>Loading...</div>;

  const { protocols } = data;

  const getRiskTier = (p) => {
    const proto = protocols.find(c => c.diagnosis_name === p.diagnosis);
    if (!proto) return "low";
    if (p.overdue_days > 120 || p.last_value >= proto.critical_threshold * 1.2) return "critical";
    if (p.overdue_days > 60 || p.last_value >= proto.critical_threshold) return "high";
    return "moderate";
  };

  const value = {
    PATIENTS: data.patients || [],
    PHYSICIANS: data.physicians || [],
    CARE_PROTOCOLS: protocols || [],
    APPOINTMENTS: data.appointments || {},
    TEST_HISTORY: data.testHistory || {},
    OUTREACH_MSGS: data.outreachMsgs || {},
    OUTREACH_RESPONSES: data.outreachResponses || [],
    getRiskTier, getRiskColor, getStatusBadge, getChannelIcon, diagIcon, DIAG_ABBR, STATUS_MAP
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

function DoctorRouteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { PHYSICIANS } = useData();
  const doctor = PHYSICIANS.find(p => p.physician_id === parseInt(id));
  if (!doctor) return <div>Doctor not found</div>;
  return <DoctorApp doctor={doctor} onLogout={() => navigate("/")} />;
}

function PatientRouteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { PATIENTS } = useData();
  const patient = PATIENTS.find(p => p.patient_id === parseInt(id));
  if (!patient) return <div>Patient not found</div>;
  return <PatientApp patient={patient} onLogout={() => navigate("/")} />;
}

export default function CareAgent() {
  const navigate = useNavigate();

  return (
    <DataProvider>
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
    </DataProvider>
  );
}
