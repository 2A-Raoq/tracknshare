export interface GameAccountItem {
  id: string
  platform: string
  externalId: string
  externalUsername: string | null
  linkedAt: string
  lastSyncAt: string | null
}

export interface SteamGameItem {
  appId: string
  name: string
  playtimeForever: number
  playtime2Weeks: number | null
  imageUrl: string | null
  provider: 'STEAM'
  isTracked: boolean
}
