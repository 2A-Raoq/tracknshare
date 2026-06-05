# RESSOURCES TECHNIQUES

Projet Track'N Share

Version : 1.0

Date de vérification : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document centralise les ressources techniques utiles au développement de Track'N Share.

Il ne remplace pas les documentations techniques détaillées déjà rédigées dans le Drive, mais sert de bibliothèque pratique pour retrouver rapidement les technologies, les usages prévus, les points d'attention, les commandes utiles et les priorités MVP.

Il est destiné à accompagner le développement du projet après la phase de documentation.

## 1 Vue d'ensemble technique

### 1.1 Stack cible du projet

Track'N Share repose sur une architecture web moderne composée de :

- front-end React avec TypeScript ;

- Vite comme outil de build front-end ;

- PWA pour une expérience installable et responsive ;

- back-end NestJS avec TypeScript ;

- API REST documentée avec Swagger / OpenAPI ;

- Socket.io pour le chat temps réel ;

- PostgreSQL pour la base de données principale ;

- Redis pour cache, rate limiting, locks ou présence ;

- Docker Compose pour l'environnement local ;

- GitHub pour versioning, Kanban et CI/CD future ;

- MockProvider pour simuler les données de jeu pendant le MVP.

### 1.2 Objectif technique du MVP

Le MVP doit permettre de :

- lancer facilement l'application en local ;

- se connecter avec un compte utilisateur ;

- afficher un dashboard joueur ;

- afficher des statistiques mockées ;

- calculer un score côté back-end ;

- afficher un leaderboard ;

- gérer une équipe ;

- utiliser un chat d'équipe ;

- protéger les accès privés ;

- présenter le projet en mode démo sans dépendre de Steam/Epic.

### 1.3 Principe de simplicité

Le projet n'ayant pas encore commencé son développement, les choix techniques doivent rester adaptés à une équipe de deux personnes.

Il faut privilégier :

- une structure claire ;

- des outils connus ;

- une architecture simple ;

- un mode démo fiable ;

- une sécurité minimum solide ;

- une documentation maintenue.

## 2 Ressources front-end

### 2.1 React

Documentation officielle : https://react.dev/

Usage dans Track'N Share :

- composants UI ;

- pages ;

- hooks ;

- gestion des états locaux ;

- rendu conditionnel ;

- interactions utilisateur.

À maîtriser pour le projet :

- components ;

- props ;

- state ;

- useEffect ;

- custom hooks ;

- composition de composants ;

- formulaires ;

- gestion des erreurs UI ;

- affichage loading / empty / error.

Points d'attention :

- éviter les composants trop gros ;

- séparer UI et logique métier ;

- typer les props ;

- éviter les appels API dispersés ;

- ne pas stocker inutilement de données sensibles.

### 2.2 TypeScript côté front

Documentation officielle : https://www.typescriptlang.org/docs/

Usage dans Track'N Share :

- typage des composants ;

- typage des réponses API ;

- typage des stores ;

- typage des hooks ;

- typage des modèles métier.

Types importants à prévoir :

- User ;

- PublicProfile ;

- Game ;

- PlayerStats ;

- LeaderboardEntry ;

- Team ;

- TeamMember ;

- ChatMessage ;

- ApiResponse ;

- ApiError.

Points d'attention :

- éviter any ;

- garder les types synchronisés avec l'API ;

- ne pas dupliquer inutilement des structures incohérentes ;

- documenter les types critiques.

### 2.3 Vite

Documentation officielle : https://vite.dev/guide/

Usage dans Track'N Share :

- serveur de développement front ;

- build de production ;

- variables d'environnement VITE_* ;

- intégration PWA éventuelle.

Commandes typiques :

npm run dev

npm run build

npm run preview

Points d'attention :

- les variables VITE_* sont exposées au navigateur ;

- ne jamais mettre de secret dans VITE_* ;

- VITE_API_BASE_URL doit pointer vers le back-end ;

- VITE_SOCKET_URL doit pointer vers Socket.io.

### 2.4 PWA

Ressources :

- MDN PWA : https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps

- web.dev PWA : https://web.dev/progressive-web-apps/

