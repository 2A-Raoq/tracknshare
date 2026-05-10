import { api } from './api'
import type { FriendRequestItem, FriendRequestsData, FriendUser } from '../types/friends'

function isFriendUser(value: unknown): value is FriendUser {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.username === 'string'
    && (typeof record.avatar === 'string' || record.avatar === null)
  )
}

function ensureFriendArray(payload: unknown): FriendUser[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid friends response: expected an array.')
  }

  return payload.map((item) => {
    if (!isFriendUser(item)) {
      throw new Error('Invalid friends response: malformed friend item.')
    }
    return item
  })
}

function isFriendRequestItem(value: unknown): value is FriendRequestItem {
  const record = value as Record<string, unknown>
  return (
    !!value
    && typeof value === 'object'
    && typeof record.id === 'string'
    && typeof record.status === 'string'
    && typeof record.createdAt === 'string'
    && (typeof record.senderId === 'string' || typeof record.senderId === 'undefined')
    && (typeof record.recipientId === 'string' || typeof record.recipientId === 'undefined')
    && isFriendUser(record.user)
  )
}

function ensureFriendRequests(payload: unknown): FriendRequestsData {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid friend requests response.')
  }

  const record = payload as Record<string, unknown>
  const incoming = Array.isArray(record.incoming) ? record.incoming : []
  const outgoing = Array.isArray(record.outgoing) ? record.outgoing : []

  return {
    incoming: incoming.map((item) => {
      if (!isFriendRequestItem(item)) {
        throw new Error('Invalid friend requests response: malformed incoming request.')
      }
      return item
    }),
    outgoing: outgoing.map((item) => {
      if (!isFriendRequestItem(item)) {
        throw new Error('Invalid friend requests response: malformed outgoing request.')
      }
      return item
    }),
  }
}

export const friendsApi = {
  getFriends: async (): Promise<FriendUser[]> => {
    const res = await api.get<{ success: boolean; data: FriendUser[] }>('/friends')
    return ensureFriendArray(res.data?.data)
  },

  getFriendRequests: async (): Promise<FriendRequestsData> => {
    const res = await api.get<{ success: boolean; data: FriendRequestsData }>('/friends/requests')
    return ensureFriendRequests(res.data?.data)
  },

  createFriendRequest: async (recipientId: string): Promise<FriendRequestItem> => {
    const res = await api.post<{ success: boolean; data: FriendRequestItem }>('/friends/requests', {
      recipientId,
    })
    if (!isFriendRequestItem(res.data?.data)) {
      throw new Error('Invalid friend request creation response.')
    }
    return res.data.data
  },

  acceptFriendRequest: async (requestId: string) => {
    const res = await api.patch<{ success: boolean; data: unknown }>(
      `/friends/requests/${requestId}/accept`,
    )
    return res.data.data
  },

  refuseFriendRequest: async (requestId: string) => {
    const res = await api.patch<{ success: boolean; data: unknown }>(
      `/friends/requests/${requestId}/refuse`,
    )
    return res.data.data
  },

  cancelFriendRequest: async (requestId: string) => {
    const res = await api.patch<{ success: boolean; data: unknown }>(
      `/friends/requests/${requestId}/cancel`,
    )
    return res.data.data
  },

  removeFriend: async (friendId: string) => {
    const res = await api.delete<{ success: boolean; data: unknown }>(`/friends/${friendId}`)
    return res.data.data
  },

  getRequests: async (): Promise<FriendRequestsData> => friendsApi.getFriendRequests(),
  createRequest: async (recipientId: string): Promise<FriendRequestItem> =>
    friendsApi.createFriendRequest(recipientId),
  acceptRequest: async (requestId: string) => friendsApi.acceptFriendRequest(requestId),
  refuseRequest: async (requestId: string) => friendsApi.refuseFriendRequest(requestId),
  cancelRequest: async (requestId: string) => friendsApi.cancelFriendRequest(requestId),
}
