# TESTS API

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les tests API à réaliser pour valider les endpoints REST du MVP Track'N Share.

Il complète les documents Endpoints-REST-API, Conventions-API, Authentification-JWT, Roles-permissions, Strategie-tests, Plan-tests-MVP et Tests-securite.

L'objectif est de vérifier que l'API NestJS répond correctement, respecte les formats attendus, valide les entrées, protège les routes privées, applique les permissions et ne retourne aucune donnée sensible.

## 1 Vue d'ensemble

### 1.1 Objectif des tests API

Les tests API doivent vérifier :

- disponibilité des endpoints ;

- cohérence des méthodes HTTP ;

- format standard des réponses ;

- statuts HTTP corrects ;

- validation des DTO ;

- authentification JWT ;

- autorisations et rôles ;

- pagination ;

- tri et filtres ;

- erreurs métier ;

- absence de données sensibles ;

- compatibilité avec le front-end React/PWA ;

- compatibilité avec le mode démo.

### 1.2 Outils recommandés

Pour le MVP, les tests peuvent être réalisés avec :

- Swagger ;

- Postman ;

- Insomnia ;

- cURL ;

- Jest + Supertest en évolution ;

- tests e2e NestJS en évolution.

### 1.3 Environnement recommandé

Configuration de test MVP :

- Docker Compose lancé ;

- back-end NestJS disponible ;

- PostgreSQL disponible ;

- Redis disponible ;

- migrations passées ;

- seed démo exécuté ;

- MockProvider activé ;

- Steam/Epic désactivés ;

- Swagger activé.

Variables recommandées :

NODE_ENV=development

DEMO_MODE=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

## 2 Conventions de validation API

### 2.1 Format réponse succès

Toutes les réponses de succès doivent idéalement respecter :

{

"success": true,

"data": {},

"message": "Action effectuée avec succès."

}

Le champ message peut être absent pour les lectures simples.

### 2.2 Format réponse erreur

Toutes les erreurs doivent idéalement respecter :

{

"success": false,

"error": {

"code": "ERROR_CODE",

"message": "Message lisible côté utilisateur.",

"requestId": "req_abc123"

}

}

### 2.3 Données sensibles interdites

Les réponses API ne doivent jamais contenir :

- password ;

- passwordHash ;

- JWT_SECRET ;

- refreshToken brut si stratégie sécurisée ;

- clés Steam ;

- secret Epic ;

- DATABASE_URL ;

- REDIS_URL ;

- variables .env ;

- stack trace.

### 2.4 Statuts HTTP attendus

- 200 : lecture ou action réussie ;

- 201 : création réussie ;

- 400 : payload invalide ;

- 401 : token absent ou invalide ;

- 403 : utilisateur non autorisé ;

- 404 : ressource introuvable ;

- 409 : conflit métier ;

- 429 : rate limit ;

- 500 : erreur serveur non prévue.

## 3 Préconditions générales

Avant d'exécuter les tests API :

- l'API doit être lancée ;

- PostgreSQL doit être connecté ;

- Redis doit être connecté si utilisé ;

- les migrations doivent être passées ;

- un compte utilisateur de test doit exister ;

- un compte démo doit exister ;

- un token JWT valide doit pouvoir être obtenu ;

- Swagger doit être accessible si utilisé ;

- les données seedées doivent contenir joueurs, stats, équipes et messages.

## 4 Tests Healthcheck

### 4.1 API-HEALTH-001 — Healthcheck global

Priorité : P0

Méthode : GET

Endpoint : /api/health

Authentification : non requise

Objectif : vérifier que l'API répond.

Résultat attendu :

- statut 200 ;

- success true ;

- status ok ;

- aucune information sensible exposée.

### 4.2 API-HEALTH-002 — Healthcheck database

Priorité : P0

Méthode : GET

Endpoint : /api/health/database

Authentification : selon choix projet, public limité ou protégé

Objectif : vérifier la connexion PostgreSQL.

Résultat attendu :

- statut 200 si base disponible ;

- database ok ;

- aucune DATABASE_URL exposée.

### 4.3 API-HEALTH-003 — Healthcheck Redis

Priorité : P0

Méthode : GET

Endpoint : /api/health/redis

Authentification : selon choix projet

Objectif : vérifier la connexion Redis.

Résultat attendu :