Usage dans Track'N Share :

- application installable ;

- icônes ;

- manifest ;

- cache des assets statiques ;

- page offline simple.

Points d'attention :

- ne pas cacher dangereusement les données privées ;

- nettoyer les données visibles après logout ;

- utiliser une stratégie prudente pour les données utilisateur ;

- privilégier Cache First pour les assets et Network First pour les données privées.

### 2.5 UI et responsive

Ressources :

- MDN CSS : https://developer.mozilla.org/en-US/docs/Web/CSS

- Tailwind si retenu : https://tailwindcss.com/docs

Objectif :

- interface claire ;

- responsive desktop/mobile ;

- parcours simple ;

- dashboard lisible ;

- chat utilisable ;

- leaderboard compréhensible.

Points d'attention :

- prévoir les états vides ;

- afficher les erreurs proprement ;

- garder les boutons accessibles ;

- ne pas surcharger l'interface ;

- suivre la maquette Figma quand elle sera disponible.

## 3 Ressources back-end

### 3.1 Node.js

Documentation officielle : https://nodejs.org/docs/latest/api/

Usage dans Track'N Share :

- runtime serveur ;

- scripts ;

- environnement NestJS ;

- gestion des dépendances.

Points d'attention :

- utiliser une version stable ;

- documenter la version recommandée ;

- éviter les versions trop anciennes ;

- aligner la version Node local/Docker/CI.

### 3.2 NestJS

Documentation officielle : https://docs.nestjs.com/

Usage dans Track'N Share :

- architecture back-end ;

- modules ;

- controllers ;

- services ;

- providers ;

- guards ;

- pipes ;

- interceptors ;

- WebSockets ;

- Swagger.

Modules principaux à prévoir :

- AuthModule ;

- UsersModule ;

- ProfilesModule ;

- GamesModule ;

- GameAccountsModule ;

- StatsModule ;

- LeaderboardsModule ;

- TeamsModule ;

- ChatModule ;

- SeasonsModule ;

- NotificationsModule ;

- HealthModule.

Points d'attention :

- les controllers doivent rester simples ;

- la logique métier doit être dans les services ;

- les DTO doivent valider les entrées ;

- les guards doivent protéger les routes privées ;

- les réponses API doivent rester cohérentes.

### 3.3 Configuration NestJS

Documentation : https://docs.nestjs.com/techniques/configuration

Usage :

- variables d'environnement ;

- validation de configuration ;

- séparation dev/test/demo/prod ;

- configuration providers externes.

Variables importantes :

- NODE_ENV ;

- PORT ;

- DATABASE_URL ;

- REDIS_URL ;

- JWT_SECRET ;

- JWT_EXPIRES_IN ;

- CORS_ORIGIN ;

- SWAGGER_ENABLED ;

- DEMO_MODE ;

- MOCK_PROVIDER_ENABLED ;

- STEAM_PROVIDER_ENABLED ;

- EPIC_PROVIDER_ENABLED.

Points d'attention :

- l'application doit refuser de démarrer si une variable critique manque ;

- les secrets ne doivent jamais être loggés ;

- .env.example doit rester à jour.

### 3.4 Validation NestJS

Documentation : https://docs.nestjs.com/techniques/validation

Usage :

- DTO ;

- ValidationPipe ;

- validation des body, query et params ;

- sécurité API.

Options recommandées :

- whitelist: true ;

- transform: true ;

- forbidNonWhitelisted selon le niveau de strictness voulu.

DTO prioritaires :

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendTeamMessageDto ;

- SyncStatsDto ;

- PaginationQueryDto.

## 4 Ressources API REST

### 4.1 OpenAPI et Swagger

Ressources :

- OpenAPI Specification : https://swagger.io/specification/

- Swagger docs : https://swagger.io/docs/specification/v3_0/about/

- NestJS OpenAPI : https://docs.nestjs.com/openapi/introduction

Usage dans Track'N Share :

- documentation interactive de l'API ;

- tests manuels ;

- clarification des endpoints ;

- support pendant la soutenance.

À documenter dans Swagger :

- routes Auth ;

- routes Users ;

- routes Stats ;

