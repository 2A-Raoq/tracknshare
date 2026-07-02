import { Redirect, Stack } from 'expo-router'
import { useSnapshot } from 'valtio'
import { authStore } from '@/store/auth'
import { colors } from '@/theme'

export default function AuthLayout() {
  const { user } = useSnapshot(authStore)
  if (user) return <Redirect href="/(tabs)/dashboard" />

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  )
}
