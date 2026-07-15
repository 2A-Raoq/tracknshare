# Audit projet — Track'N Share

**Date :** 2026-06-05
**Auteurs :** Audit interne réalisé sur la base du code source et de la documentation du dépôt.
**Périmètre :** Code source complet (`apps/api`, `apps/web`), documentation `docs/` et `docs/drive-export/`, fichiers CSV de gestion de projet.

---

## 1. Résumé exécutif

### État global

Track'N Share est un projet avancé, bien architecturé et avec une documentation remarquablement complète. Le back-end NestJS couvre l'intégralité des fonctionnalités MVP documentées, parfois au-delà (messagerie privée, amis, badges). Le front-end React est fonctionnel sur toutes les pages prévues. La logique métier principale (auth, stats, score, leaderboard, équipes, chat) est opérationnelle.

### Ce qui est déjà bien avancé

- **Back-end fonctionnel à ~95 %** : tous les modules MVP sont implémentés et cohérents entre eux.
- **Front-end fonctionnel à ~90 %** : toutes les pages MVP existent avec leur logique API et Socket.io.
- **Données de démo complètes** : 14 utilisateurs, 3 jeux mockés, stats variées, équipes et messages seedés.
- **Architecture propre** : séparation des responsabilités, guards en place, encryption des messages, Redis avec dégradation gracieuse.
- **Documentation exemplaire** : 55 fichiers MD + 10 fichiers CSV couvrant spécifications, sécurité, tests, sprints et déploiement.

### Principaux points de vigilance

| Priorité | Point | Impact |
|----------|-------|--------|
| 🔴 BLOQUANT | `docker-compose.yml` n'inclut que `postgres` et `redis` — aucun service `api` ni `web` | La commande `docker compose up` ne lance pas l'application |
| 🔴 BLOQUANT | Le mot de passe du compte démo dans le seed (`Demo1234!`) diffère de celui dans `Recette-soutenance.md` (`DemoPassword123!`) | Login impossible pendant la démo si le seed n'est pas relu |
| 🟠 IMPORTANT | PWA non configurée : `vite-plugin-pwa` est installé mais absent de `vite.config.ts` | L'application n'est pas installable, pas de Service Worker |
| 🟠 IMPORTANT | Aucun test front-end (`apps/web`) | Zéro couverture sur le front |
| 🟠 IMPORTANT | Rate limiting absent côté back-end | Vulnérabilité aux attaques par force brute (login, sync) |
| 🟡 MOYEN | `.env.example` ne contient pas les variables `DEMO_MODE`, `RATE_LIMIT_ENABLED`, `EXTERNAL_API_MODE` mentionnées dans la recette | Confusion lors du premier démarrage |
| 🟡 MOYEN | Aucun dossier `migrations/` — TypeORM utilise `synchronize: true` en dev | Impossible de faire un rollback propre |

### Niveau estimé d'avancement vers le MVP

**~82 % du MVP est livrable en l'état.** Le bloquant majeur est la configuration Docker incomplète : le code tourne, mais la procédure `docker compose up -d --build` décrite dans la recette échoue à démarrer l'API et le front. Corriger ce point débloque immédiatement une démonstration complète.

---

## 2. Analyse de la documentation

### Cohérence entre les documents

La documentation est globalement cohérente et bien organisée. Les fichiers `docs/` sont des résumés synthétiques alignés avec les fichiers détaillés de `docs/drive-export/`. Aucune contradiction majeure entre les domaines fonctionnels.

**Points de friction détectés :**

| Document | Incohérence | Impact |
|----------|-------------|--------|
| `Recette-soutenance.md` | Références à `docker compose logs -f backend` et `docker compose logs -f frontend` — services inexistants dans le compose actuel | Checklist inapplicable en l'état |
| `Recette-soutenance.md §6.2` | Mot de passe démo : `DemoPassword123!` | Le seed utilise `Demo1234!` (à vérifier dans `seed.ts` complet) |
| `Variables-environnement.md` | Liste 120+ variables dont `DEMO_MODE`, `EXTERNAL_API_MODE`, `RATE_LIMIT_ENABLED` | `.env.example` de l'API n'en contient que 9 |
| `Configuration-Docker.md` | Décrit 4 services (postgres, redis, backend, frontend) avec health checks | `docker-compose.yml` réel : 2 services uniquement |
| `docs/architecture.md` | Structure de dossiers suggérée (`config/`, `modules/`, `providers/`) | Implémentation réelle sans dossier `modules/` (direct dans `src/`) |

