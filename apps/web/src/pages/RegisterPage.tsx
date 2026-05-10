import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'wouter'
import { api } from '../services/api'
import { authStore } from '../store/auth.store'
import AppNavigation from '../components/AppNavigation'

type RegisterError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function RegisterPage() {
  const [, navigate] = useLocation()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, username, password })
      const { user, accessToken } = res.data.data
      authStore.user = user
      authStore.token = accessToken
      localStorage.setItem('access_token', accessToken)
      navigate('/dashboard')
    } catch (err) {
      const apiError = err as RegisterError
      setError(apiError.response?.data?.message ?? "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <AppNavigation />

      <div className="auth-grid">
        <aside className="auth-aside">
          <span className="hero-kicker">Join the board</span>
          <h1>Create a player profile and jump straight into the seeded ecosystem.</h1>
          <p className="section-copy">
            Registration stays simple for the MVP: email, username, password, then direct access
            to the dashboard and protected routes.
          </p>
        </aside>

        <section className="auth-card">
          <div className="section-heading" style={{ marginBottom: '18px' }}>
            <h1>Inscription</h1>
            <p className="section-copy">
              Créez un compte pour tester le dashboard, les équipes et le chat.
            </p>
          </div>

          <form onSubmit={handleRegister} className="form-stack">
            <div className="field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="demo@tracknshare.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="register-username">Pseudo</label>
              <input
                id="register-username"
                placeholder="Pseudo (3 à 30 caractères)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="register-password">Mot de passe</label>
              <input
                id="register-password"
                type="password"
                placeholder="Mot de passe (8 caractères min.)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="status-message error">{error}</p>}

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
              <Link href="/" className="ghost-button">Retour à l&apos;accueil</Link>
            </div>
          </form>

          <p className="muted-text" style={{ marginTop: '18px' }}>
            Déjà un compte ? <Link href="/login" className="nav-link">Se connecter</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
