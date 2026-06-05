# STACK TECHNIQUE DÉTAILLÉE

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente la stack technique détaillée prévue pour le projet Track'N Share. Il explique les technologies choisies, leur rôle dans l'architecture, les raisons de leur utilisation et les points de vigilance associés.

Track'N Share est une plateforme web/mobile sous forme de Progressive Web App permettant à des joueurs de suivre, partager et comparer leurs statistiques gaming. Le projet nécessite donc une stack capable de gérer :

- une interface moderne et responsive ;

- une expérience mobile/PWA ;

- une API back-end structurée ;

- une authentification sécurisée ;

- des statistiques de jeu ;

- des leaderboards ;

- des équipes ;

- un chat temps réel ;

- des saisons ;

- des données de démonstration ;

- des règles de sécurité et confidentialité.

## 1 Vue d'ensemble de la stack

### 1.1 Stack principale recommandée

Front-end :

- React ;

- TypeScript ;

- Wouter ;

- Valtio ;

- Socket.io client ;

- PWA avec manifest et service worker ;

- CSS moderne ou librairie UI selon choix final.

Back-end :

- NestJS ;

- TypeScript ;

- API REST ;

- Socket.io server ;

- Swagger pour la documentation API ;

- class-validator et class-transformer pour la validation ;

- Guards NestJS pour la sécurité ;

- Helmet, CORS et rate limiting.

Base de données :

- PostgreSQL recommandé pour les données principales ;

- Redis recommandé pour le cache, les sessions, les leaderboards rapides et le temps réel ;

- Redis-JSON possible si imposé, mais à structurer avec rigueur.

DevOps et environnement :

- Docker ;

- Docker Compose ;

- GitHub ;

- GitHub Project ;

- fichiers .env et .env.example ;

- scripts de seed et de démarrage.

Tests et qualité :

- ESLint ;

- Prettier ;

- tests unitaires avec Jest côté back-end ;

- tests front-end possibles avec Vitest ou React Testing Library ;

- tests d'intégration API ;

- données seedées pour tests et démonstration.

## 2 Architecture générale

### 2.1 Type d'architecture

L'architecture du projet est une architecture client-serveur classique :

- le front-end React affiche l'interface utilisateur ;

- le back-end NestJS expose une API REST ;

- la base de données stocke les données métier ;

- Redis accélère certains usages et facilite le temps réel ;

- Socket.io permet le chat d'équipe et les événements instantanés.

### 2.2 Schéma logique

Utilisateur

→ Navigateur / PWA

→ Front-end React TypeScript

→ API REST NestJS

→ Services métier NestJS

→ Base de données PostgreSQL

→ Redis pour cache, sessions, leaderboards et temps réel

→ APIs externes ou API mockée pour les statistiques gaming

### 2.3 Objectifs de l'architecture

L'architecture doit permettre :

- une séparation claire entre front-end et back-end ;

- une application maintenable ;

- une sécurité correcte ;

- une évolution progressive ;

- une démonstration fiable ;

- une intégration simple avec des APIs externes ;

- une bonne expérience mobile.

## 3 Front-end

### 3.1 React

React est utilisé pour construire l'interface utilisateur.

Rôle dans le projet :

- créer les pages principales ;

- construire les composants réutilisables ;

- afficher le dashboard, les profils, les leaderboards, les équipes et le chat ;

- gérer l'interface responsive ;

- intégrer la logique PWA.

Pages concernées :

- landing page ;

- inscription ;

- connexion ;

- dashboard ;

- profil ;

- jeux ;

- leaderboards ;

- équipes ;

- chat d'équipe ;

- saisons ;

- paramètres ;

- mode démo.

Pourquoi React :

- adapté aux interfaces dynamiques ;

- écosystème très riche ;

- compatible avec TypeScript ;

- bonne gestion des composants ;

- pertinent pour une PWA.

Points de vigilance :

- éviter les composants trop gros ;

- factoriser les composants réutilisables ;

- garder une structure claire par feature ;

- gérer proprement les états de chargement, erreur et données vides.

### 3.2 TypeScript côté front-end

TypeScript ajoute du typage statique à JavaScript.

Rôle dans le projet :

- typer les données utilisateur ;

