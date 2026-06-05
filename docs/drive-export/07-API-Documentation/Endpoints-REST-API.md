# ENDPOINTS REST API

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit les endpoints REST prévus pour l'API Track'N Share.

L'objectif est de fournir une base claire pour le développement back-end NestJS et l'intégration front-end React/PWA. La documentation liste les routes principales, leur rôle, les méthodes HTTP, les paramètres attendus, les exemples de payloads, les réponses possibles, les statuts HTTP et les règles de sécurité associées.

Cette documentation concerne principalement l'API REST. Les événements temps réel Socket.io sont documentés séparément dans le fichier Documentation-Socket-io.

## 1 Vue d'ensemble

### 1.1 Rôle de l'API REST

L'API REST permet au front-end React/PWA de communiquer avec le back-end NestJS.

Elle couvre les domaines suivants :

- authentification ;

- gestion utilisateur ;

- profils ;

- jeux ;

- comptes de jeu liés ;

- statistiques joueur ;

- score ;

- leaderboards ;

- saisons et archivage ;

- équipes ;

- invitations ;

- messages et historique du chat ;

- notifications ;

- badges ;

- recherche ;

- mode démo ;

- administration.

### 1.2 Stack concernée

Front-end consommateur :

- React ;

- TypeScript ;

- PWA ;

- Wouter ;

- Valtio ;

- Socket.io client pour le temps réel.

Back-end fournisseur :

- NestJS ;

- TypeScript ;

- API REST ;

- Socket.io server ;

- Swagger / OpenAPI ;

- validation DTO ;

- guards NestJS.

Base de données :

- PostgreSQL recommandé pour les données principales ;

- Redis pour cache, sessions, leaderboards rapides et temps réel ;

- Redis-JSON possible selon contraintes.

## 2 Conventions générales

### 2.1 URL de base

En développement local, l'API peut être exposée sur :

http://localhost:3000/api

Exemple :

http://localhost:3000/api/auth/login

En production, l'URL dépendra du domaine retenu :

https://api.tracknshare.example.com/api

### 2.2 Versioning

Pour le MVP, le versioning peut être simple.

Option recommandée :

/api/v1

Exemple :

/api/v1/auth/login

Si le projet reste en MVP, il est acceptable de commencer avec /api puis d'ajouter /v1 plus tard.

### 2.3 Format des échanges

Toutes les requêtes et réponses utilisent JSON.

Headers recommandés :

Content-Type: application/json

Accept: application/json

Pour les routes protégées :

Authorization: Bearer <access_token>

Si la stratégie cookie HttpOnly est utilisée, l'access token ou le refresh token peut être transmis via cookie sécurisé plutôt que via Authorization header.

### 2.4 Convention de nommage

Les endpoints utilisent :

- des noms de ressources au pluriel ;

- des verbes HTTP pour indiquer l'action ;

- des chemins lisibles ;

- des paramètres explicites.

Exemples :

GET /users/me

PATCH /profiles/me

POST /teams

POST /teams/join

GET /leaderboards/solo

### 2.5 Format standard de réponse succès

Format recommandé :

{

"success": true,

"data": {},

"message": "Opération réussie"

}

Pour les listes paginées :

{

"success": true,

"data": [],

"pagination": {

"page": 1,

"limit": 20,

"total": 125,

"totalPages": 7

}

}

### 2.6 Format standard d'erreur

Format recommandé :

{

"success": false,

"error": {

"code": "VALIDATION_ERROR",

"message": "Les données envoyées sont invalides.",

"details": [

{

"field": "email",

"message": "Email invalide"

}

]

}

}

### 2.7 Codes HTTP principaux

200 OK

Requête réussie.

201 Created

Ressource créée.

204 No Content

Action réussie sans contenu à retourner.

400 Bad Request

Données invalides ou requête mal formée.

401 Unauthorized

Utilisateur non authentifié.

403 Forbidden

Utilisateur authentifié mais non autorisé.

404 Not Found

Ressource introuvable.

409 Conflict

Conflit de données : email déjà utilisé, invitation déjà acceptée, membre déjà présent, etc.

422 Unprocessable Entity

Données valides en forme mais impossibles à traiter métier.

429 Too Many Requests

Trop de requêtes, rate limit atteint.

500 Internal Server Error

Erreur serveur inattendue.

## 3 Authentification et session

### 3.1 POST /auth/register

Priorité : P0

Accès : public

Description : crée un compte utilisateur et initialise son profil.

Body :

{

"email": "clement@example.com",

"username": "ClementTNS",

"password": "MotDePasseFort123!"

}

Réponse 201 :

{

"success": true,

"data": {

"user": {

"id": "user_123",

"email": "clement@example.com",

"username": "ClementTNS",

"role": "PLAYER"

},

"profile": {

"id": "profile_123",

"userId": "user_123",

"visibility": "PUBLIC"

},

"accessToken": "jwt_access_token"

},

"message": "Compte créé avec succès."

}

