import { useEffect, useState } from 'react'
import { useServerStatus } from '../context/ServerStatusContext'

// ─── Animated dots ────────────────────────────────────────────────
const Dots = () => {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 500)
    return () => clearInterval(id)
  }, [])
  return <span aria-hidden>{'.'.repeat(frame)}&nbsp;</span>
}

// ─── Pulsing status ring ──────────────────────────────────────────
const PulseRing = () => (
  <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 32px' }}>
    {/* Outer rings */}
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          position: 'absolute',
          inset:  `-${i * 16}px`,
          borderRadius: '50%',
          border: '1px solid rgba(239,68,68,0.3)',
          animation: `pulse-ring 2s ease-out ${i * 0.4}s infinite`,
        }}
      />
    ))}
    {/* Center icon */}
    <div style={{
      width: 120, height: 120,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #3d1515, #1a0000)',
      boxShadow: '0 0 0 2px rgba(239,68,68,0.4), 0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 48,
    }}>
      {/* Server icon — pure SVG, no emoji */}
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2"  width="20" height="8" rx="2" ry="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
        <line x1="6" y1="6"  x2="6.01" y2="6"/>
        <line x1="6" y1="18" x2="6.01" y2="18"/>
      </svg>
    </div>
  </div>
)

// ─── Main component ───────────────────────────────────────────────
const MaintenancePage = () => {
  const { retrying, retryNow } = useServerStatus()
  const [countdown, setCountdown] = useState(15)

  // Đếm ngược đến lần retry tiếp theo
  useEffect(() => {
    setCountdown(15)
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { return 15 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [retrying])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes scan {
          0%   { top: 0; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        .retry-btn {
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
        }
        .retry-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239,68,68,0.35);
        }
        .retry-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div
        className="grid-bg"
        style={{
          minHeight: '100dvh',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Outfit', sans-serif",
          padding: '24px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow accent top-left */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Scan line effect */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          opacity: 0.04,
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
            animation: 'scan 4s linear infinite',
          }} />
        </div>

        {/* Card */}
        <div
          style={{
            position: 'relative',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <PulseRing />

          {/* Status badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 999,
            padding: '4px 14px',
            marginBottom: 20,
          }}>
            <div style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#ef4444',
              animation: 'blink 1.2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(239,68,68,0.9)', fontWeight: 500 }}>
              SERVER OFFLINE
            </span>
          </div>

          <h1 style={{
            color: '#f5f5f5',
            fontSize: 'clamp(24px, 5vw, 34px)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            margin: '0 0 12px',
          }}>
            Hệ thống tạm dừng
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 14,
            lineHeight: 1.7,
            margin: '0 0 32px',
            maxWidth: 360,
            marginInline: 'auto',
          }}>
            Chúng tôi đang thực hiện bảo trì hoặc máy chủ gặp sự cố kỹ thuật.
            Dịch vụ sẽ được khôi phục trong thời gian sớm nhất.
          </p>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            margin: '0 0 28px',
          }} />

          {/* Info grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}>
            {[
              { label: 'Trạng thái', value: 'Không phản hồi', color: '#ef4444' },
              { label: 'Tự kiểm tra lại sau', value: retrying ? 'Đang kiểm tra...' : `${countdown}s`, color: '#facc15' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.033)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '12px 14px',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6, letterSpacing: 0.5 }}>
                  {label}
                </div>
                <div style={{ color, fontSize: 13, fontWeight: 600 }}>
                  {value}{retrying && value.includes('...') && <Dots />}
                </div>
              </div>
            ))}
          </div>

          {/* Retry button */}
          <button
            className="retry-btn"
            onClick={retryNow}
            disabled={retrying}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 10,
              border: 'none',
              background: retrying
                ? 'rgba(239,68,68,0.15)'
                : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: retrying ? 'rgba(255,255,255,0.4)' : '#fff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
              letterSpacing: 0.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            aria-label="Thử kết nối lại ngay"
          >
            {/* Refresh icon */}
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: retrying ? 'spin 1s linear infinite' : 'none' }}
            >
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            {retrying ? 'Đang kiểm tra kết nối' : 'Thử kết nối lại ngay'}
          </button>

          <p style={{
            color: 'rgba(255,255,255,0.2)',
            fontSize: 11,
            marginTop: 20,
            letterSpacing: 0.3,
          }}>
            Tự động kiểm tra lại mỗi 15 giây &nbsp;·&nbsp; Toong CMS
          </p>
        </div>

        {/* Spin keyframe for retry icon */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )
}

export default MaintenancePage
