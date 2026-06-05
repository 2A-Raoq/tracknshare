# ARCHITECTURE DES DOSSIERS

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit l'architecture recommandée des dossiers du projet Track'N Share.

Il a pour objectif de préparer une structure de repository claire, maintenable et adaptée au développement du MVP. Même si le développement n'a pas encore commencé, cette organisation permet d'anticiper la séparation front-end / back-end, les modules métier, les tests, Docker, la documentation technique et les futures évolutions.

L'architecture proposée doit rester pragmatique : elle doit aider l'équipe à avancer vite sans perdre en lisibilité.

## 1 Principes généraux

### 1.1 Séparation des responsabilités

Le projet doit être organisé de façon à séparer clairement :

- le front-end React/PWA ;

- le back-end NestJS ;

- la base de données et les migrations ;

- la configuration Docker ;

- les tests ;

- la documentation ;

- les scripts utiles ;

- les fichiers de configuration.

Chaque dossier doit avoir un rôle identifiable.

### 1.2 Lisibilité

Un nouveau développeur doit pouvoir comprendre rapidement :

- où se trouve le front-end ;

- où se trouve l'API ;

- où se trouvent les modules métier ;

- où se trouvent les types ;

- où se trouvent les tests ;

- comment lancer le projet.

### 1.3 Évolutivité

L'architecture doit permettre d'ajouter facilement :

- de nouveaux endpoints ;

- de nouvelles features front-end ;

- de nouveaux providers externes ;

- de nouveaux modules métier ;

- de nouveaux tests ;

- de nouveaux documents techniques.

## 2 Structure globale recommandée du repository

Structure cible :

track-n-share/

frontend/

backend/

docs/

scripts/

docker-compose.yml

docker-compose.override.yml

docker-compose.prod.yml

.env.example

.gitignore

.dockerignore

README.md

2.1 frontend/

Contient l'application React / TypeScript / PWA.

Responsabilités :

- interface utilisateur ;

- pages ;

- composants ;

- appels API ;

- connexion Socket.io ;

- gestion de l'état front ;

- routing ;

- PWA ;

- responsive design.

2.2 backend/

Contient l'API NestJS.

Responsabilités :

- authentification ;

- autorisations ;

- API REST ;

- Socket.io ;

- logique métier ;

- accès PostgreSQL ;

- accès Redis ;

- providers Steam / Epic / Mock ;

- jobs d'archivage ;

- Swagger ;

- sécurité.

2.3 docs/

Contient éventuellement des documents techniques versionnés dans le repository.

Attention :

La documentation principale du projet reste dans Google Drive. Le dossier docs/ du repository peut contenir des documents courts utiles aux développeurs, comme une documentation d'installation ou des notes techniques.

2.4 scripts/

Contient les scripts utilitaires.

Exemples :

- scripts de setup ;

- scripts de seed ;

- scripts de reset local ;

- scripts de vérification ;

- scripts de backup local.

## 3 Structure front-end recommandée

### 3.1 Vue d'ensemble

Structure recommandée :

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

main.tsx

App.tsx

index.html

package.json

tsconfig.json

vite.config.ts

Dockerfile

3.2 public/

Contient les fichiers statiques publics.

Exemples :

- favicon ;

- manifest PWA ;

- icônes PWA ;

- robots.txt si nécessaire ;

- images statiques publiques.

Règles :

- ne jamais mettre de secret dans public/ ;

- éviter d'y mettre des données privées ;

- utiliser public/ uniquement pour des ressources publiques.

3.3 src/assets/

Contient les ressources utilisées dans l'application.

Exemples :

- images ;

- illustrations ;

- logos ;

- icônes locales ;

- placeholders.

3.4 src/components/

Contient les composants UI réutilisables et génériques.

Exemples :

- Button ;

- Card ;

- Modal ;

- Avatar ;

- Badge ;

- Loader ;

- ErrorMessage ;

- EmptyState ;

- Table ;

- Tabs.

Règle :

Un composant générique ne doit pas contenir de logique métier forte.

3.5 src/features/

