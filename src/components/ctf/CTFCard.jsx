import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Check, ExternalLink } from 'lucide-react'
import CTFTimer from './CTFTimer'
import CTFFlagInput from './CTFFlagInput'
import CTFHintBadge from './CTFHintBadge'

const DIFFICULTY = {
  easy:   { label: 'EASY',              bg: 'rgba(34,197,94,0.12)',   color: '#22c55e' },
  medium: { label: 'MEDIUM',            bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  hard:   { label: 'HARD',             bg: 'rgba(245,75,75,0.12)',   color: '#f54b4b' },
  wip:    { label: 'Création en cours', bg: 'rgba(107,114,128,0.10)', color: '#6b7280' },
}

// ── Artifact renderers ───────────────────────────────────

function HashArtifact({ artifact }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(artifact.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10,
        color: 'var(--text-secondary)',
        wordBreak: 'break-all',
        lineHeight: 1.6,
        padding: '6px 8px',
        background: 'var(--bg-secondary)',
        borderRadius: 3,
        border: '1px solid var(--border)',
      }}>
        {artifact.value}
      </div>
      <button
        onClick={copy}
        style={{
          display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
          fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 600,
          letterSpacing: '.08em', padding: '2px 8px',
          background: 'transparent', border: '1px solid var(--border)',
          color: copied ? '#22c55e' : 'var(--text-muted)',
          borderRadius: 3, cursor: 'pointer', transition: 'color .2s',
        }}
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
        {copied ? 'COPIÉ' : 'COPIER'}
      </button>
    </div>
  )
}

// C3 — Headers terminal (pentest-2)
const DEBUG_HEADERS = [
  { text: 'HTTP/1.1 200 OK',                                         flag: false },
  { text: 'Content-Type: application/json; charset=utf-8',           flag: false },
  { text: 'Server: nginx/1.18.0 (Ubuntu)',                           flag: false },
  { text: 'Cache-Control: no-store, no-cache',                       flag: false },
  { text: 'X-Powered-By: InternalAPI/2.3',                          flag: false },
  { text: 'X-Request-Id: f3a1b2c4-dead-beef-0000-cafebabe1234',      flag: false },
  { text: 'X-Debug-Flag: FLAG{h34d3rs_4r3_s1l3nt_w1tn3ss3s}',       flag: true  },
  { text: 'X-Build-Version: dev-20240312-unstaged',                  flag: false },
]

function HeadersTerminal() {
  const [step, setStep] = useState('idle') // 'idle' | 'response' | 'headers'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
        color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
      }}>
        Un endpoint interne répond sur /api/status.<br />
        Envoie une requête et analyse ce que le serveur te retourne.
      </p>
      <div style={{
        background: '#0a0a0f',
        border: '1px solid var(--border)',
        borderRadius: 4,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 12,
        overflow: 'hidden',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '4px 10px',
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
          letterSpacing: '.1em',
        }}>
          VERTEX INTERNAL API — GET /api/status
        </div>
        <div style={{ padding: '10px', minHeight: 60, lineHeight: 1.7 }}>
          {step === 'idle' && (
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              En attente d'une requête…
            </span>
          )}
          {step === 'response' && (
            <>
              <div>
                <span style={{ color: 'var(--accent)' }}>$ </span>
                <span style={{ color: 'var(--text-primary)' }}>curl -s https://api.vertex-studio.internal/api/status</span>
              </div>
              <div style={{ color: '#22c55e', paddingLeft: 12 }}>
                {'{ "status": "ok", "version": "2.3.1", "env": "production" }'}
              </div>
            </>
          )}
          {step === 'headers' && (
            <>
              <div>
                <span style={{ color: 'var(--accent)' }}>$ </span>
                <span style={{ color: 'var(--text-primary)' }}>curl -I https://api.vertex-studio.internal/api/status</span>
              </div>
              {DEBUG_HEADERS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: 12,
                    color: h.flag ? '#22c55e' : 'var(--text-muted)',
                    fontWeight: h.flag ? 700 : 400,
                  }}
                >
                  {h.text}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setStep('response')}
          disabled={step !== 'idle'}
          style={{
            background: 'none',
            border: `1px solid ${step === 'idle' ? 'var(--border-accent)' : 'var(--border)'}`,
            borderRadius: 3, padding: '4px 12px',
            color: step === 'idle' ? 'var(--accent)' : 'var(--text-muted)',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11,
            cursor: step === 'idle' ? 'pointer' : 'default',
            letterSpacing: '.06em',
          }}
        >
          ENVOYER LA REQUÊTE
        </button>
        {step === 'response' && (
          <button
            onClick={() => setStep('headers')}
            style={{
              background: 'none',
              border: '1px solid var(--border-accent)',
              borderRadius: 3, padding: '4px 12px',
              color: 'var(--accent)',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11,
              cursor: 'pointer', letterSpacing: '.06em',
            }}
          >
            VOIR LES HEADERS BRUTS
          </button>
        )}
      </div>
    </div>
  )
}