Erreurs possibles :

- 400 : email invalide, mot de passe trop faible, pseudo vide ;

- 409 : email déjà utilisé, pseudo déjà utilisé ;

- 429 : trop de tentatives.

Règles métier :

- l'email doit être unique ;

- le mot de passe doit être hashé ;

- le mot de passe ne doit jamais être retourné ;

- un profil doit être créé avec l'utilisateur.

### 3.2 POST /auth/login

Priorité : P0

Accès : public

Description : connecte un utilisateur.

Body :

{

"email": "clement@example.com",

"password": "MotDePasseFort123!"

}

Réponse 200 :

{

"success": true,

"data": {

"user": {

"id": "user_123",

"email": "clement@example.com",

"username": "ClementTNS",

"role": "PLAYER"

},

"accessToken": "jwt_access_token"

},

"message": "Connexion réussie."

}

Erreurs possibles :

- 400 : champs manquants ;

- 401 : identifiants invalides ;

- 429 : trop de tentatives.

Règles métier :

- le message d'erreur ne doit pas révéler si l'email ou le mot de passe est incorrect ;

- un access token ou une session doit être créé en cas de succès.

### 3.3 POST /auth/logout

Priorité : P0

Accès : authentifié

Description : déconnecte l'utilisateur.

Réponse 204 :

Aucun contenu.

Règles métier :

- invalider ou supprimer la session / refresh token ;

- le front doit nettoyer son état utilisateur ;

- les données privées ne doivent plus rester accessibles.

### 3.4 GET /auth/me

Priorité : P0

Accès : authentifié

Description : retourne l'utilisateur actuellement connecté.

Réponse 200 :

{

"success": true,

"data": {

"id": "user_123",

"email": "clement@example.com",

"username": "ClementTNS",

"role": "PLAYER",

"profileId": "profile_123"

}

}

Erreurs possibles :

- 401 : token absent ou invalide.

### 3.5 POST /auth/refresh

Priorité : P1

Accès : refresh token valide

Description : renouvelle un access token.

Réponse 200 :

{

"success": true,

"data": {

"accessToken": "new_jwt_access_token"

}

}

Point de sécurité :

- recommandé si stratégie JWT avec access token court et refresh token long ;

- le refresh token doit être stocké de manière sécurisée.

### 3.6 POST /auth/forgot-password

Priorité : P1

Accès : public

Description : déclenche une procédure de réinitialisation de mot de passe.

Body :

{

"email": "clement@example.com"

}

Réponse 200 :

{

"success": true,

"message": "Si un compte existe, un email de réinitialisation a été envoyé."

}

### 3.7 POST /auth/reset-password

Priorité : P1

Accès : public avec token de reset

Description : réinitialise le mot de passe.

Body :

{

"resetToken": "token_reset",

"newPassword": "NouveauMotDePasse123!"

}

## 4 Utilisateurs

### 4.1 GET /users/me

Priorité : P0

Accès : authentifié

Description : retourne les informations du compte connecté.

Réponse 200 :

{

"success": true,

"data": {

"id": "user_123",

"email": "clement@example.com",

"username": "ClementTNS",

"role": "PLAYER",

"createdAt": "2026-05-06T10:00:00.000Z",

"lastLoginAt": "2026-05-06T12:00:00.000Z"

}

}

### 4.2 PATCH /users/me

Priorité : P1

Accès : authentifié

Description : met à jour les informations du compte.

Body :

{

"email": "new-email@example.com",

"username": "NewPseudo"

}

Règles :

- l'utilisateur ne peut modifier que son propre compte ;

- l'email doit rester unique ;

- le pseudo doit respecter les règles de validation.

### 4.3 DELETE /users/me

Priorité : P1

Accès : authentifié

Description : supprime ou anonymise le compte utilisateur.

Réponse 204 :

Aucun contenu.

Règles :

- confirmation côté front recommandée ;

- anonymisation possible des archives ;

- suppression ou invalidation des tokens.

## 5 Profils

### 5.1 GET /profiles/me

Priorité : P0

Accès : authentifié

Description : retourne le profil complet de l'utilisateur connecté.

Réponse 200 :

{

"success": true,

"data": {

"id": "profile_123",

"userId": "user_123",

"username": "ClementTNS",

"avatarUrl": "https://cdn.example.com/avatar.png",

"bannerUrl": "https://cdn.example.com/banner.png",

"bio": "Joueur compétitif FPS.",

"visibility": "PUBLIC",

"createdAt": "2026-05-06T10:00:00.000Z"

}

}

### 5.2 GET /profiles/:id

Priorité : P0

Accès : public ou authentifié selon visibilité

Description : retourne un profil utilisateur.

Paramètres :

- id : identifiant du profil ou de l'utilisateur selon convention retenue.

Règles :

- si le profil est privé, masquer les informations sensibles ;

- ne jamais afficher l'email publiquement.

### 5.3 GET /players/:username

Priorité : P1

