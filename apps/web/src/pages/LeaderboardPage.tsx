import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { getSoloLeaderboard } from '../services/stats.api'
import { authStore } from '../store/auth.store'
import type { LeaderboardEntry } from '../types/stats'

export default function LeaderboardPage() {
  const { user } = useSnapshot(authStore)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSoloLeaderboard({ limit: 20 })
      .then((data) => setEntries(data.entries))
      .catch(() => setError('Impossible de charger le leaderboard.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-badge" />
          <span>Track N&apos; Share</span>
        </Link>
        <div className="nav-actions">
          <Link href={user ? '/dashboard' : '/login'} className="ghost-button">
            {user ? 'Dashboard' : 'Login'}
          </Link>
          <Link href={user ? '/teams' : '/login'} className="secondary-button">Teams</Link>
        </div>
      </div>

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Public route</p>
              <h1 className="page-title">Leaderboard Solo</h1>
              <p className="section-copy">
                Classement public basé sur les stats mockées et le score calculé côté back-end.
              </p>
            </div>
          </div>
        </section>

        {loading && <p className="status-message">Chargement du leaderboard...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <div className="empty-box">
            Aucune donnée disponible. Synchronisez vos stats depuis le dashboard pour alimenter
            le classement.
          </div>
        )}

        {entries.length > 0 && (
          <section className="panel">
            <div className="leaderboard-table-wrap">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Joueur</th>
                    <th>Score</th>
                    <th>K/D</th>
                    <th>Win%</th>
                    <th>Parties</th>
                    <th>Jeu</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.userId}>
                      <td>{entry.rank}</td>
                      <td>{entry.username}</td>
                      <td><strong>{entry.score}</strong></td>
                      <td>{entry.kdRatio.toFixed(2)}</td>
                      <td>{entry.winrate}%</td>
                      <td>{entry.matchesPlayed}</td>
                      <td>{entry.gameName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
