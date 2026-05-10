import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'wouter'
import { api } from '../services/api'
import { authStore } from '../store/auth.store'
import AppNavigation from '../components/AppNavigation'

export default function LoginPage() {
  const [, navigate] = useLocation()
  const [email, setEmail] = useState('demo@tracknshare.local')
  const [password, setPassword] = useState('Demo1234!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user, accessToken } = res.data.data
      authStore.user = user
      authStore.token = accessToken
      localStorage.setItem('access_token', accessToken)
      navigate('/dashboard')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <AppNavigation />

      <div className="auth-grid">
        <aside className="auth-aside">
          <span className="hero-kicker">Demo account ready</span>
          <h1>Connect and open the competitive flow in one click.</h1>
          <p className="section-copy">
            Use the seeded account to display player stats, score, leaderboard rank, team access
            and the team chat during the presentation.
          </p>
          <div className="panel" style={{ marginTop: '22px' }}>
            <h2 style={{ marginBottom: '10px' }}>Suggested path</h2>
            <p className="muted-text">Login, show the dashboard, sync stats, open leaderboard, then teams and chat.</p>
          </div>
        </aside>

        <section className="auth-card">
          <div className="section-heading" style={{ marginBottom: '18px' }}>
            <h1>Connexion</h1>
            <p className="section-copy">
              Compte démo prérempli pour accélérer la démonstration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="form-stack">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="demo@tracknshare.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="Demo1234!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="status-message error">{error}</p>}

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
              <Link href="/" className="ghost-button">Retour à l&apos;accueil</Link>
            </div>
          </form>

          <p className="muted-text" style={{ marginTop: '18px' }}>
            Pas encore de compte ? <Link href="/register" className="nav-link">S&apos;inscrire</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
