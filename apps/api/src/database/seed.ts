import * as dotenv from 'dotenv'
dotenv.config()

import { DataSource } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { Game } from '../games/entities/game.entity'
import { Season } from '../seasons/entities/season.entity'
import { PlayerStats } from '../stats/entities/player-stats.entity'
import { Team } from '../teams/entities/team.entity'
import { TeamMember } from '../teams/entities/team-member.entity'
import { ChatMessage } from '../teams/entities/chat-message.entity'
import { Conversation, ConversationType } from '../messages/entities/conversation.entity'
import { ConversationParticipant } from '../messages/entities/conversation-participant.entity'
import { PrivateMessage } from '../messages/entities/private-message.entity'
import { FriendRequest } from '../friends/entities/friend-request.entity'
import { Achievement } from '../achievements/entities/achievement.entity'
import { UserAchievement } from '../achievements/entities/user-achievement.entity'
import * as bcrypt from 'bcrypt'
import { calculateKdRatio, calculateWinrate, calculateScore } from '../stats/utils/score.calculator'

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'tracknshare',
  password: process.env.DB_PASSWORD ?? 'tracknshare',
  database: process.env.DB_NAME ?? 'tracknshare',
  entities: [
    User,
    Game,
    Season,
    PlayerStats,
    Team,
    TeamMember,
    ChatMessage,
    Conversation,
    ConversationParticipant,
    PrivateMessage,
    FriendRequest,
    Achievement,
    UserAchievement,
  ],
  synchronize: true,
})

const seedUsers = [
  { email: 'demo@tracknshare.local', username: 'DemoPlayer' },
  { email: 'clutch@tracknshare.local', username: 'ClutchMaster' },
  { email: 'sniper@tracknshare.local', username: 'SniperX' },
  { email: 'ace@tracknshare.local', username: 'AceKiller' },
  { email: 'rush@tracknshare.local', username: 'RushB' },
  { email: 'pro@tracknshare.local', username: 'ProGamer' },
  { email: 'noob@tracknshare.local', username: 'NewPlayer' },
  { email: 'ghost@tracknshare.local', username: 'GhostOp' },
  { email: 'titan@tracknshare.local', username: 'TitanFrag' },
  { email: 'nexus@tracknshare.local', username: 'NexusOne' },
  { email: 'blaze@tracknshare.local', username: 'BlazeRunner' },
  { email: 'void@tracknshare.local', username: 'VoidWalker' },
  { email: 'friendtest@tracknshare.local', username: 'FriendTester' },
  { email: 'searchtest@tracknshare.local', username: 'SearchTester' },
]

const seedGames = [
  { name: 'Valorant Mock', slug: 'valorant-mock', platform: 'PC', isTeamBased: true },
  { name: 'Rocket League Mock', slug: 'rl-mock', platform: 'PC', isTeamBased: true },
  { name: 'CS Mock', slug: 'cs-mock', platform: 'PC', isTeamBased: true },
]

