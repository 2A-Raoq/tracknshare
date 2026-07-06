import type { ReactNode } from 'react'
import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { Redirect } from 'wouter'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useSnapshot(authStore)

  // Attendre la fin du chargement de la session avant de décider.
  if (auth.loading) {
    return <p className="status-message">Chargement de la session...</p>
  }

  if (!auth.user) {
    return <Redirect to="/login" />
  }

  return <>{children}</>
}
