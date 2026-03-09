import { C } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx'
import { useData } from "../CareAgent_Combined.jsx";

export default function DocEscalations({ patients, physicians, onEscalate }) {
	const { getRiskTier, getRiskColor } = useData();
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
			{patients.length === 0 ? (
				<div style={{ ...d.card, textAlign: "center", padding: 48 }}>
					<div style={{ fontSize: 32 }}>✓</div>
					<div style={{ fontSize: 14, color: C.textMuted, marginTop: 8 }}>No active escalations</div>
				</div>
			) : patients.map((p, i) => {
				const rc = getRiskColor(getRiskTier(p));
				const doc = physicians.find(ph => ph.physician_id === p.physician_id);

				return (
					<div key={p.patient_id} style={{ background: C.bgCard, border: `1px solid ${C.redDim}`, borderLeft: `3px solid ${C.red}`, borderRadius: 14, padding: 18 }}>
						<div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
								<div style={{ width: 38, height: 38, borderRadius: 10, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: `${rc}18`, color: rc }}>
									{p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
								</div>
								<span style={{ fontSize: 9, color: C.red, background: C.redDim, padding: "2px 6px", borderRadius: 6, textTransform: "uppercase" }}>Escalated</span>
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<div>
										<div style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{p.patient_name}</div>
										<div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{p.diagnosis} · {p.age}y</div>
									</div>
									<div style={{ textAlign: "right" }}>
										<div style={{ fontSize: 20, color: C.red, fontWeight: 700 }}>{p.last_value}</div>
										<div style={{ fontSize: 10, color: C.textMuted }}>Last {p.last_test} · {p.last_date}</div>
									</div>
								</div>
								<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
									{[`${p.overdue_days} days overdue`, `Contact via ${p.preferred_channel}`, ...(!p.has_smartphone ? ["NOK needed"] : [])].map((chip, ci) => (
										<span key={ci} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 8, background: C.bgDeep, color: C.textSub }}>{chip}</span>
									))}
								</div>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
									<div style={{ fontSize: 11, color: C.textMuted }}>Assigned to: <span style={{ color: C.blue }}>{doc?.physician_name}</span> · {doc?.specialty}</div>
									<button
										onClick={() => onEscalate(p)}
										style={{ background: `linear-gradient(135deg,#a01030,#d63355)`, border: "none", color: "#fff", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 600 }}
									>
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