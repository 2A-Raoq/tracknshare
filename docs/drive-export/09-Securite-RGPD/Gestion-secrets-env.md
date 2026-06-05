# GESTION DES SECRETS ET VARIABLES D'ENVIRONNEMENT

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit la stratégie de gestion des secrets et des variables d'environnement pour Track'N Share.

Il a pour objectif de garantir que les informations sensibles nécessaires au fonctionnement du projet ne soient jamais exposées publiquement, commitées dans GitHub, affichées côté front-end, présentes dans les logs ou partagées dans des documents non sécurisés.

Les secrets concernent notamment les clés JWT, les URLs de base de données, les mots de passe, les clés Steam, les secrets Epic/EOS, les tokens de déploiement, les clés de chiffrement, les accès Redis, les identifiants SMTP et toutes les informations permettant d'accéder à un service privé.

## 1 Vue d'ensemble

### 1.1 Pourquoi gérer les secrets

Une mauvaise gestion des secrets peut entraîner :

- accès non autorisé à la base de données ;

- compromission des comptes utilisateurs ;

- vol ou falsification de tokens JWT ;

- abus des clés API Steam ou Epic ;

- accès non autorisé à Redis ;

- fuite de données personnelles ;

- compromission du déploiement ;

- dépassement de quotas externes ;

- perte de confiance et non-conformité RGPD.

### 1.2 Règle principale

Un secret ne doit jamais être :

- écrit en dur dans le code ;

- commité dans GitHub ;

- exposé dans le front-end React ;

- stocké dans un document public ;

- affiché dans Swagger ;

- imprimé dans les logs ;

- envoyé au navigateur ;

- partagé dans une capture d'écran ;

- conservé dans un fichier de test non protégé.

### 1.3 Principe de base

Les secrets doivent être fournis à l'application via des variables d'environnement ou un gestionnaire de secrets.

Pour le MVP, l'approche recommandée est :

- fichiers .env locaux non commités ;

- fichier .env.example commitable sans vraie valeur ;

- variables d'environnement dans Docker Compose ;

- secrets GitHub Actions si CI/CD ;

- variables d'environnement de la plateforme d'hébergement si déploiement.

## 2 Types de secrets concernés

### 2.1 Secrets d'authentification

Exemples :

- JWT_SECRET ;

- JWT_REFRESH_SECRET ;

- SESSION_SECRET ;

- PASSWORD_RESET_SECRET ;

- EMAIL_VERIFICATION_SECRET.

Usage :

- signer les access tokens ;

- signer les refresh tokens ;

- sécuriser les sessions ;

- générer des tokens de reset mot de passe.

Risque en cas de fuite :

- création de tokens frauduleux ;

- usurpation d'identité ;

- accès aux routes privées.

### 2.2 Secrets base de données

Exemples :

- DATABASE_URL ;

- POSTGRES_USER ;

- POSTGRES_PASSWORD ;

- POSTGRES_DB ;

- DATABASE_SSL_CERT si utilisé.

Usage :

- connexion PostgreSQL ;

- migrations ;

- seeders ;

- accès back-end.

Risque en cas de fuite :

- accès direct aux données ;

- suppression ou modification de données ;

- fuite RGPD.

### 2.3 Secrets Redis

Exemples :

- REDIS_URL ;

- REDIS_HOST ;

- REDIS_PORT ;

- REDIS_PASSWORD ;

- REDIS_TLS_ENABLED.

Usage :

- cache ;

- sessions ;

- rate limiting ;

- locks ;

- leaderboards rapides ;

- Socket.io adapter en évolution.

Risque en cas de fuite :

- lecture ou modification du cache ;

- contournement du rate limiting ;

- perturbation du système temps réel ;

- fuite de tokens si mal stockés.

### 2.4 Secrets APIs externes

Steam :

- STEAM_WEB_API_KEY ;

- STEAM_API_BASE_URL ;

- STEAM_PARTNER_API_BASE_URL.

Epic / EOS :

- EPIC_CLIENT_ID ;

- EPIC_CLIENT_SECRET ;

- EPIC_PRODUCT_ID ;

- EPIC_DEPLOYMENT_ID ;

- EPIC_SANDBOX_ID ;

- EPIC_ENVIRONMENT.

