# CONVENTIONS API

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les conventions API à respecter pendant le développement de Track'N Share.

Il sert à garantir que les endpoints REST, les réponses JSON, les erreurs, l'authentification, les permissions, la pagination, les filtres, la documentation Swagger et les échanges avec le front-end restent cohérents dans toute l'application.

Ces conventions doivent être appliquées dès le début du développement afin d'éviter une API difficile à consommer, incohérente ou fragile.

## 1 Principes généraux

### 1.1 Objectif de l'API

L'API Track'N Share doit permettre au front-end React/PWA de communiquer avec le back-end NestJS pour :

- gérer l'authentification ;

- gérer les profils joueurs ;

- récupérer les statistiques ;

- synchroniser des données de jeu ;

- afficher les leaderboards ;

- gérer les équipes ;

- gérer les invitations ;

- gérer le chat d'équipe ;

- gérer les saisons ;

- gérer les notifications ;

- exposer une documentation Swagger claire.

### 1.2 API lisible et prévisible

Une route API doit être compréhensible rapidement.

Exemples :

- GET /api/users/me ;

- GET /api/stats/me ;

- POST /api/teams ;

- POST /api/teams/:teamId/join ;

- GET /api/leaderboards/solo.

### 1.3 Cohérence globale

Toutes les routes doivent respecter :

- le même format de réponse ;

- la même logique d'erreur ;

- les mêmes règles d'authentification ;

- les mêmes conventions de pagination ;

- les mêmes conventions de nommage ;

- une documentation Swagger à jour.

## 2 Préfixe et versioning

### 2.1 Préfixe global

Toutes les routes REST doivent être préfixées par :

/api

Exemples :

- /api/auth/login ;

- /api/users/me ;

- /api/teams ;

- /api/stats/me.

### 2.2 Versioning

Pour le MVP, le versioning peut rester implicite.

Deux options sont possibles :

Option simple MVP :

/api/auth/login

/api/stats/me

Option future versionnée :

/api/v1/auth/login

/api/v1/stats/me

Recommandation MVP :

Commencer avec /api, puis ajouter /v1 si le projet évolue vers une API publique plus stable.

### 2.3 Règle de compatibilité

Une fois que le front-end utilise une route, son contrat ne doit pas changer sans mise à jour coordonnée côté front.

## 3 Nommage des routes

### 3.1 Utiliser des noms en anglais

Les routes API doivent être en anglais pour rester cohérentes avec les standards techniques.

Exemples :

- /auth ;

- /users ;

- /profiles ;

- /stats ;

- /leaderboards ;

- /teams ;

- /notifications.

### 3.2 Utiliser le pluriel pour les ressources

Règle : utiliser le pluriel pour les collections.

Exemples :

- /users ;

- /teams ;

- /games ;

- /seasons ;

- /notifications.

Exceptions acceptables :

- /auth, car il s'agit d'un domaine fonctionnel ;

- /health, car il s'agit d'un endpoint technique.

### 3.3 Utiliser kebab-case si nécessaire

Pour les noms composés, utiliser le kebab-case.

Exemples :

- /game-accounts ;

- /team-invitations ;

- /leaderboard-snapshots.

### 3.4 Éviter les verbes inutiles

Préférer les ressources et les méthodes HTTP.

À éviter :

- GET /api/getUsers ;

- POST /api/createTeam ;

- POST /api/deleteMessage.

À préférer :

- GET /api/users ;

- POST /api/teams ;

- DELETE /api/messages/:messageId.

## 4 Méthodes HTTP

### 4.1 GET

Utilisé pour lire des données.

Exemples :

- GET /api/users/me ;

- GET /api/stats/me ;

- GET /api/leaderboards/solo ;

- GET /api/teams/:teamId.

### 4.2 POST

Utilisé pour créer une ressource ou déclencher une action métier.

Exemples :

- POST /api/auth/register ;

- POST /api/auth/login ;

- POST /api/teams ;

- POST /api/teams/:teamId/join ;

- POST /api/stats/sync.

### 4.3 PATCH

Utilisé pour modifier partiellement une ressource.

Exemples :

- PATCH /api/users/me ;

- PATCH /api/profiles/me ;

