import {C, h} from './homeStyles.jsx'

export const d = {
  root:        { display:"flex", height:"100vh", width:"100vw", background:C.bgApp, padding: "20px", boxSizing: "border-box", color:C.textTitle, overflow:"hidden" },
  appContainer:{ display:"flex", width:"100%", height:"100%", background:C.bgDeep, borderRadius: 24, boxShadow:"0 8px 32px rgba(0,0,0,0.06)", border:`1px solid ${C.border}`, overflow:"hidden" },
  
  sidebar:     { width:260, background:"rgba(255,255,255,0.7)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"24px 0", flexShrink:0, zIndex:10 },
  logo:        { display:"flex", alignItems:"center", gap:12, padding:"0 20px 20px", marginBottom:12 },
  logoMark:    { width:40, height:40, borderRadius:12, background:C.appleGradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 12px rgba(0,113,227,0.3)` },
  logoTitle:   { fontSize:17, fontWeight:600, color:C.textTitle, letterSpacing:"-0.5px" },
  logoSub:     { fontSize:12, color:C.textMuted },
  
  hospitalBadge:{ margin:"0 16px 12px", padding:"12px 16px", background:"rgba(0,0,0,0.02)", borderRadius:12, border:`1px solid ${C.border}` },
  
  nav:         { padding:"0 12px", flex:1, display:"flex", flexDirection:"column", gap:4 },
  navBtn:      { display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:10, border:"none", background:"transparent", color:C.textTitle, cursor:"pointer", fontSize:14, fontWeight:400, textAlign:"left", transition:"all 0.15s", width:"100%" },
  navActive:   { background:C.blue, color:"#fff", fontWeight: 500, boxShadow:`0 4px 12px rgba(0, 113, 227, 0.2)` },
  navIcon:     { fontSize:18, width:22, textAlign:"center" },
  badge:       { marginLeft:"auto", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, background:C.red, color:"#fff" },
  
  sidebarFooter:{ padding:"16px 20px", marginTop: "auto", borderTop:`1px solid ${C.border}` },
  logoutBtn:   { marginTop:12, fontSize:13, padding:"10px 14px", border:`1px solid ${C.border}`, background:"#fff", cursor:"pointer", color:C.textTitle, borderRadius:10, width:"100%", fontWeight:500, transition:"all 0.2s" },
  
  main:        { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgDeep },
  topbar:      { padding:"20px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, zIndex:8, background:"rgba(255,255,255,0.8)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}` },
  pageTitle:   { fontSize:24, fontWeight:600, color:C.textTitle, letterSpacing:"-0.5px" },
  searchBox:   { display:"flex", alignItems:"center", gap:10, padding:"8px 16px", background:C.inputBg, border:`1px solid transparent`, borderRadius:20, transition:"all 0.2s" },
  searchInput: { background:"transparent", border:"none", outline:"none", color:C.textTitle, fontSize:14, width:200, fontWeight: 400 },
  avatarBtn:   { width:36, height:36, borderRadius:"50%", background:C.appleGradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:"#fff", boxShadow:`0 4px 12px rgba(0, 113, 227, 0.2)` },
  
  content:     { flex:1, overflowY:"auto", padding:"32px"},
  dashGrid:    { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 },
  kpiCard:     { background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.03)" },
  card:        { background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:24, boxShadow:"0 4px 24px rgba(0,0,0,0.04)" },
  cardHeader:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  cardTitle:   { fontSize:15, color:C.textTitle, fontWeight:600, letterSpacing:"-0.3px" },
  
  diagCard:    { background:C.bgApp, borderRadius:12, padding:"16px", textAlign:"center", border: `1px solid ${C.border}` },
  protocolRow: { display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.bgApp, borderRadius:12, marginBottom: 8, border: `1px solid ${C.border}` },
  filterBar:   { display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", padding:"12px 16px", background:"#fff", borderRadius:14, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.02)", marginBottom: 20 },
  filterBtn:   { fontSize:13, padding:"6px 14px", borderRadius:10, border:`1px solid ${C.border}`, background:C.bgApp, color:C.textTitle, cursor:"pointer", transition:"all 0.2s", fontWeight:500 },
  
  tableWrap:   { background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.04)" },
  table:       { width:"100%", borderCollapse:"collapse" },
  th:          { padding:"14px 20px", textAlign:"left", fontSize:11, color:C.textMuted, letterSpacing:"0.5px", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, background:C.bgApp, fontWeight:600 },
  tr:          { borderBottom:`1px solid ${C.border}`, cursor:"pointer", transition:"background 0.2s" },
  td:          { padding:"16px 20px", fontSize:14, color:C.textTitle, fontWeight:400 },
  viewBtn:     { fontSize:12, color:C.blue, background:"rgba(0, 113, 227, 0.1)", border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontWeight:500, transition:"background 0.2s" },
  
  toast:       { position:"fixed", bottom:32, right:32, padding:"16px 20px", borderRadius:16, fontSize:14, fontWeight:500, background:"rgba(29, 29, 31, 0.9)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", color:"#fff", zIndex:200, display:"flex", alignItems:"center", gap:12, boxShadow:"0 12px 32px rgba(0,0,0,0.15)", border:`1px solid rgba(255,255,255,0.1)` },
};