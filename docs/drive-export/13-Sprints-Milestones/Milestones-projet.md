# MILESTONES PROJET

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les milestones du projet Track'N Share.

Les milestones servent à suivre l'avancement global du MVP à travers des jalons clairs, vérifiables et alignés avec la roadmap, les sprints, le backlog priorisé et la recette soutenance.

Chaque milestone correspond à une étape majeure du projet. Une milestone est validée uniquement si ses livrables principaux sont terminés, testés et exploitables.

## 1 Rôle des milestones

### 1.1 Définition

Une milestone est un jalon important du projet.

Elle permet de répondre à la question :

"Est-ce que cette grande étape du MVP est suffisamment terminée pour passer à la suite ?"

### 1.2 Utilité pour Track'N Share

Les milestones permettent de :

- suivre l'avancement du projet ;

- éviter de développer dans le désordre ;

- vérifier les dépendances entre modules ;

- préparer la soutenance progressivement ;

- prioriser les tâches P0 ;

- décider si une fonctionnalité P1/P2 doit être reportée ;

- garder un projet démontrable à chaque étape.

### 1.3 Lien avec les autres documents

Ce document est lié à :

- Roadmap-MVP ;

- Backlog-priorise ;

- Sprint-0-Preparation ;

- Sprint-1-Authentification ;

- Sprint-2-Stats-Leaderboards ;

- Sprint-3-Equipes-Chat ;

- Sprint-4-Polish-Soutenance ;

- Definition-of-Done ;

- Plan-tests-MVP ;

- Recette-soutenance.

## 2 Liste des milestones

Les milestones principales du MVP sont :

- M0 — Socle projet prêt ;

- M1 — Authentification fonctionnelle ;

- M2 — Dashboard, statistiques et leaderboards fonctionnels ;

- M3 — Équipes et chat fonctionnels ;

- M4 — MVP stabilisé et prêt pour soutenance ;

- M5 — Documentation et livraison finale validées.

## 3 M0 — Socle projet prêt

### 3.1 Objectif

Mettre en place les bases techniques du projet afin que le développement puisse commencer proprement.

### 3.2 Sprint associé

Sprint associé : Sprint 0 — Préparation.

### 3.3 Livrables attendus

Livrables :

- repository GitHub créé ;

- GitHub Project/Kanban créé ;

- structure du repository définie ;

- dossier frontend initialisé ;

- dossier backend initialisé ;

- README initial créé ;

- .gitignore créé ;

- .env.example créé ;

- Docker Compose initial créé ;

- PostgreSQL disponible ;

- Redis disponible ;

- endpoint healthcheck minimal ;

- Swagger initial activable ;

- documentation technique de démarrage alignée.

### 3.4 Critères de validation

La milestone M0 est validée si :

- le repository est accessible ;

- les branches de base sont définies ;

- le front-end démarre ;

- le back-end démarre ;

- Docker Compose démarre les services principaux ;

- PostgreSQL et Redis sont accessibles ;

- GET /api/health répond ;

- aucune vraie variable secrète n'est présente dans Git ;

- le Kanban contient les premières tâches.

### 3.5 Risques associés

Risque : mauvais setup initial.

Impact : perte de temps pendant tout le développement.

Solution : prendre le temps de valider Docker, .env.example, README et structure des dossiers dès le départ.

## 4 M1 — Authentification fonctionnelle

### 4.1 Objectif

Permettre à un utilisateur de créer un compte, se connecter, accéder à son espace privé et se déconnecter.

### 4.2 Sprint associé

Sprint associé : Sprint 1 — Authentification.

### 4.3 Livrables attendus

Livrables :

- modèle User ;

- migration utilisateur ;

- AuthModule ;

- UsersModule ;

- RegisterDto ;

- LoginDto ;

- hash mot de passe ;

- génération JWT ;

- JwtAuthGuard ;

- POST /api/auth/register ;

- POST /api/auth/login ;

- GET /api/users/me ;

- pages Login et Register ;

- gestion session front ;

- logout ;

- compte démo initial ;

- Swagger auth documenté.

### 4.4 Critères de validation

La milestone M1 est validée si :

- un utilisateur peut s'inscrire ;

- un utilisateur peut se connecter ;

- un utilisateur peut se déconnecter ;

- une route privée sans token retourne 401 ;

- un token invalide est refusé ;

- passwordHash n'est jamais retourné ;

- le front protège les pages privées ;

- le compte démo permet de se connecter ;

- les erreurs de formulaire sont compréhensibles.

