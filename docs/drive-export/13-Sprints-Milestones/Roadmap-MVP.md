# ROADMAP MVP

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document présente la roadmap MVP de Track'N Share.

La roadmap sert à organiser le développement du projet dans un ordre logique, réaliste et cohérent avec la documentation déjà produite. Elle définit les grandes phases de travail, les priorités, les dépendances entre fonctionnalités et les livrables attendus avant la soutenance.

Le projet n'ayant pas encore commencé son développement, cette roadmap doit servir de guide initial. Elle pourra être ajustée selon l'avancement réel, les difficultés techniques et le temps disponible.

## 1 Vision du MVP

### 1.1 Objectif principal

Le MVP de Track'N Share doit permettre de démontrer une application web fonctionnelle où un joueur peut :

- créer un compte ;

- se connecter ;

- consulter son profil ;

- voir un dashboard de statistiques ;

- synchroniser ou générer des statistiques mockées ;

- consulter un leaderboard ;

- créer ou rejoindre une équipe ;

- utiliser un chat d'équipe ;

- se déconnecter proprement.

### 1.2 Objectif de soutenance

Pour la soutenance, l'application doit être présentable avec :

- un lancement simple via Docker ;

- un compte démo ;

- des données seedées ;

- un MockProvider stable ;

- un dashboard rempli ;

- un leaderboard crédible ;

- une équipe existante ;

- un chat fonctionnel ;

- une API documentée avec Swagger ;

- une sécurité minimale visible.

### 1.3 Principe de priorité

La roadmap privilégie les fonctionnalités démontrables et essentielles.

Le MVP ne doit pas dépendre de Steam ou Epic pour fonctionner. Les intégrations externes restent documentées et préparées, mais le MockProvider est prioritaire pour garantir une démo stable.

## 2 Découpage global

La roadmap est découpée en 5 sprints :

- Sprint 0 — Préparation technique et socle projet ;

- Sprint 1 — Authentification, utilisateurs et sécurité de base ;

- Sprint 2 — Statistiques, MockProvider et leaderboards ;

- Sprint 3 — Équipes, invitations et chat temps réel ;

- Sprint 4 — Polish, tests, correction, recette et soutenance.

Chaque sprint doit produire un résultat exploitable, même partiel.

## 3 Priorités MVP

### 3.1 P0 — Obligatoire pour la soutenance

Fonctionnalités P0 :

- repository organisé ;

- Docker Compose ;

- PostgreSQL ;

- Redis ;

- back-end NestJS ;

- front-end React ;

- configuration .env.example ;

- authentification JWT ;

- inscription ;

- connexion ;

- déconnexion ;

- dashboard ;

- MockProvider ;

- statistiques joueur ;

- calcul du score ;

- leaderboard solo ;

- création ou affichage équipe ;

- code invitation ou mécanisme de rejoindre ;

- chat d'équipe ;

- permissions membre/non-membre ;

- Swagger ;

- seed démo ;

- recette soutenance.

### 3.2 P1 — Important si le temps le permet

Fonctionnalités P1 :

- profil public ;

- modification profil ;

- pagination avancée ;

- filtres par jeu/saison ;

- leaderboard équipe ;

- notifications simples ;

- archivage saison manuel ;

- PWA installable ;

- refresh token ;

- rate limiting complet ;

- tests unitaires critiques ;

- CI GitHub Actions simple.

### 3.3 P2 — Évolutions futures

Fonctionnalités P2 :

- intégration Steam réelle ;

- intégration Epic/EOS réelle ;

- historique détaillé des statistiques ;

- badges ;

- analytics avancées ;

- tournois ;

- matchmaking ;

- monitoring Sentry ;

- Prometheus/Grafana ;

- tests E2E complets ;

- déploiement production avancé.

## 4 Sprint 0 — Préparation

### 4.1 Objectif

Mettre en place la base technique du projet avant de développer les fonctionnalités métier.

### 4.2 Livrables attendus

Livrables :

- repository GitHub créé ;

- branches principales définies ;

- GitHub Project/Kanban créé ;

- structure frontend/backend créée ;

- README initial ;

- .gitignore ;

- .env.example ;

- docker-compose.yml initial ;

- base PostgreSQL disponible ;

- Redis disponible ;

- NestJS initialisé ;

- React/Vite initialisé ;

- Swagger activable ;

- healthcheck API minimal.

### 4.3 Tâches principales

- Créer le repository.

- Configurer la branche main.

- Créer le GitHub Project.

- Mettre en place les conventions Git.

- Initialiser frontend React/TypeScript/Vite.

- Initialiser backend NestJS/TypeScript.

- Ajouter Docker Compose.

- Ajouter PostgreSQL.

- Ajouter Redis.

- Créer .env.example.

- Créer GET /api/health.

- Vérifier le lancement local.

### 4.4 Critères de fin

Le sprint 0 est terminé si :

- le projet démarre localement ;

- front-end et back-end sont séparés ;

- Docker démarre PostgreSQL et Redis ;

- l'API répond à /api/health ;

- la documentation de lancement initiale existe ;

- aucune clé réelle n'est committée.

