# SPRINT 1 — AUTHENTIFICATION

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le Sprint 1 du projet Track'N Share.

Le Sprint 1 correspond à la mise en place de l'authentification, des utilisateurs et des premières protections de sécurité. Il doit permettre à un joueur de créer un compte, se connecter, accéder à son espace privé, consulter son identité connectée et se déconnecter proprement.

Ce sprint est prioritaire car toutes les fonctionnalités suivantes du MVP dépendent de l'utilisateur connecté : dashboard, statistiques, leaderboards personnalisés, équipes, invitations et chat.

## 1 Objectif du Sprint 1

### 1.1 Objectif principal

Mettre en place un système d'authentification fonctionnel, sécurisé et exploitable par le front-end.

À la fin du sprint, un utilisateur doit pouvoir :

- créer un compte ;

- se connecter ;

- recevoir un token d'accès ;

- accéder à une route protégée ;

- être redirigé correctement côté front ;

- se déconnecter ;

- utiliser un compte démo pour la soutenance.

### 1.2 Objectifs secondaires

Le Sprint 1 doit aussi permettre de :

- créer le modèle User ;

- valider les données entrantes avec des DTO ;

- hasher les mots de passe ;

- empêcher le retour du passwordHash au front ;

- protéger les routes privées avec un guard JWT ;

- préparer Swagger pour les endpoints d'authentification ;

- mettre en place la base du store utilisateur côté front ;

- sécuriser les erreurs de connexion avec des messages génériques.

## 2 Périmètre du Sprint 1

### 2.1 Inclus

Le Sprint 1 inclut :

- modèle utilisateur ;

- migration utilisateur ;

- AuthModule ;

- UsersModule ;

- RegisterDto ;

- LoginDto ;

- hash du mot de passe ;

- endpoint POST /api/auth/register ;

- endpoint POST /api/auth/login ;

- endpoint GET /api/users/me ;

- JwtAuthGuard ;

- page Register ;

- page Login ;

- gestion de session côté front ;

- protection du dashboard ;

- logout ;

- compte démo initial ;

- documentation Swagger des routes d'auth.

### 2.2 Non inclus

Le Sprint 1 ne doit pas inclure :

- statistiques joueur complètes ;

- MockProvider de statistiques ;

- leaderboards ;

- équipes ;

- chat ;

- refresh token avancé ;

- OAuth Steam/Epic ;

- vérification email complète ;

- mot de passe oublié complet ;

- administration ;

- tests E2E avancés.

## 3 Durée recommandée

Durée indicative : 4 à 6 jours de travail selon disponibilité.

Ce sprint doit rester concentré sur un parcours simple et fiable : inscription, connexion, accès privé, déconnexion. Les améliorations avancées d'authentification peuvent être reportées en P1 si le temps manque.

## 4 Livrables attendus

Livrables principaux :

- table User créée ;

- migration User prête ;

- AuthModule fonctionnel ;

- UsersModule fonctionnel ;

- DTO de register et login ;

- validation des champs email, username et password ;

- hash sécurisé du mot de passe ;

- endpoint POST /api/auth/register ;

- endpoint POST /api/auth/login ;

- endpoint GET /api/users/me protégé ;

- JwtAuthGuard opérationnel ;

- pages Login et Register côté front ;

- route dashboard protégée ;

- logout fonctionnel ;

- compte demo@tracknshare.local créé via seed ;

- Swagger mis à jour ;

- première milestone M1 validable.

## 5 Tâches du Sprint 1

### 5.1 TNS-101 — Créer le modèle User

Priorité : P0

Responsable possible : Ioanes

Description : créer le modèle de données représentant un utilisateur Track'N Share.

À faire :

- créer l'entité ou le modèle User ;

- ajouter les champs id, email, username, passwordHash, role, createdAt, updatedAt ;

- imposer l'unicité de l'email ;

- préparer le rôle par défaut PLAYER ;

- créer la migration associée.

Critères d'acceptation :

- table User créée ;

- email unique ;

- passwordHash stocké côté back uniquement ;

- migration exécutable ;

- modèle compatible avec les futurs modules stats, équipes et messages.

### 5.2 TNS-102 — Implémenter l'inscription

Priorité : P0

Responsable possible : Ioanes

Description : permettre à un visiteur de créer un compte utilisateur.

À faire :

- créer RegisterDto ;

- valider email, username et password ;

- vérifier que l'email n'est pas déjà utilisé ;

