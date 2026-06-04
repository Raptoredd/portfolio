import { Terminal, Search, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import CTFCard from './CTFCard'
import { CTF_CHALLENGES } from '../../data/ctfData'

const ICON_MAP = { Terminal, Search, Cpu }
const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 }

export default function CTFCategory({ category }) {
  const Icon = ICON_MAP[category.icon] || Terminal

  const challenges = CTF_CHALLENGES
    .filter(c => c.category === category.id)
    .sort((a, b) => (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingBottom: 12,
        borderBottom: `1px solid ${category.colorVar}`,
      }}>
        <Icon size={18} style={{ color: category.colorVar }} />
        <h2 style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '1rem',
          color: category.colorVar,
          letterSpacing: '.1em',
          fontWeight: 500,
        }}>
          {category.label}
        </h2>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          fontSize: 10, letterSpacing: '.1em',
          background: `${category.colorVar}18`,
          color: category.colorVar,
          padding: '1px 8px', borderRadius: 3,
        }}>
          {challenges.length} CHALLENGES
        </span>
      </div>

      {/* Category description */}
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        color: 'var(--text-muted)',
        lineHeight: 1.65,
      }}>
        {category.description}
      </p>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {challenges.map((c, i) => (
          <CTFCard key={c.id} challenge={c} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
