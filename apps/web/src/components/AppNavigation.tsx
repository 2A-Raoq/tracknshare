import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { IconTrophy, IconShield, IconUserPlus, IconMessage, IconUser } from './NavIcons'

export default function AppNavigation() {
  const { user, loading } = useSnapshot(authStore)
  const [location, navigate] = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close on route change (handles Link clicks in mobile menu)
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  function close() {
    setMenuOpen(false)
  }

  function handleLogout() {
    authStore.user = null
    authStore.token = null
    localStorage.removeItem('access_token')
    close()
    navigate('/login')
  }

  function linkClass(path: string) {
    const active = location === path || (path !== '/' && location.startsWith(path))
    return active ? 'nav-link nav-link--active' : 'nav-link'
  }

  function mobileLinkClass(path: string) {
    const active = location === path || (path !== '/' && location.startsWith(path))
    return `mobile-menu__link${active ? ' nav-link--active' : ''}`
  }

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-badge" />
          <span>Track N&apos; Share</span>
        </Link>

        {!loading && (
          <>
            {/* Desktop nav — hidden on mobile via CSS */}
            <nav className="nav-links">
              <Link href="/leaderboard" className={linkClass('/leaderboard')}>
                <IconTrophy />
                Leaderboard
              </Link>
              {user && (
                <>
                  <Link href="/teams" className={linkClass('/teams')}>
                    <IconShield />
                    Équipes
                  </Link>
                  <Link href="/friends" className={linkClass('/friends')}>
                    <IconUserPlus />
                    Amis
                  </Link>
                  <Link href="/messages" className={linkClass('/messages')}>
                    <IconMessage />
                    Messages
                  </Link>
                  <Link href={`/players/${user.username}`} className={linkClass(`/players/${user.username}`)}>
                    <IconUser />
                    {user.username}
                  </Link>
                </>
              )}
            </nav>

            <div className="nav-actions">
              {user ? (
                <>
                  <Link href="/dashboard" className={`${linkClass('/dashboard')} ghost-button`}>
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

            {/* Burger button — visible on mobile only */}
            <button
              className="burger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </>
        )}
      </header>

      {/* Mobile menu — conditional, so not in DOM on desktop unless resized */}
      {menuOpen && (
        <>
          <div className="mobile-overlay" onClick={close} aria-hidden="true" />

          <nav
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation mobile"
          >
            <div className="mobile-menu__header">
              <Link href="/" className="brand" onClick={close}>
                <span className="brand-badge" />
                <span>Track N&apos; Share</span>
              </Link>
              <button
                className="mobile-menu__close"
                onClick={close}
                aria-label="Fermer le menu"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mobile-menu__links">
              {!user && (
                <Link href="/" className={mobileLinkClass('/')}>
                  Accueil
                </Link>
              )}
              <Link href="/leaderboard" className={mobileLinkClass('/leaderboard')}>
                <IconTrophy size={18} />
                Leaderboard
              </Link>
              {user && (
                <>
                  <Link href="/teams" className={mobileLinkClass('/teams')}>
                    <IconShield size={18} />
                    Équipes
                  </Link>
                  <Link href="/friends" className={mobileLinkClass('/friends')}>
                    <IconUserPlus size={18} />
                    Amis
                  </Link>
                  <Link href="/messages" className={mobileLinkClass('/messages')}>
                    <IconMessage size={18} />
                    Messages
                  </Link>
                  <Link
                    href={`/players/${user.username}`}
                    className={mobileLinkClass(`/players/${user.username}`)}
                  >
                    <IconUser size={18} />
                    {user.username}
                  </Link>
                  <Link href="/dashboard" className={mobileLinkClass('/dashboard')}>
                    Dashboard
                  </Link>
                </>
              )}
              {!user && (
                <>
                  <Link href="/login" className={mobileLinkClass('/login')}>
                    Connexion
                  </Link>
                  <Link href="/register" className={mobileLinkClass('/register')}>
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {user && (
              <div className="mobile-menu__footer">
                <button onClick={handleLogout} className="primary-button" style={{ width: '100%' }}>
                  Déconnexion
                </button>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  )
}
