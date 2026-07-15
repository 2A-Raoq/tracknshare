import { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { Button } from '@/components/ui'
import { messagesApi } from '@/services/messages.api'
import { createAuthenticatedSocket } from '@/lib/socket'
import { useKeyboardHeight } from '@/lib/useKeyboardHeight'
import { authStore } from '@/store/auth'
import { setActiveThread } from '@/store/notifications'
import type { PrivateMessageItem } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user, token } = useSnapshot(authStore)
  const [messages, setMessages] = useState<PrivateMessageItem[]>([])
  const [peer, setPeer] = useState<string>('Conversation')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<FlatList<PrivateMessageItem>>(null)
  const socketRef = useRef<Socket | null>(null)
  const insets = useSafeAreaInsets()
  const keyboardHeight = useKeyboardHeight()

  // Ne pas afficher de bannière pour la conversation ouverte à l'écran.
  useFocusEffect(
    useCallback(() => {
      setActiveThread(id ?? null)
      return () => setActiveThread(null)
    }, [id]),
  )

  useEffect(() => {
    if (!id) return
    let active = true

    messagesApi
      .getMessages(id)
      .then((detail) => {
        if (!active) return
        setMessages(detail.items)
        if (detail.participant?.username) setPeer(detail.participant.username)
      })
      .catch(() => {})
    messagesApi.markAsRead(id).catch(() => {})

    if (token) {
      const socket = createAuthenticatedSocket(token)
      socketRef.current = socket
      // (Re)joindre la room à chaque connexion : après une reconnexion auto
      // (perte réseau, veille), le serveur a oublié les rooms du socket.
      socket.on('connect', () => {
        socket.emit('conversation:join', { conversationId: id })
      })
      socket.on('private:message:new', (msg: PrivateMessageItem) => {
        if (msg.conversationId !== id) return
        setMessages((prev) =>
          prev.some((item) => item.id === msg.id) ? prev : [...prev, msg],
        )
      })
    }

    return () => {
      active = false
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [id, token])

  function send() {
    const content = text.trim()
    if (!content || !id) return
    setSending(true)
    const socket = socketRef.current
    if (socket?.connected) {
      socket.emit('private:message:send', { conversationId: id, content })
      setText('')
      setSending(false)
    } else {
      messagesApi
        .sendMessage(id, content)
        .then((msg) => {
          setMessages((prev) => [...prev, msg])
          setText('')
        })
        .finally(() => setSending(false))
    }
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: peer }} />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.sender.id === user?.id
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.other]}>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          )
        }}
      />
      <View
        style={[
          styles.inputRow,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + spacing.xs : insets.bottom + spacing.sm },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Button label="Envoyer" onPress={send} loading={sending} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  other: { alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt },
  content: { color: colors.text, fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    color: colors.text,
  },
})
