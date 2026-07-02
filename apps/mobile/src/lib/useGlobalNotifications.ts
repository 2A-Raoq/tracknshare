import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { createAuthenticatedSocket } from '@/lib/socket'
import { authStore } from '@/store/auth'
import { notificationStore, pushNotification } from '@/store/notifications'
import { messagesApi } from '@/services/messages.api'
import { teamsApi } from '@/services/teams.api'
import type { ChatMessage, PrivateMessageItem } from '@/types'

/**
 * Écoute globale des messages entrants pour la bannière in-app.
 *
 * Le back n'émet que dans les rooms `conversation:*` / `team:*` (pas de room
 * personnelle par utilisateur). On ouvre donc un socket global qui rejoint
 * toutes les conversations + équipes de l'utilisateur au démarrage, puis on
 * déclenche une bannière à chaque message qui n'est pas de nous et qui ne
 * concerne pas le fil déjà ouvert à l'écran.
 */
export function useGlobalNotifications() {
  const { token, user } = useSnapshot(authStore)
  const userId = user?.id

  useEffect(() => {
    if (!token || !userId) return
    let cancelled = false
    const socket = createAuthenticatedSocket(token)

    // Rejoindre toutes les rooms de l'utilisateur pour recevoir ses messages.
    void (async () => {
      const [convos, teams] = await Promise.all([
        messagesApi.getConversations().catch(() => []),
        teamsApi.mine().catch(() => []),
      ])
      if (cancelled) return
      convos.forEach((c) =>
        socket.emit('conversation:join', { conversationId: c.id }),
      )
      teams.forEach((t) => socket.emit('team:join', { teamId: t.id }))
    })()

    socket.on('private:message:new', (msg: PrivateMessageItem) => {
      if (msg.sender.id === userId) return
      if (notificationStore.activeThread === msg.conversationId) return
      pushNotification({
        title: msg.sender.username ?? 'Nouveau message',
        body: msg.content,
        kind: 'private',
        threadId: msg.conversationId,
      })
    })

    socket.on('team:message:new', (msg: ChatMessage) => {
      if (msg.sender.id === userId) return
      if (notificationStore.activeThread === msg.teamId) return
      pushNotification({
        title: `${msg.sender.username ?? 'Coéquipier'} · équipe`,
        body: msg.content,
        kind: 'team',
        threadId: msg.teamId,
      })
    })

    return () => {
      cancelled = true
      socket.disconnect()
    }
  }, [token, userId])
}
