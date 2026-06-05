# SPRINT 0 — PRÉPARATION

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 0 du projet Track'N Share.

Le Sprint 0 correspond à la phase de préparation technique et organisationnelle avant le développement fonctionnel du MVP. Son objectif est de poser un socle propre : repository, architecture de dossiers, Docker, front-end, back-end, base de données, Redis, variables d'environnement, Swagger, conventions et Kanban.

Ce sprint est essentiel, car il conditionne la qualité du développement des sprints suivants.

## 1 Objectif du Sprint 0

### 1.1 Objectif principal

Préparer l'environnement de développement pour permettre à Ioanes et Clément de commencer le développement sur une base claire, stable et cohérente.

### 1.2 Objectifs secondaires

Le Sprint 0 doit permettre de :

- créer le repository ;

- organiser le Kanban GitHub Project ;

- créer la structure front-end/back-end ;

- initialiser React/Vite/TypeScript ;

- initialiser NestJS/TypeScript ;

- configurer Docker Compose ;

- lancer PostgreSQL et Redis ;

- créer les fichiers de configuration ;

- prévoir Swagger ;

- définir les règles de lancement local ;

- éviter les secrets dans Git.

## 2 Périmètre du Sprint 0

### 2.1 Inclus

Le Sprint 0 inclut :

- setup GitHub ;

- setup Kanban ;

- structure repository ;

- setup front-end ;

- setup back-end ;

- setup Docker ;

- setup PostgreSQL ;

- setup Redis ;

- endpoint healthcheck ;

- .env.example ;

- README initial ;

- .gitignore ;

- .dockerignore ;

- Swagger initial ;

- vérification de lancement local.

### 2.2 Non inclus

Le Sprint 0 ne doit pas inclure :

- développement complet de l'authentification ;

- dashboard final ;

- statistiques ;

- leaderboards ;

- équipes ;

- chat ;

- intégration Steam réelle ;

- intégration Epic réelle ;

- déploiement production ;

- tests E2E avancés.

## 3 Durée recommandée

Durée indicative : 2 à 4 jours de travail selon disponibilité.

Le Sprint 0 peut être court, mais il ne doit pas être négligé. Un mauvais setup initial peut faire perdre beaucoup de temps ensuite.

## 4 Livrables attendus

Livrables principaux :

- repository GitHub prêt ;

- GitHub Project prêt ;

- architecture frontend/backend prête ;

- front-end React/Vite lancé ;

- back-end NestJS lancé ;

- docker-compose.yml initial ;

- PostgreSQL lancé ;

- Redis lancé ;

- endpoint GET /api/health ;

- Swagger accessible ou préparé ;

- .env.example complet pour le démarrage ;

- README initial ;

- conventions relues ;

- première milestone M0 validable.

## 5 Tâches du Sprint 0

### 5.1 TNS-001 — Créer le repository GitHub

Priorité : P0

Responsable possible : Ioanes / Clément

Description : créer le repository principal du projet Track'N Share.

À faire :

- créer repository ;

- ajouter README initial ;

- vérifier accès équipe ;

- définir branche main ;

- empêcher les commits directs sur main si possible ;

- préparer une branche dev si retenue.

Critères d'acceptation :

- repository accessible ;

- branche main disponible ;

- README présent ;

- accès Ioanes et Clément validé.

### 5.2 TNS-002 — Créer le GitHub Project / Kanban

Priorité : P0

Responsable possible : Clément

Description : créer un Kanban pour suivre le backlog.

Colonnes recommandées :

- Backlog ;

- À faire ;

- En cours ;

- En review ;

- Test ;

- Terminé.

À faire :

- créer le projet ;

- ajouter les tâches P0 du backlog ;

- ajouter labels ;

- ajouter priorités ;

- assigner les premières tâches.

Critères d'acceptation :

- Kanban créé ;

- tâches Sprint 0 présentes ;

- tâches P0 identifiées ;

- responsables possibles renseignés.

### 5.3 TNS-003 — Initialiser le front-end React/Vite/TypeScript

Priorité : P0

Responsable possible : Clément

Description : créer le dossier frontend et initialiser l'application React.

À faire :

- créer frontend/ ;

- initialiser Vite React TypeScript ;

- créer structure src/ ;

- créer App.tsx ;

- créer main.tsx ;

- créer une page temporaire ;

- vérifier npm run dev ;

- préparer variables VITE_*.

Structure minimale recommandée :

frontend/

public/

src/

assets/

components/

features/

hooks/

layouts/

pages/

router/

