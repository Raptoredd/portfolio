import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap, BookOpen, Award, BadgeCheck,
  Shield, Swords, Server, Terminal, Building, Briefcase,
  School, Monitor, MapPin, ChevronDown,
} from 'lucide-react'

const ICON_MAP = {
  GraduationCap, BookOpen, Award, BadgeCheck,
  Shield, Swords, Server, Terminal, Building, Briefcase,
  School, Monitor,
}

const TYPE_COLORS = {
  'LYCÉE':           { bg: 'rgba(100,100,180,0.12)', color: '#8888cc' },
  'BTS':             { bg: 'rgba(75,158,245,0.12)',  color: '#4b9ef5' },
  'BACHELOR → MASTER': { bg: 'rgba(155,89,245,0.15)', color: '#c891ff' },
  'BACHELOR':        { bg: 'rgba(155,89,245,0.12)', color: '#9b59f5' },
  'STAGE':           { bg: 'rgba(255,200,0,0.10)',  color: '#ffc800' },
  'ALTERNANCE':      { bg: 'rgba(155,89,245,0.12)', color: '#9b59f5' },
  'CDI':             { bg: 'rgba(0,255,65,0.10)',   color: '#00ff41' },
  'FREELANCE':       { bg: 'rgba(255,200,0,0.10)',  color: '#ffc800' },
}

export default function TimelineItem({ item, side, dimmed }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ICON_MAP[item.icon] || Terminal
  const typeStyle = TYPE_COLORS[item.type] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }
  const hasHighlights = item.highlights?.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        opacity: dimmed ? 0.15 : 1,
        transform: dimmed ? 'scale(0.97)' : 'scale(1)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}
    >
      <div
        className="p-4 rounded flex flex-col gap-2.5"
        onClick={() => hasHighlights && setExpanded(v => !v)}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: hasHighlights ? 'pointer' : 'default',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--border-accent)'
          e.currentTarget.style.boxShadow = '0 0 10px var(--accent-glow)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Icon size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              lineHeight: 1.3,
            }}>
              {item.title}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {item.current && (
              <span style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: 'rgba(0,255,65,0.12)',
                color: '#00ff41',
                padding: '1px 6px',
                borderRadius: '3px',
              }}>
                EN COURS
              </span>
            )}
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              background: typeStyle.bg,
              color: typeStyle.color,
              padding: '1px 7px',
              borderRadius: '3px',
            }}>
              {item.type}
            </span>
          </div>
        </div>

        {/* Badge diplôme / poste */}
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.75rem',
          color: typeStyle.color,
          letterSpacing: '0.05em',
        }}>
          {item.badge}
        </div>

        {/* Lieu + période */}
        <div className="flex items-center gap-3">
          {item.location && (
            <div className="flex items-center gap-1">
              <MapPin size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {item.location}
              </span>
            </div>
          )}
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.04em' }}>
            {item.period || item.year}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
        }}>
          {item.description}
        </p>

        {/* Highlights collapsibles */}
        {hasHighlights && (
          <div>
            <button
              className="flex items-center gap-1 transition-colors"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.span>
              {expanded ? 'MASQUER' : `MISSIONS (${item.highlights.length})`}
            </button>

            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <ul className="flex flex-col gap-1.5 mt-2">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.7rem' }}>›</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
