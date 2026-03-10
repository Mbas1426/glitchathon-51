import { useState, useMemo } from "react";
import { C } from '../styles/homeStyles.jsx'
import { useData } from '../CareAgent_Combined.jsx'
import { d } from '../styles/doctorStyles.jsx'
import PulseRing from './PulseRing.jsx'

export default function DocPatients({ patients, filterRisk, setFilterRisk, filterDiag, setFilterDiag, onSelect, selected }) {
  const { CARE_PROTOCOLS, getRiskTier, getRiskColor, getStatusBadge } = useData();
  const [sortConfig, setSortConfig] = useState({ key: 'patient_name', direction: 'asc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPatients = useMemo(() => {
    let sortableItems = [...patients];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'risk') {
          const riskPriority = { critical: 4, high: 3, moderate: 2, low: 1 };
          aValue = riskPriority[getRiskTier(a)] || 0;
          bValue = riskPriority[getRiskTier(b)] || 0;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [patients, sortConfig, getRiskTier]);

  const headers = [
    { label: "Patient", key: "patient_name" },
    { label: "Diagnosis", key: "diagnosis" },
    { label: "Last Test", key: "last_date" },
    { label: "Result", key: "last_value" },
    { label: "Overdue", key: "overdue_days" },
    { label: "Risk", key: "risk" },
    { label: "Status", key: "status" },
    { label: "Channel", key: "preferred_channel" },
    { label: "", key: null },
  ];

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
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={h.key ? "th-sortable" : ""}
                  style={{ ...d.th, cursor: h.key ? "pointer" : "default", userSelect: "none" }}
                  onClick={() => h.key && requestSort(h.key)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {h.label}
                    {h.key && sortConfig.key === h.key && (
                      <span style={{ fontSize: 10, color: C.blue }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map((p, i) => {
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
                        <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>
                          {p.patient_name}
                          {p.nok_notified && <span title="Next of Kin Notified" style={{ marginLeft: 6, color: C.red, fontSize: 13, cursor: "help" }}>🔔</span>}
                        </div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>
                          {p.age}y · {p.gender === "M" ? "Male" : "Female"}
                          {p.missed_appointments > 0 && <span style={{ color: p.nok_notified ? C.red : C.orange, fontWeight: 600 }}> · {p.missed_appointments} Missed</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={d.td}><span style={{ fontSize: 13, fontWeight: 500, color: C.textTitle }}>{p.diagnosis}</span></td>
                  <td style={d.td}><div style={{ fontSize: 11 }}>{p.last_test}</div><div style={{ fontSize: 10, color: C.textMuted }}>{p.last_date}</div></td>
                  <td style={d.td}><span style={{ fontSize: 12, color: bad ? C.red : C.green, fontWeight: 700 }}>{p.last_value}</span>{bad && <span style={{ fontSize: 9, color: C.red, marginLeft: 4 }}>↑</span>}</td>
                  <td style={d.td}><span style={{ fontSize: 12, color: p.overdue_days > 90 ? C.red : C.orange, fontWeight: 600 }}>{p.overdue_days}d</span></td>
                  <td style={d.td}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><PulseRing color={rc} size={6} /><span style={{ fontSize: 11, color: rc, textTransform: "capitalize" }}>{risk}</span></div></td>
                  <td style={d.td}><span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: sb.bg, color: sb.color, fontWeight: 600 }}>{sb.label}</span></td>
                  <td style={d.td}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.textSub }}>{p.preferred_channel}</span>
                    {p.nok_notified && <div style={{ fontSize: 9, color: C.red, fontWeight: 700, marginTop: 2, textTransform: "uppercase" }}>NOK Notified</div>}
                    {!p.nok_notified && p.missed_appointments >= 2 && <div style={{ fontSize: 9, color: C.orange, fontWeight: 700, marginTop: 2, textTransform: "uppercase" }}>Suggest NOK</div>}
                    {!p.nok_notified && !p.has_smartphone && p.missed_appointments < 2 && <span style={{ fontSize: 10, color: C.orange, marginLeft: 6, fontWeight: 700 }}>NOK</span>}
                  </td>
                  <td style={d.td}><button onClick={e => { e.stopPropagation(); onSelect(p); }} style={d.viewBtn}>View →</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}