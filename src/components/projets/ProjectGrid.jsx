import { AnimatePresence, motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects }) {
  return (
    <motion.div
      className="grid gap-5"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', alignItems: 'stretch' }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </AnimatePresence>

      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full py-16 text-center"
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}
        >
          Aucun projet dans cette catégorie.
        </motion.div>
      )}
    </motion.div>
  )
}
