import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, ChevronDown } from 'lucide-react'
import TerminalCursor from '../components/ui/TerminalCursor'
import GlitchText from '../components/ui/GlitchText'
import CertificationsModal from '../components/home/CertificationsModal'

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Raptoredd',                         icon: Github   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/benjamin-bayle-44a656253/', icon: Linkedin },
]

function StatCard({ value, sublabel, label, breathe, href, onClick }) {
  const [hov, setHov] = useState(false)
  const navigate = useNavigate()
  const isClickable = !!(href || onClick)

  const handleClick = () => {
    if (href?.startsWith('/')) {
      navigate(href)
    } else if (href) {
      window.open(href, '_blank', 'noopener noreferrer')
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '12px 18px',
        borderRadius: 6,
        border: 'none',
        background: 'var(--bg-surface)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all .2s',
        boxShadow: breathe
          ? undefined
          : hov
            ? '0 0 16px var(--accent-glow)'
            : '0 0 6px var(--accent-glow)',
        animation: breathe ? 'breathe-glow 3s ease-in-out infinite' : 'none',
        minWidth: 120,
        textAlign: 'center',
      }}
    >
      <div style={{
        color: 'var(--accent)',
        fontSize: 18,
        fontFamily: 'Orbitron, monospace',
        fontWeight: 700,
        letterSpacing: '0.04em',
        lineHeight: 1.2,
      }}>
        {value}
      </div>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: 11,
        fontFamily: 'IBM Plex Mono, monospace',
        marginTop: 3,
        letterSpacing: '0.04em',
      }}>
        {sublabel}
      </div>
      <div style={{
        color: 'var(--text-muted)',
        fontSize: 10,
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginTop: 2,
      }}>
        {label}
      </div>
      {isClickable && (
        <div style={{
          color: 'var(--accent)',
          fontSize: 9,
          fontFamily: 'IBM Plex Mono, monospace',
          marginTop: 5,
          opacity: hov ? 1 : 0.4,
          transition: 'opacity .2s',
          letterSpacing: '.06em',
        }}>
          VOIR →
        </div>
      )}
    </div>
  )
}

function NetworkDotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.06 }}
      aria-hidden
    >
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.2" fill="var(--accent)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  )
}

function AnimatedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-2"
    >
      <img
        src="/fox1.png"
        alt="Logo Benjamin Bayle"
        width={120}
        height={120}
        style={{ objectFit: 'contain' }}
      />
    </motion.div>
  )
}


export default function Home() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [showCertModal, setShowCertModal] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 1800),
      setTimeout(() => setStep(4), 2400),
      setTimeout(() => setStep(5), 2800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="relative flex flex-col"
      style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}
    >
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center" style={{ minHeight: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 56px - 90px)' }}>
        <NetworkDotGrid />

        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 max-w-3xl mx-auto">
          <AnimatedLogo />

          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}>
                <TerminalCursor
                  text="Benjamin Bayle"
                  speed={55}
                  delay={0}
                />
              </h1>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                color: 'var(--accent)',
                letterSpacing: '0.08em',
              }}
            >
              Étudiant en Cybersécurité
            </motion.p>
          )}

          {step >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                maxWidth: '540px',
                lineHeight: 1.85,
              }}
            >
              Administrateur d'infrastructures sécurisées en formation.<br />
              En alternance chez Malakoff Humanis — Technicien IT (EntraID · Intune · AD/SCCM · SysTrack).<br />
              Passionné par la conception Zero Trust, le pentest et la défense active.
            </motion.p>
          )}

          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 mt-2"
            >
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/parcours"
                  className="flex items-center gap-2 px-5 py-2.5 transition-all"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    background: 'transparent',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--accent-glow)'
                    e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  VOIR LE PARCOURS <ArrowRight size={14} />
                </Link>

                {!isMobile && (
                  <Link
                    to="/projets"
                    className="flex items-center gap-2 px-5 py-2.5 transition-all"
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-surface)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    EXPLORER LES PROJETS <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} gap-3 justify-center`}>
                <StatCard value="8 000+"     sublabel="Root-me.pro"    label="points"         breathe onClick={() => window.open('https://root-me.pro', '_blank', 'noopener')} />
                <StatCard value="6"          sublabel="Certifications" label="obtenues"       breathe onClick={() => setShowCertModal(true)} />
                <StatCard value="Zero Trust" sublabel="hegemonia.lan"  label="Infrastructure" breathe onClick={() => navigate('/homelab')} />
              </div>

              {/* Social links */}
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all"
                    aria-label={label}
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--border-accent)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
          {!isMobile && step >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'default',
              }}
            >
              <span style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                SCROLL
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </motion.div>
          )}
        </div>

        {showCertModal && <CertificationsModal onClose={() => setShowCertModal(false)} />}
      </section>

      {/* À propos */}
      <section
        className="py-24 px-6"
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-4xl mx-auto">
          <GlitchText
            text="À PROPOS"
            tag="h2"
            intensity="subtle"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: 'var(--accent)',
              marginBottom: '2rem',
              display: 'block',
            }}
          />

          <div className="grid md:grid-cols-2 gap-12">
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.9rem' }}>
              <p>
                Étudiant en Bachelor Réseaux &amp; Sécurité à Guardia Cybersecurity School
                (RNCP37680 — Administrateur d'Infrastructures Sécurisées), je me forme
                aux deux faces de la cybersécurité : défense active et tests d'intrusion.
              </p>
              <p className="mt-4">
                Actuellement en alternance chez Malakoff Humanis en tant que Technicien Support de Proximité,
                je gère au quotidien les incidents N1/N2, l'IAM (EntraID, Active Directory, Intune/SCCM)
                et le suivi des postes via SysTrack. En parallèle de ces missions IT,
                j'ai développé ProxiSave — un outil de sauvegarde sécurisé conçu selon une approche DevSecOps,
                soumis à l'équipe SecOp pour validation et whitelisting EDR.
                Mon profil couvre l'ensemble du spectre défense–attaque :
                conception d'infrastructures Zero Trust, analyse sécurité et tests offensifs.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: 'FORMATION',      value: 'Bachelor R&S — Guardia CS'    },
                { label: 'DISCIPLINES',    value: 'Offensive & Defensive'          },
                { label: 'ALTERNANCE',     value: 'Malakoff Humanis — IT Support' },
                { label: 'DISPONIBILITÉ',  value: '2026 (fin de formation)'       },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex justify-between py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                  }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
