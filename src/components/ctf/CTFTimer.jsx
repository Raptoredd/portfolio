import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useCTFProgress } from '../../hooks/useCTFProgress'

function fmt(ms) {
  const total = Math.floor(ms / 10)
  const cc    = total % 100
  const secs  = Math.floor(total / 100) % 60
  const mins  = Math.floor(total / 6000)
  return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}:${String(cc).padStart(2,'0')}`
}

function fmtShort(ms) {
  const secs = Math.floor(ms / 1000) % 60
  const mins = Math.floor(ms / 60000)
  return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
}

export default function CTFTimer({ challengeId, onStart }) {
  const { isSolved, getTime } = useCTFProgress()
  const solved    = isSolved(challengeId)
  const savedTime = getTime(challengeId)

  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const rafRef   = useRef(null)

  const tick = useCallback(() => {
    if (startRef.current) setElapsed(Date.now() - startRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick)
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running, tick])

  useEffect(() => {
    if (solved && running) setRunning(false)
  }, [solved])

  const handleStart = () => {
    const now = Date.now()
    startRef.current = now
    setRunning(true)
    onStart?.(now)
  }

  if (solved && savedTime != null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#22c55e', letterSpacing: '.06em' }}>
          ✓ {fmt(savedTime)}
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#22c55e' }}
        >
          GG ! Flag validé en {fmtShort(savedTime)} 🎉
        </motion.span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {!running ? (
        <button
          onClick={handleStart}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            padding: '4px 12px',
            background: 'transparent',
            border: '1px solid var(--border-accent)',
            color: 'var(--accent)',
            borderRadius: 3,
            cursor: 'pointer',
            letterSpacing: '.06em',
          }}
        >
          ▶ START
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#f54b4b', flexShrink: 0 }}
          />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#f54b4b', letterSpacing: '.06em' }}>
            {fmt(elapsed)}
          </span>
        </div>
      )}
    </div>
  )
}
