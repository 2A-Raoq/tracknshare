import { proxy } from 'valtio'
import type { AuthUser } from '@tracknshare/shared-types'

// Réexport pour compatibilité : le type vit dans packages/shared-types.
export type { AuthUser }

export const authStore = proxy({
  user: null as AuthUser | null,
  token: null as string | null,
  loading: true,
})

// Purge complète de la session : store, token persistant et cache API du
// service worker (les réponses authentifiées ne doivent pas survivre à la
// session sur un navigateur partagé).
export function clearSession() {
  authStore.user = null
  authStore.token = null
  localStorage.removeItem('access_token')
  if ('caches' in window) {
    void caches.delete('api-cache')
  }
}