- typer les statistiques ;

- typer les réponses API ;

- typer les équipes, messages, saisons et leaderboards ;

- limiter les erreurs liées aux structures de données.

Pourquoi TypeScript :

- meilleure robustesse ;

- meilleure autocomplétion ;

- meilleure collaboration ;

- cohérence avec NestJS côté back-end.

Types importants à définir :

- User ;

- Profile ;

- Game ;

- GameAccount ;

- PlayerStats ;

- Team ;

- TeamMember ;

- Season ;

- LeaderboardEntry ;

- Message ;

- Notification.

### 3.3 Wouter

Wouter est une librairie légère de routing pour React.

Rôle dans le projet :

- gérer les routes front-end ;

- afficher les bonnes pages selon l'URL ;

- protéger certaines routes côté interface ;

- gérer les pages dynamiques comme /profile/:id ou /teams/:id.

Routes principales :

- / ;

- /login ;

- /register ;

- /dashboard ;

- /profile/:id ;

- /games ;

- /leaderboard ;

- /teams ;

- /teams/create ;

- /teams/:id ;

- /teams/:id/chat ;

- /seasons ;

- /settings.

Pourquoi Wouter :

- simple ;

- léger ;

- adapté aux projets React sans complexité excessive.

Point de vigilance :

- les routes privées doivent aussi être protégées côté back-end, pas uniquement côté front-end.

### 3.4 Valtio

Valtio est une librairie de gestion d'état.

Rôle dans le projet :

- stocker l'état utilisateur connecté ;

- conserver certaines données globales ;

- gérer le thème ou les paramètres UI ;

- partager des informations entre composants.

États possibles :

- utilisateur connecté ;

- token ou état de session selon stratégie retenue ;

- profil courant ;

- notifications non lues ;

- équipe active ;

- statut de chargement global.

Pourquoi Valtio :

- simple à prendre en main ;

- moins lourd que Redux ;

- adapté à un projet étudiant ou MVP.

Point de vigilance :

- ne pas stocker de données sensibles inutilement côté front ;

- éviter de stocker des tokens sensibles dans localStorage.

### 3.5 Composants UI

Le front-end doit être construit avec des composants réutilisables.

Composants principaux :

- Button ;

- Input ;

- Select ;

- Modal ;

- Card ;

- StatCard ;

- LeaderboardTable ;

- TeamCard ;

- UserAvatar ;

- Badge ;

- EmptyState ;

- ErrorMessage ;

- Loader ;

- ChatMessage ;

- MobileNavigation.

Objectif :

- éviter la duplication ;

- accélérer le développement ;

- garantir une interface homogène.

### 3.6 Responsive et mobile-first

L'application doit être utilisable sur mobile et desktop.

Règles front-end :

- concevoir d'abord pour mobile ;

- adapter les tableaux de leaderboard ;

- utiliser des cartes sur petit écran ;

- prévoir une navigation mobile claire ;

- éviter les colonnes trop larges ;

- tester régulièrement sur navigateur mobile.

Pages critiques à rendre responsive :

- dashboard ;

- profil ;

- leaderboard ;

- page équipe ;

- chat ;

- formulaire d'inscription et connexion.

## 4 PWA

### 4.1 Objectif PWA

La Progressive Web App doit permettre d'utiliser Track'N Share comme une application installable.

Objectifs :

- installation sur mobile ou desktop ;

- mode standalone ;

- icône d'application ;

- expérience fluide ;

- page offline simple ;

- responsive complet.

### 4.2 Manifest

Le manifest doit contenir :

- name : Track'N Share ;

- short_name : TNS ;

- start_url ;

- display : standalone ;

- icons 192x192 et 512x512 ;

- theme_color ;

- background_color.

### 4.3 Service worker

Le service worker permet :

- de mettre en cache certains assets statiques ;

- d'afficher une page offline ;

- d'améliorer l'expérience de chargement.

Stratégie recommandée :

- cache-first pour les assets statiques ;

- network-first pour les données utilisateur ;

- pas de cache persistant pour les messages privés ou données sensibles.

### 4.4 Points de vigilance PWA

- Ne pas cacher de données privées après déconnexion.

- Nettoyer l'état utilisateur au logout.

