import { useState, useEffect } from 'react'

const CERTS = [
  {
    id: 'stormshield-csna',
    title: 'Certified Stormshield Network Administrator',
    acronym: 'CSNA',
    issuer: 'Stormshield',
    date: '2024',
    expiry: '2029-05-18',
    color: '#00aaff',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-1-Stormshield.jpeg',
    description: "Certification d'administration des firewalls Stormshield SNS couvrant la configuration des politiques de sécurité, le filtrage réseau, les VPN et la supervision. Valide jusqu'au 18/05/2029.",
  },
  {
    id: 'paloalto-fundamentals',
    title: 'Cybersecurity Fundamentals',
    acronym: 'PANS',
    issuer: 'Palo Alto Networks Academy',
    date: '10 déc. 2025',
    expiry: null,
    color: '#fa4616',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-2-Paloalto.png',
    description: 'Certification de complétion du cours Cybersecurity Fundamentals de la Palo Alto Networks Academy, couvrant les bases de la cybersécurité selon le référentiel Palo Alto. Délivré par Nikesh Arora, Chairman & CEO.',
  },
  {
    id: 'cisco-intro',
    title: 'Introduction to Cybersecurity',
    acronym: 'Cisco',
    issuer: 'Cisco Networking Academy',
    date: '29 avr. 2025',
    expiry: null,
    color: '#1ba0d7',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-3-cisco.png',
    description: "Credential Cisco Networking Academy validant la maîtrise des fondamentaux de la cybersécurité : menaces courantes, protection en ligne, défense organisationnelle et exploration des métiers de la cybersécurité.",
  },
  {
    id: 'securiti-ai',
    title: 'AI Security & Governance',
    acronym: 'AI S&G',
    issuer: 'Securiti',
    date: 'Oct. 2024',
    expiry: '2027-10-10',
    color: '#0066cc',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-4-securiti.jpeg',
    description: "Certification couvrant les concepts fondamentaux de la sécurité de l'IA générative, les réglementations mondiales sur l'IA, les obligations de conformité, la gestion des risques et les frameworks de gouvernance. 1,5 crédits CPE. ID : 13F276BFD.",
  },
  {
    id: 'anssi-mooc',
    title: 'SecNumacadémie — MOOC Sécurité Numérique',
    acronym: 'ANSSI',
    issuer: 'ANSSI',
    date: '29 avr. 2025',
    expiry: null,
    color: '#003189',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-5-MOOC.png',
    description: "Attestation de suivi du MOOC SecNumacadémie de l'ANSSI. 4 modules complétés avec un score de 100% chacun : Panorama de la SSI, Sécurité de l'authentification, Sécurité sur Internet, Sécurité du poste de travail et nomadisme.",
  },
  {
    id: 'inrs-rps',
    title: 'Management & Prévention des risques psychosociaux',
    acronym: 'RPS',
    issuer: 'INRS France',
    date: '15 nov. 2022',
    expiry: null,
    color: '#e05a00',
    assetType: 'image',
    assetPath: '/assets/certificates/CERT-6-RPS.jpeg',
    description: "Attestation de réussite délivrée par l'INRS suite à la validation du parcours d'autoformation en ligne sur le management et la prévention des risques psychosociaux. N° 168503.",
  },
]

function ExpiryBadge({ expiry }) {
  if (!expiry) return null
  const d = new Date(expiry)
  const diffDays = Math.floor((d - Date.now()) / 86400000)
  const label = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  const color = diffDays < 0 ? '#f54b4b' : diffDays < 365 ? '#f5a623' : '#00e5a0'
  const text  = diffDays < 0 ? `Expiré ${label}` : `Expire ${label}`
  return (
    <span style={{
      background: color + '22', color, border: `1px solid ${color}44`,
      borderRadius: 3, padding: '1px 7px',
      fontSize: 10, fontFamily: 'IBM Plex Mono,monospace',
    }}>
      {text}
    </span>
  )
}

export default function CertificationsModal({ onClose }) {
  const [idx, setIdx] = useState(0)
  const cert = CERTS[idx]

  const prev = () => setIdx(i => (i - 1 + CERTS.length) % CERTS.length)
  const next = () => setIdx(i => (i + 1) % CERTS.length)

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${cert.color}`,
          boxShadow: `0 0 40px ${cert.color}44`,
          borderRadius: 8,
          width: '100%', maxWidth: 760,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'IBM Plex Mono,monospace',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ color: cert.color, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 3 }}>
              {cert.issuer}
            </div>
            <div style={{ color: '#e8e8f0', fontSize: 15, fontWeight: 700, letterSpacing: '.04em' }}>
              {cert.title}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{cert.date}</span>
              <ExpiryBadge expiry={cert.expiry} />
            </div>
            {cert.description && (
              <div style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'IBM Plex Mono,monospace', marginTop: 6, maxWidth: 520, lineHeight: 1.6 }}>
                {cert.description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenu certificat */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {cert.assetType === 'image' ? (
            <img
              src={cert.assetPath}
              alt={cert.title}
              style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: 4 }}
            />
          ) : (
            <iframe
              src={cert.assetPath}
              title={cert.title}
              style={{ width: '100%', height: '55vh', border: 'none', borderRadius: 4 }}
            />
          )}
        </div>

        {/* Navigation */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {CERTS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 20 : 8, height: 8,
                  borderRadius: 4, border: 'none',
                  background: i === idx ? cert.color : 'var(--border)',
                  cursor: 'pointer', transition: 'all .2s', padding: 0,
                }}
              />
            ))}
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
            {idx + 1} / {CERTS.length}
          </span>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={prev}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '6px 14px',
                borderRadius: 4, fontFamily: 'IBM Plex Mono,monospace',
                fontSize: 12, cursor: 'pointer', letterSpacing: '.06em',
              }}
            >
              ← PRÉC
            </button>
            <button
              onClick={next}
              style={{
                background: cert.color, border: `1px solid ${cert.color}`,
                color: 'var(--bg-primary)', padding: '6px 14px',
                borderRadius: 4, fontFamily: 'IBM Plex Mono,monospace',
                fontSize: 12, cursor: 'pointer', letterSpacing: '.06em', fontWeight: 700,
              }}
            >
              SUIV →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
