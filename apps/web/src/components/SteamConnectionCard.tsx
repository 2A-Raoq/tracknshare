import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import SteamGameSelectionModal from './SteamGameSelectionModal'
import SteamLinkModal from './SteamLinkModal'
import {
  getMyGameAccounts,
  getSteamGames,
  linkSteamAccount,
  updateTrackedSteamGames,
} from '../services/gameAccounts.api'
import { syncSteamStats } from '../services/stats.api'
import type { GameAccountItem, SteamGameItem } from '../types/game-accounts'
import type { PlayerStatsData } from '../types/stats'

type SteamConnectionCardProps = {
  title?: string
  description?: string
}

export default function SteamConnectionCard({
  title = 'Comptes liés',
  description = 'Gérez vos connexions externes depuis un espace dédié, sans exposer de clé API dans le navigateur.',
}: SteamConnectionCardProps) {
  const [steamAccounts, setSteamAccounts] = useState<GameAccountItem[]>([])
  const [steamLoading, setSteamLoading] = useState(true)
  const [steamError, setSteamError] = useState('')
  const [steamSuccess, setSteamSuccess] = useState('')
  const [steamIdInput, setSteamIdInput] = useState('')
  const [linkingSteam, setLinkingSteam] = useState(false)
  const [syncingSteam, setSyncingSteam] = useState(false)
  const [latestSteamStats, setLatestSteamStats] = useState<PlayerStatsData[]>([])
  const [steamModalOpen, setSteamModalOpen] = useState(false)
  const [gamesModalOpen, setGamesModalOpen] = useState(false)
  const [gamesLoading, setGamesLoading] = useState(false)
  const [gamesSaving, setGamesSaving] = useState(false)
  const [steamGames, setSteamGames] = useState<SteamGameItem[]>([])
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([])

  useEffect(() => {
    getMyGameAccounts()
      .then((accounts) => {
        setSteamAccounts(accounts)
        const steamAccount = accounts.find((account) => account.platform === 'STEAM') ?? null
        if (steamAccount) {
          setSteamIdInput(steamAccount.externalId)
        }
      })
      .catch((error: any) => {
        const message = error?.response?.data?.message
          ?? error?.response?.data?.error?.message
          ?? 'Impossible de charger votre liaison Steam.'
        setSteamError(message)
      })
      .finally(() => setSteamLoading(false))
  }, [])

  async function handleLinkSteam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLinkingSteam(true)
    setSteamError('')
    setSteamSuccess('')

    try {
      const account = await linkSteamAccount(steamIdInput.trim())
      setSteamAccounts((prev) => {
        const others = prev.filter((item) => item.platform !== 'STEAM')
        return [...others, account]
      })
      setSteamIdInput(account.externalId)
      setSteamSuccess('Compte Steam lié avec succès.')
      setSteamGames([])
      setSelectedAppIds([])
      setSteamModalOpen(false)
    } catch (error: any) {
      const message = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
        ?? 'Impossible de lier ce compte Steam.'
      setSteamError(message)
    } finally {
      setLinkingSteam(false)
    }
  }

  async function handleSteamSync() {
    setSyncingSteam(true)
    setSteamError('')
    setSteamSuccess('')

    try {
      const updated = await syncSteamStats()
      setLatestSteamStats(updated)
      const accounts = await getMyGameAccounts()
      setSteamAccounts(accounts)
      setSteamSuccess(`Synchronisation Steam terminée pour ${updated.length} jeu(x).`)
    } catch (error: any) {
      const message = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
        ?? 'Impossible de synchroniser Steam.'
      setSteamError(message)
    } finally {
      setSyncingSteam(false)
    }
  }

  async function handleLoadSteamGames() {
    setGamesLoading(true)
    setSteamError('')
    setSteamSuccess('')

    try {
      const games = await getSteamGames()
      setSteamGames(games)
      setSelectedAppIds(games.filter((game) => game.isTracked).map((game) => game.appId))
      if (games.length === 0) {
        setSteamSuccess('Aucun jeu Steam jouable détecté.')
      }
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
      if (apiMessage === 'STEAM_NO_GAMES_FOUND') {
        setSteamGames([])
        setSelectedAppIds([])
        setSteamSuccess('Aucun jeu Steam jouable détecté.')
        setGamesLoading(false)
        return
      }
      const message = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
        ?? 'Impossible de charger les jeux Steam.'
      setSteamError(message)
    } finally {
      setGamesLoading(false)
    }
  }

  async function handleOpenGamesModal() {
    setGamesModalOpen(true)
    if (steamGames.length > 0) {
      setSelectedAppIds(steamGames.filter((game) => game.isTracked).map((game) => game.appId))
      return
    }
    if (!gamesLoading) {
      await handleLoadSteamGames()
    }
  }

  async function handleSaveTrackedGames() {
    setGamesSaving(true)
    setSteamError('')
    setSteamSuccess('')

    try {
      const updatedGames = await updateTrackedSteamGames(selectedAppIds)
      setSteamGames(updatedGames)
      setSelectedAppIds(updatedGames.filter((game) => game.isTracked).map((game) => game.appId))
      setSteamSuccess('Sélection Steam enregistrée.')
      setGamesModalOpen(false)
    } catch (error: any) {
      const message = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
        ?? 'Impossible d’enregistrer la sélection Steam.'
      setSteamError(message)
    } finally {
      setGamesSaving(false)
    }
  }

  function toggleTrackedGame(appId: string) {
    setSelectedAppIds((prev) =>
      prev.includes(appId)
        ? prev.filter((item) => item !== appId)
        : [...prev, appId],
    )
  }

  const steamAccount = steamAccounts.find((account) => account.platform === 'STEAM') ?? null
  const selectedCount = selectedAppIds.length
  const trackedSummary = useMemo(
    () => `${selectedCount} jeu(x) suivi(s)`,
    [selectedCount],
  )

  return (
    <section className="section-stack">
      <div className="section-heading">
        <h2>{title}</h2>
        <p className="section-copy">{description}</p>
      </div>

      {steamLoading && <p className="status-message">Chargement de la liaison Steam...</p>}
      {steamError && <p className="status-message error">{steamError}</p>}
      {steamSuccess && <p className="status-message success">{steamSuccess}</p>}

      <div className="status-card external-service-card">
        <div className="external-service-row">
          <div>
            <p className="muted-text">Service disponible</p>
            <h2 style={{ marginTop: '6px' }}>Steam</h2>
            <p className="muted-text">
              {steamAccount
                ? `Connecté via ${steamAccount.externalUsername ?? steamAccount.externalId}`
                : 'Non connecté'}
            </p>
          </div>
          <div className="external-service-meta">
            <div className={steamAccount ? 'pill connected' : 'pill'}>
              {steamAccount ? 'Connecté' : 'Non connecté'}
            </div>
            <div className="button-row">
              <button
                className="primary-button"
                onClick={() => setSteamModalOpen(true)}
                disabled={steamLoading}
              >
                {steamAccount ? 'Gérer Steam' : 'Connecter Steam'}
              </button>
              {steamAccount && (
                <button
                  className="ghost-button"
                  onClick={handleOpenGamesModal}
                  disabled={gamesLoading}
                >
                  {gamesLoading ? 'Chargement...' : 'Sélectionner mes jeux Steam'}
                </button>
              )}
            </div>
          </div>
        </div>

        {steamAccount && (
          <ul className="metric-list" style={{ marginTop: '14px' }}>
            <li className="metric-row">SteamID64 : {steamAccount.externalId}</li>
            <li className="metric-row">
              Liaison : {new Date(steamAccount.linkedAt).toLocaleString()}
            </li>
            <li className="metric-row">
              Dernière synchronisation : {steamAccount.lastSyncAt
                ? new Date(steamAccount.lastSyncAt).toLocaleString()
                : 'Jamais'}
            </li>
            <li className="metric-row">Jeux suivis : {trackedSummary}</li>
          </ul>
        )}
        {steamAccount && (
          <div className="button-row">
            <button
              className="primary-button"
              onClick={handleSteamSync}
              disabled={syncingSteam || selectedCount === 0}
            >
              {syncingSteam ? 'Synchronisation...' : 'Synchroniser les jeux sélectionnés'}
            </button>
          </div>
        )}
      </div>

      {latestSteamStats.length > 0 && (
        <div className="section-stack">
          <div className="section-heading">
            <h2>Dernier import Steam</h2>
            <p className="section-copy">
              Une carte par jeu sélectionné synchronisé.
            </p>
          </div>

          <div className="stats-grid">
            {latestSteamStats.map((item) => (
              <div key={item.id} className="data-card">
                <div className="panel-header">
                  <div>
                    <p className="muted-text">{item.season?.name ?? 'Saison'}</p>
                    <h2>{item.game?.name ?? 'Jeu Steam'}</h2>
                  </div>
                  <div className="pill">
                    {item.provider} • Score <strong>{item.score}</strong>
                  </div>
                </div>
                <ul className="metric-list">
                  <li className="metric-row">
                    K/D : {item.kdRatio.toFixed(2)} ({item.kills} K / {item.deaths} D)
                  </li>
                  <li className="metric-row">
                    Win rate : {item.winrate}% ({item.wins}W / {item.losses}L)
                  </li>
                  <li className="metric-row">Parties jouées : {item.matchesPlayed}</li>
                  <li className="metric-row">Temps de jeu : {Math.round(item.playtimeMinutes / 60)}h</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <SteamLinkModal
        isOpen={steamModalOpen}
        steamAccount={steamAccount}
        steamIdInput={steamIdInput}
        error={steamError}
        success={steamSuccess}
        linkingSteam={linkingSteam}
        syncingSteam={syncingSteam}
        onClose={() => {
          setSteamModalOpen(false)
          setSteamError('')
          setSteamSuccess('')
        }}
        onSteamIdChange={setSteamIdInput}
        onSubmitLink={handleLinkSteam}
        onSyncSteam={handleSteamSync}
      />
      <SteamGameSelectionModal
        isOpen={gamesModalOpen}
        games={steamGames}
        loading={gamesLoading}
        saving={gamesSaving}
        error={steamError}
        selectedAppIds={selectedAppIds}
        onClose={() => {
          setGamesModalOpen(false)
          setSteamError('')
          setSelectedAppIds(steamGames.filter((game) => game.isTracked).map((game) => game.appId))
        }}
        onReload={handleLoadSteamGames}
        onToggleGame={toggleTrackedGame}
        onSave={handleSaveTrackedGames}
      />
    </section>
  )
}
