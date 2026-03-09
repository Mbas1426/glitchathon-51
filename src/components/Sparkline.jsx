export default function Sparkline({ data, color }) {
  const w = 80, h = 28, min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/(max-min+0.001))*h}`).join(" ");
  const last = pts.split(" ").at(-1).split(",");
  return (
    <svg width={w} height={h} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}