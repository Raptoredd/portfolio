import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GlitchText from '../components/ui/GlitchText'
import CTFCategory from '../components/ctf/CTFCategory'
import { CTF_CATEGORIES } from '../data/ctfData'
import { useCTFProgress } from '../hooks/useCTFProgress'

export default function CTF() {
  const { totalSolved } = useCTFProgress()

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <GlitchText
            text="CTF & CHALLENGES"
            tag="h1"
            intensity="medium"
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
            marginBottom: '1.5rem',
          }}>
            Challenges interactifs — Pentest / OSINT / CTI &amp; Reverse
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
          >
            <Link
              to="/ctf/solutions"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '.12em',
                padding: '6px 16px',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface)',
                borderRadius: 4,
                textDecoration: 'none',
                transition: 'all .2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              VOIR LES SOLUTIONS <ArrowRight size={13} />
            </Link>

            {totalSolved > 0 && (
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
                color: '#22c55e', letterSpacing: '.06em',
              }}>
                ✓ {totalSolved} / 9 résolus
              </span>
            )}
          </motion.div>
        </div>

        {/* 3 columns */}
        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {CTF_CATEGORIES.map(cat => (
            <CTFCategory key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  )
}
