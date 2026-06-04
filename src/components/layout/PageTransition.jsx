import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const GLITCH_ROUTES = ['/projets', '/ctf', '/homelab']

const fadeVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
}

const fadeTransition = {
  duration: 0.35,
  ease: 'easeInOut',
}

const glitchVariants = {
  initial: {
    opacity: 0,
    x: -4,
    skewX: -1,
    filter: 'hue-rotate(90deg)',
  },
  animate: {
    opacity: 1,
    x: 0,
    skewX: 0,
    filter: 'hue-rotate(0deg)',
  },
  exit: {
    opacity: 0,
    x: 4,
    skewX: 1,
  },
}

const glitchTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
}

export default function PageTransition({ children }) {
  const location = useLocation()
  const isGlitch = GLITCH_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <motion.div
      key={location.pathname}
      variants={isGlitch ? glitchVariants : fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={isGlitch ? glitchTransition : fadeTransition}
      style={{ minHeight: '100vh', paddingTop: '56px' }}
    >
      {children}
    </motion.div>
  )
}