- Tester l'application en mode standalone.

- Vérifier le manifest dans les DevTools.

- Prévoir une page offline simple mais claire.

## 5 Back-end

### 5.1 NestJS

NestJS est le framework back-end principal.

Rôle dans le projet :

- exposer l'API REST ;

- gérer l'authentification ;

- appliquer les règles métier ;

- gérer les statistiques ;

- calculer les scores ;

- gérer les équipes ;

- gérer les saisons ;

- gérer le chat temps réel ;

- centraliser la sécurité.

Pourquoi NestJS :

- architecture modulaire ;

- très adapté à TypeScript ;

- structure claire avec modules, controllers et services ;

- support des guards, interceptors, pipes ;

- compatible Socket.io ;

- compatible Swagger.

### 5.2 TypeScript côté back-end

TypeScript est utilisé côté back-end pour :

- typer les DTO ;

- typer les entités ;

- typer les services ;

- réduire les erreurs de logique ;

- aligner front-end et back-end.

### 5.3 Modules NestJS recommandés

Modules principaux :

- AuthModule ;

- UsersModule ;

- ProfilesModule ;

- GamesModule ;

- GameAccountsModule ;

- StatsModule ;

- ScoreModule ;

- LeaderboardModule ;

- TeamsModule ;

- TeamInvitationsModule ;

- SeasonsModule ;

- ChatModule ;

- MessagesModule ;

- NotificationsModule ;

- AchievementsModule ;

- SecurityModule ;

- DemoModule ;

- AdminModule.

Modules obligatoires MVP :

- AuthModule ;

- UsersModule ;

- ProfilesModule ;

- GamesModule ;

- StatsModule ;

- ScoreModule ;

- LeaderboardModule ;

- TeamsModule ;

- SeasonsModule ;

- ChatModule ;

- DemoModule.

### 5.4 Controllers

Les controllers reçoivent les requêtes HTTP.

Exemples :

- AuthController ;

- UsersController ;

- ProfilesController ;

- GamesController ;

- StatsController ;

- LeaderboardController ;

- TeamsController ;

- SeasonsController ;

- MessagesController.

### 5.5 Services

Les services contiennent la logique métier.

Exemples :

- AuthService ;

- UsersService ;

- StatsService ;

- ScoreService ;

- LeaderboardService ;

- TeamsService ;

- ChatService ;

- SeasonsService ;

- DemoSeedService.

### 5.6 DTO et validation

Les DTO définissent la structure des données entrantes.

Exemples :

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendMessageDto ;

- SyncStatsDto.

Outils :

- class-validator ;

- class-transformer ;

- ValidationPipe global.

Objectif :

- refuser les données invalides ;

- limiter les failles ;

- garantir la cohérence des entrées.

## 6 API REST

### 6.1 Rôle de l'API

L'API REST permet au front-end de communiquer avec le back-end.

Elle doit gérer :

- authentification ;

- profils ;

- jeux ;

- statistiques ;

- score ;

- leaderboards ;

- équipes ;

- saisons ;

- messages ;

- mode démo.

### 6.2 Endpoints MVP recommandés

Authentification :

- POST /auth/register ;

- POST /auth/login ;

- POST /auth/logout ;

- GET /auth/me.

Utilisateurs et profils :

- GET /users/me ;

- GET /profiles/:id ;

- PATCH /profiles/me.

Jeux :

- GET /games ;

- GET /games/:id.

Statistiques :

- GET /stats/me ;

- POST /stats/sync ;

- GET /stats/:userId/:gameId.

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

- PATCH /teams/:id ;

- POST /teams/:id/invite-code ;

- POST /teams/join ;

- POST /teams/:id/leave.

Chat :

- GET /teams/:id/messages ;

- POST /teams/:id/messages si envoi REST complémentaire.

Démo :

- POST /demo/seed ;

- GET /demo/account ;

- GET /demo/stats.

### 6.3 Documentation API

Swagger est recommandé pour documenter l'API.

Objectifs :

- lister les endpoints ;

- documenter les paramètres ;

- tester les routes ;

- faciliter l'intégration front/back.

## 7 Temps réel

### 7.1 Socket.io

Socket.io est utilisé pour les fonctionnalités temps réel.

