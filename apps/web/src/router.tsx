import { Route, Switch } from 'wouter'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import MessagesPage from './pages/MessagesPage'
import ConversationPage from './pages/ConversationPage'
import PublicProfilePage from './pages/PublicProfilePage'
import FriendsPage from './pages/FriendsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function AppRouter() {
  return (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>
      <Route path="/leaderboard">
        <LeaderboardPage />
      </Route>
      <Route path="/players/:username">
        <PublicProfilePage />
      </Route>
      <Route path="/teams">
        <ProtectedRoute>
          <TeamsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/teams/:teamId">
        <ProtectedRoute>
          <TeamDetailPage />
        </ProtectedRoute>
      </Route>
      <Route path="/messages">
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/messages/:conversationId">
        <ProtectedRoute>
          <ConversationPage />
        </ProtectedRoute>
      </Route>
      <Route path="/friends">
        <ProtectedRoute>
          <FriendsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  )
}