Accès : public ou authentifié selon visibilité

Description : retourne un profil via le pseudo.

Exemple :

GET /players/ClementTNS

### 5.4 PATCH /profiles/me

Priorité : P0

Accès : authentifié

Description : modifie le profil de l'utilisateur connecté.

Body :

{

"bio": "Nouvelle bio",

"avatarUrl": "https://cdn.example.com/avatar.png",

"bannerUrl": "https://cdn.example.com/banner.png",

"visibility": "PUBLIC"

}

Erreurs :

- 400 : bio trop longue, URL invalide ;

- 401 : non connecté.

### 5.5 PATCH /profiles/me/privacy

Priorité : P1

Accès : authentifié

Description : modifie les paramètres de confidentialité du profil.

Body :

{

"visibility": "PRIVATE",

"showStats": true,

"showTeam": true,

"showSeasonHistory": false

}

## 6 Jeux

### 6.1 GET /games

Priorité : P0

Accès : public ou authentifié

Description : liste les jeux disponibles.

Query params :

- platform : filtre par plateforme ;

- isTeamBased : filtre jeu solo / équipe ;

- search : recherche par nom ;

- page ;

- limit.

Réponse 200 :

{

"success": true,

"data": [

{

"id": "game_1",

"name": "Valorant",

"platform": "PC",

"type": "FPS",

"isTeamBased": true,

"apiProvider": "MOCK",

"isActive": true

}

]

}

### 6.2 GET /games/:id

Priorité : P0

Accès : public ou authentifié

Description : détail d'un jeu.

### 6.3 POST /games

Priorité : P2

Accès : administrateur

Description : crée un jeu dans le catalogue.

Body :

{

"name": "Valorant",

"platform": "PC",

"type": "FPS",

"isTeamBased": true,

"apiProvider": "MOCK"

}

### 6.4 PATCH /games/:id

Priorité : P2

Accès : administrateur

Description : modifie un jeu.

### 6.5 DELETE /games/:id

Priorité : P2

Accès : administrateur

Description : désactive ou supprime un jeu.

## 7 Comptes de jeu liés

### 7.1 GET /game-accounts/me

Priorité : P0

Accès : authentifié

Description : liste les comptes de jeu liés à l'utilisateur connecté.

Réponse 200 :

{

"success": true,

"data": [

{

"id": "ga_123",

"gameId": "game_1",

"platform": "STEAM",

"externalUsername": "ClementSteam",

"lastSyncAt": "2026-05-06T12:00:00.000Z",

"linkedAt": "2026-05-01T10:00:00.000Z"

}

]

}

### 7.2 POST /game-accounts

Priorité : P0

Accès : authentifié

Description : lie un compte de jeu réel ou mocké.

Body :

{

"gameId": "game_1",

"platform": "STEAM",

"externalId": "steam_123456",

"externalUsername": "ClementSteam"

}

Réponse 201 :

{

"success": true,

"data": {

"id": "ga_123",

"gameId": "game_1",

"platform": "STEAM",

"externalUsername": "ClementSteam"

},

"message": "Compte de jeu lié avec succès."

}

Règles :

- un compte externe ne doit pas être lié à plusieurs utilisateurs si la règle est activée ;

- les tokens externes ne doivent jamais être retournés ;

- les tokens externes doivent être chiffrés si stockés.

### 7.3 POST /game-accounts/mock

Priorité : P0

Accès : authentifié

Description : crée un compte de jeu fictif pour la démo ou le MVP.

Body :

{

"gameId": "game_1",

"externalUsername": "DemoPlayer"

}

### 7.4 DELETE /game-accounts/:id

Priorité : P1

Accès : authentifié propriétaire

Description : délie un compte de jeu.

Règles :

- l'utilisateur doit être propriétaire du compte lié ;

- les tokens associés doivent être supprimés ou invalidés.

## 8 Statistiques joueur

### 8.1 GET /stats/me

Priorité : P0

Accès : authentifié

Description : retourne les statistiques de l'utilisateur connecté.

Query params :

- gameId ;

- seasonId ;

Réponse 200 :

{

"success": true,

"data": {

"userId": "user_123",

"gameId": "game_1",

"seasonId": "season_2026_q2",

"wins": 42,

"losses": 18,

"kills": 830,

"deaths": 510,

"matchesPlayed": 60,

"kdRatio": 1.63,

"winrate": 70,

"score": 3111.5,

"isEligible": true,

"lastSyncAt": "2026-05-06T12:00:00.000Z"

}

}

### 8.2 GET /stats/users/:userId

Priorité : P1

Accès : public ou authentifié selon confidentialité

Description : retourne les statistiques publiques d'un utilisateur.

Query params :

- gameId ;

- seasonId ;

### 8.3 POST /stats/sync

Priorité : P0

Accès : authentifié

Description : synchronise les statistiques depuis une API externe ou mockée.

Body :

{

"gameAccountId": "ga_123",

"gameId": "game_1",

"provider": "MOCK"

}