services/

stores/

styles/

types/

utils/

App.tsx

main.tsx

Critères d'acceptation :

- l'application front démarre ;

- une page temporaire s'affiche ;

- TypeScript fonctionne ;

- aucune erreur bloquante ;

- structure de dossiers créée.

### 5.4 TNS-004 — Initialiser le back-end NestJS/TypeScript

Priorité : P0

Responsable possible : Ioanes

Description : créer le dossier backend et initialiser NestJS.

À faire :

- créer backend/ ;

- initialiser NestJS ;

- créer structure src/ ;

- configurer préfixe /api ;

- créer HealthModule minimal ;

- vérifier npm run start:dev ;

- préparer configuration env.

Structure minimale recommandée :

backend/

src/

app.module.ts

main.ts

config/

common/

modules/

database/

providers/

health/

Critères d'acceptation :

- back-end démarre ;

- préfixe /api configuré ;

- endpoint GET /api/health répond ;

- structure de dossiers créée.

### 5.5 TNS-005 — Mettre en place Docker Compose

Priorité : P0

Responsable possible : Ioanes

Description : créer la base Docker locale.

Services prévus :

- frontend ;

- backend ;

- postgres ;

- redis.

À faire :

- créer docker-compose.yml ;

- créer Dockerfile front si nécessaire ;

- créer Dockerfile back si nécessaire ;

- configurer réseau interne ;

- configurer volumes PostgreSQL ;

- exposer les ports utiles ;

- vérifier docker compose up.

Ports indicatifs :

- frontend : 5173 ;

- backend : 3000 ;

- postgres : 5432 en local dev ;

- redis : 6379 en local dev.

Critères d'acceptation :

- docker compose up démarre ;

- les services sont visibles avec docker compose ps ;

- backend atteint PostgreSQL ;

- backend atteint Redis si déjà connecté ;

- pas de secret réel dans docker-compose.yml.

### 5.6 TNS-006 — Créer .env.example

Priorité : P0

Responsable possible : Ioanes

Description : créer un fichier d'exemple pour les variables d'environnement.

Variables recommandées :

NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://tracknshare:tracknshare@postgres:5432/tracknshare

REDIS_URL=redis://redis:6379

JWT_SECRET=replace_me

JWT_EXPIRES_IN=1h

CORS_ORIGIN=http://localhost:5173

SWAGGER_ENABLED=true

DEMO_MODE=true

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

Variables front :

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000

VITE_APP_NAME=Track'N Share

Critères d'acceptation :

- .env.example présent ;

- aucune vraie clé ;

- toutes les variables critiques listées ;

- .env ajouté au .gitignore.

### 5.7 TNS-007 — Configurer Swagger initial

Priorité : P0

Responsable possible : Ioanes

Description : préparer la documentation API interactive.

À faire :

- installer/configurer Swagger NestJS ;

- créer page /api/docs ;

- ajouter titre Track'N Share API ;

- préparer Bearer auth ;

- vérifier absence de secrets.

Critères d'acceptation :

- Swagger accessible en développement ;

- l'API est nommée correctement ;

- aucun secret réel dans Swagger ;

- endpoint health visible si documenté.

### 5.8 TNS-008 — Créer README initial

Priorité : P0

Responsable possible : Ioanes / Clément

Description : documenter le lancement initial du projet.

Contenu recommandé :

- présentation courte ;

- prérequis ;

- installation ;

- configuration .env ;

- lancement Docker ;

- lancement front ;

- lancement back ;

- liens utiles ;

- conventions rapides.

Critères d'acceptation :

- README lisible ;

- commandes principales présentes ;

- nouveau développeur peut lancer le projet.

### 5.9 TNS-009 — Créer .gitignore et .dockerignore

Priorité : P0

Responsable possible : Ioanes / Clément

À inclure dans .gitignore :

- node_modules ;

- .env ;

- dist ;

- build ;

- coverage ;

- logs ;

- fichiers système.

À inclure dans .dockerignore :

- node_modules ;

- .git ;

- logs ;

- coverage ;

- fichiers temporaires ;

- .env si nécessaire selon stratégie.

Critères d'acceptation :

- fichiers présents ;

- .env non commitable ;

- builds plus propres.

### 5.10 TNS-010 — Valider le lancement local complet

Priorité : P0

Responsable possible : Ioanes / Clément

Description : vérifier que tout le socle démarre.

Étapes :

1. Copier .env.example en .env.

2. Lancer docker compose up -d --build.

3. Vérifier les conteneurs.