- PATCH /api/teams/:teamId ;

- PATCH /api/messages/:messageId.

### 4.4 PUT

Utilisé pour remplacer complètement une ressource.

Pour le MVP, PATCH est généralement préférable.

### 4.5 DELETE

Utilisé pour supprimer ou désactiver une ressource.

Exemples :

- DELETE /api/game-accounts/:accountId ;

- DELETE /api/teams/:teamId ;

- DELETE /api/messages/:messageId ;

- DELETE /api/users/me.

## 5 Format standard des réponses

### 5.1 Réponse succès simple

Format recommandé :

{

"success": true,

"data": {},

"message": "Action effectuée avec succès."

}

### 5.2 Réponse succès sans message

Pour les lectures simples, le message peut être omis.

{

"success": true,

"data": {

"id": "user_123",

"username": "PlayerOne"

}

}

### 5.3 Réponse liste

{

"success": true,

"data": [

{

"id": "team_123",

"name": "Blue Wolves"

}

]

}

### 5.4 Réponse paginée

{

"success": true,

"data": [],

"pagination": {

"page": 1,

"limit": 20,

"total": 120,

"totalPages": 6,

"hasNextPage": true,

"hasPreviousPage": false

}

}

### 5.5 Réponse erreur

{

"success": false,

"error": {

"code": "TEAM_ACCESS_DENIED",

"message": "Vous n'avez pas accès à cette équipe.",

"requestId": "req_abc123"

}

}

## 6 Statuts HTTP

### 6.1 Statuts de succès

200 OK

Lecture réussie ou action réussie.

201 Created

Création réussie.

204 No Content

Suppression réussie sans contenu retourné. Pour le MVP, il est aussi acceptable de retourner 200 avec un message standard.

### 6.2 Statuts d'erreur client

400 Bad Request

Payload invalide ou règle de validation non respectée.

401 Unauthorized

Utilisateur non authentifié ou token absent/invalide.

403 Forbidden

Utilisateur authentifié mais non autorisé.

404 Not Found

Ressource introuvable.

409 Conflict

Conflit métier : email déjà utilisé, pseudo déjà pris, utilisateur déjà membre d'une équipe, saison déjà archivée.

422 Unprocessable Entity

Optionnel. Peut être utilisé pour des erreurs métier fines, mais 400 suffit pour le MVP.

429 Too Many Requests

Rate limit atteint.

### 6.3 Statuts serveur

500 Internal Server Error

Erreur serveur non prévue.

502 Bad Gateway

Erreur d'un provider externe ou proxy.

503 Service Unavailable

Service temporairement indisponible : base, Redis, provider ou synchronisation.

## 7 Codes d'erreur métier

### 7.1 Authentification

Codes recommandés :

- AUTH_INVALID_CREDENTIALS ;

- AUTH_TOKEN_MISSING ;

- AUTH_TOKEN_INVALID ;

- AUTH_TOKEN_EXPIRED ;

- AUTH_USER_NOT_FOUND ;

- AUTH_EMAIL_ALREADY_USED ;

- AUTH_USERNAME_ALREADY_USED.

### 7.2 Permissions

Codes recommandés :

- ACCESS_DENIED ;

- RESOURCE_OWNER_REQUIRED ;

- ADMIN_REQUIRED ;

- TEAM_MEMBER_REQUIRED ;

- TEAM_ROLE_REQUIRED.

### 7.3 Équipes

Codes recommandés :

- TEAM_NOT_FOUND ;

- TEAM_ACCESS_DENIED ;

- TEAM_ALREADY_MEMBER ;

- TEAM_NOT_MEMBER ;

- TEAM_INVITE_CODE_INVALID ;

- TEAM_INVITE_CODE_EXPIRED ;

- TEAM_CAPTAIN_REQUIRED.

### 7.4 Statistiques

Codes recommandés :

- STATS_NOT_FOUND ;

- STATS_SYNC_FAILED ;

- STATS_PROVIDER_UNAVAILABLE ;

- STATS_MAPPING_FAILED ;

- STATS_RATE_LIMITED ;

- STATS_GAME_NOT_SUPPORTED.

### 7.5 Leaderboards et saisons

Codes recommandés :

