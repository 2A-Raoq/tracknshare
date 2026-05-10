import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import type { AxiosError } from 'axios'
import { friendsApi } from '../services/friends.api'
import type { FriendRequestItem, FriendRequestsData, FriendUser } from '../types/friends'

type ApiErrorPayload = {
  message?: string
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendRequestsData>({ incoming: [], outgoing: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadData() {
    const [friendsData, requestsData] = await Promise.all([
      friendsApi.getFriends(),
      friendsApi.getFriendRequests(),
    ])
    setFriends(friendsData)
    setRequests(requestsData)
  }

  function formatApiError(err: unknown) {
    const apiError = err as AxiosError<ApiErrorPayload>
    const status = apiError.response?.status
    const message = apiError.response?.data?.message

    if (status || message) {
      return `Impossible de charger vos amis et demandes en cours. ${
        status ? `HTTP ${status}. ` : ''
      }${message ?? ''}`.trim()
    }

    if (err instanceof Error && err.message) {
      return `Impossible de charger vos amis et demandes en cours. ${err.message}`
    }

    return 'Impossible de charger vos amis et demandes en cours.'
  }

  useEffect(() => {
    loadData()
      .catch((err) => setError(formatApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  async function runAction(actionId: string, action: () => Promise<unknown>) {
    setBusyId(actionId)
    setActionError('')
    try {
      await action()
      await loadData()
    } catch {
      setActionError("L'action sur cette relation n'a pas pu être effectuée.")
    } finally {
      setBusyId(null)
    }
  }

  function renderRequestCard(item: FriendRequestItem, type: 'incoming' | 'outgoing') {
    const username = item.user?.username ?? 'Utilisateur inconnu'

    return (
      <article key={item.id} className="team-card">
        <div className="panel-header">
          <div>
            <p className="muted-text">
              {type === 'incoming' ? 'Demande reçue' : 'Demande envoyée'}
            </p>
            <h2>
              {item.user?.username ? (
                <Link href={`/players/${item.user.username}`} className="nav-link">
                  {username}
                </Link>
              ) : (
                username
              )}
            </h2>
          </div>
          <div className="pill">{new Date(item.createdAt).toLocaleDateString()}</div>
        </div>

        <div className="button-row">
          {type === 'incoming' ? (
            <>
              <button
                onClick={() => runAction(item.id, () => friendsApi.acceptFriendRequest(item.id))}
                className="primary-button"
                disabled={busyId === item.id}
              >
                {busyId === item.id ? 'Traitement...' : 'Accepter'}
              </button>
              <button
                onClick={() => runAction(item.id, () => friendsApi.refuseFriendRequest(item.id))}
                className="ghost-button"
                disabled={busyId === item.id}
              >
                Refuser
              </button>
            </>
          ) : (
            <button
              onClick={() => runAction(item.id, () => friendsApi.cancelFriendRequest(item.id))}
              className="ghost-button"
              disabled={busyId === item.id}
            >
              {busyId === item.id ? 'Annulation...' : 'Annuler'}
            </button>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-badge" />
          <span>Track N&apos; Share</span>
        </Link>
        <div className="nav-actions">
          <Link href="/dashboard" className="ghost-button">Dashboard</Link>
          <Link href="/messages" className="ghost-button">Messages</Link>
          <Link href="/teams" className="secondary-button">Teams</Link>
        </div>
      </div>

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Social MVP</p>
              <h1 className="page-title">Amis</h1>
              <p className="section-copy">
                Gérez vos amis, vos demandes reçues et vos demandes envoyées sans quitter le MVP.
              </p>
            </div>
          </div>
        </section>

        {loading && <p className="status-message">Chargement des amis...</p>}
        {error && <p className="status-message error">{error}</p>}
        {actionError && <p className="status-message error">{actionError}</p>}

        {!loading && !error && (
          <section className="split-grid">
            <article className="panel">
              <div className="section-heading" style={{ marginBottom: '16px' }}>
                <h2>Mes amis</h2>
                <p className="section-copy">
                  Joueurs avec lesquels une relation d&apos;amitié a déjà été acceptée.
                </p>
              </div>

              {friends.length === 0 && (
                <div className="empty-box">Aucun ami pour le moment.</div>
              )}

              <div className="section-stack">
                {friends.map((friend) => (
                  <article key={friend.id} className="team-card">
                    <div className="panel-header">
                      <div>
                        <p className="muted-text">Joueur</p>
                        <h2>
                          <Link href={`/players/${friend.username}`} className="nav-link">
                            {friend.username}
                          </Link>
                        </h2>
                      </div>
                      <div className="pill connected">Ami</div>
                    </div>
                    <div className="button-row">
                      <Link href={`/players/${friend.username}`} className="ghost-button">
                        Voir profil
                      </Link>
                      <button
                        onClick={() => runAction(friend.id, () => friendsApi.removeFriend(friend.id))}
                        className="ghost-button"
                        disabled={busyId === friend.id}
                      >
                        {busyId === friend.id ? 'Suppression...' : 'Retirer'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="section-heading" style={{ marginBottom: '16px' }}>
                <h2>Demandes reçues</h2>
                <p className="section-copy">
                  Acceptez ou refusez les demandes reçues sur votre compte.
                </p>
              </div>

              {requests.incoming.length === 0 && (
                <div className="empty-box">Aucune demande reçue.</div>
              )}

              <div className="section-stack">
                {requests.incoming.map((item) => renderRequestCard(item, 'incoming'))}
              </div>
            </article>

            <article className="panel">
              <div className="section-heading" style={{ marginBottom: '16px' }}>
                <h2>Demandes envoyées</h2>
                <p className="section-copy">
                  Suivez les invitations que vous avez déjà envoyées à d&apos;autres joueurs.
                </p>
              </div>

              {requests.outgoing.length === 0 && (
                <div className="empty-box">Aucune demande envoyée.</div>
              )}

              <div className="section-stack">
                {requests.outgoing.map((item) => renderRequestCard(item, 'outgoing'))}
              </div>
            </article>
          </section>
        )}

        {!loading
          && !error
          && friends.length === 0
          && (Array.isArray(requests.incoming) ? requests.incoming : []).length === 0
          && (Array.isArray(requests.outgoing) ? requests.outgoing : []).length === 0 && (
            <div className="empty-box">
              Aucun ami ni aucune demande en cours pour le moment.
            </div>
          )}
      </main>
    </div>
  )
}
