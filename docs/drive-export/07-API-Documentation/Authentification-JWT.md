# AUTHENTIFICATION JWT

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit le système d'authentification JWT prévu pour Track'N Share.

Il sert de référence pour l'implémentation back-end NestJS, l'intégration front-end React/PWA, la protection des routes, la gestion des rôles, la sécurité des tokens et les tests d'authentification.

L'objectif est de permettre à un utilisateur de créer un compte, se connecter, accéder aux fonctionnalités privées, se déconnecter proprement et protéger ses données personnelles.

## 1 Vue d'ensemble

### 1.1 Rôle de l'authentification

L'authentification permet de vérifier l'identité d'un utilisateur.

Dans Track'N Share, elle est nécessaire pour :

- accéder au dashboard ;

- consulter ses statistiques personnelles ;

- modifier son profil ;

- lier un compte de jeu ;

- synchroniser ses statistiques ;

- créer ou rejoindre une équipe ;

- utiliser le chat d'équipe ;

- consulter les notifications ;

- accéder aux paramètres du compte ;

- effectuer des actions d'administration si le rôle le permet.

### 1.2 Technologie retenue

La stratégie retenue pour le MVP est une authentification basée sur JWT.

JWT signifie JSON Web Token.

Un JWT est un jeton signé contenant des informations minimales sur l'utilisateur. Il permet au back-end de reconnaître un utilisateur sur les requêtes suivantes sans avoir à refaire une connexion complète à chaque appel API.

### 1.3 Stack concernée

Front-end :

- React ;

- TypeScript ;

- PWA ;

- Wouter pour les routes ;

- Valtio pour l'état utilisateur.

Back-end :

- NestJS ;

- TypeScript ;

- Passport JWT ou guard personnalisé ;

- JwtService ;

- AuthGuard ;

- RolesGuard ;

- bcrypt ou Argon2 ;

- class-validator pour les DTO.

Base de données :

- PostgreSQL recommandé pour les utilisateurs ;

- Redis possible pour sessions, blacklist, rate limiting ou refresh tokens ;

- Redis-JSON possible selon contrainte projet.

## 2 Principes JWT

### 2.1 Fonctionnement général

Le fonctionnement général est le suivant :

1. L'utilisateur envoie son email et son mot de passe.

2. Le back-end vérifie les identifiants.

3. Si les identifiants sont valides, le back-end génère un JWT.

4. Le front-end utilise ce JWT pour appeler les routes protégées.

5. Le back-end vérifie le JWT à chaque requête protégée.

6. Si le JWT est valide, la requête est autorisée.

7. Si le JWT est invalide ou expiré, la requête est refusée.

### 2.2 Access token

L'access token est le token utilisé pour accéder aux routes protégées.

Caractéristiques recommandées :

- durée de vie courte ;

- signé avec un secret serveur ;

- envoyé avec les requêtes API ;

- contient uniquement les informations nécessaires.

Durée recommandée MVP :

- 15 minutes à 1 heure.

Pour un projet étudiant, une durée de 1 heure peut être plus simple à gérer. Pour une application en production, une durée plus courte est préférable.

### 2.3 Refresh token

Le refresh token permet de générer un nouvel access token sans forcer l'utilisateur à se reconnecter.

Caractéristiques recommandées :

- durée de vie plus longue ;

- stocké de manière plus sécurisée ;

- peut être révoqué ;

- utile pour améliorer l'expérience utilisateur.

Durée recommandée :

- 7 jours à 30 jours selon stratégie retenue.

Priorité : P1.

Pour le MVP, il est possible de commencer avec seulement un access token, puis d'ajouter le refresh token après stabilisation.

### 2.4 Payload JWT

Le payload JWT doit rester minimal.

Payload recommandé :

{

"sub": "user_123",

"username": "ClementTNS",

"role": "PLAYER",

"iat": 1715000000,

"exp": 1715003600

}

Champs :

- sub : identifiant unique de l'utilisateur ;

- username : pseudo utile côté front ;

- role : rôle applicatif ;

- iat : date d'émission ;

- exp : date d'expiration.

Informations à ne pas mettre dans le JWT :

- mot de passe ;

- hash de mot de passe ;

- tokens externes ;

- email si non nécessaire ;

- messages ;

- données sensibles ;

- secrets techniques.

