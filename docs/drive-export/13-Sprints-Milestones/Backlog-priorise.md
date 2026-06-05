# BACKLOG PRIORISÉ

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente le backlog priorisé du projet Track'N Share.

Il sert à transformer la roadmap MVP en tâches concrètes, exploitables dans GitHub Project ou dans un Kanban. Chaque tâche est classée par domaine, priorité, sprint recommandé, responsable possible et critères d'acceptation.

Ce backlog est une base de travail initiale. Il pourra évoluer pendant le développement selon l'avancement, les contraintes techniques et les retours de recette.

## 1 Règles de priorisation

### 1.1 Priorité P0

Les tâches P0 sont indispensables pour le MVP et la soutenance.

Une tâche P0 doit être faite avant de considérer le projet comme présentable.

### 1.2 Priorité P1

Les tâches P1 sont importantes mais peuvent être reportées si le temps manque.

Elles améliorent la qualité, l'expérience utilisateur, les tests ou la robustesse.

### 1.3 Priorité P2

Les tâches P2 sont des évolutions futures.

Elles ne doivent pas bloquer le MVP.

## 2 Vue globale du backlog MVP

Le backlog est organisé par grands domaines :

- setup projet ;

- front-end ;

- back-end ;

- base de données ;

- authentification ;

- statistiques ;

- leaderboards ;

- équipes ;

- chat ;

- sécurité ;

- tests ;

- DevOps ;

- documentation ;

- soutenance.

## 3 Sprint 0 — Préparation

### 3.1 TNS-001 — Créer le repository GitHub

Priorité : P0

Sprint : Sprint 0

Responsable possible : Ioanes / Clément

Description : créer le repository principal Track'N Share.

Critères d'acceptation :

- repository créé ;

- branche main disponible ;

- accès équipe configuré ;

- README initial présent.

### 3.2 TNS-002 — Créer le GitHub Project / Kanban

Priorité : P0

Sprint : Sprint 0

Responsable possible : Clément

Description : créer un Kanban pour suivre les tâches du projet.

Critères d'acceptation :

- colonnes Backlog, À faire, En cours, En review, Test, Terminé ;

- tâches principales ajoutées ;

- responsables possibles renseignés.

### 3.3 TNS-003 — Initialiser le front-end React/Vite/TypeScript

Priorité : P0

Sprint : Sprint 0

Responsable possible : Clément

Critères d'acceptation :

- dossier frontend créé ;

- application démarre ;

- TypeScript activé ;

- structure src initiale créée ;

- page d'accueil temporaire affichée.

### 3.4 TNS-004 — Initialiser le back-end NestJS/TypeScript

Priorité : P0

Sprint : Sprint 0

Responsable possible : Ioanes

Critères d'acceptation :

- dossier backend créé ;

- NestJS démarre ;

- endpoint health minimal disponible ;

- structure modules prête.

### 3.5 TNS-005 — Mettre en place Docker Compose

Priorité : P0

Sprint : Sprint 0

Responsable possible : Ioanes

Critères d'acceptation :

- docker-compose.yml créé ;

- services frontend, backend, postgres, redis prévus ;

- projet lançable localement ;

- logs consultables.

### 3.6 TNS-006 — Créer .env.example

Priorité : P0

Sprint : Sprint 0

Responsable possible : Ioanes

Critères d'acceptation :

- variables obligatoires listées ;

- aucune vraie clé ;

- variables front/back séparées ;

- README explique comment créer .env.

### 3.7 TNS-007 — Configurer Swagger initial

Priorité : P0

Sprint : Sprint 0

Responsable possible : Ioanes

Critères d'acceptation :

- Swagger accessible en dev ;

- route /api/docs ou équivalent ;

- titre API Track'N Share ;

- aucun secret dans Swagger.

## 4 Sprint 1 — Authentification

### 4.1 TNS-101 — Créer le modèle User

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- table User créée ;

- champs id, email, username, passwordHash, role, createdAt, updatedAt ;

