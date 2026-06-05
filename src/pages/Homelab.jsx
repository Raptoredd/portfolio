import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NetworkGraph from '../components/homelab/NetworkGraph'

export default function Homelab() {
  const [contextOpen, setContextOpen] = useState(false)

  return (
    <div style={{
      height: 'calc(100vh - 56px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ padding: '24px 32px 0', flexShrink: 0 }}>
        <h1
          className="glitch glitch-subtle"
          data-text="HOMELAB"
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          HOMELAB
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'IBM Plex Mono, monospace',
          marginTop: 8,
          letterSpacing: '0.04em',
        }}>
          Infrastructure Zero Trust bare-metal · hegemonia.lan · Cliquer sur un nœud pour les détails
        </p>

        {/* Accordion — Contexte Vertex Studio */}
        <div style={{
          marginTop: 12,
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setContextOpen(o => !o)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '7px 12px',
              background: 'var(--bg-surface)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: contextOpen ? 'var(--accent)' : 'var(--text-secondary)',
              letterSpacing: '.04em',
              transition: 'color .15s',
            }}
          >
            {contextOpen ? '▼' : '▶'} Contexte — Vertex Studio
          </button>

          <AnimatePresence initial={false}>
            {contextOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--bg-primary)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <p style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    Vertex Studio est le nom fictif donné à une startup créée en 2026 pour les besoins
                    de mon passage du titre RNCP. Derrière ce nom se cache un homelab réel à double
                    vocation : d'une part, il sert de terrain d'entraînement pratique pour le titre
                    (projets, TP, labs), de l'autre, il héberge des services personnels utilisés au
                    quotidien (monitoring, workspaces, DNS, accès distants sécurisés).
                  </p>
                  <p style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    L'infrastructure repose sur trois nœuds physiques (BASTION, Proxmox, SIEM),
                    segmentés en deux VLANs dédiés (APPS / SOC), avec un point d'entrée unique,
                    un reverse proxy TLS, un SIEM Wazuh et un accès administration strictement
                    contrôlé via Teleport CE et un navigateur isolé (Neko Firefox). Tout le routage
                    inter-VLAN est centralisé sur une VM OpenWRT — aucun flux entre serveurs ne
                    circule sans passer par un point de contrôle.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ flex: 1, marginTop: 16, overflow: 'hidden' }}>
        <NetworkGraph />
      </div>
    </div>
  )
}
