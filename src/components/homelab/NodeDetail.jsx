import { motion, AnimatePresence } from 'framer-motion'
import { X, Cpu } from 'lucide-react'
import { NODE_TYPES_META } from './graphData'

export default function NodeDetail({ node, onClose }) {
  const meta = NODE_TYPES_META[node?.data?.type] || NODE_TYPES_META.host

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 0.22 }}
          className="absolute top-0 right-0 bottom-0 w-72 flex flex-col overflow-y-auto z-20"
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: `1px solid ${meta.color}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <Cpu size={15} style={{ color: meta.color }} />
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
              }}>
                {node.data.label}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ color: 'var(--text-muted)' }}
              aria-label="Fermer"
            >
              <X size={17} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-5 p-4">
            {/* Type badge */}
            <span
              className="self-start px-2 py-0.5 rounded"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                background: `${meta.color}18`,
                color: meta.color,
              }}
            >
              {meta.label.toUpperCase()}
            </span>

            {/* Role */}
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                RÔLE
              </div>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {node.data.role}
              </p>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                DESCRIPTION
              </div>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {node.data.description}
              </p>
            </div>

            {/* Services */}
            {node.data.services?.length > 0 && (
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  SERVICES / DÉTAILS
                </div>
                <div className="flex flex-col gap-1.5">
                  {node.data.services.map(svc => (
                    <div
                      key={svc}
                      className="px-2 py-1 rounded"
                      style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '0.75rem',
                        color: meta.color,
                        background: `${meta.color}0d`,
                        border: `1px solid ${meta.color}30`,
                      }}
                    >
                      {svc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
