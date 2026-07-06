// @tracknshare/shared-types — types de réponse de l'API NestJS partagés
// entre apps/web et apps/mobile.
//
// RÈGLES :
// - 100% types (interfaces / type aliases). AUCUN export de valeur runtime :
//   les consommateurs utilisent `import type`, intégralement effacé à la
//   compilation, donc ni Vite ni Metro n'ont à résoudre ce module au runtime.
// - La forme des types suit ce que renvoie apps/api (source de vérité).
// - Les types spécifiques à un client (props UI, stores) restent dans l'app.

export type { ApiEnvelope } from './common'
export type { AuthUser, AuthResult } from './auth'
export type {
  GameInfo,
  SeasonInfo,
  PlayerStatsData,
  LeaderboardEntry,
  LeaderboardData,
} from './stats'
export type {
  TeamSummary,
  TeamMemberInfo,
  TeamStats,
  TeamDetail,
  ChatMessage,
} from './teams'
export type {
  ConversationPeer,
  ConversationMessagePreview,
  ConversationSummary,
  PrivateMessageItem,
  ConversationDetail,
} from './messages'
export type { FriendUser, FriendRequestItem, FriendRequestsData } from './friends'
export type { AchievementItem } from './achievements'
export type {
  PublicPlayerStats,
  PublicPlayerGame,
  PublicPlayerSeason,
  PublicPlayerTeam,
  PublicAchievementBadge,
  PublicPlayerProfile,
} from './players'