Réponse 200 :

{

"success": true,

"data": {

"stats": {

"wins": 42,

"losses": 18,

"kills": 830,

"deaths": 510,

"matchesPlayed": 60,

"kdRatio": 1.63,

"winrate": 70,

"score": 3111.5,

"isEligible": true

},

"leaderboardUpdated": true

},

"message": "Statistiques synchronisées avec succès."

}

Erreurs :

- 400 : compte de jeu invalide ;

- 401 : non connecté ;

- 403 : compte de jeu appartenant à un autre utilisateur ;

- 404 : compte de jeu introuvable ;

- 502 : API externe indisponible.

Règles :

- en cas d'échec API, conserver les anciennes statistiques ;

- recalculer K/D, winrate et score après synchronisation ;

- rattacher les statistiques à la saison active ;

- mettre à jour l'éligibilité leaderboard.

### 8.4 GET /stats/me/history

Priorité : P0

Accès : authentifié

Description : retourne l'historique des statistiques par saison.

Réponse 200 :

{

"success": true,

"data": [

{

"seasonId": "season_2026_q1",

"seasonName": "Saison 2026-Q1",

"gameId": "game_1",

"score": 2800,

"rank": 12,

"kdRatio": 1.45,

"winrate": 62,

"matchesPlayed": 80

}

]

}

## 9 Score

### 9.1 GET /score/me

Priorité : P0

Accès : authentifié

Description : retourne le score courant de l'utilisateur connecté.

Query params :

- gameId ;

- seasonId.

### 9.2 POST /score/recalculate

Priorité : P0

Accès : authentifié ou système selon cas

Description : recalcule le score d'un utilisateur après mise à jour des statistiques.

Body :

{

"gameId": "game_1",

"seasonId": "season_2026_q2"

}

Règle :

Pour le MVP, la formule documentée est :

Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5)

### 9.3 GET /score/formula

Priorité : P1

Accès : public

Description : retourne la formule de score affichable côté front.

Réponse 200 :

{

"success": true,

"data": {

"formula": "Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5)",

"minimumMatchesForLeaderboard": 10

}

}

## 10 Leaderboards

### 10.1 GET /leaderboards/solo

Priorité : P0

Accès : public ou authentifié

Description : retourne le leaderboard solo.

Query params :

- gameId : obligatoire ou recommandé ;

- seasonId : optionnel, saison active par défaut ;

- page ;

- limit ;

- includeCurrentUser : true/false.

Exemple :

GET /leaderboards/solo?gameId=game_1&seasonId=season_2026_q2&page=1&limit=50

Réponse 200 :

{

"success": true,

"data": [

{

"rank": 1,

"userId": "user_456",

"username": "TopPlayer",

"avatarUrl": "https://cdn.example.com/avatar.png",

"score": 3550,

"kdRatio": 2.1,

"winrate": 78,

"matchesPlayed": 120,

"seasonId": "season_2026_q2"

}

],

"pagination": {

"page": 1,

"limit": 50,

"total": 350,

"totalPages": 7

}

}

Règles :

- tri par score décroissant ;

- seuls les joueurs éligibles apparaissent dans le classement principal ;

- minimum recommandé : 10 parties par saison.

### 10.2 GET /leaderboards/teams

Priorité : P0

Accès : public ou authentifié

Description : retourne le leaderboard d'équipe.

Query params :

- gameId ;

- seasonId ;

- page ;

- limit ;

- scoreMode : average ou total.

Réponse 200 :

{

"success": true,

"data": [

{

"rank": 1,

"teamId": "team_123",

"name": "Shadow Wolves",

"tag": "SW",

"memberCount": 5,

"averageScore": 1280,

"totalScore": 6400,

"averageKdRatio": 1.42,

"averageWinrate": 57,

"seasonId": "season_2026_q2"

}

]

}

### 10.3 GET /leaderboards/me/rank

Priorité : P1

Accès : authentifié

Description : retourne le rang de l'utilisateur connecté.

Query params :

- gameId ;

- seasonId.

### 10.4 GET /leaderboards/teams/:teamId/rank

Priorité : P1

Accès : public ou authentifié

Description : retourne le rang d'une équipe.

## 11 Saisons et archivage

### 11.1 GET /seasons

Priorité : P0

Accès : public ou authentifié

Description : liste les saisons.

Query params :

- status : PLANNED, ACTIVE, CLOSED, ARCHIVED ;

- year ;

- page ;

- limit.

### 11.2 GET /seasons/current

Priorité : P0

Accès : public ou authentifié

Description : retourne la saison active.

Réponse 200 :

{

"success": true,

"data": {

"id": "season_2026_q2",

"code": "2026-Q2",

"name": "Saison 2026-Q2",

"startDate": "2026-04-01T00:00:00.000Z",

"endDate": "2026-06-30T23:59:59.000Z",

"status": "ACTIVE"

}

}

### 11.3 GET /seasons/:id

Priorité : P0