const playerStatsData: Record<string, { kills: number; deaths: number; wins: number; losses: number; matchesPlayed: number; playtimeMinutes: number }> = {
  AceKiller:    { kills: 3200, deaths: 980,  wins: 72, losses: 18, matchesPlayed: 90,  playtimeMinutes: 3800 },
  TitanFrag:    { kills: 2900, deaths: 1100, wins: 65, losses: 25, matchesPlayed: 90,  playtimeMinutes: 3500 },
  GhostOp:      { kills: 2750, deaths: 950,  wins: 60, losses: 20, matchesPlayed: 80,  playtimeMinutes: 3200 },
  DemoPlayer:   { kills: 2600, deaths: 1050, wins: 55, losses: 25, matchesPlayed: 80,  playtimeMinutes: 3000 },
  ClutchMaster: { kills: 2400, deaths: 1200, wins: 50, losses: 30, matchesPlayed: 80,  playtimeMinutes: 2900 },
  ProGamer:     { kills: 2200, deaths: 1000, wins: 48, losses: 32, matchesPlayed: 80,  playtimeMinutes: 2800 },
  SniperX:      { kills: 2000, deaths: 900,  wins: 45, losses: 35, matchesPlayed: 80,  playtimeMinutes: 2600 },
  BlazeRunner:  { kills: 1800, deaths: 1100, wins: 40, losses: 40, matchesPlayed: 80,  playtimeMinutes: 2400 },
  NexusOne:     { kills: 1600, deaths: 1200, wins: 35, losses: 45, matchesPlayed: 80,  playtimeMinutes: 2200 },
  VoidWalker:   { kills: 1400, deaths: 1300, wins: 30, losses: 50, matchesPlayed: 80,  playtimeMinutes: 2000 },
  RushB:        { kills: 1200, deaths: 1400, wins: 25, losses: 55, matchesPlayed: 80,  playtimeMinutes: 1800 },
  NewPlayer:    { kills: 600,  deaths: 1800, wins: 10, losses: 60, matchesPlayed: 70,  playtimeMinutes: 1200 },
  FriendTester: { kills: 1750, deaths: 1120, wins: 39, losses: 36, matchesPlayed: 75,  playtimeMinutes: 2300 },
  SearchTester: { kills: 1680, deaths: 1080, wins: 37, losses: 34, matchesPlayed: 71,  playtimeMinutes: 2180 },
}

const DEMO_INVITE_CODE = 'DEMO0001'

const demoMessages = [
  { username: 'AceKiller',    content: "Salut l'équipe ! Prêts pour le match ce soir ?" },
  { username: 'TitanFrag',    content: 'Toujours partant. On se retrouve à 20h ?' },
  { username: 'DemoPlayer',   content: "Je serai là ! J'ai affiné ma config hier." },
  { username: 'GhostOp',      content: 'Bonne chance à tous. On va les démonter.' },
  { username: 'AceKiller',    content: "Let's go ! Track Masters en force" },
  { username: 'DemoPlayer',   content: "Mon K/D remonte bien cette saison, content de vous avoir dans l'équipe." },
]

const demoDirectMessages = [
  { username: 'DemoPlayer', content: 'Salut ClutchMaster, tu peux relire la strat avant ce soir ?' },
  { username: 'ClutchMaster', content: 'Oui, je check le scoreboard et je te fais un retour.' },
  { username: 'DemoPlayer', content: 'Parfait. Je passe par la conversation privée pour la démo.' },
]

const seedAchievements = [
  { code: 'FIRST_LOGIN', name: 'First Login', description: "Première connexion au MVP.", icon: 'LOGIN', points: 10 },
  { code: 'FIRST_STATS_SYNC', name: 'Stat Tracker', description: 'Première synchronisation de statistiques.', icon: 'SYNC', points: 20 },
  { code: 'TOP_5_LEADERBOARD', name: 'Top 5', description: 'Présent dans le top 5 du leaderboard.', icon: 'TOP5', points: 50 },
  { code: 'TEAM_FOUNDER', name: 'Team Founder', description: "Créateur ou capitaine d'équipe.", icon: 'TEAM', points: 30 },
  { code: 'SOCIAL_PLAYER', name: 'Social Player', description: 'Joueur actif dans les interactions sociales.', icon: 'SOCIAL', points: 25 },
  { code: 'FRIENDLY', name: 'Friendly', description: 'A déjà développé un lien social.', icon: 'FRIEND', points: 15 },
  { code: 'CHATTER', name: 'Chatter', description: 'A participé au chat de démonstration.', icon: 'CHAT', points: 15 },
]

const userAchievementMap: Record<string, string[]> = {
  DemoPlayer: ['FIRST_LOGIN', 'FIRST_STATS_SYNC', 'TOP_5_LEADERBOARD', 'TEAM_FOUNDER', 'SOCIAL_PLAYER', 'CHATTER'],
  FriendTester: ['FIRST_LOGIN', 'FRIENDLY'],
  SearchTester: ['FIRST_LOGIN'],
  ClutchMaster: ['FIRST_LOGIN', 'SOCIAL_PLAYER'],
  AceKiller: ['FIRST_LOGIN', 'TOP_5_LEADERBOARD'],
  TitanFrag: ['FIRST_LOGIN', 'TOP_5_LEADERBOARD'],
  GhostOp: ['FIRST_LOGIN', 'CHATTER'],
  ProGamer: ['FIRST_LOGIN'],
}