- email unique ;

- migration créée.

### 4.2 TNS-102 — Implémenter l'inscription

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- endpoint POST /api/auth/register ;

- RegisterDto ;

- validation email/password/username ;

- password hashé ;

- email déjà utilisé géré ;

- passwordHash non retourné.

### 4.3 TNS-103 — Implémenter la connexion JWT

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- endpoint POST /api/auth/login ;

- LoginDto ;

- vérification mot de passe ;

- accessToken généré ;

- message générique si échec ;

- user retourné sans données sensibles.

### 4.4 TNS-104 — Créer JwtAuthGuard

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- routes privées protégées ;

- token absent refusé ;

- token invalide refusé ;

- user injecté dans la requête.

### 4.5 TNS-105 — Créer endpoint utilisateur connecté

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- GET /api/users/me ;

- token requis ;

- retourne utilisateur connecté ;

- passwordHash absent.

### 4.6 TNS-106 — Créer pages login/register

Priorité : P0

Sprint : Sprint 1

Responsable possible : Clément

Critères d'acceptation :

- formulaires fonctionnels ;

- erreurs affichées ;

- redirection après login ;

- responsive minimal.

### 4.7 TNS-107 — Gérer session côté front

Priorité : P0

Sprint : Sprint 1

Responsable possible : Clément

Critères d'acceptation :

- utilisateur connecté stocké dans store ;

- token utilisé dans appels API ;

- route privée protégée ;

- logout nettoie les données.

### 4.8 TNS-108 — Créer compte démo initial

Priorité : P0

Sprint : Sprint 1

Responsable possible : Ioanes

Critères d'acceptation :

- compte demo@tracknshare.local créé par seed ;

- rôle PLAYER ;

- mot de passe documenté hors dépôt public ;

- utilisable pour soutenance.

## 5 Sprint 2 — Statistiques et leaderboards

### 5.1 TNS-201 — Créer modèles Game et PlayerStats

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- tables créées ;

- relations user/game/stats ;

- migrations prêtes ;

- données mockables.

### 5.2 TNS-202 — Créer MockProvider

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- provider retourne stats fictives ;

- pas besoin de Steam/Epic ;

- erreurs simulables ;

- mapping normalisé.

### 5.3 TNS-203 — Implémenter calcul du score

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- fonction centralisée ;

- K/D calculé ;

- winrate calculé ;

- score stable ;

- cas division par zéro géré.

### 5.4 TNS-204 — Endpoint statistiques utilisateur

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- GET /api/stats/me ;

- token requis ;

- données utilisateur connecté uniquement ;

- score inclus.

### 5.5 TNS-205 — Endpoint synchronisation mock

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- POST /api/stats/sync ;

- MockProvider utilisé ;

- lastSyncAt mis à jour ;

- anciennes stats conservées si erreur.

### 5.6 TNS-206 — Dashboard statistiques front

Priorité : P0

Sprint : Sprint 2

Responsable possible : Clément

Critères d'acceptation :

- score visible ;

- K/D visible ;

- winrate visible ;

- matchesPlayed visible ;

- loading/error/empty gérés.

### 5.7 TNS-207 — Endpoint leaderboard solo

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- GET /api/leaderboards/solo ;

- tri par score décroissant ;

- pagination ;

- joueurs seedés visibles.

### 5.8 TNS-208 — Page leaderboard front

Priorité : P0

Sprint : Sprint 2

Responsable possible : Clément

Critères d'acceptation :

- rang affiché ;

- pseudo affiché ;

- score affiché ;

- équipe affichée si disponible ;

- état vide géré.

### 5.9 TNS-209 — Seed statistiques et leaderboard

Priorité : P0

Sprint : Sprint 2

Responsable possible : Ioanes

Critères d'acceptation :

- plusieurs joueurs fictifs ;

- stats variées ;

- leaderboard crédible ;

- données non réelles.

## 6 Sprint 3 — Équipes et chat

