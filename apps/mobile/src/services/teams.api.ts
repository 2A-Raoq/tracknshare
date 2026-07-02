import { api } from '@/lib/api'
import type { ApiEnvelope, ChatMessage, TeamDetail, TeamSummary } from '@/types'

export const teamsApi = {
  mine: async () =>
    (await api.get<ApiEnvelope<TeamSummary[]>>('/teams/me')).data.data,

  getTeam: async (teamId: string) =>
    (await api.get<ApiEnvelope<TeamDetail>>(`/teams/${teamId}`)).data.data,

  create: async (data: { name: string; tag: string; description?: string }) =>
    (await api.post<ApiEnvelope<TeamSummary>>('/teams', data)).data.data,

  join: async (inviteCode: string) =>
    (await api.post<ApiEnvelope<unknown>>('/teams/join', { inviteCode })).data
      .data,

  leave: async (teamId: string) =>
    (
      await api.delete<ApiEnvelope<{ teamId: string; disbanded: boolean }>>(
        `/teams/${teamId}/leave`,
      )
    ).data.data,

  getMessages: async (teamId: string) =>
    (await api.get<ApiEnvelope<ChatMessage[]>>(`/teams/${teamId}/messages`)).data
      .data,

  sendMessage: async (teamId: string, content: string) =>
    (
      await api.post<ApiEnvelope<ChatMessage>>(`/teams/${teamId}/messages`, {
        content,
      })
    ).data.data,
}
