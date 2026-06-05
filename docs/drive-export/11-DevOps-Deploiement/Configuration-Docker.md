# CONFIGURATION DOCKER

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la configuration Docker prévue pour Track'N Share.

Il explique comment conteneuriser les différents services du projet, comment lancer l'environnement de développement, comment préparer une démonstration fiable pour la soutenance et quelles règles de sécurité respecter pour éviter d'exposer des données sensibles.

Docker doit permettre à une personne qui récupère le projet de lancer rapidement l'application avec tous ses services nécessaires : front-end, back-end, PostgreSQL, Redis, données seedées et mode démo.

## 1 Rôle de Docker dans Track'N Share

### 1.1 Objectifs

Docker est utilisé pour :

- simplifier l'installation du projet ;

- éviter les différences de configuration entre machines ;

- lancer facilement PostgreSQL et Redis ;

- préparer une démonstration stable ;

- isoler les services ;

- faciliter le déploiement futur ;

- documenter clairement l'environnement technique.

### 1.2 Avantages pour le projet

Pour Track'N Share, Docker permet de :

- lancer le projet sans installer manuellement PostgreSQL ;

- lancer Redis localement ;

- exécuter le back-end NestJS dans un environnement reproductible ;

- exécuter le front-end React/PWA ;

- seed la base avec des données de démonstration ;

- vérifier plus facilement le comportement complet de l'application ;

- préparer un environnement soutenance indépendant des APIs externes Steam/Epic.

### 1.3 Principe général

L'environnement Docker repose sur plusieurs services :

- frontend : application React / PWA ;

- backend : API NestJS ;

- postgres : base de données principale ;

- redis : cache, rate limiting, sessions et leaderboards rapides ;

- éventuellement adminer ou pgadmin en développement ;

- éventuellement nginx en production.

## 2 Architecture Docker cible

### 2.1 Services principaux

Service frontend

Rôle : servir l'application React/PWA.

Responsabilités :

- interface utilisateur ;

- appel de l'API REST ;

- connexion Socket.io ;

- mode PWA ;

- affichage dashboard, stats, leaderboards, équipes et chat.

Service backend

Rôle : exposer l'API NestJS.

Responsabilités :

- authentification JWT ;

- routes REST ;

- Socket.io ;

- logique métier ;

- accès PostgreSQL ;

- accès Redis ;

- providers Steam/Epic/Mock ;

- Swagger ;

- migrations et seeders selon stratégie.

Service postgres

Rôle : stocker les données principales.

Données stockées :

- utilisateurs ;

- profils ;

- jeux ;

- comptes de jeu liés ;

- statistiques ;

- saisons ;

- leaderboards archivés ;

- équipes ;

- messages ;

- notifications.

Service redis

Rôle : stocker les données temporaires et rapides.

Usages :

- cache ;

- rate limiting ;

- locks ;

- sessions en évolution ;

- leaderboards rapides ;

- présence en ligne ;

- Socket.io adapter en évolution.

### 2.2 Architecture logique

Flux simplifié :

Navigateur utilisateur

→ Frontend React/PWA

→ Backend NestJS

→ PostgreSQL

→ Redis

→ APIs externes si activées

En mode MVP / soutenance :

Navigateur utilisateur

→ Frontend React/PWA

→ Backend NestJS

→ PostgreSQL + Redis

→ MockProvider

Dans ce mode, Steam et Epic ne sont pas indispensables.

## 3 Structure recommandée du projet

Structure possible :

track-n-share/

frontend/

Dockerfile

package.json

src/

vite.config.ts

backend/

Dockerfile

package.json

src/

prisma/ ou migrations/

docker-compose.yml

docker-compose.override.yml

docker-compose.prod.yml

.env.example

.dockerignore

README.md

### 3.1 Frontend

Le dossier frontend contient :

- code React ;

- configuration Vite ;

- configuration PWA ;

- Dockerfile front ;

- variables publiques VITE_*.

### 3.2 Backend

Le dossier backend contient :

- API NestJS ;

- controllers ;

- services ;

- modules ;

- gateways Socket.io ;

- providers externes ;

- migrations ;

- seeders ;

- Dockerfile back.

### 3.3 Racine

La racine contient :

- docker-compose.yml ;

- fichiers de configuration ;

- documentation ;

- .env.example ;

- scripts de lancement.

## 4 Dockerfile back-end NestJS

### 4.1 Objectif