- routes Leaderboards ;

- routes Teams ;

- routes Chat ;

- routes Health.

Points d'attention :

- ne jamais mettre de vrai token dans Swagger ;

- ne jamais mettre de vraie clé API ;

- documenter les erreurs principales ;

- garder Swagger activé en dev/demo, protégé ou désactivé en production future.

### 4.2 Conventions API internes

Réponse succès :

{

"success": true,

"data": {},

"message": "Action effectuée avec succès."

}

Réponse erreur :

{

"success": false,

"error": {

"code": "ERROR_CODE",

"message": "Message lisible.",

"requestId": "req_abc123"

}

}

Points d'attention :

- statuts HTTP cohérents ;

- pagination sur les listes ;

- camelCase côté JSON ;

- validation DTO ;

- permissions côté back-end ;

- pas de stack trace côté client.

## 5 Ressources authentification et sécurité applicative

### 5.1 JWT

Ressources :

- RFC 7519 : https://datatracker.ietf.org/doc/html/rfc7519

- RFC 8725 : https://datatracker.ietf.org/doc/html/rfc8725

Usage dans Track'N Share :

- authentification des routes privées ;

- identification utilisateur ;

- protection dashboard, stats, équipes, chat.

Payload recommandé :

{

"sub": "user_123",

"role": "PLAYER"

}

Points d'attention :

- payload minimal ;

- durée limitée ;

- JWT_SECRET fort ;

- token jamais loggé ;

- passwordHash jamais retourné ;

- routes privées protégées par JwtAuthGuard.

### 5.2 Guards et permissions

Ressource : https://docs.nestjs.com/guards

Guards recommandés :

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard.

Règles importantes :

- un utilisateur modifie uniquement son profil ;

- un membre lit uniquement le chat de son équipe ;

- un capitaine gère les invitations ;

- un joueur ne peut pas accéder aux routes admin ;

- les permissions se vérifient toujours côté back-end.

### 5.3 OWASP

Ressources :

- OWASP Top 10 : https://owasp.org/Top10/

- OWASP Cheat Sheet Series : https://cheatsheetseries.owasp.org/

Usage dans Track'N Share :

- contrôle d'accès ;

- injections ;

- XSS ;

- gestion des erreurs ;

- logs ;

- secrets ;

- sécurité API.

Priorité MVP :

- accès privé protégé ;

- validation des entrées ;

- pas de secrets exposés ;

- logs propres ;

- erreurs non verbeuses ;

- chat protégé.

## 6 Ressources temps réel

### 6.1 Socket.io

Documentation : https://socket.io/docs/v4/

Usage dans Track'N Share :

- chat d'équipe ;

- messages temps réel ;

- rooms par équipe ;

- notifications futures ;

- présence future.

Concepts à maîtriser :

- server ;

- client ;

- events ;

- rooms ;

- middleware d'authentification ;

- reconnexion ;

- broadcast.

Nommage d'événements recommandé :

- team:join ;

- team:leave ;

- team:message:send ;

- team:message:new ;

- team:typing:start ;

- team:typing:stop.

Points d'attention :

- socket authentifié ;

- userId issu du token ;

- non-membre refusé ;

- rate limiting chat ;

- pas de token dans les logs ;

- contenu des messages non loggé en entier.

## 7 Ressources base de données

### 7.1 PostgreSQL

Documentation officielle : https://www.postgresql.org/docs/

Usage dans Track'N Share :

- source de vérité principale ;

- utilisateurs ;

- profils ;

- jeux ;

- comptes externes ;

- statistiques ;

- équipes ;

- membres ;

- messages ;

- saisons ;

- archives.

Points à maîtriser :

- tables ;

- relations ;

- contraintes ;

- index ;

- transactions ;

- migrations ;

- sauvegardes.

Points d'attention :

- email unique ;

- relations propres ;

- migrations versionnées ;

- pas de données réelles dans les seeds ;

- indexer les requêtes fréquentes ;

- éviter les suppressions destructives.

### 7.2 ORM possible : Prisma

Documentation : https://www.prisma.io/docs

Usage possible :

- schema.prisma ;

- migrations ;

