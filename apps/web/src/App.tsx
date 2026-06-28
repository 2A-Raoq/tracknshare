import { Link } from 'wouter'
import AppRouter from './router'
import { useAuth } from './hooks/useAuth'
import ConsentBanner from './components/ConsentBanner'

export default function App() {
  useAuth()
  return (
    <>
      <AppRouter />
      <footer className="app-footer" style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.7, fontSize: '0.85rem' }}>
        <Link href="/privacy" className="nav-link">
          Politique de confidentialité
        </Link>
      </footer>
      <ConsentBanner />
    </>
  )
}
