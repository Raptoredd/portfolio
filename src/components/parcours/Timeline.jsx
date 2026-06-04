import { useState } from 'react'
import TimelineItem from './TimelineItem'

function ContinuityConnector({ color = 'var(--accent)' }) {
  return (
    <div className="flex justify-center py-1">
      <div style={{
        width: '1px',
        height: '24px',
        background: `repeating-linear-gradient(to bottom, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)`,
        opacity: 0.6,
      }} />
    </div>
  )
}

export default function Timeline({ leftItems, rightItems, leftLabel, rightLabel }) {
  const [hoveredSide, setHoveredSide] = useState(null)
  const maxRows = Math.max(leftItems.length, rightItems.length)

  return (
    <div className="relative w-full">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_40px_1fr] mb-8">
        <div
          className="text-center pb-2"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'var(--accent)',
            borderBottom: '1px solid var(--border-accent)',
          }}
        >
          {leftLabel}
        </div>
        <div />
        <div
          className="text-center pb-2"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: 'var(--accent)',
            borderBottom: '1px solid var(--border-accent)',
          }}
        >
          {rightLabel}
        </div>
      </div>

      {/* Timeline body */}
      <div
        className="relative"
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Central axis */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, var(--accent-dim), transparent)' }}
        />

        <div className="grid grid-cols-[1fr_40px_1fr] gap-y-6">
          {Array.from({ length: maxRows }).map((_, i) => {
            const rightContinues =
              rightItems[i] &&
              rightItems[i + 1] &&
              rightItems[i].title === rightItems[i + 1].title

            return (
              <div key={i} className="contents">
                {/* Left item */}
                <div onMouseEnter={() => setHoveredSide('left')}>
                  {leftItems[i] && (
                    <TimelineItem
                      item={leftItems[i]}
                      side="left"
                      dimmed={hoveredSide === 'right'}
                    />
                  )}
                </div>

                {/* Center dot */}
                <div className="flex flex-col items-center justify-start pt-5">
                  {(leftItems[i] || rightItems[i]) && (
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent-glow)',
                        animation: 'pulse-accent 2s ease-in-out infinite',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  )}
                </div>

                {/* Right item + continuity connector */}
                <div onMouseEnter={() => setHoveredSide('right')}>
                  {rightItems[i] && (
                    <>
                      <TimelineItem
                        item={rightItems[i]}
                        side="right"
                        dimmed={hoveredSide === 'left'}
                      />
                      {rightContinues && (
                        <ContinuityConnector />
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