## 5 Sprint 1 — Authentification

### 5.1 Objectif

Mettre en place l'inscription, la connexion, la session utilisateur et les premières protections de sécurité.

### 5.2 Livrables attendus

Livrables :

- modèle utilisateur ;

- migrations utilisateur ;

- RegisterDto ;

- LoginDto ;

- hash mot de passe ;

- JWT ;

- AuthModule ;

- UsersModule ;

- routes /auth/register, /auth/login, /users/me ;

- pages login/register ;

- stockage session côté front ;

- route protégée front ;

- logout ;

- Swagger auth ;

- compte démo initial.

### 5.3 Tâches principales

- Créer le modèle User.

- Ajouter la migration User.

- Implémenter l'inscription.

- Implémenter le hash de mot de passe.

- Implémenter la connexion.

- Générer un JWT.

- Créer JwtAuthGuard.

- Créer endpoint /api/users/me.

- Créer pages Login et Register.

- Gérer les erreurs de formulaire.

- Implémenter logout côté front.

- Protéger le dashboard.

- Documenter les endpoints dans Swagger.

### 5.4 Critères de fin

Le sprint 1 est terminé si :

- un utilisateur peut s'inscrire ;

- un utilisateur peut se connecter ;

- un utilisateur peut se déconnecter ;

- /api/users/me est protégé ;

- un token invalide est refusé ;

- aucun passwordHash n'est retourné ;

- le front redirige correctement selon l'état connecté/déconnecté.

## 6 Sprint 2 — Statistiques et leaderboards

### 6.1 Objectif

Mettre en place les statistiques joueur, le MockProvider, le calcul de score et le leaderboard solo.

### 6.2 Livrables attendus

Livrables :

- modèles Game, GameAccount, PlayerStats, Season ;

- MockProvider ;

- StatsModule ;

- LeaderboardsModule ;

- calcul K/D ;

- calcul winrate ;

- calcul score ;

- endpoint /api/stats/me ;

- endpoint /api/stats/sync ;

- endpoint /api/leaderboards/solo ;

- dashboard joueur ;

- page leaderboard ;

- seed de données statistiques ;

- données de démo crédibles.

### 6.3 Tâches principales

- Créer les modèles de données stats.

- Créer les migrations associées.

- Créer un jeu de référence pour le MVP.

- Implémenter MockProvider.

- Créer un service de normalisation des stats.

- Créer la formule de score.

- Créer endpoint stats utilisateur.

- Créer endpoint sync mock.

- Créer endpoint leaderboard solo.

- Ajouter pagination leaderboard.

- Créer les cartes dashboard.

- Afficher K/D, winrate, matchesPlayed, score.

- Afficher le leaderboard trié.

- Ajouter seed démo pour joueurs et stats.

### 6.4 Critères de fin

Le sprint 2 est terminé si :

- le dashboard affiche des stats ;

- le score est calculé côté back-end ;

- la sync mock fonctionne ;

- le leaderboard affiche plusieurs joueurs ;

- les joueurs sont triés par score ;

- les données seedées sont suffisantes pour la démo ;

- le MVP fonctionne sans Steam/Epic.

## 7 Sprint 3 — Équipes et chat

### 7.1 Objectif

Ajouter la dimension communautaire du MVP : équipes, invitations et chat temps réel.

### 7.2 Livrables attendus

Livrables :

- modèles Team, TeamMember, TeamInvitation, ChatMessage ;

- TeamsModule ;

- ChatModule ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- création équipe ;

- rejoindre équipe via code ;

- page équipe ;

- liste membres ;

- chat d'équipe ;

- Socket.io ;

- rooms team:{teamId} ;

- refus non-membre ;

- seed équipe et messages.

### 7.3 Tâches principales

- Créer modèles équipes et messages.

- Créer migrations associées.

- Implémenter création d'équipe.

- Attribuer le rôle CAPTAIN au créateur.

- Implémenter code invitation.

- Implémenter rejoindre équipe.

- Implémenter TeamMemberGuard.

- Implémenter TeamRoleGuard.

- Créer page équipe front.

- Afficher membres et rôles.

- Implémenter ChatGateway.

- Authentifier Socket.io.

- Créer room team:{teamId}.

- Envoyer et recevoir messages.

- Refuser les non-membres.

- Ajouter messages seedés.

### 7.4 Critères de fin

Le sprint 3 est terminé si :

- un utilisateur peut créer ou rejoindre une équipe ;

- un membre peut accéder au chat ;

- un non-membre ne peut pas lire le chat ;

- un message peut être envoyé ;

- les messages sont visibles dans l'équipe ;

- Socket.io fonctionne au minimum ;

- les rôles CAPTAIN/MEMBER sont respectés.

## 8 Sprint 4 — Polish et soutenance

### 8.1 Objectif

Stabiliser le MVP, corriger les bugs, améliorer l'UX, finaliser les tests et préparer la soutenance.

### 8.2 Livrables attendus

Livrables :

- recette soutenance validée ;

- bugs P0 corrigés ;

- données démo finalisées ;

- README à jour ;

