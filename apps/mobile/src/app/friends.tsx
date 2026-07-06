import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Button, Card, ErrorState, ErrorText, Muted, Screen, TextField, Title } from '@/components/ui'
import { friendsApi } from '@/services/friends.api'
import { messagesApi } from '@/services/messages.api'
import type { ConversationPeer, FriendRequestsData, FriendUser } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function FriendsScreen() {
  const router = useRouter()
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendRequestsData>({ incoming: [], outgoing: [] })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ConversationPeer[]>([])

  const [loadError, setLoadError] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [messagingId, setMessagingId] = useState<string | null>(null)

  const load = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      const [f, r] = await Promise.all([friendsApi.getFriends(), friendsApi.getRequests()])
      if (!isActive()) return
      setFriends(f)
      setRequests(r)
      setLoadError(false)
    } catch {
      if (isActive()) setLoadError(true)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      let active = true
      load(() => active)
      return () => {
        active = false
      }
    }, [load]),
  )

  async function search(q: string) {
    setQuery(q)
    if (q.trim().length < 2) return setResults([])
    try {
      setResults(await messagesApi.searchUsers(q.trim()))
    } catch {
      setResults([])
    }
  }

  async function act(fn: () => Promise<unknown>) {
    try {
      await fn()
      await load()
    } catch {
      // ignore
    }
  }

  return (
    <Screen>
      <Title>Amis</Title>

      {loadError && (
        <ErrorState
          message="Impossible de charger tes amis."
          onRetry={() => load()}
        />
      )}

      <Card>
        <Text style={styles.cardTitle}>Ajouter un ami</Text>
        <TextField
          label="Rechercher"
          value={query}
          onChangeText={search}
          autoCapitalize="none"
          placeholder="pseudo…"
        />
        {results.map((peer) => (
          <View key={peer.id} style={styles.row}>
            <Text style={styles.name}>{peer.username}</Text>
            <Pressable onPress={() => act(() => friendsApi.createRequest(peer.id))}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Ajouter</Text>
            </Pressable>
          </View>
        ))}
      </Card>

      {requests.incoming.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Demandes reçues</Text>
          {requests.incoming.map((req) => (
            <View key={req.id} style={styles.row}>
              <Text style={styles.name}>{req.user.username}</Text>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <Pressable onPress={() => act(() => friendsApi.accept(req.id))}>
                  <Text style={{ color: colors.accent, fontWeight: '600' }}>Accepter</Text>
                </Pressable>
                <Pressable onPress={() => act(() => friendsApi.refuse(req.id))}>
                  <Text style={{ color: colors.danger }}>Refuser</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </Card>
      )}

      {requests.outgoing.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Demandes envoyées</Text>
          {requests.outgoing.map((req) => (
            <View key={req.id} style={styles.row}>
              <Text style={styles.name}>{req.user.username}</Text>
              <Pressable onPress={() => act(() => friendsApi.cancel(req.id))}>
                <Text style={{ color: colors.textMuted }}>Annuler</Text>
              </Pressable>
            </View>
          ))}
        </Card>
      )}

      <Text style={styles.cardTitle}>Mes amis ({friends.length})</Text>
      {!loadError && friends.length === 0 && <Muted>Aucun ami pour l&apos;instant.</Muted>}
      <ErrorText>{messageError}</ErrorText>
      {friends.map((friend) => (
        <View key={friend.id} style={styles.friendRow}>
          <Pressable style={{ flex: 1 }} onPress={() => router.push(`/players/${friend.username}`)}>
            <Text style={styles.name}>{friend.username}</Text>
          </Pressable>
          <Button
            label="Message"
            variant="ghost"
            loading={messagingId === friend.id}
            disabled={messagingId !== null}
            onPress={async () => {
              setMessageError('')
              setMessagingId(friend.id)
              try {
                const conv = await messagesApi.createConversation(friend.id)
                router.push(`/messages/${conv.id}`)
              } catch {
                setMessageError("Impossible d'ouvrir la conversation. Réessaie.")
              } finally {
                setMessagingId(null)
              }
            }}
          />
        </View>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
})
