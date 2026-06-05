# STRATÉGIE DE TESTS

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit la stratégie de tests prévue pour Track'N Share.

Même si le développement n'a pas encore commencé, cette stratégie permet de préparer les vérifications à effectuer pendant le projet. Elle sert à garantir que les fonctionnalités principales du MVP seront testées, que les erreurs critiques seront détectées tôt et que la soutenance pourra se dérouler avec une application stable.

La stratégie couvre les tests front-end, back-end, API, sécurité, Socket.io, base de données, Docker, mode démo, intégrations externes et recette finale.

## 1 Vue d'ensemble

### 1.1 Pourquoi tester Track'N Share

Track'N Share manipule plusieurs fonctionnalités importantes :

- authentification ;

- profils joueurs ;

- statistiques ;

- leaderboards ;

- équipes ;

- invitations ;

- chat temps réel ;

- saisons ;

- archivage ;

- APIs externes Steam / Epic ou MockProvider ;

- PWA ;

- Docker ;

- données personnelles.

Ces fonctionnalités doivent être vérifiées pour éviter :

- bugs visibles en soutenance ;

- accès non autorisés ;

- erreurs de calcul de score ;

- leaderboards incohérents ;

- chat accessible aux mauvais utilisateurs ;

- application impossible à lancer ;

- mode démo instable ;

- dépendance trop forte à une API externe.

### 1.2 Objectif de la stratégie

Les tests doivent permettre de vérifier que :

- les fonctionnalités MVP fonctionnent ;

- les erreurs sont gérées proprement ;

- les permissions sont respectées ;

- les données affichées sont cohérentes ;

- l'application reste utilisable en mode démo ;

- Docker permet de lancer le projet ;

- le front et le back communiquent correctement ;

- les documents techniques restent alignés avec le comportement attendu.

### 1.3 Approche adaptée au MVP

Pour le MVP, l'objectif n'est pas de couvrir 100 % du code avec des tests automatisés.

L'objectif est d'avoir une stratégie réaliste :

- tests manuels structurés ;

- tests unitaires sur la logique critique ;

- tests API sur les endpoints principaux ;

- tests sécurité sur les accès sensibles ;

- tests de recette avant soutenance ;

- MockProvider pour éviter la dépendance à Steam/Epic.

## 2 Périmètre des tests

### 2.1 Fonctionnalités à tester

Fonctionnalités MVP prioritaires :

- inscription ;

- connexion ;

- déconnexion ;

- profil joueur ;

- dashboard ;

- statistiques mockées ;

- calcul du score ;

- leaderboard solo ;

- leaderboard équipe si prévu ;

- création d'équipe ;

- invitation ou code d'équipe ;

- chat d'équipe ;

- permissions d'équipe ;

- mode démo ;

- Docker ;

- Swagger ;

- healthchecks.

### 2.2 Fonctionnalités secondaires

Fonctionnalités à tester si elles sont développées :

- upload avatar ;

- notifications ;

- présence en ligne ;

- archivage automatique des saisons ;

- refresh token ;

- récupération de mot de passe ;

- intégration Steam réelle ;

- intégration Epic/EOS ;

- export utilisateur ;

- suppression / anonymisation de compte.

### 2.3 Hors périmètre MVP

Éléments pouvant rester hors périmètre complet pour le MVP :

- tests de charge avancés ;

- tests E2E complets automatisés ;

- tests de pénétration complets ;

- monitoring production avancé ;

- compatibilité navigateur exhaustive ;

- test de production réelle Steam/Epic à grande échelle.

## 3 Types de tests prévus

### 3.1 Tests unitaires

Les tests unitaires vérifient une fonction, un service ou une règle isolée.

Exemples :

- calcul du score ;

- calcul du K/D ;

- calcul du winrate ;

- éligibilité leaderboard ;

- génération de code invitation ;

- validation d'un rôle d'équipe ;

- mapping MockProvider vers modèle interne.

Priorité : élevée pour la logique métier critique.

### 3.2 Tests d'intégration

Les tests d'intégration vérifient que plusieurs composants fonctionnent ensemble.

Exemples :

- AuthController + AuthService ;

- StatsController + StatsService + MockProvider ;

- TeamController + TeamService + base de données ;

- ChatGateway + ChatService + permissions ;

- API + PostgreSQL ;

- API + Redis.

