# Track'N Share — Sprints & Roadmap

## Objectif du fichier

Ce fichier résume la roadmap de développement du MVP Track'N Share.

Claude Code doit l'utiliser pour travailler sprint par sprint et éviter d'ajouter des fonctionnalités hors scope.

## Vue d'ensemble des milestones

| Milestone | Sprint | Résultat attendu |
|---|---|---|
| M0 | Sprint 0 | Socle projet prêt |
| M1 | Sprint 1 | Authentification fonctionnelle |
| M2 | Sprint 2 | Stats et leaderboards fonctionnels |
| M3 | Sprint 3 | Équipes et chat fonctionnels |
| M4 | Sprint 4 | MVP prêt soutenance |
| M5 | Final | Documentation et repository propres |

## Sprint 0 — Préparation

### Objectif

Préparer le socle du projet.

### Livrables

- repository créé ;
- monorepo initial ;
- `apps/web` initialisé ;
- `apps/api` initialisé ;
- Docker Compose prévu ;
- PostgreSQL prévu ;
- Redis prévu ;
- `.env.example` ;
- README initial ;
- conventions de base.

### Critère de sortie

Le projet peut être installé et lancé en local.

## Sprint 1 — Authentification

### Objectif

Créer une authentification fonctionnelle et sécurisée.

### P0

- modèle User ;
- register ;
- login ;
- hash mot de passe ;
- JWT ;
- JwtAuthGuard ;
- endpoint `/users/me` ;
- pages login/register ;
- route dashboard protégée ;
- logout ;
- compte démo.

### Critère de sortie

Un utilisateur peut se connecter, accéder à une route privée puis se déconnecter.

## Sprint 2 — Stats et leaderboards

### Objectif

Créer le cœur métier visible : stats, score et leaderboard.

### P0

- modèles Game, GameAccount, PlayerStats, Season ;
- MockProvider ;
- calcul K/D ;
- calcul winrate ;
- calcul score ;
- endpoint stats utilisateur ;
- endpoint sync mock ;
- endpoint leaderboard solo ;
- dashboard joueur ;
- page leaderboard ;
- seed joueurs/stats.

### Critère de sortie

Le compte démo affiche des statistiques et apparaît dans un leaderboard rempli.

## Sprint 3 — Équipes et chat

### Objectif

Ajouter la dimension communautaire du MVP.

### P0

- modèle Team ;
- modèle TeamMember ;
- modèle ChatMessage ;
- création équipe ;
- rejoindre équipe via code ;
- rôles CAPTAIN/MEMBER ;
- TeamMemberGuard ;
- TeamRoleGuard ;
- page équipe ;
- liste membres ;
- API messages ;
- Socket.io ;
- room `team:{teamId}` ;
- interface chat ;
- seed équipe/messages.

### Critère de sortie

Le compte démo peut ouvrir une équipe et envoyer/recevoir un message dans le chat.

## Sprint 4 — Polish et soutenance

### Objectif

Stabiliser l'application pour la démonstration finale.

### P0

- tests MVP ;
- tests API ;
- tests sécurité ;
- correction bugs bloquants ;
- seed démo finalisé ;
- Docker vérifié ;
- Swagger propre ;
- README à jour ;
- responsive minimum ;
- logs nettoyés ;
- captures de secours ;
- scénario de soutenance.

### Critère de sortie

Le parcours de démo complet fonctionne sans bug bloquant.

## Backlog prioritaire

### Ordre de priorité si manque de temps

1. Docker et lancement.
2. Authentification.
3. Dashboard.
4. Stats mockées.
5. Score.
6. Leaderboard.
7. Équipe.
8. Chat.
9. Sécurité minimale.
10. Recette soutenance.
11. PWA et améliorations.

## Règle de gel du scope

Dès que les P0 d'un sprint ne sont pas terminés, ne pas ajouter de P1/P2.

Exemples à reporter :
- SteamProvider réel ;
- EpicProvider réel ;
- amis ;
- messagerie privée ;
- tournois ;
- feed social ;
- matchmaking ;
- badges avancés ;
- E2E complets.

## Démo cible

Le scénario doit rester le même jusqu'à la soutenance :

1. Lancer Docker.
2. Ouvrir le front.
3. Se connecter en compte démo.
4. Afficher dashboard.
5. Afficher stats mockées.
6. Synchroniser stats si disponible.
7. Afficher leaderboard.
8. Ouvrir équipe.
9. Envoyer message chat.
10. Déconnexion.
11. Montrer Swagger et expliquer la sécurité.

## Definition of Done globale

Une tâche est terminée si :

- le code compile ;
- le lint passe si configuré ;
- les DTO sont validés ;
- les routes privées sont protégées ;
- les erreurs principales sont gérées ;
- le front affiche loading/error/empty ;
- Swagger est mis à jour si endpoint ajouté ;
- la documentation utile est mise à jour si comportement modifié ;
- aucune donnée sensible n'est exposée.

## Gestion des retards

Si retard :

- garder les P0 ;
- reporter P1/P2 ;
- garder le MockProvider ;
- garder le mode démo stable ;
- documenter les limites ;
- ne pas intégrer Steam/Epic dans l'urgence ;
- ne pas casser le parcours principal.
