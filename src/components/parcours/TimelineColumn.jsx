import { useState } from 'react'
import { Award } from 'lucide-react'
import TimelineItem from './TimelineItem'

export default function TimelineColumn({
  items,
  label,
  side = 'left',
  certButton = false,
  onOpenCertModal,
  mobileMode = false,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div>
      {/* Label header */}
      <div style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        color: 'var(--accent)',
        textAlign: 'center',
        marginBottom: '1.25rem',
        paddingBottom: '0.4rem',
        borderBottom: '1px solid var(--border-accent)',
      }}>
        {label}
      </div>

      {/* Certifications button — centered, PRO column only */}
      {certButton && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={onOpenCertModal}
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.12em',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              border: '1px solid var(--border-accent)',
              background: 'transparent',
              padding: '7px 18px',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = 'var(--bg-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--accent)'
            }}
          >
            <Award size={14} /> CERTIFICATIONS
          </button>
        </div>
      )}

      {/* Items — mobile layout */}
      {mobileMode ? (
        <div className="flex flex-col gap-4" onMouseLeave={() => setHoveredIndex(null)}>
          {items.map((item, i) => (
            <div
              key={item.id}
              className="relative pl-4"
              style={{ borderLeft: '1px solid var(--border-accent)' }}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <div
                className="absolute -left-1.5 top-4 w-3 h-3 rounded-full"
                style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}
              />
              <TimelineItem
                item={item}
                side="left"
                dimmed={hoveredIndex !== null && hoveredIndex !== i}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Items — desktop layout */
        <div className="flex flex-col gap-6" onMouseLeave={() => setHoveredIndex(null)}>
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <span style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                marginBottom: '4px',
              }}>
                {item.period || item.year}
              </span>
              <div style={{ width: '1px', height: '20px', borderLeft: '1px solid var(--border)', marginBottom: '4px' }} />
              <div style={{ width: '100%' }}>
                <TimelineItem
                  item={item}
                  side={side}
                  dimmed={hoveredIndex !== null && hoveredIndex !== i}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
