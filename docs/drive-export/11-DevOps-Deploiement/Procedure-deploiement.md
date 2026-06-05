# PROCÉDURE DE DÉPLOIEMENT

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la procédure de déploiement prévue pour Track'N Share.

Il explique comment passer du code source à une application lancée et utilisable, en local, en environnement de démonstration ou dans une future production.

La procédure couvre :

- les prérequis ;

- la préparation des variables d'environnement ;

- le lancement avec Docker ;

- les migrations de base de données ;

- les seeders de démonstration ;

- les vérifications après déploiement ;

- la procédure spéciale soutenance ;

- la stratégie de rollback ;

- les règles de sécurité avant production.

## 1 Vue d'ensemble

### 1.1 Objectif du déploiement

Le déploiement doit permettre de rendre Track'N Share accessible dans un environnement donné.

Pour le MVP, l'objectif principal est de pouvoir lancer l'application de manière fiable en local ou en démonstration avec :

- front-end React/PWA ;

- back-end NestJS ;

- PostgreSQL ;

- Redis ;

- données seedées ;

- MockProvider ;

- Swagger ;

- Socket.io ;

- mode démo.

### 1.2 Environnements concernés

Les environnements prévus sont :

Développement local

Utilisé par les développeurs pendant la réalisation du projet.

Test

Utilisé pour vérifier les fonctionnalités, les migrations, les guards, les endpoints et les comportements critiques.

Soutenance / démonstration

Utilisé pour présenter l'application avec des données stables, sans dépendre de Steam, Epic ou d'une API externe.

Pré-production future

Environnement intermédiaire avant production, utile si le projet est poursuivi.

Production future

Environnement accessible à de vrais utilisateurs, nécessitant une sécurité renforcée.

### 1.3 Stratégie recommandée

Pour le MVP :

- déploiement local avec Docker Compose ;

- PostgreSQL et Redis en conteneurs ;

- MockProvider activé ;

- données de démonstration seedées ;

- APIs Steam/Epic désactivées ;

- mode démo activé ;

- routes sensibles contrôlées.

Pour une production future :

- build optimisé front et back ;

- secrets injectés par l'hébergeur ;

- HTTPS ;

- CORS strict ;

- Swagger protégé ;

- routes de seed désactivées ;

- logs et monitoring ;

- sauvegardes et rollback.

## 2 Prérequis techniques

### 2.1 Prérequis généraux

Avant de déployer Track'N Share, il faut disposer de :

- Git ;

- Docker ;

- Docker Compose ;

- Node.js si lancement hors Docker ;

- npm, pnpm ou yarn selon choix projet ;

- accès au dépôt GitHub ;

- fichier .env configuré ;

- navigateur moderne ;

- accès réseau local disponible.

### 2.2 Versions recommandées

Versions recommandées :

- Node.js : 20 LTS ou version compatible ;

- Docker : version récente stable ;

- Docker Compose : v2 ;

- PostgreSQL : 16 ou compatible ;

- Redis : 7 ou compatible.

### 2.3 Services nécessaires

Services nécessaires au MVP :

- front-end React/PWA ;

- back-end NestJS ;

- PostgreSQL ;

- Redis.

Services optionnels :

- Nginx ;

- outil de monitoring ;

- service email ;

- APIs Steam/Epic ;

- stockage d'avatars.

## 3 Préparation du dépôt

### 3.1 Récupérer le code

Commande indicative :

git clone <url-du-repository>

cd track-n-share

### 3.2 Vérifier la structure attendue

Structure recommandée :

track-n-share/

frontend/

backend/

docker-compose.yml

.env.example

README.md

### 3.3 Vérifier les branches

Branches possibles :

- main : version stable ;

- dev : version de développement ;