### 4.5 Risques associés

Risque : authentification mal sécurisée.

Impact : fuite de données ou accès non autorisé.

Solution : vérifier JWT, guards, absence de passwordHash, validation DTO et logs sans secrets.

## 5 M2 — Dashboard, statistiques et leaderboards fonctionnels

### 5.1 Objectif

Permettre à l'utilisateur connecté de consulter ses statistiques, voir un score calculé et comparer ses performances dans un leaderboard.

### 5.2 Sprint associé

Sprint associé : Sprint 2 — Stats et leaderboards.

### 5.3 Livrables attendus

Livrables :

- modèles Game, GameAccount, PlayerStats, Season ;

- MockProvider ;

- service de normalisation des stats ;

- formule de score ;

- calcul K/D ;

- calcul winrate ;

- GET /api/stats/me ;

- POST /api/stats/sync ;

- GET /api/leaderboards/solo ;

- dashboard front ;

- cartes statistiques ;

- page leaderboard ;

- seed de joueurs et statistiques ;

- données de démonstration crédibles.

### 5.4 Critères de validation

La milestone M2 est validée si :

- le dashboard affiche des statistiques ;

- le score est calculé côté back-end ;

- K/D et winrate sont cohérents ;

- la synchronisation mock fonctionne ;

- le leaderboard affiche plusieurs joueurs ;

- le classement est trié par score décroissant ;

- le MVP fonctionne sans Steam/Epic ;

- les états loading, error et empty sont gérés au minimum.

### 5.5 Risques associés

Risque : dépendance aux APIs externes.

Impact : démonstration instable.

Solution : utiliser MockProvider comme source P0 et garder Steam/Epic en intégration future documentée.

## 6 M3 — Équipes et chat fonctionnels

### 6.1 Objectif

Ajouter la dimension communautaire du projet : équipes, membres, invitations et chat temps réel.

### 6.2 Sprint associé

Sprint associé : Sprint 3 — Équipes et chat.

### 6.3 Livrables attendus

Livrables :

- modèles Team, TeamMember, TeamInvitation, ChatMessage ;

- TeamsModule ;

- ChatModule ;

- création d'équipe ;

- rejoindre une équipe via code ;

- rôles CAPTAIN et MEMBER ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- page équipe ;

- liste membres ;

- API messages ;

- Socket.io ;

- rooms team:{teamId} ;

- chat front ;

- seed équipe et messages.

### 6.4 Critères de validation

La milestone M3 est validée si :

- un utilisateur peut créer ou rejoindre une équipe ;

- le créateur devient CAPTAIN ;

- un membre peut consulter l'équipe ;

- un membre peut lire le chat ;

- un membre peut envoyer un message ;

- un non-membre ne peut pas lire le chat ;

- un membre simple ne peut pas exécuter une action capitaine ;

- les messages sont reçus en temps réel ou via fallback REST minimal ;

- les données seedées permettent une démonstration.

### 6.5 Risques associés

Risque : chat trop complexe ou mal sécurisé.

Impact : perte de temps ou faille visible.

Solution : limiter le MVP à historique, envoi, réception, room équipe et vérification membre.

## 7 M4 — MVP stabilisé et prêt pour soutenance

### 7.1 Objectif

Stabiliser l'application, corriger les bugs bloquants et préparer un scénario de démonstration fiable.

### 7.2 Sprint associé

Sprint associé : Sprint 4 — Polish et soutenance.

### 7.3 Livrables attendus

Livrables :

- tests P0 exécutés ;

- bugs bloquants corrigés ;

- Docker testé ;

- seed démo finalisé ;

- compte démo validé ;

- Swagger propre ;

- README mis à jour ;

- .env.example complet ;

- erreurs utilisateur améliorées ;

- responsive minimum vérifié ;

- captures de secours ;

- scénario de soutenance prêt.

### 7.4 Critères de validation

La milestone M4 est validée si :

- Docker démarre correctement ;

- le compte démo fonctionne ;

- le dashboard est rempli ;

- le leaderboard est visible ;

- l'équipe et le chat sont présentables ;

- les routes privées sont protégées ;

- les non-membres sont refusés sur le chat ;

- aucun secret n'est visible dans front, Swagger ou logs ;

- la recette soutenance est passée ;

- aucun bug P0 n'est ouvert.

### 7.5 Risques associés

Risque : bug de dernière minute.

Impact : soutenance compromise.

Solution : geler les nouvelles fonctionnalités avant la soutenance et corriger uniquement les bugs P0/P1.

