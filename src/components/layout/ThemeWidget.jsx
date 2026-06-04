import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const SWATCHES = [
  { id: 'purple', color: '#9b59f5', label: 'PURPLE' },
  { id: 'green',  color: '#00ff41', label: 'GREEN'  },
  { id: 'red',    color: '#ff2b2b', label: 'RED'    },
  { id: 'cyan',   color: '#00e5ff', label: 'CYAN'   },
]

export default function ThemeWidget() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 p-3 rounded"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            {SWATCHES.map(s => (
              <button
                key={s.id}
                onClick={() => { setTheme(s.id); setOpen(false) }}
                className="flex items-center gap-2 px-2 py-1 rounded transition-all"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: theme === s.id ? s.color : 'var(--text-secondary)',
                  borderLeft: theme === s.id ? `2px solid ${s.color}` : '2px solid transparent',
                }}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: s.color,
                    boxShadow: theme === s.id ? `0 0 8px ${s.color}` : 'none',
                  }}
                />
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          color: 'var(--accent)',
          boxShadow: open ? '0 0 12px var(--accent-glow)' : 'none',
        }}
        aria-label="Changer le thème"
      >
        <Palette size={18} />
      </motion.button>
    </div>
  )
}
