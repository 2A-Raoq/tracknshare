# Track'N Share — Explication du projet & du code (support oral)

> Document de préparation à l'oral (projet fil rouge).
> Deux niveaux de lecture :
> - **Partie A — Vulgarisation** : comprendre le projet simplement (pour introduire, ou répondre à un juré non-technique).
> - **Partie B — Explication technique du code, fichier par fichier** : le « pourquoi » et le « comment » de chaque brique, pour prouver la maîtrise.
> - **Partie C — Questions probables du jury** + réponses courtes.
>
> Stack : **monorepo pnpm + Turborepo** → `apps/api` (NestJS), `apps/web` (React/Vite), `apps/mobile` (Expo/React Native). BDD **PostgreSQL**, cache/rate-limiting **Redis**, temps réel **Socket.io**.
> Répartition : **Clément** = front web + mobile · **Ioane** = back-end + DevOps + BDD.
> Comptes démo (source : `seed.ts`) : `demo@tracknshare.local` / `Demo1234!` — code d'invitation équipe : `DEMO0001`.

---

# PARTIE A — Vulgarisation (le projet en clair)

## L'idée
Les stats de jeu des joueurs sont **éparpillées** entre plateformes (Steam, PSN…). Track'N Share est **une seule maison** où on centralise : stats, score, classement, équipes et chat. Objectif : suivre, comparer et partager ses performances.

## La maison a des étages (architecture en couches)
Comme un restaurant :

| Restaurant | Track'N Share | Techno |
|---|---|---|
| Le client à table | Ce qu'on voit (site + appli) | **Front-end** (React, Expo) |
| Le cuisinier | Le cerveau qui prépare tout | **API / Back-end** (NestJS) |
| Le grand cahier de recettes | Là où tout est écrit et gardé | **Base de données** (PostgreSQL) |
| Le carnet de notes rapide | Réponses toutes prêtes, ultra-rapides | **Cache** (Redis) |

Le client n'entre **jamais** en cuisine : il demande, le cuisinier prépare. → **les secrets et les calculs restent côté serveur**, on ne peut pas tricher depuis l'extérieur.

## Les grandes briques, expliquées simplement
- **Se connecter** : le mot de passe est passé au « mixeur » (bcrypt, impossible à inverser). Si c'est bon → on reçoit un **bracelet de fête foraine** (jeton JWT) qu'on remontre à chaque page, au lieu de redonner le mot de passe.
- **Le score** : c'est **l'arbitre (le serveur)** qui calcule, jamais le joueur → non-trichable. Formule : `K/D × 50 + %victoires × 40 + matchs × 0,5`.
- **Le classement** : un podium. Astuce n°1 : on **note le résultat sur un carnet pendant 30 secondes** (cache) → réponse instantanée si quelqu'un redemande. Astuce n°2 : on affiche **20 joueurs à la fois** (pagination).
- **Le chat** : des **talkies-walkies** (Socket.io) → les messages arrivent en direct. Ils sont **codés** (chiffrement AES-256-GCM).
- **Steam** : une **prise standard** où l'on branche soit le vrai Steam, soit un faux Steam de secours pour la démo (le « Mock »).
- **Sécurité** : casque de protection (Helmet) + videur qui compte les visites pour bloquer les brutes (rate limiting).
- **RGPD** : le joueur peut **récupérer toutes ses données** (export) ou **tout effacer** (suppression).
- **Tests** : **76 petits robots** vérifient que rien n'est cassé ; un **gardien automatique** (CI) les relance à chaque changement.
- **Docker** : une **boîte à lunch scellée** → le projet marche pareil partout.
- **Web + mobile** : deux corps, **un seul cerveau** (la même API).

---

# PARTIE B — Explication technique du code, fichier par fichier

## B.1 — Back-end : cœur, sécurité, infra (`apps/api/src`)

### [`apps/api/src/main.ts`](apps/api/src/main.ts) — point d'entrée
- **Comment** : `NestFactory.create(AppModule)`, adaptateur WebSocket `IoAdapter`, middleware `helmet()` (CSP désactivée uniquement pour laisser Swagger fonctionner), `ValidationPipe` global (`whitelist: true` + `transform: true`), préfixe d'API global `/api`, CORS lu depuis `CORS_ORIGIN` (localhost souple en dev, origines explicites en prod), Swagger exposé sur `/docs`, port `3000` par défaut.
- **Pourquoi** : `whitelist` **supprime les champs non prévus** dans les requêtes (anti-injection de propriétés) ; `transform` convertit les types (ex. `"20"` → `20`) ; Helmet pose les en-têtes de sécurité (X-Frame-Options, HSTS…) ; Swagger = **contrat d'API auto-documenté** et toujours à jour.

