import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Card, Muted, Screen, TextField } from '@/components/ui'
import { messagesApi } from '@/services/messages.api'
import { teamsApi } from '@/services/teams.api'
import type { ConversationPeer, ConversationSummary, TeamSummary } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function MessagesScreen() {
  const router = useRouter()
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ConversationPeer[]>([])

  const load = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([
        teamsApi.mine(),
        messagesApi.getConversations(),
      ])
      setTeams(t)
      setConversations(c)
    } catch {
      // ignore
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
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
      <Text style={styles.section}>Discussions d&apos;équipe</Text>
      {teams.length === 0 && <Muted>Tu n&apos;as rejoint aucune équipe.</Muted>}
      {teams.map((team) => (
        <Pressable
          key={team.id}
          onPress={() => router.push(`/teams/${team.id}/chat`)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="people" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              [{team.tag}] {team.name}
            </Text>
            <Text style={styles.preview}>Chat d&apos;équipe</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Messages privés</Text>

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

      {conversations.length === 0 && <Muted>Aucune conversation privée.</Muted>}
      {conversations.map((conv) => (
        <Pressable
          key={conv.id}
          onPress={() => router.push(`/messages/${conv.id}`)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="person-circle-outline" size={24} color={colors.textMuted} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {conv.participant?.username ?? 'Conversation'}
            </Text>
            <Text style={styles.preview} numberOfLines={1}>
              {conv.lastMessage?.content ?? 'Démarrez la discussion'}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  preview: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 20 },
})
