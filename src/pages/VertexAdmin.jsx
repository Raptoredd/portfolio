import { useState, useEffect } from 'react'
import { CTF_CHALLENGES } from '../data/ctfData'

const { dbConfig } = CTF_CHALLENGES.find(c => c.id === 'pentest-3')

const WAF_PATTERNS = [
  /'\s*or\s*'1'\s*=\s*'1/i,
  /'\s*or\s*1\s*=\s*1/i,
  /union\s+select/i,
  /'\s*or\s*'/i,
  /drop\s+table/i,
  /insert\s+into/i,
  /'\s*--/i,
  /'\s*#/i,
  /1\s*=\s*1/i,
  /sleep\s*\(/i,
  /benchmark\s*\(/i,
  /\/\*.*\*\//i,
  /exec\s*\(/i,
  /'\s*and\s+/i,
  /'\s*or\s+/i,
]

const ACCOUNTS = [
  { name: 'Jean Moreau',       role: 'Employé',      email: 'j.moreau@vertex-studio.com' },
  { name: 'Sophie Leclerc',    role: 'Employé',      email: 's.leclerc@vertex-studio.com' },
  { name: 'Thomas Bernard',    role: 'Admin IT',     email: 't.bernard@vertex-studio.com' },
  { name: 'Marie Fontaine',    role: 'RH',           email: 'm.fontaine@vertex-studio.com' },
  { name: 'Karim Benzara',     role: 'Développeur',  email: 'k.benzara@vertex-studio.com' },
  { name: 'Yuki Tanaka',       role: 'Designer',     email: 'y.tanaka@vertex-studio.com' },
  { name: 'Amara Diallo',      role: 'Comptabilité', email: 'a.diallo@vertex-studio.com' },
  { name: 'Lucas Ferreira',    role: 'DevOps',       email: 'l.ferreira@vertex-studio.com' },
  { name: 'Priya Sharma',      role: 'Data Analyst', email: 'p.sharma@vertex-studio.com' },
  { name: 'Matteo Romano',     role: 'Employé',      email: 'm.romano@vertex-studio.com' },
  { name: 'Fatima El Amrani',  role: 'Employé',      email: 'f.elamrani@vertex-studio.com' },
  { name: 'Hugo Dubois',       role: 'Marketing',    email: 'h.dubois@vertex-studio.com' },
  { name: 'Lena Müller',       role: 'Employé',      email: 'l.muller@vertex-studio.com' },
  { name: 'Chen Wei',          role: 'Développeur',  email: 'c.wei@vertex-studio.com' },
  { name: 'Isabelle Petit',    role: 'Juridique',    email: 'i.petit@vertex-studio.com' },
  { name: 'Rajan Patel',       role: 'Employé',      email: 'r.patel@vertex-studio.com' },
  { name: 'Camille Rousseau',  role: 'Employé',      email: 'c.rousseau@vertex-studio.com' },
  { name: 'Omar Benali',       role: 'Support IT',   email: 'o.benali@vertex-studio.com' },
  { name: 'Nadia Kowalski',    role: 'Employé',      email: 'n.kowalski@vertex-studio.com' },
  { name: 'Antoine Girard',    role: 'Commercial',   email: 'a.girard@vertex-studio.com' },
  { name: 'Yuna Park',         role: 'Employé',      email: 'y.park@vertex-studio.com' },
  { name: 'Diego Herrera',     role: 'Développeur',  email: 'd.herrera@vertex-studio.com' },
  { name: 'Aïcha Traoré',      role: 'Employé',      email: 'a.traore@vertex-studio.com' },
  { name: 'Sven Lindqvist',    role: 'Employé',      email: 's.lindqvist@vertex-studio.com' },
  { name: 'V. Studio',         role: 'OWNER',        email: 'owner@vertex-studio.com', isOwner: true },
]

export default function VertexAdmin() {
  const [phase, setPhase] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [toast, setToast] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken === dbConfig.sessionUUID) {
      setPhase('level2')
    }
  }, [])

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const isbypass = username.trim() === "admin'--"
    if (isbypass) {
      setOutput({ type: 'sqli', text: dbConfig.level1Message })
      return
    }
    const isWafBlocked = WAF_PATTERNS.some(p => p.test(username))
    if (isWafBlocked) {
      setOutput({ type: 'waf', text: dbConfig.wafMessage })
      return
    }
    const valid = dbConfig.users.find(
      u => u.username === username && u.password === password
    )
    if (valid) {
      setOutput({ type: 'ok', text: 'Accès accordé — aucun flag ici.' })
    } else {
      const n = attempts + 1
      setAttempts(n)
      setOutput({ type: 'err', text: `[403] Identifiants incorrects. Tentative ${n} journalisée.` })
    }
  }

  const handleReset = (account) => {
    if (account.isOwner) {
      setShowConfirmModal(true)
    } else {
      showToastMsg(`Email de réinitialisation envoyé à ${account.email}`)
    }
  }

  const inputSt = {
    width: '100%',
    background: '#0a0a12',
    border: '1px solid #2a2a3a',
    borderRadius: 3,
    padding: '8px 10px',
    color: '#e8e8f0',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  }

  if (phase === 'level2') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050508',
        fontFamily: "'IBM Plex Mono', monospace",
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 16 }}>
          <div style={{
            fontSize: 20,
            fontFamily: "'Share Tech Mono', monospace",
            color: '#3b82f6',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            VERTEX STUDIO
          </div>
          <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
            CLOUD ACCESS MANAGEMENT — v1.2
          </div>
          <div style={{ width: 48, height: 2, background: '#3b82f6', margin: '0 auto', opacity: 0.8 }} />
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 2.5fr 1fr',
              background: '#0d0d1a',
              padding: '8px 14px',
              fontSize: 9,
              color: '#3b82f6',
              letterSpacing: '0.15em',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              borderBottom: '1px solid #1e1e2e',
            }}>
              <span>NOM</span>
              <span>RÔLE</span>
              <span>EMAIL</span>
              <span>ACTION</span>
            </div>
            {ACCOUNTS.map((acc) => (
              <div key={acc.email} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 2.5fr 1fr',
                padding: '9px 14px',
                alignItems: 'center',
                borderBottom: '1px solid #111120',
                background: acc.isOwner ? 'rgba(245,158,11,0.04)' : 'transparent',
              }}>
                <span style={{
                  fontSize: 12,
                  color: acc.isOwner ? '#f59e0b' : '#c8c8d8',
                  fontWeight: acc.isOwner ? 700 : 400,
                }}>
                  {acc.name}
                </span>
                <span style={{
                  fontSize: 10,
                  color: acc.isOwner ? '#f59e0b' : '#666',
                  letterSpacing: '0.06em',
                }}>
                  {acc.role}
                </span>
                <span style={{ fontSize: 11, color: '#555' }}>
                  {acc.email}
                </span>
                <button
                  onClick={() => handleReset(acc)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${acc.isOwner ? '#f59e0b' : '#2a2a3a'}`,
                    borderRadius: 3,
                    padding: '3px 8px',
                    color: acc.isOwner ? '#f59e0b' : '#555',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Reset MDP
                </button>
              </div>
            ))}
          </div>
        </div>

        {showConfirmModal && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              style={{
                background: '#0d0d1a',
                border: '1px solid #f59e0b',
                borderRadius: 6,
                padding: '1.5rem',
                maxWidth: 360,
                width: '90%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: '#e8e8f0',
                marginBottom: '1.25rem',
                lineHeight: 1.6,
              }}>
                Réinitialiser le mot de passe de{' '}
                <span style={{ color: '#f59e0b' }}>V. Studio (OWNER)</span> ?
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a2a3a',
                    borderRadius: 3,
                    padding: '6px 14px',
                    color: '#666',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  ANNULER
                </button>
                <button
                  onClick={() => { setShowConfirmModal(false); setShowEmailModal(true) }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #f59e0b',
                    borderRadius: 3,
                    padding: '6px 14px',
                    color: '#f59e0b',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  CONFIRMER
                </button>
              </div>
            </div>
          </div>
        )}

        {showEmailModal && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setShowEmailModal(false)}
          >
            <div
              style={{
                background: '#0d0d1a',
                border: '1px solid #1e1e2e',
                borderRadius: 6,
                padding: '1.5rem',
                maxWidth: 520,
                width: '90%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                borderBottom: '1px solid #1e1e2e',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontSize: 9, color: '#3b82f6', letterSpacing: '0.15em',
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, marginBottom: 8,
                }}>
                  EMAIL SIMULÉ — owner@vertex-studio.com
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                  <div><span style={{ color: '#555' }}>De : </span><span style={{ color: '#888' }}>noreply@vertex-studio.com</span></div>
                  <div><span style={{ color: '#555' }}>À : </span><span style={{ color: '#888' }}>owner@vertex-studio.com</span></div>
                  <div><span style={{ color: '#555' }}>Objet : </span><span style={{ color: '#c8c8d8' }}>Réinitialisation de votre mot de passe — Vertex Studio Cloud</span></div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#c8c8d8', lineHeight: 1.75, marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.75rem' }}>Bonjour,</p>
                <p style={{ marginBottom: '0.75rem' }}>
                  Une demande de réinitialisation de mot de passe a été initiée pour votre compte{' '}
                  <strong>V. Studio (OWNER)</strong>.
                </p>
                <div style={{
                  background: '#060611',
                  border: '1px solid #2a2a3a',
                  borderRadius: 4,
                  padding: '10px 14px',
                  marginBottom: '0.75rem',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  <div style={{
                    fontSize: 9, color: '#555', letterSpacing: '0.12em', marginBottom: 6,
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                  }}>
                    TOKEN DE RÉCUPÉRATION
                  </div>
                  <div style={{ fontSize: 13, color: '#3b82f6', wordBreak: 'break-all', userSelect: 'text' }}>
                    {'FLAG{sql1_byw4ss3d_4nd_d3c0d3d}'}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#555' }}>
                  Ce token expire dans 15 minutes. Ne le partagez pas.
                </p>
              </div>

              <button
                onClick={() => setShowEmailModal(false)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #2a2a3a',
                  borderRadius: 3,
                  padding: '7px',
                  color: '#555',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                FERMER
              </button>
            </div>
          </div>
        )}

        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0d0d1a',
            border: '1px solid #2a2a3a',
            borderRadius: 4,
            padding: '8px 20px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: '#c8c8d8',
            whiteSpace: 'nowrap',
            zIndex: 50,
          }}>
            {toast}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'IBM Plex Mono', monospace",
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 20,
            fontFamily: "'Share Tech Mono', monospace",
            color: '#ff2d55',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            VERTEX STUDIO
          </div>
          <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
            INTERNAL ADMINISTRATION PANEL — v0.3
          </div>
          <div style={{ width: 48, height: 2, background: '#ff2d55', margin: '0 auto', opacity: 0.8 }} />
        </div>

        <div style={{
          border: '1px solid #1e1e2e',
          borderRadius: 4,
          padding: 20,
          background: 'rgba(255,45,85,0.02)',
        }}>
          <p style={{
            fontSize: 9,
            color: '#ff2d55',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 18,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
          }}>
            ADMIN PANEL — Accès restreint
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, color: '#555', marginBottom: 4, letterSpacing: '.1em' }}>
                IDENTIFIANT
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
                style={inputSt}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, color: '#555', marginBottom: 4, letterSpacing: '.1em' }}>
                MOT DE PASSE
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputSt}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: '1px solid #ff2d55',
                borderRadius: 3,
                padding: '8px',
                color: '#ff2d55',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              CONNEXION
            </button>
          </form>

          <p style={{ fontSize: 9, color: '#2a2a3a', marginTop: 16, lineHeight: 1.6 }}>
            ⚠ Toute tentative non autorisée est journalisée et peut faire l'objet de poursuites.
          </p>
        </div>

        {output && (
          <div style={{
            marginTop: 12,
            background: '#000',
            border: `1px solid ${
              output.type === 'waf' ? '#f54b4b' :
              output.type === 'err' ? '#f59e0b' :
              '#22c55e'
            }`,
            borderRadius: 4,
            padding: '10px 12px',
          }}>
            <p style={{
              fontSize: 9, color: '#333', marginBottom: 6,
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: '.1em',
            }}>
              SYSTEM OUTPUT
            </p>
            <pre style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: output.type === 'waf' ? '#f54b4b' :
                     output.type === 'err' ? '#f59e0b' :
                     '#22c55e',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: 0,
              lineHeight: 1.65,
              userSelect: 'text',
            }}>
              {output.text}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