function ImageArtifact({ artifact }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <img
        src={artifact.src}
        alt={artifact.label}
        style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
      <a
        href={artifact.src}
        download
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10,
          letterSpacing: '.08em', padding: '3px 10px',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-muted)', borderRadius: 3, textDecoration: 'none',
        }}
      >
        <Download size={10} /> TÉLÉCHARGER
      </a>
    </div>
  )
}

function TextArtifact({ artifact }) {
  return (
    <p style={{
      fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
      color: 'var(--text-secondary)', lineHeight: 1.65,
    }}>
      {artifact.value}
    </p>
  )
}

function DownloadArtifact({ artifact, challenge }) {
  const isC2 = challenge.id === 'cti-2'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {artifact.warning && (
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', lineHeight: 1.5 }}>
          {artifact.warning}
        </p>
      )}
      <a
        href={artifact.src}
        download
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11,
          letterSpacing: '.08em', padding: '6px 14px', alignSelf: 'flex-start',
          background: 'var(--accent)', color: 'var(--bg-primary)',
          borderRadius: 3, textDecoration: 'none',
        }}
      >
        <Download size={12} /> {artifact.label}
      </a>
      {isC2 && (
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          Le script tente de contacter une ressource externe. À toi de trouver laquelle.
        </p>
      )}
    </div>
  )
}

function LinkArtifact({ artifact }) {
  const isPlaceholder = artifact.value === 'REPO_GITHUB_URL_A_RENSEIGNER'
  return (
    <div>
      {isPlaceholder ? (
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          URL du repo à renseigner après déploiement
        </span>
      ) : (
        <a
          href={artifact.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
            color: 'var(--accent)', textDecoration: 'none',
          }}
        >
          {artifact.value} <ExternalLink size={11} />
        </a>
      )}
    </div>
  )
}

// C4 — Bouton lien vers /vertex-admin (pentest-3)
function AdminPanelLink() {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 12,
      textAlign: 'center',
    }}>
      <p style={{
        margin: '0 0 10px 0',
        fontSize: 12,
        fontFamily: 'IBM Plex Mono, monospace',
        color: 'var(--text-secondary)',
      }}>
        Panneau d'administration Vertex Studio détecté.
      </p>
      <a
        href="/vertex-admin"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          border: '1px solid var(--red-team)',
          borderRadius: 4,
          color: 'var(--red-team)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        ACCÉDER AU PANNEAU →
      </a>
    </div>
  )
}

// ── Main CTFCard ─────────────────────────────────────────

export default function CTFCard({ challenge, index }) {
  const [startTime, setStartTime] = useState(null)
  const diff = DIFFICULTY[challenge.difficulty] || DIFFICULTY.medium

  const handleTimerStart = (t) => setStartTime(t)

  const renderArtifact = () => {
    switch (challenge.artifact.type) {
      case 'hash':     return <HashArtifact artifact={challenge.artifact} />
      case 'headers':  return <HeadersTerminal />
      case 'form':     return <AdminPanelLink />
      case 'image':    return <ImageArtifact artifact={challenge.artifact} />
      case 'text':     return <TextArtifact artifact={challenge.artifact} />
      case 'download': return <DownloadArtifact artifact={challenge.artifact} challenge={challenge} />
      case 'link':     return <LinkArtifact artifact={challenge.artifact} />
      default:         return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Difficulté + Indice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10,
          letterSpacing: '.08em', padding: '2px 8px',
          background: diff.bg, color: diff.color, borderRadius: 3,
        }}>
          {diff.label}
        </span>
        {challenge.hint && <CTFHintBadge hint={challenge.hint} />}
      </div>

      {/* Titre */}
      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '0.88rem',
        color: 'var(--text-primary)',
        fontWeight: 600,
        lineHeight: 1.3,
      }}>
        {challenge.title}
      </div>

      {/* Description */}
      {challenge.description && (
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.77rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
        }}>
          {challenge.description}
        </p>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {challenge.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: '0.65rem',
              fontWeight: 600, letterSpacing: '.06em',
              background: 'var(--bg-secondary)', color: 'var(--text-muted)',
              border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 3,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Artifact */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <span style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 10,
          color: 'var(--text-muted)', letterSpacing: '.1em',
          fontWeight: 600, textTransform: 'uppercase',
        }}>
          {challenge.artifact.label}
        </span>
        {renderArtifact()}
      </div>

      {challenge.difficulty !== 'wip' && (
        <>
          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)' }} />

          {/* Timer + Flag input */}
          <CTFTimer challengeId={challenge.id} onStart={handleTimerStart} />
          <CTFFlagInput
            challengeId={challenge.id}
            flagHash={challenge.flagHash}
            startTime={startTime}
          />
        </>
      )}
    </motion.div>
  )
}
