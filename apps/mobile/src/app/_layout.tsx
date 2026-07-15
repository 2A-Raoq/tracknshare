import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useSnapshot } from 'valtio'
import { authStore } from '@/store/auth'
import { tokenStorage } from '@/lib/storage'
import { authApi } from '@/services/auth.api'
import { useGlobalNotifications } from '@/lib/useGlobalNotifications'
import { NotificationBanner } from '@/components/NotificationBanner'
import { colors } from '@/theme'

export default function RootLayout() {
  const snap = useSnapshot(authStore)
  const router = useRouter()
  const segments = useSegments()
  useGlobalNotifications()

  useEffect(() => {
    ;(async () => {
      const token = await tokenStorage.get()
      if (token) {
        authStore.token = token
        try {
          authStore.user = await authApi.me()
        } catch {
          authStore.token = null
          await tokenStorage.remove()
        }
      }
      authStore.loading = false
    })()
  }, [])

  // Garde d'auth globale : si la session disparaît (ex. 401 → purge dans
  // lib/api.ts) alors qu'on est sur un écran protégé hors (auth), on renvoie
  // au login. On attend la fin du chargement initial pour ne pas déclencher
  // la redirection au démarrage (index.tsx gère déjà ce cas).
  const isAuthenticated = !!snap.user
  const inAuthGroup = segments[0] === '(auth)'
  useEffect(() => {
    if (snap.loading) return
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    }
  }, [snap.loading, isAuthenticated, inAuthGroup, router])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {snap.loading ? (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
              headerTitleStyle: { color: colors.text },
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="teams/[id]/index" options={{ title: 'Équipe' }} />
            <Stack.Screen name="teams/[id]/chat" options={{ title: "Chat d'équipe" }} />
            <Stack.Screen name="messages/[id]" options={{ title: 'Conversation' }} />
            <Stack.Screen name="friends" options={{ title: 'Amis' }} />
            <Stack.Screen name="achievements" options={{ title: 'Succès' }} />
          </Stack>
        )}
        <NotificationBanner />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