Accès : public ou authentifié

Description : détail d'une saison.

### 11.4 GET /seasons/:id/leaderboards/solo

Priorité : P1

Accès : public ou authentifié

Description : retourne le leaderboard solo d'une saison donnée.

### 11.5 GET /seasons/:id/leaderboards/teams

Priorité : P1

Accès : public ou authentifié

Description : retourne le leaderboard d'équipe d'une saison donnée.

### 11.6 POST /admin/seasons/:id/archive

Priorité : P1

Accès : administrateur

Description : déclenche l'archivage manuel d'une saison.

Règles :

- recalculer les scores finaux ;

- créer les snapshots ;

- archiver les statistiques ;

- passer la saison en ARCHIVED.

## 12 Équipes

### 12.1 POST /teams

Priorité : P0

Accès : authentifié

Description : crée une équipe.

Body :

{

"name": "Shadow Wolves",

"tag": "SW",

"description": "Équipe compétitive FPS",

"visibility": "PUBLIC"

}

Réponse 201 :

{

"success": true,

"data": {

"id": "team_123",

"name": "Shadow Wolves",

"tag": "SW",

"ownerId": "user_123",

"inviteCode": "SW-8K42X",

"visibility": "PUBLIC",

"createdAt": "2026-05-06T12:00:00.000Z"

},

"message": "Équipe créée avec succès."

}

Règles :

- le créateur devient capitaine ;

- un code d'invitation est généré ;

- le nom ne doit pas être vide ;

- le tag peut être unique selon règle retenue.

### 12.2 GET /teams/me

Priorité : P0

Accès : authentifié

Description : liste les équipes de l'utilisateur connecté.

### 12.3 GET /teams/:id

Priorité : P0

Accès : public ou authentifié selon visibilité

Description : détail d'une équipe.

Réponse 200 :

{

"success": true,

"data": {

"id": "team_123",

"name": "Shadow Wolves",

"tag": "SW",

"description": "Équipe compétitive FPS",

"visibility": "PUBLIC",

"memberCount": 5,

"currentSeasonStats": {

"averageScore": 1280,

"totalScore": 6400,

"averageKdRatio": 1.42,

"averageWinrate": 57

}

}

}

### 12.4 PATCH /teams/:id

Priorité : P1

Accès : capitaine ou co-capitaine selon permissions

Description : modifie une équipe.

Body :

{

"name": "Shadow Wolves Academy",

"description": "Nouvelle description",

"visibility": "PRIVATE"

}

### 12.5 DELETE /teams/:id

Priorité : P1

Accès : capitaine

Description : supprime ou désactive une équipe.

Règle :

- confirmation côté front obligatoire ;

- retirer l'accès au chat aux membres.

### 12.6 GET /teams/:id/members

Priorité : P0

Accès : public ou membre selon visibilité

Description : liste les membres d'une équipe.

### 12.7 POST /teams/:id/members/:userId/promote

Priorité : P1

Accès : capitaine

Description : promeut un membre en co-capitaine.

### 12.8 DELETE /teams/:id/members/:userId

Priorité : P1

Accès : capitaine ou utilisateur concerné selon cas

Description : exclut un membre ou permet de quitter l'équipe.

## 13 Invitations d'équipe

### 13.1 POST /teams/:id/invite-code/regenerate

Priorité : P0

Accès : capitaine ou co-capitaine

Description : régénère un code d'invitation.

Réponse 200 :

{

"success": true,

"data": {

"inviteCode": "SW-NEW42"

}

}

### 13.2 POST /teams/join

Priorité : P0

Accès : authentifié

Description : rejoint une équipe via un code.

Body :

{

"inviteCode": "SW-8K42X"

}

Réponse 200 :

{

"success": true,

"data": {

"teamId": "team_123",

"role": "MEMBER",

"joinedAt": "2026-05-06T12:30:00.000Z"

},

"message": "Vous avez rejoint l'équipe."

}

Erreurs :

- 400 : code invalide ;

- 401 : non connecté ;

- 404 : équipe introuvable ;

- 409 : utilisateur déjà membre.

### 13.3 POST /teams/:id/invitations

Priorité : P1

Accès : capitaine ou co-capitaine

Description : envoie une invitation à un utilisateur.

Body :

{

"userId": "user_456"

}

### 13.4 GET /team-invitations/me

Priorité : P1

Accès : authentifié

Description : liste les invitations reçues.

### 13.5 POST /team-invitations/:id/accept

Priorité : P1

Accès : utilisateur invité

Description : accepte une invitation.

### 13.6 POST /team-invitations/:id/refuse

Priorité : P1

Accès : utilisateur invité

Description : refuse une invitation.

### 13.7 DELETE /team-invitations/:id

Priorité : P1

Accès : capitaine, co-capitaine ou utilisateur invité selon cas

Description : annule ou supprime une invitation.

## 14 Statistiques d'équipe

### 14.1 GET /teams/:id/stats

