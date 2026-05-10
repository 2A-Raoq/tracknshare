# Track'N Share — Architecture

## Objectif du fichier

Ce fichier donne à Claude Code les règles d'architecture du repository Track'N Share.

Le projet utilise un monorepo avec deux applications :

```txt
apps/api
apps/web
```

## Structure racine actuelle

Structure attendue :

```txt
TRACKNSHARE/
  apps/
    api/
    web/
  docs/
    00-AI-Context/
    01-Gestion-Projet/
    02-Documentation-Fonctionnelle/
    03-Design-UX-UI/
    04-Architecture-Technique/
    05-Base-de-Donnees/
    06-Diagrammes-UML/
    07-API-Documentation/
    08-Integrations-Externes/
    09-Securite-RGPD/
    10-Tests/
    11-DevOps-Deploiement/
    12-Standards-Developpement/
    13-Sprints-Milestones/
    14-Ressources-Externes/
  docker-compose.yml
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  CLAUDE.md
  .gitignore
```

## Rôles des applications

### `apps/web`

Application front-end React / TypeScript / Vite / PWA.

Responsabilités :
- interface utilisateur ;
- pages ;
- composants ;
- formulaires ;
- routing ;
- appels API ;
- état utilisateur ;
- connexion Socket.io ;
- responsive ;
- PWA.

### `apps/api`

Application back-end NestJS / TypeScript.

Responsabilités :
- API REST ;
- authentification ;
- autorisations ;
- logique métier ;
- accès base de données ;
- providers externes ;
- MockProvider ;
- Socket.io serveur ;
- Swagger ;
- sécurité ;
- jobs futurs.

## Architecture front-end recommandée

Dans `apps/web/src` :

```txt
src/
  assets/
  components/
  features/
    auth/
    dashboard/
    profile/
    games/
    stats/
    leaderboard/
    teams/
    chat/
    seasons/
    settings/
    demo/
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
```

### Règles front-end

- Les pages importent les features et composants.
- Les composants génériques ne contiennent pas de logique métier forte.
- Les appels HTTP sont centralisés dans `services/` ou dans les services de feature.
- Les types API doivent être clairs et maintenus.
- Les formulaires doivent gérer loading, error et success.
- Les routes privées doivent être protégées côté front, mais la sécurité réelle reste côté back-end.
- Ne jamais mettre de secret dans le front.
- Les variables `VITE_*` sont publiques.

## Architecture back-end recommandée

Dans `apps/api/src` :

```txt
src/
  app.module.ts
  main.ts
  config/
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
    health/
  database/
  providers/
    external-stats-provider.interface.ts
    mock/
    steam/
    epic/
  jobs/
```

## Structure type d'un module NestJS

Exemple pour `teams` :

```txt
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
```

### Règles back-end

- Les controllers gèrent les routes.
- Les services contiennent la logique métier.
- Les DTO valident les entrées.
- Les guards protègent les accès.
- Les providers externes restent côté back-end.
- Les migrations doivent être versionnées.
- Les seeds doivent utiliser uniquement des données fictives.
- Les secrets restent dans les variables d'environnement.
- Swagger doit documenter les routes MVP.

## Providers externes

Les providers Steam/Epic ne doivent jamais être appelés depuis React.

Structure recommandée :

```txt
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
```

Règles :
- le MockProvider est obligatoire pour le MVP ;
- Steam/Epic sont des évolutions futures ;
- les providers retournent un format interne normalisé ;
- les clés API restent côté back-end ;
- le provider ne doit pas bloquer la démo.

## Socket.io

### Back-end

```txt
modules/chat/
  chat.gateway.ts
  chat.service.ts
  dto/
  guards/
```

### Front-end

```txt
features/chat/
  components/
  hooks/
  services/
  types.ts

services/socket-client.ts
```

Règles :
- socket authentifié ;
- rooms par équipe ;
- vérification membre avant join ;
- événement de message sauvegardé puis broadcast ;
- fallback REST si nécessaire ;
- pas de token loggé.

## Base de données

PostgreSQL est la source de vérité.

Redis peut être utilisé pour :
- cache ;
- rate limiting ;
- locks de synchronisation ;
- présence future ;
- leaderboards rapides futurs ;
- adapter Socket.io si scaling futur.

## Docker

Le fichier `docker-compose.yml` doit permettre de lancer au minimum :

- web ;
- api ;
- postgres ;
- redis.

## Documentation

Le Drive reste la documentation principale.

Le dossier `docs/00-AI-Context` sert uniquement à donner un contexte court et exploitable aux IA et aux développeurs.

Quand une décision change :
- endpoint modifié → mettre à jour la doc API ;
- règle métier modifiée → mettre à jour règles métier ;
- variable env ajoutée → mettre à jour variables environnement ;
- sécurité changée → mettre à jour politique sécurité ;
- architecture changée → mettre à jour architecture.

## Règles de qualité

- Garder les fichiers courts.
- Créer un module par domaine.
- Centraliser la logique métier.
- Ne pas disperser les appels API.
- Ne pas dupliquer inutilement les calculs.
- Garder les types cohérents.
- Supprimer le code mort.
- Ne pas surcomplexifier le MVP.