- LEADERBOARD_NOT_FOUND ;

- SEASON_NOT_FOUND ;

- SEASON_ALREADY_ARCHIVED ;

- SEASON_ARCHIVE_FAILED ;

- PLAYER_NOT_ELIGIBLE.

### 7.6 Validation

Codes recommandés :

- VALIDATION_ERROR ;

- INVALID_PAGINATION ;

- INVALID_SORT ;

- INVALID_FILTER.

## 8 Authentification

### 8.1 Header Authorization

Les routes privées doivent utiliser le header :

Authorization: Bearer <access_token>

### 8.2 Routes publiques

Routes publiques possibles :

- POST /api/auth/register ;

- POST /api/auth/login ;

- GET /api/health ;

- GET /api/leaderboards/public si leaderboard public ;

- GET /api/profiles/:username si profil public.

### 8.3 Routes privées

Toutes les routes liées au compte utilisateur doivent être privées.

Exemples :

- GET /api/users/me ;

- PATCH /api/users/me ;

- GET /api/stats/me ;

- POST /api/stats/sync ;

- GET /api/teams/me ;

- POST /api/teams ;

- POST /api/messages.

### 8.4 Payload JWT

Le payload JWT doit rester minimal.

Exemple :

{

"sub": "user_123",

"role": "PLAYER"

}

Ne pas mettre dans le JWT :

- mot de passe ;

- hash ;

- email si non nécessaire ;

- données de profil complètes ;

- permissions complexes ;

- secrets.

## 9 Autorisation et permissions

### 9.1 Principe

L'autorisation doit toujours être vérifiée côté back-end.

Le front-end peut masquer les boutons, mais cela ne constitue pas une sécurité.

### 9.2 Guards recommandés

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard.

### 9.3 Exemples de règles

- un utilisateur ne modifie que son propre profil ;

- un joueur ne synchronise que ses propres statistiques ;

- un membre ne lit que le chat de ses équipes ;

- un capitaine peut gérer les invitations ;

- un admin peut accéder aux routes d'administration ;

- un utilisateur supprimé ou désactivé ne doit pas accéder aux routes privées.

## 10 Validation des entrées

### 10.1 DTO obligatoires

Toutes les entrées utilisateur doivent passer par un DTO.

Sources concernées :

- body ;

- params ;

- query ;

- headers si nécessaire ;

- payloads Socket.io ;

- données externes avant mapping.

### 10.2 Validation NestJS

Utiliser :

- class-validator ;

- class-transformer ;

- ValidationPipe global.

Options recommandées :

- whitelist: true ;

- forbidNonWhitelisted: true ou false selon tolérance ;

- transform: true.

### 10.3 Exemples de DTO

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendTeamMessageDto ;

- SyncStatsDto ;

- PaginationQueryDto.

### 10.4 Longueurs maximales recommandées

Exemples :

- pseudo : 3 à 30 caractères ;

- nom d'équipe : 3 à 40 caractères ;

- tag d'équipe : 2 à 6 caractères ;

- bio : 300 caractères ;

- message de chat : 1 à 1000 caractères ;

- code invitation : longueur fixe selon génération.

## 11 Pagination

### 11.1 Paramètres standards

Utiliser :

- page ;

- limit.

Exemple :

GET /api/leaderboards/solo?page=1&limit=20

### 11.2 Valeurs recommandées

- page par défaut : 1 ;

- limit par défaut : 20 ;

- limit maximum : 100.

### 11.3 Réponse paginée

{

"success": true,

"data": [],

"pagination": {

"page": 1,

"limit": 20,

"total": 100,

"totalPages": 5,

"hasNextPage": true,

"hasPreviousPage": false

}

}

### 11.4 Routes concernées

- GET /api/users ;

- GET /api/teams ;

- GET /api/leaderboards/solo ;

- GET /api/leaderboards/teams ;

- GET /api/messages ;

- GET /api/notifications.

## 12 Tri et filtres

### 12.1 Tri

Paramètres recommandés :

- sortBy ;

- sortOrder.

Exemple :

GET /api/leaderboards/solo?sortBy=score&sortOrder=desc

### 12.2 Valeurs de sortOrder

Valeurs acceptées :

- asc ;

