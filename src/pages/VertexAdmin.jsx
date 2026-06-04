import { useState } from 'react'
import { CTF_CHALLENGES } from '../data/ctfData'

const { dbConfig } = CTF_CHALLENGES.find(c => c.id === 'pentest-3')

export default function VertexAdmin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput]     = useState(null)
  const [attempts, setAttempts] = useState(0)

  const handleLogin = (e) => {
    e.preventDefault()
    const isSqli = dbConfig.sqliPatterns.some(
      re => re.test(username) || re.test(password)
    )
    if (isSqli) {
      localStorage.setItem('ctf_sqli_level1', 'true')
      setOutput({ type: 'sqli', text: dbConfig.level1Message })
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

        {/* Header */}
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

        {/* Form panel */}
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

        {/* Output */}
        {output && (
          <div style={{
            marginTop: 12,
            background: '#000',
            border: `1px solid ${output.type === 'err' ? '#f59e0b' : '#22c55e'}`,
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
              color: output.type === 'err' ? '#f59e0b' : '#22c55e',
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
