import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../components/ui/GlitchText'
import TeamToggle from '../components/projets/TeamToggle'
import ProjectGrid from '../components/projets/ProjectGrid'
import { useTeamMode } from '../context/TeamContext'
import { projectsData } from '../data/projectsData'

export default function Projets() {
  const { teamMode } = useTeamMode()
  const filtered = projectsData
    .filter(p => p.team === teamMode)
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>
      <TeamToggle />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <GlitchText
            text="PROJETS"
            tag="h1"
            intensity="subtle"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={teamMode}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              {teamMode === 'blue'
                ? 'Protection, détection, réponse à incident'
                : 'Tests d\'intrusion, exploitation, adversarial simulation'}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={teamMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectGrid projects={filtered} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
