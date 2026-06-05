# VARIABLES D'ENVIRONNEMENT

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document liste et explique les variables d'environnement nécessaires au projet Track'N Share.

Il sert de référence pratique pour configurer le projet en développement, en test, en mode soutenance/démo et en production future. Il complète le document Gestion-secrets-env, qui traite davantage des règles de sécurité autour des secrets.

Ici, l'objectif est de savoir :

- quelles variables créer ;

- à quoi elles servent ;

- dans quel service elles sont utilisées ;

- si elles sont obligatoires ;

- si elles sont sensibles ;

- quelles valeurs utiliser en développement ou démonstration ;

- quelles valeurs ne jamais exposer au front-end.

## 1 Principes généraux

### 1.1 Définition

Une variable d'environnement est une valeur fournie à une application au moment de son exécution.

Elle permet de configurer le comportement du projet sans modifier le code source.

Exemples :

- port de l'API ;

- URL de la base PostgreSQL ;

- URL Redis ;

- secret JWT ;

- URL du front-end ;

- mode mock ou réel pour les APIs externes ;

- clés Steam ou Epic ;

- niveau de logs.

### 1.2 Pourquoi les utiliser

Les variables d'environnement permettent de :

- séparer le code de la configuration ;

- éviter de commiter des secrets ;

- changer d'environnement facilement ;

- lancer le projet avec Docker ;

- préparer la soutenance ;

- configurer une production future ;

- désactiver ou activer certaines intégrations.

### 1.3 Règle principale

Les secrets ne doivent jamais être écrits en dur dans le code.

Ils doivent être placés dans :

- un fichier .env local non commité ;

- les variables de l'hébergeur ;

- les secrets GitHub Actions si CI/CD ;

- un gestionnaire de secrets en production avancée.

## 2 Fichiers recommandés

### 2.1 .env

Le fichier .env contient les valeurs utilisées localement.

Il peut contenir des secrets.

Il ne doit jamais être commité.

### 2.2 .env.local

Le fichier .env.local contient la configuration personnelle d'un développeur.

Il ne doit jamais être commité.

### 2.3 .env.test

Le fichier .env.test peut contenir des valeurs spécifiques aux tests.

Il doit utiliser des données fictives ou isolées.

### 2.4 .env.production

Le fichier .env.production ne doit pas être commité si des secrets réels y sont présents.

En production, il est préférable d'utiliser les variables d'environnement fournies par l'hébergeur.

### 2.5 .env.example

Le fichier .env.example doit être commité.

Il sert de modèle pour les développeurs.

Il doit contenir :

- toutes les variables nécessaires ;

- des exemples de valeurs ;

- aucune vraie clé ;

- aucun vrai mot de passe ;

- aucun secret réel.

## 3 Règles Git

Le fichier .gitignore doit contenir :

.env

.env.*

!.env.example

Objectif :

- ignorer tous les fichiers .env ;

- conserver uniquement .env.example dans le dépôt.

## 4 Séparation front-end / back-end

### 4.1 Back-end

Le back-end NestJS peut accéder à des variables sensibles.

Exemples :

- DATABASE_URL ;

- REDIS_URL ;

- JWT_SECRET ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET.

Ces variables doivent rester côté serveur.

### 4.2 Front-end

Le front-end React/Vite peut seulement accéder aux variables préfixées par VITE_.

Exemples :

- VITE_API_BASE_URL ;

- VITE_SOCKET_URL ;

- VITE_APP_NAME ;

- VITE_DEMO_MODE.

### 4.3 Règle Vite importante

Toute variable commençant par VITE_ est exposée au navigateur.

Donc :

- VITE_API_BASE_URL est acceptable ;

- VITE_SOCKET_URL est acceptable ;

- VITE_JWT_SECRET est interdit ;

- VITE_STEAM_WEB_API_KEY est interdit ;

- VITE_DATABASE_URL est interdit.

## 5 Variables générales de l'application

| Variable | Service | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|---|

| NODE_ENV | Backend | development | Oui | Non | Définit l'environnement d'exécution : development, test ou production. |