- desc.

### 12.3 Filtres

Les filtres doivent être explicites.

Exemples :

- gameId ;

- seasonId ;

- teamId ;

- provider ;

- status ;

- q pour recherche textuelle courte.

Exemple :

GET /api/leaderboards/solo?gameId=game_123&seasonId=season_456

### 12.4 Sécurité

Les champs de tri et filtre doivent être whitelistés côté back-end.

Ne jamais injecter directement un paramètre sortBy dans une requête SQL sans validation.

## 13 Format des dates

### 13.1 Standard

Utiliser le format ISO 8601.

Exemple :

2026-05-10T12:30:00.000Z

### 13.2 Champs recommandés

Champs temporels :

- createdAt ;

- updatedAt ;

- deletedAt ;

- lastLoginAt ;

- lastSyncAt ;

- archivedAt ;

- startedAt ;

- endedAt.

### 13.3 Front-end

Le front-end se charge du format d'affichage local.

L'API retourne des dates standardisées, pas des dates déjà formatées en français.

## 14 Identifiants

### 14.1 Format

Utiliser des identifiants stables, idéalement UUID ou CUID selon l'ORM choisi.

### 14.2 Nommage JSON

Dans les réponses API, utiliser camelCase.

Exemples :

- userId ;

- teamId ;

- gameId ;

- seasonId ;

- messageId ;

- externalId.

### 14.3 Ressources externes

Pour les identifiants externes :

- externalId ;

- externalAppId ;

- provider ;

- providerAccountId.

## 15 Format JSON

15.1 camelCase côté API

Les propriétés JSON doivent être en camelCase.

Exemples :

- createdAt ;

- updatedAt ;

- lastSyncAt ;

- matchesPlayed ;

- kdRatio ;

- isEligible.

15.2 snake_case en base

La base de données peut utiliser snake_case.

Exemples :

- created_at ;

- updated_at ;

- last_sync_at ;

- matches_played.

Le back-end fait la conversion si nécessaire.

### 15.3 Valeurs nulles

Utiliser null lorsqu'une valeur est volontairement absente.

Éviter de mélanger undefined et null dans les réponses API.

## 16 Endpoints recommandés par domaine

### 16.1 Auth

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/refresh

GET /api/auth/me

### 16.2 Users et profils

GET /api/users/me

PATCH /api/users/me

DELETE /api/users/me

GET /api/profiles/:username

PATCH /api/profiles/me

### 16.3 Jeux et comptes liés

GET /api/games

GET /api/games/:gameId

GET /api/game-accounts/me

POST /api/game-accounts

DELETE /api/game-accounts/:accountId

### 16.4 Stats

GET /api/stats/me

GET /api/stats/me/:gameId

POST /api/stats/sync

GET /api/stats/history

### 16.5 Leaderboards

GET /api/leaderboards/solo

GET /api/leaderboards/teams

GET /api/leaderboards/solo/me

GET /api/leaderboards/snapshots/:seasonId

### 16.6 Teams

GET /api/teams

GET /api/teams/me

POST /api/teams

GET /api/teams/:teamId

PATCH /api/teams/:teamId

DELETE /api/teams/:teamId

POST /api/teams/:teamId/join

POST /api/teams/:teamId/leave

### 16.7 Team invitations

GET /api/teams/:teamId/invitations

POST /api/teams/:teamId/invitations

POST /api/teams/:teamId/invitations/regenerate

DELETE /api/teams/:teamId/invitations/:invitationId

### 16.8 Chat

GET /api/teams/:teamId/messages

POST /api/teams/:teamId/messages

PATCH /api/messages/:messageId

DELETE /api/messages/:messageId

### 16.9 Seasons

GET /api/seasons

GET /api/seasons/current

GET /api/seasons/:seasonId

POST /api/seasons/:seasonId/archive

### 16.10 Notifications

GET /api/notifications

PATCH /api/notifications/:notificationId/read

PATCH /api/notifications/read-all

DELETE /api/notifications/:notificationId

### 16.11 Health

GET /api/health

GET /api/health/database

GET /api/health/redis

GET /api/health/full

## 17 Actions métier spécifiques

### 17.1 Principe