## 3 Stratégie recommandée pour Track'N Share

### 3.1 Stratégie MVP simple

Pour le MVP, la stratégie recommandée est :

- inscription avec email, pseudo et mot de passe ;

- hash du mot de passe avec Argon2 ou bcrypt ;

- connexion avec email et mot de passe ;

- génération d'un access token JWT ;

- envoi du token au front-end ;

- utilisation du token sur les routes privées ;

- suppression du token côté front à la déconnexion ;

- expiration gérée proprement côté front.

Cette stratégie est suffisante pour :

- dashboard ;

- profils privés ;

- statistiques ;

- équipes ;

- chat ;

- PWA ;

- mode démo.

### 3.2 Stratégie plus sécurisée avec refresh token

Pour une version plus avancée :

- access token court ;

- refresh token long ;

- refresh token stocké en cookie HttpOnly ;

- rotation des refresh tokens ;

- invalidation au logout ;

- table de sessions ou refresh tokens en base.

Cette stratégie est plus robuste, mais plus longue à développer.

### 3.3 Recommandation finale

Pour Track'N Share :

- MVP : access token JWT + protection back-end stricte ;

- bonus : refresh token sécurisé ;

- production : cookie HttpOnly + refresh token rotatif + rate limiting + blacklist ou table de sessions.

## 4 Stockage côté front-end

### 4.1 Options possibles

Option 1 — Stockage mémoire

Le token est stocké uniquement en mémoire dans l'état front-end.

Avantages :

- plus sécurisé contre certaines attaques XSS ;

- disparaît au refresh ou fermeture.

Limites :

- l'utilisateur doit se reconnecter plus souvent ;

- moins confortable.

Option 2 — localStorage

Le token est stocké dans localStorage.

Avantages :

- simple ;

- persiste après refresh.

Limites :

- exposé en cas de faille XSS ;

- à éviter pour un refresh token.

Option 3 — Cookie HttpOnly

Le token ou refresh token est stocké dans un cookie non accessible à JavaScript.

Avantages :

- meilleure protection contre le vol par JavaScript ;

- adapté aux refresh tokens.

Limites :

- nécessite une bonne configuration CORS / SameSite / CSRF ;

- un peu plus complexe.

### 4.2 Recommandation pour la PWA

Pour le MVP :

- access token en mémoire ou localStorage selon arbitrage simplicité/sécurité ;

- nettoyage obligatoire au logout ;

- pas de données sensibles persistées inutilement ;

- état utilisateur vidé lors d'un 401.

Pour une version plus sécurisée :

- access token en mémoire ;

- refresh token en cookie HttpOnly, Secure, SameSite ;

- renouvellement automatique via /auth/refresh.

### 4.3 Règle importante PWA

Après déconnexion, l'application ne doit plus permettre de consulter les données privées depuis un cache ou un état local.

Le logout doit nettoyer :

- token ;

- profil courant ;

- dashboard ;

- statistiques personnelles ;

- données de chat ;

- éventuelles données sensibles en store.

## 5 Endpoints d'authentification

### 5.1 POST /auth/register

Accès : public

Priorité : P0

Description : crée un compte utilisateur.

Body :

{

"email": "clement@example.com",

"username": "ClementTNS",

"password": "MotDePasseFort123!"

}

Traitement :

1. Valider le format email.

2. Valider le pseudo.

3. Valider la complexité du mot de passe.

4. Vérifier que l'email n'est pas déjà utilisé.

5. Vérifier que le pseudo n'est pas déjà utilisé si la règle est activée.

6. Hasher le mot de passe.

7. Créer l'utilisateur.

8. Créer le profil associé.

9. Générer un JWT ou rediriger vers login selon stratégie.

Réponse 201 :

{

"success": true,

"data": {

"user": {

"id": "user_123",

"email": "clement@example.com",

"username": "ClementTNS",

"role": "PLAYER"

},

"accessToken": "jwt_access_token"

},

"message": "Compte créé avec succès."

}

Erreurs :

- 400 VALIDATION_ERROR ;

- 409 USER_EMAIL_ALREADY_USED ;

- 409 USER_USERNAME_ALREADY_USED ;

- 429 RATE_LIMITED.

### 5.2 POST /auth/login

Accès : public

Priorité : P0

Description : connecte un utilisateur.

Body :