- client typé ;

- seeders ;

- requêtes TypeScript.

Avantages :

- typage fort ;

- expérience développeur claire ;

- migrations simples ;

- bon support TypeScript.

Points d'attention :

- comprendre les migrations ;

- éviter les modifications destructives ;

- garder le schema synchronisé avec la documentation.

### 7.3 ORM possible : TypeORM

Documentation : https://typeorm.io/

Usage possible :

- entities ;

- repositories ;

- migrations ;

- intégration NestJS.

Avantages :

- intégré historiquement avec NestJS ;

- approche orientée entités ;

- flexible.

Points d'attention :

- migrations à gérer proprement ;

- éviter la logique SQL dispersée ;

- bien structurer repositories/services.

## 8 Ressources cache et Redis

### 8.1 Redis

Documentation officielle : https://redis.io/docs/latest/

Usage dans Track'N Share :

- cache de données externes ;

- rate limiting ;

- locks de synchronisation ;

- leaderboards rapides ;

- présence en ligne future ;

- adapter Socket.io futur si scaling.

Exemples de clés :

- cache:user:{userId} ;

- rate:auth:login:{ip} ;

- lock:stats:sync:{userId}:{gameId} ;

- leaderboard:{gameId}:{seasonId} ;

- socket:presence:{userId}.

Points d'attention :

- TTL sur données temporaires ;

- Redis non exposé publiquement ;

- PostgreSQL reste source de vérité ;

- pas de secrets en clair ;

- fallback si Redis indisponible.

## 9 Ressources DevOps et lancement local

### 9.1 Docker

Documentation : https://docs.docker.com/

Usage dans Track'N Share :

- environnement reproductible ;

- front-end ;

- back-end ;

- PostgreSQL ;

- Redis ;

- soutenance.

Concepts à maîtriser :

- Dockerfile ;

- images ;

- containers ;

- volumes ;

- networks ;

- environment variables ;

- logs.

Commandes utiles :

docker compose up -d --build

docker compose ps

docker compose logs -f backend

docker compose down

Points d'attention :

- pas de secret dans Dockerfile ;

- .env non commité ;

- ports documentés ;

- volumes PostgreSQL ;

- Docker testé avant soutenance.

### 9.2 Docker Compose

Documentation : https://docs.docker.com/compose/

Usage :

- lancer tous les services ensemble ;

- gérer les dépendances ;

- configurer les réseaux ;

- simplifier le setup local.

Services prévus :

- frontend ;

- backend ;

- postgres ;

- redis.

Points d'attention :

- healthchecks utiles ;

- variables par service ;

- ports cohérents ;

- volumes persistants ;

- pas de secret réel en dur.

## 10 Ressources Git, GitHub et organisation

### 10.1 Git

Documentation : https://git-scm.com/docs

Usage dans Track'N Share :

- versioning ;

- branches ;

- commits ;

- tags ;

- rollback.

Commandes utiles :

git checkout main

git pull origin main

git checkout -b feature/nom-feature

git add .

git commit -m "feat(scope): message"

git push origin feature/nom-feature

Points d'attention :

- pas de commit direct sur main ;

- une branche par tâche ;

- commits clairs ;

- aucun secret ;

- PR relues.

### 10.2 GitHub Projects

Documentation : https://docs.github.com/en/issues/planning-and-tracking-with-projects

Usage :

- Kanban ;

- suivi des tâches ;

- répartition Ioanes / Clément ;

- backlog ;

- sprints ;

- milestones.

Colonnes recommandées :

- Backlog ;

- À faire ;

- En cours ;

- En review ;

- Test ;

- Terminé.

### 10.3 GitHub Actions

Documentation : https://docs.github.com/en/actions

Usage futur :

- lint ;

- tests ;

- build front ;

- build back ;

- build Docker ;

- audit dépendances.

Priorité :

- P1 après MVP initial ;

- utile pour montrer une démarche professionnelle.

## 11 Ressources tests

### 11.1 Jest

Documentation : https://jestjs.io/docs/getting-started

Usage :

- tests unitaires back-end ;

- AuthService ;

- StatsService ;

- calcul du score ;

