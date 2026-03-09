export default function PulseRing({ color, size = 10 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ width:size, height:size, borderRadius:"50%", background:color, display:"block", position:"relative", zIndex:1 }} />
      <span style={{ position:"absolute", width:size*2.5, height:size*2.5, borderRadius:"50%", border:`2px solid ${color}`, animation:"pulseRing 2s infinite", opacity:0.3 }} />
    </span>
  );
}