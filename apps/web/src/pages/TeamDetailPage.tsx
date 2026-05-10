import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'wouter'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { authStore } from '../store/auth.store'
import { teamsApi } from '../services/teams.api'
import { createTeamSocket } from '../lib/socket'
import type { TeamDetail, ChatMessage } from '../types/teams'
import AppNavigation from '../components/AppNavigation'

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [, navigate] = useLocation()
  const { token } = useSnapshot(authStore)
  const effectiveToken = token ?? localStorage.getItem('access_token')

  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState('')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [msgsLoading, setMsgsLoading] = useState(true)
  const [msgsError, setMsgsError] = useState('')
  const [sendError, setSendError] = useState('')

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [socketReady, setSocketReady] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!teamId) {
      setTeamError('Identifiant d’équipe manquant.')
      setTeamLoading(false)
      setMsgsLoading(false)
      return
    }

    teamsApi
      .getTeam(teamId)
      .then(setTeam)
      .catch(() => setTeamError('Équipe introuvable ou accès refusé.'))
      .finally(() => setTeamLoading(false))

    teamsApi
      .getMessages(teamId)
      .then(setMessages)
      .catch(() => setMsgsError('Impossible de charger le chat de l’équipe.'))
      .finally(() => setMsgsLoading(false))
  }, [teamId])

  useEffect(() => {
    if (!teamId || !effectiveToken) {
      return
    }

    const socket = createTeamSocket(effectiveToken)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('team:join', { teamId })
      setSocketReady(true)
    })

    socket.on('team:message:new', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
      setSendError('')
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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const content = input.trim()

    if (!content || !teamId) {
      return
    }

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

  if (teamLoading) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <p className="status-message">Chargement de l&apos;équipe...</p>
      </div>
    )
  }

  if (teamError) {
    return (
      <div className="page-shell">
        <AppNavigation />
        <div className="status-message error">{teamError}</div>
        <div className="button-row" style={{ marginTop: '16px' }}>
          <button onClick={() => navigate('/teams')} className="ghost-button">Retour aux équipes</button>
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
            <div className={socketReady ? 'pill connected' : 'pill'}>
              <span className="pill-dot" />
              {socketReady ? 'Chat connecté' : 'Chat hors ligne'}
            </div>
          </div>

          <div className="mobile-stack">
            <div className="status-card">
              <p className="muted-text">Code d&apos;invitation</p>
              <h2 style={{ marginTop: '6px' }}>{team.inviteCode}</h2>
            </div>
            <div className="status-card">
              <p className="muted-text">Membres</p>
              <h2 style={{ marginTop: '6px' }}>{team.members.length}</h2>
            </div>
          </div>
        </section>

        <section className="split-grid">
          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Roster</h2>
              <p className="section-copy">Les membres d&apos;équipe et leurs rôles MVP.</p>
            </div>
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
          </article>

          <article className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Chat d&apos;équipe</h2>
              <p className="section-copy">
                Socket prioritaire, envoi REST en fallback si la connexion live tombe.
              </p>
            </div>

            {msgsLoading && <p className="status-message">Chargement des messages...</p>}
            {msgsError && <p className="status-message error">{msgsError}</p>}

            {!msgsLoading && !msgsError && messages.length === 0 && (
              <div className="empty-box">Aucun message. Soyez le premier à écrire.</div>
            )}

            <div className="message-feed">
              <ul className="message-list">
                {messages.map((message) => (
                  <li key={message.id} className="message-item">
                    <div className="message-meta">
                      <strong>{message.sender.username ?? 'Inconnu'}</strong>
                      <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div>{message.content}</div>
                  </li>
                ))}
              </ul>
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="form-stack" style={{ marginTop: '16px' }}>
              <div className="field">
                <label htmlFor="chat-message">Message</label>
                <textarea
                  id="chat-message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Votre message d'équipe..."
                  maxLength={1000}
                />
              </div>
              {sendError && <p className="status-message error">{sendError}</p>}
              <button type="submit" className="primary-button" disabled={sending || !input.trim()}>
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </article>
        </section>
      </main>
    </div>
  )
}