Priorité : P0

Accès : public ou membre selon visibilité

Description : retourne les statistiques d'une équipe.

Query params :

- gameId ;

- seasonId.

Réponse 200 :

{

"success": true,

"data": {

"teamId": "team_123",

"gameId": "game_1",

"seasonId": "season_2026_q2",

"memberCount": 5,

"totalScore": 6400,

"averageScore": 1280,

"averageKdRatio": 1.42,

"averageWinrate": 57,

"bestPlayer": {

"userId": "user_456",

"username": "TopWolf",

"score": 1700

}

}

}

### 14.2 POST /teams/:id/stats/recalculate

Priorité : P1

Accès : capitaine, système ou admin

Description : recalcule les statistiques d'équipe.

### 14.3 GET /teams/:id/history

Priorité : P1

Accès : public ou membre selon visibilité

Description : retourne l'historique saisonnier d'une équipe.

## 15 Messages et chat REST

### 15.1 GET /teams/:id/messages

Priorité : P0

Accès : membre de l'équipe

Description : retourne l'historique du chat d'équipe.

Query params :

- before : date ou id curseur ;

- limit : nombre de messages ;

Réponse 200 :

{

"success": true,

"data": [

{

"id": "msg_123",

"teamId": "team_123",

"sender": {

"id": "user_123",

"username": "ClementTNS",

"avatarUrl": "https://cdn.example.com/avatar.png"

},

"content": "GG pour la game !",

"createdAt": "2026-05-06T12:45:00.000Z"

}

]

}

Règles :

- seul un membre peut lire le chat d'équipe ;

- les messages doivent être paginés ;

- les messages supprimés doivent être masqués.

### 15.2 POST /teams/:id/messages

Priorité : P0 ou fallback REST

Accès : membre de l'équipe

Description : envoie un message via REST si Socket.io n'est pas disponible.

Body :

{

"content": "On joue ce soir ?"

}

Règles :

- un message vide est refusé ;

- longueur maximale recommandée ;

- préférer Socket.io pour le temps réel.

### 15.3 DELETE /messages/:id

Priorité : P1

Accès : auteur, capitaine, modérateur ou admin selon règles

Description : supprime ou masque un message.

### 15.4 GET /messages/private

Priorité : P1

Accès : authentifié

Description : liste les conversations privées de l'utilisateur.

### 15.5 POST /messages/private

Priorité : P1

Accès : authentifié

Description : envoie un message privé.

## 16 Notifications

### 16.1 GET /notifications/me

Priorité : P1

Accès : authentifié

Description : liste les notifications de l'utilisateur connecté.

Query params :

- unreadOnly ;

- page ;

- limit.

### 16.2 PATCH /notifications/:id/read

Priorité : P1

Accès : propriétaire

Description : marque une notification comme lue.

### 16.3 PATCH /notifications/read-all

Priorité : P1

Accès : authentifié

Description : marque toutes les notifications comme lues.

### 16.4 DELETE /notifications/:id

Priorité : P1

Accès : propriétaire

Description : supprime une notification.

## 17 Badges et achievements

### 17.1 GET /achievements

Priorité : P1

Accès : public ou authentifié

Description : liste les badges disponibles.

### 17.2 GET /achievements/me

Priorité : P1

Accès : authentifié

Description : liste les badges débloqués par l'utilisateur connecté.

### 17.3 POST /achievements/check

Priorité : P1

Accès : système ou authentifié selon stratégie

Description : vérifie si l'utilisateur remplit des conditions de badges.

### 17.4 POST /admin/achievements

Priorité : P2

Accès : administrateur

Description : crée un badge.

## 18 Recherche

### 18.1 GET /search

Priorité : P1

Accès : public ou authentifié

Description : recherche globale.

Query params :

- q : terme recherché ;

- type : users, teams, games, all ;

- page ;

- limit.

Exemple :

GET /search?q=shadow&type=teams

Réponse 200 :

{

"success": true,

"data": {

"users": [],

"teams": [

{

"id": "team_123",

"name": "Shadow Wolves",

"tag": "SW"

}

],

"games": []

}

}

### 18.2 GET /search/users

Priorité : P1

Accès : public ou authentifié

Description : recherche des joueurs.

### 18.3 GET /search/teams

Priorité : P1

Accès : public ou authentifié

Description : recherche des équipes.

### 18.4 GET /search/games

Priorité : P1

Accès : public ou authentifié

Description : recherche des jeux.

## 19 Mode démo

### 19.1 POST /demo/seed

Priorité : P0

Accès : développement, admin ou environnement contrôlé

Description : insère des données fictives.

Réponse 201 :

{

"success": true,

"message": "Données de démonstration générées."

}

Règles :

- route désactivée ou protégée en production ;

- génère joueurs, équipes, jeux, saisons, stats et messages.

### 19.2 GET /demo/account

Priorité : P0

Accès : public en mode démo

Description : retourne les identifiants ou données d'un compte démo.

