import { useState } from "react";
import {C, h} from '../styles/homeStyles.jsx'
import { PHYSICIANS, PATIENTS } from "../CareAgent_Combined.jsx";
import {CSS} from '../styles/css.jsx';

export default function HomePage({ onDoctor, onPatient }) {
  const [role, setRole] = useState("doctor");
  const [query, setQuery] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleProceed = async () => {
    if (!query) { setLoginError("Enter username"); return; }
    if (!password) { setLoginError("Enter password"); return; }
    
    let selectedUser = null;
    if (role === "doctor") {
      selectedUser = PHYSICIANS.find(p => p.physician_name.toLowerCase().includes(query.toLowerCase()) || String(p.physician_id) === query);
    } else {
      selectedUser = PATIENTS.find(p => p.patient_name.toLowerCase().includes(query.toLowerCase()) || String(p.patient_id) === query);
    }

    if (!selectedUser) {
      setLoginError("User not found");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");
    
    const id = role === "doctor" ? selectedUser.physician_id : selectedUser.patient_id;
    
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, id, password })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        if (role === "doctor") onDoctor(id);
        else onPatient(id);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Failed to connect to server");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={h.root}>
      <style>{CSS}</style>

      {/* Cloud-like Background Decorators */}
      <div style={h.arcDeco} />
      <div style={h.cloud1} />
      <div style={h.cloud2} />

      {/* Brand Corner */}
      <div style={h.brandCorner}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11V7a4 4 0 0 0-8 0v4M7 11h10v10H7z"/>
        </svg>
        <span>CareAgent</span>
      </div>

      <div style={h.card} className="fadeSlide">
        {/* Top Icon Area */}
        <div style={h.iconTop}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
          </svg>
        </div>

        <div style={h.title}>Sign in with CareAgent</div>
        <div style={h.subtitle}>Access your medical dashboard, records, and team collaboration space quickly.</div>

        <div style={h.form}>
          
          <div style={h.roleToggle}>
            <button 
              onClick={() => { setRole("doctor"); setLoginError(""); }}
              style={{ ...h.roleBtn, background: role === "doctor" ? "#fff" : "transparent", color: role === "doctor" ? C.textTitle : C.textMuted, boxShadow: role === "doctor" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
            >
              Doctor
            </button>
            <button 
              onClick={() => { setRole("patient"); setLoginError(""); }}
              style={{ ...h.roleBtn, background: role === "patient" ? "#fff" : "transparent", color: role === "patient" ? C.textTitle : C.textMuted, boxShadow: role === "patient" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
            >
              Patient
            </button>
          </div>

          <div style={{ ...h.inputBox, marginTop: 4 }}>
            <span style={h.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input 
              style={h.inputField} 
              placeholder="ID or Username" 
              value={query}
              onChange={e => { setQuery(e.target.value); setLoginError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleProceed()}
            />
          </div>

          <div style={h.inputBox}>
            <span style={h.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input 
              style={h.inputField} 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleProceed()}
            />
          </div>

          {loginError && <div style={{ color: C.red, fontSize: 13, fontWeight: 500, width: "100%", textAlign: "center", marginTop: -4 }}>{loginError}</div>}

          <div style={h.forgotPwdWrap}>
            <span style={h.forgotPwd}>Forgot password?</span>
          </div>

          <button onClick={handleProceed} disabled={isLoggingIn} style={{ ...h.loginBtn, opacity: isLoggingIn ? 0.7 : 1 }}>
            {isLoggingIn ? "Signing in..." : "Get Started"}
          </button>
          
        </div>

      </div>
    </div>
  );
}