Autres providers futurs :

- RIOT_API_KEY ;

- BLIZZARD_CLIENT_ID ;

- BLIZZARD_CLIENT_SECRET ;

- UBISOFT_API_KEY ;

- XBOX_CLIENT_SECRET.

Risque en cas de fuite :

- abus de quotas ;

- blocage du provider ;

- accès non autorisé à des données externes ;

- mauvaise réputation du projet.

### 2.5 Secrets email

Exemples :

- SMTP_HOST ;

- SMTP_PORT ;

- SMTP_USER ;

- SMTP_PASSWORD ;

- MAIL_FROM ;

- EMAIL_API_KEY.

Usage :

- email de reset mot de passe ;

- vérification email ;

- notifications transactionnelles.

Priorité : P1, si email réel ajouté.

### 2.6 Secrets de chiffrement

Exemples :

- ENCRYPTION_KEY ;

- MESSAGE_ENCRYPTION_KEY ;

- EXTERNAL_TOKEN_ENCRYPTION_KEY.

Usage :

- chiffrer certains tokens externes ;

- chiffrer des données sensibles ;

- sécuriser certains contenus stockés.

Risque en cas de fuite :

- déchiffrement des données protégées.

### 2.7 Secrets de déploiement et CI/CD

Exemples :

- DOCKER_REGISTRY_TOKEN ;

- GITHUB_TOKEN ;

- DEPLOY_TOKEN ;

- VERCEL_TOKEN ;

- RENDER_API_KEY ;

- SSH_PRIVATE_KEY ;

- CLOUD_PROVIDER_SECRET.

Usage :

- build ;

- déploiement ;

- push image Docker ;

- accès serveur ;

- exécution GitHub Actions.

Risque en cas de fuite :

- prise de contrôle du pipeline ;

- déploiement malveillant ;

- accès aux environnements.

## 3 Variables d'environnement prévues

### 3.1 Variables générales

NODE_ENV=development | test | production

APP_NAME=TrackNShare

APP_PORT=3000

APP_BASE_URL=http://localhost:3000

FRONTEND_URL=http://localhost:5173

API_PREFIX=api

API_VERSION=v1

Usage :

- configurer l'environnement ;

- définir l'URL front autorisée ;

- définir le port back-end ;

- configurer les URLs dans les emails ou redirections.

### 3.2 Variables d'authentification

JWT_SECRET=replace_me_with_long_random_secret

JWT_EXPIRES_IN=1h

JWT_REFRESH_SECRET=replace_me_with_long_random_refresh_secret

JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

PASSWORD_RESET_TOKEN_EXPIRES_IN=15m

Recommandations :

- secrets longs et aléatoires ;

- valeurs différentes entre dev, test et prod ;

- rotation si fuite suspectée ;

- ne jamais utiliser "secret" ou "password" en production.

### 3.3 Variables base de données

DATABASE_URL=postgresql://user:password@localhost:5432/tracknshare

POSTGRES_USER=tracknshare

POSTGRES_PASSWORD=replace_me

POSTGRES_DB=tracknshare

DATABASE_SSL=false

Recommandations :

- utilisateur BDD dédié ;

- mot de passe fort ;

- accès réseau limité ;

- SSL en production si nécessaire ;

- migrations contrôlées.

### 3.4 Variables Redis

REDIS_URL=redis://localhost:6379

REDIS_HOST=localhost

REDIS_PORT=6379

REDIS_PASSWORD=replace_me_if_needed

REDIS_DB=0

REDIS_TLS=false

Recommandations :

- Redis non exposé publiquement ;

- mot de passe si environnement partagé ;

- préfixes de clés ;

- TTL sur données temporaires.

### 3.5 Variables APIs externes

Steam :

STEAM_PROVIDER_ENABLED=false

STEAM_WEB_API_KEY=replace_me

STEAM_API_BASE_URL=https://api.steampowered.com

STEAM_PARTNER_API_BASE_URL=https://partner.steam-api.com

Epic / EOS :

EPIC_PROVIDER_ENABLED=false

EPIC_CLIENT_ID=replace_me

EPIC_CLIENT_SECRET=replace_me

EPIC_PRODUCT_ID=replace_me

EPIC_DEPLOYMENT_ID=replace_me

