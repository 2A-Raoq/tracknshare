import { Route, Switch } from 'wouter'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

import ProtectedRoute from './components/ProtectedRoute'

export default function AppRouter() {
  return (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>

      <Route path="/">
        <HomePage />
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>
    </Switch>
  )
}