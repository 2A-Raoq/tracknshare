import { useEffect } from 'react'
import { authStore } from '../store/auth.store'
import { api } from '../services/api'

export function useAuth() {
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token')

    if (!savedToken) {
      authStore.loading = false
      return
    }

    authStore.token = savedToken

    api
      .get('/users/me')
      .then((res) => {
        authStore.user = res.data.data
      })
      .catch(() => {
        authStore.user = null
        authStore.token = null
        localStorage.removeItem('access_token')
      })
      .finally(() => {
        authStore.loading = false
      })
  }, [])
}
