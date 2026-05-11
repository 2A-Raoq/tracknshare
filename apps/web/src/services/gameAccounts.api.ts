import { api } from './api'
import type { GameAccountItem } from '../types/game-accounts'

export async function getMyGameAccounts(): Promise<GameAccountItem[]> {
  const res = await api.get('/game-accounts/me')
  return Array.isArray(res.data?.data) ? res.data.data : []
}

export async function linkSteamAccount(steamId: string): Promise<GameAccountItem> {
  const res = await api.post('/game-accounts/steam/link', { steamId })
  return res.data.data
}
