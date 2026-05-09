import AppRouter from './router'
import { useAuth } from './hooks/useAuth'
import { useSocket } from './hooks/useSocket'

export default function App() {
  useAuth()
  useSocket()

  return <AppRouter />
}