Fonctionnalités concernées :

- chat d'équipe ;

- réception instantanée de messages ;

- statut en ligne en bonus ;

- notifications en bonus.

### 7.2 Rooms Socket.io

Une room peut être créée par équipe.

Exemple :

- team:{teamId}

Règles :

- seul un membre de l'équipe peut rejoindre la room ;

- le serveur vérifie les droits ;

- les messages sont sauvegardés avant ou pendant la diffusion ;

- un non-membre ne reçoit pas les messages.

### 7.3 Événements possibles

Côté client vers serveur :

- joinTeamRoom ;

- leaveTeamRoom ;

- sendTeamMessage.

Côté serveur vers client :

- teamMessageReceived ;

- teamMessageDeleted ;

- userTyping en bonus ;

- notificationReceived en bonus.

### 7.4 Points de vigilance

- Toujours vérifier l'authentification sur la connexion Socket.io.

- Vérifier les droits d'équipe avant de rejoindre une room.

- Ne pas faire confiance uniquement au front-end.

- Gérer les reconnexions.

- Prévoir un historique REST en complément du temps réel.

## 8 Base de données

### 8.1 Choix recommandé : PostgreSQL

PostgreSQL est recommandé pour les données principales.

Pourquoi :

- données relationnelles nombreuses ;

- utilisateurs, équipes, membres, messages, saisons et statistiques liés entre eux ;

- requêtes structurées ;

- intégrité référentielle ;

- robustesse ;

- meilleure maintenabilité qu'un stockage uniquement clé/valeur.

Données adaptées à PostgreSQL :

- users ;

- profiles ;

- games ;

- game_accounts ;

- player_stats ;

- teams ;

- team_members ;

- team_invitations ;

- seasons ;

- messages ;

- notifications ;

- achievements.

### 8.2 Redis

Redis est recommandé en complément.

Usages :

- cache ;

- sessions si nécessaire ;

- leaderboards rapides ;

- stockage temporaire ;

- rate limiting ;

- pub/sub pour Socket.io si besoin ;

- files d'attente légères si besoin.

### 8.3 Redis-JSON

Redis-JSON peut être utilisé si imposé dans le projet.

Avantages :

- stockage JSON simple ;

- rapide ;

- adapté à certains documents ;

- intéressant pour prototypage.

Limites :

- relations complexes moins naturelles ;

- risque de duplication ;

- requêtes métier plus difficiles ;

- moins adapté aux nombreuses relations du projet.

Recommandation :

- PostgreSQL pour les données principales ;

- Redis pour cache, sessions, leaderboard rapide et temps réel ;

- Redis-JSON uniquement si contrainte pédagogique ou technique.

### 8.4 Modèle de données principal

Entités principales :

- User ;

- Profile ;

- Game ;

- GameAccount ;

- PlayerStats ;

- Season ;

- Team ;

- TeamMember ;

- TeamInvitation ;

- Conversation ;

- Message ;

- Notification ;

- Achievement.

Relations principales :

- un User possède un Profile ;

- un User peut lier plusieurs GameAccounts ;

- un User possède plusieurs PlayerStats ;

- un PlayerStats appartient à un Game et une Season ;

- une Team possède plusieurs TeamMembers ;

- un User peut appartenir à plusieurs Teams selon les règles retenues ;

- une Team possède un chat ;

- un Message appartient à une conversation ou une équipe.

## 9 Sécurité technique

### 9.1 Authentification

Technologies et pratiques :

- hash des mots de passe avec Argon2 ou bcrypt ;

- JWT ou sessions sécurisées ;

- cookies HttpOnly, Secure, SameSite si stratégie cookie ;

- guards NestJS ;

- vérification des permissions côté serveur.

### 9.2 Validation

Outils :

- class-validator ;

- class-transformer ;

- ValidationPipe.

Objectif :

- refuser les champs invalides ;

- éviter les payloads dangereux ;

- protéger l'API.

### 9.3 Protection HTTP

Outils :

- Helmet ;

- CORS configuré précisément ;

- rate limiting ;

- gestion centralisée des erreurs.

### 9.4 Données sensibles

Données à protéger :

- mot de passe ;

- email ;

- tokens externes ;