{

"email": "clement@example.com",

"password": "MotDePasseFort123!"

}

Traitement :

1. Valider les champs.

2. Rechercher l'utilisateur par email.

3. Comparer le mot de passe avec le hash stocké.

4. Vérifier que le compte n'est pas désactivé.

5. Générer l'access token.

6. Générer éventuellement un refresh token.

7. Retourner les données utilisateur publiques et le token.

Réponse 200 :

{

"success": true,

"data": {

"user": {

"id": "user_123",

"username": "ClementTNS",

"role": "PLAYER"

},

"accessToken": "jwt_access_token"

},

"message": "Connexion réussie."

}

Erreur 401 :

{

"success": false,

"error": {

"code": "AUTH_INVALID_CREDENTIALS",

"message": "Identifiants invalides."

}

}

Règle :

Le message d'erreur ne doit pas préciser si l'email ou le mot de passe est incorrect.

### 5.3 GET /auth/me

Accès : authentifié

Priorité : P0

Description : retourne l'utilisateur connecté à partir du JWT.

Headers :

Authorization: Bearer <access_token>

Réponse 200 :

{

"success": true,

"data": {

"id": "user_123",

"username": "ClementTNS",

"role": "PLAYER",

"profileId": "profile_123"

}

}

Erreurs :

- 401 AUTH_TOKEN_MISSING ;

- 401 AUTH_TOKEN_EXPIRED ;

- 401 AUTH_TOKEN_INVALID.

### 5.4 POST /auth/logout

Accès : authentifié

Priorité : P0

Description : déconnecte l'utilisateur.

Traitement MVP :

- côté front, supprimer le token et l'état utilisateur ;

- côté back, retourner un succès.

Traitement avancé :

- révoquer le refresh token ;

- supprimer la session ;

- ajouter l'access token à une blacklist jusqu'à expiration si nécessaire.

Réponse 204 :

Aucun contenu.

### 5.5 POST /auth/refresh

Accès : refresh token valide

Priorité : P1

Description : génère un nouvel access token.

Réponse 200 :

{

"success": true,

"data": {

"accessToken": "new_access_token"

}

}

Règles avancées :

- vérifier le refresh token ;

- vérifier qu'il n'a pas été révoqué ;

- générer un nouvel access token ;

- éventuellement faire une rotation du refresh token.

## 6 Hash des mots de passe

### 6.1 Objectif

Le mot de passe ne doit jamais être stocké en clair.

Le système doit uniquement stocker un hash.

### 6.2 Algorithmes recommandés

Option recommandée : Argon2.

Alternative acceptable : bcrypt.

Pourquoi :

- conçus pour les mots de passe ;

- plus résistants qu'un simple SHA-256 ;

- supportent un coût de calcul paramétrable.

### 6.3 Règles

- ne jamais logger un mot de passe ;

- ne jamais retourner un hash côté front ;

- hasher avant insertion en base ;

- comparer via la fonction de l'algorithme, pas avec une comparaison manuelle ;

- refuser les mots de passe trop faibles.

### 6.4 Complexité minimale recommandée

Pour le MVP :

- minimum 8 caractères ;

- au moins une lettre ;

- au moins un chiffre ;

- idéalement un caractère spécial.

Pour une version plus stricte :

- minimum 12 caractères ;

- contrôle de mots de passe compromis ;

- blocage des mots de passe trop communs.

## 7 Guards NestJS

### 7.1 AuthGuard

Rôle : vérifier que l'utilisateur est authentifié.

Utilisation :

- routes dashboard ;

- profils privés ;

- synchronisation stats ;

- création équipe ;

- chat ;

- notifications ;

- paramètres.

Comportement :

- lire le token ;

- vérifier la signature ;

- vérifier l'expiration ;

- attacher l'utilisateur à request.user ;

- refuser la requête si invalide.

### 7.2 RolesGuard

Rôle : vérifier le rôle applicatif.

Rôles possibles :

- PLAYER ;

- MODERATOR ;

- ADMIN.

Routes concernées :

- administration ;

- modération ;

- gestion des jeux ;

- archivage manuel ;

- recalcul global leaderboards.

### 7.3 TeamRoleGuard

Rôle : vérifier le rôle dans une équipe.

Rôles d'équipe :

- CAPTAIN ;

- CO_CAPTAIN ;

