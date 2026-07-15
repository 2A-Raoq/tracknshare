# Track'N Share — Project Overview

## Objectif du fichier

Ce document donne une vision rapide du projet, de son objectif, de son périmètre et de son contexte fonctionnel.

## Résumé du projet

Track'N Share est une plateforme web et mobile sous forme de PWA permettant aux joueurs de suivre, partager et comparer leurs performances sur différents jeux vidéo.

Le projet repose sur trois piliers principaux :

1. **Tracking des statistiques de jeu**
   - récupération de statistiques via APIs externes ou MockProvider ;
   - stockage des données en base ;
   - conservation d'un historique par saison de 3 mois.

2. **Comparaison et compétition**
   - système de score basé sur les performances ;
   - leaderboards solo ;
   - leaderboards d'équipe ;
   - comparaison entre joueurs, équipes et saisons.

3. **Communauté**
   - profils utilisateurs ;
   - équipes ;
   - invitations ;
   - chat d'équipe ;
   - futures fonctionnalités sociales.

## Pitch court

Track'N Share permet aux joueurs de connecter ou simuler leurs comptes de jeux, consulter leurs statistiques, comparer leurs performances, rejoindre ou créer des équipes, discuter via un chat d'équipe et progresser dans des classements dynamiques.

## Équipe

| Rôle | Responsable |
|---|---|
| Chef de projet | Ioanes |
| Chef back-end | Ioanes |
| Chef front-end | Clément |
| Chef mobile / PWA | Clément |

## Stack cible

### Front-end

- React
- TypeScript
- Vite
- PWA
- Socket.io client
- Routing front
- State management léger
- Responsive mobile-first

### Back-end

- NestJS
- TypeScript
- API REST
- Swagger / OpenAPI
- Socket.io serveur
- Authentification JWT
- Guards et permissions

### Base de données et infra

- PostgreSQL comme base principale
- Redis pour cache, rate limiting, locks, présence future ou leaderboards rapides
- Docker Compose pour l'environnement local
- MockProvider pour sécuriser la démo sans dépendre de Steam/Epic

## Structure actuelle du repository

Le projet utilise une structure monorepo :

```txt
TRACKNSHARE/
  apps/
    api/
    web/
  docs/
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  turbo.json
```

Même si certains documents du Drive parlent de `frontend/` et `backend/`, la structure actuelle `apps/web` et `apps/api` est valide. Il faut garder cette organisation pour le développement.

## Principe important

Toujours privilégier un MVP stable plutôt qu'un projet trop large.

Ordre de priorité :

1. Authentification
2. Dashboard joueur
3. Stats mockées
4. Score
5. Leaderboard solo
6. Équipes
7. Chat d'équipe
8. Sécurité de base
9. Données de démo
10. PWA / polish

## Ce qui doit guider le développement

Le développement doit rester centré sur le MVP, sans élargir inutilement le périmètre.

À faire :
- coder par sprint ;
- garder une architecture simple ;
- éviter les bonus tant que les P0 ne sont pas terminés ;
- maintenir la documentation utile ;
- respecter les règles de sécurité ;
- ne jamais exposer de secret.

À éviter :
- intégrer Steam/Epic avant le MockProvider ;
- créer une architecture trop complexe ;
- ajouter amis, tournois, feed social ou matchmaking avancé trop tôt ;
- disperser la logique métier ;
- mettre de la logique métier lourde dans les composants front ou les controllers NestJS.