Contient les fonctionnalités métier du front-end.

Structure recommandée :

src/features/

auth/

dashboard/

profile/

games/

stats/

leaderboard/

teams/

chat/

seasons/

notifications/

settings/

demo/

Chaque feature peut contenir :

- components/ ;

- hooks/ ;

- services/ ;

- types.ts ;

- constants.ts ;

- utils.ts.

Exemple :

features/teams/

components/

TeamCard.tsx

TeamMembersList.tsx

TeamInvitePanel.tsx

hooks/

useTeam.ts

useTeamInvitations.ts

services/

teams-api.ts

types.ts

constants.ts

3.6 src/hooks/

Contient les hooks globaux réutilisables.

Exemples :

- useAuth ;

- useCurrentUser ;

- useDebounce ;

- useSocket ;

- useOnlineStatus ;

- usePagination.

3.7 src/layouts/

Contient les layouts de pages.

Exemples :

- PublicLayout ;

- AppLayout ;

- DashboardLayout ;

- AuthLayout ;

- SettingsLayout.

3.8 src/pages/

Contient les pages principales liées au routing.

Exemples :

- HomePage ;

- LoginPage ;

- RegisterPage ;

- DashboardPage ;

- ProfilePage ;

- LeaderboardPage ;

- TeamPage ;

- SettingsPage ;

- NotFoundPage.

3.9 src/router/

Contient la configuration des routes front-end.

Exemples :

- routes.tsx ;

- protected-route.tsx ;

- public-route.tsx.

3.10 src/services/

Contient les services techniques front-end.

Exemples :

- api-client.ts ;

- auth-api.ts ;

- socket-client.ts ;

- storage-service.ts ;

- pwa-service.ts.

Règle :

Les appels HTTP doivent être centralisés et ne pas être dispersés dans tous les composants.

3.11 src/stores/

Contient la gestion d'état globale.

Si Valtio est utilisé :

- auth-store.ts ;

- user-store.ts ;

- notification-store.ts ;

- socket-store.ts ;

- ui-store.ts.

Règle :

Ne pas tout mettre dans un seul store global trop gros.

3.12 src/types/

Contient les types globaux front-end.

Exemples :

- api.types.ts ;

- user.types.ts ;

- stats.types.ts ;

- team.types.ts ;

- common.types.ts.

3.13 src/utils/

Contient les fonctions utilitaires.

Exemples :

- format-date.ts ;

- format-score.ts ;

- calculate-ratio.ts ;

- normalize-error.ts ;

- storage-keys.ts.

## 4 Structure back-end recommandée

### 4.1 Vue d'ensemble

Structure recommandée :

backend/

src/

app.module.ts

main.ts

config/

common/

modules/

database/

providers/

jobs/

health/

test/

package.json

tsconfig.json

Dockerfile

4.2 src/config/

Contient la configuration de l'application.

Exemples :

- app.config.ts ;

- database.config.ts ;

- redis.config.ts ;

- jwt.config.ts ;

- providers.config.ts ;

- validation.schema.ts.

Règles :

- toutes les variables d'environnement doivent être centralisées ;

- l'application doit refuser de démarrer si une variable critique manque ;

- ne jamais exposer les secrets dans les logs.

4.3 src/common/

Contient les éléments transverses.

Structure recommandée :

common/

decorators/

filters/

guards/

interceptors/

pipes/

dto/

types/

constants/

utils/

Exemples :

- current-user.decorator.ts ;

- roles.decorator.ts ;

- http-exception.filter.ts ;

- response.interceptor.ts ;

- jwt-auth.guard.ts ;

- roles.guard.ts ;

- pagination.dto.ts.

4.4 src/modules/

Contient les modules métier NestJS.

Modules recommandés :

modules/

auth/

users/

profiles/

games/

game-accounts/

stats/

leaderboards/

teams/

team-invitations/

chat/

seasons/

notifications/

admin/

Chaque module suit une structure claire.

Exemple :

auth/

auth.module.ts

auth.controller.ts

auth.service.ts

dto/

login.dto.ts

register.dto.ts

