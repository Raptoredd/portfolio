import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '24px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        © {year} — Benjamin Bayle — Étudiant Cybersécurité @ Guardia
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a
          href="https://github.com/Raptoredd"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Github size={14} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/benjamin-bayle-44a656253"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Linkedin size={14} /> LinkedIn
        </a>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
          benjaminbayle.tech
        </span>
      </div>
    </footer>
  )
}
