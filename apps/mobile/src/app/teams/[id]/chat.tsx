import { useCallback, useRef, useState } from 'react'
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
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSnapshot } from 'valtio'
import { Button } from '@/components/ui'
import { teamsApi } from '@/services/teams.api'
import { authStore } from '@/store/auth'
import type { ChatMessage } from '@/types'
import { colors, radius, spacing } from '@/theme'

export default function TeamChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useSnapshot(authStore)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<FlatList<ChatMessage>>(null)

  const load = useCallback(async () => {
    if (!id) return
    try {
      setMessages(await teamsApi.getMessages(id))
    } catch {
      setMessages([])
    }
  }, [id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  async function send() {
    const content = text.trim()
    if (!content || !id) return
    setSending(true)
    try {
      const msg = await teamsApi.sendMessage(id, content)
      setMessages((prev) => [...prev, msg])
      setText('')
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