strategies/

jwt.strategy.ts

guards/

local-auth.guard.ts

### 4.5 Structure type d'un module métier

Exemple pour teams :

teams/

teams.module.ts

teams.controller.ts

teams.service.ts

dto/

create-team.dto.ts

update-team.dto.ts

join-team.dto.ts

guards/

team-member.guard.ts

team-role.guard.ts

entities/ ou models/

constants.ts

types.ts

Règles :

- le controller gère les routes ;

- le service gère la logique métier ;

- les DTO valident les entrées ;

- les guards protègent les permissions ;

- les types clarifient les contrats internes.

4.6 src/database/

Contient la configuration base de données.

Selon l'ORM choisi :

Avec Prisma :

backend/

prisma/

schema.prisma

migrations/

seed.ts

Avec TypeORM :

backend/

src/database/

migrations/

entities/

database.module.ts

data-source.ts

Règles :

- les migrations doivent être versionnées ;

- les seeders doivent utiliser des données fictives ;

- aucune donnée réelle ne doit être commise ;

- la base de production ne doit pas être utilisée pour les tests.

4.7 src/providers/

Contient les providers externes.

Structure recommandée :

providers/

external-stats-provider.interface.ts

mock/

mock-stats.provider.ts

steam/

steam.provider.ts

steam.mapper.ts

steam.types.ts

epic/

epic.provider.ts

epic.mapper.ts

epic.types.ts

Règles :

- les controllers ne doivent pas appeler directement Steam ou Epic ;

- les providers doivent retourner un format interne normalisé ;

- le MockProvider doit rester fiable pour la soutenance ;

- les clés API restent côté back-end.

4.8 src/jobs/

Contient les tâches planifiées.

Exemples :

- season-archive.job.ts ;

- leaderboard-recalculate.job.ts ;

- cleanup-notifications.job.ts ;

- cleanup-logs.job.ts.

Règles :

- les jobs doivent être idempotents si possible ;

- les jobs critiques doivent utiliser des locks Redis ;

- les erreurs doivent être loggées ;

- les jobs destructifs doivent être prudents.

4.9 src/health/

Contient les endpoints de healthcheck.

Exemples :

- health.controller.ts ;

- health.service.ts ;

- database-health.indicator.ts ;

- redis-health.indicator.ts.

Endpoints prévus :

- GET /health ;

- GET /health/database ;

- GET /health/redis ;

- GET /health/full.

## 5 Structure des tests

### 5.1 Tests front-end

Structure possible :

frontend/

src/

features/

auth/

__tests__/

dashboard/

__tests__/

tests/

setup.ts

Tests recommandés :

- composants critiques ;

- hooks ;

- affichage des erreurs ;

- pages principales ;

- intégration API mockée.

### 5.2 Tests back-end

Structure possible :

backend/

test/

unit/

integration/

e2e/

Ou tests proches des modules :

modules/stats/

stats.service.spec.ts

Tests recommandés :

- AuthService ;

- StatsService ;

- score calculation ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- MockProvider ;

- endpoints API critiques.

### 5.3 Tests end-to-end

Structure possible :

e2e/

auth.spec.ts

dashboard.spec.ts

teams.spec.ts

chat.spec.ts

Priorité : P2, après stabilisation du MVP.

## 6 Structure Docker et DevOps

### 6.1 Fichiers Docker à la racine

Fichiers recommandés :

- docker-compose.yml ;

- docker-compose.override.yml ;

- docker-compose.prod.yml ;

- .dockerignore.

### 6.2 Dockerfiles

Chaque application peut avoir son Dockerfile :

frontend/Dockerfile

backend/Dockerfile

### 6.3 Scripts utiles

Scripts possibles :

scripts/

setup-local.sh

reset-db.sh

seed-demo.sh

backup-db.sh

check-env.sh

Règles :

- les scripts doivent être documentés ;

- les scripts destructifs doivent demander confirmation ou être clairement nommés ;

- ne jamais mettre de secrets dans les scripts.

## 7 Fichiers de configuration

### 7.1 À la racine

