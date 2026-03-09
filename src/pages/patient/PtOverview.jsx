import { pt } from '../../styles/patientStyles.jsx'
import { C, h } from '../../styles/homeStyles.jsx'
import PtMiniChart from '../../components/PtMiniChart.jsx';

export default function PtOverview({ p, proto, doc, hist, msgs }) {
  const bad = proto && p.last_value >= proto.critical_threshold;
  const latest = hist[hist.length - 1], prev = hist[hist.length - 2];
  const trend = prev ? (latest?.value > prev.value ? "↑" : latest?.value < prev.value ? "↓" : "→") : "—";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Status strip */}
      <div style={pt.card}>
        <div style={pt.cardLabel}>CURRENT CARE STATUS</div>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {[
            { num: p.last_value, unit: proto?.unit, desc: `Last ${p.last_test} · ${p.last_date}`, warn: bad ? "ABOVE SAFE RANGE (" + proto?.normal_range + ")" : null, warnColor: C.red },
            { num: p.overdue_days, unit: "days", desc: "Test overdue", warn: p.overdue_days > 30 ? "IMMEDIATE TEST REQUIRED" : null, warnColor: C.red },
            { num: trend, unit: "", desc: "Value trend (last 2 results)", warn: trend === "↑" && bad ? "WORSENING TREND" : null, warnColor: C.red },
            { num: proto?.frequency_days + "d", unit: "", desc: "Recommended frequency", warn: "Normal: " + proto?.normal_range, warnColor: C.textMuted },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, padding: "8px 16px 4px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1, color: C.text }}>{item.num}<span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted }}>{item.unit && " " + item.unit}</span></div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{item.desc}</div>
              {item.warn && <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, marginTop: 6, color: item.warnColor }}>{item.warn}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Mini chart */}
        <div style={pt.card}>
          <div style={pt.cardLabel}>RESULT TREND — LAST {hist.length} READINGS</div>
          <PtMiniChart hist={hist} threshold={proto?.critical_threshold} />
        </div>
        {/* Doctor */}
        <div style={pt.card}>
          <div style={pt.cardLabel}>YOUR PHYSICIAN</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{doc?.physician_name}</div>
          <div style={{ fontSize: 11, color: C.textSub }}>{doc?.specialty}</div>
          <div style={{ fontSize: 10, color: C.textMuted }}>{doc?.hospital}</div>
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, marginBottom: 12 }}>{doc?.phone}</div>
          <div style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 6 }}>LATEST REMARKS</div>
            <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.8 }}>{p.doctor_remarks}</div>
          </div>
        </div>
      </div>

      {/* Action items */}
      <div style={{ ...pt.card, border: `1px solid ${p.status === "escalated" ? C.red + "60" : C.border}` }}>
        <div style={pt.cardLabel}>WHAT YOU NEED TO DO</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 4 }}>
          {[
            {
              n: "01", title: p.status === "closed" ? "Tests Up to Date" : `Book Your ${p.last_test} Test`,
              body: p.status === "closed" ? `Your latest result of ${p.last_value} ${proto?.unit} is within range. Maintain current medication.` : `Your ${p.last_test} is ${p.overdue_days} days overdue.${bad ? " Last result was critically high." : ""} Reply YES to book home collection.`,
              cta: p.status === "closed" ? null : "Book Home Collection"
            },
            { n: "02", title: "Follow Medication Protocol", body: `Continue your prescribed regimen for ${p.diagnosis}. Do not self-adjust dosage. Contact ${doc?.physician_name} before any changes.`, cta: null },
            { n: "03", title: "Keep Your Next Appointment", body: `Your next review with ${doc?.physician_name} (${doc?.specialty}) should be scheduled. Call ${doc?.phone} to confirm.`, cta: `Call ${doc?.phone}` },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.borderBright }}>{a.n}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{a.title}</div>
              <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.7 }}>{a.body}</div>
              {a.cta && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, marginTop: 4, color: C.blue }}>{a.cta} →</div>}
            </div>
          ))}
        </div>
      </div>

      {msgs.length > 0 && (
        <div style={pt.card}>
          <div style={pt.cardLabel}>RECENT MESSAGES FROM HOSPITAL</div>
          {msgs.slice(0, 2).map((m, i) => (
            <div key={i} style={{ padding: "10px 14px", marginBottom: 8, background: C.bgDeep, borderRadius: 8, borderLeft: `2px solid ${m.type === "urgent" ? C.red : C.border}` }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>{m.date}</div>
              <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.7 }}>{m.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}