- messages ;

- sessions ;

- clés API ;

- secrets JWT ;

- clés de chiffrement.

Règles :

- ne jamais logger les mots de passe ;

- ne jamais exposer les tokens côté front ;

- stocker les secrets dans .env ;

- fournir un .env.example sans secrets ;

- chiffrer les tokens externes si stockés ;

- chiffrer les messages en base si possible.

## 10 DevOps et environnement

### 10.1 Docker

Docker permet d'isoler les services du projet.

Services possibles :

- front-end ;

- back-end ;

- PostgreSQL ;

- Redis ;

- adminer ou pgAdmin en bonus.

### 10.2 Docker Compose

Docker Compose permet de lancer tout l'environnement en une commande.

Objectif :

- simplifier l'installation ;

- éviter les différences entre machines ;

- faciliter la soutenance ;

- permettre un environnement reproductible.

### 10.3 Variables d'environnement

Fichiers :

- .env pour les valeurs locales ;

- .env.example pour documenter les variables nécessaires.

Variables possibles :

- DATABASE_URL ;

- REDIS_URL ;

- JWT_SECRET ;

- JWT_EXPIRES_IN ;

- FRONTEND_URL ;

- API_PORT ;

- STEAM_API_KEY si nécessaire ;

- ENCRYPTION_KEY si chiffrement.

### 10.4 GitHub

GitHub est utilisé pour :

- héberger le code ;

- suivre les issues ;

- organiser le GitHub Project Kanban ;

- gérer les branches ;

- faire les reviews ;

- documenter l'avancement.

Branches recommandées :

- main ;

- develop ;

- feature/auth ;

- feature/dashboard ;

- feature/teams ;

- feature/chat ;

- fix/nom-du-bug.

## 11 Qualité et tests

### 11.1 ESLint et Prettier

Rôle :

- harmoniser le style de code ;

- détecter certains problèmes ;

- faciliter la collaboration.

### 11.2 Tests back-end

Outil recommandé :

- Jest, intégré avec NestJS.

Tests prioritaires :

- AuthService ;

- ScoreService ;

- StatsService ;

- TeamsService ;

- LeaderboardService ;

- permissions d'équipe ;

- calculs K/D, winrate et score.

### 11.3 Tests API

Objectif :

- vérifier que les endpoints répondent correctement ;

- tester les erreurs ;

- tester les accès non autorisés.

Exemples :

- inscription valide ;

- login invalide ;

- accès dashboard non connecté ;

- création d'équipe ;

- rejoindre équipe avec code invalide ;

- accès chat sans être membre.

### 11.4 Tests front-end

Outils possibles :

- Vitest ;

- React Testing Library.

Tests utiles :

- rendu du dashboard ;

- formulaire de login ;

- état vide de stats ;

- affichage leaderboard ;

- affichage chat.

### 11.5 Tests manuels MVP

À tester avant soutenance :

- inscription ;

- connexion ;

- dashboard ;

- synchronisation mockée ;

- leaderboard solo ;

- création équipe ;

- rejoindre équipe ;

- chat temps réel ;

- déconnexion ;

- PWA installable ;

- responsive mobile.

## 12 Organisation du code

### 12.1 Structure front-end proposée

/src

/assets

/components

/features

/auth

/profile

/dashboard

/games

/stats

/leaderboard

/teams

/chat

/seasons

/settings

/demo

/layouts

/pages

/services

/stores

/types

/utils

/pwa

### 12.2 Structure back-end proposée

/src

/auth

/users

/profiles

/games

/game-accounts

/stats

/score

/leaderboards

/teams

/team-invitations

/seasons

/chat

/messages

/notifications

/achievements

/demo

/security

/common

main.ts

### 12.3 Dossier common back-end

Le dossier common peut contenir :

- guards ;

- decorators ;

- filters ;

- interceptors ;

- pipes ;

- types ;

- utils ;

- constants.

## 13 Intégrations externes

### 13.1 APIs de jeux

APIs envisagées :

- Steam ;

- Epic Games si disponible ;

- APIs spécifiques à certains jeux ;

- API mockée interne.

### 13.2 Stratégie recommandée

Pour sécuriser le MVP :

- commencer avec une API mockée ;

