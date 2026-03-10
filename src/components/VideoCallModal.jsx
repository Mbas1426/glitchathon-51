import React, { useEffect, useRef } from 'react';
import { C } from '../styles/homeStyles.jsx';

export default function VideoCallModal({ localStream, remoteStream, onEndCall, callerName }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ position: 'absolute', top: 30, color: 'white', fontSize: 24, fontWeight: 'bold' }}>
        {callerName ? `Video Call with ${callerName}` : "Video Call"}
      </div>

      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 1200, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', width: '70%', height: '70%', background: '#000', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {remoteStream ? (
            <video playsInline ref={remoteVideoRef} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
              Waiting for remote video...
            </div>
          )}

          {/* Picture in Picture Local Video */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            width: 200, height: 150, background: '#333',
            borderRadius: 16, overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <video playsInline muted ref={localVideoRef} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 30 }}>
        <button
          onClick={onEndCall}
          style={{
            background: C.red, color: 'white', border: 'none',
            padding: '16px 32px', borderRadius: 30, fontSize: 18, fontWeight: 'bold',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,59,48,0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          End Call
        </button>
      </div>
    </div>
  );
}