EPIC_SANDBOX_ID=replace_me

EPIC_ENVIRONMENT=development

Mock :

MOCK_PROVIDER_ENABLED=true

EXTERNAL_API_MODE=mock

USE_MOCK_PROVIDER=true

### 3.6 Variables rate limiting

RATE_LIMIT_ENABLED=true

RATE_LIMIT_STORE=redis

RATE_LIMIT_LOGIN_TTL=60

RATE_LIMIT_LOGIN_LIMIT=5

RATE_LIMIT_STATS_SYNC_TTL=300

RATE_LIMIT_STATS_SYNC_LIMIT=1

RATE_LIMIT_CHAT_MESSAGE_TTL=60

RATE_LIMIT_CHAT_MESSAGE_LIMIT=20

### 3.7 Variables démo

DEMO_MODE=true

DEMO_SEED_ENABLED=true

DEMO_ACCOUNT_EMAIL=demo@tracknshare.local

DEMO_ACCOUNT_PASSWORD=DemoPassword123!

Attention :

Le mot de passe démo ne doit pas être utilisé comme modèle pour un vrai utilisateur en production.

### 3.8 Variables upload / stockage

UPLOAD_ENABLED=false

UPLOAD_MAX_FILE_SIZE_MB=2

UPLOAD_ALLOWED_MIME_TYPES=image/png,image/jpeg,image/webp

STORAGE_PROVIDER=local

STORAGE_BUCKET=replace_me

STORAGE_ACCESS_KEY=replace_me

STORAGE_SECRET_KEY=replace_me

### 3.9 Variables logs et monitoring

LOG_LEVEL=debug | info | warn | error

LOG_PRETTY=true | false

SENTRY_DSN=replace_me_if_used

MONITORING_ENABLED=false

Règle :

Même en debug, ne jamais logger les secrets.

## 4 Fichiers .env

### 4.1 Fichiers recommandés

Fichiers possibles :

- .env ;

- .env.local ;

- .env.development ;

- .env.test ;

- .env.production ;

- .env.example.

### 4.2 Rôle de chaque fichier

.env

Configuration locale par défaut. Ne doit pas être commité si contient des secrets.

.env.local

Configuration personnelle du développeur. Ne doit jamais être commité.

.env.development

Configuration développement. Peut être commité uniquement si aucune vraie valeur sensible n'est présente.

.env.test

Configuration pour les tests. Peut utiliser des valeurs fictives.

.env.production

Ne doit généralement pas être commité. En production, préférer les variables d'environnement de l'hébergeur.

.env.example

Fichier modèle, commitable, contenant les noms de variables et des valeurs fictives.

### 4.3 Règle Git

Le fichier .gitignore doit contenir :

.env

.env.*

!.env.example

Cela permet d'ignorer tous les fichiers .env sauf .env.example.

## 5 Fichier .env.example recommandé

Le fichier .env.example doit documenter toutes les variables nécessaires sans vraie valeur.

Exemple :

NODE_ENV=development

APP_PORT=3000

FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://tracknshare:replace_me@localhost:5432/tracknshare

REDIS_URL=redis://localhost:6379

JWT_SECRET=replace_me_with_long_random_secret

JWT_EXPIRES_IN=1h

JWT_REFRESH_SECRET=replace_me_with_long_random_refresh_secret

JWT_REFRESH_EXPIRES_IN=7d

STEAM_PROVIDER_ENABLED=false

STEAM_WEB_API_KEY=replace_me

EPIC_PROVIDER_ENABLED=false

EPIC_CLIENT_ID=replace_me

EPIC_CLIENT_SECRET=replace_me

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

DEMO_MODE=true

DEMO_SEED_ENABLED=true

RATE_LIMIT_ENABLED=true

RATE_LIMIT_STORE=redis

LOG_LEVEL=debug

Règle :

Aucune vraie clé ne doit apparaître dans .env.example.

## 6 Séparation front-end / back-end

### 6.1 Variables front-end

Le front-end React peut uniquement recevoir des variables publiques.

Exemples acceptables :

- VITE_API_BASE_URL ;

- VITE_SOCKET_URL ;

- VITE_APP_NAME ;

- VITE_DEMO_MODE.

Exemples :

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000/chat

