import { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Muted, Screen, Title } from '@/components/ui'
import { achievementsApi } from '@/services/achievements.api'
import type { AchievementItem } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function AchievementsScreen() {
  const [items, setItems] = useState<AchievementItem[]>([])

  const load = useCallback(async () => {
    try {
      setItems(await achievementsApi.mine())
    } catch {
      setItems([])
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const unlocked = items.filter((a) => a.unlocked).length

  return (
    <Screen>
      <Title>Succès</Title>
      <Muted>
        {unlocked}/{items.length} débloqués
      </Muted>

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
