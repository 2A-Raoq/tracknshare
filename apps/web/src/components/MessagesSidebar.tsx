import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { messagesApi } from '../services/messages.api'
import { teamsApi } from '../services/teams.api'
import type { ConversationSummary, ConversationPeer } from '../types/messages'
import type { TeamSummary } from '../types/teams'
import AvatarInitial from './AvatarInitial'

interface Props {
  activeConversationId?: string
  activeTeamId?: string
}

type ApiError = {
  response?: { data?: { message?: string } }
}

export default function MessagesSidebar({ activeConversationId, activeTeamId }: Props) {
  const [, navigate] = useLocation()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [results, setResults] = useState<ConversationPeer[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [startingId, setStartingId] = useState<string | null>(null)

  useEffect(() => {
    messagesApi.getConversations().then(setConversations).catch(() => {})
    teamsApi.getMyTeams().then(setTeams).catch(() => {})
  }, [])

  function toggleSearch() {
    setSearchOpen((prev) => !prev)
    setResults([])
    setQuery('')
    setSearchError('')
    setHasSearched(false)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchError('')
    setSearching(true)
    setHasSearched(true)
    try {
      const users = await messagesApi.searchUsers(query.trim())
      setResults(users)
    } catch {
      setSearchError('Erreur de recherche.')
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  async function handleStart(recipientId: string) {
    setStartingId(recipientId)
    try {
      const conversation = await messagesApi.createConversation(recipientId)
      setConversations((prev) => {
        const exists = prev.some((item) => item.id === conversation.id)
        return exists
          ? prev.map((item) => (item.id === conversation.id ? conversation : item))
          : [conversation, ...prev]
      })
      toggleSearch()
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
    <aside className="dc-sidebar">
      <div className="dc-sidebar__head">
        <span className="dc-sidebar__title">Messages</span>
        <button
          className="dc-sidebar__new-btn"
          onClick={toggleSearch}
          title={searchOpen ? 'Fermer' : 'Nouvelle conversation'}
          aria-label={searchOpen ? 'Fermer la recherche' : 'Nouvelle conversation'}
        >
          {searchOpen ? '✕' : '+'}
        </button>
      </div>

      {searchOpen && (
        <div className="dc-sidebar__search">
          <form onSubmit={handleSearch}>
            <input
              className="dc-sidebar__search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pseudo du joueur..."
                autoFocus
            />
            <button type="submit" className="dc-sidebar__search-btn" disabled={searching}>
              {searching ? '…' : 'Go'}
            </button>
          </form>
          {searchError && <p className="dc-sidebar__error">{searchError}</p>}
          {hasSearched && !searching && results.length === 0 && !searchError && (
            <p className="dc-sidebar__empty">Aucun résultat.</p>
          )}
          {results.map((peer) => (
            <button
              key={peer.id}
              className="dc-sidebar__item"
              onClick={() => handleStart(peer.id)}
              disabled={startingId === peer.id}
            >
              <AvatarInitial username={peer.username} size={30} />
              <span className="dc-sidebar__item-name">
                {peer.username ?? 'Utilisateur'}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="dc-sidebar__section-label">PRIVÉS</p>
      {conversations.length === 0 && (
        <p className="dc-sidebar__empty">Aucune conversation.</p>
      )}
      {conversations.map((conv) => {
        const isActive = conv.id === activeConversationId
        return (
          <button
            key={conv.id}
            className={`dc-sidebar__item${isActive ? ' dc-sidebar__item--active' : ''}`}
            onClick={() => navigate(`/messages/${conv.id}`)}
          >
            <AvatarInitial username={conv.participant?.username} size={30} />
            <span className="dc-sidebar__item-name">
              {conv.participant?.username ?? 'Utilisateur inconnu'}
            </span>
          </button>
        )
      })}

      <p className="dc-sidebar__section-label">ÉQUIPES</p>
      {teams.length === 0 && (
        <p className="dc-sidebar__empty">Aucune équipe.</p>
      )}
      {teams.map((team) => {
        const isActiveTeam = team.id === activeTeamId
        return (
        <button
          key={team.id}
          className={`dc-sidebar__item${isActiveTeam ? ' dc-sidebar__item--active' : ''}`}
          onClick={() => navigate(`/messages/teams/${team.id}`)}
        >
          <div
            className="dc-avatar dc-avatar--team"
            style={{ width: 30, height: 30, fontSize: 11, background: '#5865F2' }}
            aria-hidden="true"
          >
            {team.tag.charAt(0).toUpperCase()}
          </div>
          <span className="dc-sidebar__item-name">{team.name}</span>
        </button>
        )
      })}
    </aside>
  )
}
