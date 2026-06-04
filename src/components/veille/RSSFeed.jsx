import { useState, useEffect, useCallback, useRef } from 'react'
import { RSS_FEEDS, RSS_CATEGORIES } from '../../data/rssFeeds'

// ─── API rss2json ─────────────────────────────────────────────────────────────
// Endpoint public (sans clé) : 10 req/heure
// Avec VITE_RSS2JSON_KEY : 1 req/10s, 10 000 req/mois
const RSS2JSON_KEY = import.meta.env.VITE_RSS2JSON_KEY || ''
const RSS2JSON = url =>
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=20${RSS2JSON_KEY ? `&api_key=${RSS2JSON_KEY}` : ''}`

const ALLORIGINS  = url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
const CORSPROXY   = url => `https://corsproxy.io/?${encodeURIComponent(url)}`

// ─── FALLBACK XML PARSER ──────────────────────────────────────────────────────
function parseXmlFallback(raw) {
  try {
    const cleaned = raw.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)/g, '&amp;')
    const xml = new DOMParser().parseFromString(cleaned, 'text/xml')
    if (xml.querySelector('parsererror')) return []
    return [...xml.querySelectorAll('item')].slice(0, 20).map(el => ({
      title:       el.querySelector('title')?.textContent?.trim() || '',
      link:        el.querySelector('link')?.textContent?.trim() || '#',
      description: (el.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, ' ').trim().slice(0, 200),
      pubDate:     el.querySelector('pubDate')?.textContent || '',
      guid:        el.querySelector('guid')?.textContent || el.querySelector('link')?.textContent || '',
    }))
  } catch { return [] }
}

function xmlItemsToFeed(items, feed) {
  return items.map(item => ({
    id:          `${feed.id}::${item.guid || item.link}`,
    title:       item.title || '(sans titre)',
    link:        item.link || '#',
    description: item.description || '',
    pubDate:     item.pubDate || '',
    thumbnail:   null,
    source:      feed.id,
    sourceLabel: feed.label,
    sourceColor: feed.color,
    tag:         feed.tag,
    category:    feed.category,
  }))
}

// ─── NORMALISATION rss2json → format interne ──────────────────────────────────
function normalizeRss2json(item, feed) {
  const rawDesc  = item.description || item.content || ''
  const cleanDesc = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)
  return {
    id:          `${feed.id}::${item.guid || item.link}`,
    title:       item.title || '(sans titre)',
    link:        item.link || '#',
    description: cleanDesc,
    pubDate:     item.pubDate || '',
    thumbnail:   item.thumbnail || null,
    source:      feed.id,
    sourceLabel: feed.label,
    sourceColor: feed.color,
    tag:         feed.tag,
    category:    feed.category,
  }
}

