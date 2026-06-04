import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

export default function CTFHintBadge({ hint }) {
  const [open, setOpen] = useState(false)
  const Icon = LucideIcons[hint.icon] ?? LucideIcons.HelpCircle

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="Indice"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: `1px solid ${open ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 4,
          padding: '3px 8px',
          cursor: 'pointer',
          color: open ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 11,
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        <Icon size={12} />
        INDICE
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 50,
                width: 260,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-accent)',
                borderRadius: 6,
                padding: '12px 14px',
                boxShadow: '0 4px 24px var(--accent-glow)',
              }}
            >
              <p style={{
                margin: '0 0 6px 0',
                fontSize: 11,
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
              }}>
                💡 {hint.text}
              </p>
              <p style={{
                margin: '0 0 10px 0',
                fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
              }}>
                {hint.tooltip}
              </p>
              {hint.url && (
                <a
                  href={hint.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border-accent)',
                    paddingBottom: 1,
                  }}
                >
                  Documentation →
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
