# Track'N Share — API Contract

## Objectif du fichier

Ce fichier définit les conventions API du MVP Track'N Share.

Claude Code doit respecter ces formats lors de la création ou modification des endpoints.

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

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible.",
    "requestId": "req_abc123"
  }
}
```

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

Déconnexion logique côté client.

MVP :
- peut être géré côté front si access token simple ;
- si refresh token ajouté, révoquer côté back.

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

Retourne les statistiques du joueur connecté.

Réponse :

```json
{
  "success": true,
  "data": {
    "game": {
      "id": "game_1",
      "name": "Valorant Mock"
    },
    "season": {
      "id": "season_1",
      "name": "Saison 1"
    },
    "wins": 42,
    "losses": 18,
    "kills": 340,
    "deaths": 210,
    "matchesPlayed": 60,
    "kdRatio": 1.62,
    "winrate": 70,
    "score": 291,
    "fetchedAt": "2026-05-10T12:00:00.000Z"
  }
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

Réponse :

```json
{
  "success": true,
  "data": {
    "synced": true,
    "stats": {}
  },
  "message": "Statistiques synchronisées."
}
```

Règles :
- MVP : utiliser MockProvider ;
- si provider échoue, conserver les anciennes stats ;
- ne pas dépendre de Steam/Epic pour la démo.

## Leaderboards

### GET `/leaderboards/solo`

Liste le leaderboard solo.

Query possible :

```txt
?gameId=game_1&seasonId=season_1&page=1&limit=20
```

Réponse :

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "rank": 1,
        "userId": "user_1",
        "username": "ClutchPlayer",
        "avatar": null,
        "score": 420,
        "kdRatio": 2.1,
        "winrate": 72,
        "matchesPlayed": 85
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
}
```

Règles :
- tri par score décroissant ;
- pagination ;
- filtrage par jeu et saison si disponible.

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
- doublon interdit ;
- utilisateur ajouté comme `MEMBER`.

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
TEAM_ALREADY_MEMBER
TEAM_INVALID_INVITE_CODE
TEAM_MEMBER_REQUIRED
CHAT_MESSAGE_EMPTY
CHAT_MESSAGE_TOO_LONG
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
