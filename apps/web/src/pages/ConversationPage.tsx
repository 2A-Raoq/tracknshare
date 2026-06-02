import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { authStore } from '../store/auth.store'
import { messagesApi } from '../services/messages.api'
import { createPrivateSocket } from '../lib/socket'
import type { ConversationSummary, PrivateMessageItem } from '../types/messages'
import { searchEmojis } from '../data/emojis'
import type { EmojiItem } from '../data/emojis'
import AppNavigation from '../components/AppNavigation'
import MessagesSidebar from '../components/MessagesSidebar'
import AvatarInitial from '../components/AvatarInitial'
import EmojiPicker from '../components/EmojiPicker'
import EmojiSuggestion from '../components/EmojiSuggestion'

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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [emojiSuggestions, setEmojiSuggestions] = useState<EmojiItem[]>([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCursorRef = useRef<number | null>(null)

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

  // Restore cursor position after React re-render
  useEffect(() => {
    if (pendingCursorRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(pendingCursorRef.current, pendingCursorRef.current)
      pendingCursorRef.current = null
    }
  })

  // Insert emoji at current cursor position
  const insertEmoji = useCallback((emoji: string) => {
    const el = inputRef.current
    const pos = el?.selectionStart ?? input.length
    const next = input.slice(0, pos) + emoji + input.slice(pos)
    setInput(next)
    pendingCursorRef.current = pos + emoji.length
    setPickerOpen(false)
    el?.focus()
  }, [input])

  // Detect :query pattern before cursor and update suggestions
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInput(value)

    const cursor = e.target.selectionStart ?? value.length
    const textBefore = value.slice(0, cursor)
    const match = textBefore.match(/:([a-z_]{1,20})$/)

    if (match) {
      const results = searchEmojis(match[1])
      setEmojiSuggestions(results)
      setSuggestionIndex(0)
    } else {
      setEmojiSuggestions([])
    }
  }

  // Replace :query with selected emoji
  const selectSuggestion = useCallback((emoji: string) => {
    const el = inputRef.current
    const cursor = el?.selectionStart ?? input.length
    const textBefore = input.slice(0, cursor)
    const match = textBefore.match(/:([a-z_]{1,20})$/)
    if (!match) return

    const start = cursor - match[0].length
    const next = input.slice(0, start) + emoji + input.slice(cursor)
    setInput(next)
    pendingCursorRef.current = start + emoji.length
    setEmojiSuggestions([])
    el?.focus()
  }, [input])

  // Keyboard navigation for suggestions
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (emojiSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSuggestionIndex((i) => Math.min(i + 1, emojiSuggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSuggestionIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectSuggestion(emojiSuggestions[suggestionIndex].emoji)
    } else if (e.key === 'Escape') {
      setEmojiSuggestions([])
    }
  }

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
            <div className="dc-chat__input-wrapper">
              {emojiSuggestions.length > 0 && (
                <EmojiSuggestion
                  suggestions={emojiSuggestions}
                  selectedIndex={suggestionIndex}
                  onSelect={selectSuggestion}
                />
              )}
              {pickerOpen && (
                <EmojiPicker
                  onSelect={insertEmoji}
                  onClose={() => setPickerOpen(false)}
                />
              )}
              <div className="dc-chat__input-row">
                <button
                  type="button"
                  className="dc-emoji-btn"
                  onClick={() => setPickerOpen((o) => !o)}
                  aria-label="Ouvrir le sélecteur d'émojis"
                  tabIndex={-1}
                >
                  😊
                </button>
                <input
                  ref={inputRef}
                  className="dc-chat__input"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