Le Dockerfile back-end doit permettre de construire et lancer l'API NestJS dans un conteneur.

### 4.2 Exemple de Dockerfile développement

Exemple conceptuel :

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

### 4.3 Exemple de Dockerfile production

Exemple conceptuel :

FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]

### 4.4 Règles importantes

- ne jamais copier .env dans l'image ;

- utiliser .dockerignore ;

- installer uniquement les dépendances nécessaires en production ;

- exposer uniquement le port API ;

- valider les variables d'environnement au démarrage ;

- ne pas lancer l'application en mode debug en production.

## 5 Dockerfile front-end React/PWA

### 5.1 Objectif

Le Dockerfile front-end doit permettre de lancer le front en développement ou de servir un build statique en production.

### 5.2 Exemple développement

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

### 5.3 Exemple production avec Nginx

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

### 5.4 Règles importantes

- seules les variables VITE_* doivent être exposées au front ;

- ne jamais injecter de secrets dans le build front ;

- vérifier que VITE_API_BASE_URL pointe vers l'API correcte ;

- prévoir une configuration différente entre dev et production ;

- tester le comportement PWA après build.

6. docker-compose.yml recommandé

### 6.1 Objectif

Le fichier docker-compose.yml orchestre tous les services nécessaires au projet.

### 6.2 Exemple conceptuel

version: "3.9"

services:

postgres:

image: postgres:16-alpine

container_name: tracknshare-postgres

restart: unless-stopped

environment:

POSTGRES_USER: ${POSTGRES_USER}

POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

POSTGRES_DB: ${POSTGRES_DB}

ports:

- "5432:5432"

volumes:

- postgres_data:/var/lib/postgresql/data

healthcheck:

test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]

interval: 10s

timeout: 5s

retries: 5

redis:

image: redis:7-alpine

container_name: tracknshare-redis

restart: unless-stopped

ports:

- "6379:6379"

volumes:

- redis_data:/data

backend:

build:

context: ./backend

dockerfile: Dockerfile

container_name: tracknshare-backend

restart: unless-stopped

env_file:

- .env

ports:

- "3000:3000"

depends_on:

postgres:

condition: service_healthy

redis:

condition: service_started

volumes:

- ./backend:/app

- /app/node_modules

frontend:

build:

context: ./frontend

dockerfile: Dockerfile

container_name: tracknshare-frontend

restart: unless-stopped

env_file:

- .env

ports:

- "5173:5173"

depends_on:

- backend

volumes:

- ./frontend:/app

- /app/node_modules

volumes:

postgres_data:

redis_data:

### 6.3 Remarques

Ce fichier est un modèle. Il devra être ajusté selon :

- gestionnaire de paquets choisi : npm, pnpm ou yarn ;

- ORM utilisé : Prisma, TypeORM ou autre ;

- stratégie de build front ;

- besoins réels de volumes ;

- environnement dev ou production.

## 7 Ports recommandés

| Service | Port interne | Port local recommandé | Description |

|---|---:|---:|---|

| Frontend React | 5173 | 5173 | Interface utilisateur en développement |

| Backend NestJS | 3000 | 3000 | API REST + Socket.io + Swagger |

| PostgreSQL | 5432 | 5432 | Base de données locale |

| Redis | 6379 | 6379 | Cache, rate limiting, locks |

| Nginx production | 80 | 80 | Serveur front statique |

| HTTPS production | 443 | 443 | Accès sécurisé production |

En production, PostgreSQL et Redis ne doivent généralement pas être exposés publiquement.

## 8 Volumes Docker

### 8.1 Volume PostgreSQL

Le volume postgres_data conserve les données de la base entre deux redémarrages.

Usage :

- éviter de perdre les données à chaque docker compose down ;

- conserver les données seedées ;

- tester l'archivage et les saisons.

### 8.2 Volume Redis

Le volume redis_data peut conserver certaines données Redis si nécessaire.

Pour le MVP, Redis peut aussi être considéré comme temporaire.

### 8.3 Volumes de développement

Les volumes de code permettent le hot reload :

- ./backend:/app ;

- ./frontend:/app.

Attention :

Il faut éviter d'écraser node_modules du conteneur avec ceux de l'hôte. La ligne /app/node_modules permet de garder les dépendances dans le conteneur.

## 9 Variables d'environnement Docker

### 9.1 Fichier .env

Le docker-compose.yml peut lire les variables depuis un fichier .env.