| APP_NAME | Backend / Frontend | Track'N Share | Non | Non | Nom de l'application. |

| APP_PORT | Backend | 3000 | Oui | Non | Port d'écoute de l'API NestJS. |

| APP_BASE_URL | Backend | http://localhost:3000 | Oui en prod | Non | URL publique de l'API ou du serveur. |

| API_PREFIX | Backend | api | Non | Non | Préfixe global de l'API. |

| API_VERSION | Backend | v1 | Non | Non | Version de l'API si versioning activé. |

| FRONTEND_URL | Backend | http://localhost:5173 | Oui | Non | URL autorisée du front-end, utile pour CORS. |

| TZ | Tous | Europe/Paris | Non | Non | Fuseau horaire du runtime si nécessaire. |

## 6 Variables front-end React / PWA

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| VITE_APP_NAME | Track'N Share | Non | Non | Nom affiché dans l'application. |

| VITE_API_BASE_URL | http://localhost:3000/api | Oui | Non | URL de base de l'API REST. |

| VITE_SOCKET_URL | http://localhost:3000/chat | Oui si Socket.io | Non | URL de connexion Socket.io. |

| VITE_DEMO_MODE | true | Non | Non | Active certains affichages liés au mode démo. |

| VITE_ENABLE_PWA | true | Non | Non | Active ou désactive les comportements PWA si prévu. |

| VITE_ENABLE_SWAGGER_LINK | true | Non | Non | Permet d'afficher un lien vers Swagger si utile. |

| VITE_DEFAULT_LOCALE | fr-FR | Non | Non | Locale par défaut de l'interface. |

Règle :

Ces variables sont publiques. Elles ne doivent contenir aucun secret.

## 7 Variables d'authentification JWT

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| JWT_SECRET | replace_me_with_long_random_secret | Oui | Oui | Secret utilisé pour signer les access tokens JWT. |

| JWT_EXPIRES_IN | 1h | Oui | Non | Durée de vie de l'access token. |

| JWT_REFRESH_SECRET | replace_me_with_long_random_refresh_secret | P1 | Oui | Secret utilisé pour signer les refresh tokens. |

| JWT_REFRESH_EXPIRES_IN | 7d | P1 | Non | Durée de vie du refresh token. |

| PASSWORD_RESET_SECRET | replace_me | P1 | Oui | Secret utilisé pour les tokens de réinitialisation de mot de passe. |

| PASSWORD_RESET_TOKEN_EXPIRES_IN | 15m | P1 | Non | Durée de vie d'un token de reset. |

| BCRYPT_SALT_ROUNDS | 12 | Oui si bcrypt | Non | Coût de hash si bcrypt est utilisé. |

| ARGON2_MEMORY_COST | 65536 | Non | Non | Paramètre Argon2 si Argon2 est utilisé. |

| ARGON2_TIME_COST | 3 | Non | Non | Paramètre Argon2 si Argon2 est utilisé. |

Recommandations :

- JWT_SECRET doit être long, aléatoire et différent selon l'environnement ;

- ne jamais utiliser "secret" ou "password" en production ;

- changer les secrets en cas de fuite ;

- ne jamais préfixer ces variables par VITE_.

## 8 Variables PostgreSQL

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| DATABASE_URL | postgresql://tracknshare:password@postgres:5432/tracknshare | Oui | Oui | URL complète de connexion PostgreSQL. |

| POSTGRES_USER | tracknshare | Oui Docker | Non | Utilisateur PostgreSQL créé par le conteneur. |

| POSTGRES_PASSWORD | replace_me | Oui Docker | Oui | Mot de passe PostgreSQL. |

| POSTGRES_DB | tracknshare | Oui Docker | Non | Nom de la base de données. |

| DATABASE_SSL | false | Non | Non | Active SSL pour la connexion BDD en production. |

| DATABASE_LOGGING | false | Non | Non | Active les logs SQL, à éviter en production si trop verbeux. |

Exemple hors Docker :

DATABASE_URL=postgresql://tracknshare:password@localhost:5432/tracknshare

