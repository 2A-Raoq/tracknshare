import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Card, Muted, Screen, TextField, Title } from '@/components/ui'
import { messagesApi } from '@/services/messages.api'
import type { ConversationPeer, ConversationSummary } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function MessagesScreen() {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ConversationPeer[]>([])

  const load = useCallback(async () => {
    try {
      setConversations(await messagesApi.getConversations())
    } catch {
      setConversations([])
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  async function search(q: string) {
    setQuery(q)
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    try {
      setResults(await messagesApi.searchUsers(q.trim()))
    } catch {
      setResults([])
    }
  }

  async function startConversation(peer: ConversationPeer) {
    try {
      const conv = await messagesApi.createConversation(peer.id)
      setQuery('')
      setResults([])
      router.push(`/messages/${conv.id}`)
    } catch {
      // ignore
    }
  }

  return (
    <Screen>
      <Title>Messages</Title>

      <Card>
        <Text style={styles.cardTitle}>Nouvelle conversation</Text>
        <TextField
          label="Rechercher un joueur"
          value={query}
          onChangeText={search}
          autoCapitalize="none"
          placeholder="pseudo…"
        />
        {results.map((peer) => (
          <Pressable
            key={peer.id}
            onPress={() => startConversation(peer)}
            style={({ pressed }) => [styles.resultRow, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.name}>{peer.username}</Text>
            <Text style={{ color: colors.primary }}>Discuter ›</Text>
          </Pressable>
        ))}
      </Card>

      {conversations.length === 0 && <Muted>Aucune conversation.</Muted>}

      {conversations.map((conv) => (
        <Pressable
          key={conv.id}
          onPress={() => router.push(`/messages/${conv.id}`)}
          style={({ pressed }) => [styles.convRow, pressed && { opacity: 0.85 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {conv.participant?.username ?? 'Conversation'}
            </Text>
            {conv.lastMessage ? (
              <Text style={styles.preview} numberOfLines={1}>
                {conv.lastMessage.content}
              </Text>
            ) : (
              <Text style={styles.preview}>Démarrez la discussion</Text>
            )}
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 20 }}>›</Text>
        </Pressable>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  preview: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
})
