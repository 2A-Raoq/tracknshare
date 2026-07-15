import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { friendsApi } from '../services/friends.api'
import { messagesApi } from '../services/messages.api'
import { playersApi } from '../services/players.api'
import type { FriendRequestsData, FriendUser } from '../types/friends'
import type { PublicPlayerProfile } from '../types/players'
import AppNavigation from '../components/AppNavigation'
import AchievementCard from '../components/AchievementCard'
import SteamConnectionCard from '../components/SteamConnectionCard'

type ApiError = {
  response?: {
    status?: number
  }
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [, navigate] = useLocation()
  const { user } = useSnapshot(authStore)

  const [profile, setProfile] = useState<PublicPlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [friendData, setFriendData] = useState<{
    friends: FriendUser[]
    requests: FriendRequestsData
  } | null>(null)
  const [friendActionLoading, setFriendActionLoading] = useState(false)
  const [friendActionError, setFriendActionError] = useState('')
  const [friendActionSuccess, setFriendActionSuccess] = useState('')
  const [startingConversation, setStartingConversation] = useState(false)
  const [messageError, setMessageError] = useState('')

  const pageError = username ? error : 'Pseudo joueur manquant.'
  const isLoading = Boolean(username) && loading
  const needsFriendState = Boolean(user && profile && user.id !== profile.id)
  const friends = needsFriendState && friendData ? friendData.friends : []
  const requests: FriendRequestsData =
    needsFriendState && friendData ? friendData.requests : { incoming: [], outgoing: [] }
  const friendStateLoading = needsFriendState && friendData === null

  useEffect(() => {
    if (!username) {
      return
    }

    playersApi
      .getPublicProfile(username)
      .then(setProfile)
      .catch((err: ApiError) => {
        setProfile(null)
        setError(
          err.response?.status === 404
            ? 'Joueur introuvable.'
            : 'Impossible de charger ce profil.',
        )
      })
      .finally(() => setLoading(false))
  }, [username])

  useEffect(() => {
    if (!user || !profile || user.id === profile.id) {
      return
    }

    Promise.all([friendsApi.getFriends(), friendsApi.getFriendRequests()])
      .then(([friendsData, requestsData]) => {
        setFriendData({ friends: friendsData, requests: requestsData })
      })
      .catch(() => {
        setFriendData({ friends: [], requests: { incoming: [], outgoing: [] } })
        setFriendActionError("Impossible de charger l'état d'amitié pour ce profil.")
      })
  }, [user, profile])

  async function refreshFriendState() {
    if (!user || !profile || user.id === profile.id) {
      return
    }

    const [friendsData, requestsData] = await Promise.all([
      friendsApi.getFriends(),
      friendsApi.getFriendRequests(),
    ])

    setFriendData({ friends: friendsData, requests: requestsData })
  }

  async function runFriendAction(
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setFriendActionLoading(true)
    setFriendActionError('')
    setFriendActionSuccess('')
    try {
      await action()
      await refreshFriendState()
      setFriendActionSuccess(successMessage)
    } catch {
      setFriendActionError("L'action d'amitié n'a pas pu être effectuée.")
    } finally {
      setFriendActionLoading(false)
    }
  }

  async function handlePrivateMessage() {
    if (!profile) {
      return
    }

    if (!user) {
      navigate('/login')
      return
    }

    setStartingConversation(true)
    setMessageError('')

    try {
      const conversation = await messagesApi.createConversation(profile.id)
      navigate(`/messages/${conversation.id}`)
    } catch {
      setMessageError("Impossible d'ouvrir une conversation privée avec ce joueur.")
    } finally {
      setStartingConversation(false)
    }
  }

  const isOwnProfile = user?.username === profile?.username
  const bio = profile?.bio ?? "Ce joueur n’a pas encore ajouté de bio publique."
  const isFriend = profile ? friends.some((item) => item.id === profile.id) : false
  const incomingRequest = profile
    ? requests.incoming.find((item) => item.user.id === profile.id) ?? null
    : null
  const outgoingRequest = profile
    ? requests.outgoing.find((item) => item.user.id === profile.id) ?? null
    : null

  function renderRelationshipActions() {
    if (!profile) {
      return null
    }

    if (!user) {
      return (
        <div className="button-row">
          <button onClick={() => navigate('/login')} className="primary-button">
            Se connecter pour ajouter
          </button>
        </div>
      )
    }

    if (isOwnProfile) {
      return <div className="pill connected">C&apos;est votre profil</div>
    }

    if (friendStateLoading) {
      return <div className="pill">Chargement relation...</div>
    }

    if (isFriend) {
      return (
        <>
          <div className="pill connected">Ami</div>
          <button
            onClick={handlePrivateMessage}
            className="primary-button"
            disabled={startingConversation}
          >
            {startingConversation ? 'Ouverture...' : 'Message privé'}
          </button>
        </>
      )
    }

    if (incomingRequest) {
      return (
        <>
          <button
            onClick={() =>
              runFriendAction(
                () => friendsApi.acceptFriendRequest(incomingRequest.id),
                'Demande acceptée. Vous êtes maintenant amis.',
              )
            }
            className="primary-button"
            disabled={friendActionLoading}
          >
            {friendActionLoading ? 'Traitement...' : 'Accepter'}
          </button>
          <button
            onClick={() =>
              runFriendAction(
                () => friendsApi.refuseFriendRequest(incomingRequest.id),
                'Demande refusée.',
              )
            }
            className="ghost-button"
            disabled={friendActionLoading}
          >
            Refuser
          </button>
        </>
      )
    }

    if (outgoingRequest) {
      return (
        <>
          <div className="pill">Demande envoyée</div>
          <button
            onClick={() =>
              runFriendAction(
                () => friendsApi.cancelFriendRequest(outgoingRequest.id),
                'Demande annulée.',
              )
            }
            className="ghost-button"
            disabled={friendActionLoading}
          >
            {friendActionLoading ? 'Annulation...' : 'Annuler'}
          </button>
        </>
      )
    }

    return (
      <button
        onClick={() =>
          runFriendAction(
            () => friendsApi.createFriendRequest(profile.id),
            'Demande envoyée.',
          )
        }
        className="primary-button"
        disabled={friendActionLoading}
      >
        {friendActionLoading ? 'Envoi...' : 'Ajouter en ami'}
      </button>
    )
  }


  return (
    <div className="page-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Profil public</p>
              <h1 className="page-title">Profil joueur</h1>
              <p className="section-copy">
                Vue publique du joueur, de ses stats principales, de son rang et de ses équipes.
              </p>
            </div>
            <div className="button-row">
              <button onClick={() => navigate('/leaderboard')} className="ghost-button">
                Retour au leaderboard
              </button>
            </div>
          </div>
        </section>

        {isLoading && <p className="status-message">Chargement du profil joueur...</p>}
        {pageError && <p className="status-message error">{pageError}</p>}

        {!isLoading && !pageError && !profile && (
          <div className="empty-box">Aucun profil joueur à afficher.</div>
        )}

        {profile && !isLoading && !pageError && (
          <>
            <section className="split-grid">
              <article className="panel">
                <div className="panel-header">
                  <div>
                    <p className="muted-text">Pseudo public</p>
                    <h2>{profile.username}</h2>
                  </div>
                  <div className="status-card profile-avatar-card">
                    <strong>AV</strong>
                  </div>
                </div>
                <p className="section-copy section-copy--spaced">{bio}</p>

                <div className="mobile-stack mobile-stack--spaced">
                  <div className="status-card">
                    <p className="muted-text">Score</p>
                    <h2 style={{ marginTop: '6px' }}>{profile.stats?.score ?? 'N/A'}</h2>
                  </div>
                  <div className="status-card">
                    <p className="muted-text">Rang</p>
                    <h2 style={{ marginTop: '6px' }}>
                      {profile.leaderboardRank ? `#${profile.leaderboardRank}` : 'Non classé'}
                    </h2>
                  </div>
                </div>

                <div className="button-row button-row--spaced">
                  {renderRelationshipActions()}
                  <Link href="/leaderboard" className="ghost-button">Voir leaderboard</Link>
                </div>

                {!isOwnProfile && user && (
                  <p className="muted-text" style={{ marginTop: '12px' }}>
                    {friendStateLoading
                      ? 'Chargement de la relation...'
                      : isFriend
                        ? 'Vous êtes déjà amis.'
                        : incomingRequest
                          ? 'Cette personne vous a envoyé une demande.'
                          : outgoingRequest
                            ? 'Vous avez déjà envoyé une demande à ce joueur.'
                            : "Aucun lien d’amitié pour le moment."}
                  </p>
                )}
                {friendActionError && (
                  <p className="status-message error" style={{ marginTop: '16px' }}>
                    {friendActionError}
                  </p>
                )}
                {friendActionSuccess && (
                  <p className="status-message" style={{ marginTop: '16px' }}>
                    {friendActionSuccess}
                  </p>
                )}
                {messageError && (
                  <p className="status-message error" style={{ marginTop: '16px' }}>
                    {messageError}
                  </p>
                )}
              </article>

              <article className="panel">
                <div className="section-heading" style={{ marginBottom: '16px' }}>
                  <h2>Infos publiques</h2>
                  <p className="section-copy">
                    Données publiques visibles sans information privée.
                  </p>
                </div>
                <ul className="metric-list">
                  <li className="metric-row">
                    Jeu principal : {profile.primaryGame?.name ?? 'Non renseigné'}
                  </li>
                  <li className="metric-row">
                    Saison active : {profile.activeSeason?.name ?? 'Non renseignée'}
                  </li>
                  <li className="metric-row">
                    Membre depuis : {new Date(profile.memberSince).toLocaleDateString()}
                  </li>
                </ul>
              </article>
            </section>

            <section className="split-grid">
              {isOwnProfile && (
                <article className="panel">
                  <SteamConnectionCard
                    title="Synchronisation"
                    description="Gérez votre connexion Steam et vos jeux suivis depuis votre profil joueur."
                  />
                </article>
              )}

              <article className="panel">
                <div className="section-heading" style={{ marginBottom: '16px' }}>
                  <h2>Stats principales</h2>
                  <p className="section-copy">
                    Le score et les ratios restent calculés côté back-end.
                  </p>
                </div>

                {!profile.stats && (
                  <div className="empty-box">Aucune statistique disponible.</div>
                )}

                {profile.stats && (
                  <ul className="metric-list">
                    <li className="metric-row">K/D : {profile.stats.kdRatio.toFixed(2)}</li>
                    <li className="metric-row">Winrate : {profile.stats.winrate}%</li>
                    <li className="metric-row">Parties jouées : {profile.stats.matchesPlayed}</li>
                    <li className="metric-row">Wins / Losses : {profile.stats.wins} / {profile.stats.losses}</li>
                    <li className="metric-row">Kills / Deaths : {profile.stats.kills} / {profile.stats.deaths}</li>
                  </ul>
                )}
              </article>

              <article className="panel">
                <div className="section-heading" style={{ marginBottom: '16px' }}>
                  <h2>Équipes</h2>
                  <p className="section-copy">
                    Équipes actuellement associées à ce joueur.
                  </p>
                </div>

                {profile.teams.length === 0 && (
                  <div className="empty-box">Aucune équipe.</div>
                )}

                <div className="section-stack">
                  {profile.teams.map((team) => (
                    <article key={team.id} className="team-card">
                      <div className="panel-header">
                        <div>
                          <p className="muted-text">[{team.tag}]</p>
                          <h2>{team.name}</h2>
                        </div>
                        <div className="pill">{team.role}</div>
                      </div>
                      {user ? (
                        <Link href={`/teams/${team.id}`} className="ghost-button">
                          Ouvrir l&apos;équipe
                        </Link>
                      ) : (
                        <Link href="/login" className="ghost-button">
                          Se connecter pour voir l&apos;équipe
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              </article>
            </section>

            <section className="panel">
              <div className="section-heading" style={{ marginBottom: '16px' }}>
                <h2>Badges</h2>
                <p className="section-copy">
                  Badges débloqués publiquement par ce joueur.
                </p>
              </div>

              {(() => {
                const badges = Array.isArray(profile.badges) ? profile.badges : []
                return badges.length === 0 ? (
                  <div className="empty-box">Aucun badge débloqué.</div>
                ) : (
                  <div className="stats-grid">
                    {badges.map((badge) => (
                      <AchievementCard key={badge.code} achievement={badge} variant="public" />
                    ))}
                  </div>
                )
              })()}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