Certaines actions ne sont pas des CRUD simples.

Elles peuvent utiliser POST avec un nom d'action clair.

Exemples :

- POST /api/stats/sync ;

- POST /api/seasons/:seasonId/archive ;

- POST /api/teams/:teamId/invitations/regenerate ;

- PATCH /api/notifications/read-all.

### 17.2 Règle

Ces actions doivent rester limitées et bien documentées.

Ne pas créer des routes d'action partout si une route REST classique suffit.

## 18 Rate limiting

### 18.1 Routes à limiter

Routes prioritaires :

- POST /api/auth/login ;

- POST /api/auth/register ;

- POST /api/stats/sync ;

- POST /api/teams/:teamId/join ;

- POST /api/teams/:teamId/messages ;

- POST /api/teams/:teamId/invitations/regenerate.

### 18.2 Réponse 429

Format :

{

"success": false,

"error": {

"code": "RATE_LIMITED",

"message": "Trop de requêtes. Réessayez plus tard.",

"requestId": "req_abc123"

}

}

### 18.3 Headers utiles

En évolution, l'API peut retourner :

- X-RateLimit-Limit ;

- X-RateLimit-Remaining ;

- X-RateLimit-Reset ;

- Retry-After.

## 19 Swagger et documentation

### 19.1 Objectif

Swagger doit permettre de comprendre et tester les endpoints API.

### 19.2 Règles Swagger

Chaque endpoint doit documenter :

- résumé ;

- description courte ;

- auth requise ou non ;

- body attendu ;

- query params ;

- path params ;

- réponses succès ;

- erreurs principales.

### 19.3 Groupes Swagger recommandés

Tags recommandés :

- Auth ;

- Users ;

- Profiles ;

- Games ;

- Stats ;

- Leaderboards ;

- Teams ;

- Chat ;

- Seasons ;

- Notifications ;

- Admin ;

- Health.

### 19.4 Sécurité Swagger

Ne jamais mettre dans Swagger :

- vraie clé API ;

- JWT_SECRET ;

- DATABASE_URL ;

- secrets Epic/Steam ;

- tokens réels ;

- mots de passe réels.

## 20 Gestion des fichiers et uploads

### 20.1 Endpoints possibles

Si l'upload est activé :

- POST /api/uploads/avatar ;

- POST /api/uploads/team-avatar ;

- DELETE /api/uploads/:fileId.

### 20.2 Règles

- vérifier le type MIME ;

- limiter la taille ;

- renommer le fichier ;

- ne pas exposer le chemin serveur ;

- refuser les fichiers exécutables ;

- protéger les routes par JWT.

### 20.3 MVP

Pour le MVP, l'upload peut être désactivé et remplacé par des avatars par défaut ou URLs contrôlées.

## 21 API et providers externes

### 21.1 Principe

Le front-end ne doit jamais appeler directement Steam ou Epic avec une clé privée.

Toutes les intégrations externes passent par le back-end.

### 21.2 Format provider

Le back-end doit normaliser les données externes avant de les retourner au front.

### 21.3 Fallback

En cas d'erreur externe :

- utiliser le cache si possible ;

- utiliser MockProvider en mode démo ;

- conserver les anciennes données ;

- retourner une erreur claire ;

- logger sans secret.

## 22 API et Socket.io

### 22.1 REST vs Socket.io

REST est utilisé pour :

- lecture initiale ;

- historique messages ;

- création de ressources ;

- actions métier.

Socket.io est utilisé pour :

- nouveaux messages en temps réel ;

- notifications temps réel ;

- événements typing ;

- présence en ligne en évolution.

### 22.2 Cohérence des payloads

Les payloads Socket.io doivent respecter les mêmes conventions que REST :

- camelCase ;

- validation ;

- erreurs claires ;

- pas de secret ;

- userId récupéré depuis le token, pas depuis le client.

## 23 Sécurité API

### 23.1 Règles obligatoires

- toutes les routes privées utilisent JWT ;

- les permissions sont vérifiées côté back-end ;

- les DTO valident les entrées ;

- les erreurs ne révèlent pas de stack trace ;

- les secrets ne sont jamais retournés ;

- les données sensibles sont exclues des réponses ;

