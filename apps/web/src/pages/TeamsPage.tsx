import { useEffect, useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { teamsApi } from '../services/teams.api'
import type { TeamSummary } from '../types/teams'

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function TeamsPage() {
  const [, navigate] = useLocation()
  const { token, loading: authLoading } = useSnapshot(authStore)
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [createName, setCreateName] = useState('')
  const [createTag, setCreateTag] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joining, setJoining] = useState(false)
  const effectiveToken = token ?? localStorage.getItem('access_token')
  const safeTeams = Array.isArray(teams) ? teams : []

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!effectiveToken) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    teamsApi
      .getMyTeams()
      .then((data) => {
        setTeams(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setTeams([])
        setError('Impossible de charger vos équipes.')
      })
      .finally(() => setLoading(false))
  }, [authLoading, effectiveToken])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const team = await teamsApi.createTeam({
        name: createName.trim(),
        tag: createTag.trim(),
        description: createDesc.trim() || undefined,
      })
      setTeams((prev) => [
        ...prev,
        { id: team.id, name: team.name, tag: team.tag, role: team.role },
      ])
      setCreateName('')
      setCreateTag('')
      setCreateDesc('')
    } catch (err) {
      const apiError = err as ApiError
      const code = apiError.response?.data?.message
      setCreateError(
        code === 'TEAM_NAME_ALREADY_EXISTS'
          ? "Ce nom d'équipe est déjà pris."
          : 'Erreur lors de la création.',
      )
    } finally {
      setCreating(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setJoinError('')
    setJoining(true)
    try {
      const result = await teamsApi.joinTeam(joinCode.trim())
      const detail = await teamsApi.getTeam(result.teamId)
      setTeams((prev) => [
        ...prev,
        { id: detail.id, name: detail.name, tag: detail.tag, role: result.role },
      ])
      setJoinCode('')
    } catch (err) {
      const apiError = err as ApiError
      const code = apiError.response?.data?.message
      if (code === 'TEAM_ALREADY_MEMBER') {
        setJoinError('Vous êtes déjà membre de cette équipe.')
      } else if (code === 'TEAM_INVALID_INVITE_CODE') {
        setJoinError("Code d'invitation invalide.")
      } else {
        setJoinError('Erreur lors de la tentative de rejoindre.')
      }
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-badge" />
          <span>Track N&apos; Share</span>
        </Link>
        <div className="nav-actions">
          <button onClick={() => navigate('/dashboard')} className="ghost-button">Dashboard</button>
          <button onClick={() => navigate('/leaderboard')} className="secondary-button">Leaderboard</button>
        </div>
      </div>

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Teams</p>
              <h1 className="page-title">Mes équipes</h1>
              <p className="section-copy">
                Gérez votre roster, rejoignez une équipe via code et ouvrez rapidement le chat.
              </p>
            </div>
          </div>
        </section>

        {loading && <p className="status-message">Chargement des équipes...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && safeTeams.length === 0 && (
          <div className="empty-box">
            Vous n&apos;êtes dans aucune équipe. Créez-en une ou rejoignez-en une avec un code.
          </div>
        )}

        {safeTeams.length > 0 && (
          <section className="stats-grid">
            {safeTeams.map((team) => (
              <article key={team.id} className="team-card">
                <div className="panel-header">
                  <div>
                    <p className="muted-text">Tag {team.tag}</p>
                    <h2>{team.name}</h2>
                  </div>
                  <div className="pill">{team.role}</div>
                </div>
                <div className="button-row">
                  <button onClick={() => navigate(`/teams/${team.id}`)} className="primary-button">
                    Ouvrir
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="teams-grid">
          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Créer une équipe</h2>
              <p className="section-copy">
                Le créateur devient automatiquement capitaine.
              </p>
            </div>

            <form onSubmit={handleCreate} className="form-stack">
              <div className="field">
                <label htmlFor="team-name">Nom</label>
                <input
                  id="team-name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Track Masters"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
              <div className="field">
                <label htmlFor="team-tag">Tag</label>
                <input
                  id="team-tag"
                  value={createTag}
                  onChange={(e) => setCreateTag(e.target.value)}
                  placeholder="TMS"
                  required
                  minLength={2}
                  maxLength={10}
                />
              </div>
              <div className="field">
                <label htmlFor="team-description">Description</label>
                <textarea
                  id="team-description"
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="Notre équipe compétitive"
                  maxLength={255}
                />
              </div>
              {createError && <p className="status-message error">{createError}</p>}
              <button type="submit" className="primary-button" disabled={creating}>
                {creating ? 'Création...' : "Créer l'équipe"}
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Rejoindre une équipe</h2>
              <p className="section-copy">
                Entrez un code d&apos;invitation pour accéder au roster et au chat.
              </p>
            </div>

            <form onSubmit={handleJoin} className="form-stack">
              <div className="field">
                <label htmlFor="invite-code">Code d&apos;invitation</label>
                <input
                  id="invite-code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="DEMO0001"
                  required
                  minLength={6}
                  maxLength={20}
                />
              </div>
              {joinError && <p className="status-message error">{joinError}</p>}
              <button type="submit" className="secondary-button" disabled={joining}>
                {joining ? 'Recherche...' : 'Rejoindre'}
              </button>
            </form>
          </article>
        </section>
      </main>
    </div>
  )
}
