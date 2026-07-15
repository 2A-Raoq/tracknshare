# Track'N Share — API Contract

## Objectif du fichier

Ce fichier définit les conventions API du MVP Track'N Share.

## Base URL

En développement :

```txt
http://localhost:3000/api
```

À adapter selon la configuration réelle du back-end.

## Format de réponse succès

```json
{
  "success": true,
  "data": {},
  "message": "Action effectuée avec succès."
}
```

## Format de réponse erreur

Toutes les erreurs HTTP sont normalisées par un filtre d'exceptions global
(`apps/api/src/common/filters/all-exceptions.filter.ts`) :

```json
{
  "success": false,
  "statusCode": 404,
  "message": "TEAM_NOT_FOUND",
  "error": {
    "code": "TEAM_NOT_FOUND",
    "message": "Équipe introuvable.",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

Détails :

- `error.code` : code métier SCREAMING_SNAKE (voir liste plus bas) ou code de
  repli dérivé du statut HTTP (`VALIDATION_ERROR`, `AUTH_UNAUTHORIZED`,
  `AUTH_FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`) ;
- `error.message` : message lisible destiné à l'affichage ;
- `error.requestId` : UUID généré par requête pour corréler avec les logs serveur ;
- `statusCode` et `message` (top-level) : champs legacy conservés pour
  rétro-compatibilité — les clients web/mobile existants lisent
  `response.data.message` (qui contient le code métier brut, ou un tableau de
  messages pour les erreurs de validation du `ValidationPipe`). Les nouveaux
  clients doivent utiliser le bloc `error{}`.

## Règles générales

- JSON en camelCase.
- DTO obligatoires pour body, params et query.
- Validation côté back-end.
- Permissions vérifiées côté back-end.
- Pas de stack trace côté client.
- Pas de passwordHash dans les réponses.
- Pas de token dans les logs.
- Pagination sur les listes.
- Swagger doit documenter les endpoints MVP.

## Authentification

### POST `/auth/register`

Créer un compte.

Body :

```json
{
  "email": "demo@tracknshare.local",
  "username": "DemoPlayer",
  "password": "Password123!"
}
```

Réponse :

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "demo@tracknshare.local",
      "username": "DemoPlayer",
      "role": "PLAYER"
    },
    "accessToken": "jwt"
  }
}
```

Règles :
- email unique ;
- mot de passe hashé ;
- `passwordHash` jamais retourné.

### POST `/auth/login`

Connexion.

Body :

```json
{
  "email": "demo@tracknshare.local",
  "password": "Password123!"
}
```

Réponse :

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "demo@tracknshare.local",
      "username": "DemoPlayer",
      "role": "PLAYER"
    },
    "accessToken": "jwt"
  }
}
```

Règles :
- message d'erreur générique si identifiants invalides ;
- token à durée limitée ;
- payload minimal.

### POST `/auth/logout`

**Non implémenté côté back-end** — la déconnexion est gérée côté client
(suppression du token stocké). Il n'existe pas d'endpoint `GET /auth/me` :
utiliser `GET /users/me`.

Évolution possible : si un refresh token est ajouté, révoquer côté back.

### GET `/users/me`

Retourne l'utilisateur connecté.

Headers :

```txt
Authorization: Bearer <token>
```

Réponse :

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "demo@tracknshare.local",
    "username": "DemoPlayer",
    "role": "PLAYER"
  }
}
```

## Stats

### GET `/stats/me`

Retourne les statistiques du joueur connecté — **un tableau** (une entrée par
jeu et par saison), trié par score décroissant.

Réponse :

```json
{
  "success": true,
  "data": [
    {
      "id": "stats_1",
      "userId": "user_123",
      "gameId": "game_1",
      "game": { "id": "game_1", "name": "Valorant Mock", "slug": "valorant-mock" },
      "seasonId": "season_1",
      "season": { "id": "season_1", "name": "Saison 1" },
      "kills": 340,
      "deaths": 210,
      "wins": 42,
      "losses": 18,
      "matchesPlayed": 60,
      "playtimeMinutes": 5400,
      "kdRatio": 1.62,
      "winrate": 70,
      "score": 291,
      "provider": "MOCK",
      "fetchedAt": "2026-05-10T12:00:00.000Z"
    }
  ]
}
```

Règles :
- utilisateur connecté requis ;
- données limitées au joueur ;
- score calculé côté back-end.

### POST `/stats/sync`

Synchronise ou génère des stats via MockProvider.

Body possible :

```json
{
  "gameId": "game_1"
}
```

Réponse : l'objet stats upserté (même forme qu'une entrée de `GET /stats/me`).

