import { useState } from "react";
import { C } from '../../styles/homeStyles.jsx'
import { d } from '../../styles/doctorStyles.jsx'
import { diagIcon } from '../CareAgent_Combined.jsx'
import { getRiskTier, getRiskColor } from "../CareAgent_Combined.jsx";
import PulseRing from '../../components/PulseRing.jsx'

export default function DocCareGaps({ patients, gapsLog, setGapsLog, showToast }) {
	const [closing, setClosing] = useState(null);
	const closeGap = (p) => {
		setClosing(p.patient_id);
		setTimeout(() => {
			setGapsLog(prev => [...prev, {
				id: prev.length + 1,
				patient: p.patient_name,
				test: p.last_test,
				closedAt: new Date().toISOString().slice(0, 10),
				status: "Completed"
			}]);
			setClosing(null);
			showToast(`Care gap closed for ${p.patient_name}`);
		}, 1500);
	};
	const openGaps = patients.filter(p => p.status !== "closed");
	const byDiag = ["Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(dd => ({
		d: dd,
		total: patients.filter(p => p.diagnosis === dd).length,
		open: openGaps.filter(p => p.diagnosis === dd).length
	}));

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
				{byDiag.map((b, i) => {
					const pct = Math.round((b.open / b.total) * 100);
					return (
						<div key={i} style={{ ...d.card, textAlign: "center" }}>
							<div style={{ fontSize: 22 }}>{diagIcon(b.d)}</div>
							<div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 6 }}>{b.d}</div>
							<div style={{ fontSize: 24, color: pct > 60 ? C.red : C.orange, fontWeight: 700, marginTop: 4 }}>{pct}%</div>
							<div style={{ fontSize: 10, color: C.textMuted }}>{b.open}/{b.total} open gaps</div>
							<div style={{ height: 3, background: C.bgRow, borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
								<div style={{ height: "100%", width: `${pct}%`, background: pct > 60 ? C.red : C.orange, borderRadius: 2 }} />
							</div>
						</div>
					);
				})}
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div style={d.card}>
					<div style={d.cardHeader}>
						<span style={d.cardTitle}>Open Care Gaps</span>
						<span style={{ fontSize: 10, color: C.red }}>{openGaps.length} pending</span>
					</div>
					<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
						{openGaps.slice(0, 10).map((p, i) => {
							const rc = getRiskColor(getRiskTier(p));
							return (
								<div key={p.patient_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.bgDeep, borderRadius: 8 }}>
									<PulseRing color={rc} size={7} />
									<div style={{ flex: 1 }}>
										<div style={{ fontSize: 12, color: C.text }}>{p.patient_name}</div>
										<div style={{ fontSize: 10, color: C.textMuted }}>{p.last_test} · {p.overdue_days}d overdue</div>
									</div>
									<button
										onClick={() => closeGap(p)}
										disabled={closing === p.patient_id}
										style={{ fontSize: 10, padding: "4px 10px", borderRadius: 7, background: "transparent", border: `1px solid ${rc}`, color: rc, cursor: "pointer" }}
									>
										{closing === p.patient_id ? "…" : "Close"}
									</button>
								</div>
							);
						})}
					</div>
				</div>
				<div style={d.card}>
					<div style={d.cardHeader}>
						<span style={d.cardTitle}>Gaps Closed Log</span>
						<span style={{ fontSize: 10, color: C.green }}>{gapsLog.length} closed</span>
					</div>
					<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
						{gapsLog.map((g, i) => (
							<div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 8 }}>
								<span style={{ color: C.green, fontSize: 14 }}>✓</span>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: 12, color: C.text }}>{g.patient}</div>
									<div style={{ fontSize: 10, color: C.textMuted }}>{g.test} · {g.closedAt}</div>
								</div>
								<span style={{ fontSize: 10, color: C.green, background: C.greenDim, padding: "2px 8px", borderRadius: 8 }}>{g.status}</span>
							</div>
						))}
						{gapsLog.length === 0 && <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", padding: 20 }}>No gaps closed yet</div>}
					</div>
				</div>
			</div>
		</div>
	);
}