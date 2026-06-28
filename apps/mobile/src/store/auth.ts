import { proxy } from 'valtio'
import { tokenStorage } from '@/lib/storage'

export type AuthUser = {
  id: string
  email: string
  username: string
  role: string
}

export const authStore = proxy({
  user: null as AuthUser | null,
  token: null as string | null,
  loading: true,
})

/** Restaure la session au démarrage à partir du jeton stocké. */
export async function loadSession() {
  const token = await tokenStorage.get()
  if (!token) {
    authStore.loading = false
    return
  }
  authStore.token = token
  // L'utilisateur sera complété par /users/me (cf. lib/api + écran racine).
  authStore.loading = false
}

export async function setSession(user: AuthUser, token: string) {
  authStore.user = user
  authStore.token = token
  await tokenStorage.set(token)
}

export async function clearSession() {
  authStore.user = null
  authStore.token = null
  await tokenStorage.remove()
}
