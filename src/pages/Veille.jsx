import RSSFeed from '../components/veille/RSSFeed'

export default function Veille() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <RSSFeed />
    </div>
  )
}
