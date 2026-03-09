function PtMiniChart({ hist, threshold }) {
  const maxVal = Math.max(...hist.map(h=>h.value)) * 1.15;
  return (
    <div style={{ paddingTop:8 }}>
      <svg width="100%" height={80} viewBox={`0 0 ${hist.length*48} 80`} preserveAspectRatio="none">
        {threshold && <line x1={0} y1={80-(threshold/maxVal)*78} x2={hist.length*48} y2={80-(threshold/maxVal)*78} stroke={C.red} strokeWidth={1} strokeDasharray="4 3" />}
        <polyline points={hist.map((h,i)=>`${i*48+24},${80-(h.value/maxVal)*75}`).join(" ")} fill="none" stroke={C.blue} strokeWidth={1.5} strokeLinejoin="round" />
        {hist.map((h,i) => <circle key={i} cx={i*48+24} cy={80-(h.value/maxVal)*75} r={i===hist.length-1?4:2.5} fill={threshold&&h.value>=threshold?C.red:C.blue} />)}
      </svg>
      <div style={{ display:"flex", justifyContent:"space-around", marginTop:4 }}>
        {hist.map((h,i) => <span key={i} style={{ fontSize:8, color:C.textDim }}>{h.date.slice(5)}</span>)}
      </div>
    </div>
  );
}