// ─── FETCH UN FLUX (3 stratégies) ─────────────────────────────────────────────
async function fetchFeed(feed) {
  // Stratégie 1 : rss2json (JSON propre, entités décodées côté serveur)
  try {
    const res = await fetch(RSS2JSON(feed.url), { signal: AbortSignal.timeout(12000) })
    if (res.ok) {
      const data = await res.json()
      if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map(item => normalizeRss2json(item, feed))
      }
      console.warn(`[RSS] rss2json status "${data.status}" pour ${feed.id}:`, data.message)
    }
  } catch (e) {
    console.warn(`[RSS] rss2json erreur pour ${feed.id}:`, e.message)
  }

  // Stratégie 2 : allorigins + DOMParser
  try {
    const res = await fetch(ALLORIGINS(feed.url), { signal: AbortSignal.timeout(14000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const raw  = json.contents
    if (typeof raw !== 'string' || raw.length < 100) throw new Error('Contenu vide')
    const items = parseXmlFallback(raw)
    if (items.length > 0) return xmlItemsToFeed(items, feed)
  } catch (e) {
    console.warn(`[RSS] allorigins erreur pour ${feed.id}:`, e.message)
  }

  // Stratégie 3 : corsproxy.io
  try {
    const res = await fetch(CORSPROXY(feed.url), { signal: AbortSignal.timeout(12000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw   = await res.text()
    const items = parseXmlFallback(raw)
    if (items.length > 0) return xmlItemsToFeed(items, feed)
  } catch (e) {
    console.warn(`[RSS] corsproxy erreur pour ${feed.id}:`, e.message)
  }

  throw new Error(`Tous les proxies ont échoué pour ${feed.id}`)
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const m = Math.floor((Date.now() - d.getTime()) / 60000)
  if (m < 1)  return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  const j = Math.floor(h / 24)
  if (j < 7)  return `il y a ${j}j`
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

// ─── ITEM ─────────────────────────────────────────────────────────────────────
function RSSItem({ item }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', textDecoration: 'none', padding: '12px 14px',
        borderRadius: 5,
        border: `1px solid ${hov ? item.sourceColor : 'var(--border,#2a2a42)'}`,
        background: hov ? `${item.sourceColor}0d` : 'var(--bg-surface,#16162a)',
        marginBottom: 7, transition: 'all .18s ease',
        boxShadow: hov ? `0 0 10px ${item.sourceColor}33` : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{
          background: item.sourceColor + '22', color: item.sourceColor,
          border: `1px solid ${item.sourceColor}44`, borderRadius: 3,
          padding: '1px 6px', fontSize: 9,
          fontFamily: 'IBM Plex Mono,monospace', letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          {item.tag}
        </span>
        <span style={{ color: '#44445a', fontSize: 10, fontFamily: 'IBM Plex Mono,monospace' }}>
          {relativeTime(item.pubDate)}
        </span>
      </div>
      <div style={{ color: '#e8e8f0', fontSize: 12, fontFamily: 'IBM Plex Mono,monospace', lineHeight: 1.4, fontWeight: 600, marginBottom: 4 }}>
        {item.title}
      </div>
      {item.description && (
        <div style={{
          color: '#8888aa', fontSize: 11, fontFamily: 'IBM Plex Mono,monospace', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.description}
        </div>
      )}
      <div style={{ color: item.sourceColor + '88', fontSize: 9, marginTop: 5, fontFamily: 'IBM Plex Mono,monospace' }}>
        {item.sourceLabel} →
      </div>
    </a>
  )
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function SkeletonItem() {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 5, border: '1px solid var(--border,#2a2a42)', background: 'var(--bg-surface,#16162a)', marginBottom: 7 }}>
      {[70, 100, 55].map((w, i) => (
        <div key={i} style={{
          height: i === 1 ? 13 : 9, width: `${w}%`,
          background: 'var(--border,#2a2a42)', borderRadius: 3,
          marginBottom: i < 2 ? 7 : 0,
          animation: 'pulse-accent 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.12}s`,
        }} />
      ))}
    </div>
  )
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function RSSFeed() {
  const [items, setItems]                   = useState([])
  const [errors, setErrors]                 = useState({})
  const [loading, setLoading]               = useState(true)
  const [activeCategory, setActiveCategory] = useState('CVE')
  const [activeSources, setActiveSources]   = useState(RSS_FEEDS.map(f => f.id))
  const [search, setSearch]                 = useState('')
  const [sortOrder, setSortOrder]           = useState('desc')
  const [refreshing, setRefreshing]         = useState(false)
  const [showEasterEgg, setShowEasterEgg]   = useState(false)
  const intervalRef                         = useRef(null)

  const loadFeeds = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed))
    const all = []; const errs = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') all.push(...r.value)
      else errs[RSS_FEEDS[i].id] = true
    })

    const seen = new Set()
    setItems(all.filter(it => { if (seen.has(it.id)) return false; seen.add(it.id); return true }))
    setErrors(errs)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    loadFeeds()
    intervalRef.current = setInterval(() => loadFeeds(true), 5 * 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [loadFeeds])

  const feedsInCategory = RSS_FEEDS.filter(f => f.category === activeCategory)

  const filtered = items
    .filter(it => it.category === activeCategory)
    .filter(it => activeSources.includes(it.source))
    .filter(it => {
      if (!search) return true
      const q = search.toLowerCase()
      return it.title.toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const da = new Date(a.pubDate).getTime() || 0
      const db = new Date(b.pubDate).getTime() || 0
      return sortOrder === 'desc' ? db - da : da - db
    })

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 16px', position: 'relative' }}>

      <h1
        className="glitch glitch-subtle"
        data-text="VEILLE CYBER"
        style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--accent)', marginBottom: 6 }}
      >
        VEILLE CYBER
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'IBM Plex Mono,monospace', marginBottom: 24 }}>
        {RSS_FEEDS.length} flux · CVE, Red/Blue Team, IT · Actualisation auto toutes les 5 min
      </p>

      {/* Tabs catégories */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border,#2a2a42)' }}>
        {RSS_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '7px 16px',
              background: activeCategory === cat ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderBottom: activeCategory === cat ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: 11, fontFamily: 'IBM Plex Mono,monospace',
              letterSpacing: '.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all .15s',
              borderRadius: '4px 4px 0 0',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contrôles sticky */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 10,
        background: 'var(--bg-primary,#0a0a0f)',
        borderBottom: '1px solid var(--border,#2a2a42)',
        paddingBottom: 10, marginBottom: 18, paddingTop: 4,
      }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {feedsInCategory.map(feed => {
            const active = activeSources.includes(feed.id)
            return (
              <button
                key={feed.id}
                onClick={() => setActiveSources(prev =>
                  prev.includes(feed.id) ? prev.filter(s => s !== feed.id) : [...prev, feed.id]
                )}
                style={{
                  padding: '3px 10px', borderRadius: 4,
                  border: `1px solid ${active ? feed.color : 'var(--border,#2a2a42)'}`,
                  background: active ? `${feed.color}22` : 'transparent',
                  color: active ? feed.color : '#44445a',
                  fontSize: 9, fontFamily: 'IBM Plex Mono,monospace',
                  letterSpacing: '.06em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all .15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {errors[feed.id] && <span style={{ color: '#f5a623' }} title="Erreur de chargement">⚠</span>}
                {feed.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'var(--bg-surface,#16162a)',
              border: '1px solid var(--border,#2a2a42)', borderRadius: 4,
              padding: '5px 11px', color: 'var(--text-primary,#e8e8f0)',
              fontSize: 11, fontFamily: 'IBM Plex Mono,monospace', outline: 'none',
            }}
          />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{
              background: 'var(--bg-surface,#16162a)', border: '1px solid var(--border,#2a2a42)',
              borderRadius: 4, padding: '5px 9px', color: 'var(--text-secondary,#8888aa)',
              fontSize: 11, fontFamily: 'IBM Plex Mono,monospace', cursor: 'pointer',
            }}
          >
            <option value="desc">Plus récent</option>
            <option value="asc">Plus ancien</option>
          </select>
          <button
            onClick={() => loadFeeds(true)}
            disabled={refreshing}
            title="Actualiser"
            style={{
              background: 'var(--bg-surface,#16162a)', border: '1px solid var(--border,#2a2a42)',
              borderRadius: 4, padding: '5px 11px',
              color: refreshing ? '#44445a' : 'var(--accent,#9b59f5)',
              fontSize: 15, cursor: refreshing ? 'not-allowed' : 'pointer',
              fontFamily: 'IBM Plex Mono,monospace',
              animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
            }}
          >
            ↺
          </button>
        </div>

        <div style={{ color: '#44445a', fontSize: 10, fontFamily: 'IBM Plex Mono,monospace', marginTop: 6 }}>
          {loading
            ? 'Chargement des flux…'
            : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          {search && ` · "${search}"`}
        </div>
      </div>

      {/* Feed */}
      {loading
        ? Array.from({ length: 7 }).map((_, i) => <SkeletonItem key={i} />)
        : filtered.length === 0
          ? (
            <div style={{ color: '#44445a', fontSize: 12, fontFamily: 'IBM Plex Mono,monospace', textAlign: 'center', padding: 48 }}>
              {search ? `Aucun résultat pour "${search}"` : 'Aucun article disponible'}
            </div>
          )
          : filtered.map(it => <RSSItem key={it.id} item={it} />)
      }

      {/* Easter Egg — icône discrète en bas de page */}
      <div style={{ marginTop: 48, display: 'flex', justifyContent: 'flex-end' }}>
        <img
          src="/assets/easter-egg.gif"
          alt="?"
          title="..."
          onClick={() => setShowEasterEgg(true)}
          style={{
            width: 28, height: 28, opacity: 0.35, cursor: 'pointer',
            transition: 'opacity .2s', imageRendering: 'pixelated',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.35' }}
        />
      </div>

      {/* Modal Easter Egg — Nmap */}
      {showEasterEgg && (
        <div
          onClick={() => setShowEasterEgg(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary,#10101a)', border: '1px solid var(--accent,#9b59f5)',
              boxShadow: '0 0 32px var(--accent-glow)', borderRadius: 8,
              padding: '28px 32px', maxWidth: 680, width: '100%', maxHeight: '85vh', overflowY: 'auto',
              fontFamily: 'IBM Plex Mono,monospace',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img src="/assets/easter-egg.gif" alt="" style={{ width: 40, imageRendering: 'pixelated' }} />
              <div>
                <div style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 700, letterSpacing: '.06em' }}>
                  Félicitations — Easter Egg trouvé
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2 }}>
                  Vous gagnez <span style={{ color: '#f5a623', fontWeight: 700 }}>+30 pts de karma</span>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

            <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              // Nmap — Fonctionnement & Furtivité
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.7, marginBottom: 16 }}>
              Nmap effectue par défaut une <span style={{ color: '#e8e8f0' }}>requête DNS</span>, un{' '}
              <span style={{ color: '#e8e8f0' }}>ICMP keep-alive</span>, puis pour chaque port un{' '}
              <span style={{ color: '#f54b4b' }}>SYN → SYN/ACK → RST</span> (half-open scan) — contrairement au three-way handshake légitime SYN/ACK/ACK.
              Port source élevé (~60230), nombreuses requêtes en peu de temps, signature hex{' '}
              <code style={{ color: '#f5a623', background: 'var(--bg-surface)', padding: '1px 4px', borderRadius: 2 }}>nmap</code> dans les paquets.
            </p>

            <div style={{ color: '#f54b4b', fontSize: 11, marginBottom: 16 }}>
              ⚠ Commandes bruyantes à éviter :{' '}
              <code style={{ color: '#f5a623', background: 'var(--bg-surface)', padding: '1px 4px', borderRadius: 2 }}>-A -o -Pn -sN -T5 -sS -p-</code>
            </div>

            <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', marginBottom: 8 }}>
              // Commande furtive recommandée
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '12px 16px', marginBottom: 20, fontSize: 11, lineHeight: 1.8, overflowX: 'auto' }}>
              <code style={{ color: '#e8e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{`nmap -n -Pn -sV -g0 \\
  -p 443,80,22,3389,3306,88,21,23 \\
  --spoof-mac Cisco \\
  --datalength 24 \\
  -T0 \\
  --max-hostgroup 1 \\
  --max-parallelism 5 \\
  -f \\
  -D RND:3,ME \\
  -oA output_scan \\
  <cibles>`}</code>
            </div>

            <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', marginBottom: 8 }}>
              // Arguments de furtivité
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', color: 'var(--text-secondary)', padding: '4px 8px', width: '30%' }}>Argument</th>
                  <th style={{ textAlign: 'left', color: 'var(--text-secondary)', padding: '4px 8px' }}>Effet</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['-n',                  'Désactive les requêtes DNS (pas de résolution inverse traçable)'],
                  ['-Pn',                 'No ping — ignore la détection host-alive'],
                  ['-sV',                 'Version scan + banner grabbing (OS fingerprinting)'],
                  ['-g0',                 'Port source = 0 (loopback), moins identifiable'],
                  ['-p 443,80,22,…',      'Ports ciblés dans le désordre — évite les scans séquentiels'],
                  ['--spoof-mac Cisco',   'MAC usurpée avec OUI constructeur (plus crédible que RND)'],
                  ['--datalength 24',     'Ajoute 24 octets aléatoires — masque la signature hex nmap'],
                  ['-T0',                 'Paranoïaque — timings aléatoires très lents'],
                  ['--max-hostgroup 1',   '1 hôte par groupe — ralentit et réduit la signature'],
                  ['--max-parallelism 5', 'Limite le parallélisme — moins de SYN simultanés'],
                  ['-f',                  'Fragmente tous les paquets IP'],
                  ['-D RND:3,ME',         'Génère 3 leurres + notre IP — dilue la source réelle'],
                  ['-oA output',          'Sorties .nmap + .gnmap + .xml pour post-traitement/vuln scan'],
                ].map(([arg, desc], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 !== 0 ? 'var(--bg-primary)' : 'transparent' }}>
                    <td style={{ padding: '5px 8px' }}>
                      <code style={{ color: '#f5a623', fontSize: 10 }}>{arg}</code>
                    </td>
                    <td style={{ padding: '5px 8px', color: 'var(--text-secondary)' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEasterEgg(false)}
                style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', padding: '7px 16px',
                  borderRadius: 4, fontFamily: 'IBM Plex Mono,monospace',
                  fontSize: 11, cursor: 'pointer', letterSpacing: '.06em',
                }}
              >
                FERMER ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
