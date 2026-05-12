import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { useLocation } from 'wouter'
import { authStore } from '../store/auth.store'
import { achievementsApi } from '../services/achievements.api'
import { getMyStats, syncStats } from '../services/stats.api'
import type { AchievementItem } from '../types/achievements'
import type { PlayerStatsData } from '../types/stats'
import AppNavigation from '../components/AppNavigation'
import AchievementCard from '../components/AchievementCard'
import GameStatsTabs from '../components/GameStatsTabs'

export default function DashboardPage() {
  const { user } = useSnapshot(authStore)
  const [, navigate] = useLocation()
  // navigate kept for quick-nav buttons below
  const [stats, setStats] = useState<PlayerStatsData[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')
  const [badges, setBadges] = useState<AchievementItem[]>([])
  const [badgesLoading, setBadgesLoading] = useState(true)
  const [badgesError, setBadgesError] = useState('')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    getMyStats()
      .then(setStats)
      .catch(() => setStatsError('Impossible de charger les stats.'))
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    achievementsApi
      .getMyAchievements()
      .then(setBadges)
      .catch(() => setBadgesError('Impossible de charger vos badges.'))
      .finally(() => setBadgesLoading(false))
  }, [])

  async function handleSync() {
    setSyncing(true)
    setStatsError('')
    try {
      const updated = await syncStats()
      setStats((prev) => {
        const index = prev.findIndex((item) => item.id === updated.id)
        if (index >= 0) {
          const next = [...prev]
          next[index] = updated
          return next
        }
        return [updated, ...prev]
      })
    } catch {
      setStatsError('Erreur lors de la synchronisation.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="page-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Private route</p>
              <h1 className="page-title">Dashboard</h1>
              <p className="section-copy">
                Suivez votre score, vos ratios et vos routes de démonstration depuis un seul
                écran.
              </p>
            </div>
            <div className="page-actions">
              <button onClick={handleSync} className="primary-button" disabled={syncing}>
                {syncing ? 'Synchronisation...' : 'Synchroniser mes stats'}
              </button>
            </div>
          </div>

          {user && (
            <div className="info-grid">
              <div className="status-card">
                <p className="muted-text">Joueur connecté</p>
                <h2 style={{ marginTop: '6px' }}>{user.username}</h2>
                <p className="muted-text">{user.email}</p>
              </div>
              <div className="status-card">
                <p className="muted-text">Rôle actuel</p>
                <h2 style={{ marginTop: '6px' }}>{user.role}</h2>
                <p className="muted-text">Accès au dashboard, aux équipes et au chat.</p>
              </div>
            </div>
          )}
        </section>

        <section className="section-stack">
          <div className="section-heading">
            <h2>Stats principales</h2>
            <p className="section-copy">
              Passez d’un jeu à l’autre pour comparer vos stats mockées et Steam dans une seule vue.
            </p>
          </div>

          {statsLoading && <p className="status-message">Chargement des stats...</p>}
          {statsError && <p className="status-message error">{statsError}</p>}

          {!statsLoading && !statsError && stats.length === 0 && (
            <div className="empty-box">
              Aucune stats pour le moment. Cliquez sur &quot;Synchroniser mes stats&quot; pour
              initialiser la démonstration.
            </div>
          )}

          {!statsLoading && !statsError && stats.length > 0 && <GameStatsTabs stats={stats} />}
        </section>

        <section className="section-stack">
          <div className="section-heading">
            <h2>Mes badges</h2>
            <p className="section-copy">
              Progression et badges débloqués — calculés à partir de ton activité en temps réel.
            </p>
          </div>

          {badgesLoading && <p className="status-message">Chargement des badges...</p>}
          {badgesError && <p className="status-message error">{badgesError}</p>}

          {!badgesLoading && !badgesError && badges.length === 0 && (
            <div className="empty-box">Aucun badge disponible pour le moment.</div>
          )}

          <div className="stats-grid">
            {badges.map((badge) => (
              <AchievementCard
                key={badge.code}
                achievement={badge}
                variant="progress"
              />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading" style={{ marginBottom: '16px' }}>
            <h2>Navigation rapide</h2>
            <p className="section-copy">
              Gardez le parcours de soutenance clair : dashboard, leaderboard, équipe, chat.
            </p>
          </div>
          <div className="button-row">
            <button onClick={() => navigate('/leaderboard')} className="ghost-button">
              Voir le leaderboard
            </button>
            <button onClick={() => navigate('/teams')} className="ghost-button">
              Ouvrir mes équipes
            </button>
            <button onClick={() => navigate('/friends')} className="ghost-button">
              Ouvrir mes amis
            </button>
            <button onClick={() => navigate('/messages')} className="ghost-button">
              Ouvrir mes messages
            </button>
            <button onClick={() => navigate('/profile')} className="ghost-button">
              Ouvrir mon compte
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
