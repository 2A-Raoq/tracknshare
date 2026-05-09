import { proxy } from 'valtio'

export const authStore = proxy({
  user: null as any,
  loading: true,
})