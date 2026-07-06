import { proxy } from 'valtio'
import { tokenStorage } from '@/lib/storage'
import { dismissNotification, setActiveThread } from '@/store/notifications'
import type { AuthUser } from '@/types'

export const authStore = proxy({
  user: null as AuthUser | null,
  token: null as string | null,
  loading: true,
})

export async function setSession(user: AuthUser, token: string) {
  authStore.user = user
  authStore.token = token
  await tokenStorage.set(token)
}

export async function clearSession() {
  authStore.user = null
  authStore.token = null
  // Purge l'état de notifications lié à la session (bannière + fil actif).
  dismissNotification()
  setActiveThread(null)
  await tokenStorage.remove()
}