Ce fichier ne doit jamais être commité.

### 9.2 Fichier .env.example

Le fichier .env.example doit être commité et contenir des valeurs fictives.

Exemple :

NODE_ENV=development

APP_PORT=3000

FRONTEND_URL=http://localhost:5173

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000/chat

POSTGRES_USER=tracknshare

POSTGRES_PASSWORD=replace_me

POSTGRES_DB=tracknshare

DATABASE_URL=postgresql://tracknshare:replace_me@postgres:5432/tracknshare

REDIS_URL=redis://redis:6379

JWT_SECRET=replace_me_with_long_random_secret

JWT_EXPIRES_IN=1h

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

DEMO_MODE=true

DEMO_SEED_ENABLED=true

### 9.3 Variables front-end

Les variables VITE_* sont publiques.

Elles peuvent être exposées au navigateur.

Règle :

Ne jamais mettre de secret dans une variable VITE_*.

## 10 Réseau Docker

### 10.1 Communication entre services

Dans Docker Compose, les services communiquent entre eux avec leur nom de service.

Exemples :

- le back-end se connecte à PostgreSQL via host postgres ;

- le back-end se connecte à Redis via host redis ;

- le front appelle l'API via l'URL configurée.

### 10.2 DATABASE_URL dans Docker

En local hors Docker :

DATABASE_URL=postgresql://tracknshare:password@localhost:5432/tracknshare

Dans Docker :

DATABASE_URL=postgresql://tracknshare:password@postgres:5432/tracknshare

### 10.3 REDIS_URL dans Docker

En local hors Docker :

REDIS_URL=redis://localhost:6379

Dans Docker :

REDIS_URL=redis://redis:6379

## 11 Commandes Docker utiles

### 11.1 Lancer le projet

docker compose up

Lancer en arrière-plan :

docker compose up -d

### 11.2 Rebuilder les images

docker compose build

ou :

docker compose up --build

### 11.3 Arrêter le projet

docker compose down

Arrêter et supprimer les volumes :

docker compose down -v

Attention :

Cette commande supprime les données PostgreSQL et Redis stockées dans les volumes.

### 11.4 Voir les logs

Tous les services :

docker compose logs -f

Back-end uniquement :

docker compose logs -f backend

Front-end uniquement :

docker compose logs -f frontend

PostgreSQL :

docker compose logs -f postgres

Redis :

docker compose logs -f redis

### 11.5 Entrer dans un conteneur

Back-end :

docker compose exec backend sh

PostgreSQL :

docker compose exec postgres sh

Redis :

docker compose exec redis sh

### 11.6 Exécuter une commande back-end

docker compose exec backend npm run migration:run

docker compose exec backend npm run seed

docker compose exec backend npm run test

Les noms exacts des scripts dépendront du package.json final.

## 12 Migrations et seeders

### 12.1 Objectif

Les migrations créent ou mettent à jour la structure de la base de données.

Les seeders insèrent des données de test ou de démonstration.

### 12.2 Migrations

Les migrations doivent être lancées :

- au premier démarrage ;

- après une modification du modèle de données ;

- avant un déploiement ;

- avant la soutenance si la base a été réinitialisée.

Commande indicative :

docker compose exec backend npm run migration:run

ou, si Prisma est utilisé :

docker compose exec backend npx prisma migrate deploy

### 12.3 Seeders

Les seeders doivent permettre de créer :

- utilisateurs démo ;

- profils ;

- jeux ;

- comptes mockés ;

- statistiques ;

- saisons ;

- leaderboards ;

- équipes ;

- messages.

Commande indicative :

docker compose exec backend npm run seed

ou :

docker compose exec backend npm run seed:demo

### 12.4 Mode soutenance

Pour la soutenance :

- DEMO_MODE=true ;

- DEMO_SEED_ENABLED=true ;

- EXTERNAL_API_MODE=mock ;

- MOCK_PROVIDER_ENABLED=true ;

- Steam/Epic désactivés si non nécessaires.

## 13 Healthchecks

### 13.1 Objectif

Les healthchecks permettent de vérifier que les services répondent correctement.

### 13.2 PostgreSQL

Healthcheck recommandé :

pg_isready

Objectif :

S'assurer que la base est prête avant de lancer l'API.

### 13.3 Backend

Endpoint recommandé :

GET /health

Réponse attendue :

{

"success": true,

"data": {

"status": "ok"

}

}

