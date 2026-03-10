export const C = {
  bgApp:       "#ffffff", 
  bgCard:      "rgba(255, 255, 255, 0.9)",
  textTitle:   "#1d1d1f", 
  textMuted:   "#86868b", 
  inputBg:     "rgba(0, 0, 0, 0.04)", 
  border:      "rgba(0, 0, 0, 0.08)", 
  btnDark:     "#000000", 
  blue:        "#297FC6", 
  red:         "#FF3B30", 
  redDim:      "rgba(255,59,48,0.1)",
  green:       "#28CD41",
  orange:      "#FF9500",
  bgDeep:      "#ffffff",
  appleGradient: "linear-gradient(135deg, #0071e3, #5ac8fa)"
};

export const h = {
  root: { minHeight: "100vh", minWidth: "100vw", background: C.bgApp, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  
  card: { zIndex: 1, background: C.bgCard, borderRadius: 24, padding: "48px", width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 16px 60px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.8)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" },
  
  iconTop: { width: 56, height: 56, borderRadius: "50%", background: C.appleGradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: "#fff", boxShadow: "0 8px 16px rgba(0,113,227,0.2)" },
  
  title: { fontSize: 24, fontWeight: 600, color: C.textTitle, marginBottom: 8, letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: C.textMuted, textAlign: "center", lineHeight: 1.5, marginBottom: 32, maxWidth: "90%", fontWeight: 400 },
  
  roleToggle: { display: "flex", width: "100%", background: C.inputBg, borderRadius: 12, padding: 4, marginBottom: 20 },
  roleBtn: { flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease", textAlign: "center" },
  
  form: { width: "100%", display: "flex", flexDirection: "column", gap: 14 },
  
  inputBox: { display: "flex", alignItems: "center", width: "100%", background: "rgba(255,255,255,0.8)", borderRadius: 12, padding: "12px 16px", gap: 12, border: `1px solid ${C.border}`, transition: "border 0.2s, box-shadow 0.2s" },
  inputIcon: { color: C.textMuted, fontSize: 18, flexShrink: 0 },
  inputField: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: C.textTitle, fontWeight: 400 },
  
  forgotPwdWrap: { width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 2, marginBottom: 8 },
  forgotPwd: { fontSize: 12, color: C.blue, cursor: "pointer", fontWeight: 500, transition: "color 0.2s" },

  loginBtn: { width: "100%", background: C.btnDark, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  
  brandCorner: { position: "absolute", top: 40, left: 48, display: "flex", alignItems: "center", gap: 8, zIndex: 1, color: C.textTitle, fontWeight: 600, fontSize: 18, letterSpacing: "-0.5px" },
};