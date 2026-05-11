export interface GameAccountItem {
  id: string
  platform: string
  externalId: string
  externalUsername: string | null
  linkedAt: string
  lastSyncAt: string | null
}