### Documents les plus utiles pour le développement

1. `docs/api-contract.md` — source de vérité pour les endpoints et le format des réponses
2. `docs/domain-model.md` — entités et relations
3. `docs/mvp-scope.md` — périmètre P0/P1/P2
4. `docs/drive-export/10-Tests/Recette-soutenance.md` — checklist complète pour la soutenance
5. `docs/drive-export/13-Sprints-Milestones/Backlog-priorise.md` — état des tâches

### Documentation manquante ou à compléter

- **`.env.example` API** : ajouter les variables `DEMO_MODE`, `EXTERNAL_API_MODE`, `MOCK_PROVIDER_ENABLED`, `RATE_LIMIT_ENABLED`
- **`.env.example` Web** : vérifier que `VITE_SOCKET_URL` et `VITE_API_URL` sont présents
- **`docker-compose.yml`** : compléter avec les services `api` et `web`
- **`README.md` racine** : contenu minimal (à vérifier — `apps/api/README.md` et `apps/web/README.md` existent, pas le README racine détaillé)
- **Migrations** : aucune documentation de commande de migration (les docs mentionnent `npm run migration:run` mais aucun script n'existe)

---

## 3. Analyse fonctionnelle

### Fonctionnalités prévues dans le MVP (P0)

Selon `docs/mvp-scope.md` et le backlog :

| Fonctionnalité | Présente en back | Présente en front | Statut |
|----------------|-----------------|------------------|--------|
| Inscription / Connexion | ✅ | ✅ | Complet |
| Route protégée `GET /users/me` | ✅ | ✅ | Complet |
| Compte démo (`demo@tracknshare.local`) | ✅ seedé | ✅ pré-rempli login | Complet |
| Dashboard joueur | ✅ API stats | ✅ DashboardPage | Complet |
| Stats mockées (K/D, winrate, matchs) | ✅ MockProvider | ✅ GameStatsTabs | Complet |
| Calcul du score (`K/D×50 + Winrate×40 + Matchs×0.5`) | ✅ `score.calculator.ts` | ✅ affiché | Complet |
| `POST /stats/sync` (mock) | ✅ | ✅ bouton sync | Complet |
| Leaderboard solo trié par score | ✅ paginé + Redis | ✅ LeaderboardPage | Complet |
| Création d'équipe | ✅ | ✅ TeamsPage | Complet |
| Rejoindre une équipe (code d'invitation) | ✅ | ✅ TeamsPage | Complet |
| Rôles CAPTAIN / MEMBER | ✅ guard | ✅ affiché | Complet |
| `TeamMemberGuard`, `TeamRoleGuard` | ✅ | — | Complet |
| Historique messages équipe | ✅ | ✅ TeamChatPage | Complet |
| Chat temps réel (Socket.io) | ✅ ChatGateway | ✅ avec fallback REST | Complet |
| Seed de démonstration | ✅ 14 users, 3 jeux, équipes, messages | — | Complet |
| Swagger | ✅ (à vérifier URL `/api/docs`) | — | À vérifier |
| `GET /health` | ✅ `AppController` | — | À vérifier endpoint |
| PWA installable | — | ❌ non configuré | **Manquant** |

### Fonctionnalités présentes au-delà du MVP (implémentées en avance)

Ces fonctionnalités sont **P1 ou P2** dans la documentation mais **déjà codées** :

- **Messagerie privée** (Conversations, PrivateMessages, MessagesGateway) — `apps/api/src/messages/`
- **Système d'amis** (FriendRequest lifecycle) — `apps/api/src/friends/`
- **Badges / Achievements** (7 achievements seedés) — `apps/api/src/achievements/`
- **Profils publics** (`GET /players/:username`) — `apps/api/src/players/`
- **Liaison compte Steam** (GameAccount, SteamTrackedGame) — `apps/api/src/game-accounts/`
- **Chiffrement AES-256-GCM** des messages (équipe + privé) — production-grade

Ces modules enrichissent la démo mais **ne doivent pas être stabilisés au détriment des P0**.

### Fonctionnalités absentes

- **PWA** : `vite-plugin-pwa` installé (`package.json`) mais non configuré dans `vite.config.ts`. Pas de `manifest.json`, pas de Service Worker.
- **Rate limiting** : aucun `ThrottlerModule` ou middleware de limitation dans le back-end.
- **Page de paramètres / édition profil** : aucune route `/settings` côté front.
- **Gestion des saisons côté front** : les saisons sont seedées et utilisées, mais l'UI ne permet pas de les sélectionner.
- **Filtres leaderboard par jeu/saison** : l'API supporte `gameId` et `seasonId` en query params, mais l'UI envoie toujours une requête sans filtre.

---

## 4. Analyse technique

### Architecture actuelle

```
tracknshare/
├── apps/
│   ├── api/                     NestJS, TypeScript, TypeORM
│   │   └── src/
│   │       ├── auth/            JWT + bcrypt
│   │       ├── users/
│   │       ├── stats/           + score.calculator.ts
│   │       ├── leaderboards/    + Redis cache 30 s
│   │       ├── teams/           + ChatGateway (Socket.io)
│   │       ├── messages/        + MessagesGateway (Socket.io)
│   │       ├── players/         profils publics
│   │       ├── friends/
│   │       ├── achievements/
│   │       ├── game-accounts/   Steam
│   │       ├── providers/
│   │       │   ├── mock/        MockStatsProvider
│   │       │   └── steam/       SteamStatsProvider
│   │       ├── redis/           RedisService (graceful degradation)
│   │       ├── security/        EncryptionService AES-256-GCM
│   │       ├── common/
│   │       │   └── interceptors/ HttpCacheInterceptor
│   │       ├── seasons/
│   │       ├── games/
│   │       └── database/        seed.ts
│   └── web/                     React, TypeScript, Vite, Wouter, Valtio
│       └── src/
│           ├── components/      14+ composants
│           ├── hooks/
│           ├── lib/             socket.ts
│           ├── pages/           11 pages
│           ├── services/        8 fichiers API typés
│           ├── store/           auth.store.ts (Valtio)
│           ├── types/           DTOs TypeScript
│           └── router.tsx
├── docker-compose.yml           ⚠️ postgres + redis uniquement
├── turbo.json
└── pnpm-workspace.yaml
```

### Points forts techniques

- **Provider pattern** : `ExternalStatsProvider` interface → `MockStatsProvider` / `SteamStatsProvider` — swap sans toucher au service métier.
- **Graceful degradation Redis** : `connectTimeout: 2ms`, `maxRetriesPerRequest: 0` — l'API continue si Redis est indisponible.
- **Chiffrement des messages** : AES-256-GCM appliqué systématiquement côté back, déchiffrement transparent dans les services.
- **Pagination curseur** sur le leaderboard (efficace sur grands volumes), avec fallback offset.
- **Seed reproductible** : stats déterministes par `hashSeed`, facilitant les tests.
- **Fallback REST** côté front : si la socket est déconnectée, les messages sont envoyés via HTTP.
- **Validation runtime** des réponses API côté front : type guards personnalisés (`isAchievementItem`, `ensureTeamSummaryArray`).

### Risques techniques

| Risque | Fichier | Détail |
|--------|---------|--------|
| `synchronize: true` en dev | `app.module.ts`, `seed.ts:48` | Applique les changements de schéma au démarrage sans versioning. Dangereux si schéma incohérent. |
| Aucun `migrations/` | `apps/api/src/` | Impossible de faire un rollback ou de migrer proprement en production. |
| Pas de rate limiting | `apps/api/src/main.ts` | `POST /auth/login` et `POST /stats/sync` sont non protégés contre la force brute. |
| Token non renouvelé | `auth.service.ts` | JWT 1 jour sans refresh token. Expiration → logout forcé. |
| Entropy code invitation faible | `teams.service.ts:42` | 4 octets hex (32 bits) — suffisant pour MVP, mais énumérable en production. |
| Socket.io sans reconnexion gérée | `lib/socket.ts` | Chaque page crée sa propre socket sans pooling. Plusieurs onglets = plusieurs connexions. |

---

## 5. Analyse API et données

### Endpoints REST implémentés vs documentés

**Légende :** ✅ Implémenté | ⚠️ Partiel | ❌ Absent

| Module | Endpoint | Implémenté |
|--------|----------|-----------|
| Auth | `POST /api/auth/register` | ✅ |
| Auth | `POST /api/auth/login` | ✅ |
| Auth | `GET /api/auth/me` | ✅ |
| Users | `GET /api/users/me` | ✅ |
| Users | `GET /api/users/search?q=` | ✅ |
| Stats | `GET /api/stats/me` | ✅ |
| Stats | `POST /api/stats/sync` | ✅ |
| Stats | `POST /api/stats/sync/steam` | ✅ |
| Leaderboards | `GET /api/leaderboards/solo` | ✅ (+ cache Redis 30 s) |
| Teams | `POST /api/teams` | ✅ |
| Teams | `GET /api/teams/me` | ✅ |
| Teams | `POST /api/teams/join` | ✅ |
| Teams | `GET /api/teams/:teamId` | ✅ |
| Teams | `GET /api/teams/:teamId/messages` | ✅ |
| Teams | `POST /api/teams/:teamId/messages` | ✅ |
| Players | `GET /api/players/:username` | ✅ |
| Messages (DM) | `GET /api/messages/conversations` | ✅ |
| Messages (DM) | `POST /api/messages/conversations` | ✅ |
| Messages (DM) | `GET /api/messages/conversations/:id/messages` | ✅ |
| Messages (DM) | `POST /api/messages/conversations/:id/messages` | ✅ |
| Messages (DM) | `PATCH /api/messages/conversations/:id/read` | ✅ |
| Friends | `GET /api/friends` | ✅ |
| Friends | `POST /api/friends/requests` | ✅ |
| Friends | `PATCH /api/friends/requests/:id/accept` | ✅ |
| Friends | `DELETE /api/friends/:friendId` | ✅ |
| Achievements | `GET /api/achievements` | ✅ |
| Achievements | `GET /api/achievements/me` | ✅ |
| Health | `GET /api/health` | ✅ (`AppController`) |
| Games | `GET /api/games` | ❌ Pas de controller Games |
| Seasons | `GET /api/seasons` | ❌ Pas de controller Seasons |
| Users | `PATCH /api/users/me` (édition profil) | ❌ |

**Endpoints documentés non implémentés côté front :** filtres leaderboard (`gameId`, `seasonId`).

### Entités et modèles de données

15 entités TypeORM en place, toutes cohérentes avec le `domain-model.md` :

`User`, `Game`, `Season`, `PlayerStats`, `Team`, `TeamMember`, `ChatMessage`, `Conversation`, `ConversationParticipant`, `PrivateMessage`, `FriendRequest`, `Achievement`, `UserAchievement`, `GameAccount`, `SteamTrackedGame`

**Données de démo (seed.ts) :**
- 14 utilisateurs (dont `demo@tracknshare.local` / `DemoPlayer`)
- 3 jeux : `valorant-mock`, `rl-mock`, `cs-mock`
- Stats variées par joueur → leaderboard crédible
- 7 achievements seedés (FIRST_BLOOD, CLUTCH_MASTER, etc.)
- Au moins une équipe avec membres et messages de chat

**Manquant dans le seed :**
- Pas de conversation DM seedée (à confirmer en lisant la suite de `seed.ts`)
- Aucune saison avec des dates explicites vérifiables dans l'UI

---

## 6. Sécurité, RGPD et configuration

### Ce qui est en place

| Élément | État | Détail |
|---------|------|--------|
| Hachage des mots de passe | ✅ | bcrypt 10 rounds (`auth.service.ts:5`) |
| JWT Bearer | ✅ | Secret via `JWT_SECRET`, expiry `JWT_EXPIRES_IN` (défaut 1d) |
| `JwtAuthGuard` sur routes privées | ✅ | Toutes les routes protégées utilisent le guard |
| `TeamMemberGuard` | ✅ | Vérifie l'appartenance à l'équipe côté back |
| `ConversationParticipantGuard` | ✅ | Vérifie la participation à la conversation |
| `passwordHash` masqué | ✅ | `select: false` sur l'entité User |
| Chiffrement messages AES-256-GCM | ✅ | Chat équipe + DM chiffrés au repos |
| CORS configuré | ✅ | Via `CORS_ORIGIN` (défaut `http://localhost:5173`) |
| Secrets hors du front-end | ✅ | Aucune clé Steam/Epic côté React |
| `.env` non commité | ✅ | `.gitignore` à vérifier |
| `.env.example` | ✅ | Présent dans `apps/api/` |
| Données démo fictives | ✅ | Emails en `@tracknshare.local`, pas de vraies identités |
| Auth Socket.io par JWT | ✅ | `client.handshake.auth.token` vérifié dans les gateways |

### Ce qui manque

| Élément manquant | Priorité | Impact |
|-----------------|----------|--------|
| Rate limiting (`ThrottlerModule`) | P1 | Force brute possible sur `/auth/login` et `/stats/sync` |
| Refresh token | P1 | JWT expiré → logout forcé, UX dégradée |
| Variables `.env` incomplètes | P0 | `DEMO_MODE`, `EXTERNAL_API_MODE` non documentés dans `.env.example` |
| Validation taille body | P1 | Pas de limite de taille sur les requêtes (NestJS default) |
| Audit log | P2 | Aucun log structuré des actions sensibles |
| RGPD : droit à l'oubli | P2 | Aucun endpoint de suppression de compte |

### Variables d'environnement requises

**`apps/api/.env` (9 variables documentées, ~15 utiles) :**
```
NODE_ENV=development
PORT=3000
DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME
JWT_SECRET=<requis>
JWT_EXPIRES_IN=1d
MESSAGE_ENCRYPTION_KEY=<requis, base64 32 octets>
STEAM_API_KEY=<optionnel, P1>
CORS_ORIGIN=http://localhost:5173
```

**Variables manquantes dans `.env.example` mais référencées dans `Recette-soutenance.md` :**
```
DEMO_MODE=true
DEMO_SEED_ENABLED=true
EXTERNAL_API_MODE=mock
MOCK_PROVIDER_ENABLED=true
STEAM_PROVIDER_ENABLED=false
SWAGGER_ENABLED=true
RATE_LIMIT_ENABLED=true
```

**`apps/web/.env` :**
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## 7. Tests et qualité

### Tests présents

**Back-end (`apps/api`) — couverture partielle :**

| Fichier | Contenu |
|---------|---------|
| `src/app.controller.spec.ts` | Bootstrap de l'app |
| `src/auth/auth.controller.spec.ts` | Register / Login endpoints |
| `src/auth/auth.service.spec.ts` | AuthService unit tests |
| `src/users/users.controller.spec.ts` | Users endpoints |
| `src/users/users.service.spec.ts` | UsersService unit tests |
| `src/events/events.gateway.spec.ts` | Gateway (events génériques) |
| `test/app.e2e-spec.ts` | E2E basique |

**Front-end (`apps/web`) — aucun test :**
Aucun fichier `*.spec.ts` ou `*.test.ts` côté React.

### Ce qui n'est pas testé (critique)

- `ScoreCalculator` (`calculateScore`, `calculateKdRatio`, `calculateWinrate`) — formule centrale, zéro test
- `TeamMemberGuard` et `TeamRoleGuard`
- `LeaderboardsService` (pagination, cache Redis)
- `ChatGateway` et `MessagesGateway`
- `MockStatsProvider`
- Toutes les pages et composants React

### Scripts de build et qualité disponibles

```bash
# Depuis la racine
pnpm dev          # Turborepo : lance api + web en parallèle
pnpm build        # Build production des deux apps
pnpm lint         # ESLint sur les deux apps

# API seulement
pnpm --filter api dev
pnpm --filter api test         # Jest unit tests
pnpm --filter api test:e2e     # Jest E2E

# Web seulement
pnpm --filter web dev
pnpm --filter web build
```

**Note :** La tâche `test` n'est **pas définie dans `turbo.json`** — `pnpm test` depuis la racine ne fait rien.

---

## 8. Ce qu'il reste à faire

### P0 — Indispensable pour le MVP et la démo

| # | Tâche | Fichier(s) à modifier |
|---|-------|-----------------------|
| 1 | **Compléter `docker-compose.yml`** avec les services `api` et `web` | `docker-compose.yml` |
| 2 | **Vérifier le mot de passe du compte démo** dans `seed.ts` et l'aligner avec `Recette-soutenance.md` (`DemoPassword123!`) | `apps/api/src/database/seed.ts` |
| 3 | **Compléter `.env.example`** avec toutes les variables référencées dans la recette | `apps/api/.env.example` |
| 4 | **Vérifier que Swagger est accessible** sur `/api/docs` et documenté (pas de secrets) | `apps/api/src/main.ts` |
| 5 | **Vérifier le `GET /health`** répond bien en 200 | `apps/api/src/app.controller.ts` |
| 6 | **Tester le parcours complet** : login → dashboard → sync → leaderboard → équipe → chat | Manuel |
| 7 | **Ajouter `test` dans `turbo.json`** pour `pnpm test` fonctionnel depuis la racine | `turbo.json` |

### P1 — Important, non bloquant pour la démo mais nécessaire pour la qualité

| # | Tâche | Fichier(s) à modifier |
|---|-------|-----------------------|
| 8 | **Configurer la PWA** : enregistrer `VitePWA` dans `vite.config.ts`, ajouter `manifest.json` | `apps/web/vite.config.ts` |
| 9 | **Ajouter le rate limiting** (`@nestjs/throttler`) sur `/auth/login` et `/stats/sync` | `apps/api/src/app.module.ts` |
| 10 | **Écrire les tests unitaires** du score calculator (`calculateScore`, `calculateKdRatio`, `calculateWinrate`) | Nouveau fichier spec |
| 11 | **Écrire les tests des guards** (`TeamMemberGuard`, `TeamRoleGuard`) | Nouveaux fichiers spec |
| 12 | **Ajouter les filtres leaderboard** dans l'UI (sélecteur de jeu) | `apps/web/src/pages/LeaderboardPage.tsx` |
| 13 | **Vérifier le `script seed`** dans `package.json` de l'API et ajouter une commande dans `turbo.json` | `apps/api/package.json`, `turbo.json` |

### P2 — Bonus ou amélioration future

| # | Tâche |
|---|-------|
| 14 | Refresh token (rotation JWT) |
| 15 | Page d'édition du profil (`/settings`) |
| 16 | Sélecteur de saison sur le leaderboard |
| 17 | Error boundaries React |
| 18 | Skeletons de chargement |
| 19 | Tests E2E (Playwright) |
| 20 | Dossier `migrations/` TypeORM, désactiver `synchronize` |
| 21 | CI/CD GitHub Actions |
| 22 | Monitoring / logs structurés (Winston/Pino) |

---

## 9. Plan d'action recommandé

### Étape 1 — Débloquage démo (1–2 heures) ← faire en premier

1. Compléter `docker-compose.yml` avec les services `api` et `web` (voir exemple ci-dessous).
2. Vérifier et uniformiser le mot de passe du compte démo entre `seed.ts` et la recette.
3. Compléter `apps/api/.env.example` avec les variables manquantes.
4. Lancer `docker compose up -d --build` et vérifier les 4 services.
5. Exécuter le seed : `docker compose exec api pnpm run seed` (ou équivalent).
6. Tester le parcours complet de la recette (`Recette-soutenance.md §21`).

**Exemple de services manquants pour `docker-compose.yml` :**
```yaml
api:
  build: ./apps/api
  ports:
    - '3000:3000'
  env_file: ./apps/api/.env
  depends_on:
    - postgres
    - redis

web:
  build: ./apps/web
  ports:
    - '5173:80'
  depends_on:
    - api
```

### Étape 2 — Stabilisation qualité (2–4 heures)

1. Ajouter rate limiting (`@nestjs/throttler`) sur les routes sensibles.
2. Configurer la PWA dans `vite.config.ts`.
3. Écrire les tests unitaires du calculateur de score.
4. Vérifier que Swagger est propre (pas de vraies clés dans les exemples).
5. Préparer les captures de secours (screenshots du parcours démo).

### Étape 3 — Répétition soutenance (1 heure)

1. Utiliser la checklist `Recette-soutenance.md §21` point par point.
2. Simuler le parcours démo de la §18.1 en chronomètre.
3. Tester le plan de secours (`§19`).
4. Vérifier que les documents Drive sont accessibles hors ligne.

### Rattachement aux sprints

| Sprint documenté | Lien avec le plan d'action |
|-----------------|---------------------------|
| Sprint 4 — Polish & Soutenance | Étapes 1 à 3 ci-dessus |
| Sprint 2 — Stats & Leaderboards (rétroaction) | Tâche 12 (filtres leaderboard) |
| Sprint 1 — Auth (rétroaction) | Tâche 9 (rate limiting login) |

---

## Annexe — Modules back-end : état détaillé

| Module | Controller | Service | Entities | Guards | Tests |
|--------|-----------|---------|----------|--------|-------|
| Auth | ✅ | ✅ | — | JwtAuthGuard | ✅ spec |
| Users | ✅ | ✅ | User | — | ✅ spec |
| Stats | ✅ | ✅ | PlayerStats, Game | JwtAuthGuard | ❌ |
| Leaderboards | ✅ | ✅ | (PlayerStats) | Optionnel | ❌ |
| Teams | ✅ | ✅ | Team, TeamMember, ChatMessage | TeamMemberGuard, TeamRoleGuard | ❌ |
| Messages (DM) | ✅ | ✅ | Conversation, PrivateMessage | ConversationParticipantGuard | ❌ |
| Players | ✅ | ✅ | — | — | ❌ |
| Friends | ✅ | ✅ | FriendRequest | JwtAuthGuard | ❌ |
| Achievements | ✅ | ✅ | Achievement, UserAchievement | JwtAuthGuard | ❌ |
| Game Accounts | ✅ | ✅ | GameAccount, SteamTrackedGame | JwtAuthGuard | ❌ |
| Games | ❌ controller | — | Game | — | ❌ |
| Seasons | ❌ controller | — | Season | — | ❌ |
| Redis | — | ✅ | — | — | ❌ |
| Security | — | ✅ EncryptionService | — | — | ❌ |

---

## Annexe — Pages front-end : état détaillé

| Route | Page | Auth requise | Socket.io | État |
|-------|------|-------------|-----------|------|
| `/` | HomePage | Non | Non | ✅ |
| `/login` | LoginPage | Non | Non | ✅ (démo pré-rempli) |
| `/register` | RegisterPage | Non | Non | ✅ |
| `/dashboard` | DashboardPage | Oui | Non | ✅ |
| `/leaderboard` | LeaderboardPage | Non | Non | ✅ |
| `/players/:username` | PublicProfilePage | Non | Non | ✅ |
| `/profile` | ProfilePage | Oui | Non | ✅ (redirect) |
| `/teams` | TeamsPage | Oui | Non | ✅ |
| `/teams/:teamId` | TeamDetailPage | Oui | Non | ✅ |
| `/messages` | MessagesPage | Oui | Non | ✅ |
| `/messages/:conversationId` | ConversationPage | Oui | ✅ | ✅ |
| `/messages/teams/:teamId` | TeamChatPage | Oui | ✅ | ✅ |
| `/friends` | FriendsPage | Oui | Non | ✅ |
| `/settings` | — | — | — | ❌ Absent |