### [`apps/api/src/app.module.ts`](apps/api/src/app.module.ts) — module racine
- **Comment** : `ConfigModule.forRoot({ isGlobal: true, validate: validateEnv })` ; `ThrottlerModule` (TTL `60000 ms`, limite `100` req/min/IP, tous deux surchargeables par variable d'env) ; `TypeOrmModule.forRootAsync` (PostgreSQL, `synchronize` = vrai en dev / faux en prod via `resolveSynchronize`) ; tous les modules métier ; `APP_GUARD` = `ThrottlerGuard` **appliqué globalement**.
- **Pourquoi** : config **globale** (injectable partout sans réimport) ; **validation au démarrage** = *fail-fast* (l'app refuse de démarrer si un secret manque) ; rate-limiting global = protection uniforme anti-brute-force ; `synchronize` piloté par environnement = confort en dev, **migrations maîtrisées** en prod.

### [`apps/api/src/config/env.validation.ts`](apps/api/src/config/env.validation.ts) — validation de la config
- **Comment** : `JWT_SECRET` doit faire **≥ 16 caractères** ; `MESSAGE_ENCRYPTION_KEY` doit être du **base64 décodant exactement 32 octets** (= 256 bits pour AES-256). Les erreurs sont accumulées puis levées d'un coup.
- **Pourquoi** : *fail-fast* — mieux vaut **refuser de démarrer** que de tourner avec une clé vide/faible ; on valide la clé **au boot**, pas au premier chiffrement (on détecte l'erreur tôt).

### [`apps/api/src/auth/auth.service.ts`](apps/api/src/auth/auth.service.ts) — logique d'authentification
- **Comment** : `register()` crée l'utilisateur (hash bcrypt via `usersService`) puis signe un JWT `{ sub: userId, role }` ; `login()` récupère le hash via `findByEmailWithPasswordHash()`, compare avec `bcrypt.compare()`, sinon `UnauthorizedException('AUTH_INVALID_CREDENTIALS')`.
- **Pourquoi** : `bcrypt.compare` = comparaison **à temps constant** (anti-timing attack) ; le JWT ne contient **pas** le mot de passe (léger, *stateless*) ; message d'erreur **générique** → pas d'énumération des comptes.

### [`apps/api/src/auth/auth.controller.ts`](apps/api/src/auth/auth.controller.ts) — routes HTTP d'auth
- **Comment** : `POST /auth/register` avec `@Throttle(5/min)`, `POST /auth/login` avec `@Throttle(10/min)` + `@HttpCode(200)`, `GET /auth/me` protégé par `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`. Réponses uniformisées `{ success, data }`.
- **Pourquoi** : throttle **renforcé** sur les routes sensibles (limite le *password guessing*) ; `/me` renvoie l'utilisateur **depuis le token** (pas de requête BDD → rapide, *stateless*).

### [`apps/api/src/auth/strategies/jwt.strategy.ts`](apps/api/src/auth/strategies/jwt.strategy.ts) + [`apps/api/src/auth/jwt-auth.guard.ts`](apps/api/src/auth/jwt-auth.guard.ts)
- **Comment** : `JwtStrategy extends PassportStrategy(Strategy)` ; token lu via `ExtractJwt.fromAuthHeaderAsBearerToken()` ; clé via `config.getOrThrow('JWT_SECRET')` ; `validate(payload)` renvoie `{ userId: payload.sub, role }` (injecté dans `req.user`). `JwtAuthGuard extends AuthGuard('jwt')` (classe minimale déléguant à Passport).
- **Pourquoi** : standard `Authorization: Bearer <token>` ; `getOrThrow` = échoue immédiatement si le secret manque ; **aucune requête BDD** dans `validate` → validation *stateless* et scalable.

### [`apps/api/src/auth/dto/register.dto.ts`](apps/api/src/auth/dto/register.dto.ts) + [`apps/api/src/auth/dto/login.dto.ts`](apps/api/src/auth/dto/login.dto.ts) — validation des entrées
- **Comment** : `RegisterDto` (`@IsEmail`, `username` 3–30, `password` **8–72**), `LoginDto` (`@IsEmail`, `password` `@IsNotEmpty`). Décorateurs `@ApiProperty` pour Swagger.
- **Pourquoi** : validation **au plus tôt** (avant le service) ; `72` = **limite technique de bcrypt** (tronque au-delà).

### [`apps/api/src/security/encryption.service.ts`](apps/api/src/security/encryption.service.ts) + [`apps/api/src/security/encryption.util.ts`](apps/api/src/security/encryption.util.ts) — chiffrement des messages
- **Comment** : clé décodée **une seule fois** au constructeur (Buffer 32 octets). `encryptWithKey` : `iv = randomBytes(12)`, `createCipheriv('aes-256-gcm', key, iv)`, puis `getAuthTag()` ; renvoie `{ iv, authTag, ciphertext }` **en base64**. `decryptWithKey` : `setAuthTag()` avant déchiffrement → **détecte toute altération**.
- **Pourquoi** : **AES-256-GCM** = chiffrement *authentifié* (confidentialité **+ intégrité**) ; **IV aléatoire unique par message** (jamais réutilisé) ; base64 = stockable dans une colonne texte / JSON.

### [`apps/api/src/redis/redis.service.ts`](apps/api/src/redis/redis.service.ts) (+ module `@Global()` [`apps/api/src/redis/redis.module.ts`](apps/api/src/redis/redis.module.ts))
- **Comment** : client `ioredis` avec `lazyConnect`, `maxRetriesPerRequest: 0`, `connectTimeout: 2000`, `enableOfflineQueue: false` ; `get<T>` (JSON.parse), `set(key, value, 'EX', ttl)`, `del`, `delByPattern`, `ping` ; **tout est try/catch** ; `OnModuleDestroy` ferme la connexion.
- **Pourquoi** : **dégradation gracieuse** — si Redis tombe, l'API **continue** de répondre (on perd le cache, pas les données) ; *fail-fast* sur la requête (pas de blocage) ; `@Global` car c'est une infra transverse.

### [`apps/api/src/common/interceptors/http-cache.interceptor.ts`](apps/api/src/common/interceptors/http-cache.interceptor.ts)
- **Comment** : ne cache que les **GET** ; clé `http:<url>` ; TTL **30 s** ; *hit* → renvoie `of(cached)` (Observable immédiat) ; *miss* → `next.handle().pipe(tap(...))` met en cache.
- **Pourquoi** : les GET sont **idempotents** donc cachables ; réduit la charge BDD/Redis pour des données qui changent lentement (classement).

### [`apps/api/src/health/health.controller.ts`](apps/api/src/health/health.controller.ts)
- **Comment** : `@SkipThrottle()` ; `Promise.all([SELECT 1, redis.ping()])` ; renvoie `status: 'ok' | 'degraded'`, l'état de `database`/`redis`, `uptime`, `timestamp`.
- **Pourquoi** : sonde de *liveness* pour orchestrateurs/monitoring ; `SkipThrottle` car appelée très souvent ; statut **dégradé** utile au debug.

## B.2 — Back-end : stats, score, providers, classement

### [`apps/api/src/stats/utils/score.calculator.ts`](apps/api/src/stats/utils/score.calculator.ts) — le cœur métier
- **Comment** (formules exactes) :
  - `kdRatio = round((kills / max(deaths,1)) * 100) / 100` (évite la division par zéro, arrondi 2 décimales)
  - `winrate = round((wins / matchesPlayed) * 100)` (0 si aucun match)
  - `score = round(kdRatio * 50 + winrate * 40 + matchesPlayed * 0.5)`
- **Pourquoi** : **fonctions pures** (testables, sans effet de bord) ; pondération équilibrée **skill (K/D) + résultats (winrate) + activité (matchs)** ; calcul **côté serveur = non falsifiable**.

### [`apps/api/src/stats/stats.service.ts`](apps/api/src/stats/stats.service.ts)
- **Comment** : injecte les repos (`PlayerStats`, `Game`, `Season`) **et** les deux providers (`MockStatsProvider`, `SteamStatsProvider`) ; `getMyStats()` charge avec relations, tri par score ; `syncStats()` (mock) et `syncSteamStats()` (boucle sur les jeux suivis) ; `upsertStats()` **calcule** kd/winrate/score puis persiste.
- **Pourquoi** : **DI** (injection de dépendances) → changer de source = changer le provider injecté ; `upsertStats` centralise calcul + persistance (DRY).

### [`apps/api/src/stats/entities/player-stats.entity.ts`](apps/api/src/stats/entities/player-stats.entity.ts)
- **Comment** : `@Index('idx_leaderboard_query', ['gameId', 'seasonId', 'score'])` + `@Unique(['userId', 'gameId', 'seasonId'])`.
- **Pourquoi** : l'**index composite** accélère la requête de classement (filtre game+season, tri par score) → pas de *full scan* ; l'unique garantit **une stat par joueur/jeu/saison**.

### [`apps/api/src/providers/external-stats-provider.interface.ts`](apps/api/src/providers/external-stats-provider.interface.ts) — le contrat
- **Comment** : type `StatsProviderName = 'MOCK' | 'STEAM'` ; interface `IStatsProvider { provider; fetchStats(request): Promise<RawStats> }`.
- **Pourquoi** : **une interface, deux implémentations interchangeables** → bascule mock ↔ Steam sans toucher au reste ; facilite les tests (mock sans HTTP).

### [`apps/api/src/providers/mock/mock-stats.provider.ts`](apps/api/src/providers/mock/mock-stats.provider.ts) & [`apps/api/src/providers/steam/steam-stats.provider.ts`](apps/api/src/providers/steam/steam-stats.provider.ts)
- **Comment (mock)** : génère des stats aléatoires cohérentes (K/D ~1.3, winrate ~50 %).
- **Comment (Steam)** : valide le SteamID (`/^\d{17}$/`) → sinon `BadRequestException` ; refuse un profil non public (`communityvisibilitystate !== 3`) → `ForbiddenException` ; **dérive** kills/deaths/wins **du temps de jeu réel** via un **hash déterministe** (même temps de jeu → mêmes stats), `matchesPlayed` plafonné à 600, K/D ~1.02–1.83, bonus `recentBoost` si actif récemment ; appelle `GetPlayerSummaries` + `GetOwnedGames` ; erreurs → `ServiceUnavailableException`.
- **Pourquoi** : Steam **n'expose pas** les K/D → on utilise le temps de jeu comme *proxy* ; **déterministe** = pas de valeurs qui sautent à chaque sync ; refus des profils privés = on économise le quota API.

### [`apps/api/src/game-accounts/`](apps/api/src/game-accounts/) — liaison Steam & jeux suivis (`game-accounts.service.ts`, entités `game-account.entity.ts` / `steam-tracked-game.entity.ts`)
- **Comment** : `linkSteamAccount()` valide l'ID et gère les conflits ; contraintes **UNIQUE** `(userId, platform)` et `(platform, externalId)` ; `updateTrackedSteamGames()` fait un **upsert** avec un flag `isTracked` (pas de DELETE).
- **Pourquoi** : un seul compte Steam par user, un Steam lié à un seul user ; `isTracked` = *soft flag* (on garde l'historique), `lastSeenAt` détecte les jeux désinstallés.

### [`apps/api/src/leaderboards/leaderboards.service.ts`](apps/api/src/leaderboards/leaderboards.service.ts)
- **Comment** : **cache Redis TTL 30 s** (clé `lb:...`) ; `QueryBuilder` avec **SELECT sélectif** (pas de `SELECT *`) + JOINs ciblés ; tri `score DESC, id DESC` (déterministe en cas d'égalité) ; `take(limit + 1)` pour **détecter s'il reste une page sans COUNT** ; **pagination curseur** (curseur = base64 `{score, id, rank}`, condition `score < :cs OR (score = :cs AND id < :ci)`) **et** offset (rétro-compatible) ; données + total lancés en `Promise.all`.
- **Pourquoi** : la **pagination curseur est stable** (si un joueur te double, pas de doublon/trou comme avec l'offset) et **rapide** (utilise l'index) ; `limit+1` évite un `COUNT` séparé.

### [`apps/api/src/leaderboards/leaderboards.controller.ts`](apps/api/src/leaderboards/leaderboards.controller.ts)
- **Comment** : `GET /leaderboards/solo` **public**, décoré par `@UseInterceptors(HttpCacheInterceptor)`.
- **Pourquoi** : classement consultable sans compte (incite à s'inscrire) + cache HTTP en plus du cache service.

## B.3 — Back-end : social, RGPD, base de données

### [`apps/api/src/users/users.service.ts`](apps/api/src/users/users.service.ts) & entité [`apps/api/src/users/entities/user.entity.ts`](apps/api/src/users/entities/user.entity.ts)
- **Comment** : `passwordHash` en `select: false` (jamais renvoyé sauf méthode dédiée) ; hash **bcrypt (salt 10)** ; recherche `ILike` (insensible casse, limitée à 10) ; **RGPD export** = agrège profil + stats + équipes + amis + succès en JSON (`Promise.all`) ; **RGPD delete** = **transaction** atomique (cascades FK + purge explicite des relations).
- **Pourquoi** : hash **jamais exposé** = sécurité ; export = **droit à la portabilité** ; suppression **transactionnelle** = cohérence garantie (tout ou rien).

### [`apps/api/src/teams/teams.service.ts`](apps/api/src/teams/teams.service.ts)
- **Comment** : `inviteCode` = `randomBytes(4).toString('hex').toUpperCase()` (8 caractères) ; le créateur devient **CAPTAIN** ; adhésion via code → **MEMBER** ; au départ du capitaine → **promotion du plus ancien membre** (`joinedAt` ASC) ; dernier membre qui part → dissolution + cascade ; messages **chiffrés** (contenu stocké en `encryptedContent/iv/authTag`, `content = null`) ; `isMember()` vérifie l'appartenance.
- **Pourquoi** : code opaque = adhésion contrôlée ; promotion auto = l'équipe **ne meurt pas** si le capitaine part ; chiffrement = confidentialité même en cas d'accès BDD.

### [`apps/api/src/teams/chat.gateway.ts`](apps/api/src/teams/chat.gateway.ts) (WebSocket)
- **Comment** : à la connexion, JWT lu dans `client.handshake.auth.token`, vérifié via `jwt.verify`, `userId` stocké dans `client.data` ; `team:join` **vérifie `isMember`** avant de rejoindre la room `team:<id>` ; `team:message:send` re-vérifie l'appartenance, valide (1–1000 car.), sauvegarde (chiffré) puis **broadcast** `team:message:new` à la room.
- **Pourquoi** : auth **stateless** dès la connexion ; appartenance **revérifiée à chaque action** (un membre exclu est immédiatement bloqué) ; broadcast par room = temps réel ciblé.

### [`apps/api/src/teams/guards/team-member.guard.ts`](apps/api/src/teams/guards/team-member.guard.ts) & [`apps/api/src/teams/guards/team-role.guard.ts`](apps/api/src/teams/guards/team-role.guard.ts)
- **Comment** : `TeamMemberGuard` → 403 `TEAM_MEMBER_REQUIRED` si non-membre ; `TeamRoleGuard` → 403 si `role !== CAPTAIN`.
- **Pourquoi** : **autorisation déclarative** (`@UseGuards`) réutilisable, sécurité vérifiée **côté serveur**.

### [`apps/api/src/messages/`](apps/api/src/messages/) — messages privés 1-à-1 (`messages.service.ts`, `messages.gateway.ts`, entités `conversation.entity.ts` / `private-message.entity.ts`)
- **Comment** : modèle `Conversation` + `ConversationParticipant` ; réutilise le **même chiffrement** que le chat d'équipe ; `messages.gateway.ts` = `conversation:join` + `private:message:send` avec vérification `isParticipant()` ; *soft-delete* via `deletedAt`.
- **Pourquoi** : modèle **extensible** (groupes futurs) ; non-participant **bloqué** (REST et WS).

### [`apps/api/src/friends/friends.service.ts`](apps/api/src/friends/friends.service.ts)
- **Comment** : `FriendRequest` (sender/recipient, status `PENDING/ACCEPTED/REFUSED/CANCELLED`) ; `findRelationship()` = requête **bidirectionnelle** ; amitié = une seule ligne.
- **Pourquoi** : demande **asymétrique** mais amitié **symétrique** → pas de duplication ; les statuts = piste d'audit.

### [`apps/api/src/achievements/achievements.service.ts`](apps/api/src/achievements/achievements.service.ts)
- **Comment** : 7 succès (FIRST_LOGIN, FIRST_STATS_SYNC, TOP_5_LEADERBOARD, TEAM_FOUNDER, SOCIAL_PLAYER, FRIENDLY, CHATTER) ; progression **calculée dynamiquement** à chaque requête (`computeCurrentValue`).
- **Pourquoi** : calcul dynamique = **toujours à jour** (pas de cache périmé) ; on ne stocke que les succès **débloqués**.

### [`apps/api/src/database/seed.ts`](apps/api/src/database/seed.ts), [`apps/api/src/database/data-source.ts`](apps/api/src/database/data-source.ts), migration [`apps/api/src/database/migrations/1782672862490-Init.ts`](apps/api/src/database/migrations/1782672862490-Init.ts)
- **Comment** : `seed.ts` crée **14 users**, **3 jeux**, une saison active, des stats, l'équipe **« Track Masters » (code `DEMO0001`)**, des messages **chiffrés**, et attribue les succès ; il est **idempotent** (upsert). `data-source.ts` = `synchronize: false` (CLI migrations). La migration `Init` crée **tout le schéma** (tables, index `idx_leaderboard_query`, cascades FK).
- **Pourquoi** : seed **rejouable** sans casser les données ; en prod, **migrations versionnées** (audit, rollback) plutôt que `synchronize` implicite ; données de démo complètes = soutenance fiable.

## B.4 — Front-end web (`apps/web/src`, React + Vite)

### [`apps/web/src/main.tsx`](apps/web/src/main.tsx) / [`apps/web/src/App.tsx`](apps/web/src/App.tsx) / [`apps/web/src/router.tsx`](apps/web/src/router.tsx)
- **Comment** : `createRoot` + `React.StrictMode` ; `App` appelle `useAuth()` (restaure la session **avant** le rendu), affiche le routeur (`wouter`), le `ConsentBanner` et un footer vers `/privacy` ; routes **publiques** (`/`, `/login`, `/leaderboard`…) et **protégées** (`/dashboard`, `/teams`, `/messages`…) enveloppées par `<ProtectedRoute>`.
- **Pourquoi** : `useAuth` au niveau racine = pas de « flash » des pages protégées ; `wouter` = routeur **léger** adapté à une SPA.
- **En clair** : c'est le **squelette de l'app** — `main.tsx` monte React dans la page, `App.tsx` orchestre (session + layout), `router.tsx` associe chaque URL à une page. J'ai choisi **wouter** plutôt que React Router car il est **minuscule (~1,5 ko)** et suffit largement pour une SPA de cette taille.

### [`apps/web/src/store/auth.store.ts`](apps/web/src/store/auth.store.ts) (Valtio)
- **Comment** : `proxy({ user, token, loading })` ; mutations directes (`authStore.user = ...`) relues via `useSnapshot()`.
- **Pourquoi** : **Valtio** = pas de *boilerplate* Redux (actions/reducers), proxy réactif, empreinte légère — suffisant pour un état simple et global.
- **En clair** : c'est **l'endroit unique qui garde l'utilisateur connecté et son token**, accessible partout dans l'app. J'ai pris **Valtio** plutôt que Redux parce que pour un seul objet global, Redux demanderait beaucoup de code inutile (actions, reducers) alors qu'ici je modifie juste `authStore.user = ...`.

### [`apps/web/src/services/api.ts`](apps/web/src/services/api.ts) (Axios centralisé)
- **Comment** : instance `axios` (`baseURL = VITE_API_URL`) ; **intercepteur requête** injecte `Authorization: Bearer <token>` ; **intercepteur réponse** : sur **401**, purge la session (store + localStorage) **sans rediriger** (c'est `ProtectedRoute` qui redirige).
- **Pourquoi** : **centralisation** — le token est injecté **une seule fois**, la gestion du 401 est **unifiée** ; séparation des responsabilités nette.
- **En clair** : c'est **la porte d'entrée unique de tous les appels réseau**. J'utilise **Axios** (et pas `fetch` nu) pour ses **intercepteurs** : le token est ajouté automatiquement à chaque requête et une déconnexion sur 401 est gérée à un seul endroit, au lieu de le répéter dans chaque composant.

### [`apps/web/src/services/teams.api.ts`](apps/web/src/services/teams.api.ts)
- **Comment** : wrappers d'endpoints ; `ensureTeamSummaryArray()` **valide** la forme du payload et **jette** si un champ obligatoire manque.
- **Pourquoi** : validation à l'entrée du client = **défense contre les réponses malformées** (pas de bug silencieux).
- **En clair** : ce fichier **regroupe tous les appels liés aux équipes** (au lieu de les éparpiller). Il **vérifie la forme de la réponse** dès sa réception : si l'API renvoie quelque chose d'inattendu, ça échoue tout de suite avec un message clair, plutôt que de planter un composant plus loin sans savoir pourquoi.

### [`apps/web/src/hooks/useAuth.ts`](apps/web/src/hooks/useAuth.ts) / [`apps/web/src/hooks/useSocket.ts`](apps/web/src/hooks/useSocket.ts) / [`apps/web/src/lib/socket.ts`](apps/web/src/lib/socket.ts)
- **Comment** : `useAuth` (au montage) lit le token du `localStorage` → appelle `/users/me` → remplit ou nettoie le store, puis `loading = false` ; `useSocket` est **volontairement vide** (le socket est géré **par composant**) ; `createAuthenticatedSocket(token)` passe le token dans `auth.token`.
- **Pourquoi** : session **restaurée au refresh** sans re-login ; socket **local au chat** (pas d'état global inutile).
- **En clair** : `useAuth` **remet l'utilisateur connecté au chargement** (on relit le token et on redemande le profil), ce qui évite de se relogger à chaque F5. Le socket temps réel n'est ouvert **que dans la page de chat** (via `socket.io-client`), car c'est le seul écran qui en a besoin — inutile de le maintenir globalement.

### [`apps/web/src/components/ProtectedRoute.tsx`](apps/web/src/components/ProtectedRoute.tsx) / [`apps/web/src/components/ConsentBanner.tsx`](apps/web/src/components/ConsentBanner.tsx)
- **Comment** : `ProtectedRoute` lit `useSnapshot(authStore)` → « Loading… » tant que `loading`, sinon `<Redirect to="/login">` si pas d'utilisateur ; `ConsentBanner` mémorise le choix dans `localStorage` (`tns_consent`), rôle ARIA `dialog`.
- **Pourquoi** : garde **côté client** (rapide) **en plus** de la garde serveur = **défense en profondeur** ; bannière RGPD = consentement explicite non répété.
- **En clair** : `ProtectedRoute` est le **videur côté navigateur** — si tu n'es pas connecté, il te renvoie vers `/login` avant même d'afficher une page privée. Il **double** le contrôle du serveur (qui reste la vraie sécurité) → défense en profondeur. `ConsentBanner` gère le **consentement RGPD** et retient ton choix pour ne pas le redemander à chaque visite.

### Pages clés (`apps/web/src/pages/`)
- **[`LoginPage.tsx`](apps/web/src/pages/LoginPage.tsx)** : identifiants démo **pré-remplis**, stocke token (store + localStorage), redirige vers `/dashboard`. *Pourquoi* : soutenance sans chercher les identifiants.
- **[`DashboardPage.tsx`](apps/web/src/pages/DashboardPage.tsx)** : `getMyStats()` avec états **loading/error/empty**, bouton **sync** (fusion intelligente des stats). *Pourquoi* : états séparés, stats et badges chargés indépendamment.
- **[`LeaderboardPage.tsx`](apps/web/src/pages/LeaderboardPage.tsx)** : `getSoloLeaderboard({ limit: 20 })`, tableau + lien profil public, gestion loading/empty/error. *Pourquoi* : route **publique**.
- **[`TeamChatPage.tsx`](apps/web/src/pages/TeamChatPage.tsx)** : charge équipe + messages en `Promise.all` ; **Socket.io** (`team:join`, écoute `team:message:new` avec **déduplication** par id) ; envoi via socket **avec fallback REST** ; `disconnect()` au démontage. *Pourquoi* : temps réel + **robustesse** (pas de perte de message) + pas de fuite mémoire.

### [`apps/web/vitest.config.ts`](apps/web/vitest.config.ts)
- **Comment** : `jsdom`, `include: src/**/*.test.{ts,tsx}`, **`fileParallelism: false`**.
- **Pourquoi** : exécution séquentielle pour **éviter un crash intermittent** des workers Vitest sous Node 24/Windows ; suite courte → coût négligeable.
- **En clair** : c'est la **config des tests du front**. J'ai choisi **Vitest** parce qu'il est **natif à Vite** (même config, pas de setup en double) et `jsdom` **simule un navigateur** pour tester les composants. J'ai désactivé le parallélisme pour contourner un **crash aléatoire des workers sous Windows/Node 24** — vu la taille de la suite, ça ne ralentit quasiment pas.

## B.5 — Application mobile (`apps/mobile/src`, Expo / React Native)

### [`apps/mobile/src/config.ts`](apps/mobile/src/config.ts)
- **Comment** : `API_URL` via `Platform.select` — **Android émulateur `10.0.2.2`**, iOS/web `localhost`, surchargé par `EXPO_PUBLIC_API_URL` (device physique) ; `SOCKET_URL` dérivé de l'API.
- **Pourquoi** : sur émulateur Android, `localhost` = le téléphone lui-même ; `10.0.2.2` = **alias de la machine hôte** → l'appli atteint bien l'API NestJS. C'est **la même API que le web**.
- **En clair** : ce fichier **décide à quelle adresse l'appli parle au back-end** selon la plateforme. C'est nécessaire parce qu'un émulateur Android considère `localhost` comme *lui-même* : il faut l'adresse spéciale `10.0.2.2` pour joindre mon PC. Sur un vrai téléphone, on surcharge avec `EXPO_PUBLIC_API_URL`.

### [`apps/mobile/src/lib/api.ts`](apps/mobile/src/lib/api.ts) & [`apps/mobile/src/lib/storage.ts`](apps/mobile/src/lib/storage.ts)
- **Comment** : `axios` (`baseURL = API_URL`, `timeout: 15000`) ; intercepteurs **identiques au web** (injecte le token, purge sur 401) ; le token est stocké via **`expo-secure-store`** (Keychain iOS / Keystore Android).
- **Pourquoi** : **cohérence** front web/mobile ; **stockage sécurisé matériel** du token (mieux qu'un simple AsyncStorage).
- **En clair** : `api.ts` est **le même client Axios que sur le web** (mêmes intercepteurs), pour ne pas réapprendre une logique différente. `storage.ts` range le token dans **`expo-secure-store`**, c'est-à-dire le **coffre-fort matériel du téléphone** (Keychain iOS / Keystore Android) — bien plus sûr qu'un `AsyncStorage` lisible en clair.

### [`apps/mobile/src/store/auth.ts`](apps/mobile/src/store/auth.ts)
- **Comment** : **Valtio** (comme le web) : `loadSession()`, `setSession()`, `clearSession()` synchronisés avec le SecureStore.
- **Pourquoi** : même pattern d'état que le web → **courbe d'apprentissage partagée**, logique dupliquée minimale.
- **En clair** : c'est **le « qui est connecté » de l'appli mobile**. J'ai repris **exactement le même Valtio que le web** : ainsi les deux applis raisonnent pareil, et si je comprends l'un je comprends l'autre.

### [`apps/mobile/src/lib/useKeyboardHeight.ts`](apps/mobile/src/lib/useKeyboardHeight.ts) — (le point « difficulté » de l'oral)
- **Comment** : écoute `keyboardWillShow/Hide` (iOS) ou `keyboardDidShow/Hide` (Android), renvoie la **hauteur courante du clavier** ; l'écran de chat ajoute cette hauteur en `paddingBottom`.
- **Pourquoi** : avec l'**edge-to-edge d'Expo SDK 54**, `KeyboardAvoidingView` **ne décalait pas correctement** la barre de saisie (chevauchement clavier/champ) → hook custom fiable. *(C'est la difficulté « Clément » de la slide Difficultés.)*
- **En clair** : ce petit hook **mesure la hauteur du clavier** pour que la barre de saisie du chat **remonte au-dessus** au lieu d'être cachée. Je l'ai écrit à la main parce que le composant standard d'Expo (`KeyboardAvoidingView`) **buggait avec le mode edge-to-edge du SDK 54** : c'est ma vraie difficulté technique du projet, résolue proprement.

### [`apps/mobile/src/lib/socket.ts`](apps/mobile/src/lib/socket.ts)
- **Comment** : `createAuthenticatedSocket(token)` avec `transports: ['websocket']`, **mêmes événements** que le web (`team:join`, `team:message:new`, `private:message:send`…).
- **Pourquoi** : le **même contrat temps réel** que le web → le back-end ne fait aucune distinction.
- **En clair** : c'est **la connexion temps réel du chat mobile**. J'utilise le **même `socket.io-client` avec les mêmes événements** que le web, donc le serveur traite un message venu du téléphone exactement comme un message venu du navigateur — zéro code spécifique côté back.

### Navigation `expo-router` (fichiers = routes, dossier [`apps/mobile/src/app/`](<apps/mobile/src/app/>))
- **Comment** : [`app/_layout.tsx`](apps/mobile/src/app/_layout.tsx) (Stack racine) **restaure la session** (`authApi.me()`) et affiche un spinner pendant `loading` ; [`app/index.tsx`](apps/mobile/src/app/index.tsx) **redirige** vers `dashboard` ou `login` selon l'utilisateur ; [`app/(auth)/*`](<apps/mobile/src/app/(auth)/>) (login, register) et [`app/(tabs)/*`](<apps/mobile/src/app/(tabs)/>) (dashboard, leaderboard, teams, messages, profile) sont des **groupes** ; [`(tabs)/_layout.tsx`](<apps/mobile/src/app/(tabs)/_layout.tsx>) fait `Redirect vers /(auth)/login` si non connecté.
- **Pourquoi** : **routing par fichiers** (comme Next.js) = structure lisible ; la redirection dans le layout = **protection des routes** côté mobile (équivalent du `ProtectedRoute` web).
- **En clair** : avec **`expo-router`, chaque fichier = un écran** (comme Next.js) → la structure des dossiers *est* la carte de l'appli, très lisible. La redirection placée dans le layout `(tabs)` joue le rôle du `ProtectedRoute` du web : impossible d'atteindre un onglet privé sans être connecté.

### Écrans (ex. [`app/(tabs)/leaderboard.tsx`](<apps/mobile/src/app/(tabs)/leaderboard.tsx>), [`app/teams/[id]/chat.tsx`](<apps/mobile/src/app/teams/[id]/chat.tsx>))
- **Comment** : `FlatList` (listes performantes), `useFocusEffect` pour recharger à l'affichage, chat mobile = **socket + fallback REST + auto-scroll + `useKeyboardHeight`**.
- **Pourquoi** : `FlatList` = rendu **virtualisé** (fluide même longue liste) ; même logique de chat que le web (cohérence, robustesse).
- **En clair** : ce sont **les écrans concrets** (classement, chat…). J'utilise **`FlatList`** parce qu'elle n'affiche **que les lignes visibles** à l'écran (rendu virtualisé) → l'appli reste fluide même avec une longue liste. Le chat reprend la **même logique socket + secours REST** que le web.

### [`apps/mobile/src/theme.ts`](apps/mobile/src/theme.ts) & [`apps/mobile/src/components/ui.tsx`](apps/mobile/src/components/ui.tsx)
- **Comment** : palette sombre (`bg #0f111a`, `primary #5865F2`…), échelles `spacing`/`radius`, composants UI réutilisables (`Button`, `Card`, `TextField`…).
- **Pourquoi** : **design system unifié** aligné sur le web = cohérence visuelle malgré deux moteurs de rendu.
- **En clair** : c'est **la charte graphique de l'appli** (couleurs, espacements) et **une boîte de composants réutilisables** (`Button`, `Card`, `TextField`). En centralisant tout ici, le mobile **ressemble au web** et je ne réécris pas un bouton à chaque écran, même si les deux applis n'utilisent pas le même moteur de rendu.

---

# PARTIE C — Questions probables du jury (réponses courtes)

**Pourquoi calculer le score côté serveur ?**
> Parce que le client n'est pas fiable : s'il calculait le score, un joueur pourrait l'altérer. Le serveur est **l'unique source de vérité** → score **non falsifiable**. (→ [`apps/api/src/stats/utils/score.calculator.ts`](apps/api/src/stats/utils/score.calculator.ts), appelé dans [`apps/api/src/stats/stats.service.ts`](apps/api/src/stats/stats.service.ts).)

**Différence entre le cache (Redis) et la base (PostgreSQL) ?**
> PostgreSQL = **mémoire durable** (source de vérité, sur disque). Redis = **mémoire ultra-rapide temporaire** (en RAM) : on y garde le classement **30 s** pour éviter de recalculer. Si Redis tombe, on relit PostgreSQL (dégradation gracieuse). (→ [`apps/api/src/redis/redis.service.ts`](apps/api/src/redis/redis.service.ts), cache utilisé dans [`apps/api/src/leaderboards/leaderboards.service.ts`](apps/api/src/leaderboards/leaderboards.service.ts).)

**Pourquoi JWT et pas des sessions serveur ?**
> JWT = **stateless** : le serveur n'a rien à stocker, il vérifie juste la signature. Ça scale horizontalement (plusieurs instances d'API sans session partagée). (→ [`apps/api/src/auth/strategies/jwt.strategy.ts`](apps/api/src/auth/strategies/jwt.strategy.ts), [`apps/api/src/auth/auth.service.ts`](apps/api/src/auth/auth.service.ts).)

**Pourquoi la pagination curseur ?**
> Sur un classement qui bouge, l'**offset** provoque doublons/trous quand un joueur change de rang entre deux pages. Le **curseur** (`{score, id}`) pointe un endroit précis → **stable** et **rapide** (utilise l'index). (→ [`apps/api/src/leaderboards/leaderboards.service.ts`](apps/api/src/leaderboards/leaderboards.service.ts).)

**Comment un non-membre est-il empêché de lire un chat ?**
> Deux niveaux : le **guard** REST (`TeamMemberGuard`) et le **gateway** WebSocket vérifient `isMember(teamId, userId)` **à chaque action** ; en plus les messages sont **chiffrés** en base. La sécurité est **côté serveur**, jamais déléguée au client. (→ [`apps/api/src/teams/guards/team-member.guard.ts`](apps/api/src/teams/guards/team-member.guard.ts), [`apps/api/src/teams/chat.gateway.ts`](apps/api/src/teams/chat.gateway.ts).)

**Pourquoi AES-256-GCM et pas juste AES ?**
> GCM est un mode **authentifié** : en plus de chiffrer, il produit un `authTag` qui **détecte toute modification** du message. IV aléatoire unique par message. (→ [`apps/api/src/security/encryption.service.ts`](apps/api/src/security/encryption.service.ts), [`apps/api/src/security/encryption.util.ts`](apps/api/src/security/encryption.util.ts).)

**PWA ou vraie appli mobile ?**
> Une **vraie appli native** Expo/React Native (build iOS/Android), pas une PWA : navigation native, stockage sécurisé du token (Keychain/Keystore), gestion fine du clavier. Elle consomme **la même API NestJS** que le web. (→ [`apps/mobile/src/lib/storage.ts`](apps/mobile/src/lib/storage.ts), [`apps/mobile/src/lib/useKeyboardHeight.ts`](apps/mobile/src/lib/useKeyboardHeight.ts), [`apps/mobile/src/config.ts`](apps/mobile/src/config.ts).)

**Que se passe-t-il si Socket.io tombe pendant le chat ?**
> **Fallback REST** : si le socket n'est pas connecté, l'envoi passe par `POST /teams/:id/messages`. Aucun message perdu ; côté réception, on **déduplique** par id. (→ [`apps/web/src/pages/TeamChatPage.tsx`](apps/web/src/pages/TeamChatPage.tsx) + [`apps/mobile/src/app/teams/[id]/chat.tsx`](<apps/mobile/src/app/teams/[id]/chat.tsx>) côté client, [`apps/api/src/teams/chat.gateway.ts`](apps/api/src/teams/chat.gateway.ts) côté serveur.)

**Comment garantissez-vous que la démo marchera ?**
> Données de **seed idempotent** (compte `demo@tracknshare.local` / `Demo1234!`, équipe `DEMO0001`), **MockProvider** si Steam/réseau indisponible, environnement **Docker** identique partout, et **plan de repli** (captures + vidéo). (→ [`apps/api/src/database/seed.ts`](apps/api/src/database/seed.ts), [`apps/api/src/providers/mock/mock-stats.provider.ts`](apps/api/src/providers/mock/mock-stats.provider.ts).)

**Qui a fait quoi ?**
> **Clément** : tout le front web (React/Vite, Valtio, appels API centralisés, chat temps réel) **et** l'app mobile Expo (routing, SecureStore, hook clavier). **Ioane** : l'API NestJS (16 modules, score, providers, sécurité, RGPD), la BDD PostgreSQL (schéma, migrations, seed) et le DevOps (Docker, CI/CD).

---

*Document généré le 2026-07-02 pour la préparation de l'oral. Basé sur une lecture directe du code des trois applications.*
