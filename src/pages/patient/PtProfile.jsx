import { pt } from '../../styles/patientStyles.jsx';
import { C } from '../../styles/homeStyles.jsx';
import { STATUS_MAP } from "../CareAgent_Combined.jsx";


export default function PtProfile({ p, doc, proto }) {
  const sections = [
    {
      section: "PERSONAL INFORMATION", items: [
        { label: "Full Name", value: p.patient_name },
        { label: "Patient ID", value: `#${String(p.patient_id).padStart(4, "0")}` },
        { label: "Age", value: `${p.age} years` },
        { label: "Gender", value: p.gender === "M" ? "Male" : "Female" },
        { label: "Registered", value: p.registered_date },
      ]
    },
    {
      section: "CONTACT DETAILS", items: [
        { label: "Phone", value: p.phone },
        { label: "Email", value: p.email },
        { label: "Address", value: p.address },
        { label: "Preferred Channel", value: p.preferred_channel },
        { label: "Smartphone", value: p.has_smartphone ? "Yes" : "No (NOK contact enabled)" },
      ]
    },
    {
      section: "MEDICAL INFORMATION", items: [
        { label: "Primary Diagnosis", value: p.diagnosis },
        { label: "Monitoring Test", value: proto?.test_name },
        { label: "Test Frequency", value: `Every ${proto?.frequency_days} days` },
        { label: "Normal Range", value: proto?.normal_range },
        { label: "Last Test Date", value: p.last_date },
        { label: "Last Result", value: `${p.last_value} ${proto?.unit}` },
        { label: "Days Overdue", value: `${p.overdue_days} days` },
        { label: "Care Gap Status", value: STATUS_MAP[p.status] },
      ]
    },
    {
      section: "CARE TEAM", items: [
        { label: "Physician", value: doc?.physician_name },
        { label: "Specialty", value: doc?.specialty },
        { label: "Hospital", value: doc?.hospital },
        { label: "Contact", value: doc?.phone },
      ]
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sections.map((sec, si) => (
        <div key={si} style={pt.card}>
          <div style={pt.cardLabel}>{sec.section}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {sec.items.map((f, fi) => (
              <div key={fi} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", background: C.bgDeep }}>
                <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={pt.card}>
        <div style={pt.cardLabel}>PHYSICIAN REMARKS</div>
        <div style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.8 }}>{p.doctor_remarks}</div>
        </div>
      </div>
    </div>
  );
}