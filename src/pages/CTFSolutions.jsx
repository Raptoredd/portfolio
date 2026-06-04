import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowLeft, Check, Lock } from 'lucide-react'
import GlitchText from '../components/ui/GlitchText'
import { useCTFProgress } from '../hooks/useCTFProgress'
import { CTF_CATEGORIES, CTF_CHALLENGES } from '../data/ctfData'

function SolutionItem({ challenge, isOpen, onToggle, solved }) {
  const DIFF_COLOR = { easy: '#22c55e', medium: '#f59e0b', hard: '#f54b4b' }
  const color = DIFF_COLOR[challenge.difficulty] || 'var(--text-muted)'

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: 'var(--bg-surface)',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 700, color, padding: '1px 6px', background: `${color}18`, borderRadius: 3 }}>
          {challenge.difficulty.toUpperCase()}
        </span>
        <span style={{ flex: 1, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {challenge.title}
        </span>
        {solved && (
          <Check size={13} style={{ color: '#22c55e', flexShrink: 0 }} />
        )}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 16px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Flag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.1em', fontWeight: 600 }}>
                  FLAG
                </span>
                <code style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
                  color: '#22c55e', background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: 3,
                }}>
                  {challenge.solution.flag}
                </code>
              </div>

              {/* Steps */}
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em', marginBottom: 6 }}>
                  ÉTAPES
                </div>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                  {challenge.solution.steps.map((step, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--accent)', minWidth: 18, flexShrink: 0 }}>
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tools */}
              <div>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em' }}>
                  OUTILS&nbsp;:&nbsp;
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--text-secondary)' }}>
                  {challenge.solution.tools.join(', ')}
                </span>
              </div>

              {/* Notes */}
              {challenge.solution.notes && (
                <div style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
                  color: 'var(--text-muted)', lineHeight: 1.65,
                  padding: '6px 10px', borderLeft: '2px solid var(--border-accent)',
                }}>
                  {challenge.solution.notes}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CTFSolutions() {
  const { hasAnySolved, isSolved } = useCTFProgress()
  const [openIds, setOpenIds] = useState([])

  const toggle = (id) =>
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  if (!hasAnySolved) {
    return (
      <div style={{
        background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, padding: 24,
      }}>
        <Lock size={36} style={{ color: 'var(--text-muted)' }} />
        <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'center' }}>
          Pas de bras, pas de chocolat.
        </p>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400 }}>
          Résous au moins un challenge pour débloquer les solutions.
        </p>
        <Link
          to="/ctf"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.8rem',
            letterSpacing: '.12em', padding: '7px 16px',
            background: 'var(--accent)', color: 'var(--bg-primary)',
            borderRadius: 4, textDecoration: 'none',
          }}
        >
          <ArrowLeft size={13} /> RETOUR AUX CHALLENGES
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <div className="max-w-4xl mx-auto px-4 py-16">

        <div style={{ marginBottom: '2.5rem' }}>
          <GlitchText
            text="SOLUTIONS"
            tag="h1"
            intensity="subtle"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}
          />
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Accès débloqué — writeups détaillés disponibles.
          </p>
          <Link
            to="/ctf"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12,
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.78rem',
              letterSpacing: '.1em', color: 'var(--text-muted)', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={12} /> RETOUR AUX CHALLENGES
          </Link>
        </div>

        {CTF_CATEGORIES.map(cat => {
          const challenges = CTF_CHALLENGES.filter(c => c.category === cat.id)
          return (
            <section key={cat.id} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontFamily: 'Share Tech Mono, monospace', fontSize: '0.95rem',
                color: cat.colorVar, letterSpacing: '.1em',
                marginBottom: 12, paddingBottom: 8,
                borderBottom: `1px solid ${cat.colorVar}`,
              }}>
                {cat.label}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {challenges.map(c => (
                  <SolutionItem
                    key={c.id}
                    challenge={c}
                    isOpen={openIds.includes(c.id)}
                    onToggle={() => toggle(c.id)}
                    solved={isSolved(c.id)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
