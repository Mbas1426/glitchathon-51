import {C, h} from './homeStyles.jsx';

export const pt = {
  root:  { minHeight:"100vh", minWidth:"100vw", background:C.bg, fontFamily:"'DM Mono', monospace", color:C.text, display:"flex", flexDirection:"column" },
  topbar:{ background:C.bgCard, borderBottom:`1px solid ${C.border}`, padding:"12px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  card:  { background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px" },
  cardLabel:{ fontSize:8, color:C.textMuted, letterSpacing:2, paddingBottom:12, borderBottom:`1px solid ${C.border}`, marginBottom:14 },
};