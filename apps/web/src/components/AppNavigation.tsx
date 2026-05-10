import { Link, useLocation } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'

export default function AppNavigation() {
  const { user, loading } = useSnapshot(authStore)
  const [location, navigate] = useLocation()

  function handleLogout() {
    authStore.user = null
    authStore.token = null
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  function linkClass(path: string) {
    const active = location === path || (path !== '/' && location.startsWith(path))
    return active ? 'nav-link nav-link--active' : 'nav-link'
  }

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-badge" />
        <span>Track N&apos; Share</span>
      </Link>

      {!loading && (
        <>
          <nav className="nav-links">
            <Link href="/leaderboard" className={linkClass('/leaderboard')}>Leaderboard</Link>
            {user && (
              <>
                <Link href="/teams" className={linkClass('/teams')}>Équipes</Link>
                <Link href="/friends" className={linkClass('/friends')}>Amis</Link>
                <Link href="/messages" className={linkClass('/messages')}>Messages</Link>
                <Link href={`/players/${user.username}`} className={linkClass(`/players/${user.username}`)}>
                  {user.username}
                </Link>
              </>
            )}
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard') + ' ghost-button'}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="primary-button">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="ghost-button">Connexion</Link>
                <Link href="/register" className="primary-button">Inscription</Link>
              </>
            )}
          </div>
        </>
      )}
    </header>
  )
}