- les logs ne contiennent pas de tokens.

### 23.2 Champs interdits en réponse

Ne jamais retourner :

- password ;

- passwordHash ;

- JWT_SECRET ;

- refreshToken brut ;

- API keys ;

- DATABASE_URL ;

- REDIS_URL ;

- secrets provider.

## 24 CORS

### 24.1 Principe

L'API doit accepter uniquement les origines autorisées.

En développement :

- http://localhost:5173.

En production future :

- domaine officiel de l'application.

### 24.2 Règle

Ne pas utiliser wildcard * avec credentials.

## 25 Idempotence

### 25.1 Principe

Certaines actions doivent pouvoir être rejouées sans provoquer de doublons dangereux.

Exemples :

- seed demo ;

- archivage de saison ;

- recalcul leaderboard ;

- synchronisation stats.

### 25.2 Recommandation

Les actions critiques doivent vérifier l'état existant avant d'écrire.

Exemple :

Une saison déjà archivée ne doit pas être archivée une deuxième fois.

## 26 Request ID

### 26.1 Objectif

Un requestId permet de retrouver une erreur dans les logs.

### 26.2 Usage

Chaque erreur API peut retourner :

requestId

Exemple :

{

"success": false,

"error": {

"code": "STATS_SYNC_FAILED",

"message": "La synchronisation a échoué.",

"requestId": "req_abc123"

}

}

## 27 Checklist API avant développement

Avant de coder l'API :

- définir le préfixe /api ;

- valider le format de réponse ;

- définir les codes d'erreur ;

- définir les modules principaux ;

- définir les routes MVP ;

- définir les DTO ;

- prévoir Swagger ;

- prévoir JWT ;

- prévoir les guards ;

- prévoir la pagination ;

- prévoir le rate limiting.

## 28 Checklist API avant merge

Avant de merger une route API :

- endpoint nommé correctement ;

- méthode HTTP cohérente ;

- DTO validé ;

- auth appliquée si nécessaire ;

- permissions vérifiées ;

- format de réponse standard ;

- erreurs gérées ;

- Swagger mis à jour ;

- aucun secret retourné ;

- test ou vérification manuelle effectué.

## 29 Risques et solutions

### 29.1 Risque : API incohérente

Impact : front difficile à intégrer.

Solution : format de réponse commun, conventions de routes et Swagger.

### 29.2 Risque : validation absente

Impact : données invalides ou faille sécurité.

Solution : DTO et ValidationPipe global.

### 29.3 Risque : permissions oubliées

Impact : accès non autorisé.

Solution : guards obligatoires sur routes privées.

### 29.4 Risque : erreurs trop techniques

Impact : fuite d'informations internes.

Solution : filtre d'exception et messages standardisés.

### 29.5 Risque : pagination absente

Impact : requêtes lourdes et lenteurs.

Solution : pagination par défaut sur les listes.

### 29.6 Risque : providers externes trop exposés

Impact : fuite de clés ou dépendance forte.

Solution : providers côté back-end, mapping et fallback.

## 30 Critères d'acceptation

Les conventions API sont respectées si :

- les routes utilisent le préfixe /api ;

- les noms de routes sont cohérents ;

- les méthodes HTTP sont adaptées ;

- les réponses succès suivent le format standard ;

- les erreurs suivent le format standard ;

- les statuts HTTP sont cohérents ;

- les DTO valident toutes les entrées ;

- les routes privées utilisent JWT ;

- les permissions sont vérifiées côté back-end ;

- la pagination est prévue pour les listes ;

- Swagger est maintenu ;

- les secrets ne sont jamais exposés ;

- le front-end peut consommer l'API de façon prévisible.

## 31 Conclusion

Les conventions API sont essentielles pour garantir une communication propre entre le front-end React/PWA et le back-end NestJS de Track'N Share.

Une API cohérente rend le développement plus simple, réduit les erreurs d'intégration et améliore la maintenabilité du projet.

Pour le MVP, les priorités sont : routes claires, réponses standardisées, validation DTO, JWT, permissions, pagination, rate limiting, Swagger et absence de secrets dans les réponses.

Ces conventions serviront de référence pendant tout le développement et devront être mises à jour si l'architecture API évolue.