- MEMBER ;

- INVITED.

Routes concernées :

- modifier une équipe ;

- régénérer un code d'invitation ;

- exclure un membre ;

- promouvoir un membre ;

- accéder au chat ;

- supprimer une équipe.

## 8 Protection des routes REST

### 8.1 Routes publiques

Exemples :

- POST /auth/register ;

- POST /auth/login ;

- GET /games ;

- GET /leaderboards/solo ;

- GET /leaderboards/teams ;

- GET /seasons/current ;

- GET /profiles/:id selon visibilité.

### 8.2 Routes authentifiées

Exemples :

- GET /auth/me ;

- POST /auth/logout ;

- GET /users/me ;

- PATCH /profiles/me ;

- GET /stats/me ;

- POST /stats/sync ;

- POST /teams ;

- POST /teams/join ;

- GET /teams/me ;

- GET /notifications/me.

### 8.3 Routes avec permissions spécifiques

Exemples :

- PATCH /teams/:id : capitaine ou co-capitaine ;

- DELETE /teams/:id : capitaine ;

- GET /teams/:id/messages : membre ;

- POST /teams/:id/messages : membre ;

- POST /admin/seasons/:id/archive : admin.

## 9 Authentification Socket.io

### 9.1 Principe

Socket.io doit aussi vérifier l'identité de l'utilisateur.

Le client envoie le JWT lors de la connexion socket :

const socket = io(API_URL + "/chat", {

auth: {

token: accessToken

}

});

Le back-end :

- récupère le token ;

- vérifie la signature ;

- vérifie l'expiration ;

- attache userId au socket ;

- refuse la connexion si le token est invalide.

### 9.2 Permissions chat

Même si le socket est authentifié, il faut vérifier l'appartenance à l'équipe avant :

- joinTeamRoom ;

- sendTeamMessage ;

- readTeamMessages.

Règle :

Un utilisateur connecté mais non membre ne doit pas accéder au chat d'une équipe.

## 10 Expiration des tokens

### 10.1 Expiration access token

Si l'access token expire :

- l'API retourne 401 ;

- le front vide l'état utilisateur ou tente un refresh ;

- l'utilisateur est redirigé vers /login si aucun refresh n'est possible.

### 10.2 Comportement front-end

Sur une réponse 401 :

1. Vérifier si un refresh token existe.

2. Si oui, appeler /auth/refresh.

3. Si refresh réussi, rejouer la requête initiale.

4. Si refresh échoue, déconnecter l'utilisateur.

5. Nettoyer l'état local.

6. Rediriger vers login.

### 10.3 Messages utilisateur

Exemples :

- "Votre session a expiré, veuillez vous reconnecter."

- "Vous devez être connecté pour accéder à cette page."

- "Accès refusé."

## 11 Logout et révocation

### 11.1 Logout MVP

Dans la version simple :

- le front supprime l'access token ;

- le front supprime l'état utilisateur ;

- le front nettoie les données sensibles ;

- le back répond 204.

Limite :

Un access token déjà émis reste techniquement valide jusqu'à son expiration.

### 11.2 Logout avancé

Dans une version plus sécurisée :

- stocker les refresh tokens en base ;

- révoquer le refresh token au logout ;

- faire expirer le cookie ;

- éventuellement blacklister l'access token jusqu'à expiration.

### 11.3 Blacklist JWT

Une blacklist peut être stockée dans Redis.

Clé possible :

blacklist:jwt:{jti}

Durée de vie :

- jusqu'à l'expiration naturelle du token.

Priorité : P2.

Pour le MVP, ce n'est pas indispensable si l'access token a une durée courte.

## 12 Refresh tokens

### 12.1 Stockage recommandé

Ne jamais stocker un refresh token en clair dans la base.

Option recommandée :

- hasher le refresh token ;

- stocker le hash ;

- comparer lors du refresh.

Champs possibles :

- id ;

- userId ;

- tokenHash ;

- expiresAt ;

- revokedAt ;

- createdAt ;

- userAgent ;

- ipAddress optionnel.

### 12.2 Rotation

À chaque refresh :

- vérifier l'ancien refresh token ;

- le révoquer ;

- générer un nouveau refresh token ;

- générer un nouvel access token.

Avantage :

- limite les risques en cas de vol.

Priorité : P2.