- guards ;

- MockProvider.

Tests prioritaires :

- calcul K/D ;

- winrate ;

- score ;

- éligibilité leaderboard ;

- TeamMemberGuard ;

- TeamRoleGuard.

### 11.2 Supertest

Documentation : https://github.com/ladjs/supertest

Usage :

- tests API NestJS ;

- endpoints REST ;

- auth ;

- permissions ;

- validation.

Priorité : P1.

### 11.3 React Testing Library

Documentation : https://testing-library.com/docs/react-testing-library/intro/

Usage :

- tests composants React ;

- formulaires login/register ;

- dashboard ;

- états loading/error/empty.

Priorité : P1.

### 11.4 Playwright ou Cypress

Ressources :

- Playwright : https://playwright.dev/docs/intro

- Cypress : https://docs.cypress.io/

Usage futur :

- tests end-to-end ;

- parcours login ;

- dashboard ;

- leaderboard ;

- équipe ;

- chat.

Priorité : P2.

## 12 Ressources monitoring et logs

### 12.1 Logs NestJS et Docker

Usage MVP :

- diagnostiquer le démarrage ;

- vérifier PostgreSQL ;

- vérifier Redis ;

- vérifier providers ;

- suivre erreurs API ;

- préparer la soutenance.

Commandes utiles :

docker compose logs -f backend

docker compose logs -f frontend

docker compose logs -f postgres

docker compose logs -f redis

Points d'attention :

- pas de JWT dans les logs ;

- pas de mot de passe ;

- pas de clé API ;

- logs clairs mais pas trop verbeux.

### 12.2 Sentry en évolution

Documentation : https://docs.sentry.io/

Usage futur :

- erreurs front ;

- erreurs back ;

- stack traces contrôlées ;

- suivi production.

Priorité : P2.

### 12.3 Prometheus et Grafana en évolution

Ressources :

- Prometheus : https://prometheus.io/docs/introduction/overview/

- Grafana : https://grafana.com/docs/

Usage futur :

- métriques ;

- dashboards ;

- alertes ;

- monitoring production.

Priorité : P2.

## 13 Ressources APIs externes

### 13.1 Steam

Ressources :

- Steam Web API Overview : https://partner.steamgames.com/doc/webapi_overview

- Steam Web API Reference : https://partner.steamgames.com/doc/webapi

- ISteamUserStats : https://partner.steamgames.com/doc/api/isteamuserstats

- ISteamLeaderboards : https://partner.steamgames.com/doc/webapi/isteamleaderboards

Usage dans Track'N Share :

- intégration future ;

- étude des stats ;

- mapping données externes ;

- documentation du provider.

Point important :

Steam ne garantit pas une récupération universelle de toutes les statistiques de tous les jeux.

### 13.2 Epic / EOS

Ressources :

- Epic Online Services SDK : https://onlineservices.epicgames.com/en-US/sdk

- Epic Developer Documentation : https://dev.epicgames.com/docs/

- Epic Developer Portal : https://dev.epicgames.com/portal

Usage dans Track'N Share :

- intégration future ;

- étude EOS ;

- stats/leaderboards selon configuration ;

- documentation du provider.

Point important :

Epic/EOS dépend fortement de la configuration produit et ne doit pas être obligatoire pour le MVP.

### 13.3 MockProvider

Usage MVP :

- données fictives ;

- tests ;

- soutenance ;

- fallback.

Données simulées :

- kills ;

- deaths ;

- wins ;

- losses ;

- matchesPlayed ;

- playtimeMinutes ;

- achievements ;

- score calculé côté back.

## 14 Ressources RGPD et conformité

### 14.1 CNIL

Ressource : https://www.cnil.fr/fr/guide-rgpd-du-developpeur

Usage :

- minimisation ;

- sécurité des données ;

- droits utilisateurs ;

- protection dès la conception.

Priorité : P0 pour documentation.

### 14.2 RGPD officiel

Ressource : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679

Usage :

- référence réglementaire ;

- droits utilisateurs ;

- base juridique ;

- suppression/anonymisation.

Priorité : P0 pour documentation.

## 15 Commandes techniques utiles