Exemple dans Docker :

DATABASE_URL=postgresql://tracknshare:password@postgres:5432/tracknshare

Règle :

Dans Docker, le host PostgreSQL doit être le nom du service : postgres.

## 9 Variables Redis

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| REDIS_URL | redis://redis:6379 | Oui si Redis | Oui si mot de passe | URL de connexion Redis. |

| REDIS_HOST | redis | Non | Non | Host Redis si pas d'URL complète. |

| REDIS_PORT | 6379 | Non | Non | Port Redis. |

| REDIS_PASSWORD | replace_me_if_needed | Non | Oui | Mot de passe Redis si activé. |

| REDIS_DB | 0 | Non | Non | Index de base Redis. |

| REDIS_TLS | false | Non | Non | Active TLS pour Redis managé. |

| REDIS_KEY_PREFIX | tns | Non | Non | Préfixe des clés Redis. |

Usages Redis dans Track'N Share :

- cache ;

- rate limiting ;

- locks ;

- leaderboards rapides ;

- présence en ligne ;

- Socket.io adapter en évolution.

## 10 Variables Docker

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| COMPOSE_PROJECT_NAME | tracknshare | Non | Non | Nom du projet Docker Compose. |

| BACKEND_PORT | 3000 | Non | Non | Port local exposé pour le back-end. |

| FRONTEND_PORT | 5173 | Non | Non | Port local exposé pour le front-end. |

| POSTGRES_PORT | 5432 | Non | Non | Port local PostgreSQL en développement. |

| REDIS_PORT_PUBLIC | 6379 | Non | Non | Port local Redis en développement. |

Règles :

- PostgreSQL et Redis peuvent être exposés localement en développement ;

- en production, PostgreSQL et Redis ne doivent pas être exposés publiquement ;

- les secrets ne doivent pas être écrits directement dans docker-compose.yml.

## 11 Variables API externe / providers

### 11.1 Variables générales providers

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| EXTERNAL_API_MODE | mock | Oui | Non | Mode d'utilisation : mock, real ou hybrid. |

| USE_MOCK_PROVIDER | true | Oui MVP | Non | Force l'utilisation du provider mock. |

| MOCK_PROVIDER_ENABLED | true | Oui MVP | Non | Active le provider de données fictives. |

| EXTERNAL_API_TIMEOUT_MS | 5000 | Non | Non | Timeout des appels externes. |

| EXTERNAL_API_MAX_RETRIES | 2 | Non | Non | Nombre maximal de retries. |

| EXTERNAL_API_CACHE_TTL_SECONDS | 300 | Non | Non | Durée de cache des réponses externes. |

Modes recommandés :

- développement : mock ;

- soutenance : mock ;

- test d'intégration : hybrid ;

- production future : real ou hybrid selon fiabilité.

### 11.2 Variables Steam

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| STEAM_PROVIDER_ENABLED | false | Non | Non | Active ou désactive le provider Steam. |

| STEAM_WEB_API_KEY | replace_me | Oui si Steam activé | Oui | Clé Steam Web API, côté back-end uniquement. |

| STEAM_API_BASE_URL | https://api.steampowered.com | Non | Non | Base URL publique Steam. |

| STEAM_PARTNER_API_BASE_URL | https://partner.steam-api.com | Non | Non | Base URL partenaire Steam. |

| STEAM_PROFILE_CACHE_TTL_SECONDS | 3600 | Non | Non | Cache des profils Steam. |

| STEAM_GAMES_CACHE_TTL_SECONDS | 86400 | Non | Non | Cache des jeux possédés. |

Règles :

- STEAM_WEB_API_KEY ne doit jamais être dans le front-end ;

- Steam doit être désactivé si la clé est absente ;

- le MVP ne doit pas dépendre de Steam.

### 11.3 Variables Epic / EOS

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| EPIC_PROVIDER_ENABLED | false | Non | Non | Active ou désactive le provider Epic/EOS. |

| EPIC_CLIENT_ID | replace_me | Oui si Epic activé | Selon usage | Identifiant client Epic. |

