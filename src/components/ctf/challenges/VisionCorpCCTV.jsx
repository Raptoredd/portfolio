import { ExternalLink } from 'lucide-react'

export default function VisionCorpCCTV() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        Système de vidéosurveillance VisionCorp accessible en ligne.
        Tu as obtenu des credentials guest — inspecte ta session.
      </p>
      <a
        href="/visioncorp"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          fontSize: 12, letterSpacing: '.1em',
          padding: '8px 16px', alignSelf: 'flex-start',
          background: 'var(--accent)', color: 'var(--bg-primary)',
          borderRadius: 4, textDecoration: 'none',
          transition: 'opacity .2s',
        }}
      >
        <ExternalLink size={13} />
        OUVRIR VISIONCORP
      </a>
    </div>
  )
}
