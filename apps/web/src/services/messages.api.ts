import { api } from './api'
import type {
  ConversationDetail,
  ConversationPeer,
  ConversationSummary,
  PrivateMessageItem,
} from '../types/messages'

function isConversationPeer(value: unknown): value is ConversationPeer {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && (typeof record.username === 'string' || record.username === null)
    && (typeof record.avatar === 'string' || record.avatar === null)
  )
}

function isConversationSummary(value: unknown): value is ConversationSummary {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.type === 'string'
    && (record.participant === null || isConversationPeer(record.participant))
    && typeof record.updatedAt === 'string'
    && typeof record.createdAt === 'string'
    && (typeof record.lastReadAt === 'string' || record.lastReadAt === null)
  )
}

function isPrivateMessageItem(value: unknown): value is PrivateMessageItem {
  const record = value as Record<string, unknown>
  const sender = record.sender as Record<string, unknown> | undefined
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.conversationId === 'string'
    && !!sender
    && typeof sender.id === 'string'
    && (typeof sender.username === 'string' || sender.username === null)
    && typeof record.content === 'string'
    && typeof record.createdAt === 'string'
    && (typeof record.editedAt === 'string' || record.editedAt === null)
    && (typeof record.deletedAt === 'string' || record.deletedAt === null)
  )
}

function ensureConversationArray(payload: unknown): ConversationSummary[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid conversations response: expected an array.')
  }

  return payload.map((item) => {
    if (!isConversationSummary(item)) {
      throw new Error('Invalid conversations response: malformed conversation item.')
    }
    return item
  })
}

function ensureSearchArray(payload: unknown): ConversationPeer[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid user search response: expected an array.')
  }

  return payload.map((item) => {
    if (!isConversationPeer(item)) {
      throw new Error('Invalid user search response: malformed user item.')
    }
    return item
  })
}

function ensureConversationDetail(payload: unknown): ConversationDetail {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid conversation detail response.')
  }

  const record = payload as Record<string, unknown>

  if (typeof record.conversationId !== 'string') {
    throw new Error('Invalid conversation detail response: missing conversation id.')
  }

  if (record.participant !== null && !isConversationPeer(record.participant)) {
    throw new Error('Invalid conversation detail response: malformed participant.')
  }

  if (!Array.isArray(record.items)) {
    throw new Error('Invalid conversation detail response: expected message array.')
  }

  return {
    conversationId: record.conversationId,
    participant: record.participant as ConversationPeer | null,
    items: record.items.map((item) => {
      if (!isPrivateMessageItem(item)) {
        throw new Error('Invalid conversation detail response: malformed message item.')
      }
      return item
    }),
  }
}

function ensurePrivateMessage(payload: unknown): PrivateMessageItem {
  if (!isPrivateMessageItem(payload)) {
    throw new Error('Invalid private message response.')
  }
  return payload
}

export const messagesApi = {
  getConversations: async (): Promise<ConversationSummary[]> => {
    const res = await api.get<{ success: boolean; data: ConversationSummary[] }>(
      '/messages/conversations',
    )
    return ensureConversationArray(res.data?.data)
  },

  createConversation: async (recipientId: string): Promise<ConversationSummary> => {
    const res = await api.post<{ success: boolean; data: ConversationSummary }>(
      '/messages/conversations',
      { recipientId },
    )
    if (!isConversationSummary(res.data?.data)) {
      throw new Error('Invalid conversation creation response.')
    }
    return res.data.data
  },

  getConversationMessages: async (conversationId: string): Promise<ConversationDetail> => {
    const res = await api.get<{ success: boolean; data: ConversationDetail }>(
      `/messages/conversations/${conversationId}/messages`,
    )
    return ensureConversationDetail(res.data?.data)
  },

  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<PrivateMessageItem> => {
    const res = await api.post<{ success: boolean; data: PrivateMessageItem }>(
      `/messages/conversations/${conversationId}/messages`,
      { content },
    )
    return ensurePrivateMessage(res.data?.data)
  },

  markAsRead: async (conversationId: string) => {
    const res = await api.patch<{ success: boolean; data: { conversationId: string; lastReadAt: string } }>(
      `/messages/conversations/${conversationId}/read`,
    )
    return res.data.data
  },

  searchUsers: async (query: string): Promise<ConversationPeer[]> => {
    const res = await api.get<{ success: boolean; data: ConversationPeer[] }>('/users/search', {
      params: { q: query },
    })
    return ensureSearchArray(res.data?.data)
  },
}
