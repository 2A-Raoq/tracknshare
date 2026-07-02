import { useState } from 'react'
import { Text, View } from 'react-native'
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

export default function RegisterScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (username.trim().length < 3) {
      setError('Le pseudo doit faire au moins 3 caractères.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await authApi.register(email.trim(), username.trim(), password)
      await setSession(res.user, res.accessToken)
      router.replace('/(tabs)/dashboard')
    } catch {
      setError('Inscription impossible (email ou pseudo déjà utilisé ?).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <View style={{ gap: spacing.xs, marginTop: spacing.xl }}>
        <Title>Créer un compte</Title>
        <Muted>Rejoins la communauté Track&apos;N Share.</Muted>
      </View>

      <Card>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField label="Pseudo" value={username} onChangeText={setUsername} />
        <TextField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ErrorText>{error}</ErrorText>
        <Button label="S'inscrire" onPress={handleRegister} loading={loading} />
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.xs, justifyContent: 'center' }}>
        <Text style={{ color: colors.textMuted }}>Déjà un compte ?</Text>
        <Link href="/(auth)/login" style={{ color: colors.primary, fontWeight: '600' }}>
          Se connecter
        </Link>
      </View>
    </Screen>
  )
}
