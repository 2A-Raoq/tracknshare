import { useState } from 'react'
import { View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import {
  Button,
  Card,
  ErrorText,
  Muted,
  Screen,
  TextField,
  Title,
} from '@/components/ui'
import { authApi } from '@/services/auth.api'
import { setSession } from '@/store/auth'
import { colors, spacing } from '@/theme'
import { Text } from 'react-native'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(email.trim(), password)
      await setSession(res.user, res.accessToken)
      router.replace('/(tabs)/dashboard')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <View style={{ gap: spacing.xs, marginTop: spacing.xl }}>
        <Title>Track&apos;N Share</Title>
        <Muted>Connecte-toi pour suivre tes performances.</Muted>
      </View>

      <Card>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="demo@tracknshare.local"
        />
        <TextField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
        <ErrorText>{error}</ErrorText>
        <Button label="Se connecter" onPress={handleLogin} loading={loading} />
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.xs, justifyContent: 'center' }}>
        <Text style={{ color: colors.textMuted }}>Pas encore de compte ?</Text>
        <Link href="/(auth)/register" style={{ color: colors.primary, fontWeight: '600' }}>
          Créer un compte
        </Link>
      </View>
    </Screen>
  )
}
