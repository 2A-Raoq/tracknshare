import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'wouter'
import { z } from 'zod'
import { api } from '../services/api'
import { authStore } from '../store/auth.store'
import AppNavigation from '../components/AppNavigation'

// Aligné sur LoginDto côté back (email valide, mot de passe requis).
const loginSchema = z.object({
  email: z.email('Adresse email invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
})

type LoginFieldErrors = Partial<Record<'email' | 'password', string>>

function toFieldErrors(error: z.ZodError): LoginFieldErrors {
  const errors: LoginFieldErrors = {}
  for (const issue of error.issues) {
    const field = issue.path[0]
    if ((field === 'email' || field === 'password') && !errors[field]) {
      errors[field] = issue.message
    }
  }
  return errors
}

export default function LoginPage() {
  const [, navigate] = useLocation()
  const [email, setEmail] = useState('demo@tracknshare.local')
  const [password, setPassword] = useState('Demo1234!')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error))
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', result.data)
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
              Connectez-vous pour accéder à votre dashboard, vos équipes et vos messages.
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
              {fieldErrors.email && (
                <p className="status-message error">{fieldErrors.email}</p>
              )}
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
              {fieldErrors.password && (
                <p className="status-message error">{fieldErrors.password}</p>
              )}
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