VITE_APP_NAME=Track'N Share

VITE_DEMO_MODE=true

### 6.2 Variables interdites côté front-end

Ne jamais exposer dans React :

- JWT_SECRET ;

- DATABASE_URL ;

- REDIS_URL ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- ENCRYPTION_KEY ;

- tout token privé.

### 6.3 Règle importante Vite

Avec Vite, les variables préfixées par VITE_ peuvent être exposées au navigateur.

Donc :

Une variable préfixée VITE_ doit être considérée comme publique.

Ne jamais nommer un secret avec VITE_.

## 7 Gestion des secrets dans Docker

### 7.1 Docker Compose développement

Docker Compose peut charger un fichier .env local.

Exemple :

services:

api:

env_file:

- .env

Règles :

- .env local non commité ;

- .env.example commité ;

- ne pas écrire les secrets directement dans docker-compose.yml ;

- ne pas exposer PostgreSQL / Redis publiquement sans nécessité.

### 7.2 Docker production

En production :

- passer les secrets via l'hébergeur ;

- utiliser un secret manager si disponible ;

- éviter les secrets dans l'image Docker ;

- ne pas inclure .env dans l'image ;

- ne pas afficher les variables au build.

### 7.3 Images Docker

Une image Docker ne doit pas contenir :

- fichier .env ;

- clés privées ;

- certificats privés ;

- fichiers de credentials.

## 8 Gestion des secrets dans GitHub

### 8.1 GitHub repository

Règles :

- ne pas commit de secrets ;

- vérifier .gitignore ;

- utiliser secret scanning si disponible ;

- éviter les captures d'écran contenant des secrets ;

- ne pas écrire de secrets dans les issues ou PR.

### 8.2 GitHub Actions

Si CI/CD activé, utiliser GitHub Actions Secrets.

Exemples :

- DATABASE_URL_TEST ;

- DOCKER_REGISTRY_TOKEN ;

- DEPLOY_TOKEN ;

- SENTRY_DSN ;

- SSH_PRIVATE_KEY.

Règles :

- ne pas echo les secrets ;

- limiter les permissions du GITHUB_TOKEN ;

- séparer secrets staging et production ;

- éviter les secrets dans les logs CI.

### 8.3 En cas de secret commité

Procédure :

1. Considérer le secret comme compromis.

2. Révoquer ou régénérer le secret immédiatement.

3. Supprimer la valeur du dépôt.

4. Nettoyer l'historique si nécessaire.

5. Vérifier les logs et accès suspects.

6. Documenter l'incident.

Important :

Supprimer le commit ne suffit pas toujours. Une clé déjà exposée doit être remplacée.

## 9 Gestion par environnement

### 9.1 Développement

Objectif :

- simplicité ;

- valeurs locales ;

- secrets fictifs ou faibles mais non publics ;

- MockProvider activé ;

- logs plus détaillés.

Recommandations :

- .env.local ;

- base locale ;

- Redis local ;

- STEAM_PROVIDER_ENABLED=false ;

- EPIC_PROVIDER_ENABLED=false ;

- EXTERNAL_API_MODE=mock.

### 9.2 Test

Objectif :

- environnement reproductible ;

- données non réelles ;

- secrets fictifs ;

- base de test séparée.

Recommandations :

- DATABASE_URL_TEST ;

- NODE_ENV=test ;

- désactiver emails réels ;

- désactiver APIs externes réelles.

### 9.3 Soutenance / démo

Objectif :

- stabilité ;

- aucune dépendance à des APIs externes ;

- données seedées ;

- sécurité minimale.

Recommandations :

- DEMO_MODE=true ;

- EXTERNAL_API_MODE=mock ;

- MOCK_PROVIDER_ENABLED=true ;

- DEMO_SEED_ENABLED=true ;

- Steam/Epic désactivés ;

- compte démo prêt.

### 9.4 Production

Objectif :

- sécurité renforcée ;

- secrets forts ;

- HTTPS ;

- CORS strict ;

- routes démo désactivées ;

- logs maîtrisés.

Recommandations :

- NODE_ENV=production ;

- DEMO_SEED_ENABLED=false ;

- secrets dans l'hébergeur ;

- Redis protégé ;

- base protégée ;

