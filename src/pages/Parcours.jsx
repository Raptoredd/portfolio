import GlitchText from '../components/ui/GlitchText'
import Timeline from '../components/parcours/Timeline'
import { timelineEtudes, timelinePro } from '../data/timelineData'

export default function Parcours() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <GlitchText
            text="PARCOURS"
            tag="h1"
            intensity="subtle"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          />
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}>
            Formation académique & expérience professionnelle
          </p>
        </div>

        {/* Desktop: double column timeline */}
        <div className="hidden md:block">
          <Timeline
            leftItems={timelineEtudes}
            rightItems={timelinePro}
            leftLabel="ÉTUDES"
            rightLabel="PRO"
          />
        </div>

        {/* Mobile: single column interleaved */}
        <div className="md:hidden flex flex-col gap-6">
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', textAlign: 'center' }}>
            ÉTUDES
          </h2>
          {timelineEtudes.map(item => (
            <div key={item.id} className="relative pl-4" style={{ borderLeft: '1px solid var(--border-accent)' }}>
              <div className="absolute -left-1.5 top-4 w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
              <div className="p-4 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{item.location} — {item.period}</div>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            </div>
          ))}
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', textAlign: 'center', marginTop: '2rem' }}>
            PRO
          </h2>
          {timelinePro.map(item => (
            <div key={item.id} className="relative pl-4" style={{ borderLeft: '1px solid var(--border-accent)' }}>
              <div className="absolute -left-1.5 top-4 w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
              <div className="p-4 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{item.location} — {item.period}</div>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
