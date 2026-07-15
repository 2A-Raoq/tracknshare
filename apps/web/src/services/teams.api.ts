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

function isTeamMemberInfo(value: unknown): value is TeamDetail['members'][number] {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && (typeof record.username === 'string' || record.username === null)
    && typeof record.role === 'string'
    && typeof record.joinedAt === 'string'
  )
}

function ensureTeamDetail(payload: unknown): TeamDetail {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid team response.')
  }

  const record = payload as Record<string, unknown>

  if (
    typeof record.id !== 'string'
    || typeof record.name !== 'string'
    || typeof record.tag !== 'string'
    || typeof record.inviteCode !== 'string'
    || (record.description !== null && typeof record.description !== 'string')
    || !Array.isArray(record.members)
  ) {
    throw new Error('Invalid team response: malformed team detail.')
  }

  record.members.forEach((member) => {
    if (!isTeamMemberInfo(member)) {
      throw new Error('Invalid team response: malformed team member.')
    }
  })

  return payload as TeamDetail
}

function isChatMessage(value: unknown): value is ChatMessage {
  const record = value as Record<string, unknown>
  const sender = record.sender as Record<string, unknown> | undefined
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.teamId === 'string'
    && !!sender
    && typeof sender === 'object'
    && typeof sender.id === 'string'
    && (typeof sender.username === 'string' || sender.username === null)
    && typeof record.content === 'string'
    && typeof record.createdAt === 'string'
  )
}

function ensureChatMessageArray(payload: unknown): ChatMessage[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid team messages response: expected an array.')
  }

  return payload.map((item) => {
    if (!isChatMessage(item)) {
      throw new Error('Invalid team messages response: malformed message item.')
    }
    return item
  })
}

export const teamsApi = {
  getMyTeams: async (): Promise<TeamSummary[]> => {
    const res = await api.get<{ success: boolean; data: TeamSummary[] }>('/teams/me')
    return ensureTeamSummaryArray(res.data?.data)
  },

  getTeam: async (teamId: string): Promise<TeamDetail> => {
    const res = await api.get<{ success: boolean; data: TeamDetail }>(`/teams/${teamId}`)
    return ensureTeamDetail(res.data?.data)
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
    return ensureChatMessageArray(res.data?.data)
  },

  sendMessage: async (teamId: string, content: string): Promise<ChatMessage> => {
    const res = await api.post(`/teams/${teamId}/messages`, { content })
    return res.data.data
  },
}