## 13 Rôles et permissions

### 13.1 Rôles applicatifs

PLAYER

Utilisateur standard.

MODERATOR

Utilisateur chargé de modérer certains contenus.

ADMIN

Utilisateur ayant accès aux fonctions d'administration.

### 13.2 Rôles d'équipe

CAPTAIN

Créateur ou responsable principal d'une équipe.

CO_CAPTAIN

Utilisateur pouvant aider à gérer l'équipe.

MEMBER

Membre standard.

INVITED

Utilisateur invité ou en attente.

### 13.3 Où stocker les rôles

Rôle applicatif :

- table users, champ role.

Rôle d'équipe :

- table team_members, champ role.

### 13.4 JWT et rôles

Le JWT peut contenir le rôle applicatif global.

Il ne doit pas contenir tous les rôles d'équipe, car ils peuvent changer souvent.

Pour une action d'équipe, le back-end doit vérifier en base le rôle actuel dans team_members.

## 14 Sécurité

### 14.1 Secret JWT

Le secret JWT doit être stocké dans une variable d'environnement.

Exemple :

JWT_SECRET=super-secret-local

JWT_EXPIRES_IN=1h

Règles :

- ne jamais commit le secret ;

- fournir un .env.example sans vraie valeur ;

- utiliser un secret long et aléatoire ;

- changer le secret si fuite suspectée.

### 14.2 HTTPS

En production, l'API doit fonctionner en HTTPS.

Pourquoi :

- protéger les tokens en transit ;

- sécuriser les cookies Secure ;

- éviter l'interception réseau.

### 14.3 CORS

Le back-end doit autoriser uniquement les origines connues.

Exemple :

FRONTEND_URL=http://localhost:5173

En production :

- autoriser uniquement le domaine de l'application.

### 14.4 Rate limiting

Routes à limiter :

- POST /auth/login ;

- POST /auth/register ;

- POST /auth/forgot-password ;

- POST /auth/refresh.

Objectif :

- limiter le bruteforce ;

- réduire le spam ;

- protéger l'API.

### 14.5 Protection XSS

Si le token est stocké côté front, une faille XSS peut l'exposer.

Mesures :

- ne jamais injecter du HTML non contrôlé ;

- échapper les contenus utilisateur ;

- utiliser Helmet côté back-end ;

- éviter de stocker des tokens sensibles en localStorage en production ;

- préférer un cookie HttpOnly pour les refresh tokens.

### 14.6 Protection CSRF

Si l'authentification utilise des cookies, il faut prendre en compte le risque CSRF.

Mesures :

- SameSite=Lax ou Strict ;

- token CSRF si nécessaire ;

- vérification de l'origine ;

- méthodes HTTP appropriées.

## 15 Données utilisateur retournées

### 15.1 Données autorisées dans une réponse auth

Autorisé :

- id ;

- username ;

- role ;

- profileId ;

- avatarUrl ;

- email uniquement dans /users/me ou /auth/me si nécessaire.

Interdit :

- passwordHash ;

- refreshToken ;

- tokens externes ;

- secrets ;

- informations internes inutiles.

### 15.2 Exemple de UserResponse

{

"id": "user_123",

"username": "ClementTNS",

"role": "PLAYER",

"profileId": "profile_123",

"avatarUrl": "https://cdn.example.com/avatar.png"

}

## 16 Modèle de données recommandé

### 16.1 Table users

Champs :

- id ;

- email ;

- username ;

- passwordHash ;

- role ;

- createdAt ;

- updatedAt ;

- lastLoginAt ;

- disabledAt ;

- deletedAt.

Contraintes :

- email unique ;

- username unique si règle retenue ;

- passwordHash obligatoire ;

- role obligatoire.

### 16.2 Table refresh_tokens

Priorité : P1/P2

Champs :

- id ;

- userId ;

- tokenHash ;

- expiresAt ;

- revokedAt ;

- createdAt ;

- replacedByTokenId ;

- userAgent ;

- ipAddress.

### 16.3 Index recommandés

users :

- email unique ;

- username unique ou index simple ;

- role si admin ;

- deletedAt si soft delete.

refresh_tokens :

- userId ;

- tokenHash ;

- expiresAt ;

- revokedAt.

## 17 DTO recommandés

RegisterDto :