- JWT secrets longs ;

- SSL / TLS si nécessaire.

## 10 Validation de configuration au démarrage

### 10.1 Pourquoi valider

L'application doit échouer clairement au démarrage si une variable obligatoire manque.

Cela évite :

- erreurs difficiles à diagnostiquer ;

- comportement imprévisible ;

- routes démarrées sans sécurité ;

- provider externe partiellement configuré.

### 10.2 Variables obligatoires MVP

Back-end :

- NODE_ENV ;

- APP_PORT ;

- DATABASE_URL ;

- JWT_SECRET ;

- FRONTEND_URL.

Si Redis utilisé :

- REDIS_URL.

Si Steam activé :

- STEAM_WEB_API_KEY.

Si Epic activé :

- EPIC_CLIENT_ID ;

- EPIC_CLIENT_SECRET ;

- EPIC_PRODUCT_ID ;

- EPIC_DEPLOYMENT_ID.

### 10.3 Recommandation technique

Utiliser un module de configuration NestJS avec validation.

Exemples possibles :

- @nestjs/config ;

- Joi ;

- Zod ;

- validation personnalisée.

Règles :

- vérifier les types ;

- vérifier les URLs ;

- vérifier les booléens ;

- vérifier que les secrets en production ne valent pas replace_me ;

- empêcher le démarrage si config critique absente.

## 11 Rotation des secrets

### 11.1 Définition

La rotation consiste à remplacer un secret par un nouveau.

### 11.2 Quand faire une rotation

Faire une rotation si :

- un secret a été commité ;

- un membre quitte le projet avec accès aux secrets ;

- une clé API est suspectée exposée ;

- un environnement a été compromis ;

- un secret est trop ancien ;

- avant une mise en production.

### 11.3 Rotation JWT

Changer JWT_SECRET invalide les tokens existants.

Effets :

- les utilisateurs devront se reconnecter ;

- les anciens tokens deviennent invalides ;

- prévoir une communication si production.

### 11.4 Rotation base de données

Changer DATABASE_URL ou POSTGRES_PASSWORD nécessite :

- mise à jour de l'environnement ;

- redémarrage de l'application ;

- vérification des migrations ;

- vérification des backups.

### 11.5 Rotation APIs externes

Steam/Epic :

- régénérer la clé depuis le portail provider ;

- mettre à jour l'environnement serveur ;

- redémarrer l'application ;

- vérifier les appels ;

- surveiller les erreurs.

## 12 Secrets et logs

### 12.1 Ce qui ne doit jamais être loggé

- mots de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- clés API ;

- DATABASE_URL complète ;

- REDIS_URL avec mot de passe ;

- EPIC_CLIENT_SECRET ;

- STEAM_WEB_API_KEY ;

- cookies de session ;

- headers Authorization.

### 12.2 Redaction des logs

Les logs doivent masquer les valeurs sensibles.

Exemple :

Authorization: Bearer [REDACTED]

DATABASE_URL: postgresql://tracknshare:[REDACTED]@host/db

STEAM_WEB_API_KEY: [REDACTED]

### 12.3 Logs acceptables

- provider utilisé ;

- code d'erreur ;

- endpoint ;

- userId interne ;

- temps de réponse ;

- statut HTTP ;

- timestamp ;

- fallback utilisé.

## 13 Secrets et Swagger

### 13.1 Risque

Swagger peut afficher des exemples de payloads ou variables si mal configuré.

### 13.2 Règles

- ne jamais mettre de vraie clé API dans un exemple Swagger ;

- ne jamais afficher DATABASE_URL ;

- ne jamais afficher JWT_SECRET ;

- documenter seulement le header Authorization ;

- protéger Swagger en production si nécessaire ;

- désactiver les routes debug ou seed en production.

## 14 Secrets et intégrations externes

### 14.1 Steam

La clé Steam doit être utilisée uniquement côté back-end.

Règles :

- STEAM_WEB_API_KEY dans .env ;

- jamais côté React ;

- jamais dans GitHub ;

- jamais dans Swagger ;

- logs sans clé ;

- provider désactivé si clé absente.

### 14.2 Epic / EOS

Les secrets Epic sont sensibles.

Règles :

- EPIC_CLIENT_SECRET côté back-end uniquement ;