| EPIC_CLIENT_SECRET | replace_me | Oui si Epic activé | Oui | Secret client Epic, côté back-end uniquement. |

| EPIC_PRODUCT_ID | replace_me | Oui si Epic activé | Non | Identifiant produit EOS. |

| EPIC_DEPLOYMENT_ID | replace_me | Oui si Epic activé | Non | Identifiant deployment EOS. |

| EPIC_SANDBOX_ID | replace_me | Oui si Epic activé | Non | Identifiant sandbox EOS. |

| EPIC_ENVIRONMENT | development | Non | Non | Environnement Epic/EOS. |

Règles :

- Epic/EOS est une intégration future ;

- le MVP ne doit pas dépendre d'Epic ;

- le provider doit être désactivé si la configuration est incomplète.

## 12 Variables mode démo et seeders

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| DEMO_MODE | true | Oui soutenance | Non | Active le mode démonstration. |

| DEMO_SEED_ENABLED | true | Oui soutenance | Non | Autorise l'exécution des seeders démo. |

| DEMO_ACCOUNT_EMAIL | demo@tracknshare.local | Non | Non | Email du compte démo. |

| DEMO_ACCOUNT_PASSWORD | DemoPassword123! | Non | Sensible faible | Mot de passe du compte démo. |

| SEED_RESET_DATABASE | false | Non | Non | Autorise ou non le reset complet de la base avant seed. |

| SEED_PLAYERS_COUNT | 30 | Non | Non | Nombre de joueurs fictifs à générer. |

| SEED_TEAMS_COUNT | 6 | Non | Non | Nombre d'équipes fictives. |

| SEED_MESSAGES_COUNT | 50 | Non | Non | Nombre de messages fictifs. |

Règles :

- les données seedées doivent rester fictives ;

- ne pas utiliser de vrais emails ;

- DEMO_SEED_ENABLED doit être false en production ;

- le compte démo ne doit pas avoir de rôle admin en production.

## 13 Variables rate limiting

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| RATE_LIMIT_ENABLED | true | Oui | Non | Active le rate limiting global. |

| RATE_LIMIT_STORE | redis | Non | Non | Stockage des compteurs : memory ou redis. |

| RATE_LIMIT_DEFAULT_TTL | 60 | Non | Non | Fenêtre par défaut en secondes. |

| RATE_LIMIT_DEFAULT_LIMIT | 100 | Non | Non | Nombre de requêtes autorisées par fenêtre. |

| RATE_LIMIT_LOGIN_TTL | 60 | P0 | Non | Fenêtre login. |

| RATE_LIMIT_LOGIN_LIMIT | 5 | P0 | Non | Tentatives login par fenêtre. |

| RATE_LIMIT_REGISTER_TTL | 3600 | P0 | Non | Fenêtre inscription. |

| RATE_LIMIT_REGISTER_LIMIT | 3 | P0 | Non | Inscriptions par fenêtre. |

| RATE_LIMIT_STATS_SYNC_TTL | 300 | P0 | Non | Fenêtre de sync stats. |

| RATE_LIMIT_STATS_SYNC_LIMIT | 1 | P0 | Non | Sync autorisée par fenêtre. |

| RATE_LIMIT_CHAT_MESSAGE_TTL | 60 | P0 | Non | Fenêtre messages chat. |

| RATE_LIMIT_CHAT_MESSAGE_LIMIT | 20 | P0 | Non | Messages par minute. |

| RATE_LIMIT_TEAM_JOIN_TTL | 3600 | P0 | Non | Fenêtre tentative code équipe. |

| RATE_LIMIT_TEAM_JOIN_LIMIT | 10 | P0 | Non | Tentatives de code équipe. |

## 14 Variables sécurité HTTP / CORS

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| CORS_ORIGIN | http://localhost:5173 | Oui | Non | Origine front autorisée. |

| CORS_CREDENTIALS | true | Non | Non | Autorise l'envoi de credentials si cookies. |

| HELMET_ENABLED | true | Non | Non | Active les headers de sécurité via Helmet. |

