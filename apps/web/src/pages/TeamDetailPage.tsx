import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { teamsApi } from '../services/teams.api'
import type { TeamDetail } from '../types/teams'
import AppNavigation from '../components/AppNavigation'

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [, navigate] = useLocation()

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)

  async function handleLeave() {
    if (!team) return
    if (!window.confirm(`Quitter l'équipe ${team.name} ?`)) return
    setLeaving(true)
    try {
      await teamsApi.leaveTeam(team.id)
      navigate('/teams')
    } catch {
      setError("Impossible de quitter l'équipe pour le moment.")
      setLeaving(false)
    }
  }

  useEffect(() => {
    if (!teamId) {
      setError("Identifiant d'équipe manquant.")
      setLoading(false)
      return
    }

    teamsApi
      .getTeam(teamId)
      .then(setTeam)
      .catch(() => setError('Équipe introuvable ou accès refusé.'))
      .finally(() => setLoading(false))
  }, [teamId])

  if (loading) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <p className="status-message">Chargement de l&apos;équipe...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <div className="status-message error">{error}</div>
        <div className="button-row" style={{ marginTop: '16px' }}>
          <button onClick={() => navigate('/teams')} className="ghost-button">
            Retour aux équipes
          </button>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <div className="empty-box">Aucune équipe sélectionnée.</div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Team room</p>
              <h1 className="page-title">[{team.tag}] {team.name}</h1>
              {team.description && <p className="section-copy">{team.description}</p>}
            </div>
            <Link href={`/messages/teams/${team.id}`} className="primary-button">
              Ouvrir le chat
            </Link>
          </div>

          <div className="mobile-stack" style={{ marginTop: '16px' }}>
            <div className="status-card">
              <p className="muted-text">Code d&apos;invitation</p>
              <h2 style={{ marginTop: '6px' }}>{team.inviteCode}</h2>
            </div>
            <div className="status-card">
              <p className="muted-text">Membres</p>
              <h2 style={{ marginTop: '6px' }}>
                {team.stats?.memberCount ?? team.members.length}
              </h2>
            </div>
            <div className="status-card">
              <p className="muted-text">Score moyen</p>
              <h2 style={{ marginTop: '6px' }}>{team.stats?.averageScore ?? 0}</h2>
            </div>
            <div className="status-card">
              <p className="muted-text">Meilleur joueur</p>
              <h2 style={{ marginTop: '6px' }}>
                {team.stats?.bestPlayer
                  ? `${team.stats.bestPlayer.username} (${team.stats.bestPlayer.score})`
                  : '—'}
              </h2>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading" style={{ marginBottom: '16px' }}>
            <h2>Roster</h2>
            <p className="section-copy">Les membres de l&apos;équipe et leurs rôles.</p>
          </div>

          {team.members.length === 0 && (
            <div className="empty-box">Aucun membre dans cette équipe.</div>
          )}

          <ul className="member-list">
            {team.members.map((member) => (
              <li key={member.id} className="member-item">
                {member.username ? (
                  <Link href={`/players/${member.username}`} className="nav-link">
                    <strong>{member.username}</strong>
                  </Link>
                ) : (
                  <strong>{member.id}</strong>
                )}
                <div className="muted-text">{member.role}</div>
              </li>
            ))}
          </ul>

          <div className="button-row" style={{ marginTop: '20px' }}>
            <Link href={`/messages/teams/${team.id}`} className="primary-button">
              Ouvrir le chat d&apos;équipe
            </Link>
            <button onClick={() => navigate('/teams')} className="ghost-button">
              Retour aux équipes
            </button>
            <button
              onClick={handleLeave}
              className="ghost-button"
              disabled={leaving}
              style={{ color: '#F04747', borderColor: '#F04747' }}
            >
              {leaving ? 'Sortie…' : "Quitter l'équipe"}
            </button>
          </div>
          <p className="muted-text" style={{ marginTop: '10px', fontSize: '0.8125rem' }}>
            Le chat d&apos;équipe est disponible dans l&apos;espace Messages. Si le
            capitaine quitte, le membre le plus ancien devient capitaine.
          </p>
        </section>
      </main>
    </div>
  )
}
