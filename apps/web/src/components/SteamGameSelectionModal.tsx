import { useEffect } from 'react'
import type { SteamGameItem } from '../types/game-accounts'

type SteamGameSelectionModalProps = {
  isOpen: boolean
  games: SteamGameItem[]
  loading: boolean
  saving: boolean
  error: string
  selectedAppIds: string[]
  onClose: () => void
  onReload: () => Promise<void> | void
  onToggleGame: (appId: string) => void
  onSave: () => Promise<void> | void
}

function formatSteamHours(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) {
    return '0h'
  }

  return `${Math.round(minutes / 60)}h`
}

export default function SteamGameSelectionModal({
  isOpen,
  games,
  loading,
  saving,
  error,
  selectedAppIds,
  onClose,
  onReload,
  onToggleGame,
  onSave,
}: SteamGameSelectionModalProps) {
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
        className="modal-card steam-games-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="steam-games-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="hero-kicker">Steam</p>
            <h2 id="steam-games-title">Sélectionner mes jeux Steam</h2>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer la sélection des jeux Steam"
          >
            ×
          </button>
        </div>

        <div className="modal-body steam-games-modal__body">
          <div className="steam-games-modal__intro">
            <p className="section-copy">
              Choisissez les jeux Steam à suivre dans Track&apos;N Share. Seuls les jeux
              sélectionnés seront synchronisés dans votre dashboard.
            </p>

            <div className="panel-header steam-games-modal__toolbar">
              <div className="pill">{selectedAppIds.length} jeu(x) sélectionné(s)</div>
              <button
                type="button"
                className="ghost-button"
                onClick={onReload}
                disabled={loading || saving}
              >
                {loading ? 'Chargement...' : 'Recharger mes jeux'}
              </button>
            </div>

            {error && <p className="status-message error">{error}</p>}
            {loading && <p className="status-message">Chargement des jeux Steam...</p>}
          </div>

          <div className="steam-games-modal__content">
            {!loading && games.length === 0 && (
              <div className="empty-box">Aucun jeu Steam trouvé pour ce compte.</div>
            )}

            {!loading && games.length > 0 && (
              <div className="steam-games-modal__list">
                {games.map((game) => {
                  const checked = selectedAppIds.includes(game.appId)
                  return (
                    <label key={game.appId} className="steam-game-card steam-game-card--compact">
                      <div className="steam-game-card__select">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleGame(game.appId)}
                        />
                      </div>
                      {game.imageUrl ? (
                        <img src={game.imageUrl} alt="" className="steam-game-card__image" />
                      ) : (
                        <div className="steam-game-card__image steam-game-card__image--empty">
                          STEAM
                        </div>
                      )}
                      <div className="steam-game-card__content">
                        <strong>{game.name}</strong>
                        <p className="muted-text">
                          AppID {game.appId} • Total {formatSteamHours(game.playtimeForever)}
                        </p>
                        <p className="muted-text">
                          Récent : {game.playtime2Weeks
                            ? formatSteamHours(game.playtime2Weeks)
                            : 'Aucune donnée'}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="modal-actions steam-games-modal__footer">
            <button
              type="button"
              className="ghost-button"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onSave}
              disabled={saving || loading || games.length === 0}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer la sélection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