- ajouter une API réelle seulement si elle est stable et simple ;

- ne pas faire dépendre la soutenance d'une API externe ;

- prévoir des données seedées.

### 13.3 Gestion des erreurs externes

En cas d'échec API externe :

- afficher un message clair ;

- conserver les anciennes données ;

- permettre de réessayer ;

- ne pas vider le dashboard.

## 14 Performance

### 14.1 Côté front-end

Bonnes pratiques :

- composants légers ;

- chargement progressif ;

- états de loading ;

- pagination des leaderboards ;

- responsive optimisé ;

- cache limité aux assets non sensibles.

### 14.2 Côté back-end

Bonnes pratiques :

- requêtes optimisées ;

- calculs de score au moment de la synchronisation ;

- cache Redis pour les leaderboards si nécessaire ;

- pagination ;

- rate limiting.

### 14.3 Base de données

Bonnes pratiques :

- index sur userId, gameId, seasonId ;

- index sur teamId ;

- index sur score pour les leaderboards ;

- éviter les recalculs inutiles.

## 15 Choix techniques et justification rapide

React : interface dynamique et composants réutilisables.

TypeScript : robustesse, typage et meilleure collaboration.

Wouter : routing simple et léger.

Valtio : gestion d'état simple adaptée au MVP.

NestJS : back-end structuré, modulaire et TypeScript.

PostgreSQL : adapté aux données relationnelles du projet.

Redis : performant pour cache, sessions, leaderboard rapide et temps réel.

Socket.io : simple pour chat temps réel.

Docker : environnement reproductible.

Swagger : documentation API utile pour front/back.

ESLint / Prettier : qualité et cohérence du code.

PWA : expérience mobile installable.

## 16 Risques techniques liés à la stack

### 16.1 APIs externes instables

Risque : les APIs de jeux peuvent être indisponibles, limitées ou complexes.

Solution : API mockée et données seedées.

### 16.2 Scope trop large

Risque : trop de fonctionnalités peuvent retarder le MVP.

Solution : prioriser auth, stats, score, leaderboards, équipes, saisons, chat et PWA.

### 16.3 Redis-JSON comme base principale

Risque : difficulté à gérer les relations complexes.

Solution : préférer PostgreSQL pour les données principales et Redis pour les usages rapides.

### 16.4 Chat temps réel complexe

Risque : gestion des rooms, permissions et reconnexions plus longue que prévu.

Solution : commencer par un chat d'équipe simple, sans messages privés ni notifications avancées.

### 16.5 Cache PWA sensible

Risque : données privées accessibles après déconnexion.

Solution : stratégie network-first pour données privées et nettoyage au logout.

## 17 Stack MVP vs stack évolutive

### 17.1 Stack MVP

Indispensable :

- React ;

- TypeScript ;

- Wouter ;

- Valtio ;

- NestJS ;

- API REST ;

- PostgreSQL ou Redis-JSON selon choix final ;

- Redis si possible ;

- Socket.io ;

- Docker Compose ;

- PWA ;

- Swagger ;

- ESLint / Prettier.

### 17.2 Stack évolutive

Possible après MVP :

- notifications push ;

- système de queue ;

- monitoring ;

- CI/CD ;

- stockage d'images externe ;

- tests end-to-end ;

- administration avancée ;

- chiffrement plus poussé ;

- intégration API réelle plus complète.

## 18 Conclusion

La stack technique de Track'N Share doit rester cohérente avec les objectifs du projet : construire une plateforme gaming moderne, responsive, sécurisée et démontrable.

La combinaison React + TypeScript + NestJS + PostgreSQL + Redis + Socket.io + Docker répond bien aux besoins du projet :

- React permet une interface moderne ;

- NestJS fournit un back-end structuré ;

- PostgreSQL gère les relations métier ;

- Redis améliore les performances et le temps réel ;

- Socket.io permet le chat ;

- Docker simplifie l'environnement ;

- la PWA assure l'expérience mobile.

Pour réussir le projet, la priorité technique doit rester le MVP : authentification, profil, statistiques, score, leaderboards, équipes, saisons, chat, PWA et mode démo. Les fonctionnalités avancées doivent être ajoutées seulement après stabilisation du socle principal.
