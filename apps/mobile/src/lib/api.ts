import axios from 'axios'
import { API_URL } from '@/config'
import { authStore, clearSession } from '@/store/auth'

export const api = axios.create({ baseURL: API_URL, timeout: 15000 })

// Injecte le jeton JWT sur chaque requête.
api.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Sur 401 avec un jeton présent, on purge la session (jeton expiré/invalide).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && authStore.token) {
      void clearSession()
    }
    return Promise.reject(error)
  },
)
