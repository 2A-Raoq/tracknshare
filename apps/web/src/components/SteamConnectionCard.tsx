import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import SteamLinkModal from './SteamLinkModal'
import { getMyGameAccounts, linkSteamAccount } from '../services/gameAccounts.api'
import { syncSteamStats } from '../services/stats.api'
import type { GameAccountItem } from '../types/game-accounts'
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
  const [latestSteamStats, setLatestSteamStats] = useState<PlayerStatsData | null>(null)
  const [steamModalOpen, setSteamModalOpen] = useState(false)

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
      setSteamSuccess('Synchronisation Steam terminée.')
    } catch (error: any) {
      const message = error?.response?.data?.message
        ?? error?.response?.data?.error?.message
        ?? 'Impossible de synchroniser Steam.'
      setSteamError(message)
    } finally {
      setSyncingSteam(false)
    }
  }

  const steamAccount = steamAccounts.find((account) => account.platform === 'STEAM') ?? null

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
                  onClick={handleSteamSync}
                  disabled={syncingSteam}
                >
                  {syncingSteam ? 'Synchronisation...' : 'Synchroniser Steam'}
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
          </ul>
        )}
      </div>

      {latestSteamStats && (
        <div className="data-card">
          <div className="panel-header">
            <div>
              <p className="muted-text">Dernier import</p>
              <h2>{latestSteamStats.game?.name ?? 'Steam Profile'}</h2>
            </div>
            <div className="pill">
              {latestSteamStats.provider} • Score <strong>{latestSteamStats.score}</strong>
            </div>
          </div>
          <ul className="metric-list">
            <li className="metric-row">
              K/D : {latestSteamStats.kdRatio.toFixed(2)} ({latestSteamStats.kills} K / {latestSteamStats.deaths} D)
            </li>
            <li className="metric-row">
              Win rate : {latestSteamStats.winrate}% ({latestSteamStats.wins}W / {latestSteamStats.losses}L)
            </li>
            <li className="metric-row">Parties jouées : {latestSteamStats.matchesPlayed}</li>
            <li className="metric-row">Temps de jeu : {Math.round(latestSteamStats.playtimeMinutes / 60)}h</li>
          </ul>
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
    </section>
  )
}
