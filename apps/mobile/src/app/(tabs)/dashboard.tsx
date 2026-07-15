import { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useSnapshot } from 'valtio'
import { Card, ErrorState, Muted, Title } from '@/components/ui'
import { statsApi } from '@/services/stats.api'
import { authStore } from '@/store/auth'
import type { PlayerStat } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function DashboardScreen() {
  const { user } = useSnapshot(authStore)
  const [stats, setStats] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      const data = await statsApi.mine()
      if (!isActive()) return
      setStats(data)
      setError(false)
    } catch {
      if (isActive()) setError(true)
    } finally {
      if (isActive()) {
        setLoading(false)
        setRefreshing(false)
      }
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

  const totalScore = stats.reduce((sum, s) => sum + s.score, 0)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            load()
          }}
          tintColor={colors.primary}
        />
      }
    >
      <View style={{ gap: spacing.xs }}>
        <Title>Salut {user?.username} 👋</Title>
        <Muted>Score total : {totalScore}</Muted>
      </View>

      {loading && <Muted>Chargement des statistiques…</Muted>}
      {!loading && error && (
        <ErrorState
          message="Impossible de charger les statistiques."
          onRetry={() => {
            setLoading(true)
            load()
          }}
        />
      )}
      {!loading && !error && stats.length === 0 && (
        <Card>
          <Muted>Aucune statistique pour le moment.</Muted>
        </Card>
      )}

      {stats.map((s) => (
        <Card key={s.id}>
          <Text style={styles.gameName}>{s.game?.name ?? 'Jeu'}</Text>
          <View style={styles.statsRow}>
            <Stat label="Score" value={s.score} highlight />
            <Stat label="K/D" value={s.kdRatio} />
            <Stat label="Winrate" value={`${s.winrate}%`} />
            <Stat label="Matchs" value={s.matchesPlayed} />
          </View>
        </Card>
      ))}
    </ScrollView>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, highlight && { color: colors.primary }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  gameName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stat: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 72,
    alignItems: 'center',
    flexGrow: 1,
  },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
})