- tokens éventuels chiffrés si stockés ;

- provider désactivé si config incomplète ;

- pas de promesse d'intégration universelle.

### 14.3 MockProvider

Le MockProvider ne doit pas nécessiter de secret externe.

Il doit être fiable pour :

- développement ;

- tests ;

- soutenance ;

- fallback.

## 15 Secrets et base de données

### 15.1 Accès minimum

L'utilisateur PostgreSQL utilisé par l'API doit avoir uniquement les droits nécessaires.

Recommandation :

- un utilisateur pour l'application ;

- un utilisateur séparé pour les migrations si besoin ;

- pas d'utilisateur superadmin en production ;

- accès réseau limité.

### 15.2 Sauvegardes

Les sauvegardes peuvent contenir des données personnelles.

Règles :

- stockage sécurisé ;

- accès limité ;

- suppression selon durée de conservation ;

- pas de sauvegarde partagée publiquement ;

- anonymisation pour jeux de données de test.

## 16 Secrets et PWA / cache

### 16.1 Risque

La PWA peut cacher des ressources ou états côté navigateur.

### 16.2 Règles

- ne jamais mettre de secrets dans le bundle front-end ;

- ne jamais cacher de réponse contenant un secret ;

- nettoyer les données privées au logout ;

- ne pas inclure .env dans les assets ;

- vérifier que VITE_ ne contient que des valeurs publiques.

## 17 Procédure d'onboarding développeur

### 17.1 Étapes

1. Cloner le dépôt.

2. Copier .env.example vers .env.local.

3. Remplir les valeurs locales nécessaires.

4. Lancer Docker Compose.

5. Vérifier que la base et Redis répondent.

6. Lancer les migrations.

7. Lancer les seeders si mode démo.

8. Ne jamais demander une vraie clé via chat public.

### 17.2 Transmission des secrets

Les secrets ne doivent pas être envoyés par :

- message public ;

- capture d'écran ;

- document Drive ouvert ;

- commit Git.

Préférer :

- gestionnaire de mots de passe ;

- secret manager ;

- variables d'environnement de l'hébergeur ;

- partage temporaire sécurisé si nécessaire.

## 18 Procédure en cas de fuite de secret

### 18.1 Détection

Exemples :

- secret vu dans GitHub ;

- secret affiché dans logs ;

- secret partagé dans un document ;

- alerte GitHub secret scanning ;

- usage anormal d'une API externe ;

- accès suspect à la base.

### 18.2 Réaction immédiate

1. Révoquer le secret si possible.

2. Générer un nouveau secret.

3. Mettre à jour l'environnement.

4. Redémarrer les services concernés.

5. Vérifier les logs d'accès.

6. Supprimer la fuite visible.

7. Nettoyer l'historique si nécessaire.

8. Documenter l'incident.

### 18.3 Priorités selon secret

JWT_SECRET compromis :

- rotation immédiate ;

- invalidation des sessions ;

- reconnexion utilisateurs.

DATABASE_URL compromis :

- changer mot de passe DB ;

- vérifier accès ;

- auditer les données.

STEAM_WEB_API_KEY compromis :

- régénérer clé ;

- vérifier quotas et usages.

EPIC_CLIENT_SECRET compromis :

- révoquer secret ;

- vérifier applications liées.

## 19 Checklist .gitignore

Le fichier .gitignore doit contenir :

# Environment files

.env

.env.*

!.env.example

# Logs

logs

*.log

npm-debug.log*

yarn-debug.log*

yarn-error.log*

pnpm-debug.log*

# Build outputs

dist

build

coverage

# Local files

.DS_Store

*.local

# Credentials

*.pem

*.key

*.crt

credentials.json

service-account.json

## 20 Checklist sécurité des secrets MVP

- .env n'est pas commité.

- .env.example existe et ne contient que des valeurs fictives.

- JWT_SECRET est obligatoire au démarrage.

- DATABASE_URL n'est pas exposé côté front.

- REDIS_URL n'est pas exposé côté front.

- STEAM_WEB_API_KEY est côté back-end uniquement.

- EPIC_CLIENT_SECRET est côté back-end uniquement.

- Les variables VITE_ sont uniquement publiques.

- Les logs masquent les headers Authorization.