### 6.1 TNS-301 — Créer modèles Team et TeamMember

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- tables créées ;

- rôles CAPTAIN/MEMBER ;

- relation user/team ;

- migration créée.

### 6.2 TNS-302 — Créer équipe

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- POST /api/teams ;

- utilisateur connecté requis ;

- créateur devient CAPTAIN ;

- validation nom/tag.

### 6.3 TNS-303 — Rejoindre équipe avec code

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- code invitation valide ;

- utilisateur ajouté MEMBER ;

- code invalide refusé ;

- doublon membre évité.

### 6.4 TNS-304 — Créer TeamMemberGuard et TeamRoleGuard

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- non-membre refusé ;

- membre simple refusé sur action capitaine ;

- guards appliqués sur routes sensibles.

### 6.5 TNS-305 — Page équipe front

Priorité : P0

Sprint : Sprint 3

Responsable possible : Clément

Critères d'acceptation :

- nom équipe visible ;

- membres visibles ;

- rôle utilisateur visible ;

- actions selon rôle.

### 6.6 TNS-306 — Créer modèle ChatMessage

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- table messages ;

- relation équipe/utilisateur ;

- contenu limité ;

- date création.

### 6.7 TNS-307 — API messages équipe

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- GET messages équipe ;

- POST message ;

- membre requis ;

- non-membre refusé ;

- message vide refusé.

### 6.8 TNS-308 — Socket.io chat

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes / Clément

Critères d'acceptation :

- socket authentifié ;

- room team:{teamId} ;

- message broadcast aux membres ;

- userId issu du token ;

- non-membre refusé.

### 6.9 TNS-309 — Interface chat front

Priorité : P0

Sprint : Sprint 3

Responsable possible : Clément

Critères d'acceptation :

- historique visible ;

- envoi message ;

- réception temps réel ;

- erreurs visibles ;

- responsive minimal.

### 6.10 TNS-310 — Seed équipes et messages

Priorité : P0

Sprint : Sprint 3

Responsable possible : Ioanes

Critères d'acceptation :

- équipe démo créée ;

- membres fictifs ;

- messages de chat ;

- compte démo membre.

## 7 Sprint 4 — Polish, tests et soutenance

### 7.1 TNS-401 — Exécuter Plan-tests-MVP

Priorité : P0

Sprint : Sprint 4

Responsable possible : Ioanes / Clément

Critères d'acceptation :

- tests P0 réalisés ;

- anomalies listées ;

- bugs bloquants corrigés.

### 7.2 TNS-402 — Exécuter Tests-API

Priorité : P0

Sprint : Sprint 4

Responsable possible : Ioanes

Critères d'acceptation :

- auth testée ;

- stats testées ;

- leaderboard testé ;

- teams/chat testés ;

- Swagger vérifié.

### 7.3 TNS-403 — Exécuter Tests-securite

Priorité : P0

Sprint : Sprint 4

Responsable possible : Ioanes / Clément

Critères d'acceptation :

- routes privées protégées ;

- non-membre refusé ;

- passwordHash absent ;

- secrets absents ;

- compte démo non admin.

### 7.4 TNS-404 — Finaliser Recette-soutenance

Priorité : P0

Sprint : Sprint 4

Responsable possible : Clément

Critères d'acceptation :

- scénario de démo prêt ;

- captures de secours ;

- checklist finale passée ;

- plan de secours connu.

### 7.5 TNS-405 — Améliorer responsive minimal

Priorité : P1

Sprint : Sprint 4

Responsable possible : Clément

Critères d'acceptation :

- login lisible mobile ;

- dashboard lisible mobile ;

- leaderboard utilisable ;

- chat utilisable.

### 7.6 TNS-406 — Nettoyer logs et erreurs

Priorité : P0

Sprint : Sprint 4

Responsable possible : Ioanes

Critères d'acceptation :

- pas de JWT loggé ;

- pas de password ;

- erreurs API propres ;

- requestId si disponible.

