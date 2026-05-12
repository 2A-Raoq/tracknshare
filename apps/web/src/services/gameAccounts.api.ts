import { api } from './api'
import type { GameAccountItem, SteamGameItem } from '../types/game-accounts'

export async function getMyGameAccounts(): Promise<GameAccountItem[]> {
  const res = await api.get('/game-accounts/me')
  return Array.isArray(res.data?.data) ? res.data.data : []
}

export async function linkSteamAccount(steamId: string): Promise<GameAccountItem> {
  const res = await api.post('/game-accounts/steam/link', { steamId })
  return res.data.data
}

export async function getSteamGames(): Promise<SteamGameItem[]> {
  const res = await api.get('/game-accounts/steam/games')
  return Array.isArray(res.data?.data) ? res.data.data : []
}

export async function updateTrackedSteamGames(appIds: string[]): Promise<SteamGameItem[]> {
  const res = await api.patch('/game-accounts/steam/tracked-games', { appIds })
  return Array.isArray(res.data?.data) ? res.data.data : []
}
