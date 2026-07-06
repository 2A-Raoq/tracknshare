// Types partagés avec l'API NestJS (réponses { success, data }).
//
// Source de vérité : packages/shared-types, résolu via l'alias tsconfig
// `@tracknshare/shared-types` (paths). Le package est 100% types : tous les
// imports sont des `import type`, effacés à la compilation — Metro ne résout
// jamais ce module au runtime (pas de dépendance npm, pas de symlink).

export type {
  ApiEnvelope,
  AuthUser,
  AuthResult,
  GameInfo,
  SeasonInfo,
  PlayerStatsData,
  LeaderboardEntry,
  LeaderboardData,
  TeamSummary,
  TeamMemberInfo,
  TeamStats,
  TeamDetail,
  ChatMessage,
  FriendUser,
  FriendRequestItem,
  FriendRequestsData,
  ConversationPeer,
  ConversationMessagePreview,
  ConversationSummary,
  PrivateMessageItem,
  ConversationDetail,
  AchievementItem,
  PublicPlayerStats,
  PublicAchievementBadge,
  PublicPlayerProfile,
} from '@tracknshare/shared-types'

// Alias historique côté mobile. La forme canonique (alignée sur l'API, avec
// `game`/`season` toujours présents) est PlayerStatsData — cela corrige la
// divergence qui avait causé le bug gameName vs game.name.
export type { PlayerStatsData as PlayerStat } from '@tracknshare/shared-types'
