import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSnapshot } from 'valtio'
import { Button, Card, ErrorText, Muted, Screen, TextField, Title } from '@/components/ui'
import { usersApi } from '@/services/users.api'
import { authStore, clearSession } from '@/store/auth'
import { colors, spacing } from '@/theme'

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useSnapshot(authStore)
  const [username, setUsername] = useState(user?.username ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    if (username.trim().length < 3) {
      setError('Le pseudo doit faire au moins 3 caractères.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const updated = await usersApi.updateProfile({ username: username.trim() })
      if (authStore.user) authStore.user.username = updated.username
      setSaved(true)
    } catch {
      setError('Pseudo déjà utilisé ou erreur réseau.')
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    await clearSession()
    router.replace('/(auth)/login')
  }

  function confirmDelete() {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes tes données seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersApi.deleteAccount()
              await clearSession()
              router.replace('/(auth)/login')
            } catch {
              setError('La suppression a échoué.')
            }
          },
        },
      ],
    )
  }

  return (
    <Screen>
      <Title>Mon profil</Title>
      <Muted>{user?.email}</Muted>

      <Card>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Modifier mon pseudo</Text>
        <TextField
          label="Pseudo"
          value={username}
          onChangeText={(t) => {
            setUsername(t)
            setSaved(false)
          }}
        />
        <ErrorText>{error}</ErrorText>
        {saved && <Text style={{ color: colors.accent }}>Profil mis à jour ✓</Text>}
        <Button label="Enregistrer" onPress={handleSave} loading={busy} />
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: '700' }}>RGPD</Text>
        <Muted>Tu peux exporter ou supprimer tes données personnelles.</Muted>
        <Button
          label="Exporter mes données"
          variant="ghost"
          onPress={async () => {
            try {
              const data = await usersApi.exportMyData()
              Alert.alert(
                'Export RGPD',
                'Tes données ont été récupérées :\n\n' +
                  JSON.stringify(data, null, 2).slice(0, 500) +
                  '…',
              )
            } catch {
              setError("L'export a échoué.")
            }
          }}
        />
        <Button label="Supprimer mon compte" variant="danger" onPress={confirmDelete} />
      </Card>

      <View style={{ marginTop: spacing.md }}>
        <Button label="Se déconnecter" variant="ghost" onPress={handleLogout} />
      </View>
    </Screen>
  )
}
