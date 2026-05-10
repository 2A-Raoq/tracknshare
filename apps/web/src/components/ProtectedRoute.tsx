import { useSnapshot } from 'valtio'
import { authStore } from '../store/auth.store'
import { Redirect } from 'wouter'

export default function ProtectedRoute({ children }: any) {
  const auth = useSnapshot(authStore)

  // 🔥 IMPORTANT : attendre le chargement
  if (auth.loading) {
    return <div>Loading...</div>
  }

  if (!auth.user) {
    return <Redirect to="/login" />
  }

  return children
}