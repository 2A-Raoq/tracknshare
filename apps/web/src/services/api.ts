import axios from 'axios'
import { authStore } from '../store/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = authStore.token ?? localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const hasStoredToken = authStore.token ?? localStorage.getItem('access_token')

    if (error.response?.status === 401 && hasStoredToken) {
      authStore.user = null
      authStore.token = null
      localStorage.removeItem('access_token')
      // Let React/ProtectedRoute handle the redirect — no window.location.href
    }
    return Promise.reject(error)
  },
)