## 8 M5 — Documentation et livraison finale validées

### 8.1 Objectif

Vérifier que la documentation, les livrables et le repository sont cohérents pour la remise finale.

### 8.2 Sprint associé

Sprint associé : Sprint 4 et phase finale de livraison.

### 8.3 Livrables attendus

Livrables :

- Drive organisé ;

- documents principaux remplis ;

- README final ;

- documentation d'installation ;

- documentation API ;

- documentation sécurité ;

- tests documentés ;

- backlog et roadmap cohérents ;

- diagrammes UML disponibles ;

- captures ou ressources de secours ;

- repository propre.

### 8.4 Critères de validation

La milestone M5 est validée si :

- les documents du Drive sont cohérents ;

- les liens importants fonctionnent ;

- les fichiers ne sont pas vides ;

- la documentation reflète le MVP réel ;

- le repository ne contient pas de secrets ;

- les instructions de lancement sont claires ;

- l'équipe peut expliquer les choix techniques et les limites du MVP.

## 9 Synthèse des milestones

| Milestone | Nom | Sprint associé | Résultat attendu |

|---|---|---|---|

| M0 | Socle projet prêt | Sprint 0 | Projet lançable et structure prête |

| M1 | Authentification fonctionnelle | Sprint 1 | Compte, login, JWT et routes privées |

| M2 | Stats et leaderboards fonctionnels | Sprint 2 | Dashboard, MockProvider, score et leaderboard |

| M3 | Équipes et chat fonctionnels | Sprint 3 | Équipe, rôles, invitations et chat sécurisé |

| M4 | MVP prêt soutenance | Sprint 4 | Démo stable, tests P0 validés |

| M5 | Livraison finale validée | Final | Documentation et repository propres |

## 10 Indicateurs de suivi

### 10.1 Indicateurs projet

Indicateurs utiles :

- nombre de tâches P0 terminées ;

- nombre de bugs bloquants ouverts ;

- état du Docker ;

- état du compte démo ;

- état du dashboard ;

- état du leaderboard ;

- état du chat ;

- état de la recette soutenance.

### 10.2 Statuts de milestone

Statuts recommandés :

- Non démarrée ;

- En cours ;

- En validation ;

- Validée ;

- Bloquée ;

- Reportée.

## 11 Règles de passage d'une milestone

Une milestone ne doit pas être validée si :

- une tâche P0 associée est incomplète ;

- un bug bloquant est ouvert ;

- la fonctionnalité n'est pas démontrable ;

- la sécurité minimale n'est pas respectée ;

- la documentation utile n'est pas à jour ;

- la Definition of Done n'est pas respectée.

## 12 Gestion des retards

### 12.1 Si une milestone prend du retard

Actions recommandées :

- identifier les tâches bloquantes ;

- reporter les tâches P1/P2 ;

- réduire le périmètre sans casser le MVP ;

- garder le mode démo stable ;

- documenter les éléments reportés ;

- éviter d'ajouter de nouvelles fonctionnalités non prévues.

### 12.2 Priorité en cas de manque de temps

Ordre de priorité :

1. Docker et lancement.

2. Authentification.

3. Dashboard.

4. Stats mockées.

5. Leaderboard.

6. Équipe.

7. Chat.

8. Sécurité minimale.

9. Recette soutenance.

10. Améliorations P1/P2.

## 13 Risques globaux

### 13.1 Risque : dépendance externe

Solution : MockProvider obligatoire pour le MVP.

### 13.2 Risque : sécurité oubliée

Solution : appliquer Standards-securite-dev, Tests-securite et Definition-of-Done.

### 13.3 Risque : documentation déconnectée du code

Solution : mettre à jour les documents quand le comportement réel change.

### 13.4 Risque : fonctionnalités trop nombreuses

Solution : protéger le périmètre MVP et reporter P1/P2.

### 13.5 Risque : démo instable

Solution : seed démo, captures de secours et recette soutenance.

## 14 Conclusion

Les milestones du projet Track'N Share permettent de contrôler l'avancement du MVP sans perdre de vue l'objectif principal : une application présentable, stable et cohérente pour la soutenance.

La progression recommandée est simple : préparer le socle, sécuriser l'authentification, afficher les statistiques, ajouter la dimension équipe/chat, puis stabiliser le tout pour la démonstration.

Chaque milestone doit être validée avec des critères concrets afin de garantir que le projet reste maîtrisable pour une équipe de deux personnes.