- statut 200 si Redis disponible ;

- redis ok ;

- aucun mot de passe Redis exposé.

## 5 Tests authentification

### 5.1 API-AUTH-001 — Register valide

Priorité : P0

Méthode : POST

Endpoint : /api/auth/register

Authentification : non requise

Payload exemple :

{

"email": "player.test@example.local",

"username": "PlayerTest",

"password": "DemoPassword123!"

}

Résultat attendu :

- statut 201 ou 200 ;

- compte créé ;

- success true ;

- user retourné sans passwordHash ;

- email unique respecté.

### 5.2 API-AUTH-002 — Register email invalide

Priorité : P0

Méthode : POST

Endpoint : /api/auth/register

Payload exemple :

{

"email": "email-invalide",

"username": "PlayerTest",

"password": "DemoPassword123!"

}

Résultat attendu :

- statut 400 ;

- success false ;

- code VALIDATION_ERROR ;

- aucun compte créé.

### 5.3 API-AUTH-003 — Register mot de passe invalide

Priorité : P0

Méthode : POST

Endpoint : /api/auth/register

Cas à tester :

- password trop court ;

- password vide ;

- username vide ;

- username trop court.

Résultat attendu :

- statut 400 ;

- message clair ;

- aucune donnée invalide enregistrée.

### 5.4 API-AUTH-004 — Register email déjà utilisé

Priorité : P0

Méthode : POST

Endpoint : /api/auth/register

Résultat attendu :

- statut 409 ;

- code AUTH_EMAIL_ALREADY_USED ;

- aucun doublon.

### 5.5 API-AUTH-005 — Login valide

Priorité : P0

Méthode : POST

Endpoint : /api/auth/login

Authentification : non requise

Payload exemple :

{

"email": "demo@tracknshare.local",

"password": "DemoPassword123!"

}

Résultat attendu :

- statut 200 ;

- accessToken présent si stratégie Bearer ;

- user présent ;

- user sans passwordHash ;

- role présent si nécessaire ;

- message de succès.

### 5.6 API-AUTH-006 — Login invalide

Priorité : P0

Méthode : POST

Endpoint : /api/auth/login

Cas à tester :

- mauvais mot de passe ;

- email inexistant ;

- champs vides.

Résultat attendu :

- statut 401 ou 400 selon cas ;

- message générique ;

- aucun détail excessif sur l'existence de l'email ;

- aucun token retourné.

### 5.7 API-AUTH-007 — Auth/me avec token valide

Priorité : P0

Méthode : GET

Endpoint : /api/auth/me ou /api/users/me

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- utilisateur connecté retourné ;

- aucune donnée sensible ;

- id, username, role et profil selon contrat.

### 5.8 API-AUTH-008 — Auth/me sans token

Priorité : P0

Méthode : GET

Endpoint : /api/auth/me ou /api/users/me

Authentification : absente

Résultat attendu :

- statut 401 ;

- code AUTH_TOKEN_MISSING ou équivalent ;

- aucune donnée utilisateur retournée.

### 5.9 API-AUTH-009 — Auth/me avec token invalide

Priorité : P0

Méthode : GET

Endpoint : /api/auth/me ou /api/users/me

Authentification : Bearer token invalide

Résultat attendu :

- statut 401 ;

- code AUTH_TOKEN_INVALID ;

- aucune donnée privée.

### 5.10 API-AUTH-010 — Logout

Priorité : P1

Méthode : POST

Endpoint : /api/auth/logout

Authentification : Bearer token requis si endpoint back prévu

Résultat attendu :

- statut 200 ;

- success true ;

- session ou refresh token invalidé si implémenté ;

- aucun secret retourné.

## 6 Tests utilisateurs et profils

### 6.1 API-USER-001 — Consulter son profil

Priorité : P0

Méthode : GET

Endpoint : /api/users/me

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- données utilisateur connecté ;

- email présent seulement si profil privé propriétaire ;

- passwordHash absent.

### 6.2 API-USER-002 — Modifier son profil

Priorité : P1

Méthode : PATCH

Endpoint : /api/users/me ou /api/profiles/me

Authentification : Bearer token requis

Payload exemple :

{

"bio": "Joueur compétitif sur Track'N Share"

}

Résultat attendu :

- statut 200 ;

- données mises à jour ;

- validation appliquée ;

