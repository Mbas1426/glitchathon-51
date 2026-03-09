import { useState, useEffect, useRef } from "react";
import {C, h} from '../styles/homeStyles.jsx'
import { PHYSICIANS } from  "../CareAgent_Combined.jsx";

export default function HomePage({ onDoctor, onPatient }) {
  const [role, setRole] = useState(null); // null | "doctor" | "patient"
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [focused, setFocused] = useState(false);

  const doctorMatches = role === "doctor" && query.length > 1
    ? PHYSICIANS.filter(p => p.physician_name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const patientMatches = role === "patient" && query.length > 1
    ? PATIENTS.filter(p => p.patient_name.toLowerCase().includes(query.toLowerCase()) || String(p.patient_id).includes(query))
    : [];
  const matches = role === "doctor" ? doctorMatches : patientMatches;

  const handleRoleSelect = (r) => { setRole(r); setQuery(""); setSelected(null); };
  const handleProceed = () => {
    if (!selected) return;
    if (role === "doctor") onDoctor(selected.physician_id);
    else onPatient(selected.patient_id);
  };

  return (
    <div style={h.root}>
      {/* <style>{CSS}</style> */}
      <div style={h.grid} />
      <div style={h.card} className="fadeSlide">
        {/* Logo */}
        <div style={h.logoRow}>
          <div style={h.logoMark}><span style={{ fontSize:18, color:C.bgCard }}>✚</span></div>
          <div>
            <div style={h.brandName}>CareAgent</div>
            <div style={h.brandSub}>Kathir Memorial Hospital · Chennai</div>
          </div>
        </div>

        <div style={h.rule} />

        <div style={h.titleBlock}>
          <div style={h.title}>Welcome</div>
          <div style={h.subtitle}>Select your role to access the portal</div>
        </div>

        {/* Role cards */}
        {!role && (
          <div style={h.roleRow}>
            <button onClick={() => handleRoleSelect("doctor")} style={h.roleCard}>
              <div style={h.roleIcon}>🩺</div>
              <div style={h.roleLabel}>Doctor</div>
              <div style={h.roleSub}>Clinical dashboard &amp; patient management</div>
              <div style={h.roleArrow}>→</div>
            </button>
            <button onClick={() => handleRoleSelect("patient")} style={h.roleCard}>
              <div style={h.roleIcon}>👤</div>
              <div style={h.roleLabel}>Patient</div>
              <div style={h.roleSub}>View your records &amp; test history</div>
              <div style={h.roleArrow}>→</div>
            </button>
          </div>
        )}

        {/* Search step */}
        {role && (
          <div className="fadeSlide">
            <button onClick={() => handleRoleSelect(null)} style={h.backBtn}>← Back</button>
            <div style={h.roleSelectedBadge}>
              <span style={h.roleBadgeIcon}>{role === "doctor" ? "🩺" : "👤"}</span>
              <span style={h.roleBadgeText}>{role === "doctor" ? "Doctor Login" : "Patient Login"}</span>
            </div>
            <div style={{ position:"relative", marginTop:12 }}>
              <div style={{ ...h.searchField, borderColor: focused ? C.blue : C.border }}>
                <span style={{ fontSize:9, color:C.textMuted, letterSpacing:2, display:"block", marginBottom:4 }}>
                  {role === "doctor" ? "DOCTOR NAME" : "PATIENT NAME OR ID"}
                </span>
                <input
                  autoFocus
                  placeholder={role === "doctor" ? "Type doctor name…" : "Type your name or patient ID…"}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(null); }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  style={h.searchInput}
                />
              </div>
              {matches.length > 0 && (
                <div style={h.dropdown}>
                  {matches.slice(0, 6).map(m => {
                    const isDoc = role === "doctor";
                    const key = isDoc ? m.physician_id : m.patient_id;
                    const name = isDoc ? m.physician_name : m.patient_name;
                    const meta = isDoc ? m.specialty : `ID ${String(m.patient_id).padStart(4,"0")} · ${DIAG_ABBR[m.diagnosis]} · ${m.age}y`;
                    const badge = isDoc ? null : STATUS_MAP[m.status];
                    return (
                      <button key={key} onMouseDown={() => setSelected(m)} style={{ ...h.dropItem, background: selected && (isDoc ? selected.physician_id : selected.patient_id) === key ? C.blueFaint : "transparent" }}>
                        <div style={h.dropAvatar}>{name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                        <div style={{ flex:1 }}>
                          <div style={h.dropName}>{name}</div>
                          <div style={h.dropMeta}>{meta}</div>
                        </div>
                        {badge && <span style={h.dropBadge}>{badge}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selected && (
              <div style={h.selectedBox} className="fadeSlide">
                <div style={h.selectedLabel}>{role === "doctor" ? "SELECTED DOCTOR" : "SELECTED PATIENT"}</div>
                <div style={h.selectedName}>{role === "doctor" ? selected.physician_name : selected.patient_name}</div>
                <div style={h.selectedMeta}>
                  {role === "doctor" ? `${selected.specialty} · ${selected.hospital}` : `Patient #${String(selected.patient_id).padStart(4,"0")} · ${selected.diagnosis} · ${selected.age} yrs`}
                </div>
                <button onClick={handleProceed} style={h.proceedBtn}>
                  {role === "doctor" ? "Open Doctor Dashboard →" : "Access My Records →"}
                </button>
              </div>
            )}

            {/* Quick access row */}
            <div style={h.quickWrap}>
              <div style={h.quickLabel}>— QUICK ACCESS —</div>
              <div style={h.quickRow}>
                {role === "doctor"
                  ? PHYSICIANS.map(d => (
                      <button key={d.physician_id} onClick={() => onDoctor(d.physician_id)} style={h.quickBtn}>
                        <div style={h.quickName}>{d.physician_name.replace("Dr. ","Dr.")}</div>
                        <div style={h.quickSub}>{d.specialty}</div>
                      </button>
                    ))
                  : [8, 14, 1, 10].map(id => {
                      const p = PATIENTS.find(x => x.patient_id === id);
                      return (
                        <button key={id} onClick={() => onPatient(id)} style={h.quickBtn}>
                          <div style={h.quickName}>{p.patient_name.split(" ")[0]}</div>
                          <div style={h.quickSub}>{DIAG_ABBR[p.diagnosis]}</div>
                          <div style={{ ...h.quickStatus, color: p.status==="escalated" ? C.red : C.textMuted }}>{STATUS_MAP[p.status]}</div>
                        </button>
                      );
                    })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}