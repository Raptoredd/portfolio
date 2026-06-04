export default function C2Page() {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <pre style={{
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          lineHeight: 1.9,
          margin: 0,
          whiteSpace: 'pre-wrap',
        }}>
{`// C2 PANEL — VERTEX-GHOST
────────────────────────────────────────

Status          : OFFLINE
Connected agents: 0
Last beacon     : —
Uptime          : —

────────────────────────────────────────

[DECRYPTION KEY ENDPOINT]
key             : V3RT3X

────────────────────────────────────────`}
        </pre>
      </div>
    </div>
  )
}