### 19.3 POST /demo/login

Priorité : P0

Accès : public en mode démo

Description : connecte automatiquement un compte de démonstration.

### 19.4 GET /demo/status

Priorité : P1

Accès : public ou admin

Description : indique si le mode démo est disponible.

## 20 Administration

### 20.1 GET /admin/users

Priorité : P2

Accès : administrateur

Description : liste les utilisateurs.

### 20.2 PATCH /admin/users/:id/disable

Priorité : P2

Accès : administrateur

Description : désactive un compte.

### 20.3 GET /admin/reports

Priorité : P2

Accès : administrateur ou modérateur

Description : liste les signalements.

### 20.4 PATCH /admin/reports/:id/resolve

Priorité : P2

Accès : administrateur ou modérateur

Description : traite un signalement.

### 20.5 GET /admin/seasons/jobs

Priorité : P2

Accès : administrateur

Description : consulte l'état des jobs liés aux saisons.

### 20.6 POST /admin/recalculate-leaderboards

Priorité : P2

Accès : administrateur

Description : force le recalcul des leaderboards.

## 21 Uploads et fichiers

### 21.1 POST /uploads/avatar

Priorité : P1

Accès : authentifié

Description : upload d'un avatar utilisateur.

Contraintes :

- formats autorisés : PNG, JPG, WebP ;

- taille maximale à définir ;

- ne jamais exécuter un fichier uploadé ;

- renommer les fichiers ;

- stocker hors dossier exécutable ou sur stockage dédié.

### 21.2 POST /uploads/team-avatar

Priorité : P1

Accès : capitaine ou co-capitaine

Description : upload d'un avatar d'équipe.

## 22 Healthcheck et monitoring

### 22.1 GET /health

Priorité : P0

Accès : public ou interne

Description : vérifie que l'API est disponible.

Réponse 200 :

{

"success": true,

"data": {

"status": "ok",

"timestamp": "2026-05-06T12:00:00.000Z"

}

}

### 22.2 GET /health/database

Priorité : P1

Accès : interne ou admin

Description : vérifie la connexion à la base de données.

### 22.3 GET /health/redis

Priorité : P1

Accès : interne ou admin

Description : vérifie la disponibilité de Redis.

## 23 Sécurité des endpoints

### 23.1 Routes publiques

Routes accessibles sans connexion :

- GET /health ;

- POST /auth/register ;

- POST /auth/login ;

- GET /games ;

- GET /games/:id ;

- GET /leaderboards/solo ;

- GET /leaderboards/teams ;

- GET /seasons ;

- GET /seasons/current ;

- GET /profiles/:id selon visibilité ;

- GET /search selon visibilité.

### 23.2 Routes authentifiées

Routes nécessitant une connexion :

- GET /auth/me ;

- POST /auth/logout ;

- GET /users/me ;

- PATCH /users/me ;

- GET /profiles/me ;

- PATCH /profiles/me ;

- GET /game-accounts/me ;

- POST /game-accounts ;

- GET /stats/me ;

- POST /stats/sync ;

- POST /teams ;

- GET /teams/me ;

- POST /teams/join ;

- GET /notifications/me.

### 23.3 Routes avec permissions d'équipe

Routes nécessitant d'être membre, capitaine ou co-capitaine :

- GET /teams/:id/messages : membre ;

- POST /teams/:id/messages : membre ;

- PATCH /teams/:id : capitaine ou co-capitaine ;

- DELETE /teams/:id : capitaine ;

- POST /teams/:id/invite-code/regenerate : capitaine ou co-capitaine ;

- DELETE /teams/:id/members/:userId : capitaine ou règles spécifiques.

### 23.4 Routes administrateur

Routes réservées admin :

- POST /games ;

- PATCH /games/:id ;

- DELETE /games/:id ;

- GET /admin/users ;

- PATCH /admin/users/:id/disable ;

- POST /admin/seasons/:id/archive ;

- POST /admin/recalculate-leaderboards.

## 24 Rate limiting recommandé

Routes à limiter fortement :

- POST /auth/login ;

- POST /auth/register ;

- POST /auth/forgot-password ;

- POST /teams/join ;

- POST /teams/:id/messages ;

- POST /messages/private ;

- POST /team-invitations ;

- POST /stats/sync.

Objectif :

- réduire le bruteforce ;

- réduire le spam ;

- protéger les APIs externes ;

- éviter les abus de synchronisation.

## 25 Priorisation MVP des endpoints

Endpoints indispensables MVP :

Authentification :

- POST /auth/register ;

- POST /auth/login ;

- POST /auth/logout ;

- GET /auth/me.

Profil :

- GET /profiles/me ;

- GET /profiles/:id ;

- PATCH /profiles/me.

Jeux et comptes liés :

- GET /games ;

- GET /games/:id ;

- GET /game-accounts/me ;

- POST /game-accounts ;

- POST /game-accounts/mock.

Stats et score :

- GET /stats/me ;

- POST /stats/sync ;