Fichiers recommandés :

- README.md ;

- .gitignore ;

- .dockerignore ;

- .env.example ;

- docker-compose.yml ;

- package.json si monorepo ;

- pnpm-workspace.yaml si pnpm workspace ;

- turbo.json si Turborepo utilisé en évolution.

### 7.2 Front-end

Fichiers possibles :

- vite.config.ts ;

- tsconfig.json ;

- tsconfig.app.json ;

- eslint.config.js ;

- package.json ;

- postcss.config.js ;

- tailwind.config.ts si Tailwind ;

- public/manifest.webmanifest.

### 7.3 Back-end

Fichiers possibles :

- nest-cli.json ;

- tsconfig.json ;

- tsconfig.build.json ;

- eslint.config.js ;

- package.json ;

- prisma/schema.prisma si Prisma ;

- ormconfig ou data-source si TypeORM.

## 8 Monorepo ou dossiers séparés

### 8.1 Option recommandée MVP

Pour le MVP, l'option recommandée est un repository unique avec deux dossiers :

- frontend/ ;

- backend/.

Avantages :

- simple à comprendre ;

- facile à lancer avec Docker Compose ;

- documentation centralisée ;

- cohérent pour un projet étudiant ;

- pratique pour GitHub Project.

### 8.2 Option monorepo avancée

Une structure monorepo plus poussée peut être envisagée plus tard :

apps/

web/

api/

packages/

shared/

ui/

config/

Avantages :

- partage de types ;

- meilleure organisation à grande échelle ;

- mutualisation de configs.

Inconvénients pour le MVP :

- plus complexe ;

- setup plus long ;

- moins nécessaire pour une équipe de deux.

Conclusion :

Pour Track'N Share MVP, garder frontend/ et backend/ séparés à la racine est le meilleur compromis.

## 9 Types partagés

### 9.1 Problème

Le front-end et le back-end doivent partager certains contrats :

- User ;

- AuthResponse ;

- PlayerStats ;

- Team ;

- LeaderboardEntry ;

- ApiResponse.

### 9.2 Solution MVP

Pour le MVP, les types peuvent être dupliqués proprement côté front et côté back, en gardant les contrats API documentés.

### 9.3 Solution future

Créer un dossier partagé :

shared/

types/

api.types.ts

user.types.ts

stats.types.ts

team.types.ts

Ou dans un monorepo :

packages/shared/

Attention :

Le partage de types doit rester simple et ne pas bloquer le développement.

## 10 Nommage des dossiers et fichiers

### 10.1 Dossiers

Utiliser kebab-case pour les dossiers.

Exemples :

- game-accounts ;

- team-invitations ;

- leaderboard-snapshots ;

- external-providers.

### 10.2 Fichiers front-end

Utiliser kebab-case ou PascalCase pour les composants selon convention retenue, mais rester cohérent.

Recommandation :

- composants : PascalCase.tsx ;

- hooks : use-feature.ts ;

- services : feature-api.ts ;

- types : types.ts.

Exemples :

- UserProfileCard.tsx ;

- TeamChatPanel.tsx ;

- use-team-chat.ts ;

- stats-api.ts.

### 10.3 Fichiers back-end

Respecter les conventions NestJS en kebab-case.

Exemples :

- auth.controller.ts ;

- auth.service.ts ;

- auth.module.ts ;

- create-team.dto.ts ;

- team-member.guard.ts ;

- stats-sync.service.ts.

## 11 Règles de dépendance entre dossiers

### 11.1 Front-end

Règles :

- pages peut importer features et components ;

- features peut importer components, services, hooks et utils ;

- components génériques ne doivent pas importer une feature métier ;

- services centralisent les appels API ;

- stores ne doivent pas contenir de logique métier complexe.

### 11.2 Back-end

Règles :

- controllers appellent services ;

- services peuvent appeler repositories/providers ;

- modules métier peuvent partager des services via exports ;

- common ne doit pas dépendre des modules métier ;

- providers externes ne doivent pas dépendre des controllers ;

- la logique de score doit être centralisée.

