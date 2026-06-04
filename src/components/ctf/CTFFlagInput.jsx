import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sha256 } from '../../data/ctfData'
import { useCTFProgress } from '../../hooks/useCTFProgress'

export default function CTFFlagInput({ challengeId, flagHash, startTime, onSuccess }) {
  const { isSolved, markSolved } = useCTFProgress()
  const solved = isSolved(challengeId)

  const [value, setValue] = useState('')
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)

  const handleSubmit = async () => {
    if (solved || !value.trim()) return
    const hash = await sha256(value.trim())
    if (hash === flagHash) {
      const elapsed = startTime ? Date.now() - startTime : 0
      markSolved(challengeId, elapsed)
      onSuccess?.(elapsed)
      setTimeout(() => window.location.reload(), 1400)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => { setError(false); setShake(false) }, 2000)
    }
  }

  if (solved) {
    return (
      <div style={{
        padding: '8px 12px',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid #22c55e',
        borderRadius: 4,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 12,
        color: '#22c55e',
        letterSpacing: '.04em',
      }}>
        ✓ FLAG VALIDÉ
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <motion.div
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', gap: 6 }}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="FLAG{...}"
          style={{
            flex: 1,
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 12,
            padding: '7px 10px',
            background: 'var(--bg-primary)',
            border: `1px solid ${error ? '#f54b4b' : 'var(--border)'}`,
            color: 'var(--text-primary)',
            borderRadius: 4,
            outline: 'none',
            transition: 'border-color .2s',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            padding: '7px 14px',
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: '.06em',
            whiteSpace: 'nowrap',
          }}
        >
          VALIDER
        </button>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#f54b4b' }}
          >
            Flag incorrect — réessaie.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