Priorité : moyenne à élevée selon complexité.

### 3.3 Tests API

Les tests API vérifient les endpoints REST.

Exemples :

- POST /api/auth/login ;

- GET /api/users/me ;

- GET /api/stats/me ;

- POST /api/stats/sync ;

- GET /api/leaderboards/solo ;

- POST /api/teams ;

- GET /api/teams/:teamId/messages.

Priorité : élevée pour les routes MVP.

### 3.4 Tests fonctionnels

Les tests fonctionnels vérifient les parcours utilisateur.

Exemples :

- un utilisateur crée un compte ;

- un utilisateur se connecte ;

- un utilisateur consulte son dashboard ;

- un utilisateur rejoint une équipe ;

- un membre envoie un message dans le chat ;

- un non-membre est refusé.

Priorité : très élevée pour la soutenance.

### 3.5 Tests de sécurité

Les tests sécurité vérifient les protections principales.

Exemples :

- route privée sans token refusée ;

- token invalide refusé ;

- utilisateur non propriétaire refusé ;

- non-membre refusé sur chat ;

- membre simple refusé sur action capitaine ;

- route admin refusée à un joueur ;

- rate limiting login ;

- absence de secrets dans les réponses API.

Priorité : très élevée.

### 3.6 Tests end-to-end

Les tests E2E simulent un parcours complet du point de vue utilisateur.

Exemples :

- login → dashboard → leaderboard → équipe → chat ;

- seed démo → compte démo → statistiques → chat ;

- utilisateur non connecté → redirection login.

Pour le MVP, ces tests peuvent d'abord être manuels. En évolution, ils peuvent être automatisés avec Playwright ou Cypress.

### 3.7 Tests de recette

La recette est la vérification finale avant soutenance.

Elle vérifie que l'application est présentable de bout en bout.

Exemples :

- Docker démarre ;

- compte démo fonctionne ;

- dashboard affiche les données ;

- leaderboard est cohérent ;

- chat fonctionne ;

- Swagger est accessible si prévu ;

- aucune API externe n'est obligatoire.

## 4 Priorisation des tests

### 4.1 Priorité P0

Tests indispensables avant soutenance :

- inscription ;

- login ;

- logout ;

- routes privées protégées ;

- dashboard joueur ;

- stats mockées ;

- calcul du score ;

- leaderboard solo ;

- création ou accès équipe ;

- chat membre ;

- refus non-membre ;

- Docker ;

- seed démo ;

- MockProvider ;

- absence de secrets dans le front et les logs.

### 4.2 Priorité P1

Tests importants mais moins bloquants :

- upload avatar si développé ;

- notifications ;

- archivage de saison ;

- refresh token ;

- rate limiting avancé ;

- tests d'intégration base/Redis ;

- Swagger complet ;

- tests responsive mobile ;

- tests PWA offline.

### 4.3 Priorité P2

Tests d'évolution :

- E2E automatisés ;

- tests de charge ;

- scan sécurité avancé ;

- tests production Steam/Epic ;

- tests multi-navigateurs avancés ;

- tests de monitoring/alerting.

## 5 Stratégie de test front-end

### 5.1 Objectif

Le front-end doit être testé pour vérifier :

- affichage correct ;

- navigation ;

- intégration API ;

- gestion des erreurs ;

- responsive ;

- états loading/empty/error ;

- comportement après déconnexion ;

- compatibilité avec le mode démo.

### 5.2 Pages à vérifier

Pages MVP :

- landing page ;

- inscription ;

- connexion ;

- dashboard ;

- profil ;

- leaderboard ;

- équipe ;

- chat ;

- paramètres ;

- page 404.

### 5.3 États à tester

Chaque page importante doit gérer :

- chargement ;

- succès ;

- absence de données ;

- erreur API ;

- accès refusé ;

- session expirée ;

- mode démo.

### 5.4 Tests manuels front-end

Exemples :

- vérifier que le login redirige vers le dashboard ;

- vérifier qu'un 401 renvoie vers la page de connexion ;

- vérifier que le leaderboard affiche un état vide si aucune donnée ;

- vérifier que le chat affiche les nouveaux messages ;

- vérifier que le logout nettoie les données utilisateur.

## 6 Stratégie de test back-end

### 6.1 Objectif

Le back-end doit être testé pour vérifier :

- services métier ;

