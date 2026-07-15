import { useEffect, useRef } from 'react'
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSnapshot } from 'valtio'
import { dismissNotification, notificationStore } from '@/store/notifications'
import { colors, radius, spacing } from '@/theme'

const AUTO_DISMISS_MS = 5000
const HIDDEN_OFFSET = -220

/**
 * Bannière de notification in-app affichée en haut de l'écran :
 *  - slide-in à l'arrivée d'un message,
 *  - disparaît seule au bout de 5 s,
 *  - swipe vers le haut pour la fermer,
 *  - tap pour ouvrir la conversation.
 * 100% Animated/PanResponder natifs → fiable dans Expo Go (pas de worklets).
 */
export function NotificationBanner() {
  const snap = useSnapshot(notificationStore)
  const insets = useSafeAreaInsets()
  const current = snap.current

  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function hide(after?: () => void) {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    Animated.timing(translateY, {
      toValue: HIDDEN_OFFSET,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      dismissNotification()
      after?.()
    })
  }

  useEffect(() => {
    if (!current) return
    translateY.setValue(HIDDEN_OFFSET)
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
      speed: 14,
    }).start()
    timerRef.current = setTimeout(() => hide(), AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  const panResponder = useRef(
    PanResponder.create({
      // Ne capture que les vrais glissements verticaux ; les taps passent au Pressable.
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      },
      onPanResponderMove: (_e, g) => {
        if (g.dy < 0) translateY.setValue(g.dy) // glissement vers le haut uniquement
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy < -40 || g.vy < -0.5) {
          hide()
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start()
          timerRef.current = setTimeout(() => hide(), AUTO_DISMISS_MS)
        }
      },
    }),
  ).current

  function handlePress() {
    const target = current
    hide(() => {
      if (!target) return
      if (target.kind === 'private') router.push(`/messages/${target.threadId}`)
      else router.push(`/teams/${target.threadId}/chat`)
    })
  }

  if (!current) return null

  return (
    <Animated.View
      style={[
        styles.wrap,
        { top: insets.top + spacing.sm, transform: [{ translateY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable onPress={handlePress} style={styles.card} android_ripple={{ color: colors.border }}>
        <View style={styles.icon}>
          <Ionicons
            name={current.kind === 'team' ? 'people' : 'chatbubble-ellipses'}
            size={20}
            color={colors.primaryText}
          />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={1}>
            {current.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {current.body}
          </Text>
        </View>
      </Pressable>
      <View style={styles.grabber} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    elevation: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    paddingRight: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { color: colors.text, fontSize: 14, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: 13, marginTop: 1 },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
})