- GET /stats/me/history ;

- GET /score/me.

Leaderboards :

- GET /leaderboards/solo ;

- GET /leaderboards/teams.

Saisons :

- GET /seasons ;

- GET /seasons/current ;

- GET /seasons/:id.

Équipes :

- POST /teams ;

- GET /teams/me ;

- GET /teams/:id ;

- GET /teams/:id/members ;

- POST /teams/join ;

- POST /teams/:id/invite-code/regenerate ;

- GET /teams/:id/stats.

Chat REST :

- GET /teams/:id/messages ;

- POST /teams/:id/messages en fallback.

Démo :

- POST /demo/seed ;

- POST /demo/login ;

- GET /demo/account.

Health :

- GET /health.

## 26 Endpoints bonus

Endpoints bonus après MVP :

- mot de passe oublié ;

- refresh token avancé ;

- amis ;

- messages privés ;

- notifications ;

- badges ;

- recherche avancée ;

- upload d'avatars ;

- modération ;

- administration ;

- export RGPD ;

- comparaison joueur contre joueur ;

- matchmaking.

## 27 Exemples de DTO principaux

RegisterDto :

{

"email": "string",

"username": "string",

"password": "string"

}

LoginDto :

{

"email": "string",

"password": "string"

}

UpdateProfileDto :

{

"bio": "string",

"avatarUrl": "string",

"bannerUrl": "string",

"visibility": "PUBLIC | PRIVATE"

}

CreateTeamDto :

{

"name": "string",

"tag": "string",

"description": "string",

"visibility": "PUBLIC | PRIVATE"

}

JoinTeamDto :

{

"inviteCode": "string"

}

SyncStatsDto :

{

"gameAccountId": "string",

"gameId": "string",

"provider": "MOCK | STEAM | EPIC | CUSTOM"

}

SendMessageDto :

{

"content": "string"

}

## 28 Règles de validation transverses

Email :

- format email valide ;

- unique en base.

Mot de passe :

- longueur minimale ;

- complexité minimale ;

- jamais retourné côté front.

Pseudo :

- non vide ;

- longueur maximale ;

- unique si règle retenue.

Bio :

- longueur maximale ;

- contenu affiché de manière sécurisée.

Message :

- non vide ;

- longueur maximale ;

- auteur obligatoire ;

- conversation obligatoire.

Code d'invitation :

- non vide ;

- suffisamment aléatoire ;

- unique ;

- peut être régénéré.

Stats :

- valeurs numériques supérieures ou égales à 0 ;

- deaths = 0 doit être géré ;

- matchesPlayed = wins + losses si cette règle est retenue.

## 29 Erreurs métier fréquentes

AUTH_INVALID_CREDENTIALS

Identifiants invalides.

AUTH_TOKEN_EXPIRED

Token expiré.

USER_EMAIL_ALREADY_USED

Email déjà utilisé.

USER_USERNAME_ALREADY_USED

Pseudo déjà utilisé.

PROFILE_PRIVATE

Profil privé.

GAME_ACCOUNT_ALREADY_LINKED

Compte de jeu déjà lié.

NO_ACTIVE_SEASON

Aucune saison active.

STATS_SYNC_FAILED

La synchronisation des statistiques a échoué.

PLAYER_NOT_ELIGIBLE

Le joueur n'a pas assez de parties pour être classé.

TEAM_INVITE_CODE_INVALID

Code d'invitation invalide.

TEAM_ALREADY_MEMBER

Utilisateur déjà membre de l'équipe.

TEAM_FORBIDDEN_ACTION

Action non autorisée sur l'équipe.

CHAT_NOT_TEAM_MEMBER

L'utilisateur n'est pas membre de l'équipe.

RESOURCE_NOT_FOUND

Ressource introuvable.

## 30 Documentation Swagger

Swagger doit idéalement être disponible sur :

/api/docs

ou :

/api/v1/docs

Objectifs :

- visualiser tous les endpoints ;

- tester les routes ;

- documenter les DTO ;

- faciliter l'intégration front/back ;

- valoriser la qualité du back-end pendant la soutenance.

Les routes doivent être documentées avec :

- description ;

- tags par module ;

- body attendu ;

- query params ;

- réponses 200/201 ;

- erreurs possibles ;

- sécurité Bearer ou cookie.

## 31 Conclusion

Cette documentation REST définit les endpoints principaux de Track'N Share.

Pour le MVP, l'objectif est de couvrir correctement :

- authentification ;

- profils ;

- jeux ;

- comptes liés ;

- statistiques ;

- score ;

- leaderboards ;

- saisons ;

- équipes ;

- invitations ;

- chat d'équipe ;

- mode démo.

Les modules avancés comme notifications, badges, messages privés, administration, matchmaking et recherche avancée peuvent être ajoutés progressivement après stabilisation du socle principal.

La documentation Swagger devra reprendre ces routes pour servir de référence technique interactive pendant le développement et la soutenance.