- Swagger propre ;

- .env.example complet ;

- captures de secours ;

- scénario de présentation ;

- tests manuels réalisés ;

- checklist sécurité validée ;

- mode démo stable.

### 8.3 Tâches principales

- Exécuter Plan-tests-MVP.

- Exécuter Tests-API.

- Exécuter Tests-securite.

- Exécuter Recette-soutenance.

- Corriger les bugs bloquants.

- Améliorer les messages d'erreur.

- Vérifier responsive minimal.

- Vérifier logout et accès privés.

- Vérifier Docker sur machine propre.

- Finaliser seed démo.

- Finaliser Swagger.

- Préparer captures de secours.

- Préparer présentation orale.

### 8.4 Critères de fin

Le sprint 4 est terminé si :

- tous les tests P0 passent ;

- Docker démarre correctement ;

- le compte démo fonctionne ;

- dashboard, leaderboard, équipe et chat sont présentables ;

- aucun secret n'est visible ;

- le scénario de soutenance est prêt ;

- les bugs connus sont documentés ou corrigés.

## 9 Dépendances entre fonctionnalités

### 9.1 Dépendances principales

- Le dashboard dépend de l'authentification.

- Les stats dépendent du modèle utilisateur et du MockProvider.

- Le leaderboard dépend des stats et du score.

- Les équipes dépendent de l'utilisateur connecté.

- Le chat dépend des équipes et des permissions.

- La recette dépend du seed démo et du mode mock.

### 9.2 Ordre recommandé

Ordre de développement recommandé :

1. Setup technique.

2. Authentification.

3. Utilisateur connecté.

4. MockProvider.

5. Stats et score.

6. Dashboard.

7. Leaderboard.

8. Équipes.

9. Chat.

10. Tests et polish.

## 10 Répartition possible Ioanes / Clément

### 10.1 Ioanes

Responsabilités possibles :

- back-end NestJS ;

- base de données ;

- migrations ;

- auth JWT ;

- services stats ;

- MockProvider ;

- leaderboards ;

- teams API ;

- Socket.io côté back ;

- sécurité back-end.

### 10.2 Clément

Responsabilités possibles :

- front-end React ;

- routing ;

- pages login/register ;

- dashboard ;

- leaderboard UI ;

- page équipe ;

- chat UI ;

- intégration API ;

- responsive ;

- PWA ;

- parcours démo.

### 10.3 Zones communes

Zones à travailler ensemble :

- contrats API ;

- DTO et types ;

- formule de score ;

- structure des données mockées ;

- comportement chat ;

- tests de recette ;

- soutenance.

## 11 Milestones liées à la roadmap

### 11.1 M0 — Socle technique prêt

Correspond au Sprint 0.

Objectif : le projet démarre avec front, back, PostgreSQL et Redis.

### 11.2 M1 — Auth fonctionnelle

Correspond au Sprint 1.

Objectif : l'utilisateur peut s'inscrire, se connecter, accéder à son espace et se déconnecter.

### 11.3 M2 — Stats et leaderboard fonctionnels

Correspond au Sprint 2.

Objectif : le dashboard et le leaderboard affichent des données mockées crédibles.

### 11.4 M3 — Équipe et chat fonctionnels

Correspond au Sprint 3.

Objectif : les équipes et le chat temps réel sont exploitables.

### 11.5 M4 — MVP prêt soutenance

Correspond au Sprint 4.

Objectif : le parcours complet est stable et présentable.

## 12 Risques roadmap

### 12.1 Risque : MVP trop large

Impact : retard ou fonctionnalités incomplètes.

Solution : respecter les priorités P0 et reporter P1/P2.

### 12.2 Risque : dépendance Steam/Epic

Impact : démo instable.

Solution : MockProvider obligatoire pour le MVP.

### 12.3 Risque : chat trop complexe

Impact : perte de temps.

Solution : chat minimal : historique, envoi, réception, permissions.

### 12.4 Risque : Docker instable

Impact : soutenance compromise.

Solution : tester Docker dès le Sprint 0 et avant chaque milestone.

### 12.5 Risque : manque de tests

Impact : bugs en soutenance.

Solution : Sprint 4 dédié à la recette et aux corrections P0.

## 13 Critères d'acceptation de la roadmap

La roadmap est considérée pertinente si :

- elle découpe le MVP en phases logiques ;

- elle priorise les fonctionnalités indispensables ;

- elle évite la dépendance aux APIs externes ;

- elle permet une répartition claire des tâches ;

- elle aboutit à un parcours soutenance complet ;

- elle reste réaliste pour une équipe de deux personnes.

## 14 Conclusion

La roadmap MVP de Track'N Share doit guider le développement sans enfermer l'équipe dans un planning trop rigide.

La priorité est de construire un socle fiable, puis d'ajouter progressivement les fonctionnalités visibles : authentification, dashboard, statistiques, leaderboard, équipes et chat.

Le MockProvider et les données seedées sont essentiels pour garantir une démonstration stable. Les intégrations Steam/Epic, les tests avancés et les fonctionnalités communautaires plus poussées pourront venir après la validation du MVP.
