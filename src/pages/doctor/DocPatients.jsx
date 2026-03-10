import { C } from '../../styles/homeStyles.jsx'
import { useData, getChannelIcon } from '../CareAgent_Combined.jsx'
import { diagIcon } from '../CareAgent_Combined.jsx'
import { d } from '../../styles/doctorStyles.jsx'
import PulseRing from '../../components/PulseRing.jsx'

export default function DocPatients({ patients, filterRisk, setFilterRisk, filterDiag, setFilterDiag, onSelect, selected }) {
  const { CARE_PROTOCOLS, getRiskTier, getRiskColor, getStatusBadge } = useData();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={d.filterBar}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "critical", "high", "moderate"].map(r => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              style={{ ...d.filterBtn, ...(filterRisk === r ? { background: C.blueDim, color: C.blue, borderColor: C.blue } : {}) }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(dd => (
            <button key={dd} onClick={() => setFilterDiag(dd)} style={{ ...d.filterBtn, ...(filterDiag === dd ? { background: C.blueDim, color: C.blue, borderColor: C.blue } : {}) }}>
              {dd === "all" ? "All" : dd}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{patients.length} patients</span>
      </div>
      <div style={d.tableWrap}>
        <table style={d.table}>
          <thead>
            <tr>{["Patient", "Diagnosis", "Last Test", "Result", "Overdue", "Risk", "Status", "Channel", ""].map((h, i) => <th key={i} style={d.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {patients.map((p, i) => {
              const risk = getRiskTier(p); const rc = getRiskColor(risk);
              const sb = getStatusBadge(p.status);
              const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
              const bad = proto && p.last_value >= proto.critical_threshold;
              return (
                <tr key={p.patient_id} onClick={() => onSelect(p)} style={{ ...d.tr, background: selected?.patient_id === p.patient_id ? C.blueFaint : "transparent" }}>
                  <td style={d.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: `${rc}18`, color: rc }}>
                        {p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{p.patient_name}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{p.age}y · {p.gender === "M" ? "Male" : "Female"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={d.td}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.textTitle }}>{p.diagnosis}</span>
                  </td>
                  <td style={d.td}>
                    <div style={{ fontSize: 11 }}>{p.last_test}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{p.last_date}</div>
                  </td>
                  <td style={d.td}>
                    <span style={{ fontSize: 12, color: bad ? C.red : C.green, fontWeight: 700 }}>{p.last_value}</span>
                    {bad &&
                      <span style={{ fontSize: 9, color: C.red, marginLeft: 4 }}>↑</span>}</td>
                  <td style={d.td}>
                    <span style={{ fontSize: 12, color: p.overdue_days > 90 ? C.red : C.orange, fontWeight: 600 }}>{p.overdue_days}d</span>
                  </td>
                  <td style={d.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <PulseRing color={rc} size={6} />
                      <span style={{ fontSize: 11, color: rc, textTransform: "capitalize" }}>{risk}</span>
                    </div>
                  </td>
                  <td style={d.td}>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: sb.bg, color: sb.color, fontWeight: 600 }}>{sb.label}</span>
                  </td>
                  <td style={d.td}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.textSub }}>{getChannelIcon(p.preferred_channel)}</span>
                    {!p.has_smartphone &&
                      <span style={{ fontSize: 9, color: C.orange, marginLeft: 6, fontWeight: 700 }}>NOK</span>
                    }
                  </td>
                  <td style={d.td}>
                    <button onClick={e => { e.stopPropagation(); onSelect(p); }} style={d.viewBtn}>View →</button>
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