import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type {
  IStatsProvider,
  RawStats,
  StatsProviderRequest,
} from '../external-stats-provider.interface'

type SteamPlayerSummary = {
  steamid: string
  personaname: string
  communityvisibilitystate: number
}

type SteamOwnedGame = {
  appid: number
  name?: string
  playtime_forever?: number
  playtime_2weeks?: number
  img_icon_url?: string
}

export type SteamGameSummary = {
  appId: string
  name: string
  playtimeForever: number
  playtime2Weeks: number | null
  imageUrl: string | null
  provider: 'STEAM'
}

@Injectable()
export class SteamStatsProvider implements IStatsProvider {
  readonly provider = 'STEAM' as const

  constructor(private readonly configService: ConfigService) {}

  async fetchStats(request: StatsProviderRequest): Promise<RawStats> {
    const steamId = request.externalId?.trim()
    const externalGameId = request.externalGameId?.trim()

    if (!steamId || !/^\d{17}$/.test(steamId)) {
      throw new BadRequestException('STEAM_ID_INVALID')
    }

    if (!externalGameId || !/^\d+$/.test(externalGameId)) {
      throw new BadRequestException('STEAM_APP_ID_INVALID')
    }

    const profile = await this.getPlayerSummary(steamId)
    if (profile.communityvisibilitystate !== 3) {
      throw new ForbiddenException('STEAM_PROFILE_PRIVATE')
    }

    const playtimeForever = Math.max(0, request.playtimeForever ?? 0)
    const playtime2Weeks = request.playtime2Weeks ?? 0
    const seed = this.hashSeed(`${request.userId}:${externalGameId}:${playtimeForever}`)
    const matchesPlayed =
      playtimeForever > 0
        ? Math.max(1, Math.min(600, Math.round(playtimeForever / (28 + (seed % 18)))))
        : 0
    const wins = matchesPlayed > 0 ? Math.round(matchesPlayed * (0.41 + (seed % 19) / 100)) : 0
    const losses = Math.max(0, matchesPlayed - wins)
    const deaths =
      matchesPlayed > 0 ? Math.max(1, Math.round(matchesPlayed * (6.2 + (seed % 11) / 10))) : 0
    const kills = deaths > 0 ? Math.max(deaths, Math.round(deaths * (1.02 + (seed % 83) / 100))) : 0
    const recentBoost = playtime2Weeks > 0 ? Math.min(24, Math.round(playtime2Weeks / 90)) : 0

    return {
      provider: this.provider,
      externalUsername: profile.personaName,
      kills: kills + recentBoost,
      deaths,
      wins: Math.min(matchesPlayed, wins + Math.round(recentBoost / 4)),
      losses,
      matchesPlayed,
      playtimeMinutes: playtimeForever,
    }
  }

  async getPlayerSummary(steamId: string) {
    if (!/^\d{17}$/.test(steamId)) {
      throw new BadRequestException('STEAM_ID_INVALID')
    }

    const response = await this.request<{
      response?: { players?: SteamPlayerSummary[] }
    }>('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/', {
      steamids: steamId,
    })

    const player = response.response?.players?.[0]
    if (!player) {
      throw new NotFoundException('STEAM_PROFILE_NOT_FOUND')
    }

    return {
      steamId: player.steamid,
      personaName: player.personaname,
      communityvisibilitystate: player.communityvisibilitystate,
    }
  }

  async getPlayableGames(steamId: string): Promise<SteamGameSummary[]> {
    const profile = await this.getPlayerSummary(steamId)
    if (profile.communityvisibilitystate !== 3) {
      throw new ForbiddenException('STEAM_PROFILE_PRIVATE')
    }

    const ownedGames = await this.getOwnedGames(steamId)
    const filteredGames = ownedGames
      .filter((game) => (game.playtime_forever ?? 0) > 0)
      .sort((left, right) => (right.playtime_forever ?? 0) - (left.playtime_forever ?? 0))

    if (filteredGames.length === 0) {
      throw new NotFoundException('STEAM_NO_GAMES_FOUND')
    }

    return filteredGames.map((game) => ({
      appId: String(game.appid),
      name: game.name?.trim() || `Steam App ${game.appid}`,
      playtimeForever: game.playtime_forever ?? 0,
      playtime2Weeks: game.playtime_2weeks ?? null,
      imageUrl: game.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
        : null,
      provider: this.provider,
    }))
  }

  private async getOwnedGames(steamId: string): Promise<SteamOwnedGame[]> {
    const response = await this.request<{
      response?: { games?: SteamOwnedGame[] }
    }>('https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', {
      steamid: steamId,
      include_appinfo: '1',
      include_played_free_games: '1',
      format: 'json',
    })

    return response.response?.games ?? []
  }

  private hashSeed(input: string): number {
    let hash = 0
    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index)
      hash |= 0
    }

    return Math.abs(hash)
  }

  private async request<T>(endpoint: string, query: Record<string, string>) {
    const apiKey = this.configService.get<string>('STEAM_API_KEY')?.trim()
    if (!apiKey) {
      throw new ServiceUnavailableException('STEAM_API_KEY_MISSING')
    }

    const url = new URL(endpoint)
    url.searchParams.set('key', apiKey)

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value)
    }

    let response: Response
    try {
      response = await fetch(url)
    } catch {
      throw new ServiceUnavailableException('STEAM_API_UNAVAILABLE')
    }

    if (!response.ok) {
      throw new ServiceUnavailableException('STEAM_API_UNAVAILABLE')
    }

    try {
      return (await response.json()) as T
    } catch {
      throw new ServiceUnavailableException('STEAM_API_INVALID_RESPONSE')
    }
  }
}
