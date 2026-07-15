import { useCallback, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { Button, Card, ErrorState, Muted, Screen, Title } from '@/components/ui'
import { teamsApi } from '@/services/teams.api'
import type { TeamDetail } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(
    async (isActive: () => boolean = () => true) => {
      if (!id) return
      try {
        const data = await teamsApi.getTeam(id)
        if (!isActive()) return
        setTeam(data)
        setError(false)
      } catch {
        if (isActive()) {
          setTeam(null)
          setError(true)
        }
      } finally {
        if (isActive()) setLoading(false)
      }
    },
    [id],
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

  function confirmLeave() {
    if (!team) return
    Alert.alert('Quitter l\'équipe', `Quitter ${team.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Quitter',
        style: 'destructive',
        onPress: async () => {
          try {
            await teamsApi.leave(team.id)
            router.replace('/(tabs)/teams')
          } catch {
            Alert.alert('Erreur', "Impossible de quitter l'équipe.")
          }
        },
      },
    ])
  }

  if (loading) return <Screen><Muted>Chargement…</Muted></Screen>
  if (error)
    return (
      <Screen>
        <ErrorState
          message="Impossible de charger l'équipe (introuvable, accès refusé ou erreur réseau)."
          onRetry={() => {
            setLoading(true)
            load()
          }}
        />
      </Screen>
    )
  if (!team) return <Screen><Muted>Équipe introuvable ou accès refusé.</Muted></Screen>

  return (
    <Screen>
      <Title>[{team.tag}] {team.name}</Title>
      {team.description ? <Muted>{team.description}</Muted> : null}

      <View style={styles.statsRow}>
        <StatBox label="Membres" value={team.stats?.memberCount ?? team.members.length} />
        <StatBox label="Score moyen" value={team.stats?.averageScore ?? 0} />
        <StatBox
          label="Meilleur"
          value={team.stats?.bestPlayer?.username ?? '—'}
        />
      </View>

      <Card>
        <Text style={styles.cardTitle}>Code d&apos;invitation</Text>
        <Text style={styles.invite}>{team.inviteCode}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Roster ({team.members.length})</Text>
        {team.members.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <Text style={styles.memberName}>{m.username ?? m.id}</Text>
            <Text style={styles.memberRole}>{m.role}</Text>
          </View>
        ))}
      </Card>

      <Button
        label="Ouvrir le chat d'équipe"
        onPress={() => router.push(`/teams/${team.id}/chat`)}
      />
      <Button label="Quitter l'équipe" variant="danger" onPress={confirmLeave} />
    </Screen>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: 16, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  invite: { color: colors.primary, fontSize: 20, fontWeight: '700', letterSpacing: 2 },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  memberName: { color: colors.text, fontSize: 14 },
  memberRole: { color: colors.textMuted, fontSize: 12 },
})