- feature/* : branches de fonctionnalités.

Pour la soutenance, il est recommandé d'utiliser une branche stable ou un tag dédié.

Exemple :

git checkout main

git pull origin main

## 4 Préparation des variables d'environnement

### 4.1 Copier le fichier exemple

Commande :

cp .env.example .env

### 4.2 Remplir les valeurs obligatoires

Variables minimales :

NODE_ENV=development

APP_PORT=3000

FRONTEND_URL=http://localhost:5173

VITE_API_BASE_URL=http://localhost:3000/api

VITE_SOCKET_URL=http://localhost:3000/chat

DATABASE_URL=postgresql://tracknshare:replace_me@postgres:5432/tracknshare

REDIS_URL=redis://redis:6379

JWT_SECRET=replace_me_with_long_random_secret

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

DEMO_MODE=true

DEMO_SEED_ENABLED=true

### 4.3 Configuration recommandée pour soutenance

Pour une démonstration stable :

DEMO_MODE=true

DEMO_SEED_ENABLED=true

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

SWAGGER_ENABLED=true

LOG_LEVEL=info

### 4.4 Points de vigilance

- ne jamais commiter .env ;

- ne jamais mettre de vraie clé dans .env.example ;

- ne jamais mettre JWT_SECRET côté front ;

- ne jamais utiliser une clé Steam/Epic dans React ;

- vérifier que VITE_* ne contient aucun secret ;

- vérifier que DEMO_SEED_ENABLED=false en production.

## 5 Déploiement local avec Docker Compose

### 5.1 Lancer les services

Commande :

docker compose up --build

ou en arrière-plan :

docker compose up -d --build

### 5.2 Services attendus

Après lancement, les services suivants doivent être actifs :

- frontend ;

- backend ;

- postgres ;

- redis.

### 5.3 Vérifier les conteneurs

Commande :

docker compose ps

Résultat attendu :

- les services sont en état running ;

- PostgreSQL est healthy si healthcheck configuré ;

- le backend ne redémarre pas en boucle ;

- le frontend répond sur son port.

### 5.4 Consulter les logs

Tous les services :

docker compose logs -f

Back-end :

docker compose logs -f backend

Front-end :

docker compose logs -f frontend

PostgreSQL :

docker compose logs -f postgres

Redis :

docker compose logs -f redis

## 6 Installation hors Docker

### 6.1 Cas d'usage

Le lancement hors Docker peut être utile si :

- les développeurs veulent utiliser PostgreSQL local ;

- le front et le back sont lancés séparément ;

- Docker n'est pas disponible.

### 6.2 Installation back-end

Commandes indicatives :

cd backend

npm install

npm run start:dev

ou selon gestionnaire :

pnpm install

pnpm start:dev

### 6.3 Installation front-end

Commandes indicatives :

cd frontend

npm install

npm run dev

ou :

pnpm install

pnpm dev

### 6.4 Attention

Hors Docker, DATABASE_URL et REDIS_URL doivent pointer vers localhost :

DATABASE_URL=postgresql://tracknshare:password@localhost:5432/tracknshare

REDIS_URL=redis://localhost:6379

Dans Docker, elles doivent pointer vers les noms de services :

DATABASE_URL=postgresql://tracknshare:password@postgres:5432/tracknshare

REDIS_URL=redis://redis:6379

## 7 Migrations de base de données

### 7.1 Objectif

Les migrations créent ou mettent à jour la structure de la base de données.

Elles sont nécessaires avant d'utiliser l'application.

### 7.2 Quand lancer les migrations

Lancer les migrations :

- après création de la base ;

- après modification du schéma ;

- après récupération d'une nouvelle version du projet ;

- avant un déploiement ;

- avant la soutenance si la base est neuve.

### 7.3 Commandes indicatives

Avec Docker :

docker compose exec backend npm run migration:run

Avec Prisma si utilisé :

docker compose exec backend npx prisma migrate deploy

En développement Prisma :

docker compose exec backend npx prisma migrate dev

Avec TypeORM si utilisé :

docker compose exec backend npm run typeorm:migration:run

### 7.4 Vérification

Après migration :

- la base contient les tables attendues ;

- le back-end démarre sans erreur ;

- les endpoints liés à la base répondent ;

- aucun message d'erreur de schéma n'apparaît dans les logs.

## 8 Seeders et données de démonstration

### 8.1 Objectif

Les seeders insèrent des données fictives pour tester et présenter le projet.

Données attendues :

- utilisateurs ;

- profils ;

- jeux ;

- comptes de jeu mockés ;

- statistiques ;

- saisons ;

- leaderboards ;

- équipes ;

- messages ;

- notifications éventuelles.

### 8.2 Commandes indicatives

Avec Docker :

docker compose exec backend npm run seed

ou :

docker compose exec backend npm run seed:demo

Selon ORM :

docker compose exec backend npx prisma db seed

### 8.3 Compte démo recommandé

Compte démo :

- email : demo@tracknshare.local ;

- mot de passe : défini dans DEMO_ACCOUNT_PASSWORD ;

- rôle : PLAYER ;

- profil complet ;

- compte mocké lié ;

- statistiques saison active ;

- équipe ;

- messages de chat.

### 8.4 Règles de sécurité

- ne pas utiliser de vrais emails ;

- ne pas utiliser de vraies identités ;

- ne pas donner le rôle ADMIN au compte démo public ;

- désactiver les seeders en production ;

- documenter les données fictives.

## 9 Vérifications après déploiement

### 9.1 Vérifier l'API

URL locale recommandée :

http://localhost:3000/api

Healthcheck :

GET http://localhost:3000/api/health

Résultat attendu :

- l'API répond ;

- status ok ;

- base connectée ;

- Redis connecté si healthcheck détaillé.

### 9.2 Vérifier Swagger

URL recommandée :

http://localhost:3000/api/docs

À vérifier :

- Swagger s'ouvre ;

- les endpoints sont visibles ;

- l'authentification Bearer est configurée ;

- aucun secret n'apparaît dans la documentation.

### 9.3 Vérifier le front-end

URL locale recommandée :

http://localhost:5173

À vérifier :

- page d'accueil visible ;

- navigation fonctionnelle ;

- appel API possible ;

- erreurs CORS absentes ;

- mode démo visible si activé.

### 9.4 Vérifier l'authentification

Étapes :

1. Ouvrir le front.

2. Se connecter avec le compte démo.

3. Vérifier la redirection vers dashboard.

4. Vérifier que GET /auth/me fonctionne.

5. Se déconnecter.

6. Vérifier que le dashboard n'est plus accessible.

### 9.5 Vérifier les statistiques

À vérifier :

- dashboard affiché ;

- stats présentes ;

- score calculé ;

- K/D et winrate cohérents ;

- date de dernière synchronisation affichée ;

- MockProvider utilisé si mode démo.

### 9.6 Vérifier les leaderboards

À vérifier :

- leaderboard solo rempli ;

- leaderboard équipe rempli si prévu ;

- tri par score ;

- joueurs éligibles seulement ;

- saisons archivées accessibles.

### 9.7 Vérifier les équipes et le chat

À vérifier :

- équipe du compte démo visible ;

- membres affichés ;

- messages existants visibles ;

- Socket.io connecté ;

- envoi d'un message possible ;

- non-membre refusé si test disponible.

## 10 Procédure spéciale soutenance

### 10.1 Objectif

La soutenance doit pouvoir se dérouler sans dépendre d'une API externe réelle.

L'application doit fonctionner avec :

- Docker ;

- PostgreSQL local ;

- Redis local ;

- MockProvider ;

- données seedées ;

- compte démo.

### 10.2 Préparation avant soutenance

Avant la présentation :

- vérifier Docker installé ;

- vérifier .env ;

- vérifier EXTERNAL_API_MODE=mock ;

- vérifier DEMO_MODE=true ;

- vérifier DEMO_SEED_ENABLED=true ;

- lancer docker compose up --build ;

- lancer migrations ;

- lancer seed demo ;

- tester compte démo ;

- tester dashboard ;

- tester leaderboard ;

- tester équipe et chat ;

- vérifier Swagger si utilisé.

### 10.3 Commandes soutenance

Commandes indicatives :

docker compose down

docker compose up -d --build

docker compose exec backend npm run migration:run

docker compose exec backend npm run seed:demo

Puis ouvrir :

http://localhost:5173

Swagger :

http://localhost:3000/api/docs

### 10.4 Scénario de démonstration

Scénario recommandé :

1. Ouvrir la landing page.

2. Se connecter au compte démo.

3. Montrer le dashboard.

4. Montrer les statistiques mockées.

5. Montrer le score et le rang.

6. Montrer le leaderboard solo.

7. Montrer une équipe.

8. Montrer le chat d'équipe.

9. Montrer les saisons archivées.

10. Expliquer que Steam/Epic sont documentés comme intégrations futures.

11. Montrer Swagger si besoin.

### 10.5 Plan B soutenance

Si un service ne fonctionne pas :

- consulter les logs backend ;

- relancer docker compose up -d ;

- vérifier .env ;

- relancer seed ;

- utiliser captures d'écran préparées en secours ;

- expliquer le fallback MockProvider.

## 11 Déploiement en environnement de test

### 11.1 Objectif

L'environnement de test sert à vérifier que le projet fonctionne sans casser les données de développement.

### 11.2 Configuration recommandée

NODE_ENV=test

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

MAIL_ENABLED=false

LOG_LEVEL=error

DATABASE_URL=base_de_test

REDIS_URL=redis_test

### 11.3 Étapes

1. Créer base de test.

2. Charger variables .env.test.

3. Lancer migrations.

4. Lancer tests automatisés.

5. Nettoyer données après test.

## 12 Déploiement production future

### 12.1 Objectif

La production future concerne une version accessible à de vrais utilisateurs.

Elle nécessite des exigences plus fortes que la soutenance.

### 12.2 Étapes générales

1. Choisir un hébergeur.

2. Configurer PostgreSQL production.

3. Configurer Redis production.

4. Configurer variables d'environnement dans l'hébergeur.

5. Build du back-end.

6. Build du front-end.

7. Lancer migrations production.

8. Vérifier healthcheck.

9. Vérifier CORS et HTTPS.

10. Vérifier logs et monitoring.

11. Désactiver les routes démo sensibles.

12. Tester login et dashboard.

### 12.3 Configuration production recommandée

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

### 12.4 Points obligatoires avant production

- HTTPS activé ;

- CORS strict ;

- secrets forts ;

- pas de secret dans le dépôt ;

- Swagger protégé ou désactivé ;

- seed désactivé ;

- logs sans secrets ;

- PostgreSQL non public ;

- Redis non public ;

- politique de confidentialité disponible ;

- procédure de suppression ou anonymisation prévue.

## 13 Déploiement front-end

### 13.1 Build front

Commande indicative :

cd frontend

npm run build

Résultat attendu :

- dossier dist généré ;

- assets statiques prêts ;

- PWA buildée si activée.

### 13.2 Variables front au build

Attention :

Les variables VITE_* sont intégrées au build.

Il faut donc vérifier avant build :

- VITE_API_BASE_URL ;

- VITE_SOCKET_URL ;

- VITE_DEMO_MODE ;

- absence de secrets VITE_*.

### 13.3 Hébergement front

Options possibles :

- Nginx dans Docker ;

- plateforme statique ;

- hébergement cloud ;

- reverse proxy.

## 14 Déploiement back-end

### 14.1 Build back

Commande indicative :

cd backend

npm run build

Résultat attendu :

- dossier dist généré ;

- application prête à être lancée avec node dist/main.js.

### 14.2 Lancement back production

Commande :

node dist/main.js

ou via Docker :

docker compose -f docker-compose.prod.yml up -d backend

### 14.3 Vérifications back

- logs sans erreur ;

- connexion PostgreSQL ;

- connexion Redis ;

- Swagger selon configuration ;

- /health répond ;

- routes privées protégées.

## 15 Rollback

### 15.1 Objectif

Le rollback permet de revenir à une version stable si le déploiement échoue.

### 15.2 Cas nécessitant un rollback

- back-end ne démarre pas ;

- front inaccessible ;

- migration cassée ;

- login impossible ;

- dashboard cassé ;

- perte de connexion base ;

- bug critique de sécurité ;

- seed ou migration incorrecte.

### 15.3 Rollback code

Stratégie simple :

- conserver la version précédente ;

- revenir au tag ou commit stable ;

- rebuild l'image ;

- redéployer.

Commandes indicatives :

git checkout <tag-stable>

docker compose up -d --build

### 15.4 Rollback base de données

La base est plus délicate.

Recommandations :

- sauvegarder avant migration production ;

- éviter les migrations destructives ;

- documenter chaque migration ;

- prévoir une migration inverse si possible ;

- tester les migrations sur une base de test.

### 15.5 Rollback soutenance

En soutenance, le rollback le plus simple est :

- arrêter les conteneurs ;

- supprimer les volumes si nécessaire ;

- relancer migrations ;

- relancer seed démo.

Commandes :

docker compose down -v

docker compose up -d --build

docker compose exec backend npm run migration:run

docker compose exec backend npm run seed:demo

Attention :

Cette procédure supprime les données locales.

## 16 Sauvegardes

### 16.1 Objectif

Les sauvegardes permettent de récupérer les données en cas d'erreur ou d'incident.

### 16.2 Sauvegarde PostgreSQL

Commande indicative :

docker compose exec postgres pg_dump -U tracknshare tracknshare > backup.sql

### 16.3 Restauration PostgreSQL

Commande indicative :

docker compose exec -T postgres psql -U tracknshare tracknshare < backup.sql

### 16.4 Règles de sécurité

- ne pas commiter les backups ;

- ne pas partager de backups contenant des données personnelles ;

- anonymiser les données si utilisées en test ;

- protéger les backups en production.

## 17 Gestion des erreurs de déploiement

### 17.1 Erreur CORS

Symptôme :

Le front ne peut pas appeler l'API.

À vérifier :

- FRONTEND_URL ;

- CORS_ORIGIN ;

- VITE_API_BASE_URL ;

- protocole http/https ;

- port exposé.

### 17.2 Erreur database connection

Symptôme :

Le back ne démarre pas ou endpoints 500.

À vérifier :

- DATABASE_URL ;

- conteneur postgres ;

- mot de passe ;

- nom de base ;

- host postgres vs localhost ;

- migrations.

### 17.3 Erreur Redis

À vérifier :

- REDIS_URL ;

- conteneur redis ;

- réseau Docker ;

- mot de passe si utilisé.

### 17.4 Erreur JWT

À vérifier :

- JWT_SECRET défini ;

- même configuration entre redémarrages ;

- token expiré ;

- front nettoie bien l'état si 401.

### 17.5 Erreur API externe

À vérifier :

- EXTERNAL_API_MODE ;

- provider activé ou non ;

- clé Steam/Epic ;

- fallback mock ;

- logs provider.

## 18 Sécurité du déploiement

### 18.1 Règles obligatoires

- aucun secret dans GitHub ;

- aucun secret dans le front ;

- aucun secret dans Dockerfile ;

- .env non commité ;

- .env.example uniquement avec valeurs fictives ;

- logs sans secrets ;

- PostgreSQL et Redis non exposés en production ;

- Swagger protégé ou désactivé en production ;

- routes de seed désactivées en production.

### 18.2 Checklist sécurité avant lancement

- JWT_SECRET fort ;

- DATABASE_URL protégée ;

- REDIS_URL protégée ;

- CORS restreint ;

- rate limiting activé ;

- HELMET_ENABLED=true ;

- DEMO_SEED_ENABLED=false en production ;

- LOG_LEVEL pas trop verbeux ;

- UPLOAD_ENABLED=false si upload non sécurisé ;

- Steam/Epic activés seulement si configurés.

## 19 Documentation à mettre à jour après déploiement

Après un déploiement réel ou une soutenance, mettre à jour :

- README ;

- Variables-environnement ;

- Configuration-Docker ;

- Procedure-deploiement ;

- Lien-Swagger ;

- Monitoring-logs ;

- CI-CD-pipeline si automatisation ;

- Politique-securite si changements importants.

## 20 Checklist déploiement local

Avant lancement :

- dépôt à jour ;

- .env présent ;

- Docker lancé ;

- ports disponibles ;

- variables mock/démo configurées ;

- PostgreSQL et Redis prévus.

Pendant lancement :

- docker compose up --build ;

- vérifier conteneurs ;

- consulter logs ;

- lancer migrations ;

- lancer seed.

Après lancement :

- front accessible ;

- back accessible ;

- Swagger accessible ;

- healthcheck ok ;

- login démo ok ;

- dashboard ok ;

- leaderboard ok ;

- chat ok.

## 21 Checklist pré-production

- HTTPS actif ;

- CORS production ;

- secrets production forts ;

- base et Redis protégés ;

- seed désactivé ;

- Swagger protégé ;

- logs configurés ;

- monitoring prêt ;

- backups prêts ;

- migrations testées ;

- rollback prévu ;

- politique de confidentialité prête ;

- conformité RGPD relue ;

- tests P0 passés ;

- aucun secret dans le dépôt.

## 22 Plan d'amélioration futur

Évolutions possibles :

- pipeline GitHub Actions ;

- déploiement automatique staging ;

- healthcheck post-déploiement automatisé ;

- rollback automatique ;

- migrations contrôlées en CI/CD ;

- monitoring Sentry ou équivalent ;

- logs centralisés ;

- secrets manager ;

- sauvegardes automatiques ;

- environnement de préproduction.

## 23 Critères d'acceptation

La procédure de déploiement est considérée complète si :

- un développeur peut lancer le projet à partir du dépôt ;

- les variables nécessaires sont identifiées ;

- Docker Compose permet de lancer les services ;

- les migrations sont documentées ;

- les seeders sont documentés ;

- le mode soutenance fonctionne sans APIs externes ;

- les vérifications post-déploiement sont claires ;

- les erreurs fréquentes sont documentées ;

- une stratégie de rollback existe ;

- les règles de sécurité pré-production sont listées ;

- la procédure peut être suivie par une personne autre que l'équipe projet.

## 24 Conclusion

La procédure de déploiement de Track'N Share doit garantir que le projet est lançable, vérifiable et démontrable de manière fiable.

Pour le MVP, le déploiement repose principalement sur Docker Compose, PostgreSQL, Redis, le back-end NestJS, le front-end React/PWA, les migrations et les seeders de démonstration.

La stratégie recommandée pour la soutenance est de fonctionner en mode mock, avec des données seedées et sans dépendance à Steam ou Epic.

Pour une production future, la procédure devra être renforcée avec HTTPS, secrets forts, monitoring, sauvegardes, CI/CD, protection Swagger, désactivation des routes de démo et contrôle strict des variables d'environnement.
