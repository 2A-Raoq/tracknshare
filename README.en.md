# Track'N Share

> 🇫🇷 [Version française](README.md)

Competitive gaming platform that lets players track, share and compare their performance. Player dashboard, leaderboard, teams, real-time chat, private messages, friends, public profiles and badges.

## Stack

| Layer | Technologies |
|-------|--------------|
| Front-end | React 18, TypeScript, Vite, PWA, Valtio, wouter |
| Mobile | Expo (SDK 54), React Native, expo-router, Valtio |
| Back-end | NestJS 11, TypeScript, Passport JWT |
| Real-time | Socket.io |
| Database | PostgreSQL 16 |
| Cache / rate limiting | Redis 7 |
| Monorepo | pnpm workspaces + Turborepo |

## Requirements

- Node.js 20+
- pnpm 10+
- Docker Desktop (for PostgreSQL and Redis)

## Installation

```bash
# Clone the repository
git clone <url>
cd tracknshare

# Install dependencies
pnpm install
```

## Environment variables

### API (`apps/api/.env`)

Copy from the example file:

```bash
cp apps/api/.env.example apps/api/.env
```

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | API listening port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `tracknshare` | PostgreSQL user |
| `DB_PASSWORD` | `tracknshare` | PostgreSQL password |
| `DB_NAME` | `tracknshare` | Database name |
| `JWT_SECRET` | *(see .env.example)* | JWT secret — **change it in production** |
| `JWT_EXPIRES_IN` | `1d` | Token lifetime |
| `MESSAGE_ENCRYPTION_KEY` | *(required)* | Base64 32-byte key used to encrypt messages at rest |
| `STEAM_API_KEY` | *(optional)* | Steam Web API key, used server-side only |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin(s) allowed by CORS (comma-separated) |

### Web (`apps/web/.env`)

```bash
cp apps/web/.env.example apps/web/.env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | API base URL |
| `VITE_SOCKET_URL` | `http://localhost:3000` | Socket.io URL |

## Running the project

### 1. Start the Docker infrastructure

```bash
docker compose up -d
```

Starts PostgreSQL (port 5432) and Redis (port 6379).

### 2. Seed the database

```bash
pnpm --filter api seed
```

### 3. Start the apps

```bash
# Everything at once (Turborepo)
pnpm dev

# Or separately
pnpm --filter api dev    # API on http://localhost:3000
pnpm --filter web dev    # Web on http://localhost:5173
```

### Production build

```bash
pnpm build
```

### Mobile app (Expo)

`apps/mobile` lives outside the pnpm workspace (Expo constraints) and manages
its own npm dependencies:

```bash
cd apps/mobile
npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL / EXPO_PUBLIC_SOCKET_URL
                       # to the LAN IP of the machine hosting the API
npm start              # then scan the QR code with Expo Go
```

The app consumes the same NestJS API as the web front-end. The mobile
typecheck (`npx tsc --noEmit`) runs in a dedicated CI job.

### Shared types (`packages/shared-types`)

API response types are shared between web and mobile through the internal
`@tracknshare/shared-types` package (types only, no runtime code). The web app
consumes it as a pnpm workspace dependency; the mobile app through a tsconfig
`paths` alias (`import type` statements are erased at compile time, so Metro
never has to resolve the package).

## Demo accounts

| Email | Password | Username | Role |
|-------|----------|----------|------|
| `demo@tracknshare.local` | `Demo1234!` | DemoPlayer | Main account |
| `friendtest@tracknshare.local` | `Demo1234!` | FriendTester | Friends testing |
| `searchtest@tracknshare.local` | `Demo1234!` | SearchTester | Search testing |

Team invite code: **DEMO0001**

## Demo walkthrough

1. Open `http://localhost:5173`
2. Log in: `demo@tracknshare.local` / `Demo1234!`
3. Dashboard — stats and score
4. Sync stats (MockProvider)
5. Leaderboard — global ranking
6. A player's public profile (`/players/AceKiller`)
7. Send a friend request from a public profile
8. Teams — join or create (`/teams`, code `DEMO0001`)
9. Real-time team chat
10. Private messages (`/messages`)
11. Badges / achievements (`/dashboard`)
12. Swagger: `http://localhost:3000/docs`

## Available routes

| Route | Protection | Description |
|-------|-----------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/dashboard` | Auth | Player dashboard |
| `/leaderboard` | Public | Ranking |
| `/players/:username` | Public | Public profile |
| `/teams` | Auth | My teams |
| `/teams/:id` | Auth + Member | Team detail + chat |
| `/messages` | Auth | Private conversations |
| `/messages/:id` | Auth + Participant | Conversation |
| `/friends` | Auth | Friends and requests |
| `/profile` | Auth | My profile |

## API

Swagger is available at `http://localhost:3000/docs` while the API is running.

## Steam integration

- `STEAM_API_KEY` stays on the API side only. It must never be exposed to the front-end.
- Get a Steam Web API key: `https://steamcommunity.com/dev/apikey`
- The linked SteamID must be a public `SteamID64`.
- Some Steam data requires a public profile.
- Steam does not always provide consistent detailed stats for kills, deaths or winrate.
- In this MVP, the Steam sync therefore produces simplified, consistent Track'N Share stats from the profile and available playtime.
- If Steam fails or is not configured, the `MockProvider` remains available for the demo through the standard sync.

## Security

- Passwords are hashed with `bcrypt` and `passwordHash` is never exposed in public responses.
- `JWT_SECRET` and `JWT_EXPIRES_IN` must come from the API environment.
- Private and team messages are encrypted at rest with `AES-256-GCM`.
- The front-end never receives the encryption key nor the internal `encryptedContent`, `iv` or `authTag` fields.
- `MESSAGE_ENCRYPTION_KEY` is required on the API side and must contain a base64-encoded 32-byte key.
- This protects data at rest on the server; it is not end-to-end encryption.
- In production, HTTPS must be enabled everywhere.

Generate a local key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Known MVP limitations

- Stats are **mocked** (no full Steam/Epic integration)
- No refresh token — JWT expiration forces a new login
- No content moderation
- No push notifications
- No real avatar upload
- Player bio is always `null` (field planned but not editable in the MVP)
- The score is only computed when stats are synced