```json
{
  "success": true,
  "data": {
    "id": "stats_1",
    "game": { "id": "game_1", "name": "Valorant Mock" },
    "season": { "id": "season_1", "name": "Saison 1" },
    "kills": 340,
    "deaths": 210,
    "wins": 42,
    "losses": 18,
    "matchesPlayed": 60,
    "kdRatio": 1.62,
    "winrate": 70,
    "score": 291,
    "provider": "MOCK",
    "fetchedAt": "2026-05-10T12:00:00.000Z"
  }
}
```

Règles :
- MVP : utiliser MockProvider ;
- si provider échoue, conserver les anciennes stats ;
- ne pas dépendre de Steam/Epic pour la démo ;
- la synchro invalide les caches leaderboard (Redis).

Variante Steam : `POST /stats/sync/steam` synchronise les jeux Steam suivis
(compte Steam lié requis, voir game-accounts) et renvoie un tableau de stats.

## Leaderboards

### GET `/leaderboards/solo`

Liste le leaderboard solo (public). Deux modes de pagination : offset
(`page`) ou curseur opaque (`cursor`, prioritaire si fourni).

Query possible :

```txt
?gameId=game_1&seasonId=season_1&page=1&limit=20
?gameId=game_1&seasonId=season_1&cursor=<opaque>&limit=20
```