### 7.7 TNS-407 — Finaliser README

Priorité : P0

Sprint : Sprint 4

Responsable possible : Ioanes / Clément

Critères d'acceptation :

- installation expliquée ;

- Docker expliqué ;

- variables env expliquées ;

- compte démo documenté de manière prudente ;

- commandes utiles listées.

## 8 Backlog P1 complémentaire

### 8.1 TNS-P1-001 — Refresh token

Priorité : P1

Sprint recommandé : Sprint 1 ou après MVP

### 8.2 TNS-P1-002 — Rate limiting login

Priorité : P1

Sprint recommandé : Sprint 1 ou Sprint 4

### 8.3 TNS-P1-003 — Rate limiting chat

Priorité : P1

Sprint recommandé : Sprint 3 ou Sprint 4

### 8.4 TNS-P1-004 — PWA installable

Priorité : P1

Sprint recommandé : Sprint 4

### 8.5 TNS-P1-005 — Notifications simples

Priorité : P1

Sprint recommandé : après Sprint 3

### 8.6 TNS-P1-006 — Leaderboard par saison

Priorité : P1

Sprint recommandé : Sprint 2 ou Sprint 4

### 8.7 TNS-P1-007 — Archivage saison manuel

Priorité : P1

Sprint recommandé : Sprint 4 ou après MVP

### 8.8 TNS-P1-008 — Tests unitaires score

Priorité : P1

Sprint recommandé : Sprint 2

### 8.9 TNS-P1-009 — CI GitHub Actions simple

Priorité : P1

Sprint recommandé : Sprint 4

## 9 Backlog P2 évolution future

### 9.1 TNS-P2-001 — Intégration SteamProvider réel

Priorité : P2

### 9.2 TNS-P2-002 — Intégration EpicProvider réel

Priorité : P2

### 9.3 TNS-P2-003 — Historique avancé des statistiques

Priorité : P2

### 9.4 TNS-P2-004 — Badges et achievements internes

Priorité : P2

### 9.5 TNS-P2-005 — Tournois ou événements

Priorité : P2

### 9.6 TNS-P2-006 — Tests E2E Playwright/Cypress

Priorité : P2

### 9.7 TNS-P2-007 — Monitoring Sentry

Priorité : P2

### 9.8 TNS-P2-008 — Déploiement production avancé

Priorité : P2

## 10 Répartition synthétique

| Domaine | Responsable principal possible | Support |

|---|---|---|

| Setup backend | Ioanes | Clément |

| Setup frontend | Clément | Ioanes |

| Auth API | Ioanes | Clément |

| Auth front | Clément | Ioanes |

| Stats API | Ioanes | Clément |

| Dashboard UI | Clément | Ioanes |

| Leaderboard API | Ioanes | Clément |

| Leaderboard UI | Clément | Ioanes |

| Teams API | Ioanes | Clément |

| Teams UI | Clément | Ioanes |

| Chat Socket.io | Ioanes | Clément |

| Chat UI | Clément | Ioanes |

| Tests API | Ioanes | Clément |

| Recette | Clément | Ioanes |

| Soutenance | Ioanes / Clément | Ioanes / Clément |

## 11 Critères d'acceptation du backlog

Le backlog est considéré exploitable si :

- les tâches P0 couvrent le MVP ;

- les tâches sont reliées aux sprints ;

- les critères d'acceptation sont clairs ;

- les responsabilités sont proposées ;

- les tâches peuvent être reportées dans GitHub Project ;

- les P1/P2 ne bloquent pas la soutenance.

## 12 Conclusion

Ce backlog priorisé transforme la roadmap MVP en tâches concrètes.

Il doit être utilisé comme base pour alimenter le Kanban GitHub Project. Les tâches P0 doivent être traitées en priorité, car elles correspondent au socle nécessaire pour présenter Track'N Share en soutenance.

Les tâches P1 apportent de la qualité ou du confort, tandis que les tâches P2 représentent les évolutions futures du produit.