Endpoints bonus :

- GET /health/database ;

- GET /health/redis.

### 13.4 Frontend

Vérification :

- la page front répond sur le port configuré ;

- la PWA se charge ;

- le front peut appeler l'API.

## 14 Configuration développement

### 14.1 Objectif

L'environnement développement doit être confortable et rapide.

Caractéristiques :

- hot reload front ;

- hot reload back ;

- volumes de code ;

- logs détaillés ;

- MockProvider activé ;

- Swagger accessible ;

- seeders disponibles.

### 14.2 Configuration recommandée

NODE_ENV=development

DEMO_MODE=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

LOG_LEVEL=debug

### 14.3 Commande de lancement

docker compose up --build

## 15 Configuration production future

### 15.1 Objectif

L'environnement production doit être plus sécurisé et plus stable.

Caractéristiques :

- images buildées ;

- pas de volumes de code ;

- pas de hot reload ;

- logs maîtrisés ;

- secrets injectés au runtime ;

- HTTPS ;

- CORS strict ;

- routes démo désactivées ;

- Swagger protégé ou désactivé ;

- PostgreSQL et Redis non exposés publiquement.

### 15.2 Configuration recommandée

NODE_ENV=production

DEMO_MODE=false

DEMO_SEED_ENABLED=false

EXTERNAL_API_MODE=real ou hybrid selon intégrations

LOG_LEVEL=info

15.3 docker-compose.prod.yml

Un fichier docker-compose.prod.yml peut être prévu pour :

- utiliser les Dockerfiles production ;

- désactiver les volumes de code ;

- ne pas exposer PostgreSQL et Redis ;

- ajouter un reverse proxy ;

- activer HTTPS via l'infrastructure.

## 16 Sécurité Docker

### 16.1 Secrets

Règles :

- ne pas copier .env dans l'image ;

- ne pas écrire de secrets dans Dockerfile ;

- ne pas écrire de secrets dans docker-compose.yml ;

- utiliser env_file ou variables de l'hébergeur ;

- utiliser des secrets distincts par environnement.

### 16.2 .dockerignore

Le fichier .dockerignore doit éviter d'envoyer des fichiers inutiles ou sensibles au build.

Exemple :

node_modules

dist

build

coverage

.env

.env.*

!.env.example

.git

.gitignore

logs

*.log

.DS_Store

### 16.3 Exposition des ports

En développement, exposer :

- frontend 5173 ;

- backend 3000 ;

- postgres 5432 si besoin local ;

- redis 6379 si besoin local.

En production, ne pas exposer publiquement :

- PostgreSQL ;

- Redis.

### 16.4 Images

Règles :

- utiliser des images officielles ;

- éviter les images obsolètes ;

- limiter les dépendances ;

- rebuild régulièrement ;

- scanner les vulnérabilités en évolution.

## 17 Docker et mode démo

### 17.1 Objectif

Le mode démo doit permettre de présenter l'application même sans APIs externes.

### 17.2 Services nécessaires

Pour la soutenance :

- frontend ;

- backend ;

- postgres ;

- redis ;

- MockProvider ;

- seeders.

Steam et Epic ne doivent pas être nécessaires.

### 17.3 Procédure soutenance recommandée

1. Vérifier le fichier .env.

2. Lancer : docker compose up --build.

3. Lancer les migrations.

4. Lancer le seed démo.

5. Ouvrir le front.

6. Se connecter au compte démo.

7. Vérifier dashboard, stats, leaderboard, équipe et chat.

8. Ouvrir Swagger si besoin.

9. Vérifier que l'application fonctionne sans Steam/Epic.

## 18 Dépannage courant

### 18.1 Le back-end ne se connecte pas à PostgreSQL

Vérifier :

- DATABASE_URL ;

- nom du service postgres ;

- mot de passe ;

- healthcheck ;

- logs postgres ;

- ordre de démarrage.

Commande :

docker compose logs -f postgres

docker compose logs -f backend

### 18.2 Le front ne peut pas appeler l'API

Vérifier :

- VITE_API_BASE_URL ;

- CORS côté back-end ;

- port 3000 exposé ;

- API démarrée ;

- URL utilisée depuis le navigateur.

### 18.3 Redis ne répond pas

Vérifier :

- REDIS_URL ;

- service redis démarré ;

- port ;

- logs redis.

### 18.4 Les données disparaissent après redémarrage

Cause possible :

