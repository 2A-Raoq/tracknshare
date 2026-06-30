import { api } from '@/lib/api'
import type {
  ApiEnvelope,
  FriendRequestItem,
  FriendRequestsData,
  FriendUser,
} from '@/types'

export const friendsApi = {
  getFriends: async () =>
    (await api.get<ApiEnvelope<FriendUser[]>>('/friends')).data.data,

  getRequests: async () =>
    (await api.get<ApiEnvelope<FriendRequestsData>>('/friends/requests')).data
      .data,

  createRequest: async (recipientId: string) =>
    (
      await api.post<ApiEnvelope<FriendRequestItem>>('/friends/requests', {
        recipientId,
      })
    ).data.data,

  accept: async (requestId: string) =>
    (await api.patch(`/friends/requests/${requestId}/accept`)).data,

  refuse: async (requestId: string) =>
    (await api.patch(`/friends/requests/${requestId}/refuse`)).data,

  cancel: async (requestId: string) =>
    (await api.patch(`/friends/requests/${requestId}/cancel`)).data,

  remove: async (friendId: string) =>
    (await api.delete(`/friends/${friendId}`)).data,
}
