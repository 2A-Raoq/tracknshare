import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Card, Muted, Screen, TextField } from '@/components/ui'
import { messagesApi } from '@/services/messages.api'
import { teamsApi } from '@/services/teams.api'
import type { ConversationPeer, ConversationSummary, TeamSummary } from '@/types'
import { colors, radius, spacing } from '@/theme'

type Tab = 'private' | 'teams'

export default function MessagesScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('private')
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
      <View style={styles.tabsRow}>
        <Pressable onPress={() => setTab('private')} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === 'private' && styles.tabTextActive]}>
            Messages privés
          </Text>
          {tab === 'private' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable onPress={() => setTab('teams')} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === 'teams' && styles.tabTextActive]}>
            Équipes
          </Text>
          {tab === 'teams' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      {tab === 'teams' ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  tabBtn: { paddingBottom: spacing.sm, alignItems: 'center' },
  tabText: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  tabUnderline: {
    height: 2,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    marginTop: spacing.sm,
    borderRadius: 2,
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
