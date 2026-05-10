import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { authStore } from '../store/auth.store'
import { messagesApi } from '../services/messages.api'
import { createPrivateSocket } from '../lib/socket'
import type { ConversationSummary, PrivateMessageItem } from '../types/messages'
import AppNavigation from '../components/AppNavigation'

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [, navigate] = useLocation()
  const { token, user } = useSnapshot(authStore)
  const effectiveToken = token ?? localStorage.getItem('access_token')

  const [conversation, setConversation] = useState<ConversationSummary | null>(null)
  const [messages, setMessages] = useState<PrivateMessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [socketReady, setSocketReady] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conversationId) {
      setError('Conversation introuvable.')
      setLoading(false)
      return
    }

    Promise.all([
      messagesApi.getConversations(),
      messagesApi.getConversationMessages(conversationId),
    ])
      .then(([conversations, detail]) => {
        setConversation(conversations.find((item) => item.id === conversationId) ?? null)
        setMessages(detail.items)
        void messagesApi.markAsRead(conversationId)
      })
      .catch(() => setError('Impossible de charger cette conversation privée.'))
      .finally(() => setLoading(false))
  }, [conversationId])

  useEffect(() => {
    if (!conversationId || !effectiveToken) {
      return
    }

    const socket = createPrivateSocket(effectiveToken)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('conversation:join', { conversationId })
      setSocketReady(true)
    })

    socket.on('private:message:new', (message: PrivateMessageItem) => {
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) {
          return prev
        }
        return [...prev, message]
      })
      setSendError('')
      void messagesApi.markAsRead(conversationId)
    })

    socket.on('error', (payload: { code?: string }) => {
      if (payload?.code === 'CONVERSATION_PARTICIPANT_REQUIRED') {
        setSendError('Accès refusé à cette conversation.')
      }
    })

    socket.on('disconnect', () => {
      setSocketReady(false)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [conversationId, effectiveToken])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!conversationId) {
      return
    }

    const content = input.trim()
    if (!content) {
      return
    }

    setSending(true)
    setSendError('')

    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('private:message:send', { conversationId, content })
        setInput('')
      } else {
        const message = await messagesApi.sendMessage(conversationId, content)
        setMessages((prev) => [...prev, message])
        setInput('')
      }
    } catch {
      setSendError("Le message privé n'a pas pu être envoyé.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <p className="status-message">Chargement de la conversation...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <p className="status-message error">{error}</p>
        <div className="button-row" style={{ marginTop: '16px' }}>
          <button onClick={() => navigate('/messages')} className="ghost-button">
            Retour aux messages
          </button>
        </div>
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
              <p className="hero-kicker">Private conversation</p>
              <h1 className="page-title">
                {conversation?.participant?.username ? (
                  <Link
                    href={`/players/${conversation.participant.username}`}
                    className="nav-link"
                  >
                    {conversation.participant.username}
                  </Link>
                ) : (
                  'Conversation privée'
                )}
              </h1>
              <p className="section-copy">
                Canal direct 1-to-1 avec fallback REST si le socket est indisponible.
              </p>
            </div>
            <div className={socketReady ? 'pill connected' : 'pill'}>
              <span className="pill-dot" />
              {socketReady ? 'Socket actif' : 'Fallback REST'}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading" style={{ marginBottom: '16px' }}>
            <h2>Historique</h2>
            <p className="section-copy">
              Les participants sont les seuls à pouvoir lire et envoyer des messages.
            </p>
          </div>

          {messages.length === 0 && (
            <div className="empty-box">Aucun message privé pour le moment.</div>
          )}

          <div className="message-feed">
            <ul className="message-list">
              {messages.map((message) => {
                const isOwnMessage = message.sender.id === user?.id

                return (
                  <li
                    key={message.id}
                    className="message-item"
                    style={{
                      background: isOwnMessage
                        ? 'rgba(124, 140, 255, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    <div className="message-meta">
                      {message.sender.username ? (
                        <Link href={`/players/${message.sender.username}`} className="nav-link">
                          <strong>{message.sender.username}</strong>
                        </Link>
                      ) : (
                        <strong>Utilisateur</strong>
                      )}
                      <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div>{message.content}</div>
                  </li>
                )
              })}
            </ul>
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="form-stack" style={{ marginTop: '16px' }}>
            <div className="field">
              <label htmlFor="private-message">Message</label>
              <textarea
                id="private-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre message privé..."
                maxLength={1000}
              />
            </div>
            {sendError && <p className="status-message error">{sendError}</p>}
            <button type="submit" className="primary-button" disabled={sending || !input.trim()}>
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
