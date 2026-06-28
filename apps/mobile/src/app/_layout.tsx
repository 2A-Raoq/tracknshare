import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useSnapshot } from 'valtio'
import { authStore } from '@/store/auth'
import { tokenStorage } from '@/lib/storage'
import { authApi } from '@/services/auth.api'
import { colors } from '@/theme'

export default function RootLayout() {
  const snap = useSnapshot(authStore)

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
          </Stack>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
