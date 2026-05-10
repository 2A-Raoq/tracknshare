export interface FriendUser {
  id: string
  username: string
  avatar: string | null
}

export interface FriendRequestItem {
  id: string
  status: string
  createdAt: string
  user: FriendUser
  senderId?: string
  recipientId?: string
}

export interface FriendRequestsData {
  incoming: FriendRequestItem[]
  outgoing: FriendRequestItem[]
}