- champs interdits ignorés ou refusés.

### 6.3 API-USER-003 — Modifier profil avec payload invalide

Priorité : P1

Méthode : PATCH

Endpoint : /api/profiles/me

Cas à tester :

- bio trop longue ;

- username trop court ;

- champs inconnus.

Résultat attendu :

- statut 400 ;

- aucune donnée invalide enregistrée.

### 6.4 API-USER-004 — Consulter profil public

Priorité : P1

Méthode : GET

Endpoint : /api/profiles/:username

Authentification : optionnelle selon choix

Résultat attendu :

- statut 200 si profil public ;

- données publiques uniquement ;

- email absent ;

- données sensibles absentes.

## 7 Tests jeux et comptes liés

### 7.1 API-GAME-001 — Lister les jeux

Priorité : P0

Méthode : GET

Endpoint : /api/games

Authentification : selon choix projet, souvent publique ou privée

Résultat attendu :

- statut 200 ;

- liste de jeux ;

- format standard ;

- pagination si liste longue.

### 7.2 API-GAME-002 — Consulter un jeu

Priorité : P1

Méthode : GET

Endpoint : /api/games/:gameId

Résultat attendu :

- statut 200 si jeu existant ;

- statut 404 si jeu inexistant.

### 7.3 API-ACC-001 — Lister ses comptes liés

Priorité : P1

Méthode : GET

Endpoint : /api/game-accounts/me

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- comptes liés de l'utilisateur connecté uniquement ;

- aucun compte d'un autre utilisateur.

### 7.4 API-ACC-002 — Ajouter un compte de jeu

Priorité : P1

Méthode : POST

Endpoint : /api/game-accounts

Authentification : Bearer token requis

Payload exemple :

{

"provider": "MOCK",

"externalId": "mock-player-123",

"gameId": "game_123"

}

Résultat attendu :

- statut 201 ;

- compte lié créé ;

- provider validé ;

- doublon géré en 409 si nécessaire.

## 8 Tests statistiques

### 8.1 API-STATS-001 — Consulter ses statistiques

Priorité : P0

Méthode : GET

Endpoint : /api/stats/me

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- stats utilisateur connecté ;

- score présent ;

- lastSyncAt si disponible ;

- aucune donnée d'un autre utilisateur.

### 8.2 API-STATS-002 — Consulter stats par jeu

Priorité : P0

Méthode : GET

Endpoint : /api/stats/me/:gameId

Authentification : Bearer token requis

Résultat attendu :

- statut 200 si stats disponibles ;

- statut 404 si aucune stats ;

- gameId cohérent.

### 8.3 API-STATS-003 — Synchroniser ses stats en mock

Priorité : P0

Méthode : POST

Endpoint : /api/stats/sync

Authentification : Bearer token requis

Payload exemple :

{

"gameId": "game_123"

}

Résultat attendu :

- statut 200 ou 202 ;

- MockProvider utilisé ;

- stats mises à jour ;

- score recalculé ;

- lastSyncAt mis à jour ;

- Steam/Epic non nécessaires.

### 8.4 API-STATS-004 — Sync sans token

Priorité : P0

Méthode : POST

Endpoint : /api/stats/sync

Authentification : absente

Résultat attendu :

- statut 401 ;

- aucune synchronisation.

### 8.5 API-STATS-005 — Sync avec gameId invalide

Priorité : P0

Méthode : POST

Endpoint : /api/stats/sync

Résultat attendu :

- statut 400 ou 404 ;

- code STATS_GAME_NOT_SUPPORTED ou GAME_NOT_FOUND ;

- aucune écriture incohérente.

### 8.6 API-STATS-006 — Provider indisponible

Priorité : P1

Méthode : POST

Endpoint : /api/stats/sync

Objectif : vérifier le fallback en cas d'échec d'un provider réel.

Résultat attendu :

- erreur contrôlée ou fallback ;

- anciennes données conservées ;

- aucun crash API ;

- logs sans clé API.

## 9 Tests leaderboards

### 9.1 API-LB-001 — Leaderboard solo

Priorité : P0

Méthode : GET

Endpoint : /api/leaderboards/solo

Authentification : selon choix, public ou privé

Query exemple :

?page=1&limit=20&sortBy=score&sortOrder=desc

Résultat attendu :

- statut 200 ;

- liste triée par score décroissant ;

