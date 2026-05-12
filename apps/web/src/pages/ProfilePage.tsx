import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'

export default function ProfilePage() {
  const { user } = useSnapshot(authStore)
  const [, navigate] = useLocation()

  useEffect(() => {
    if (user?.username) {
      navigate(`/players/${user.username}`, { replace: true })
    }
  }, [navigate, user?.username])

  return (
    <div className="page-shell">
      <p className="status-message">Redirection vers votre profil joueur...</p>
    </div>
  )
}
