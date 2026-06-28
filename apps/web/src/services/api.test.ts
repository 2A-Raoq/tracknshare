import { describe, it, expect, beforeEach } from 'vitest'
import { api } from './api'
import { authStore } from '../store/auth.store'

/* eslint-disable @typescript-eslint/no-explicit-any */
const requestHandler = (config: any) =>
  (api.interceptors.request as any).handlers[0].fulfilled(config)
const responseErrorHandler = (error: any) =>
  (api.interceptors.response as any).handlers[0].rejected(error)

describe('intercepteur api', () => {
  beforeEach(() => {
    authStore.user = null
    authStore.token = null
    localStorage.clear()
  })

  describe('requête', () => {
    it('ajoute le header Authorization depuis le store', () => {
      authStore.token = 'tok-store'
      const config = requestHandler({ headers: {} })
      expect(config.headers.Authorization).toBe('Bearer tok-store')
    })

    it('utilise le token du localStorage en repli', () => {
      localStorage.setItem('access_token', 'tok-ls')
      const config = requestHandler({ headers: {} })
      expect(config.headers.Authorization).toBe('Bearer tok-ls')
    })

    it('n’ajoute aucun header sans token', () => {
      const config = requestHandler({ headers: {} })
      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('réponse 401', () => {
    it('purge la session quand un token est présent', async () => {
      authStore.token = 'tok'
      authStore.user = { id: '1', email: 'a@b.c', username: 'demo', role: 'PLAYER' }
      localStorage.setItem('access_token', 'tok')

      await expect(
        responseErrorHandler({ response: { status: 401 } }),
      ).rejects.toBeDefined()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('access_token')).toBeNull()
    })

    it('ne purge pas la session sur une erreur non-401', async () => {
      authStore.token = 'tok'
      localStorage.setItem('access_token', 'tok')

      await expect(
        responseErrorHandler({ response: { status: 500 } }),
      ).rejects.toBeDefined()

      expect(authStore.token).toBe('tok')
      expect(localStorage.getItem('access_token')).toBe('tok')
    })
  })
})
