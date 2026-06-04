import { motion } from 'framer-motion'
import { Shield, Swords } from 'lucide-react'
import { useTeamMode } from '../../context/TeamContext'

export default function TeamToggle() {
  const { teamMode, setTeam } = useTeamMode()

  return (
    <div
      className="sticky top-14 z-30 flex justify-center py-4 px-4"
      style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
    >
      <div
        className="relative flex rounded overflow-hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        {/* Sliding indicator */}
        <motion.div
          layout
          className="absolute inset-y-0 w-1/2 rounded"
          animate={{ left: teamMode === 'blue' ? '0%' : '50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            background: teamMode === 'blue'
              ? 'rgba(75,158,245,0.15)'
              : 'rgba(245,75,75,0.15)',
            boxShadow: teamMode === 'blue'
              ? '0 0 16px rgba(75,158,245,0.3)'
              : '0 0 16px rgba(245,75,75,0.3)',
          }}
        />

        {/* Blue Team */}
        <button
          onClick={() => setTeam('blue')}
          className="relative flex items-center gap-2 px-8 py-3 transition-colors"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: teamMode === 'blue' ? 'var(--blue-team)' : 'var(--text-muted)',
            transition: 'color 0.3s',
          }}
        >
          <Shield size={16} />
          BLUE TEAM
        </button>

        {/* Red Team */}
        <button
          onClick={() => setTeam('red')}
          className="relative flex items-center gap-2 px-8 py-3 transition-colors"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: teamMode === 'red' ? 'var(--red-team)' : 'var(--text-muted)',
            transition: 'color 0.3s',
          }}
        >
          <Swords size={16} />
          RED TEAM
        </button>
      </div>
    </div>
  )
}