| CSP_ENABLED | false | Non | Non | Active une Content Security Policy si configurée. |

| TRUST_PROXY | false | Non | Non | À activer derrière un reverse proxy. |

| COOKIE_SECURE | false | Selon env | Non | Cookies Secure en production HTTPS. |

| COOKIE_SAME_SITE | lax | Selon env | Non | SameSite des cookies si utilisés. |

Recommandations :

- CORS strict en production ;

- ne pas utiliser * avec credentials ;

- COOKIE_SECURE=true en production HTTPS.

## 15 Variables Swagger

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| SWAGGER_ENABLED | true | Non | Non | Active la documentation Swagger. |

| SWAGGER_PATH | api/docs | Non | Non | Chemin Swagger. |

| SWAGGER_TITLE | Track'N Share API | Non | Non | Titre de la documentation. |

| SWAGGER_VERSION | 1.0 | Non | Non | Version API affichée. |

| SWAGGER_PROTECT_IN_PROD | true | Non | Non | Protège ou désactive Swagger en production. |

Règles :

- aucun secret dans Swagger ;

- Swagger peut rester accessible en développement ;

- en production, le protéger ou le désactiver selon choix.

## 16 Variables logs et monitoring

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| LOG_LEVEL | debug | Non | Non | Niveau de logs : debug, info, warn, error. |

| LOG_PRETTY | true | Non | Non | Format lisible en développement. |

| LOG_REDACT_SECRETS | true | Oui | Non | Masque les secrets dans les logs. |

| MONITORING_ENABLED | false | Non | Non | Active un outil de monitoring si configuré. |

| SENTRY_DSN | replace_me_if_used | Non | Oui selon contexte | DSN Sentry si utilisé. |

| HEALTHCHECK_ENABLED | true | Non | Non | Active les endpoints healthcheck. |

Règles :

- ne jamais logger JWT, refresh tokens, mots de passe ou clés API ;

- LOG_LEVEL=debug uniquement en développement ;

- LOG_LEVEL=info ou warn recommandé en production.

## 17 Variables upload / stockage de fichiers

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| UPLOAD_ENABLED | false | Non | Non | Active les uploads. |

| UPLOAD_MAX_FILE_SIZE_MB | 2 | Non | Non | Taille maximale d'un fichier. |

| UPLOAD_ALLOWED_MIME_TYPES | image/png,image/jpeg,image/webp | Non | Non | Types autorisés. |

| STORAGE_PROVIDER | local | Non | Non | local, s3 ou autre. |

| STORAGE_BUCKET | tracknshare-assets | Selon provider | Non | Nom du bucket si stockage cloud. |

| STORAGE_ACCESS_KEY | replace_me | Selon provider | Oui | Clé d'accès stockage. |

| STORAGE_SECRET_KEY | replace_me | Selon provider | Oui | Secret stockage. |

| STORAGE_PUBLIC_URL | http://localhost:3000/uploads | Non | Non | URL publique contrôlée des fichiers. |

Recommandation MVP :

Si l'upload sécurisé n'est pas prêt, garder UPLOAD_ENABLED=false et utiliser des avatars par défaut.

## 18 Variables email

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| MAIL_ENABLED | false | Non | Non | Active l'envoi d'emails. |

| SMTP_HOST | smtp.example.com | Si mail activé | Non | Hôte SMTP. |

| SMTP_PORT | 587 | Si mail activé | Non | Port SMTP. |

| SMTP_USER | replace_me | Si mail activé | Oui | Identifiant SMTP. |

| SMTP_PASSWORD | replace_me | Si mail activé | Oui | Mot de passe SMTP. |

| MAIL_FROM | no-reply@tracknshare.example | Si mail activé | Non | Adresse expéditeur. |

Usage futur :

- mot de passe oublié ;

- vérification email ;

- notifications transactionnelles.

## 19 Variables archivage et jobs

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| JOBS_ENABLED | true | Non | Non | Active les tâches planifiées. |

| SEASON_ARCHIVE_JOB_ENABLED | true | Non | Non | Active le job d'archivage trimestriel. |

