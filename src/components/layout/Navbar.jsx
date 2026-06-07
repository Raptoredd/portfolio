import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Shield, Swords, GraduationCap, Briefcase,
  Home, GitBranch, Code2, Rss, Flag, Network, Mail,
} from 'lucide-react'
import { useTeamMode } from '../../context/TeamContext'

const NAV_LINKS = [
  { to: '/',         label: 'ACCUEIL',  icon: Home      },
  { to: '/parcours', label: 'PARCOURS', icon: GitBranch },
  { to: '/projets',  label: 'PROJETS',  icon: Code2     },
  { to: '/veille',   label: 'VEILLE',   icon: Rss       },
  { to: '/ctf',      label: 'CTF',      icon: Flag      },
  { to: '/homelab',  label: 'HOMELAB',  icon: Network   },
  { to: '/contact',  label: 'CONTACT',  icon: Mail      },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src="/fox.png"
        alt="Logo"
        width={28}
        height={28}
        style={{ objectFit: 'contain' }}
      />
      <span
        className="glitch glitch-subtle hidden sm:block"
        data-text="B.BAYLE"
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: 'var(--accent)',
        }}
      >
        B.BAYLE
      </span>
    </Link>
  )
}

function TeamBadge() {
  const { teamMode } = useTeamMode()
  const location = useLocation()
  if (location.pathname !== '/projets') return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-1 px-2 py-1 rounded"
      style={{
        border: `1px solid ${teamMode === 'blue' ? 'var(--blue-team)' : 'var(--red-team)'}`,
        color: teamMode === 'blue' ? 'var(--blue-team)' : 'var(--red-team)',
        background: teamMode === 'blue'
          ? 'rgba(75,158,245,0.08)'
          : 'rgba(245,75,75,0.08)',
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
      }}
    >
      {teamMode === 'blue' ? <Shield size={12} /> : <Swords size={12} />}
      {teamMode === 'blue' ? 'DEFENSIVE' : 'OFFENSIVE'}
    </motion.div>
  )
}

function ParcoursBadge() {
  const location = useLocation()
  const [tab, setTab] = useState(() => sessionStorage.getItem('parcours_tab') || 'etudes')

  useEffect(() => {
    const handler = e => setTab(e.detail)
    window.addEventListener('parcours-tab-change', handler)
    return () => window.removeEventListener('parcours-tab-change', handler)
  }, [])

  if (location.pathname !== '/parcours') return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-1 px-2 py-1 rounded"
      style={{
        border: '1px solid var(--border-accent)',
        color: 'var(--accent)',
        background: 'transparent',
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
      }}
    >
      {tab === 'etudes' ? <GraduationCap size={12} /> : <Briefcase size={12} />}
      {tab === 'etudes' ? 'ÉTUDES' : 'PRO'}
    </motion.div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
        style={{
          height: '56px',
          background: 'var(--bg-primary)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Logo />

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            <TeamBadge key={location.pathname} />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <ParcoursBadge key={location.pathname} />
          </AnimatePresence>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map(link => {
              const LinkIcon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  style={({ isActive }) => ({
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    position: 'relative',
                    paddingBottom: '2px',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <LinkIcon size={13} />
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'var(--accent)',
                            boxShadow: '0 0 6px var(--accent-glow)',
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-1"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 bottom-0 z-40 w-48 flex flex-col pt-16 pb-4 px-4 gap-2"
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            {NAV_LINKS.map(link => {
              const LinkIcon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    paddingLeft: '8px',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  })}
                >
                  <LinkIcon size={15} />
                  {link.label}
                </NavLink>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
