import { useState } from 'react'
import { Link } from 'wouter'

const CONSENT_KEY = 'tns_consent'

/**
 * Bandeau d'information / consentement RGPD.
 * Affiché tant que l'utilisateur n'a pas validé ; le choix est mémorisé
 * localement (localStorage) pour ne plus réapparaître ensuite.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(
    () => localStorage.getItem(CONSENT_KEY) !== 'accepted',
  )

  if (!visible) return null

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Information sur les données personnelles"
      className="consent-banner"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.9rem 1.25rem',
        background: 'rgba(15, 17, 26, 0.97)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <p style={{ margin: 0, maxWidth: '640px', fontSize: '0.9rem' }}>
        Track&apos;N Share stocke uniquement les données nécessaires à votre
        compte et à vos statistiques de jeu. Aucune donnée n&apos;est revendue.
        Consultez la{' '}
        <Link href="/privacy" className="nav-link" style={{ textDecoration: 'underline' }}>
          politique de confidentialité
        </Link>
        .
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link href="/privacy" className="ghost-button">
          En savoir plus
        </Link>
        <button type="button" className="primary-button" onClick={accept}>
          J&apos;ai compris
        </button>
      </div>
    </div>
  )
}