Réponse :

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "rank": 1,
        "userId": "user_1",
        "username": "ClutchPlayer",
        "score": 420,
        "kdRatio": 2.1,
        "winrate": 72,
        "matchesPlayed": 85,
        "gameName": "Valorant Mock"
      }
    ],
    "total": 50,
    "limit": 20,
    "page": 1,
    "nextCursor": "eyJzY29yZSI6NDIwLCJpZCI6Ii4uLiIsInJhbmsiOjIwfQ=="
  }
}
```

Détails :
- `page` n'est présent qu'en mode offset ;
- `nextCursor` vaut `null` s'il n'y a pas de page suivante ;
- tri par score décroissant ;
- filtrage par jeu et saison (défauts : premier jeu, saison active) ;
- réponse mise en cache 30 s (Redis), invalidée à chaque `POST /stats/sync`.

## Teams

### POST `/teams`

Créer une équipe.

Body :

```json
{
  "name": "Track Masters",
  "tag": "TMS",
  "description": "Team de démonstration"
}
```

Réponse :

```json
{
  "success": true,
  "data": {
    "id": "team_1",
    "name": "Track Masters",
    "tag": "TMS",
    "inviteCode": "ABC123",
    "role": "CAPTAIN"
  }
}
```

Règles :
- utilisateur connecté requis ;
- créateur devient `CAPTAIN` ;
- code d'invitation généré côté back.

### GET `/teams/me`

Liste les équipes de l'utilisateur connecté.

Réponse :

```json
{
  "success": true,
  "data": [
    {
      "id": "team_1",
      "name": "Track Masters",
      "tag": "TMS",
      "role": "CAPTAIN"
    }
  ]
}
```

### GET `/teams/:teamId`

Retourne une équipe.

Règles :
- si équipe privée, membre requis ;
- si équipe publique, données publiques uniquement.

### POST `/teams/join`

Rejoindre une équipe via code.

Body :

```json
{
  "inviteCode": "ABC123"
}
```

Réponse :

```json
{
  "success": true,
  "data": {
    "teamId": "team_1",
    "role": "MEMBER"
  }
}
```

Règles :
- code valide ;
- doublon interdit (409 `TEAM_ALREADY_MEMBER`, y compris en cas de course) ;
- utilisateur ajouté comme `MEMBER`.

### DELETE `/teams/:teamId/leave`

Quitter une équipe (membre requis).

Réponse : `{ "success": true, "data": { "teamId": "team_1", "disbanded": false } }`

Règles :
- si le propriétaire part, le plus ancien membre restant est promu `CAPTAIN` ;
- s'il était le dernier membre, l'équipe est dissoute (`disbanded: true`).

## Chat d'équipe REST

### GET `/teams/:teamId/messages`

Retourne l'historique récent du chat.

Query possible :

```txt
?limit=50
```

Règles :
- membre requis ;
- messages triés par date ;
- pagination ou limite.

### POST `/teams/:teamId/messages`

Envoie un message via REST fallback.

Body :

```json
{
  "content": "Hello team !"
}
```

Règles :
- membre requis ;
- message vide refusé ;
- longueur maximale ;
- contenu non loggé en entier.

## Socket.io

### Connexion

Le client doit transmettre le token selon la stratégie retenue.

Exemple :

```ts
io(SOCKET_URL, {
  auth: {
    token: accessToken
  }
})
```

### Événements MVP

#### `team:join`

Rejoindre la room d'équipe.

Payload :

```json
{
  "teamId": "team_1"
}
```

Règles :
- token valide ;
- utilisateur membre de l'équipe.

#### `team:message:send`

Envoyer un message.

Payload :

```json
{
  "teamId": "team_1",
  "content": "Hello !"
}
```

Règles :
- longueur max 1000 caractères (`CHAT_MESSAGE_TOO_LONG`) ;
- anti-flood : max 10 messages / 10 s par socket — au-delà, le serveur émet
  `error` avec `{ "code": "RATE_LIMITED" }` et ignore le message.

#### `team:message:new`

Message reçu par les membres.

Payload :

```json
{
  "id": "msg_1",
  "teamId": "team_1",
  "sender": {
    "id": "user_1",
    "username": "DemoPlayer"
  },
  "content": "Hello !",
  "createdAt": "2026-05-10T12:00:00.000Z"
}
```

## Modules implémentés non détaillés ici

Endpoints présents dans `apps/api` (documentés via Swagger `/docs`), toutes
routes protégées par JWT sauf mention contraire. Format de réponse standard
`{ success: true, data }`.

### Users (profil étendu)

```txt
GET    /users/me                    Profil connecté
PATCH  /users/me                    Mise à jour du profil (pseudo)
GET    /users/me/export             RGPD — export JSON des données
DELETE /users/me                    RGPD — suppression du compte (204)
GET    /users/search?q=             Recherche d'utilisateurs par pseudo
```

### Players (profils publics)

```txt
GET /players/:username              Profil public d'un joueur (stats + badges)
```

### Friends (amis)

```txt
GET    /friends                             Liste d'amis
GET    /friends/requests                    Demandes envoyées/reçues
POST   /friends/requests                    Envoyer une demande (recipientId)
PATCH  /friends/requests/:requestId/accept  Accepter
PATCH  /friends/requests/:requestId/refuse  Refuser
PATCH  /friends/requests/:requestId/cancel  Annuler (émetteur)
DELETE /friends/:friendId                   Retirer un ami
```

### Messages privés (conversations directes)

```txt
GET   /messages/conversations                          Mes conversations
POST  /messages/conversations                          Créer/récupérer une conversation directe (recipientId)
GET   /messages/conversations/:conversationId/messages Historique
POST  /messages/conversations/:conversationId/messages Envoyer (REST fallback)
PATCH /messages/conversations/:conversationId/read     Marquer comme lue
```

Socket.io associé : `conversation:join`, `private:message:send`,
`private:message:new` (mêmes règles anti-flood que le chat d'équipe).

### Achievements (badges)

```txt
GET /achievements                   Catalogue des badges
GET /achievements/me                Progression du joueur connecté
```

### Game accounts (comptes de jeu externes)

```txt
GET   /game-accounts/me                     Comptes liés
POST  /game-accounts/steam/link             Lier un compte Steam (steamId)
GET   /game-accounts/steam/games            Jeux Steam possédés (+ suivi)
PATCH /game-accounts/steam/tracked-games    Choisir les jeux suivis (appIds)
```

### Teams (complément)

```txt
DELETE /teams/:teamId/leave         Quitter une équipe (voir section Teams)
```

## Health

### GET `/health`

Réponse :

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## Codes HTTP recommandés

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

## Erreurs fréquentes

```txt
AUTH_INVALID_CREDENTIALS
AUTH_UNAUTHORIZED
AUTH_FORBIDDEN
USER_EMAIL_ALREADY_EXISTS
VALIDATION_ERROR
STATS_PROVIDER_FAILED
TEAM_NOT_FOUND
TEAM_NAME_ALREADY_EXISTS
TEAM_ALREADY_MEMBER
TEAM_INVALID_INVITE_CODE
TEAM_MEMBER_REQUIRED
TEAM_NOT_MEMBER
CHAT_MESSAGE_EMPTY
CHAT_MESSAGE_TOO_LONG
PRIVATE_MESSAGE_EMPTY
PRIVATE_MESSAGE_TOO_LONG
CONVERSATION_NOT_FOUND
CONVERSATION_PARTICIPANT_REQUIRED
CONVERSATION_RECIPIENT_INVALID
FRIENDSHIP_NOT_FOUND
STEAM_ACCOUNT_ALREADY_LINKED
STEAM_ACCOUNT_NOT_LINKED
STEAM_NO_TRACKED_GAMES
STATS_SYNC_CONFLICT
RATE_LIMITED
INTERNAL_ERROR
```

## Swagger

Swagger doit documenter au minimum :

- Auth ;
- Users ;
- Stats ;
- Leaderboards ;
- Teams ;
- Chat ;
- Health.

Ne jamais mettre dans Swagger :
- vrai token ;
- vraie clé API ;
- vrai secret ;
- vrai mot de passe.