{

"email": "string",

"username": "string",

"password": "string"

}

LoginDto :

{

"email": "string",

"password": "string"

}

RefreshTokenDto :

{

"refreshToken": "string"

}

ResetPasswordDto :

{

"resetToken": "string",

"newPassword": "string"

}

ChangePasswordDto :

{

"currentPassword": "string",

"newPassword": "string"

}

## 18 Flux d'inscription

Étapes :

1. L'utilisateur remplit le formulaire.

2. Le front valide les champs principaux.

3. Le front appelle POST /auth/register.

4. Le back valide le DTO.

5. Le back vérifie l'unicité email/pseudo.

6. Le back hash le mot de passe.

7. Le back crée User.

8. Le back crée Profile.

9. Le back génère un JWT.

10. Le front stocke la session selon stratégie retenue.

11. L'utilisateur est redirigé vers le dashboard.

Cas d'erreur :

- email invalide ;

- email déjà utilisé ;

- pseudo invalide ;

- mot de passe faible ;

- erreur serveur.

## 19 Flux de connexion

Étapes :

1. L'utilisateur saisit email et mot de passe.

2. Le front appelle POST /auth/login.

3. Le back recherche l'utilisateur par email.

4. Le back compare le mot de passe.

5. Si invalide, retour 401.

6. Si valide, génération JWT.

7. Retour utilisateur + token.

8. Le front met à jour l'état global.

9. Le front redirige vers le dashboard.

Cas d'erreur :

- identifiants invalides ;

- compte désactivé ;

- trop de tentatives ;

- serveur indisponible.

## 20 Flux d'accès à une route privée

Étapes :

1. Le front appelle une route protégée.

2. Le front ajoute Authorization: Bearer token.

3. Le guard NestJS intercepte la requête.

4. Le guard vérifie le token.

5. Si valide, request.user est défini.

6. Le controller traite la requête.

7. Si invalide, retour 401.

## 21 Flux de déconnexion

Étapes MVP :

1. L'utilisateur clique sur Déconnexion.

2. Le front appelle POST /auth/logout ou nettoie directement l'état local.

3. Le front supprime le token.

4. Le front vide le store utilisateur.

5. Le front nettoie les données sensibles.

6. L'utilisateur est redirigé vers la landing page ou login.

Étapes avancées :

1. Le front appelle POST /auth/logout.

2. Le back révoque le refresh token.

3. Le back supprime le cookie.

4. Le front nettoie l'état local.

## 22 Gestion des erreurs d'authentification

AUTH_INVALID_CREDENTIALS

Identifiants invalides.

AUTH_TOKEN_MISSING

Aucun token envoyé.

AUTH_TOKEN_INVALID

Token invalide ou mal formé.

AUTH_TOKEN_EXPIRED

Token expiré.

AUTH_REFRESH_TOKEN_INVALID

Refresh token invalide.

AUTH_REFRESH_TOKEN_REVOKED

Refresh token révoqué.

AUTH_FORBIDDEN

Utilisateur authentifié mais non autorisé.

AUTH_ACCOUNT_DISABLED

Compte désactivé.

AUTH_RATE_LIMITED

Trop de tentatives.

## 23 Tests à prévoir

### 23.1 Tests unitaires back-end

À tester :

- hash de mot de passe ;

- comparaison de mot de passe ;

- génération JWT ;

- validation payload JWT ;

- refus mot de passe invalide ;

- refus utilisateur inexistant ;

- création utilisateur valide ;

- email déjà utilisé ;

- rôle dans payload.

### 23.2 Tests d'intégration API

À tester :

- POST /auth/register avec données valides ;

- POST /auth/register email déjà utilisé ;

- POST /auth/login avec bons identifiants ;

- POST /auth/login avec mauvais identifiants ;

- GET /auth/me avec token valide ;

- GET /auth/me sans token ;

- GET /auth/me avec token expiré ;

- accès route privée sans token ;

- accès route admin avec rôle PLAYER.

### 23.3 Tests front-end

À tester :

- formulaire inscription ;

- formulaire connexion ;

- affichage erreur login ;

- redirection après login ;

- protection route dashboard ;

- logout ;

- expiration session ;

- nettoyage store utilisateur.

### 23.4 Tests manuels MVP

Scénario :

1. Créer un compte.

2. Vérifier que le dashboard est accessible.

