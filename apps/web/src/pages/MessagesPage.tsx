import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { messagesApi } from '../services/messages.api'
import type { ConversationPeer, ConversationSummary } from '../types/messages'
import AppNavigation from '../components/AppNavigation'

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function MessagesPage() {
  const [, navigate] = useLocation()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [results, setResults] = useState<ConversationPeer[]>([])
  const [startingId, setStartingId] = useState<string | null>(null)

  useEffect(() => {
    messagesApi
      .getConversations()
      .then(setConversations)
      .catch(() => setError('Impossible de charger vos conversations privées.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setHasSearched(true)
    setSearchError('')
    setSearching(true)
    try {
      const users = await messagesApi.searchUsers(query.trim())
      setResults(users)
    } catch {
      setSearchError('Impossible de rechercher des utilisateurs.')
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  async function handleStartConversation(recipientId: string) {
    setStartingId(recipientId)
    setSearchError('')
    try {
      const conversation = await messagesApi.createConversation(recipientId)
      setConversations((prev) => {
        const exists = prev.some((item) => item.id === conversation.id)
        if (exists) {
          return prev.map((item) => (item.id === conversation.id ? conversation : item))
        }
        return [conversation, ...prev]
      })
      navigate(`/messages/${conversation.id}`)
    } catch (err) {
      const apiError = err as ApiError
      setSearchError(
        apiError.response?.data?.message === 'CONVERSATION_RECIPIENT_INVALID'
          ? 'Destinataire invalide.'
          : 'Impossible de démarrer cette conversation.',
      )
    } finally {
      setStartingId(null)
    }
  }

  return (
    <div className="page-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="hero-kicker">Direct messages</p>
              <h1 className="page-title">Messages privés</h1>
              <p className="section-copy">
                Démarrez une conversation 1-to-1 et ouvrez-la sans quitter le parcours MVP.
              </p>
            </div>
          </div>
        </section>

        <section className="split-grid">
          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Mes conversations</h2>
              <p className="section-copy">
                Dernier message, participant principal et accès direct à l&apos;historique.
              </p>
            </div>

            {loading && <p className="status-message">Chargement des conversations...</p>}
            {error && <p className="status-message error">{error}</p>}

            {!loading && !error && conversations.length === 0 && (
              <div className="empty-box">Aucune conversation privée pour le moment.</div>
            )}

            <div className="section-stack">
              {conversations.map((conversation) => (
                <article key={conversation.id} className="team-card">
                  <div className="panel-header">
                    <div>
                      <p className="muted-text">Participant</p>
                      <h2>
                        {conversation.participant?.username ? (
                          <Link
                            href={`/players/${conversation.participant.username}`}
                            className="nav-link"
                          >
                            {conversation.participant.username}
                          </Link>
                        ) : (
                          'Utilisateur inconnu'
                        )}
                      </h2>
                    </div>
                    <div className="pill">
                      {new Date(
                        conversation.lastMessage?.createdAt ?? conversation.updatedAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="muted-text" style={{ marginBottom: '16px' }}>
                    {conversation.lastMessage?.content ?? 'Aucun message pour le moment.'}
                  </p>
                  <button
                    onClick={() => navigate(`/messages/${conversation.id}`)}
                    className="primary-button"
                  >
                    Ouvrir
                  </button>
                </article>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Démarrer une conversation</h2>
              <p className="section-copy">
                Recherchez un joueur par pseudo puis ouvrez un canal privé direct.
              </p>
            </div>

            <form onSubmit={handleSearch} className="form-stack">
              <div className="field">
                <label htmlFor="message-search">Pseudo</label>
                <input
                  id="message-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ClutchMaster"
                  required
                />
              </div>
              <button type="submit" className="secondary-button" disabled={searching}>
                {searching ? 'Recherche...' : 'Rechercher'}
              </button>
            </form>

            {searchError && <p className="status-message error" style={{ marginTop: '16px' }}>{searchError}</p>}

            {!searching && hasSearched && results.length === 0 && !searchError && (
              <div className="empty-box" style={{ marginTop: '16px' }}>
                Aucun utilisateur trouvé pour cette recherche.
              </div>
            )}

            <div className="section-stack" style={{ marginTop: '16px' }}>
              {results.map((user) => (
                <article key={user.id} className="status-card">
                  <div className="panel-header">
                    <div>
                      <p className="muted-text">Pseudo trouvé</p>
                      <h2>
                        {user.username ? (
                          <Link href={`/players/${user.username}`} className="nav-link">
                            {user.username}
                          </Link>
                        ) : (
                          'Utilisateur'
                        )}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartConversation(user.id)}
                    className="primary-button"
                    disabled={startingId === user.id}
                  >
                    {startingId === user.id ? 'Ouverture...' : 'Démarrer'}
                  </button>
                </article>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
