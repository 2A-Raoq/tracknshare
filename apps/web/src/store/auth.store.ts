import { proxy } from 'valtio'

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