## 12 Documentation dans le repository

### 12.1 README.md

Le README doit contenir :

- présentation rapide ;

- prérequis ;

- installation ;

- variables d'environnement ;

- lancement Docker ;

- migrations ;

- seed demo ;

- liens utiles ;

- commandes principales.

12.2 docs/

Le dossier docs/ peut contenir :

- quick-start.md ;

- api-local.md ;

- docker.md ;

- troubleshooting.md ;

- architecture.md.

Règle :

Ne pas recopier toute la documentation Google Drive dans le repository. Le repository doit contenir les informations utiles au développement quotidien.

## 13 Gestion des assets

### 13.1 Front-end

Les assets UI doivent être organisés dans :

- src/assets/ ;

- public/ pour les assets publics nécessaires au build.

### 13.2 Uploads utilisateurs

Les fichiers uploadés par les utilisateurs ne doivent pas être stockés dans le repository.

Ils doivent être stockés :

- localement en développement ;

- dans un bucket ou service dédié en production future.

### 13.3 Avatars par défaut

Les avatars par défaut peuvent être stockés dans :

frontend/src/assets/avatars/

## 14 Gestion des seeds

### 14.1 Objectif

Les seeds servent à générer des données de démonstration.

### 14.2 Emplacement recommandé

Back-end :

- backend/prisma/seed.ts si Prisma ;

- backend/src/database/seeds/ si TypeORM ou solution maison.

### 14.3 Données seedées

Seeds recommandés :

- utilisateurs démo ;

- profils ;

- jeux ;

- statistiques ;

- saisons ;

- leaderboards ;

- équipes ;

- messages.

### 14.4 Règles

- données fictives uniquement ;

- pas de vrais emails ;

- pas de vraies clés ;

- seed idempotent si possible ;

- désactivation en production.

## 15 Gestion des migrations

### 15.1 Emplacement

Selon ORM :

- prisma/migrations/ ;

- src/database/migrations/.

### 15.2 Règles

- une migration par changement de schéma ;

- nom clair ;

- migration testée ;

- éviter les changements destructifs ;

- ne pas modifier manuellement une migration déjà partagée sans accord.

## 16 Gestion des environnements

### 16.1 Fichiers à prévoir

- .env.example ;

- .env local non commité ;

- variables d'environnement dans l'hébergeur en production future.

### 16.2 Règles

- .env ne doit jamais être commité ;

- .env.example doit être maintenu à jour ;

- aucune variable secrète dans frontend/public ;

- aucune variable secrète préfixée VITE_.

## 17 Architecture PWA

### 17.1 Fichiers concernés

- public/manifest.webmanifest ;

- service worker généré par plugin PWA ;

- icônes PWA ;

- configuration Vite PWA.

### 17.2 Règles

- cache des assets statiques ;

- prudence sur le cache des données privées ;

- nettoyage au logout ;

- page offline neutre ;

- pas de secrets dans le cache.

## 18 Architecture Socket.io

### 18.1 Back-end

Emplacement recommandé :

backend/src/modules/chat/

chat.gateway.ts

chat.service.ts

dto/

guards/

### 18.2 Front-end

Emplacement recommandé :

frontend/src/features/chat/

components/

hooks/

services/

types.ts

Et :

frontend/src/services/socket-client.ts

### 18.3 Règles

- socket authentifié ;

- rooms par équipe ;

- logique temps réel isolée ;

- fallback REST si nécessaire ;

- pas de token loggé.

## 19 Architecture providers externes

### 19.1 Back-end uniquement

Les providers externes doivent rester côté back-end.

Structure recommandée :

backend/src/providers/

external-provider.interface.ts

mock/

steam/

epic/

### 19.2 Règles

- pas d'appel Steam/Epic depuis React ;

- pas de clé API côté front ;

- mapping normalisé ;

- fallback mock ;

- cache si nécessaire.

## 20 Architecture documentation Google Drive

### 20.1 Rôle du Drive

Le Drive Track'N Share reste la documentation principale.

Il contient :

- gestion projet ;

- documentation fonctionnelle ;

