import { Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import AppNavigation from '../components/AppNavigation'

type ActionCard = {
  title: string
  description: string
  authPath: string
  guestPath: string
}

const ACTION_CARDS: ActionCard[] = [
  {
    title: 'Mes stats',
    description: 'Score, K/D, winrate et progression saisonnière en un coup d’œil.',
    authPath: '/dashboard',
    guestPath: '/login',
  },
  {
    title: 'Leaderboard',
    description: 'Classement solo en temps réel. Compare ton rang contre tous les joueurs.',
    authPath: '/leaderboard',
    guestPath: '/leaderboard',
  },
  {
    title: 'Équipes',
    description: 'Crée ta squad, invite des joueurs via code et attribue les rôles.',
    authPath: '/teams',
    guestPath: '/login',
  },
  {
    title: 'Messages',
    description: 'Chat d’équipe et messages privés 1-to-1 dans un layout Discord-like.',
    authPath: '/messages',
    guestPath: '/login',
  },
  {
    title: 'Amis',
    description: 'Envoie des demandes d’amis, consulte les profils publics des joueurs.',
    authPath: '/friends',
    guestPath: '/login',
  },
  {
    title: 'Achievements',
    description: 'Badges débloquables avec barre de progression en temps réel sur chaque objectif.',
    authPath: '/dashboard',
    guestPath: '/login',
  },
]

export default function HomePage() {
  const { user, loading } = useSnapshot(authStore)
  const isAuthenticated = Boolean(user)

  return (
    <div className="app-shell">
      <AppNavigation />

      <main className="section-stack">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-kicker">Track&apos;N Share — Gaming Platform MVP</span>
              <h1>Own your stats. Build your squad. Dominate the board.</h1>
              <p>
                Suis tes performances, gère ton équipe et compare-toi aux autres joueurs
                depuis un seul tableau de bord compétitif.
              </p>
              {!loading && (
                <div className="page-actions" style={{ marginTop: '20px' }}>
                  <Link
                    href={isAuthenticated ? '/dashboard' : '/login'}
                    className="primary-button"
                  >
                    {isAuthenticated ? 'Ouvrir le dashboard' : 'Se connecter'}
                  </Link>
                  <Link
                    href={isAuthenticated ? '/leaderboard' : '/register'}
                    className="secondary-button"
                  >
                    {isAuthenticated ? 'Voir le leaderboard' : 'Créer un compte'}
                  </Link>
                </div>
              )}
            </div>

            <div className="hero-visual">
              <div>
                <span className="hero-kicker">DemoPlayer — Saison 1</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                  <div className="status-card" style={{ padding: '12px 14px' }}>
                    <p className="muted-text" style={{ margin: 0, fontSize: '0.75rem' }}>Score</p>
                    <strong style={{ fontSize: '1.4rem' }}>1&nbsp;850</strong>
                  </div>
                  <div className="status-card" style={{ padding: '12px 14px' }}>
                    <p className="muted-text" style={{ margin: 0, fontSize: '0.75rem' }}>Rang</p>
                    <strong style={{ fontSize: '1.4rem' }}>#3</strong>
                  </div>
                  <div className="status-card" style={{ padding: '12px 14px' }}>
                    <p className="muted-text" style={{ margin: 0, fontSize: '0.75rem' }}>K/D</p>
                    <strong style={{ fontSize: '1.4rem' }}>1.84</strong>
                  </div>
                  <div className="status-card" style={{ padding: '12px 14px' }}>
                    <p className="muted-text" style={{ margin: 0, fontSize: '0.75rem' }}>Winrate</p>
                    <strong style={{ fontSize: '1.4rem' }}>62%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature cards ────────────────────────────────── */}
        <section className="section-stack">
          <div className="section-heading">
            <h2>Tout ce que tu peux faire</h2>
            <p className="section-copy">
              Six fonctionnalités démontrables, tracées de bout en bout avec des données mockées stables.
            </p>
          </div>

          <div className="action-grid">
            {ACTION_CARDS.map((card) => (
              <Link
                key={card.title}
                href={isAuthenticated ? card.authPath : card.guestPath}
                className="action-card"
              >
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Info / Demo ───────────────────────────────────── */}
        <section className="info-grid">
          <div className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Accès rapide</h2>
              <p className="section-copy">Toutes les pages pour la démonstration.</p>
            </div>
            <div className="button-row" style={{ flexWrap: 'wrap' }}>
              <Link href="/leaderboard" className="ghost-button">Leaderboard</Link>
              <Link href={isAuthenticated ? '/dashboard' : '/login'} className="ghost-button">
                Dashboard
              </Link>
              <Link href={isAuthenticated ? '/teams' : '/login'} className="ghost-button">
                Équipes
              </Link>
              <Link href={isAuthenticated ? '/messages' : '/login'} className="ghost-button">
                Messages
              </Link>
              <Link href={isAuthenticated ? '/friends' : '/login'} className="ghost-button">
                Amis
              </Link>
              {isAuthenticated && user && (
                <Link href={`/players/${user.username}`} className="ghost-button">
                  Mon profil
                </Link>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="section-heading" style={{ marginBottom: '16px' }}>
              <h2>Compte démo</h2>
              <p className="section-copy">Données stables pour la soutenance.</p>
            </div>
            <ul className="metric-list">
              <li className="metric-row">
                <span className="muted-text">Email</span>
                <strong>demo@tracknshare.local</strong>
              </li>
              <li className="metric-row">
                <span className="muted-text">Mot de passe</span>
                <strong>Demo1234!</strong>
              </li>
              <li className="metric-row">
                <span className="muted-text">Code équipe</span>
                <strong>DEMO0001</strong>
              </li>
              <li className="metric-row">
                <span className="muted-text">Provider</span>
                <strong>MockProvider</strong>
              </li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  )
}