| SEASON_ARCHIVE_CRON | 0 0 1 1,4,7,10 * | Non | Non | Cron d'archivage trimestriel. |

| LEADERBOARD_RECALC_JOB_ENABLED | true | Non | Non | Active les recalculs automatiques. |

| JOB_LOCK_TTL_SECONDS | 600 | Non | Non | Durée des locks Redis pour jobs. |

Règles :

- les jobs doivent être idempotents ;

- les archivages doivent utiliser des locks ;

- les saisons archivées ne doivent pas être recalculées par erreur.

## 20 Variables Socket.io

| Variable | Exemple | Obligatoire | Sensible | Description |

|---|---|---|---|---|

| SOCKET_NAMESPACE_CHAT | /chat | Non | Non | Namespace Socket.io pour le chat. |

| SOCKET_CORS_ORIGIN | http://localhost:5173 | Oui si Socket.io | Non | Origine autorisée pour Socket.io. |

| SOCKET_RATE_LIMIT_ENABLED | true | Non | Non | Active le rate limiting Socket.io. |

| SOCKET_REDIS_ADAPTER_ENABLED | false | P2 | Non | Active l'adapter Redis pour scaling. |

| SOCKET_PRESENCE_ENABLED | false | P1 | Non | Active la présence en ligne. |

## 21 Variables par environnement

### 21.1 Développement

Configuration recommandée :

NODE_ENV=development

APP_PORT=3000

FRONTEND_URL=http://localhost:5173

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000/chat

DATABASE_URL=postgresql://tracknshare:password@postgres:5432/tracknshare

REDIS_URL=redis://redis:6379

JWT_SECRET=dev_replace_me_long_random

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

DEMO_MODE=true

DEMO_SEED_ENABLED=true

LOG_LEVEL=debug

SWAGGER_ENABLED=true

### 21.2 Test

Configuration recommandée :

NODE_ENV=test

DATABASE_URL=postgresql://tracknshare_test:password@localhost:5432/tracknshare_test

REDIS_URL=redis://localhost:6379

JWT_SECRET=test_secret_not_for_prod

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

MAIL_ENABLED=false

LOG_LEVEL=error

### 21.3 Soutenance / démo

Configuration recommandée :

NODE_ENV=development

DEMO_MODE=true

DEMO_SEED_ENABLED=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

LOG_LEVEL=info

Objectif :

- éviter toute dépendance à Steam ou Epic ;

- garantir des données stables ;

- pouvoir lancer le projet même sans Internet.

### 21.4 Production future

Configuration recommandée :

NODE_ENV=production

DEMO_MODE=false

DEMO_SEED_ENABLED=false

EXTERNAL_API_MODE=hybrid

MOCK_PROVIDER_ENABLED=false

SWAGGER_PROTECT_IN_PROD=true

LOG_LEVEL=info

HELMET_ENABLED=true

CORS_ORIGIN=https://app.tracknshare.example

COOKIE_SECURE=true

TRUST_PROXY=true

Règles :

- secrets forts ;

- routes démo désactivées ;

- PostgreSQL et Redis non exposés publiquement ;

- HTTPS obligatoire ;

- logs sans secrets.

## 22 Validation au démarrage

### 22.1 Objectif

Le back-end doit vérifier les variables critiques au démarrage.

Si une variable obligatoire manque, l'application doit afficher une erreur claire et refuser de démarrer.

### 22.2 Variables critiques MVP

Variables obligatoires :

- NODE_ENV ;

- APP_PORT ;

- DATABASE_URL ;

- JWT_SECRET ;

- FRONTEND_URL.

Variables obligatoires si Redis activé :

- REDIS_URL.

Variables obligatoires si Steam activé :

- STEAM_WEB_API_KEY.

Variables obligatoires si Epic activé :

- EPIC_CLIENT_ID ;

- EPIC_CLIENT_SECRET ;

- EPIC_PRODUCT_ID ;

- EPIC_DEPLOYMENT_ID.

### 22.3 Validation recommandée

Outils possibles :

- @nestjs/config ;

- Joi ;

- Zod ;

- validation maison.

