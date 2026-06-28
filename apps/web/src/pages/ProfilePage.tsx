import { useState } from 'react'
import { Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { usersApi } from '../services/users.api'
import AppNavigation from '../components/AppNavigation'

export default function ProfilePage() {
  const { user } = useSnapshot(authStore)
  const [username, setUsername] = useState(user?.username ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = username.trim()
    if (trimmed.length < 3) {
      setError('Le pseudo doit faire au moins 3 caractères.')
      return
    }
    setError('')
    setStatus('saving')
    try {
      await usersApi.updateProfile({ username: trimmed })
      if (authStore.user) authStore.user.username = trimmed
      setStatus('saved')
    } catch (err: unknown) {
      setStatus('idle')
      const code = (err as { response?: { data?: { message?: string } } })?.response
        ?.data?.message
      setError(
        code === 'USER_USERNAME_ALREADY_EXISTS'
          ? 'Ce pseudo est déjà utilisé.'
          : 'La mise à jour a échoué. Réessayez.',
      )
    }
  }

  return (
    <div className="page-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="panel">
          <div className="section-heading" style={{ marginBottom: '16px' }}>
            <h1>Mon profil</h1>
            <p className="section-copy">Modifiez vos informations de joueur.</p>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Pseudo</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setStatus('idle')
                }}
                minLength={3}
                maxLength={30}
                required
              />
            </div>

            {error && <p className="status-message error">{error}</p>}
            {status === 'saved' && <p className="status-message">Profil mis à jour.</p>}

            <div className="button-row">
              <button
                type="submit"
                className="primary-button"
                disabled={status === 'saving'}
              >
                {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              {user?.username && (
                <Link href={`/players/${user.username}`} className="ghost-button">
                  Voir mon profil public
                </Link>
              )}
            </div>
          </form>
        </section>

        <section className="panel">
          <p className="muted-text">
            Gestion de vos données personnelles (export, suppression) :{' '}
            <Link href="/privacy" className="nav-link">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