4. Ouvrir le front.

5. Tester GET /api/health.

6. Ouvrir Swagger.

Critères d'acceptation :

- front accessible ;

- back accessible ;

- API health OK ;

- Swagger OK ;

- Docker stable ;

- pas de secret dans logs.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- initialisation backend ;

- Docker Compose ;

- PostgreSQL ;

- Redis ;

- .env.example ;

- Swagger ;

- healthcheck ;

- README partie back/Docker.

### 6.2 Clément

Tâches principales possibles :

- initialisation frontend ;

- structure React ;

- page temporaire ;

- GitHub Project ;

- README partie front ;

- vérification UX de lancement ;

- préparation tickets Kanban.

### 6.3 Tâches communes

À faire ensemble :

- validation du repository ;

- choix des conventions ;

- test Docker complet ;

- vérification du README ;

- organisation des branches ;

- découpage des tâches Sprint 1.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 1 dépend du Sprint 0 pour le back-end, la base et le front.

- Sprint 2 dépend de l'authentification et de la base.

- Sprint 3 dépend des utilisateurs et de la base.

- Sprint 4 dépend de tous les sprints précédents.

### 7.2 Dépendances techniques

- Docker doit être installé ;

- Node.js doit être disponible si lancement hors Docker ;

- PostgreSQL doit être accessible ;

- Redis doit être accessible ;

- le repository GitHub doit être partagé.

## 8 Definition of Done du Sprint 0

Le Sprint 0 est terminé si :

- repository créé ;

- Kanban créé ;

- front-end initialisé ;

- back-end initialisé ;

- Docker Compose démarre ;

- PostgreSQL disponible ;

- Redis disponible ;

- GET /api/health répond ;

- Swagger initial accessible ;

- .env.example complet ;

- README initial rédigé ;

- .gitignore protège les secrets ;

- aucune vraie clé n'est présente dans Git.

## 9 Tests à réaliser pendant le Sprint 0

### 9.1 Tests techniques

- npm run dev front ;

- npm run start:dev back ;

- docker compose up -d --build ;

- docker compose ps ;

- docker compose logs backend ;

- appel GET /api/health ;

- ouverture Swagger ;

- vérification PostgreSQL ;

- vérification Redis.

### 9.2 Tests sécurité minimum

- .env absent de Git ;

- .env.example sans secret réel ;

- logs sans JWT_SECRET ;

- Dockerfile sans secret ;

- docker-compose sans clé réelle ;

- Swagger sans donnée sensible.

## 10 Risques du Sprint 0

### 10.1 Risque : Docker trop complexe

Impact : perte de temps au lancement.

Solution : commencer simple, puis améliorer.

### 10.2 Risque : architecture mal organisée

Impact : confusion dans les sprints suivants.

Solution : suivre Architecture-dossiers.

### 10.3 Risque : secrets committés

Impact : faille sécurité.

Solution : .gitignore, .env.example et revue du diff avant commit.

### 10.4 Risque : README incomplet

Impact : difficulté à relancer le projet.

Solution : documenter dès le début les commandes utiles.

### 10.5 Risque : trop développer au Sprint 0

Impact : retard sur le vrai MVP.

Solution : limiter Sprint 0 au socle technique.

## 11 Checklist de fin Sprint 0

- Repository GitHub prêt.

- GitHub Project prêt.

- Branches définies.

- README initial prêt.

- .gitignore prêt.

- .dockerignore prêt.

- .env.example prêt.

- Front React/Vite lancé.

- Back NestJS lancé.

- Docker Compose lancé.

- PostgreSQL lancé.

- Redis lancé.

- Healthcheck API OK.

- Swagger OK.

- Aucun secret dans Git.

- Tâches Sprint 1 prêtes dans le Kanban.

## 12 Passage au Sprint 1

Le passage au Sprint 1 est possible quand :

- le socle technique démarre ;

- le repository est organisé ;

- la base de données est prête ;

- le back-end peut recevoir des modules ;

- le front-end peut intégrer des pages ;

- les variables d'environnement sont documentées ;

- le Kanban contient les tâches d'authentification.

## 13 Conclusion

Le Sprint 0 est la fondation du développement Track'N Share.

Il ne produit pas encore les fonctionnalités visibles du MVP, mais il garantit que l'équipe peut travailler proprement, lancer le projet, suivre les tâches et éviter les erreurs de configuration.

Un Sprint 0 réussi permettra d'enchaîner plus rapidement sur l'authentification, les statistiques, les leaderboards, les équipes et le chat.
