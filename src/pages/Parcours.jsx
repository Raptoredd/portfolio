import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Briefcase } from 'lucide-react'
import GlitchText from '../components/ui/GlitchText'
import TimelineColumn from '../components/parcours/TimelineColumn'
import CertificationsModal from '../components/home/CertificationsModal'
import { timelineEtudes, timelinePro } from '../data/timelineData'

export default function Parcours() {
  const location = useLocation()
  const [showCertModal, setShowCertModal] = useState(false)
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || sessionStorage.getItem('parcours_tab') || 'etudes'
  )

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    sessionStorage.setItem('parcours_tab', tab)
    window.dispatchEvent(new CustomEvent('parcours-tab-change', { detail: tab }))
  }

  useEffect(() => {
    sessionStorage.setItem('parcours_tab', activeTab)
  }, [activeTab])

  useEffect(() => {
    if (location.state?.openCertModal) {
      setShowCertModal(true)
      handleTabChange('pro')
    }
  }, [location.state])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 56px)' }}>

      {/* Toggle sticky — hors du max-w */}
      <div style={{
        position: 'sticky',
        top: '56px',
        zIndex: 40,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'center',
        padding: '12px 16px',
      }}>
        <div className="flex gap-1 p-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
          {[
            { id: 'etudes', label: 'ÉTUDES', Icon: GraduationCap },
            { id: 'pro',    label: 'PRO',    Icon: Briefcase },
          ].map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className="flex items-center gap-2 px-8 py-2.5 rounded"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  border: active ? '1px solid var(--border-accent)' : '1px solid transparent',
                  boxShadow: active ? '0 0 10px var(--accent-glow)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Titre */}
        <div className="text-center mb-12">
          <GlitchText
            text="PARCOURS"
            tag="h1"
            intensity="subtle"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          />
          <p style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}>
            Formation académique & expérience professionnelle
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'etudes' ? (
              <motion.div
                key="etudes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TimelineColumn items={timelineEtudes} label="ÉTUDES" />
              </motion.div>
            ) : (
              <motion.div
                key="pro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TimelineColumn
                  items={timelinePro}
                  label="PRO"
                  certButton
                  onOpenCertModal={() => setShowCertModal(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {showCertModal && (
        <CertificationsModal onClose={() => setShowCertModal(false)} />
      )}
    </div>
  )
}
