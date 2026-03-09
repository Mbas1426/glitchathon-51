import { pt } from '../../styles/patientStyles.jsx';
import { C } from '../../styles/homeStyles.jsx';

export default function PtTests({ p, proto, hist }) {
  const maxVal = Math.max(...hist.map(h => h.value));
  const normal = proto?.critical_threshold;
  const normalPct = normal ? (normal / (maxVal * 1.15)) * 100 : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={pt.card}>
        <div style={pt.cardLabel}>{p.last_test} HISTORY — {hist.length} READINGS</div>
        <div style={{ position: "relative", height: 180, marginBottom: 8, marginTop: 8 }}>
          {normalPct && <div style={{ position: "absolute", left: 0, right: 0, bottom: `${normalPct}%`, borderTop: `1px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end" }}><span style={{ fontSize: 8, color: C.textMuted, background: C.bgCard, padding: "0 4px" }}>critical · {normal} {proto?.unit}</span></div>}
          <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: 6, padding: "0 4px" }}>
            {hist.map((h, i) => {
              const pct = (h.value / (maxVal * 1.15)) * 100;
              const isBad = normal && h.value >= normal;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 3 }}>{h.value}</div>
                  <div style={{ width: "100%", height: 140, display: "flex", alignItems: "flex-end", background: C.bgRow, borderRadius: 4 }}>
                    <div style={{ width: "100%", height: `${pct}%`, background: isBad ? C.red : C.blue, borderRadius: "4px 4px 0 0", transition: "height 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize: 8, color: C.textDim, marginTop: 4 }}>{h.date.slice(2, 7)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 9, color: C.textMuted, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.red, borderRadius: 2, marginRight: 5 }} />Above threshold</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.blue, borderRadius: 2, marginRight: 5 }} />Normal range</span>
        </div>
      </div>
      <div style={pt.card}>
        <div style={pt.cardLabel}>DETAILED RECORDS</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ background: C.bgDeep }}>{["#", "Date", "Test", "Value", "Unit", "Status", "Change"].map((h, i) => <th key={i} style={{ padding: "8px 12px", textAlign: "left", fontSize: 8, color: C.textDimmer, letterSpacing: 2, borderBottom: `1px solid ${C.border}`, fontWeight: 400 }}>{h}</th>)}</tr></thead>
          <tbody>
            {[...hist].reverse().map((h, i) => {
              const orig = hist.length - 1 - i; const prev = hist[orig - 1];
              const delta = prev ? h.value - prev.value : null;
              const isBad = normal && h.value >= normal;
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${C.bgRow}` }}>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub, fontFamily: "monospace" }}>{String(hist.length - i).padStart(2, "0")}</td>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub, fontFamily: "monospace" }}>{h.date}</td>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub }}>{p.last_test}</td>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub, fontFamily: "monospace", fontWeight: 700, textDecoration: isBad ? "underline" : "none" }}>{h.value}</td>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub, fontFamily: "monospace" }}>{proto?.unit}</td>
                  <td style={{ padding: "9px 12px", fontSize: 11 }}><span style={{ fontSize: 9, padding: "2px 7px", border: `1px solid ${isBad ? C.red : C.border}`, color: isBad ? C.red : C.textMuted, borderRadius: 4, letterSpacing: 1 }}>{isBad ? "ABOVE RANGE" : "NORMAL"}</span></td>
                  <td style={{ padding: "9px 12px", fontSize: 11, color: C.textSub, fontFamily: "monospace" }}>{delta !== null ? <span style={{ color: delta > 0 ? C.red : C.green }}>{delta > 0 ? "+" : ""}{delta.toFixed(1)} {proto?.unit}</span> : <span style={{ color: C.textDimmer }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>Normal range: {proto?.normal_range} · Critical threshold: ≥ {proto?.critical_threshold} {proto?.unit}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: C.border, borderRadius: 12, overflow: "hidden" }}>
        {[["DIAGNOSIS", p.diagnosis], ["TEST", proto?.test_name], ["FREQUENCY", `Every ${proto?.frequency_days} days`], ["NORMAL RANGE", proto?.normal_range], ["DAYS OVERDUE", p.overdue_days]].map(([label, val], i) => (
          <div key={i} style={{ background: C.bgCard, padding: "14px 16px" }}>
            <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}