- architecture technique ;

- base de données ;

- diagrammes UML ;

- API ;

- intégrations externes ;

- sécurité RGPD ;

- DevOps ;

- standards ;

- tests ;

- sprints ;

- ressources.

### 20.2 Lien avec le code

Quand une décision technique change, il faut mettre à jour le document Drive correspondant.

Exemples :

- nouvelle variable env → Variables-environnement ;

- nouveau endpoint → Endpoints-REST-API ;

- nouvelle règle métier → Regles-metier ;

- changement Docker → Configuration-Docker ;

- changement sécurité → Politique-securite.

## 21 Structure recommandée finale synthétique

Synthèse :

track-n-share/

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

backend/

src/

config/

common/

modules/

database/

providers/

jobs/

health/

main.ts

app.module.ts

test/

prisma/ ou src/database/migrations/

docs/

scripts/

docker-compose.yml

docker-compose.override.yml

docker-compose.prod.yml

.env.example

.gitignore

.dockerignore

README.md

## 22 Checklist architecture avant développement

Avant de commencer à coder :

- repository créé ;

- frontend/ créé ;

- backend/ créé ;

- README initial créé ;

- .gitignore créé ;

- .env.example créé ;

- docker-compose.yml prévu ;

- structure src/ front définie ;

- structure src/ back définie ;

- modules métier identifiés ;

- conventions de nommage validées ;

- stratégie de tests prévue ;

- documentation Drive alignée.

## 23 Checklist architecture pendant développement

Pendant le développement :

- ne pas mettre de logique métier dans les composants génériques ;

- ne pas mettre de logique métier complexe dans les controllers ;

- créer un module par domaine ;

- centraliser les appels API front ;

- centraliser les providers externes back ;

- maintenir les types à jour ;

- garder les fichiers courts ;

- supprimer le code mort ;

- mettre à jour la documentation si l'architecture change.

## 24 Risques et solutions

### 24.1 Risque : repository désorganisé

Impact : perte de temps, difficulté à retrouver les fichiers.

Solution : structure claire dès le départ.

### 24.2 Risque : logique métier dispersée

Impact : bugs et duplication.

Solution : services back-end et hooks/services front-end dédiés.

### 24.3 Risque : composants trop gros

Impact : maintenance difficile.

Solution : découper les composants par responsabilité.

### 24.4 Risque : APIs externes appelées côté front

Impact : fuite de clés et sécurité faible.

Solution : providers externes uniquement côté back-end.

### 24.5 Risque : documentation déconnectée du code

Impact : documentation obsolète.

Solution : mise à jour Drive lors des changements importants.

### 24.6 Risque : architecture trop complexe pour le MVP

Impact : perte de temps.

Solution : garder frontend/ et backend/ simples, repousser le monorepo avancé.

## 25 Critères d'acceptation

L'architecture des dossiers est considérée correcte si :

- le repository sépare clairement frontend et backend ;

- les modules métier sont identifiés ;

- les composants UI sont séparés des features ;

- les appels API front sont centralisés ;

- les controllers NestJS restent simples ;

- les services NestJS contiennent la logique métier ;

- les DTO valident les entrées ;

- les providers externes sont isolés côté back-end ;

- les migrations et seeds sont organisés ;

- Docker est prévu à la racine ;

- les tests ont un emplacement clair ;

- les fichiers de configuration sont identifiables ;

- la documentation Drive reste la référence projet.

## 26 Conclusion

L'architecture des dossiers de Track'N Share doit permettre de démarrer le développement sur une base propre.

Pour le MVP, l'organisation la plus adaptée est simple : un dossier frontend, un dossier backend, une configuration Docker à la racine, des modules métier bien séparés et une documentation Drive qui reste la référence.

Cette structure évite de surcomplexifier le projet tout en préparant les évolutions futures : tests, providers externes, PWA, Socket.io, archivage, monitoring et déploiement.

Une architecture claire dès le départ permettra à Ioanes et Clément de gagner du temps, de limiter les conflits et de rendre le projet plus facile à présenter et maintenir.