Contrôles recommandés :

- vérifier que les URLs sont valides ;

- vérifier que les booléens sont corrects ;

- vérifier que les nombres sont positifs ;

- empêcher les secrets replace_me en production ;

- empêcher DEMO_SEED_ENABLED=true en production ;

- empêcher LOG_LEVEL=debug en production si non souhaité.

## 23 Exemple complet .env.example

Exemple à adapter au dépôt :

# Application

NODE_ENV=development

APP_NAME=TrackNShare

APP_PORT=3000

APP_BASE_URL=http://localhost:3000

FRONTEND_URL=http://localhost:5173

API_PREFIX=api

API_VERSION=v1

# Frontend public variables

VITE_APP_NAME=Track'N Share

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000/chat

VITE_DEMO_MODE=true

# Database

POSTGRES_USER=tracknshare

POSTGRES_PASSWORD=replace_me

POSTGRES_DB=tracknshare

DATABASE_URL=postgresql://tracknshare:replace_me@postgres:5432/tracknshare

DATABASE_SSL=false

# Redis

REDIS_URL=redis://redis:6379

REDIS_KEY_PREFIX=tns

# Auth

JWT_SECRET=replace_me_with_long_random_secret

JWT_EXPIRES_IN=1h

JWT_REFRESH_SECRET=replace_me_with_long_random_refresh_secret

JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

# Providers

EXTERNAL_API_MODE=mock

USE_MOCK_PROVIDER=true

MOCK_PROVIDER_ENABLED=true

EXTERNAL_API_TIMEOUT_MS=5000

EXTERNAL_API_MAX_RETRIES=2

# Steam

STEAM_PROVIDER_ENABLED=false

STEAM_WEB_API_KEY=replace_me

STEAM_API_BASE_URL=https://api.steampowered.com

STEAM_PARTNER_API_BASE_URL=https://partner.steam-api.com

# Epic / EOS

EPIC_PROVIDER_ENABLED=false

EPIC_CLIENT_ID=replace_me

EPIC_CLIENT_SECRET=replace_me

EPIC_PRODUCT_ID=replace_me

EPIC_DEPLOYMENT_ID=replace_me

EPIC_SANDBOX_ID=replace_me

EPIC_ENVIRONMENT=development

# Demo

DEMO_MODE=true

DEMO_SEED_ENABLED=true

DEMO_ACCOUNT_EMAIL=demo@tracknshare.local

DEMO_ACCOUNT_PASSWORD=DemoPassword123!

# Rate limiting

RATE_LIMIT_ENABLED=true

RATE_LIMIT_STORE=redis

RATE_LIMIT_LOGIN_TTL=60

RATE_LIMIT_LOGIN_LIMIT=5

RATE_LIMIT_STATS_SYNC_TTL=300

RATE_LIMIT_STATS_SYNC_LIMIT=1

RATE_LIMIT_CHAT_MESSAGE_TTL=60

RATE_LIMIT_CHAT_MESSAGE_LIMIT=20

# Security / HTTP

CORS_ORIGIN=http://localhost:5173

CORS_CREDENTIALS=true

HELMET_ENABLED=true

TRUST_PROXY=false

# Swagger

SWAGGER_ENABLED=true

SWAGGER_PATH=api/docs

SWAGGER_PROTECT_IN_PROD=true

# Logs

LOG_LEVEL=debug

LOG_PRETTY=true

LOG_REDACT_SECRETS=true

HEALTHCHECK_ENABLED=true

# Uploads

UPLOAD_ENABLED=false

UPLOAD_MAX_FILE_SIZE_MB=2

UPLOAD_ALLOWED_MIME_TYPES=image/png,image/jpeg,image/webp

STORAGE_PROVIDER=local

# Mail

MAIL_ENABLED=false

SMTP_HOST=replace_me

SMTP_PORT=587

SMTP_USER=replace_me

SMTP_PASSWORD=replace_me

MAIL_FROM=no-reply@tracknshare.example

## 24 Variables interdites côté front-end

Les variables suivantes ne doivent jamais être préfixées par VITE_ :

