import { C } from '../styles/homeStyles.jsx'
import { PHYSICIANS, CARE_PROTOCOLS, TEST_HISTORY, getRiskTier, getRiskColor, getStatusBadge, diagIcon, getChannelIcon } from "../CareAgent_Combined.jsx";

export default function DocPatientModal({ patient: p, onClose }) {
	const risk = getRiskTier(p); const rc = getRiskColor(risk);
	const sb = getStatusBadge(p.status);
	const doc = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
	const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
	const bad = proto && p.last_value >= proto.critical_threshold;
	const hist = TEST_HISTORY[p.patient_id] || [];

	return (
		<div
			style={{ position: "fixed", inset: 0, background: "rgba(10,20,60,0.25)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
			onClick={onClose}
		>
			<div
				style={{ background: C.bgCard, border: `1px solid ${C.borderBright}`, borderRadius: 20, padding: 24, width: 500, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}
				onClick={e => e.stopPropagation()}
			>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
					<div style={{ display: "flex", gap: 14, alignItems: "center" }}>
						<div style={{ width: 50, height: 50, borderRadius: 14, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: `${rc}18`, color: rc }}>
							{p.patient_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
						</div>
						<div>
							<div style={{ fontSize: 18, color: C.text, fontWeight: 700 }}>{p.patient_name}</div>
							<div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
								{p.age}y · {p.gender === "M" ? "Male" : "Female"} · {diagIcon(p.diagnosis)} {p.diagnosis}
							</div>
							<div style={{ display: "flex", gap: 6, marginTop: 6 }}>
								<span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: sb.bg, color: sb.color }}>{sb.label}</span>
								<span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: `${rc}15`, color: rc, textTransform: "capitalize" }}>{risk} risk</span>
							</div>
						</div>
					</div>
					<button
						onClick={onClose}
						style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.textMuted, width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 12 }}
					>
						✕
					</button>
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
					{[
						{ label: "Physician", value: doc?.physician_name, sub: doc?.specialty },
						{ label: "Channel", value: `${getChannelIcon(p.preferred_channel)} ${p.preferred_channel}`, sub: p.has_smartphone ? "Smartphone" : "NOK required" },
						{ label: "Last Test", value: p.last_test, sub: p.last_date },
						{ label: "Last Value", value: `${p.last_value}`, sub: bad ? "⚠ Abnormal" : "Within range", valueColor: bad ? C.red : C.green },
					].map((f, i) => (
						<div key={i} style={{ background: C.bgDeep, borderRadius: 10, padding: "10px 14px", border: `1px solid ${C.border}` }}>
							<div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
							<div style={{ fontSize: 13, color: f.valueColor || C.text, fontWeight: 600 }}>{f.value}</div>
							<div style={{ fontSize: 10, color: C.textMuted }}>{f.sub}</div>
						</div>
					))}
				</div>
				{hist.length > 0 && (
					<div style={{ marginTop: 16 }}>
						<div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Test History</div>
						{hist.map((h, i) => {
							const isBad = proto && h.value >= proto.critical_threshold;
							return (
								<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
									<div style={{ width: 70, fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{h.date}</div>
									<div style={{ flex: 1, height: 4, background: C.bgRow, borderRadius: 2, overflow: "hidden" }}>
										<div style={{ height: "100%", width: `${(h.value / (p.last_value * 1.3)) * 100}%`, background: isBad ? C.red : C.green, borderRadius: 2 }} />
									</div>
									<div style={{ width: 40, fontSize: 11, color: isBad ? C.red : C.textSub, textAlign: "right", fontFamily: "monospace" }}>{h.value.toFixed(1)}</div>
								</div>
							);
						})}
					</div>
				)}
				{proto && (
					<div style={{ marginTop: 14, padding: 12, background: C.blueFaint, border: `1px solid ${C.blue}30`, borderRadius: 10, fontSize: 11, color: C.textSub }}>
						Protocol: <span style={{ color: C.blue }}>{proto.test_name}</span> every <span style={{ color: C.blue }}>{proto.frequency_days} days</span> · Normal: <span style={{ color: C.green }}>{proto.normal_range}</span>
					</div>
				)}
			</div>
		</div>
	);
}