import { api } from '@/lib/api'
import type {
  ApiEnvelope,
  ConversationDetail,
  ConversationPeer,
  ConversationSummary,
  PrivateMessageItem,
} from '@/types'

export const messagesApi = {
  getConversations: async () =>
    (await api.get<ApiEnvelope<ConversationSummary[]>>('/messages/conversations'))
      .data.data,

  createConversation: async (recipientId: string) =>
    (
      await api.post<ApiEnvelope<ConversationSummary>>('/messages/conversations', {
        recipientId,
      })
    ).data.data,

  getMessages: async (conversationId: string) =>
    (
      await api.get<ApiEnvelope<ConversationDetail>>(
        `/messages/conversations/${conversationId}/messages`,
      )
    ).data.data,

  sendMessage: async (conversationId: string, content: string) =>
    (
      await api.post<ApiEnvelope<PrivateMessageItem>>(
        `/messages/conversations/${conversationId}/messages`,
        { content },
      )
    ).data.data,

  markAsRead: async (conversationId: string) =>
    (await api.patch(`/messages/conversations/${conversationId}/read`)).data,

  searchUsers: async (query: string) =>
    (
      await api.get<ApiEnvelope<ConversationPeer[]>>('/users/search', {
        params: { q: query },
      })
    ).data.data,
}