- Swagger ne contient aucun secret réel.

- Docker n'intègre pas le fichier .env dans l'image.

- GitHub Actions utilise des secrets dédiés si CI/CD.

- Les routes démo sont désactivables en production.

- Les secrets sont différents entre dev, test et production.

- Une procédure de rotation existe.

- Une procédure de fuite de secret existe.

## 21 Risques et solutions

### 21.1 Risque : secret commité dans GitHub

Impact : compromission immédiate du service associé.

Solution : .gitignore, .env.example, secret scanning, rotation immédiate.

### 21.2 Risque : clé API exposée côté front-end

Impact : abus de quota et perte de contrôle.

Solution : aucune clé externe dans React, appels uniquement via NestJS.

### 21.3 Risque : JWT_SECRET faible

Impact : tokens falsifiables.

Solution : secret long, aléatoire, différent par environnement.

### 21.4 Risque : logs contenant des tokens

Impact : vol de session.

Solution : redaction automatique des headers sensibles.

### 21.5 Risque : Redis exposé

Impact : lecture ou modification du cache et des rate limits.

Solution : réseau privé, mot de passe, pas de secrets en clair.

### 21.6 Risque : .env inclus dans une image Docker

Impact : fuite de toutes les variables.

Solution : .dockerignore, secrets fournis au runtime, pas au build.

### 21.7 Risque : secrets identiques en dev et production

Impact : une fuite locale compromet la production.

Solution : secrets distincts par environnement.

## 22 Plan d'implémentation recommandé

Phase 1 — Base MVP

- créer .env.example ;

- ajouter .env au .gitignore ;

- configurer @nestjs/config ;

- valider les variables obligatoires ;

- utiliser JWT_SECRET depuis env ;

- utiliser DATABASE_URL depuis env.

Phase 2 — Sécurité des providers

- ajouter STEAM_PROVIDER_ENABLED ;

- ajouter STEAM_WEB_API_KEY côté back ;

- ajouter EPIC_PROVIDER_ENABLED ;

- désactiver providers si secrets absents ;

- utiliser MockProvider par défaut.

Phase 3 — Docker et soutenance

- configurer Docker Compose avec env_file ;

- vérifier que .env n'est pas dans l'image ;

- ajouter DEMO_MODE ;

- ajouter EXTERNAL_API_MODE=mock.

Phase 4 — CI/CD

- utiliser GitHub Actions Secrets ;

- éviter les secrets dans logs ;

- séparer staging et production ;

- limiter les permissions.

Phase 5 — Production

- utiliser les variables de l'hébergeur ;

- activer HTTPS ;

- désactiver seed ;

- secrets forts ;

- rotation ;

- monitoring.

## 23 Critères d'acceptation

La gestion des secrets et variables d'environnement est considérée correcte si :

- aucun secret réel n'est présent dans le dépôt ;

- .env.example documente les variables nécessaires ;

- les vraies valeurs sont stockées dans .env local ou dans l'environnement de déploiement ;

- le front-end ne contient que des variables publiques ;

- le back-end refuse de démarrer si une variable critique manque ;

- les clés Steam/Epic ne sont jamais exposées au navigateur ;

- les logs masquent les secrets ;

- Docker n'intègre pas de secrets dans l'image ;

- les secrets sont différents entre environnements ;

- une procédure de rotation existe ;

- une procédure de fuite existe ;

- le mode mock fonctionne sans clé externe ;

- la soutenance peut être réalisée sans exposer de secrets.

## 24 Conclusion

La gestion des secrets est un point critique pour Track'N Share.

Le projet utilise plusieurs composants sensibles : JWT, PostgreSQL, Redis, Steam, Epic/EOS, Docker, CI/CD et éventuellement email ou stockage de fichiers. Tous ces éléments nécessitent une séparation claire entre configuration publique et secrets privés.

Pour le MVP, la priorité est simple : aucun secret dans GitHub, aucun secret dans le front-end, un .env.example propre, des variables obligatoires validées, des providers externes désactivables et un MockProvider fonctionnel pour la soutenance.

Avant une production réelle, il faudra renforcer la stratégie avec rotation régulière, secrets distincts par environnement, monitoring, gestionnaire de secrets et procédures d'incident.