- JWT_SECRET ;

- JWT_REFRESH_SECRET ;

- DATABASE_URL ;

- POSTGRES_PASSWORD ;

- REDIS_URL avec mot de passe ;

- REDIS_PASSWORD ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- ENCRYPTION_KEY ;

- STORAGE_SECRET_KEY ;

- DEPLOY_TOKEN.

## 25 Checklist configuration locale

Avant de lancer Docker :

- copier .env.example vers .env ;

- remplir POSTGRES_PASSWORD ;

- remplir DATABASE_URL ;

- remplir REDIS_URL ;

- remplir JWT_SECRET ;

- vérifier VITE_API_BASE_URL ;

- vérifier VITE_SOCKET_URL ;

- mettre EXTERNAL_API_MODE=mock ;

- mettre MOCK_PROVIDER_ENABLED=true ;

- mettre DEMO_MODE=true si démonstration ;

- vérifier que Steam/Epic sont désactivés si clés absentes.

## 26 Checklist production future

Avant production :

- NODE_ENV=production ;

- JWT_SECRET fort ;

- DATABASE_URL production sécurisée ;

- REDIS_URL production sécurisée ;

- CORS_ORIGIN domaine réel ;

- COOKIE_SECURE=true si cookies ;

- HELMET_ENABLED=true ;

- DEMO_SEED_ENABLED=false ;

- Swagger protégé ou désactivé ;

- LOG_LEVEL=info ou warn ;

- aucun replace_me ;

- aucun secret côté front ;

- providers externes activés seulement si configurés ;

- secrets différents de ceux de développement.

## 27 Risques et solutions

### 27.1 Variable manquante

Impact : application instable ou impossible à lancer.

Solution : validation au démarrage et message d'erreur clair.

### 27.2 Secret exposé au front

Impact : compromission de l'application ou d'un provider.

Solution : aucune variable sensible avec préfixe VITE_.

### 27.3 Mauvaise DATABASE_URL dans Docker

Impact : back-end incapable de se connecter à PostgreSQL.

Solution : utiliser host postgres dans Docker, localhost hors Docker.

### 27.4 Mode démo activé en production

Impact : routes de seed ou données fictives accessibles.

Solution : empêcher DEMO_SEED_ENABLED=true en production.

### 27.5 Steam/Epic activés sans clé valide

Impact : erreurs de synchronisation.

Solution : désactiver provider si config incomplète et utiliser MockProvider.

### 27.6 LOG_LEVEL=debug en production

Impact : logs trop détaillés.

Solution : utiliser info ou warn, masquer les secrets.

## 28 Critères d'acceptation

La documentation des variables d'environnement est correcte si :

- toutes les variables principales sont listées ;

- chaque variable a une description ;

- les variables sensibles sont identifiées ;

- les variables front-end sont séparées des variables back-end ;

- un exemple .env.example est fourni ;

- le mode démo est documenté ;

- Docker est pris en compte ;

- PostgreSQL et Redis sont documentés ;

- JWT est documenté ;

- Steam et Epic sont documentés ;

- le rate limiting est documenté ;

- la production future est documentée ;

- les risques de mauvaise configuration sont identifiés ;

- une checklist locale et production est disponible.

## 29 Conclusion

Les variables d'environnement sont essentielles pour rendre Track'N Share configurable, sécurisé et facilement déployable.

Elles permettent de séparer la configuration du code, de protéger les secrets, de basculer entre mock et APIs réelles, de préparer la soutenance et de prévoir une production future.

Pour le MVP, les variables les plus importantes sont :

- DATABASE_URL ;

- REDIS_URL ;

- JWT_SECRET ;

- FRONTEND_URL ;

- VITE_API_BASE_URL ;

- VITE_SOCKET_URL ;

- EXTERNAL_API_MODE ;

- MOCK_PROVIDER_ENABLED ;

- DEMO_MODE ;

- DEMO_SEED_ENABLED.

Une bonne configuration garantit que le projet peut être lancé facilement, testé correctement et présenté sans dépendre d'APIs externes instables.