- endpoints REST ;

- guards ;

- DTO ;

- erreurs ;

- base de données ;

- Redis ;

- providers externes ;

- Socket.io.

### 6.2 Tests unitaires back-end prioritaires

Tests recommandés :

- AuthService ;

- StatsService ;

- calculatePlayerScore ;

- LeaderboardService ;

- TeamService ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- MockProvider ;

- SeasonArchiveService.

### 6.3 Tests d'intégration back-end

Tests recommandés :

- login avec utilisateur existant ;

- login avec mauvais mot de passe ;

- route protégée sans token ;

- création équipe ;

- accès équipe par membre ;

- accès équipe par non-membre ;

- sync stats mock ;

- leaderboard avec données seedées.

## 7 Stratégie de test API

### 7.1 Objectif

Les tests API doivent vérifier que les endpoints respectent :

- les conventions API ;

- les statuts HTTP ;

- le format JSON ;

- les permissions ;

- la validation ;

- les erreurs prévues.

### 7.2 Outils possibles

Outils manuels :

- Swagger ;

- Postman ;

- Insomnia ;

- cURL.

Outils automatisés :

- Jest ;

- Supertest ;

- tests e2e NestJS.

### 7.3 Vérifications API générales

Pour chaque endpoint :

- cas succès ;

- payload invalide ;

- token absent ;

- token invalide ;

- accès interdit ;

- ressource introuvable ;

- format de réponse ;

- absence de données sensibles.

## 8 Stratégie de test sécurité

### 8.1 Objectif

Les tests sécurité doivent vérifier les protections essentielles du MVP.

### 8.2 Axes de test

Axes prioritaires :

- authentification ;

- autorisation ;

- ownership ;

- rôles d'équipe ;

- validation DTO ;

- rate limiting ;

- logs sans secrets ;

- données sensibles non retournées ;

- Socket.io protégé.

### 8.3 Tests sécurité minimums

- accès dashboard sans token refusé ;

- accès profil autre utilisateur refusé si privé ;

- modification profil autre utilisateur refusée ;

- accès chat non-membre refusé ;

- suppression équipe par membre simple refusée ;

- route admin refusée à PLAYER ;

- login bruteforce limité ;

- message chat trop long refusé ;

- token expiré refusé ;

- passwordHash absent des réponses.

## 9 Stratégie de test Socket.io

### 9.1 Objectif

Socket.io doit être testé pour garantir que le chat temps réel reste sécurisé et fonctionnel.

### 9.2 Tests prioritaires

- connexion socket avec token valide ;

- connexion socket sans token refusée ;

- join room équipe par membre accepté ;

- join room équipe par non-membre refusé ;

- envoi message par membre accepté ;

- envoi message par non-membre refusé ;

- message reçu uniquement par membres de la room ;

- rate limiting chat ;

- déconnexion propre.

### 9.3 Vérification manuelle

Pour la soutenance, il est utile de tester avec deux comptes :

- un membre de l'équipe ;

- un utilisateur extérieur.

## 10 Stratégie de test base de données

### 10.1 Objectif

Vérifier que les données sont stockées correctement et que les relations sont cohérentes.

### 10.2 Tests prioritaires

- utilisateur créé avec email unique ;

- mot de passe hashé ;

- profil relié à utilisateur ;

- stats reliées à utilisateur, jeu et saison ;

- équipe reliée aux membres ;

- messages reliés à équipe ;

- leaderboard calculé depuis stats ;

- suppression/anonymisation prévue.

### 10.3 Migrations

Les migrations doivent être testées sur une base locale ou de test avant d'être considérées prêtes.

## 11 Stratégie de test Redis

### 11.1 Objectif

Vérifier que Redis fonctionne pour les usages prévus.

Usages possibles :

- cache ;

- rate limiting ;

- locks ;

- leaderboards rapides ;

- présence en ligne.

### 11.2 Tests prioritaires

- connexion Redis au démarrage ;

- clé de rate limiting créée ;

- TTL appliqué ;

- lock de sync stats libéré ;

- fallback prévu si Redis indisponible.

## 12 Stratégie de test providers externes

### 12.1 MockProvider

Le MockProvider est prioritaire pour le MVP.

Tests à prévoir :

- données mockées cohérentes ;

- stats générées ;

- score calculable ;

- leaderboard rempli ;

