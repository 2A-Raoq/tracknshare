import { Redirect } from 'expo-router'
import { useSnapshot } from 'valtio'
import { authStore } from '@/store/auth'

export default function Index() {
  const { user } = useSnapshot(authStore)
  return <Redirect href={user ? '/(tabs)/dashboard' : '/(auth)/login'} />
}
