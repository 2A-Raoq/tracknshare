import { useCallback, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Muted } from '@/components/ui'
import { leaderboardApi } from '@/services/leaderboard.api'
import type { LeaderboardEntry } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setEntries(await leaderboardApi.solo())
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
      data={entries}
      keyExtractor={(item) => item.userId + item.rank}
      ListEmptyComponent={
        <Muted>{loading ? 'Chargement du classement…' : 'Classement vide.'}</Muted>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={[styles.rank, item.rank <= 3 && { color: colors.warning }]}>
            #{item.rank}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.meta}>
              {item.gameName} · K/D {item.kdRatio} · {item.winrate}%
            </Text>
          </View>
          <Text style={styles.score}>{item.score}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
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
  rank: { color: colors.textMuted, fontSize: 16, fontWeight: '700', width: 44 },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  score: { color: colors.primary, fontSize: 16, fontWeight: '700' },
})
