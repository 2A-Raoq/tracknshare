import { Link } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'

type ActionCard = {
  title: string
  description: string
  authPath: string
  guestPath: string
}

const actionCards: ActionCard[] = [
  {
    title: 'Check your stats',
    description: 'Open your mock profile, score and seasonal performance in one flow.',
    authPath: '/dashboard',
    guestPath: '/login',
  },
  {
    title: 'Build your team',
    description: 'Create a squad, invite players and organise roles for the demo match.',
    authPath: '/teams',
    guestPath: '/login',
  },
  {
    title: 'Climb the leaderboard',
    description: 'Compare score, K/D and winrate against seeded players.',
    authPath: '/leaderboard',
    guestPath: '/leaderboard',
  },
  {
    title: 'Chat with your team',
    description: 'Open the team room and keep the live chat visible for the jury.',
    authPath: '/teams',
    guestPath: '/login',
  },
]

export default function HomePage() {
  const { user, loading } = useSnapshot(authStore)
  const isAuthenticated = Boolean(user)
  const primaryHref = isAuthenticated ? '/dashboard' : '/login'
  const secondaryHref = isAuthenticated ? '/teams' : '/register'

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-badge" />
          <span>Track N&apos; Share</span>
        </Link>

        <nav className="nav-links">
          <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link href={isAuthenticated ? '/teams' : '/login'} className="nav-link">Teams</Link>
          <Link href={isAuthenticated ? '/dashboard' : '/login'} className="nav-link">
            {isAuthenticated ? 'Dashboard' : 'Demo access'}
          </Link>
        </nav>

        <div className="nav-actions">
          {!loading && !isAuthenticated && (
            <>
              <Link href="/login" className="ghost-button">Login</Link>
              <Link href="/register" className="primary-button">Register</Link>
            </>
          )}
          {!loading && isAuthenticated && (
            <>
              <Link href="/dashboard" className="secondary-button">Open dashboard</Link>
              <Link href="/teams" className="primary-button">Go to teams</Link>
            </>
          )}
        </div>
      </header>

      <main className="section-stack">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-kicker">Competitive PWA MVP</span>
              <h1>Own your stats. Build your squad. Dominate the board.</h1>
              <p>
                Track&apos;N Share centralises mock gaming stats, team management and live chat
                into one demonstrable competitive platform built for the MVP sprint.
              </p>
              <p className="hero-tagline">
                Make competitive games more challenging, build your team and dominate all of
                your opponents.
              </p>
              <div className="page-actions" style={{ marginTop: '20px' }}>
                <Link href={primaryHref} className="primary-button">
                  {isAuthenticated ? 'Open my dashboard' : 'Login with demo account'}
                </Link>
                <Link href={secondaryHref} className="secondary-button">
                  {isAuthenticated ? 'Manage my team' : 'Create an account'}
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div>
                <span className="hero-kicker">Sprint 4 ready</span>
                <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.05 }}>
                  Counter your rivals with visible stats, seeded teams and a clean demo path.
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="section-stack">
          <div className="section-heading">
            <h2>Four actions. One clear demo story.</h2>
            <p className="section-copy">
              Start from the landing page, log in, show the player dashboard, then move through
              leaderboard, teams and chat without losing the audience.
            </p>
          </div>

          <div className="action-grid">
            {actionCards.map((card) => (
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

        <section className="info-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Demo routes</h2>
                <p className="muted-text">
                  Keep navigation obvious during the soutenance.
                </p>
              </div>
            </div>
            <div className="button-row">
              <Link href="/leaderboard" className="ghost-button">Leaderboard</Link>
              <Link href={isAuthenticated ? '/dashboard' : '/login'} className="ghost-button">
                Dashboard
              </Link>
              <Link href={isAuthenticated ? '/teams' : '/login'} className="ghost-button">
                Teams
              </Link>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Ready for the jury</h2>
                <p className="muted-text">
                  Mock provider, seeded team and Swagger-backed APIs keep the experience stable.
                </p>
              </div>
            </div>
            <p className="section-copy">
              No Steam or Epic dependency, no hidden flows. The MVP stays focused on
              authentication, score visibility, leaderboard ranking, team access and team chat.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
