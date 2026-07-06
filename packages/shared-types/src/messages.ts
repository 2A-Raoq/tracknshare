export interface ConversationPeer {
  id: string
  username: string | null
  avatar: string | null
}

export interface ConversationMessagePreview {
  id: string
  senderId: string
  content: string
  createdAt: string
}

export interface ConversationSummary {
  id: string
  type: string
  participant: ConversationPeer | null
  lastMessage: ConversationMessagePreview | null
  updatedAt: string
  createdAt: string
  lastReadAt: string | null
}

export interface PrivateMessageItem {
  id: string
  conversationId: string
  sender: {
    id: string
    username: string | null
  }
  content: string
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
}

export interface ConversationDetail {
  conversationId: string
  participant: ConversationPeer | null
  items: PrivateMessageItem[]
}
