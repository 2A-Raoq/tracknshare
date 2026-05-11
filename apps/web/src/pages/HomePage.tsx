import { Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import AppNavigation from '../components/AppNavigation'

type FeatureCard = {
  title: string
  description: string
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'Stats',
    description: 'Visualisez vos performances, votre score, votre K/D et votre winrate.',
  },
  {
    title: 'Classements',
    description: 'Comparez votre progression avec les autres joueurs.',
  },
  {
    title: 'Équipes',
    description: 'Rejoignez une équipe, échangez avec vos membres et suivez votre roster.',
  },
  {
    title: 'Social',
    description: 'Ajoutez des amis, envoyez des messages privés et débloquez des badges.',
  },
]

export default function HomePage() {
  const { user, loading } = useSnapshot(authStore)
  const isAuthenticated = Boolean(user)

  const primaryHref = isAuthenticated ? '/dashboard' : '/register'
  const primaryLabel = isAuthenticated ? 'Ouvrir le dashboard' : 'Commencer'
  const secondaryHref = isAuthenticated ? '/leaderboard' : '/login'
  const secondaryLabel = isAuthenticated ? 'Voir le leaderboard' : 'Se connecter'
  const footerSecondaryHref = isAuthenticated ? '/dashboard' : '/login'
  const footerSecondaryLabel = isAuthenticated ? 'Dashboard' : 'Connexion'

  return (
    <div className="app-shell">
      <AppNavigation />

      <main className="section-stack">
        <section className="hero">
          <div className="hero-grid" style={{ padding: '36px 24px' }}>
            <div className="hero-copy">
              <span className="hero-kicker">Gaming performance platform</span>
              <h1>Track&apos;N Share</h1>
              <p style={{ fontSize: '1.08rem', color: 'var(--text)' }}>
                Suivez vos performances, comparez vos stats et progressez avec votre équipe.
              </p>
              <p>
                Une plateforme gaming pour centraliser vos statistiques, vos classements, vos
                équipes, vos messages et vos badges.
              </p>

              {!loading && (
                <div className="page-actions" style={{ marginTop: '24px' }}>
                  <Link href={primaryHref} className="primary-button">
                    {primaryLabel}
                  </Link>
                  <Link href={secondaryHref} className="secondary-button">
                    {secondaryLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section-stack">
          <div className="section-heading">
            <h2>Ce que fait Track&apos;N Share</h2>
            <p className="section-copy">
              Les outils essentiels pour suivre votre progression et rester connecté à votre
              écosystème de jeu.
            </p>
          </div>

          <div className="action-grid">
            {FEATURE_CARDS.map((card) => (
              <article key={card.title} className="action-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Pensé pour les joueurs compétitifs</h2>
            <p className="section-copy">
              Track&apos;N Share rassemble les outils essentiels pour suivre votre progression et
              rester connecté à votre équipe.
            </p>
          </div>

          <div className="button-row" style={{ marginTop: '8px' }}>
            <span className="pill">Dashboard joueur</span>
            <span className="pill">Chat et messages</span>
            <span className="pill">Badges et progression</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <strong>Track&apos;N Share</strong>
          <p className="muted-text">Gaming performance platform</p>
        </div>
        <div className="button-row">
          <Link href="/leaderboard" className="ghost-button">Leaderboard</Link>
          <Link href={footerSecondaryHref} className="ghost-button">
            {footerSecondaryLabel}
          </Link>
          {!isAuthenticated && (
            <Link href="/register" className="ghost-button">Inscription</Link>
          )}
        </div>
      </footer>
    </div>
  )
}