- hasher le mot de passe ;

- enregistrer l'utilisateur ;

- retourner l'utilisateur sans passwordHash.

Critères d'acceptation :

- endpoint POST /api/auth/register disponible ;

- inscription valide acceptée ;

- inscription invalide refusée ;

- email déjà utilisé géré proprement ;

- passwordHash jamais renvoyé au front.

### 5.3 TNS-103 — Implémenter la connexion JWT

Priorité : P0

Responsable possible : Ioanes

Description : permettre à un utilisateur existant de se connecter.

À faire :

- créer LoginDto ;

- rechercher l'utilisateur par email ;

- comparer le mot de passe avec le hash ;

- générer un access token JWT ;

- retourner le token et les informations publiques de l'utilisateur.

Critères d'acceptation :

- endpoint POST /api/auth/login disponible ;

- accessToken généré ;

- échec de connexion avec message générique ;

- aucun détail sensible exposé ;

- user retourné sans passwordHash.

### 5.4 TNS-104 — Créer JwtAuthGuard

Priorité : P0

Responsable possible : Ioanes

Description : protéger les routes privées du back-end.

À faire :

- configurer Passport/JWT ou équivalent NestJS ;

- extraire le token Bearer ;

- vérifier la signature JWT ;

- injecter l'utilisateur dans la requête ;

- refuser les tokens absents ou invalides.

Critères d'acceptation :

- route privée refusée sans token ;

- token invalide refusé ;

- token valide accepté ;

- utilisateur connecté accessible dans le contrôleur.

### 5.5 TNS-105 — Créer endpoint utilisateur connecté

Priorité : P0

Responsable possible : Ioanes

Description : fournir au front l'utilisateur actuellement connecté.

À faire :

- créer GET /api/users/me ;

- appliquer JwtAuthGuard ;

- retourner id, email, username, role ;

- exclure passwordHash ;

- documenter la route dans Swagger.

Critères d'acceptation :

- token requis ;

- utilisateur connecté retourné ;

- passwordHash absent ;

- route testable via Swagger.

### 5.6 TNS-106 — Créer pages Login et Register

Priorité : P0

Responsable possible : Clément

Description : créer les interfaces d'inscription et de connexion.

À faire :

- créer page /register ;

- créer page /login ;

- créer formulaires contrôlés ;

- afficher les erreurs ;

- appeler l'API ;

- rediriger après connexion.

Critères d'acceptation :

- formulaires fonctionnels ;

- erreurs visibles ;

- redirection après login ;

- responsive minimal ;

- design cohérent avec Track'N Share.

### 5.7 TNS-107 — Gérer la session côté front

Priorité : P0

Responsable possible : Clément

Description : conserver l'état connecté dans l'application front.

À faire :

- créer store utilisateur ;

- stocker le token selon la stratégie retenue ;

- ajouter le token dans les appels API ;

- protéger les routes privées ;

- nettoyer les données au logout.

Critères d'acceptation :

- utilisateur connecté stocké ;

- dashboard inaccessible sans connexion ;

- logout supprime les données de session ;

- redirection correcte si session absente.

### 5.8 TNS-108 — Créer compte démo initial

Priorité : P0

Responsable possible : Ioanes

Description : préparer un compte utilisable pour la soutenance.

À faire :

- créer seed utilisateur démo ;

- utiliser un email local de type demo@tracknshare.local ;

- attribuer le rôle PLAYER ;

- documenter l'accès sans exposer de secret réel ;

- préparer ce compte pour les seeds des sprints suivants.

Critères d'acceptation :

- compte démo créé par seed ;

- compte utilisable pour login ;

- rôle non administrateur ;

- prêt à recevoir stats, équipe et messages.

## 6 Répartition possible

### 6.1 Ioanes

Tâches principales possibles :

- modèle User ;

- migration ;

- AuthModule ;

- UsersModule ;

- register/login ;

- hash mot de passe ;

- JWT ;

- JwtAuthGuard ;

- endpoint /users/me ;

- Swagger auth ;

- seed compte démo.

### 6.2 Clément

Tâches principales possibles :

- pages login/register ;

- formulaires ;

- affichage erreurs ;

- route protégée front ;

- store utilisateur ;

- logout ;

- intégration API auth ;

- responsive minimal.

### 6.3 Tâches communes

À faire ensemble :

- définir le format des erreurs API ;

- valider le format de réponse login ;

- tester le parcours complet ;

