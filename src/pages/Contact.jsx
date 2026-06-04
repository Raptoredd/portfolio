import { useForm, ValidationError } from '@formspree/react'
import { Github, Linkedin } from 'lucide-react'
import GlitchText from '../components/ui/GlitchText'

const inputStyle = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontSize: 12,
  fontFamily: 'IBM Plex Mono, monospace',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const errorStyle = {
  color: 'var(--red-team)',
  fontSize: 10,
  fontFamily: 'IBM Plex Mono, monospace',
  marginTop: 4,
  display: 'block',
}

const socialLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: 11,
  fontFamily: 'IBM Plex Mono, monospace',
  letterSpacing: '0.06em',
  transition: 'color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Raptoredd',                         icon: Github   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/benjamin-bayle-44a656253/', icon: Linkedin },
]

export default function Contact() {
  const [state, handleSubmit] = useForm('xgobeavb')

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        <GlitchText
          text="CONTACT"
          tag="h1"
          intensity="subtle"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: 'var(--accent)',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        />
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 11,
          fontFamily: 'IBM Plex Mono, monospace',
          marginBottom: 32,
          letterSpacing: '0.04em',
        }}>
          Disponible pour alternances, projets et échanges techniques.
        </p>

        {state.succeeded ? (
          <div style={{
            padding: '24px 20px',
            border: '1px solid var(--accent)',
            borderRadius: 6,
            background: 'var(--accent-glow)',
            fontFamily: 'IBM Plex Mono, monospace',
            color: 'var(--accent)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>✓</span>
            <span>Message envoyé — je vous réponds dès que possible.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 10, display: 'block', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
                NOM COMPLET
              </label>
              <input
                type="text"
                name="name"
                placeholder="Prénom Nom"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 10, display: 'block', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                required
                style={inputStyle}
              />
              <ValidationError field="email" errors={state.errors} style={errorStyle} />
            </div>

            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 10, display: 'block', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
                SUJET <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optionnel)</span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Opportunité d'alternance, question technique…"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 10, display: 'block', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}>
                MESSAGE
              </label>
              <textarea
                name="message"
                placeholder="Votre message…"
                rows={6}
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
              />
              <ValidationError field="message" errors={state.errors} style={errorStyle} />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              style={{
                background: state.submitting ? 'transparent' : 'var(--accent)',
                border: '1px solid var(--accent)',
                color: state.submitting ? 'var(--accent)' : 'var(--bg-primary)',
                padding: '12px 24px',
                borderRadius: 4,
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: state.submitting ? 'not-allowed' : 'crosshair',
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              {state.submitting ? 'Envoi en cours…' : 'ENVOYER →'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <Icon size={14} />
              {label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
