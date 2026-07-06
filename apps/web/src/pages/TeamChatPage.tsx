import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { authStore } from '../store/auth.store'
import { teamsApi } from '../services/teams.api'
import { createAuthenticatedSocket } from '../lib/socket'
import type { ChatMessage, TeamDetail } from '../types/teams'
import AppNavigation from '../components/AppNavigation'
import MessagesSidebar from '../components/MessagesSidebar'
import AvatarInitial from '../components/AvatarInitial'

export default function TeamChatPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [, navigate] = useLocation()
  const { token, user } = useSnapshot(authStore)
  const effectiveToken = token ?? localStorage.getItem('access_token')

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [socketReady, setSocketReady] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!teamId) {
      return
    }

    Promise.all([teamsApi.getTeam(teamId), teamsApi.getMessages(teamId)])
      .then(([teamData, msgs]) => {
        setTeam(teamData)
        setMessages(msgs)
      })
      .catch(() => setError("Équipe introuvable ou accès refusé."))
      .finally(() => setLoading(false))
  }, [teamId])

  useEffect(() => {
    if (!teamId || !effectiveToken) {
      return
    }

    const socket = createAuthenticatedSocket(effectiveToken)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('team:join', { teamId })
      setSocketReady(true)
    })

    socket.on('team:message:new', (message: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) {
          return prev
        }
        return [...prev, message]
      })
      setSendError('')
    })

    socket.on('error', (payload: { code?: string }) => {
      if (payload?.code === 'TEAM_MEMBER_REQUIRED') {
        setSendError("Accès refusé à ce chat d'équipe.")
      }
    })

    socket.on('disconnect', () => {
      setSocketReady(false)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [teamId, effectiveToken])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const pageError = teamId ? error : "Identifiant d'équipe manquant."
  const isLoading = Boolean(teamId) && loading

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!teamId) return

    const content = input.trim()
    if (!content) return

    setSending(true)
    setSendError('')

    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('team:message:send', { teamId, content })
        setInput('')
      } else {
        const message = await teamsApi.sendMessage(teamId, content)
        setMessages((prev) => [...prev, message])
        setInput('')
      }
    } catch {
      setSendError("Le message n'a pas pu être envoyé.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-shell dc-page-shell">
      <AppNavigation />
      <div className="dc-layout dc-layout--chat-active">
        <MessagesSidebar activeTeamId={teamId} />

        <div className="dc-chat">
          <div className="dc-chat__header">
            <button
              className="dc-back-btn"
              onClick={() => navigate('/messages')}
              aria-label="Retour aux messages"
            >
              ←
            </button>
            <div
              className="dc-avatar dc-avatar--team"
              style={{ width: 32, height: 32, fontSize: 12, background: '#5865F2' }}
              aria-hidden="true"
            >
              {team?.tag.charAt(0).toUpperCase() ?? '#'}
            </div>
            <span className="dc-chat__peer">
              {team ? `[${team.tag}] ${team.name}` : "Chat d'équipe"}
            </span>
            <span className={socketReady ? 'pill connected dc-pill' : 'pill dc-pill'}>
              {socketReady ? 'Socket actif' : 'Fallback REST'}
            </span>
          </div>

          <div className="dc-chat__feed">
            {isLoading && <p className="dc-chat__status">Chargement...</p>}
            {pageError && <p className="dc-chat__status dc-chat__status--error">{pageError}</p>}
            {!isLoading && !pageError && messages.length === 0 && (
              <p className="dc-chat__status">Aucun message. Soyez le premier à écrire.</p>
            )}
            {messages.map((message) => {
              const isOwn = message.sender.id === user?.id
              return (
                <div
                  key={message.id}
                  className={`dc-message${isOwn ? ' dc-message--own' : ''}`}
                >
                  <AvatarInitial username={message.sender.username} size={28} />
                  <div className="dc-message__body">
                    <div className="dc-message__meta">
                      <span className="dc-message__name">
                        {message.sender.username ?? 'Inconnu'}
                      </span>
                      <span className="dc-message__time">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="dc-message__content">{message.content}</p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          <form className="dc-chat__form" onSubmit={handleSend}>
            {sendError && <p className="dc-chat__send-error">{sendError}</p>}
            <div className="dc-chat__input-row">
              <input
                className="dc-chat__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${team ? `#${team.name}` : "d'équipe"}…`}
                maxLength={1000}
                disabled={sending}
                autoComplete="off"
              />
              <button
                type="submit"
                className="dc-chat__send-btn"
                disabled={sending || !input.trim()}
                aria-label="Envoyer"
              >
                {sending ? '…' : '↵'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
