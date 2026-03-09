import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useData } from "../CareAgent_Combined";
import { pt } from '../styles/patientStyles'
import { C } from '../styles/homeStyles.jsx'
import { d } from '../styles/doctorStyles.jsx';
import PtOverview from "./PtOverview.jsx";
import PtTests from "./PtTests.jsx";
import PtAppointments from "./PtAppointments.jsx";
import PtMessages from "./PtMessages.jsx";
import PtProfile from "./PtProfile.jsx";
import VideoCallModal from "./VideoCallModal.jsx";
import { useSocket } from '../SocketContext.jsx';
import Peer from 'simple-peer';
import { CSS } from '../styles/css.jsx';

export default function PatientApp({ patient: p, onLogout }) {
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

  const { getRiskTier, CARE_PROTOCOLS, PHYSICIANS, OUTREACH_MSGS, APPOINTMENTS, TEST_HISTORY, STATUS_MAP } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [msgs, setMsgs] = useState(OUTREACH_MSGS[p.patient_id] || []);
  const socket = useSocket();

  const [callState, setCallState] = useState({
    isCalling: false,
    receivingCall: false,
    caller: "",
    callerName: "",
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
  });

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const connectionRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.on("callUser", (data) => {
      setCallState(prev => ({
        ...prev,
        receivingCall: true,
        caller: data.from,
        callerName: data.callerName,
        callerSignal: data.signal,
      }));
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("callUser");
      socket.off("callEnded");
    };
  }, [socket]);

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setCallState(prev => ({ ...prev, callAccepted: true, receivingCall: false }));

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: callState.caller });
      });

      peer.on("stream", (currentStream) => {
        setRemoteStream(currentStream);
      });

      peer.signal(callState.callerSignal);
      connectionRef.current = peer;
    } catch (err) {
      console.error("Failed to answer call", err);
      // Fallback or alert user
    }
  };

  const declineCall = () => {
    setCallState(prev => ({ ...prev, receivingCall: false }));
    socket.emit("declineCall", { to: callState.caller });
  };

  const endCall = () => {
    setCallState({ isCalling: false, receivingCall: false, caller: "", callerName: "", callerSignal: null, callAccepted: false, callEnded: true });

    if (connectionRef.current) connectionRef.current.destroy();

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);

    if (callState.caller) {
      socket.emit("endCall", { to: callState.caller });
    }
  };

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:5002/outreach/${p.patient_id}`);
        if (res.ok) {
          const data = await res.json();
          setMsgs(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMsgs();
  }, [p.patient_id]);

  const pathParts = location.pathname.split('/');
  const tab = pathParts[pathParts.indexOf(id) + 1] || "overview";
  const risk = getRiskTier(p);
  const proto = CARE_PROTOCOLS.find(c => c.diagnosis_name === p.diagnosis);
  const doc = PHYSICIANS.find(ph => ph.physician_id === p.physician_id);
  const appts = APPOINTMENTS[p.patient_id] || [];
  const hist = TEST_HISTORY[p.patient_id] || [];
  const isUrgent = p.status === "escalated";
  const isOverdue = p.overdue_days > 0 && p.status !== "closed";

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "tests", label: "Test History" },
    { id: "appointments", label: "Appointments" },
    { id: "messages", label: `Messages${msgs.length ? ` (${msgs.length})` : ""}` },
    { id: "profile", label: "My Profile" },
  ];

  return (
    <div style={pt.root}>
      <SvgBackground />
      <div style={{ ...pt.appContainer, zIndex: 1, position: 'relative' }}>
        <style>{CSS}</style>
        <header style={pt.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={d.logoMark}><span style={{ fontSize: 18, color: "#fff" }}></span></div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.textTitle, letterSpacing: "-0.5px" }}>CareAgent</span>
              <span style={{ fontSize: 13, color: C.textMuted, margin: "0 10px" }}>/</span>
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>Patient Portal</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textTitle }}>{p.patient_name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, fontWeight: 400 }}>#{String(p.patient_id).padStart(4, "0")} · {p.diagnosis}</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${isUrgent ? C.red : isOverdue ? "#FF9500" : C.border}`, color: isUrgent ? C.red : isOverdue ? "#FF9500" : C.textMuted, borderRadius: 8, letterSpacing: 0.5, fontWeight: 500 }}>{STATUS_MAP[p.status]}</span>
            <button onClick={onLogout} style={{ fontSize: 13, padding: "8px 16px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.5)", cursor: "pointer", color: C.textTitle, borderRadius: 10, fontWeight: 500, transition: "all 0.2s" }}>Sign Out</button>
          </div>
        </header>

        {isUrgent && (
          <div style={{ background: C.redDim, borderBottom: `1px solid ${C.red}40`, color: C.red, padding: "10px 28px", display: "flex", alignItems: "center", gap: 14 }} className="fadeSlide">
            <span style={{ fontSize: 16, fontWeight: 700 }}>!</span>
            <span style={{ fontSize: 11, lineHeight: 1.5, flex: 1 }}>Action required — Your {p.last_test} result of <strong>{p.last_value} {proto?.unit}</strong> is critically above the safe range. Contact {doc?.physician_name} immediately.</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{doc?.phone}</span>
          </div>
        )}

        <nav style={{ background: "rgba(255,255,255,0.5)", borderBottom: `1px solid ${C.border}`, padding: "12px 32px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => navigate(`/patient/${id}/${t.id}`)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: tab === t.id ? "#fff" : "transparent", fontSize: 13, cursor: "pointer", color: tab === t.id ? C.textTitle : C.textMuted, transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)", fontWeight: tab === t.id ? 600 : 500, boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" : "none", transform: tab === t.id ? "translateY(-1px)" : "translateY(0)" }}>
              {t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, fontWeight: 500 }}>Kathir Memorial · Chennai</div>
        </nav>

        <div style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, width: "100%", margin: "0 auto", overflowY: "auto" }} className="fadeIn" key={tab}>
          <Routes>
            <Route path="overview" element={<PtOverview p={p} proto={proto} doc={doc} hist={hist} msgs={msgs} />} />
            <Route path="tests" element={<PtTests p={p} proto={proto} hist={hist} />} />
            <Route path="appointments" element={<PtAppointments p={p} appts={appts} doc={doc} proto={proto} />} />
            <Route path="messages" element={<PtMessages p={p} msgs={msgs} />} />
            <Route path="profile" element={<PtProfile p={p} doc={doc} proto={proto} />} />
            <Route path="/" element={<Navigate to={`/patient/${id}/overview`} replace />} />
          </Routes>
        </div>

        {/* INCOMING CALL BANNER / MODAL */}
        {callState.receivingCall && !callState.callAccepted && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Incoming Video Call</div>
              <div style={{ fontSize: 18, color: C.textMuted, marginBottom: 30 }}>{callState.callerName} is calling you...</div>

              <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                <button
                  onClick={declineCall}
                  style={{ background: C.red, color: 'white', padding: '12px 24px', borderRadius: 20, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Decline
                </button>
                <button
                  onClick={answerCall}
                  style={{ background: C.green, color: 'white', padding: '12px 24px', borderRadius: 20, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE CALL UI */}
        {callState.callAccepted && (
          <VideoCallModal
            localStream={localStream}
            remoteStream={remoteStream}
            callerName={callState.callerName}
            onEndCall={endCall}
          />
        )}

      </div>
    </div>
  );
}