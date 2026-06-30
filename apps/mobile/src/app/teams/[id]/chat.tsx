import { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements'
import { useLocalSearchParams } from 'expo-router'
import { useSnapshot } from 'valtio'
import type { Socket } from 'socket.io-client'
import { Button } from '@/components/ui'
import { teamsApi } from '@/services/teams.api'
import { createAuthenticatedSocket } from '@/lib/socket'
import { authStore } from '@/store/auth'
import type { ChatMessage } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function TeamChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user, token } = useSnapshot(authStore)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<FlatList<ChatMessage>>(null)
  const socketRef = useRef<Socket | null>(null)
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    if (!id) return
    let active = true

    teamsApi
      .getMessages(id)
      .then((m) => active && setMessages(m))
      .catch(() => {})

    if (token) {
      const socket = createAuthenticatedSocket(token)
      socketRef.current = socket
      socket.emit('team:join', { teamId: id })
      socket.on('team:message:new', (msg: ChatMessage) => {
        if (msg.teamId === id) setMessages((prev) => [...prev, msg])
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
      // Le message revient via team:message:new pour tous (dont l'émetteur).
      socket.emit('team:message:send', { teamId: id, content })
      setText('')
      setSending(false)
    } else {
      // Repli REST si le socket n'est pas connecté.
      teamsApi
        .sendMessage(id, content)
        .then((msg) => {
          setMessages((prev) => [...prev, msg])
          setText('')
        })
        .finally(() => setSending(false))
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
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
                {!mine && (
                  <Text style={styles.author}>{item.sender.username ?? 'Joueur'}</Text>
                )}
                <Text style={styles.content}>{item.content}</Text>
              </View>
            )
          }}
        />
        <View style={styles.inputRow}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  other: { alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt },
  author: { color: colors.textMuted, fontSize: 11, marginBottom: 2 },
  content: { color: colors.text, fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
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
