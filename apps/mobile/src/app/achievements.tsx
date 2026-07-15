import { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ErrorState, Muted, Screen, Title } from '@/components/ui'
import { achievementsApi } from '@/services/achievements.api'
import type { AchievementItem } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function AchievementsScreen() {
  const [items, setItems] = useState<AchievementItem[]>([])
  const [error, setError] = useState(false)

  const load = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      const data = await achievementsApi.mine()
      if (!isActive()) return
      setItems(data)
      setError(false)
    } catch {
      if (isActive()) setError(true)
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

  const unlocked = items.filter((a) => a.unlocked).length

  return (
    <Screen>
      <Title>Succès</Title>
      <Muted>
        {unlocked}/{items.length} débloqués
      </Muted>

      {error && (
        <ErrorState
          message="Impossible de charger tes succès."
          onRetry={() => load()}
        />
      )}

      {items.map((a) => (
        <View key={a.id} style={[styles.row, !a.unlocked && { opacity: 0.55 }]}>
          <Ionicons
            name={a.unlocked ? 'trophy' : 'lock-closed-outline'}
            size={24}
            color={a.unlocked ? colors.warning : colors.textMuted}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{a.name}</Text>
            <Text style={styles.desc}>{a.description}</Text>
            {!a.unlocked && a.targetValue ? (
              <Text style={styles.progress}>
                {a.currentValue ?? 0}/{a.targetValue}
              </Text>
            ) : null}
          </View>
          <Text style={styles.points}>{a.points} pts</Text>
        </View>
      ))}
    </Screen>
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
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  desc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  progress: { color: colors.primary, fontSize: 12, marginTop: 4 },
  points: { color: colors.warning, fontSize: 13, fontWeight: '700' },
})
