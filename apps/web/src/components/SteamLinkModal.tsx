import { useEffect } from 'react'
import type { FormEvent } from 'react'
import type { GameAccountItem } from '../types/game-accounts'

type SteamLinkModalProps = {
  isOpen: boolean
  steamAccount: GameAccountItem | null
  steamIdInput: string
  error: string
  success: string
  linkingSteam: boolean
  syncingSteam: boolean
  onClose: () => void
  onSteamIdChange: (value: string) => void
  onSubmitLink: (event: FormEvent<HTMLFormElement>) => Promise<void> | void
  onSyncSteam: () => Promise<void> | void
}

export default function SteamLinkModal({
  isOpen,
  steamAccount,
  steamIdInput,
  error,
  success,
  linkingSteam,
  syncingSteam,
  onClose,
  onSteamIdChange,
  onSubmitLink,
  onSyncSteam,
}: SteamLinkModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="steam-link-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="hero-kicker">Connexion externe</p>
            <h2 id="steam-link-title">Connecter Steam</h2>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="section-copy">
            Associez votre compte Steam à Track&apos;N Share pour importer vos données
            publiques et enrichir vos statistiques.
          </p>

          <div className="modal-note">
            <h3>Comment trouver votre SteamID64 ?</h3>
            <ul className="metric-list">
              <li className="metric-row">
                Ouvrez votre profil Steam dans le navigateur.
              </li>
              <li className="metric-row">
                Si l&apos;URL ressemble à
                {' '}`https://steamcommunity.com/profiles/7656119...`,
                copiez le long nombre : c&apos;est votre SteamID64.
              </li>
              <li className="metric-row">
                Si l&apos;URL ressemble à
                {' '}`https://steamcommunity.com/id/votre-pseudo`,
                utilisez un convertisseur SteamID ou récupérez votre SteamID64 depuis les
                paramètres de profil.
              </li>
              <li className="metric-row">
                Vérifiez que votre profil Steam et vos détails de jeux sont publics.
              </li>
            </ul>
          </div>

          {error && <p className="status-message error">{error}</p>}
          {success && <p className="status-message success">{success}</p>}

          {steamAccount && (
            <div className="modal-note">
              <h3>Connexion actuelle</h3>
              <ul className="metric-list">
                <li className="metric-row">
                  Pseudo Steam : {steamAccount.externalUsername ?? 'Non renseigné'}
                </li>
                <li className="metric-row">SteamID64 : {steamAccount.externalId}</li>
                <li className="metric-row">
                  Liaison : {new Date(steamAccount.linkedAt).toLocaleString()}
                </li>
                <li className="metric-row">
                  Dernière synchronisation : {steamAccount.lastSyncAt
                    ? new Date(steamAccount.lastSyncAt).toLocaleString()
                    : 'Jamais'}
                </li>
              </ul>
            </div>
          )}

          <form onSubmit={onSubmitLink} className="form-stack">
            <div className="field">
              <label htmlFor="modal-steam-id">SteamID64</label>
              <input
                id="modal-steam-id"
                type="text"
                value={steamIdInput}
                onChange={(event) => onSteamIdChange(event.target.value)}
                placeholder="7656119XXXXXXXXXX"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={onClose}
                disabled={linkingSteam || syncingSteam}
              >
                Annuler
              </button>
              {steamAccount && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onSyncSteam}
                  disabled={syncingSteam || linkingSteam}
                >
                  {syncingSteam ? 'Synchronisation...' : 'Synchroniser maintenant'}
                </button>
              )}
              <button
                type="submit"
                className="primary-button"
                disabled={linkingSteam || syncingSteam || !steamIdInput.trim()}
              >
                {linkingSteam
                  ? 'Liaison...'
                  : steamAccount
                    ? 'Mettre à jour la liaison'
                    : 'Lier Steam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