### 15.1 Front-end

Commandes possibles :

cd frontend

npm install

npm run dev

npm run build

npm run preview

npm run lint

npm run test

### 15.2 Back-end

Commandes possibles :

cd backend

npm install

npm run start:dev

npm run build

npm run lint

npm run test

npm run migration:run

npm run seed:demo

### 15.3 Docker

Commandes possibles :

docker compose up -d --build

docker compose ps

docker compose logs -f backend

docker compose logs -f frontend

docker compose down

docker compose down -v

### 15.4 Git

Commandes possibles :

git checkout main

git pull origin main

git checkout -b feature/auth-jwt

git status

git diff

git add .

git commit -m "feat(auth): add JWT login"

git push origin feature/auth-jwt

## 16 Priorités techniques MVP

### 16.1 P0 — Indispensable

- structure repository frontend/backend ;

- Docker Compose ;

- PostgreSQL ;

- Redis ;

- Auth JWT ;

- API REST ;

- Swagger ;

- MockProvider ;

- Dashboard ;

- Stats ;

- Leaderboard ;

- Teams ;

- Chat Socket.io ;

- Guards permissions ;

- Seed démo ;

- Documentation cohérente.

### 16.2 P1 — Important

- tests unitaires critiques ;

- rate limiting ;

- requestId ;

- PWA installable ;

- refresh token ;

- CI GitHub Actions ;

- cache Redis ;

- archivage saisons ;

- notifications.

### 16.3 P2 — Évolution future

- SteamProvider réel ;

- EpicProvider réel ;

- monitoring avancé ;

- E2E automatisés ;

- production réelle ;

- Grafana/Prometheus ;

- Sentry ;

- 2FA ;

- multi-jeux avancé.

## 17 Ressources internes Drive à consulter

Documents internes importants :

- Cahier-des-charges ;

- Specifications-fonctionnelles ;

- Regles-metier ;

- Glossaire ;

- Stack-technique-detaillee ;

- Choix-technologiques ;

- Strategies-indexation ;

- Systeme-archivage-trimestriel ;

- Endpoints-REST-API ;

- Documentation-Socket-io ;

- Authentification-JWT ;

- Roles-permissions ;

- Configuration-Docker ;

- Variables-environnement ;

- Procedure-deploiement ;

- Monitoring-logs ;

- CI-CD-pipeline ;

- Conventions-code ;

- Conventions-Git ;

- Architecture-dossiers ;

- Conventions-API ;

- Definition-of-Done ;

- Standards-securite-dev ;

- Strategie-tests ;

- Plan-tests-MVP ;

- Tests-API ;

- Tests-securite ;

- Recette-soutenance.

## 18 Checklist de démarrage développement

Avant de commencer le code :

- repository GitHub prêt ;

- branches et Kanban prêts ;

- structure frontend/backend créée ;

- Docker Compose initial prévu ;

- .env.example créé ;

- README initial créé ;

- choix ORM validé ;

- conventions Git relues ;

- conventions code relues ;

- conventions API relues ;

- Definition of Done relue ;

- backlog priorisé ;

- maquette Figma récupérée si disponible.

## 19 Checklist technique avant soutenance

Avant la soutenance :

- Docker démarre ;

- PostgreSQL ok ;

- Redis ok ;

- migrations ok ;

- seed démo ok ;

- compte démo ok ;

- dashboard ok ;

- stats ok ;

- leaderboard ok ;

- équipe ok ;

- chat ok ;

- Swagger ok ;

- aucun secret visible ;

- mode mock activé ;

- captures de secours prêtes.

## 20 Conclusion

Ce document regroupe les ressources techniques clés de Track'N Share.

Il doit servir de guide rapide pendant le développement pour savoir quelle documentation consulter, quelles technologies utiliser, quelles commandes lancer et quels points de vigilance respecter.

La priorité du MVP est de rester simple et fiable : React, NestJS, PostgreSQL, Redis, Docker, JWT, Socket.io et MockProvider suffisent à produire une démonstration solide.

Les intégrations externes réelles, les tests avancés, le monitoring et la production pourront être ajoutés progressivement après stabilisation du MVP.