3. Se déconnecter.

4. Vérifier que le dashboard n'est plus accessible.

5. Se reconnecter.

6. Vérifier que /auth/me retourne le bon utilisateur.

7. Tester un mauvais mot de passe.

8. Tester une route privée sans token.

## 24 Priorisation MVP

Indispensable P0 :

- inscription ;

- connexion ;

- hash mot de passe ;

- access token JWT ;

- AuthGuard ;

- route /auth/me ;

- logout côté front ;

- protection des routes privées ;

- gestion 401 côté front ;

- rate limiting login ;

- absence de mot de passe dans les réponses.

Important P1 :

- refresh token ;

- cookie HttpOnly ;

- mot de passe oublié ;

- changement de mot de passe ;

- révocation refresh token ;

- sessions utilisateurs.

Évolution P2 :

- blacklist JWT ;

- rotation refresh token avancée ;

- 2FA ;

- gestion multi-appareils ;

- audit logs ;

- détection d'activité suspecte.

## 25 Risques et solutions

### 25.1 Risque : token volé

Impact : accès non autorisé.

Solution : durée courte, HTTPS, stockage sécurisé, refresh token en cookie HttpOnly en version avancée.

### 25.2 Risque : mot de passe stocké en clair

Impact : fuite grave de comptes.

Solution : Argon2 ou bcrypt obligatoire.

### 25.3 Risque : accès à une route privée sans contrôle back-end

Impact : fuite de données.

Solution : AuthGuard sur toutes les routes privées.

### 25.4 Risque : rôle modifié côté front

Impact : élévation de privilèges.

Solution : ne jamais faire confiance au front ; vérifier le rôle côté back-end.

### 25.5 Risque : XSS et localStorage

Impact : vol de token.

Solution : éviter l'injection HTML, nettoyer les contenus, préférer cookies HttpOnly pour refresh token.

### 25.6 Risque : session persistante après logout PWA

Impact : données privées visibles.

Solution : nettoyage complet du store, cache et état local à la déconnexion.

### 25.7 Risque : bruteforce login

Impact : compromission de comptes.

Solution : rate limiting, messages génériques, éventuellement verrouillage temporaire.

## 26 Tableau récapitulatif

| Élément | Choix MVP | Évolution recommandée |

|---|---|---|

| Authentification | JWT access token | Access + refresh token |

| Stockage token | Mémoire ou localStorage | Cookie HttpOnly pour refresh |

| Hash mot de passe | Argon2 ou bcrypt | Argon2 privilégié |

| Protection routes | AuthGuard NestJS | AuthGuard + RolesGuard + TeamRoleGuard |

| Rôles | PLAYER / ADMIN | PLAYER / MODERATOR / ADMIN |

| Session expirée | Redirection login | Refresh automatique |

| Logout | Nettoyage front | Révocation refresh token |

| Sécurité brute force | Rate limiting login | Audit + verrouillage temporaire |

| Socket.io | Token handshake | Token + refresh/reconnect propre |

## 27 Critères d'acceptation

Le système d'authentification JWT est considéré comme fonctionnel si :

- un utilisateur peut créer un compte ;

- le mot de passe est hashé ;

- un utilisateur peut se connecter ;

- un JWT est généré après connexion ;

- le JWT permet d'accéder aux routes privées ;

- une route privée refuse un utilisateur non connecté ;

- un token expiré est refusé ;

- /auth/me retourne l'utilisateur connecté ;

- le logout nettoie l'état côté front ;

- aucune réponse ne contient le hash du mot de passe ;

- les erreurs d'identifiants restent génériques ;

- les routes sensibles sont protégées par des guards ;

- le chat Socket.io vérifie aussi l'identité de l'utilisateur.

## 28 Conclusion

L'authentification JWT est une brique centrale de Track'N Share.

Elle permet de sécuriser l'accès au dashboard, aux statistiques, aux équipes, au chat, aux paramètres et aux fonctionnalités personnelles.

Pour le MVP, la priorité est d'avoir un système simple mais propre : inscription, connexion, hash du mot de passe, génération d'access token, protection des routes et déconnexion côté front.

Les éléments plus avancés comme refresh token, cookie HttpOnly, rotation, blacklist JWT, 2FA et audit logs peuvent être ajoutés après stabilisation du socle principal.