- volume supprimé ;

- docker compose down -v exécuté ;

- mauvais volume ;

- base recréée.

Solution :

- vérifier postgres_data ;

- relancer seed si besoin ;

- ne pas utiliser -v sauf réinitialisation volontaire.

### 18.5 Les dépendances ne se mettent pas à jour

Solution :

- rebuild l'image ;

- supprimer le conteneur ;

- vérifier package-lock ;

- relancer npm install dans le conteneur si nécessaire.

Commandes :

docker compose build --no-cache

docker compose up

## 19 Bonnes pratiques Docker pour Track'N Share

- garder les Dockerfiles simples ;

- documenter les commandes dans README ;

- utiliser .env.example ;

- séparer développement et production ;

- éviter les secrets dans les images ;

- ne pas exposer Redis et PostgreSQL en production ;

- prévoir des healthchecks ;

- utiliser des volumes nommés pour PostgreSQL ;

- garder le MockProvider disponible ;

- tester le lancement sur une machine propre ;

- vérifier le mode démo avant soutenance.

## 20 Plan d'implémentation recommandé

Phase 1 — Docker local minimal

- Dockerfile backend ;

- Dockerfile frontend ;

- docker-compose.yml ;

- PostgreSQL ;

- Redis ;

- .env.example.

Phase 2 — Base et seed

- migrations ;

- seed demo ;

- compte démo ;

- données leaderboard ;

- données équipe et chat.

Phase 3 — Confort développement

- hot reload back ;

- hot reload front ;

- logs par service ;

- commandes documentées.

Phase 4 — Sécurité

- .dockerignore ;

- pas de secrets dans l'image ;

- providers externes désactivables ;

- routes démo contrôlées.

Phase 5 — Préparation production

- Dockerfile production ;

- docker-compose.prod.yml ;

- reverse proxy éventuel ;

- healthchecks ;

- variables de production ;

- désactivation du seed.

## 21 Checklist de lancement local

Avant de lancer :

- Docker est installé ;

- le fichier .env existe ;

- .env est basé sur .env.example ;

- DATABASE_URL pointe vers postgres dans Docker ;

- REDIS_URL pointe vers redis dans Docker ;

- JWT_SECRET est défini ;

- EXTERNAL_API_MODE=mock pour la démo ;

- DEMO_MODE=true si besoin.

Après lancement :

- frontend accessible ;

- backend accessible ;

- PostgreSQL prêt ;

- Redis prêt ;

- migrations passées ;

- seed exécuté ;

- Swagger accessible si activé ;

- login démo fonctionnel ;

- dashboard fonctionnel ;

- chat fonctionnel.

## 22 Checklist sécurité Docker

- .env non commité.

- .env non copié dans l'image.

- .env.example sans secrets réels.

- .dockerignore présent.

- PostgreSQL non exposé en production.

- Redis non exposé en production.

- secrets injectés au runtime.

- Dockerfile sans secret écrit en dur.

- images officielles utilisées.

- mode debug désactivé en production.

- routes seed désactivées en production.

- logs sans secrets.

## 23 Critères d'acceptation

La configuration Docker est considérée prête pour le MVP si :

- docker compose up lance PostgreSQL, Redis, le back-end et le front-end ;

- l'API NestJS peut se connecter à PostgreSQL ;

- l'API NestJS peut se connecter à Redis ;

- le front peut appeler l'API ;

- les migrations peuvent être exécutées ;

- les seeders peuvent remplir la base ;

- le compte démo fonctionne ;

- le mode mock fonctionne sans Steam/Epic ;

- les volumes PostgreSQL conservent les données ;

- les logs sont consultables par service ;

- aucun secret réel n'est présent dans l'image ou le dépôt ;

- une personne externe peut suivre la documentation pour lancer le projet.

## 24 Conclusion

Docker est un élément central pour rendre Track'N Share simple à lancer, fiable à démontrer et plus facile à déployer.

Pour le MVP, Docker doit surtout permettre de lancer localement l'ensemble du projet avec PostgreSQL, Redis, le back-end, le front-end, les migrations, les données seedées et le MockProvider.

Pour une production future, la configuration devra être renforcée : images optimisées, secrets au runtime, PostgreSQL et Redis non exposés, HTTPS, reverse proxy, healthchecks, monitoring et séparation stricte des environnements.

Une configuration Docker propre garantit que le projet peut être testé, présenté et repris facilement par une autre personne.
