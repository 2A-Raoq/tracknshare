import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { authStore } from '../store/auth.store'
import { messagesApi } from '../services/messages.api'
import { createPrivateSocket } from '../lib/socket'
import type { ConversationSummary, PrivateMessageItem } from '../types/messages'
import AppNavigation from '../components/AppNavigation'
import MessagesSidebar from '../components/MessagesSidebar'
import AvatarInitial from '../components/AvatarInitial'

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
    if (!conversationId) return

    const content = input.trim()
    if (!content) return

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

  const peer = conversation?.participant?.username ?? null

  return (
    <div className="page-shell dc-page-shell">
      <AppNavigation />
      <div className="dc-layout dc-layout--chat-active">
        <MessagesSidebar activeConversationId={conversationId} />

        <div className="dc-chat">
          <div className="dc-chat__header">
            <button
              className="dc-back-btn"
              onClick={() => navigate('/messages')}
              aria-label="Retour aux messages"
            >
              ←
            </button>
            <AvatarInitial username={peer} size={32} />
            <span className="dc-chat__peer">
              {peer ? (
                <Link href={`/players/${peer}`} className="nav-link">
                  {peer}
                </Link>
              ) : (
                'Conversation privée'
              )}
            </span>
            <span className={socketReady ? 'pill connected dc-pill' : 'pill dc-pill'}>
              {socketReady ? 'Socket actif' : 'Fallback REST'}
            </span>
          </div>

          <div className="dc-chat__feed">
            {loading && <p className="dc-chat__status">Chargement...</p>}
            {error && <p className="dc-chat__status dc-chat__status--error">{error}</p>}
            {!loading && !error && messages.length === 0 && (
              <p className="dc-chat__status">Aucun message pour le moment.</p>
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
                        {message.sender.username ?? 'Utilisateur'}
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
                placeholder={`Message ${peer ? `@${peer}` : 'privé'}…`}
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
