import { api } from './api'

export interface UserSearchResult {
  id: string
  username: string
  avatar: string | null
}

function isUserSearchResult(value: unknown): value is UserSearchResult {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.username === 'string'
    && (typeof record.avatar === 'string' || record.avatar === null)
  )
}

function ensureSearchResults(payload: unknown): UserSearchResult[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid user search response: expected an array.')
  }

  return payload.map((item) => {
    if (!isUserSearchResult(item)) {
      throw new Error('Invalid user search response: malformed user item.')
    }
    return item
  })
}

export const usersApi = {
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    const res = await api.get<{ success: boolean; data: UserSearchResult[] }>('/users/search', {
      params: { q: query },
    })

    return ensureSearchResults(res.data?.data)
  },

  // Met à jour le profil (pseudo) de l'utilisateur connecté.
  updateProfile: async (data: { username: string }) => {
    const res = await api.patch('/users/me', data)
    return res.data?.data
  },

  // RGPD — portabilité : récupère l'ensemble des données personnelles.
  exportMyData: async (): Promise<unknown> => {
    const res = await api.get<{ success: boolean; data: unknown }>('/users/me/export')
    return res.data?.data
  },

  // RGPD — droit à l'oubli : supprime le compte et toutes les données liées.
  deleteMyAccount: async (): Promise<void> => {
    await api.delete('/users/me')
  },
}
