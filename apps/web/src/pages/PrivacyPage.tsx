import { useState } from 'react'
import { useLocation } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { usersApi } from '../services/users.api'

export default function PrivacyPage() {
  const { user } = useSnapshot(authStore)
  const [, navigate] = useLocation()
  const [busy, setBusy] = useState<'export' | 'delete' | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleExport() {
    setBusy('export')
    setMessage(null)
    try {
      const data = await usersApi.exportMyData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'tracknshare-mes-donnees.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setMessage("L'export a échoué. Réessayez plus tard.")
    } finally {
      setBusy(null)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.',
    )
    if (!confirmed) return

    setBusy('delete')
    setMessage(null)
    try {
      await usersApi.deleteMyAccount()
      authStore.user = null
      authStore.token = null
      localStorage.removeItem('access_token')
      navigate('/', { replace: true })
    } catch {
      setMessage('La suppression a échoué. Réessayez plus tard.')
      setBusy(null)
    }
  }

  return (
    <div className="page-shell">
      <h1 className="section-heading">Politique de confidentialité</h1>
      <p className="muted-text">
        Projet étudiant / MVP — version simplifiée, alignée sur l&apos;article 13
        du RGPD et les recommandations de la CNIL.
      </p>

      <section className="panel">
        <h2>Données collectées</h2>
        <ul>
          <li>Compte : email, pseudo, mot de passe (haché), rôle.</li>
          <li>Jeu : statistiques, score, comptes de jeu liés (ex. SteamID).</li>
          <li>Social : équipes, messages d&apos;équipe et privés, demandes d&apos;amis.</li>
          <li>
            Technique : token de session, données nécessaires à la sécurité
            (rate limiting, journaux).
          </li>
        </ul>
      </section>

      <section className="panel">
        <h2>Finalités &amp; bases légales</h2>
        <ul>
          <li>Fournir le service (compte, dashboard, leaderboard) — exécution du service.</li>
          <li>Sécuriser l&apos;accès — intérêt légitime.</li>
          <li>Liaison de comptes externes (Steam) — à votre initiative.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Conservation &amp; sécurité</h2>
        <p className="muted-text">
          Les données sont conservées le temps de vie du compte. Mots de passe
          hachés (bcrypt), messages chiffrés (AES-256-GCM), accès protégés par
          jetons JWT et limitation de débit.
        </p>
      </section>

      <section className="panel">
        <h2>Vos droits</h2>
        <p className="muted-text">
          Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement
          et de portabilité. Les deux derniers sont exerçables directement
          ci-dessous lorsque vous êtes connecté.
        </p>

        {user ? (
          <div className="button-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={handleExport}
              disabled={busy !== null}
            >
              {busy === 'export' ? 'Export en cours…' : 'Exporter mes données (JSON)'}
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={handleDelete}
              disabled={busy !== null}
              style={{ color: '#F04747', borderColor: '#F04747' }}
            >
              {busy === 'delete' ? 'Suppression…' : 'Supprimer mon compte'}
            </button>
          </div>
        ) : (
          <p className="muted-text">
            Connectez-vous pour exporter ou supprimer vos données.
          </p>
        )}

        {message && <p className="status-message error">{message}</p>}
      </section>

      <p className="muted-text">
        Contact : contact@tracknshare.example — Responsable : équipe projet
        Track&apos;N Share (Ioanes &amp; Clément).
      </p>
    </div>
  )
}