async function seed() {
  await dataSource.initialize()
  const userRepo    = dataSource.getRepository(User)
  const gameRepo    = dataSource.getRepository(Game)
  const seasonRepo  = dataSource.getRepository(Season)
  const statsRepo   = dataSource.getRepository(PlayerStats)
  const teamRepo    = dataSource.getRepository(Team)
  const memberRepo  = dataSource.getRepository(TeamMember)
  const messageRepo = dataSource.getRepository(ChatMessage)
  const conversationRepo = dataSource.getRepository(Conversation)
  const conversationParticipantRepo = dataSource.getRepository(ConversationParticipant)
  const privateMessageRepo = dataSource.getRepository(PrivateMessage)
  const achievementRepo = dataSource.getRepository(Achievement)
  const userAchievementRepo = dataSource.getRepository(UserAchievement)

  const passwordHash = await bcrypt.hash('Demo1234!', 10)

  // Upsert users
  const userMap: Record<string, User> = {}
  for (const u of seedUsers) {
    let user = await userRepo.findOne({ where: { email: u.email } })
    if (!user) {
      user = await userRepo.save(userRepo.create({ email: u.email, username: u.username, passwordHash }))
      console.log(`Created user: ${u.username}`)
    } else {
      console.log(`Exists: ${u.username}`)
    }
    userMap[u.username] = user
  }

  // Upsert games
  let valorant: Game | null = null
  for (const g of seedGames) {
    let game = await gameRepo.findOne({ where: { slug: g.slug } })
    if (!game) {
      game = await gameRepo.save(gameRepo.create(g))
      console.log(`Created game: ${g.name}`)
    }
    if (g.slug === 'valorant-mock') valorant = game
  }
  if (!valorant) valorant = await gameRepo.findOne({ where: { slug: 'valorant-mock' } }) as Game

  // Upsert active season
  let season = await seasonRepo.findOne({ where: { status: 'ACTIVE' } })
  if (!season) {
    season = await seasonRepo.save(seasonRepo.create({
      name: 'Saison 1 — 2026',
      startDate: '2026-01-01',
      endDate: null,
      status: 'ACTIVE',
    }))
    console.log('Created season: Saison 1 — 2026')
  }

  // Upsert PlayerStats
  for (const [username, raw] of Object.entries(playerStatsData)) {
    const user = userMap[username]
    if (!user) continue

    const kdRatio = calculateKdRatio(raw.kills, raw.deaths)
    const winrate = calculateWinrate(raw.wins, raw.matchesPlayed)
    const score = calculateScore(kdRatio, winrate, raw.matchesPlayed)

    let stats = await statsRepo.findOne({
      where: { userId: user.id, gameId: valorant.id, seasonId: season.id },
    })
    if (!stats) {
      stats = statsRepo.create({ userId: user.id, gameId: valorant.id, seasonId: season.id })
    }
    Object.assign(stats, { ...raw, kdRatio, winrate, score, fetchedAt: new Date() })
    await statsRepo.save(stats)
    console.log(`Stats for ${username}: score=${score}, kd=${kdRatio}, wr=${winrate}%`)
  }

  // Upsert demo team
  let team = await teamRepo.findOne({ where: { inviteCode: DEMO_INVITE_CODE } })
  if (!team) {
    const captain = userMap['DemoPlayer']
    team = await teamRepo.save(teamRepo.create({
      name: 'Track Masters',
      tag: 'TMS',
      description: "L'équipe officielle de démonstration Track'N Share.",
      ownerId: captain.id,
      inviteCode: DEMO_INVITE_CODE,
    }))
    console.log('Created team: Track Masters')
  } else {
    console.log('Exists: Track Masters')
  }

  // Upsert team members
  const teamMembersToAdd = [
    { username: 'DemoPlayer',   role: 'CAPTAIN' },
    { username: 'AceKiller',    role: 'MEMBER' },
    { username: 'TitanFrag',    role: 'MEMBER' },
    { username: 'GhostOp',      role: 'MEMBER' },
    { username: 'ClutchMaster', role: 'MEMBER' },
  ]

  for (const entry of teamMembersToAdd) {
    const user = userMap[entry.username]
    if (!user) continue
    const existing = await memberRepo.findOne({ where: { teamId: team.id, userId: user.id } })
    if (!existing) {
      await memberRepo.save(memberRepo.create({ teamId: team.id, userId: user.id, role: entry.role }))
      console.log(`Added member: ${entry.username} (${entry.role})`)
    }
  }

  // Seed demo messages (only if none exist)
  const messageCount = await messageRepo.count({ where: { teamId: team.id } })
  if (messageCount === 0) {
    for (const m of demoMessages) {
      const sender = userMap[m.username]
      if (!sender) continue
      await messageRepo.save(messageRepo.create({ teamId: team.id, senderId: sender.id, content: m.content }))
      console.log(`Message from ${m.username}: [logged]`)
    }
  }

  // Seed demo direct conversation
  const demoUser = userMap['DemoPlayer']
  const clutchUser = userMap['ClutchMaster']

  if (demoUser && clutchUser) {
    const existingParticipants = await conversationParticipantRepo.find({
      where: [{ userId: demoUser.id }, { userId: clutchUser.id }],
      relations: ['conversation', 'conversation.participants'],
    })

    let directConversation =
      existingParticipants
        .map((entry) => entry.conversation)
        .find(
          (conversation) =>
            conversation.type === ConversationType.DIRECT
            && conversation.participants.length === 2
            && conversation.participants.some((p) => p.userId === demoUser.id)
            && conversation.participants.some((p) => p.userId === clutchUser.id),
        ) ?? null

    if (!directConversation) {
      directConversation = await conversationRepo.save(
        conversationRepo.create({ type: ConversationType.DIRECT }),
      )

      await conversationParticipantRepo.save([
        conversationParticipantRepo.create({
          conversationId: directConversation.id,
          userId: demoUser.id,
          lastReadAt: new Date(),
        }),
        conversationParticipantRepo.create({
          conversationId: directConversation.id,
          userId: clutchUser.id,
          lastReadAt: new Date(),
        }),
      ])
      console.log('Created demo direct conversation.')
    }

    const privateCount = await privateMessageRepo.count({
      where: { conversationId: directConversation.id },
    })

    if (privateCount === 0) {
      for (const entry of demoDirectMessages) {
        const sender = userMap[entry.username]
        if (!sender) continue
        await privateMessageRepo.save(
          privateMessageRepo.create({
            conversationId: directConversation.id,
            senderId: sender.id,
            content: entry.content,
            editedAt: null,
            deletedAt: null,
          }),
        )
      }
      console.log('Created demo private messages.')
    }
  }

  // Upsert achievements
  const achievementMap: Record<string, Achievement> = {}
  for (const item of seedAchievements) {
    let achievement = await achievementRepo.findOne({ where: { code: item.code } })
    if (!achievement) {
      achievement = await achievementRepo.save(achievementRepo.create(item))
      console.log(`Created achievement: ${item.code}`)
    }
    achievementMap[item.code] = achievement
  }

  // Assign achievements to users
  for (const [username, codes] of Object.entries(userAchievementMap)) {
    const user = userMap[username]
    if (!user) continue

    for (const code of codes) {
      const achievement = achievementMap[code]
      if (!achievement) continue

      const existing = await userAchievementRepo.findOne({
        where: { userId: user.id, achievementId: achievement.id },
      })

      if (!existing) {
        await userAchievementRepo.save(
          userAchievementRepo.create({
            userId: user.id,
            achievementId: achievement.id,
          }),
        )
      }
    }
  }

  console.log('\nSeed complete.')
  console.log('Login:       demo@tracknshare.local / Demo1234!')
  console.log('Friend test: friendtest@tracknshare.local / Demo1234!')
  console.log('Search test: searchtest@tracknshare.local / Demo1234!')
  console.log('Invite code: DEMO0001')
  await dataSource.destroy()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
