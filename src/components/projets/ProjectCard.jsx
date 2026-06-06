import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, Globe, Network, Terminal, FileText, Radar,
  Shield, Swords, Server, Lock, Bug, Cpu, Github,
} from 'lucide-react'

const ICON_MAP = {
  BarChart2, Globe, Network, Terminal, FileText, Radar,
  Shield, Swords, Server, Lock, Bug, Cpu,
}

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)
  const Icon = ICON_MAP[project.icon] || Terminal
  const isBlue = project.team === 'blue'
  const teamColor = isBlue ? 'var(--blue-team)' : 'var(--red-team)'
  const hasHighlights = project.highlights?.length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3 p-5 rounded"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-accent)' : 'var(--border)'}`,
        boxShadow: hovered ? '0 0 12px var(--accent-glow)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(v => !v)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Icon size={17} style={{ color: teamColor, flexShrink: 0, marginTop: '2px' }} />
          <span style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {project.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.08em',
              background: project.status === 'completed' ? 'rgba(0,255,65,0.1)' : 'rgba(255,200,0,0.1)',
              color: project.status === 'completed' ? '#00ff41' : '#ffc800',
            }}
          >
            {project.status === 'completed' ? 'TERMINÉ' : 'EN COURS'}
          </span>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {project.year}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.75,
      }}>
        {project.description}
      </p>

      {/* Highlights (revealed on hover / tap) */}
      {hasHighlights && (
        <AnimatePresence>
          {hovered && (
            <motion.ul
              key="highlights"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
              className="flex flex-col gap-2"
            >
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.65 }}
                >
                  <span style={{ color: teamColor, flexShrink: 0 }}>›</span>
                  {h}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}

      {/* Note (WIP / dépôt privé) */}
      {project.note && (
        <p style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          borderTop: '1px solid var(--border)',
          paddingTop: '8px',
        }}>
          {project.note}
        </p>
      )}

      {/* Footer : tags + GitHub */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {project.links?.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent)'
              e.currentTarget.style.borderColor = 'var(--border-accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <Github size={13} /> GITHUB
          </a>
        )}
      </div>
    </motion.div>
  )
}
