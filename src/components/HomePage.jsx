import { useState } from "react";
import { C, h } from '../styles/homeStyles.jsx'
import { useData } from "../CareAgent_Combined.jsx";
import { CSS } from '../styles/css.jsx';

import { useSocket } from "../SocketContext.jsx";

export default function HomePage({ onDoctor, onPatient }) {
  const socket = useSocket();
  const SvgBackground = () => (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradOrangeTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3b30" />
          <stop offset="100%" stopColor="#FF9500" />
        </linearGradient>
        <linearGradient id="gradOrangeBot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF3B30" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="#ffffff" />

      {/* Light gray wave */}
      <path fill="#F4F6F9" d="M0,900 L0,700 C400,600 500,800 900,600 C1200,450 1350,550 1440,450 L1440,900 Z" />
      <path fill="#EAECEF" d="M0,900 L0,750 C300,700 400,850 800,750 C1100,650 1300,800 1440,700 L1440,900 Z" opacity="0.6" />

      {/* Top Right Dark Blue */}
      <path fill="#2E557A" d="M600,0 C800,250 1100,150 1440,300 L1440,0 Z" />

      {/* Top Left Orange */}
      <path fill="url(#gradOrangeTop)" d="M0,0 L600,0 C500,150 600,250 400,350 C250,425 250,550 0,550 Z" />
      <path fill="#FF3B30" opacity="0.8" d="M0,0 L450,0 C350,150 400,250 250,350 C100,450 100,500 0,400 Z" />

      {/* Bottom Right Orange */}
      <path fill="url(#gradOrangeBot)" d="M800,900 C900,750 1000,850 1150,650 C1250,500 1350,450 1440,550 L1440,900 Z" />

      {/* Blue Pill */}
      <rect x="-30" y="650" width="230" height="70" rx="35" fill="#297FC6" />
    </svg>
  );

  const { PHYSICIANS, PATIENTS } = useData();
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
      const res = await fetch(`http://${window.location.hostname}:5002/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, id, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (socket) {
          socket.emit("register", `${role}_${id}`);
        }
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

      {/* Modern Theme Background */}
      <SvgBackground />

      {/* Brand Corner */}
      <div style={h.brandCorner}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11V7a4 4 0 0 0-8 0v4M7 11h10v10H7z" />
        </svg>
        <span>CareAgent</span>
      </div>

      <div style={h.card} className="fadeSlide">
        {/* Top Icon Area */}
        <div style={h.iconTop}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
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