- pagination présente ;

- joueurs éligibles uniquement si règle appliquée.

### 9.2 API-LB-002 — Leaderboard solo avec filtre jeu

Priorité : P1

Méthode : GET

Endpoint : /api/leaderboards/solo?gameId=game_123

Résultat attendu :

- statut 200 ;

- résultats liés au jeu demandé ;

- 400 si gameId invalide.

### 9.3 API-LB-003 — Leaderboard saison

Priorité : P1

Méthode : GET

Endpoint : /api/leaderboards/solo?seasonId=season_123

Résultat attendu :

- statut 200 ;

- données liées à la saison ;

- archive figée si saison passée.

### 9.4 API-LB-004 — Pagination invalide

Priorité : P0

Méthode : GET

Endpoint : /api/leaderboards/solo?page=-1&limit=9999

Résultat attendu :

- statut 400 ou correction contrôlée ;

- limit maximum appliqué ;

- pas de requête trop lourde.

### 9.5 API-LB-005 — Mon rang

Priorité : P1

Méthode : GET

Endpoint : /api/leaderboards/solo/me

Authentification : Bearer token requis

Résultat attendu :

- rang de l'utilisateur connecté ;

- score ;

- statut non éligible si applicable.

## 10 Tests équipes

### 10.1 API-TEAM-001 — Créer une équipe

Priorité : P0

Méthode : POST

Endpoint : /api/teams

Authentification : Bearer token requis

Payload exemple :

{

"name": "Blue Wolves",

"tag": "BW"

}

Résultat attendu :

- statut 201 ;

- équipe créée ;

- créateur ajouté en CAPTAIN ;

- réponse standard ;

- validation nom/tag appliquée.

### 10.2 API-TEAM-002 — Créer équipe sans token

Priorité : P0

Méthode : POST

Endpoint : /api/teams

Authentification : absente

Résultat attendu :

- statut 401 ;

- aucune équipe créée.

### 10.3 API-TEAM-003 — Créer équipe payload invalide

Priorité : P0

Méthode : POST

Endpoint : /api/teams

Cas à tester :

- name vide ;

- name trop long ;

- tag trop long ;

- champs inconnus.

Résultat attendu :

- statut 400 ;

- validation claire ;

- aucune équipe invalide.

### 10.4 API-TEAM-004 — Consulter son équipe

Priorité : P0

Méthode : GET

Endpoint : /api/teams/me

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- équipe de l'utilisateur ;

- membres si prévu ;

- rôle de l'utilisateur.

### 10.5 API-TEAM-005 — Rejoindre équipe avec code valide

Priorité : P0

Méthode : POST

Endpoint : /api/teams/:teamId/join ou /api/teams/join

Authentification : Bearer token requis

Payload exemple :

{

"inviteCode": "ABC123"

}

Résultat attendu :

- statut 200 ou 201 ;

- utilisateur ajouté comme MEMBER ;

- accès au chat ensuite autorisé.

### 10.6 API-TEAM-006 — Rejoindre avec code invalide

Priorité : P0

Méthode : POST

Endpoint : /api/teams/join

Résultat attendu :

- statut 400 ou 404 ;

- code TEAM_INVITE_CODE_INVALID ;

- utilisateur non ajouté.

### 10.7 API-TEAM-007 — Quitter une équipe

Priorité : P1

Méthode : POST

Endpoint : /api/teams/:teamId/leave

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- utilisateur retiré ;

- accès chat retiré ;

- règle capitaine gérée.

### 10.8 API-TEAM-008 — Supprimer équipe par membre simple

Priorité : P0

Méthode : DELETE

Endpoint : /api/teams/:teamId

Authentification : Bearer token membre simple

Résultat attendu :

- statut 403 ;

- code TEAM_CAPTAIN_REQUIRED ou TEAM_ROLE_REQUIRED ;

- équipe non supprimée.

## 11 Tests invitations d'équipe

### 11.1 API-INV-001 — Consulter invitations équipe

Priorité : P1

Méthode : GET

Endpoint : /api/teams/:teamId/invitations

Authentification : CAPTAIN ou CO_CAPTAIN selon règle

Résultat attendu :

- statut 200 ;

- invitations de l'équipe ;

- accès refusé aux non-autorisés.

### 11.2 API-INV-002 — Générer invitation

