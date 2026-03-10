import React, { useEffect, useRef } from 'react';
import { C } from '../styles/homeStyles.jsx';

export default function VideoCallModal({ roomId, onEndCall, callerName }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ position: 'absolute', top: 30, color: '#fff', fontSize: 24, fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        {callerName ? `Video Call with ${callerName}` : "Video Call"}
      </div>

      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 1200, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: C.textTitle, fontSize: 18, gap: 24, padding: '60px 40px', textAlign: 'center' }}>
              
              <div style={{ width: 80, height: 80, borderRadius: 40, background: 'rgba(46, 204, 113, 0.1)', color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: -10 }}>
                📹
              </div>

              <div style={{ fontSize: 24, fontWeight: 'bold' }}>Secure Video Room Created</div>
              <p style={{ color: C.textMuted, maxWidth: 400, fontSize: 15, lineHeight: 1.5 }}>
                Please click the button below to join the secure video call. It will open in a new tab to ensure your camera and microphone work perfectly without browser restrictions.
              </p>
              <a 
                href={`https://meet.jit.si/${roomId}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  background: C.green, color: 'white', textDecoration: 'none',
                  padding: '16px 36px', borderRadius: 30, fontSize: 18, fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
                  transition: 'transform 0.2s', marginTop: 10
                }}
              >
                Join Meeting
              </a>
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
