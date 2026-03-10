import { useState, useEffect } from "react";
import { C } from "../styles/homeStyles";

export default function SOSMapModal({ sosData, onCancel }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p === 1 ? 1.2 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!sosData || !sosData.active) return null;

  const { representative } = sosData;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: isExpanded ? 340 : 220,
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
        zIndex: 10000,
        transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        border: `1px solid ${C.red}30`,
      }}
    >
      {/* Map Area */}
      <div
        style={{
          height: isExpanded ? 240 : 100,
          background: "#e9ecef",
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          transition: "height 0.4s ease",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Real Map Image */}
        <img
          src="/assets/chennai_map.png"
          alt="Map"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
            filter: "grayscale(20%) brightness(105%)",
          }}
        />

        {/* Animated Route Pulse */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={C.blue} />
              <stop offset="100%" stopColor={C.red} />
            </linearGradient>
          </defs>
          <path
            d="M60,180 Q170,120 280,60"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 6"
            className="route-flow"
          />
        </svg>

        {/* Patient Marker (Fixed) */}
        <div style={{
          position: "absolute",
          bottom: isExpanded ? 60 : 25,
          left: 60,
          width: 14,
          height: 14,
          background: C.blue,
          borderRadius: "50%",
          boxShadow: "0 0 0 4px rgba(0,122,255,0.2), 0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 2,
          transition: "all 0.4s ease"
        }}>
          <div style={{ position: "absolute", top: -22, left: -20, background: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>You</div>
        </div>

        {/* Rep Marker (Moving/Pulsing) */}
        <div style={{
          position: "absolute",
          top: isExpanded ? 60 : 25,
          right: 60,
          width: 18,
          height: 18,
          background: C.red,
          borderRadius: "50%",
          transform: `scale(${pulse})`,
          transition: "transform 1s ease-in-out, all 0.4s ease",
          boxShadow: "0 0 0 6px rgba(255,59,48,0.2), 0 4px 12px rgba(255,59,48,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2
        }}>
          <span style={{ fontSize: 10 }}>🚑</span>
          <div style={{ position: "absolute", bottom: -22, right: -30, background: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Hospital Unit</div>
        </div>

        {!isExpanded && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: C.textTitle, zIndex: 10 }}>
            VIEW MAP
          </div>
        )}
      </div>

      {/* Info Content Area */}
      <div style={{ padding: "18px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.red, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="blink">●</span> SOS BROADCAST ACTIVE
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Medical assistance is en route</div>
          </div>
          {isExpanded && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              style={{ background: "#f8f9fa", border: `1px solid ${C.border}`, color: C.textMuted, padding: "6px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = C.red}
              onMouseOut={e => e.currentTarget.style.color = C.textMuted}
            >
              DISMISS
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderRadius: 16, textAlign: "center", border: "1px solid rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Arrival In</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.textTitle }}>{representative?.eta}</div>
          </div>
          <div style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderRadius: 16, textAlign: "center", border: "1px solid rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Distance</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.textTitle }}>{representative?.distance}</div>
          </div>
        </div>

        {isExpanded && (
          <div style={{ marginTop: 20, animation: "fadeInUp 0.4s ease forwards" }}>
            <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Assigned Personnel</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "rgba(0,122,255,0.05)", borderRadius: 16, border: "1px solid rgba(0,122,255,0.1)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14, boxShadow: "0 4px 8px rgba(0,122,255,0.3)" }}>
                {representative?.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textTitle }}>{representative?.name}</div>
                <div style={{ fontSize: 12, color: C.blue, fontWeight: 600 }}>Hospital Outreach Unit</div>
              </div>
              <a
                href={`tel:${representative?.phone}`}
                style={{ width: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", boxShadow: "0 4px 8px rgba(52,199,89,0.3)" }}
              >
                📞
              </a>
            </div>

            <div style={{ marginTop: 16, fontSize: 10, color: C.textMuted, textAlign: "center", fontStyle: "italic" }}>
              Stay calm. Your vitals are being monitored remotely.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
           0% { opacity: 1; }
           50% { opacity: 0.3; }
           100% { opacity: 1; }
        }
        .blink {
           animation: blink 1s infinite;
        }
        .route-flow {
           stroke-dashoffset: 100;
           animation: dash 5s linear infinite;
        }
        @keyframes dash {
           to {
              stroke-dashoffset: 0;
           }
        }
      `}</style>
    </div>
  );
}
