import { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Card, ErrorState, Muted, Screen, Title } from '@/components/ui'
import { playersApi } from '@/services/players.api'
import type { PublicPlayerProfile } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicPlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(
    async (isActive: () => boolean = () => true) => {
      if (!username) return
      try {
        const data = await playersApi.getProfile(username)
        if (!isActive()) return
        setProfile(data)
        setError(false)
      } catch {
        if (isActive()) {
          setProfile(null)
          setError(true)
        }
      } finally {
        if (isActive()) setLoading(false)
      }
    },
    [username],
  )

  useFocusEffect(
    useCallback(() => {
      let active = true
      load(() => active)
      return () => {
        active = false
      }
    }, [load]),
  )

  if (loading) return <Screen><Muted>Chargement…</Muted></Screen>
  if (error)
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger ce profil (introuvable ou erreur réseau)."
          onRetry={() => {
            setLoading(true)
            load()
          }}
        />
      </Screen>
    )
  if (!profile) return <Screen><Muted>Profil introuvable.</Muted></Screen>

  return (
    <Screen>
      <Stack.Screen options={{ title: profile.username }} />
      <Title>{profile.username}</Title>
      {profile.bio ? <Muted>{profile.bio}</Muted> : null}
      {profile.leaderboardRank ? (
        <Muted>Rang classement : #{profile.leaderboardRank}</Muted>
      ) : null}

      {profile.stats && (
        <Card>
          <Text style={styles.cardTitle}>
            Statistiques{profile.primaryGame ? ` · ${profile.primaryGame.name}` : ''}
          </Text>
          <View style={styles.statsRow}>
            <Stat label="Score" value={profile.stats.score} highlight />
            <Stat label="K/D" value={profile.stats.kdRatio} />
            <Stat label="Winrate" value={`${profile.stats.winrate}%`} />
            <Stat label="Matchs" value={profile.stats.matchesPlayed} />
          </View>
        </Card>
      )}

      {profile.teams.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Équipes</Text>
          {profile.teams.map((t) => (
            <Text key={t.id} style={styles.line}>
              [{t.tag}] {t.name} — {t.role}
            </Text>
          ))}
        </Card>
      )}

      {profile.badges.length > 0 && (
        <Card>
          <Text style={styles.cardTitle}>Succès ({profile.badges.length})</Text>
          {profile.badges.map((b) => (
            <Text key={b.id} style={styles.line}>
              🏆 {b.name}
            </Text>
          ))}
        </Card>
      )}
    </Screen>
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
      <Text style={[styles.statValue, highlight && { color: colors.primary }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
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
  line: { color: colors.text, fontSize: 14, paddingVertical: 2 },
})