Priorité : P1

Méthode : POST

Endpoint : /api/teams/:teamId/invitations

Authentification : CAPTAIN ou CO_CAPTAIN

Résultat attendu :

- statut 201 ;

- code généré ;

- expiration si prévue ;

- code non prévisible.

### 11.3 API-INV-003 — Régénérer code invitation

Priorité : P1

Méthode : POST

Endpoint : /api/teams/:teamId/invitations/regenerate

Authentification : CAPTAIN

Résultat attendu :

- statut 200 ;

- nouveau code ;

- ancien code invalidé ;

- rate limit si prévu.

## 12 Tests chat REST

### 12.1 API-CHAT-001 — Lire messages équipe comme membre

Priorité : P0

Méthode : GET

Endpoint : /api/teams/:teamId/messages

Authentification : Bearer token membre

Résultat attendu :

- statut 200 ;

- messages de l'équipe ;

- pagination si nécessaire ;

- auteur, date et contenu ;

- aucune donnée d'autres équipes.

### 12.2 API-CHAT-002 — Lire messages équipe comme non-membre

Priorité : P0

Méthode : GET

Endpoint : /api/teams/:teamId/messages

Authentification : Bearer token non-membre

Résultat attendu :

- statut 403 ;

- code TEAM_MEMBER_REQUIRED ;

- aucun message retourné.

### 12.3 API-CHAT-003 — Envoyer message comme membre

Priorité : P0

Méthode : POST

Endpoint : /api/teams/:teamId/messages

Authentification : Bearer token membre

Payload exemple :

{

"content": "Hello l'équipe !"

}

Résultat attendu :

- statut 201 ;

- message sauvegardé ;

- senderId défini depuis le token ;

- contenu validé ;

- broadcast Socket.io si branché.

### 12.4 API-CHAT-004 — Envoyer message vide

Priorité : P0

Méthode : POST

Endpoint : /api/teams/:teamId/messages

Payload exemple :

{

"content": ""

}

Résultat attendu :

- statut 400 ;

- code VALIDATION_ERROR ;

- aucun message sauvegardé.

### 12.5 API-CHAT-005 — Envoyer message comme non-membre

Priorité : P0

Méthode : POST

Endpoint : /api/teams/:teamId/messages

Authentification : Bearer token non-membre

Résultat attendu :

- statut 403 ;

- aucun message sauvegardé ;

- aucun broadcast.

### 12.6 API-CHAT-006 — Message trop long

Priorité : P1

Méthode : POST

Endpoint : /api/teams/:teamId/messages

Résultat attendu :

- statut 400 ;

- message refusé ;

- limite appliquée.

## 13 Tests saisons et archives

### 13.1 API-SEASON-001 — Lister saisons

Priorité : P1

Méthode : GET

Endpoint : /api/seasons

Résultat attendu :

- statut 200 ;

- liste des saisons ;

- saison active identifiable.

### 13.2 API-SEASON-002 — Consulter saison active

Priorité : P1

Méthode : GET

Endpoint : /api/seasons/current

Résultat attendu :

- statut 200 ;

- saison active ;

- dates cohérentes.

### 13.3 API-SEASON-003 — Archiver une saison

Priorité : P1

Méthode : POST

Endpoint : /api/seasons/:seasonId/archive

Authentification : ADMIN ou SYSTEM selon choix

Résultat attendu :

- statut 200 ;

- snapshot créé ;

- saison marquée archivée ;

- action refusée à PLAYER.

### 13.4 API-SEASON-004 — Archiver une saison déjà archivée

Priorité : P1

Méthode : POST

Endpoint : /api/seasons/:seasonId/archive

Résultat attendu :

- statut 409 ;

- code SEASON_ALREADY_ARCHIVED ;

- aucun doublon d'archive.

## 14 Tests notifications

### 14.1 API-NOTIF-001 — Lister ses notifications

Priorité : P2 ou P1 si développé

Méthode : GET

Endpoint : /api/notifications

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- notifications de l'utilisateur connecté uniquement ;

- pagination si nécessaire.

### 14.2 API-NOTIF-002 — Marquer notification comme lue

Priorité : P2

Méthode : PATCH

Endpoint : /api/notifications/:notificationId/read

Authentification : Bearer token requis

Résultat attendu :

- statut 200 ;

- notification mise à jour ;

