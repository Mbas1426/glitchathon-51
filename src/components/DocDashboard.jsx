import { C } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx'
import { useData } from '../CareAgent_Combined.jsx'
import Counter from './Counter.jsx'
import Sparkline from './Sparkline.jsx'

export default function DocDashboard({ patients, critical, overdue, closed, escalated, protocols, onNavigate }) {
	const { diagIcon } = useData();
	const diagBreakdown = ["Diabetes", "CKD", "Hypertension", "Hypothyroidism"].map(dd => ({
		name: dd,
		count: patients.filter(p => p.diagnosis === dd).length,
		overdue: patients.filter(p => p.diagnosis === dd && (p.status === "overdue" || p.status === "escalated")).length,
		icon: diagIcon(dd),
	}));
	return (
		<div style={d.dashGrid}>
			{[
				{ label: "Overdue Patients", value: overdue.length, sub: "Require immediate outreach", color: C.red, spark: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, overdue.length] },
				{ label: "Critical Risk", value: critical.length, sub: "Critically abnormal results", color: C.orange, spark: [1, 1, 2, 3, 3, 4, 4, 5, 5, 6, critical.length] },
				{ label: "Escalated", value: escalated.length, sub: "Awaiting physician action", color: "#9b59b6", spark: [0, 1, 1, 2, 2, 3, 3, 3, 3, 3, escalated.length] },
				{ label: "Gaps Closed", value: closed.length, sub: "This month", color: C.green, spark: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, closed.length] },
			].map((kpi, i) => (
				<div key={i} style={{ ...d.kpiCard, animationDelay: `${i * 80}ms` }} className="fadeSlide">
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
						<div>
							<div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{kpi.label}</div>
							<div style={{ fontSize: 32, fontWeight: 700, color: kpi.color, lineHeight: 1 }}>
								<Counter target={kpi.value} />
							</div>
							<div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{kpi.sub}</div>
						</div>
						<Sparkline data={kpi.spark} color={kpi.color} />
					</div>
				</div>
			))}

			{/* Diagnosis breakdown */}
			<div style={{ ...d.card, gridColumn: "1/3" }}>
				<div style={d.cardHeader}><span style={d.cardTitle}>Diagnosis Breakdown</span></div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 14 }}>
					{diagBreakdown.map((b, i) => (
						<div key={i} style={d.diagCard}>
							<div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{b.icon}</div>
							<div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{b.name}</div>
							<div style={{ fontSize: 24, color: C.textTitle, fontWeight: 700, marginTop: 6 }}>{b.count}</div>
							<div style={{ fontSize: 10, color: b.overdue > 0 ? C.red : C.textMuted, marginTop: 4 }}>{b.overdue} overdue</div>
						</div>
					))}
				</div>
			</div>

			{/* Protocols */}
			<div style={{ ...d.card, gridColumn: "3/5" }}>
				<div style={d.cardHeader}><span style={d.cardTitle}>Care Protocols</span></div>
				<div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
					{protocols.map((p, i) => (
						<div key={i} style={d.protocolRow}>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: C.bgApp, borderRadius: 10, fontSize: 13, fontWeight: 700, color: C.textTitle }}>{diagIcon(p.diagnosis_name)}</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: 13, color: C.textTitle, fontWeight: 600 }}>{p.diagnosis_name} — {p.test_name}</div>
								<div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Normal: {p.normal_range}</div>
							</div>
							<div style={{ textAlign: "right" }}>
								<div style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>Every {p.frequency_days}d</div>
								<div style={{ fontSize: 10, color: C.textMuted }}>Critical ≥ {p.critical_threshold}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Activity feed */}
			<div style={{ ...d.card, gridColumn: "1/5" }}>
				<div style={d.cardHeader}><span style={d.cardTitle}>Recent Activity Feed</span><span style={{ fontSize: 10, color: C.textDim }}>Live</span></div>
				<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
					{[
						{ time: "09:42", msg: "Outreach sent to Rajesh Kumar (Diabetes — HbA1c overdue 120 days)", color: C.orange },
						{ time: "09:38", msg: "Saranya Iyer escalated to Dr. Priya Sharma — HbA1c: 11.2%, no response after 2 attempts", color: C.red },
						{ time: "09:30", msg: "Deepa Venkat confirmed home sample collection for Saturday", color: C.green },
						{ time: "09:15", msg: "Senthil Kumar responded: 'Is it really urgent?' — Contextual reply sent", color: C.blue },
						{ time: "08:50", msg: "Daily scan complete — 11 patients overdue identified", color: C.textSub },
					].map((a, i) => (
						<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
							<span style={{ fontSize: 11, color: C.textMuted, minWidth: 38, fontFamily: "monospace" }}>{a.time}</span>
							<span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
							<span style={{ fontSize: 12, color: C.textSub }}>{a.msg}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}