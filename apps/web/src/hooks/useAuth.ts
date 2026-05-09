import { useEffect } from 'react'
import { authStore } from '../store/auth.store'
import { api } from '../services/api'

export function useAuth() {
  console.log('useAuth called')

  useEffect(() => {
    console.log('fetch /auth/me')

    api.get('/auth/me')
      .then((res) => {
        console.log('user ok', res.data)
        authStore.user = res.data.user
      })
      .catch((err) => {
        console.log('user fail', err)
        authStore.user = null
      })
      .finally(() => {
        authStore.loading = false
      })
  }, [])
}