- mode démo stable ;

- pas besoin de Steam/Epic.

### 12.2 SteamProvider

Si activé :

- clé absente → provider désactivé ;

- profil privé → erreur contrôlée ;

- timeout → fallback ;

- réponse invalide → mapping failed ;

- clé jamais exposée.

### 12.3 EpicProvider

Si activé plus tard :

- configuration incomplète → provider désactivé ;

- secret côté back uniquement ;

- absence d'API stats universelle prise en compte ;

- fallback mock disponible.

## 13 Stratégie de test Docker et déploiement

### 13.1 Objectif

Vérifier que le projet est lançable facilement.

### 13.2 Tests Docker prioritaires

- docker compose up --build fonctionne ;

- backend démarre ;

- frontend démarre ;

- PostgreSQL démarre ;

- Redis démarre ;

- backend se connecte à PostgreSQL ;

- backend se connecte à Redis ;

- migrations exécutables ;

- seed démo exécutable ;

- compte démo utilisable.

### 13.3 Tests de configuration

- .env.example complet ;

- .env non commité ;

- variables Docker correctes ;

- ports disponibles ;

- mode mock activé pour soutenance.

## 14 Stratégie de test PWA

### 14.1 Objectif

Vérifier que le comportement PWA ne met pas en danger les données privées.

### 14.2 Tests MVP

- application installable si PWA activée ;

- assets statiques chargés ;

- page offline neutre ;

- données privées non visibles après logout ;

- pas de secret dans le cache ;

- navigation correcte après refresh.

## 15 Environnements de test

### 15.1 Développement local

Utilisé pour :

- tests rapides ;

- tests manuels ;

- tests front/back ;

- Docker ;

- Swagger.

### 15.2 Test avec données seedées

Utilisé pour :

- valider les parcours ;

- tester les leaderboards ;

- tester le chat ;

- préparer la soutenance.

### 15.3 CI future

Utilisée pour :

- lint ;

- build ;

- tests unitaires ;

- tests d'intégration ;

- build Docker.

### 15.4 Soutenance

Environnement à stabiliser fortement.

Configuration recommandée :

- DEMO_MODE=true ;

- MOCK_PROVIDER_ENABLED=true ;

- EXTERNAL_API_MODE=mock ;

- Steam/Epic désactivés ;

- PostgreSQL local ;

- Redis local ;

- données seedées.

## 16 Données de test

### 16.1 Principes

Les données de test doivent être :

- fictives ;

- cohérentes ;

- reproductibles ;

- suffisantes pour démontrer le projet ;

- sans vraie donnée personnelle.

### 16.2 Données minimales

Données recommandées :

- 1 compte démo principal ;

- plusieurs joueurs fictifs ;

- plusieurs jeux ;

- plusieurs saisons ;

- statistiques variées ;

- leaderboards remplis ;

- plusieurs équipes ;

- messages de chat ;

- notifications éventuelles.

### 16.3 Données interdites

Ne pas utiliser :

- vrais emails ;

- vrais mots de passe personnels ;

- vraies identités ;

- vrais tokens ;

- clés Steam/Epic ;

- données personnelles réelles.

## 17 Outils recommandés

### 17.1 Outils MVP

- Swagger ;

- Postman ou Insomnia ;

- console navigateur ;

- docker compose logs ;

- Jest pour back-end ;

- React Testing Library si tests front ;

- tests manuels documentés.

### 17.2 Outils futurs

- Supertest pour API ;

- Playwright ou Cypress pour E2E ;

- Sentry pour erreurs ;

- npm audit ou pnpm audit ;

- GitHub Actions pour CI.

## 18 Organisation des tests dans le projet

### 18.1 Back-end

Emplacements possibles :

- tests proches du code : stats.service.spec.ts ;

- dossier test/unit ;

- dossier test/integration ;

- dossier test/e2e.

### 18.2 Front-end

Emplacements possibles :

- fichiers .test.tsx proches des composants ;

- dossier __tests__ ;

- dossier tests/.

### 18.3 Documentation Drive

Les tests doivent être documentés dans :

- Strategie-tests ;

- Plan-tests-MVP ;

- Cas-tests-fonctionnels ;

- Tests-API ;

- Tests-securite ;

- Recette-soutenance.

## 19 Critères de validation avant soutenance

Avant soutenance, il faut valider :

