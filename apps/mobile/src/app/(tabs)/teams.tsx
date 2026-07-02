import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Button, Card, ErrorText, Muted, Screen, TextField, Title } from '@/components/ui'
import { teamsApi } from '@/services/teams.api'
import type { TeamSummary } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function TeamsScreen() {
  const router = useRouter()
  const [teams, setTeams] = useState<TeamSummary[]>([])
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setTeams(await teamsApi.mine())
    } catch {
      setTeams([])
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  async function handleJoin() {
    if (!inviteCode.trim()) return
    setError('')
    setBusy(true)
    try {
      await teamsApi.join(inviteCode.trim().toUpperCase())
      setInviteCode('')
      await load()
    } catch {
      setError("Code d'invitation invalide ou déjà membre.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title>Mes équipes</Title>

      {teams.length === 0 && <Muted>Tu n&apos;as rejoint aucune équipe.</Muted>}

      {teams.map((team) => (
        <Pressable
          key={team.id}
          onPress={() => router.push(`/teams/${team.id}`)}
          style={({ pressed }) => [styles.teamRow, pressed && { opacity: 0.85 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.teamName}>
              [{team.tag}] {team.name}
            </Text>
            <Text style={styles.teamRole}>{team.role}</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 20 }}>›</Text>
        </Pressable>
      ))}

      <Card>
        <Text style={styles.cardTitle}>Rejoindre une équipe</Text>
        <TextField
          label="Code d'invitation"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
          placeholder="ABCD1234"
        />
        <ErrorText>{error}</ErrorText>
        <Button label="Rejoindre" onPress={handleJoin} loading={busy} />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  teamName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  teamRole: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
})
