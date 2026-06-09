import { useState, useEffect, useRef } from 'react'
import { Camera, Film, Bell, Settings, LogOut, X } from 'lucide-react'

const GUEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJndWVzdCIsInJvbGUiOiJndWVzdCIsImlzcyI6IlZpc2lvbkNvcnAiLCJpYXQiOjE3NDgwMDAwMDB9.WCHjxsePkPJZD_9pdJk9QyxUiwbRLQ4uIvzJn-n9z28'
const FLAG = 'FLAG{w34k_s3cr3t_c4m3r4_0wn3d}'

function decodeJWTRole(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded.role || null
  } catch { return null }
}

function StatusBar() {
  return (
    <div style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: '0.7rem',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 20,
    }}>
      <span style={{ color: '#00ff88' }}>●</span>
      SYSTÈME EN LIGNE | VisionCorp CCTV v2.1.4 | 4 caméras connectées
    </div>
  )
}

export default function VisionCorpPage() {
  const [phase, setPhase] = useState(() => {
    const stored = localStorage.getItem('visioncorp_token')
    if (!stored) return 'login'
    const role = decodeJWTRole(stored)
    if (role === 'admin') return 'admin'
    if (role === 'guest') return 'guest'
    return 'login'
  })
  const [password, setPassword] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [videoModal, setVideoModal] = useState(false)
  const [showLiveModal, setShowLiveModal] = useState(false)
  const toastRef = useRef(null)

  useEffect(() => () => { if (toastRef.current) clearTimeout(toastRef.current) }, [])

  useEffect(() => {
    console.log('[VisionCorp] localStorage visioncorp_token:',
      localStorage.getItem('visioncorp_token'))
  }, [])

  const showToast = (msg) => {
    if (toastRef.current) clearTimeout(toastRef.current)
    setToast(msg)
    toastRef.current = setTimeout(() => setToast(null), 3000)
  }

  const handlePasswordLogin = () => {
    if (password === 'guest123') {
      localStorage.setItem('visioncorp_token', GUEST_TOKEN)
      setError(null)
      setPhase('guest')
    } else {
      setError('Identifiants incorrects')
    }
  }

  const handleTokenLogin = () => {
    const role = decodeJWTRole(tokenInput.trim())
    console.log('[VisionCorp] decoded role:', role)
    if (role === 'admin') {
      localStorage.setItem('visioncorp_token', tokenInput.trim())
      setError(null)
      setPhase('admin')
    } else {
      setError('Accès refusé — rôle insuffisant')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('visioncorp_token')
    setPhase('login')
    setPassword('')
    setTokenInput('')
    setError(null)
  }

  const inputStyle = {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 12,
    padding: '8px 10px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 4,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  const features = [
    { Icon: Camera,   label: 'Live View',         action: phase === 'admin' ? () => setShowLiveModal(true) : null },
    { Icon: Film,     label: 'Enregistrements',    action: phase === 'admin' ? () => showToast('Fonctionnalité réservée aux abonnés Premium') : null },
    { Icon: Bell,     label: 'Alertes mouvement',  action: phase === 'admin' ? () => showToast('Fonctionnalité réservée aux abonnés Premium') : null },
    { Icon: Settings, label: 'Paramètres',         action: phase === 'admin' ? () => showToast('Fonctionnalité réservée aux abonnés Premium') : null },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '2rem',
        position: 'relative',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Camera size={20} style={{ color: 'var(--accent)' }} />
          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '.12em',
            color: 'var(--text-primary)',
          }}>
            VisionCorp CCTV
          </span>
          {phase !== 'login' && (
            <>
              <span style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '.1em',
                padding: '1px 7px',
                borderRadius: 3,
                background: phase === 'admin' ? 'rgba(155,89,245,0.12)' : 'rgba(107,114,128,0.12)',
                color: phase === 'admin' ? 'var(--accent)' : 'var(--text-muted)',
                border: `1px solid ${phase === 'admin' ? 'var(--border-accent)' : 'rgba(107,114,128,0.3)'}`,
              }}>
                {phase === 'admin' ? 'ADMIN' : 'GUEST'}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11,
                  letterSpacing: '.08em', padding: '3px 8px',
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', borderRadius: 3, cursor: 'pointer',
                }}
              >
                <LogOut size={11} /> DÉCONNECTER
              </button>
            </>
          )}
        </div>

        <StatusBar />

        {/* Login */}
        {phase === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value="guest"
              readOnly
              style={{ ...inputStyle, color: 'var(--text-muted)', cursor: 'not-allowed' }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
              style={inputStyle}
            />
            <button
              onClick={handlePasswordLogin}
              style={{
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                fontSize: 13, letterSpacing: '.1em', padding: '9px',
                background: 'var(--accent)', color: 'var(--bg-primary)',
                border: 'none', borderRadius: 4, cursor: 'pointer',
              }}
            >
              SE CONNECTER
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--text-muted)',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              margin: '4px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              — ou —
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <input
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="Coller un token JWT"
              style={{ ...inputStyle, fontSize: 11 }}
            />
            <button
              onClick={handleTokenLogin}
              style={{
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                fontSize: 13, letterSpacing: '.1em', padding: '9px',
                background: 'transparent', color: 'var(--accent)',
                border: '1px solid var(--border-accent)', borderRadius: 4, cursor: 'pointer',
              }}
            >
              SE CONNECTER AVEC TOKEN
            </button>

            {error && (
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
                color: '#f54b4b', textAlign: 'center', margin: 0,
              }}>
                {error}
              </p>
            )}
          </div>
        )}

        {/* Guest / Admin */}
        {phase !== 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {features.map(({ Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action || undefined}
                  disabled={!action}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, padding: '18px 8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    color: action ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
                    cursor: action ? 'pointer' : 'not-allowed',
                    opacity: action ? 1 : 0.4,
                    pointerEvents: action ? 'auto' : 'none',
                    transition: 'border-color .2s',
                  }}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {phase === 'guest' && (
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                margin: 0,
              }}>
                Contactez votre administrateur pour obtenir les autorisations de visionnage.
              </p>
            )}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'absolute', bottom: 16, left: 16, right: 16,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem',
            color: 'var(--text-primary)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: 4,
            textAlign: 'center',
          }}>
            {toast}
          </div>
        )}
      </div>

      {showLiveModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowLiveModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '1.5rem',
              maxWidth: 640,
              width: '90%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              padding: '8px 16px',
              marginBottom: '1rem',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.9rem',
              color: 'var(--accent)',
              textAlign: 'center',
            }}>
              🚩 FLAG{'{'}w34k_s3cr3t_c4m3r4_0wn3d{'}'}
            </div>

            <video
              src="/ctf/security_camera.mp4"
              autoPlay
              loop
              muted
              style={{ width: '100%', borderRadius: 4, display: 'block' }}
            />

            <button
              onClick={() => setShowLiveModal(false)}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              FERMER
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
