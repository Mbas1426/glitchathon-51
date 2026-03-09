import {C, h} from './homeStyles.jsx';

export const pt = {
  root:  { display:"flex", height:"100vh", width:"100vw", background:C.bgApp, padding: "20px", boxSizing: "border-box", color:C.textTitle, overflow:"hidden" },
  appContainer:{ display:"flex", flexDirection:"column", width:"100%", height:"100%", background:C.bgDeep, borderRadius: 24, boxShadow:"0 8px 32px rgba(0,0,0,0.06)", border:`1px solid ${C.border}`, overflow:"hidden" },
  topbar:{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}`, padding:"20px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, zIndex:10 },
  card:  { background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", boxShadow:"0 4px 24px rgba(0,0,0,0.04)" },
  cardLabel:{ fontSize:16, color:C.textTitle, fontWeight:600, letterSpacing:"-0.3px", paddingBottom:16, borderBottom:`1px solid ${C.border}`, marginBottom:20 },
};