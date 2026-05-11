# Track'N Share

Plateforme gaming compétitive permettant aux joueurs de suivre, partager et comparer leurs performances. Dashboard joueur, leaderboard, équipes, chat, messages privés, amis, profils publics et badges.

## Stack

| Couche | Technologies |
|--------|--------------|
| Front-end | React 18, TypeScript, Vite, PWA, Valtio, wouter |
| Back-end | NestJS 11, TypeScript, Passport JWT |
| Temps réel | Socket.io |
| BDD | PostgreSQL 16 |
| Cache / rate limiting | Redis 7 |
| Monorepo | pnpm workspaces + Turborepo |

## Prérequis

- Node.js 20+
- pnpm 10+
- Docker Desktop (pour PostgreSQL et Redis)

## Installation

```bash
# Cloner le dépôt
git clone <url>
cd tracknshare

# Installer les dépendances
pnpm install
```

## Variables d'environnement

### API (`apps/api/.env`)

Copier depuis l'exemple :

```bash
cp apps/api/.env.example apps/api/.env
```

Variables clés :

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `PORT` | `3000` | Port d'écoute de l'API |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_USER` | `tracknshare` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `tracknshare` | Mot de passe PostgreSQL |
| `DB_NAME` | `tracknshare` | Nom de la base |
| `JWT_SECRET` | *(voir .env.example)* | Secret JWT — **changer en prod** |
| `JWT_EXPIRES_IN` | `1d` | Durée de vie du token |
| `MESSAGE_ENCRYPTION_KEY` | *(obligatoire)* | Clé base64 32 bytes pour chiffrer les messages au repos |
| `STEAM_API_KEY` | *(optionnel)* | Clé Steam Web API utilisée uniquement côté API |
| `CORS_ORIGIN` | `http://localhost:5173` | Origine autorisée par CORS |

### Web (`apps/web/.env`)

```bash
cp apps/web/.env.example apps/web/.env
```

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de l'API |
| `VITE_SOCKET_URL` | `http://localhost:3000` | URL Socket.io |

## Lancement

### 1. Démarrer l'infrastructure Docker

```bash
docker compose up -d
```

Lance PostgreSQL (port 5432) et Redis (port 6379).

### 2. Seed de la base de données

```bash
pnpm --filter api seed
```

### 3. Démarrer le projet

```bash
# Tout en même temps (Turborepo)
pnpm dev

# Ou séparément
pnpm --filter api dev    # API sur http://localhost:3000
pnpm --filter web dev    # Web sur http://localhost:5173
```

### Build de production

```bash
pnpm build
```

## Comptes de démonstration

| Email | Mot de passe | Pseudo | Rôle |
|-------|-------------|--------|------|
| `demo@tracknshare.local` | `Demo1234!` | DemoPlayer | Compte principal |
| `friendtest@tracknshare.local` | `Demo1234!` | FriendTester | Test amis |
| `searchtest@tracknshare.local` | `Demo1234!` | SearchTester | Test recherche |

Code d'invitation équipe : **DEMO0001**

## Parcours de démonstration

1. Ouvrir `http://localhost:5173`
2. Se connecter : `demo@tracknshare.local` / `Demo1234!`
3. Dashboard — voir les stats et le score
4. Synchroniser les stats (MockProvider)
5. Leaderboard — classement global
6. Profil public d'un joueur (`/players/AceKiller`)
7. Demande d'ami depuis un profil public
8. Équipes — rejoindre ou créer (`/teams`, code `DEMO0001`)
9. Chat d'équipe en temps réel
10. Messages privés (`/messages`)
11. Badges / achievements (`/dashboard`)
12. Swagger : `http://localhost:3000/docs`

## Routes disponibles

| Route | Protection | Description |
|-------|-----------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/dashboard` | Auth | Dashboard joueur |
| `/leaderboard` | Public | Classement |
| `/players/:username` | Public | Profil public |
| `/teams` | Auth | Mes équipes |
| `/teams/:id` | Auth + Membre | Détail équipe + chat |
| `/messages` | Auth | Conversations privées |
| `/messages/:id` | Auth + Participant | Conversation |
| `/friends` | Auth | Amis et demandes |
| `/profile` | Auth | Mon profil |

## API

Swagger disponible sur `http://localhost:3000/docs` quand l'API est lancée.

## Intégration Steam

- `STEAM_API_KEY` reste uniquement côté API. Elle ne doit jamais être exposée au front.
- Obtenir une clé Steam Web API : `https://steamcommunity.com/dev/apikey`
- Le SteamID à lier doit être un `SteamID64` public.
- Certaines données Steam exigent un profil public.
- Steam ne fournit pas toujours des statistiques détaillées homogènes sur les kills, deaths ou winrate.
- Dans ce MVP, le sync Steam produit donc des stats Track'N Share simplifiées et cohérentes à partir du profil et du temps de jeu disponible.
- Si Steam échoue ou n'est pas configuré, le `MockProvider` reste disponible pour la démo via le sync standard.

## Sécurité

- Les mots de passe sont hashés avec `bcrypt` et `passwordHash` n'est jamais exposé dans les réponses publiques.
- `JWT_SECRET` et `JWT_EXPIRES_IN` doivent venir de l'environnement API.
- Les messages privés et les messages d'équipe sont chiffrés au repos en `AES-256-GCM`.
- Le front ne reçoit jamais la clé de chiffrement, ni les champs internes `encryptedContent`, `iv` ou `authTag`.
- `MESSAGE_ENCRYPTION_KEY` est obligatoire côté API et doit contenir une clé base64 de 32 bytes.
- Ce chiffrement protège les données au repos côté serveur, mais ce n'est pas du chiffrement de bout en bout.
- En production, HTTPS doit être activé partout.

Générer une clé locale :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Limites connues du MVP

- Les statistiques sont **mockées** (pas d'intégration Steam/Epic réelle)
- Pas de refresh token — l'expiration du JWT force une reconnexion
- Pas de modération de contenu
- Pas de notifications push
- Pas d'upload d'avatar réel
- La bio joueur est toujours `null` (champ prévu mais non éditable dans le MVP)
- Le score est calculé uniquement lors de la sync des stats
