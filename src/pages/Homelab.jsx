import NetworkGraph from '../components/homelab/NetworkGraph'

export default function Homelab() {
  return (
    <div style={{
      height: 'calc(100vh - 56px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ padding: '24px 32px 0', flexShrink: 0 }}>
        <h1
          className="glitch glitch-subtle"
          data-text="HOMELAB"
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          HOMELAB
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'IBM Plex Mono, monospace',
          marginTop: 8,
          letterSpacing: '0.04em',
        }}>
          Infrastructure Zero Trust bare-metal · hegemonia.lan · Cliquer sur un nœud pour les détails
        </p>
      </div>
      <div style={{ flex: 1, marginTop: 16, overflow: 'hidden' }}>
        <NetworkGraph />
      </div>
    </div>
  )
}
