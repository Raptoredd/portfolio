import { useState, useEffect, useRef } from 'react'

export default function TerminalCursor({ text = '', speed = 50, delay = 0, onComplete, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!text) return
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    const start = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1))
          indexRef.current++
        } else {
          clearInterval(interval)
          setDone(true)
          onComplete?.()
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(start)
  }, [text, speed, delay])

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {displayed}
      {!done && (
        <span
          style={{
            display: 'inline-block',
            width: '0.6em',
            height: '1.1em',
            background: 'var(--accent)',
            verticalAlign: 'text-bottom',
            marginLeft: '2px',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}
    </span>
  )
}
