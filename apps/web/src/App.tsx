import AppRouter from './router'
import { useAuth } from './hooks/useAuth'

export default function App() {
  useAuth()
  return <AppRouter />
}