- vérifier Swagger ;

- préparer les tâches du Sprint 2.

## 7 Dépendances

### 7.1 Dépendances internes

- Sprint 1 dépend du Sprint 0 pour le back-end, le front-end, la base et Docker.

- Sprint 2 dépend du Sprint 1 pour associer les statistiques à un utilisateur.

- Sprint 3 dépend du Sprint 1 pour les équipes et les permissions.

- Le compte démo créé ici servira aux données seedées des sprints suivants.

### 7.2 Dépendances techniques

- PostgreSQL disponible ;

- variables JWT configurées ;

- CORS configuré ;

- front capable d'appeler l'API ;

- Swagger accessible en développement.

## 8 Definition of Done du Sprint 1

Le Sprint 1 est terminé si :

- un utilisateur peut s'inscrire ;

- un utilisateur peut se connecter ;

- un JWT est généré ;

- une route protégée refuse les utilisateurs non connectés ;

- /api/users/me retourne l'utilisateur connecté ;

- aucun passwordHash n'est renvoyé ;

- le front gère login/register/logout ;

- le dashboard est protégé ;

- le compte démo fonctionne ;

- Swagger documente les routes principales ;

- aucun secret réel n'est présent dans le dépôt.

## 9 Tests à réaliser pendant le Sprint 1

### 9.1 Tests API

- POST /api/auth/register avec données valides ;

- POST /api/auth/register avec email invalide ;

- POST /api/auth/register avec email déjà utilisé ;

- POST /api/auth/login avec bon mot de passe ;

- POST /api/auth/login avec mauvais mot de passe ;

- GET /api/users/me sans token ;

- GET /api/users/me avec token invalide ;

- GET /api/users/me avec token valide.

### 9.2 Tests front

- affichage page login ;

- affichage page register ;

- inscription depuis le front ;

- connexion depuis le front ;

- redirection dashboard ;

- logout ;

- accès dashboard sans session refusé ;

- erreurs affichées proprement.

### 9.3 Tests sécurité minimum

- passwordHash absent des réponses ;

- mot de passe non loggé ;

- JWT_SECRET non exposé ;

- message d'erreur de login générique ;

- compte démo non administrateur.

## 10 Risques du Sprint 1

### 10.1 Risque : stockage du token mal sécurisé

Impact : faille de sécurité potentielle.

Solution : documenter la stratégie retenue et éviter d'exposer inutilement les tokens.

### 10.2 Risque : erreurs API trop détaillées

Impact : fuite d'information sur les comptes existants.

Solution : utiliser des messages génériques pour les échecs de connexion.

### 10.3 Risque : passwordHash exposé

Impact : faille critique.

Solution : créer une méthode de sérialisation utilisateur et vérifier toutes les réponses.

### 10.4 Risque : front et back désynchronisés

Impact : formulaires inutilisables.

Solution : valider ensemble les contrats API avant intégration.

### 10.5 Risque : vouloir ajouter trop de fonctionnalités auth

Impact : retard sur le MVP.

Solution : garder refresh token, email verification et reset password en P1/P2.

## 11 Checklist de fin Sprint 1

- Modèle User créé.

- Migration User créée.

- RegisterDto créé.

- LoginDto créé.

- Hash mot de passe actif.

- Register fonctionnel.

- Login fonctionnel.

- JWT généré.

- JwtAuthGuard actif.

- /api/users/me protégé.

- Pages login/register prêtes.

- Store utilisateur prêt.

- Logout fonctionnel.

- Dashboard protégé.

- Compte démo créé.

- Swagger auth mis à jour.

- Aucun passwordHash retourné.

- Aucun secret dans Git.

## 12 Passage au Sprint 2

Le passage au Sprint 2 est possible quand :

- l'utilisateur connecté est disponible côté back ;

- le front peut récupérer l'utilisateur courant ;

- le compte démo existe ;

- les routes privées fonctionnent ;

- les futures stats peuvent être liées à un userId ;

- le parcours login → dashboard → logout est stable.

## 13 Conclusion

Le Sprint 1 rend Track'N Share utilisable par un joueur connecté.

Il ne produit pas encore les statistiques ou les leaderboards, mais il crée la base indispensable du MVP : l'identité utilisateur, les routes protégées, la session front et le compte démo.

Une authentification propre permettra d'enchaîner sur le Sprint 2 avec les statistiques, le MockProvider, le score et le leaderboard solo.