- application lancée avec Docker ;

- migrations passées ;

- seed démo présent ;

- compte démo fonctionnel ;

- login/logout ;

- dashboard ;

- stats ;

- leaderboard ;

- équipe ;

- chat ;

- Swagger si prévu ;

- mode mock ;

- aucune API externe obligatoire ;

- aucun secret visible.

## 20 Gestion des anomalies

### 20.1 Classification

Bloquant :

- impossible de se connecter ;

- Docker ne démarre pas ;

- dashboard inaccessible ;

- chat inutilisable ;

- faille d'accès majeure ;

- données démo absentes.

Majeur :

- bug visible mais contournable ;

- erreur sur une fonctionnalité secondaire ;

- affichage responsive imparfait ;

- message d'erreur peu clair.

Mineur :

- faute de texte ;

- petit souci visuel ;

- comportement non bloquant ;

- amélioration ergonomique.

### 20.2 Suivi

Chaque anomalie doit être ajoutée dans GitHub Project ou issue GitHub avec :

- titre ;

- description ;

- étapes de reproduction ;

- résultat attendu ;

- résultat obtenu ;

- priorité ;

- responsable si possible.

## 21 Règle de validation d'une tâche

Une tâche est validée si :

- les critères d'acceptation sont respectés ;

- les tests prévus sont passés ;

- aucune régression critique n'est observée ;

- la documentation est mise à jour si nécessaire ;

- la Definition of Done est respectée.

## 22 Plan d'amélioration progressif

Phase 1 — Avant développement

- rédiger stratégie de tests ;

- définir cas de tests ;

- définir recette soutenance ;

- identifier tests sécurité.

Phase 2 — Début développement

- tests manuels structurés ;

- tests unitaires du score ;

- tests AuthService ;

- tests MockProvider.

Phase 3 — MVP fonctionnel

- tests API principaux ;

- tests permissions ;

- tests chat ;

- tests Docker ;

- tests seed démo.

Phase 4 — Avant soutenance

- recette complète ;

- correction anomalies bloquantes ;

- vérification mode démo ;

- vérification documentation.

Phase 5 — Après MVP

- tests E2E ;

- CI complète ;

- tests de charge simples ;

- scan sécurité ;

- monitoring.

## 23 Risques et solutions

### 23.1 Risque : absence de tests automatisés

Impact : régressions difficiles à détecter.

Solution : commencer par tests unitaires critiques et recette manuelle structurée.

### 23.2 Risque : tests trop ambitieux

Impact : perte de temps avant MVP.

Solution : prioriser P0 puis ajouter P1/P2.

### 23.3 Risque : dépendance aux APIs externes

Impact : soutenance instable.

Solution : MockProvider et données seedées.

### 23.4 Risque : données de test incohérentes

Impact : démo peu crédible.

Solution : seeders cohérents et reproductibles.

### 23.5 Risque : sécurité non testée

Impact : accès non autorisés.

Solution : tests JWT, guards, rôles, chat et permissions.

### 23.6 Risque : Docker non testé

Impact : projet impossible à lancer.

Solution : inclure Docker dans la recette MVP.

## 24 Critères d'acceptation

La stratégie de tests est considérée complète si :

- les types de tests sont définis ;

- les priorités P0/P1/P2 sont claires ;

- les fonctionnalités MVP à tester sont identifiées ;

- le front-end est couvert par des scénarios ;

- le back-end est couvert par des scénarios ;

- l'API est couverte par des scénarios ;

- la sécurité est prise en compte ;

- Socket.io est pris en compte ;

- Docker et le mode démo sont pris en compte ;

- les données de test sont définies ;

- la recette soutenance est prévue ;

- la stratégie reste réaliste avant développement.

## 25 Conclusion

La stratégie de tests de Track'N Share doit rester réaliste, progressive et centrée sur le MVP.

Le projet n'a pas encore commencé son développement, donc l'objectif est de préparer une base claire : quoi tester, comment le tester, avec quelles priorités et dans quel environnement.

Pour la soutenance, les éléments les plus importants sont : Docker, compte démo, MockProvider, dashboard, statistiques, leaderboards, équipes, chat et sécurité minimale.

Les tests automatisés pourront être ajoutés progressivement, en commençant par la logique critique : authentification, calcul de score, permissions, MockProvider et endpoints API principaux.