- utilisateur propriétaire uniquement.

## 15 Tests admin

### 15.1 API-ADMIN-001 — Accès admin avec PLAYER

Priorité : P0 si routes admin développées

Méthode : GET

Endpoint : /api/admin/*

Authentification : Bearer token PLAYER

Résultat attendu :

- statut 403 ;

- code ADMIN_REQUIRED ;

- aucune donnée admin retournée.

### 15.2 API-ADMIN-002 — Accès admin avec ADMIN

Priorité : P1

Méthode : GET

Endpoint : /api/admin/*

Authentification : Bearer token ADMIN

Résultat attendu :

- statut 200 ;

- données ou action autorisée ;

- action loggée.

## 16 Tests rate limiting

### 16.1 API-RATE-001 — Login trop fréquent

Priorité : P1

Méthode : POST

Endpoint : /api/auth/login

Objectif : vérifier la limitation des tentatives.

Résultat attendu :

- après limite atteinte, statut 429 ;

- code RATE_LIMITED ;

- Retry-After si prévu ;

- logs propres.

### 16.2 API-RATE-002 — Sync stats trop fréquente

Priorité : P1

Méthode : POST

Endpoint : /api/stats/sync

Résultat attendu :

- sync refusée après limite ;

- statut 429 ;

- données existantes conservées.

### 16.3 API-RATE-003 — Messages chat trop fréquents

Priorité : P1

Méthode : POST

Endpoint : /api/teams/:teamId/messages

Résultat attendu :

- statut 429 ;

- aucun message sauvegardé après dépassement.

## 17 Tests validation et robustesse

### 17.1 API-VAL-001 — Champs inconnus

Priorité : P1

Objectif : vérifier que les champs non autorisés sont refusés ou ignorés selon configuration.

Résultat attendu :

- statut 400 si forbidNonWhitelisted activé ;

- ou champs ignorés ;

- aucun champ dangereux enregistré.

### 17.2 API-VAL-002 — Mauvais type de données

Priorité : P0

Cas à tester :

- nombre à la place d'un string ;

- tableau à la place d'un objet ;

- ID invalide ;

- query limit non numérique.

Résultat attendu :

- statut 400 ;

- message clair ;

- pas de crash.

### 17.3 API-VAL-003 — Ressource inexistante

Priorité : P0

Objectif : vérifier les 404.

Résultat attendu :

- statut 404 ;

- code clair ;

- pas de stack trace.

## 18 Tests sécurité des réponses

### 18.1 API-SEC-RESP-001 — Absence passwordHash

Priorité : P0

Endpoints concernés :

- /api/auth/login ;

- /api/auth/me ;

- /api/users/me ;

- /api/profiles/:username ;

- /api/teams/:teamId/members si membres retournés.

Résultat attendu :

- aucun passwordHash dans les réponses.

### 18.2 API-SEC-RESP-002 — Absence secrets techniques

Priorité : P0

Objectif : vérifier qu'aucune réponse API ne contient :

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- variables .env.

Résultat attendu :

- aucun secret exposé.

### 18.3 API-SEC-RESP-003 — Absence stack trace

Priorité : P0

Objectif : vérifier que les erreurs ne retournent pas de stack trace.

Résultat attendu :

- message d'erreur contrôlé ;

- requestId si prévu ;

- pas de chemins serveur.

## 19 Tests Swagger

### 19.1 API-SWAG-001 — Swagger accessible en développement

Priorité : P0

Méthode : GET

Endpoint : /api/docs

Résultat attendu :

- Swagger accessible ;

- tags principaux présents ;

- endpoints documentés.

### 19.2 API-SWAG-002 — Swagger sans secrets

Priorité : P0

Résultat attendu :

- aucun vrai token ;

- aucune clé API ;

- aucun mot de passe réel ;

- exemples fictifs uniquement.

### 19.3 API-SWAG-003 — Auth Bearer documentée

Priorité : P1

Résultat attendu :

- possibilité de renseigner un Bearer token ;

- endpoints privés indiqués comme protégés.

## 20 Tests mode démo API

### 20.1 API-DEMO-001 — API fonctionne sans Steam/Epic

Priorité : P0

Objectif : vérifier que le MVP fonctionne sans provider réel.

Résultat attendu :

- stats accessibles ;

- sync mock fonctionnelle ;

- leaderboard rempli ;

- aucune clé Steam/Epic requise.

### 20.2 API-DEMO-002 — Seed démo cohérent avec API

Priorité : P0

Objectif : vérifier que les données seedées sont exploitables par les endpoints.

Endpoints à vérifier :

- /api/auth/login ;

- /api/users/me ;

- /api/stats/me ;

- /api/leaderboards/solo ;

- /api/teams/me ;

- /api/teams/:teamId/messages.

Résultat attendu :

- tous les endpoints retournent des données cohérentes.

## 21 Matrice synthétique des tests API

| Domaine | Tests P0 | Tests P1 | Tests P2 |

|---|---|---|---|

| Health | API, DB, Redis | health full protégé | monitoring avancé |

| Auth | register, login, me, 401 | logout, refresh | reset password |

| Users | me, no passwordHash | update profile | export/suppression avancée |

| Games | list games | game details, accounts | providers réels avancés |

| Stats | get stats, sync mock | provider fallback | historique avancé |

| Leaderboards | solo, tri, pagination invalide | filtres jeu/saison | classement avancé |

| Teams | create, join, permissions | leave, update | modération |

| Chat | read/send member, reject non-member | rate limit | édition messages |

| Seasons | current/list si développé | archive | jobs avancés |

| Security | secrets absents, 401/403 | XSS/API fuzzing simple | pentest |

| Swagger | accessible, sans secrets | bearer documenté | génération client |

## 22 Critères d'acceptation API MVP

L'API MVP est considérée valide si :

- /api/health répond ;

- l'inscription fonctionne ;

- le login fonctionne ;

- les routes privées refusent l'absence de token ;

- /api/users/me retourne l'utilisateur connecté sans secret ;

- les stats mockées sont disponibles ;

- la sync mock fonctionne ;

- le leaderboard solo retourne une liste triée ;

- la création ou consultation d'équipe fonctionne ;

- le chat REST refuse les non-membres ;

- les erreurs sont standardisées ;

- les DTO refusent les payloads invalides ;

- Swagger est utilisable en développement ;

- aucune réponse ne contient de passwordHash ou secret ;

- l'API fonctionne sans Steam/Epic en mode démo.

## 23 Gestion des anomalies API

### 23.1 Anomalie bloquante

Exemples :

- login impossible ;

- route privée accessible sans token ;

- chat accessible à non-membre ;

- passwordHash retourné ;

- API crash sur payload invalide ;

- mode mock inutilisable.

Action : correction obligatoire avant soutenance.

### 23.2 Anomalie majeure

Exemples :

- mauvais statut HTTP ;

- pagination absente sur liste longue ;

- message d'erreur peu clair ;

- Swagger incomplet sur endpoint important.

Action : correction avant soutenance si temps disponible.

### 23.3 Anomalie mineure

Exemples :

- libellé d'erreur perfectible ;

- exemple Swagger incomplet ;

- champ message absent sur réponse succès non critique.

Action : amélioration si temps disponible.

## 24 Checklist rapide tests API avant soutenance

- Healthcheck API OK.

- Database health OK.

- Redis health OK.

- Register OK.

- Login OK.

- Token invalide refusé.

- Route privée sans token refusée.

- User me sans passwordHash.

- Stats me OK.

- Sync mock OK.

- Leaderboard solo OK.

- Team me ou create team OK.

- Join team avec code valide OK.

- Join team avec code invalide refusé.

- Messages équipe visibles pour membre.

- Messages équipe refusés pour non-membre.

- Message vide refusé.

- Swagger accessible.

- Swagger sans secret.

- Aucune clé API exposée.

- Aucun stack trace client.

## 25 Conclusion

Les tests API de Track'N Share servent à vérifier que le back-end NestJS fournit une API fiable, sécurisée et cohérente pour le front-end React/PWA.

Pour le MVP, les priorités sont l'authentification, les routes privées, les statistiques mockées, les leaderboards, les équipes, le chat, les permissions et le mode démo.

Ces tests peuvent d'abord être réalisés manuellement avec Swagger ou Postman, puis progressivement automatisés avec Jest, Supertest ou les tests e2e NestJS.

Une API est considérée prête pour la soutenance si elle fonctionne avec les données seedées, respecte les permissions, retourne des erreurs propres et ne révèle aucune donnée sensible.
