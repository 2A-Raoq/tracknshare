import { api } from './api'
import type { TeamSummary, TeamDetail, ChatMessage } from '../types/teams'

function ensureTeamSummaryArray(payload: unknown): TeamSummary[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid teams response: expected data to be an array.')
  }

  return payload.map((team) => {
    if (
      !team
      || typeof team !== 'object'
      || typeof team.id !== 'string'
      || typeof team.name !== 'string'
      || typeof team.tag !== 'string'
      || typeof team.role !== 'string'
    ) {
      throw new Error('Invalid teams response: malformed team item.')
    }

    return team
  })
}

export const teamsApi = {
  getMyTeams: async (): Promise<TeamSummary[]> => {
    const res = await api.get<{ success: boolean; data: TeamSummary[] }>('/teams/me')
    return ensureTeamSummaryArray(res.data?.data)
  },

  getTeam: async (teamId: string): Promise<TeamDetail> => {
    const res = await api.get<{ success: boolean; data: TeamDetail }>(`/teams/${teamId}`)
    return res.data.data
  },

  createTeam: async (data: { name: string; tag: string; description?: string }) => {
    const res = await api.post('/teams', data)
    return res.data.data
  },

  joinTeam: async (inviteCode: string) => {
    const res = await api.post('/teams/join', { inviteCode })
    return res.data.data
  },

  leaveTeam: async (teamId: string): Promise<{ teamId: string; disbanded: boolean }> => {
    const res = await api.delete(`/teams/${teamId}/leave`)
    return res.data.data
  },

  getMessages: async (teamId: string): Promise<ChatMessage[]> => {
    const res = await api.get<{ success: boolean; data: ChatMessage[] }>(
      `/teams/${teamId}/messages`,
    )
    return res.data.data
  },

  sendMessage: async (teamId: string, content: string): Promise<ChatMessage> => {
    const res = await api.post(`/teams/${teamId}/messages`, { content })
    return res.data.data
  },
}
