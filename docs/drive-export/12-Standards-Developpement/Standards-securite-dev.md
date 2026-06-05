# STANDARDS DE SÉCURITÉ DÉVELOPPEMENT

Projet Track'N Share

Version : 1.0

Date : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit les standards de sécurité à respecter pendant le développement de Track'N Share.

Il complète les documents Politique-securite, Protection-attaques, Gestion-secrets-env, Authentification-JWT, Roles-permissions, Conventions-code, Conventions-API et Definition-of-Done.

Son objectif est pratique : donner aux développeurs une liste claire de règles à appliquer lorsqu'ils codent le front-end, le back-end, l'API, Socket.io, Docker, les providers externes, les logs et le mode démo.

## 1 Principes généraux

### 1.1 Sécurité dès le développement

La sécurité ne doit pas être ajoutée uniquement à la fin du projet.

Chaque fonctionnalité doit être développée avec une réflexion sur :

- les données manipulées ;

- les utilisateurs autorisés ;

- les erreurs possibles ;

- les abus possibles ;

- les secrets utilisés ;

- les logs produits ;

- les risques côté front-end et back-end.

### 1.2 Ne jamais faire confiance au client

Le front-end peut être modifié par un utilisateur.

Donc le back-end doit toujours vérifier :

- l'identité ;

- le rôle ;

- la propriété de la ressource ;

- l'appartenance à une équipe ;

- la validité du payload ;

- les limites d'usage.

### 1.3 Moindre privilège

Chaque utilisateur, service ou composant doit avoir uniquement les droits nécessaires.

Exemples :

- un PLAYER n'a pas accès aux routes admin ;

- un MEMBER ne peut pas supprimer une équipe ;

- un non-membre ne peut pas lire un chat d'équipe ;

- le front-end ne reçoit jamais les secrets ;

- PostgreSQL et Redis ne sont pas exposés publiquement en production.

## 2 Standards liés aux secrets

### 2.1 Règles obligatoires

Il est interdit de commiter :

- .env ;

- clés API ;

- JWT_SECRET ;

- DATABASE_URL réelle ;

- REDIS_URL avec mot de passe ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- tokens personnels ;

- clés privées ;

- fichiers credentials.

### 2.2 Fichiers autorisés

Sont autorisés :

- .env.example ;

- fichiers de configuration sans vraie valeur ;

- exemples avec replace_me ;

- documentation sans secrets réels.

### 2.3 Règle front-end

Aucune variable sensible ne doit être préfixée par VITE_.

Avec Vite, les variables VITE_* sont exposées au navigateur.

Interdit :

- VITE_JWT_SECRET ;

- VITE_DATABASE_URL ;

- VITE_STEAM_WEB_API_KEY ;

- VITE_EPIC_CLIENT_SECRET.

Accepté :

- VITE_API_BASE_URL ;

- VITE_SOCKET_URL ;

- VITE_DEMO_MODE ;

- VITE_APP_NAME.

### 2.4 En cas de secret exposé

Procédure :

1. considérer le secret comme compromis ;

2. régénérer ou révoquer le secret ;

3. mettre à jour l'environnement ;

4. supprimer la fuite visible ;

5. vérifier l'historique Git si nécessaire ;

6. documenter l'incident.

## 3 Standards d'authentification

### 3.1 Mots de passe

Règles :

- jamais de mot de passe en clair en base ;

- hash avec Argon2 ou bcrypt ;

- pas de mot de passe dans les logs ;

- pas de mot de passe dans les réponses API ;

- message d'erreur générique au login ;

- validation minimale du mot de passe à l'inscription.

### 3.2 JWT

Règles :

- JWT_SECRET fort ;

- access token avec durée limitée ;

- payload minimal ;

- token expiré refusé ;

- routes privées protégées par JwtAuthGuard ;

- aucun token dans les logs ;

- logout nettoyant l'état front.

### 3.3 Payload JWT recommandé

Exemple :

{

"sub": "user_123",

"role": "PLAYER"

}

Ne pas mettre dans le JWT :

- password ;

- passwordHash ;

- clés API ;

- profil complet ;

- données sensibles ;

- secrets.

### 3.4 Refresh token

Priorité : P1.

Si les refresh tokens sont activés :

- stockage sécurisé ;

- durée plus longue que l'access token ;

- révocation au logout ;

- rotation en évolution ;

- hash en base si stocké ;

- cookie HttpOnly recommandé en production.

## 4 Standards d'autorisation

### 4.1 Vérifications côté back-end

Toute action sensible doit vérifier les permissions côté back-end.

Exemples :

- modifier son profil ;

- synchroniser ses stats ;

- créer une équipe ;

- rejoindre une équipe ;

- accéder au chat ;

- envoyer un message ;

- archiver une saison ;

- accéder à une route admin.

### 4.2 Guards recommandés

- JwtAuthGuard ;

- RolesGuard ;

- ResourceOwnerGuard ;

- TeamMemberGuard ;

- TeamRoleGuard ;

- AdminGuard si nécessaire.

### 4.3 Règles métier de permissions

- un utilisateur ne modifie que son propre profil ;

- un utilisateur ne synchronise que ses propres comptes de jeu ;

- un membre lit uniquement le chat de son équipe ;

- un capitaine gère les invitations ;

- un membre simple ne supprime pas une équipe ;

- un admin est nécessaire pour les actions globales.

### 4.4 Front-end

Le front-end peut masquer des boutons selon le rôle, mais cela ne remplace jamais les guards back-end.

## 5 Standards de validation des données

### 5.1 Toutes les entrées doivent être validées

Sources à valider :

- body ;

- params ;

- query ;

- headers si nécessaire ;

- payloads Socket.io ;

- données provenant d'APIs externes ;

- fichiers uploadés.

### 5.2 DTO NestJS

Chaque route qui reçoit des données doit utiliser un DTO.

Exemples :

- RegisterDto ;

- LoginDto ;

- UpdateProfileDto ;

- CreateTeamDto ;

- JoinTeamDto ;

- SendTeamMessageDto ;

- SyncStatsDto.

### 5.3 ValidationPipe recommandé

Options recommandées :

- whitelist: true ;

- transform: true ;

- forbidNonWhitelisted selon stratégie retenue.

### 5.4 Longueurs maximales

Recommandations :

- pseudo : 3 à 30 caractères ;

- nom équipe : 3 à 40 caractères ;

- tag équipe : 2 à 6 caractères ;

- bio : 300 caractères ;

- message chat : 1 à 1000 caractères ;

- pagination limit max : 100.

## 6 Standards API REST

### 6.1 Format des réponses

Réponse succès :

{

"success": true,

"data": {},

"message": "Action effectuée avec succès."

}

Réponse erreur :

{

"success": false,

"error": {

"code": "TEAM_ACCESS_DENIED",

"message": "Vous n'avez pas accès à cette équipe.",

"requestId": "req_abc123"

}

}

### 6.2 Données interdites en réponse API

Ne jamais retourner :

- password ;

- passwordHash ;

- JWT_SECRET ;

- refreshToken brut ;

- clé Steam ;

- secret Epic ;

- DATABASE_URL ;

- REDIS_URL ;

- secrets internes.

### 6.3 Pagination

Toutes les listes longues doivent être paginées.

Exemples :

- leaderboards ;

- messages ;

- notifications ;

- équipes ;

- joueurs.

### 6.4 Tri et filtres

Les champs de tri et de filtre doivent être whitelistés.

Ne jamais utiliser directement un paramètre utilisateur dans une requête SQL sans validation.

## 7 Standards de gestion des erreurs

### 7.1 Erreurs côté client

Les messages utilisateur doivent être clairs.

Exemples :

- "Votre session a expiré." ;

- "Vous n'avez pas accès à cette équipe." ;

- "Trop de requêtes, réessayez plus tard." ;

- "La synchronisation est temporairement indisponible."

### 7.2 Erreurs techniques

Les détails techniques restent côté serveur.

Ne jamais exposer au client :

- stack trace ;

- requête SQL ;

- chemins serveur ;

- variables d'environnement ;

- tokens ;

- secrets.

### 7.3 Exception filter

Le back-end doit prévoir un filtre global ou une stratégie standardisée pour transformer les erreurs en réponses propres.

## 8 Standards de logs

### 8.1 À logger

Logs utiles :

- démarrage de l'application ;

- connexion PostgreSQL ;

- connexion Redis ;

- login réussi ou échoué ;

- accès refusé 403 ;

- rate limit 429 ;

- erreur provider ;

- fallback utilisé ;

- action admin ;

- archivage de saison ;

- erreur critique.

### 8.2 À ne jamais logger

Interdit :

- mot de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- header Authorization ;

- cookies de session ;

- clés API ;

- secrets ;

- DATABASE_URL complète ;

- contenu complet des messages privés.

### 8.3 Request ID

Les erreurs doivent idéalement contenir un requestId pour retrouver le log correspondant.

## 9 Standards base de données

### 9.1 Accès base

Règles :

- accès PostgreSQL uniquement depuis le back-end ;

- pas d'accès direct depuis le front ;

- credentials via variables d'environnement ;

- migrations versionnées ;

- pas de données réelles dans les seeds.

### 9.2 Requêtes

Règles :

- utiliser ORM ou requêtes paramétrées ;

- ne pas construire de SQL par concaténation ;

- valider les champs de tri ;

- limiter les résultats ;

- indexer les champs fréquemment recherchés.

### 9.3 Données sensibles

Champs sensibles à protéger :

- email ;

- passwordHash ;

- externalId ;

- tokens éventuels ;

- logs de sécurité.

## 10 Standards Redis

### 10.1 Usage autorisé

Redis peut être utilisé pour :

- cache ;

- rate limiting ;

- locks ;

- leaderboards rapides ;

- présence en ligne ;

- sessions en évolution.

### 10.2 Règles de sécurité

- Redis non exposé publiquement ;

- TTL sur données temporaires ;

- préfixes de clés clairs ;

- pas de secrets en clair ;

- PostgreSQL reste source de vérité ;

- comportement prévu si Redis est indisponible.

## 11 Standards Socket.io

### 11.1 Authentification socket

Règles :

- vérifier le token au handshake ;

- stocker userId dans socket.data ;

- refuser une connexion sans token si namespace privé ;

- ne jamais accepter userId depuis le payload client.

### 11.2 Rooms

Règles :

- nommage team:{teamId} ;

- vérifier TeamMemberGuard avant join ;

- quitter proprement les rooms si nécessaire.

### 11.3 Messages

Règles :

- valider le contenu ;

- appliquer une limite de longueur ;

- appliquer du rate limiting ;

- sauvegarder avant broadcast si nécessaire ;

- broadcast uniquement à la bonne room ;

- logs sans contenu complet.

## 12 Standards front-end

### 12.1 Données sensibles

Le front-end ne doit jamais contenir :

- secret JWT ;

- clé API Steam ;

- secret Epic ;

- URL base de données ;

- mot de passe ;

- token dans un log console.

### 12.2 Gestion de session

Règles :

- redirection vers login sur 401 ;

- nettoyage du store au logout ;

- suppression des données privées affichées ;

- attention au stockage local ;

- ne pas conserver de données privées inutiles.

### 12.3 XSS

Règles :

- traiter les champs utilisateur comme du texte ;

- éviter dangerouslySetInnerHTML ;

- ne pas autoriser HTML dans chat, bio, description d'équipe ;

- échapper correctement les contenus affichés.

## 13 Standards PWA

### 13.1 Cache

Règles :

- Cache First pour assets statiques ;

- Network First pour données utilisateur ;

- ne pas cacher les réponses privées sans contrôle ;

- page offline neutre ;

- nettoyage au logout si données sensibles.

### 13.2 Données privées

Une PWA peut rester installée sur un appareil partagé.

Il faut donc éviter que des données privées restent visibles après déconnexion.

## 14 Standards uploads

### 14.1 Si upload activé

Règles :

- types autorisés : PNG, JPG, WebP ;

- taille maximale ;

- vérification MIME ;

- renommage du fichier ;

- stockage non exécutable ;

- pas de chemin serveur exposé ;

- suppression possible si compte supprimé.

### 14.2 MVP

Si l'upload n'est pas prêt ou pas sécurisé, garder UPLOAD_ENABLED=false et utiliser des avatars par défaut.

## 15 Standards providers externes

### 15.1 Appels externes

Règles :

- appels Steam/Epic uniquement côté back-end ;

- clés API dans .env ;

- timeout ;

- retry limité ;

- validation des réponses ;

- mapping normalisé ;

- fallback cache/mock ;

- logs sans secrets.

### 15.2 MockProvider

Le MockProvider doit rester disponible pour :

- développement ;

- tests ;

- soutenance ;

- fallback.

Le MVP ne doit pas dépendre de Steam ou Epic pour fonctionner.

## 16 Standards Docker et environnements

### 16.1 Docker

Règles :

- ne pas copier .env dans l'image ;

- ne pas écrire de secret dans Dockerfile ;

- ne pas exposer PostgreSQL/Redis en production ;

- utiliser .dockerignore ;

- documenter les ports ;

- tester docker compose up.

### 16.2 Environnements

Règles :

- dev : mock autorisé, logs plus détaillés ;

- test : données fictives ;

- démo : MockProvider et seed contrôlé ;

- production future : secrets forts, seed désactivé, HTTPS, CORS strict.

## 17 Standards dépendances

### 17.1 Ajout de dépendance

Avant d'ajouter une dépendance, vérifier :

- utilité réelle ;

- popularité / maintenance ;

- compatibilité TypeScript ;

- vulnérabilités connues ;

- poids côté front ;

- alternatives natives.

### 17.2 Audit

Commandes possibles :

- npm audit ;

- pnpm audit.

Pour le MVP, corriger en priorité les vulnérabilités critiques ou faciles à résoudre.

## 18 Standards tests sécurité

### 18.1 Tests à prévoir

Tests minimums :

- route privée sans token refusée ;

- token expiré refusé ;

- utilisateur ne modifie pas un autre profil ;

- non-membre ne lit pas le chat ;

- membre simple ne supprime pas l'équipe ;

- admin route refusée à PLAYER ;

- login rate limit ;

- message chat trop long refusé ;

- provider externe indisponible déclenche fallback.

### 18.2 Vérifications manuelles MVP

Avant soutenance :

- vérifier login/logout ;

- vérifier dashboard ;

- vérifier permissions équipe ;

- vérifier chat ;

- vérifier mode démo ;

- vérifier absence de secrets dans le front ;

- vérifier Docker.

## 19 Standards RGPD développement

### 19.1 Minimisation

Ne collecter que les données nécessaires.

À éviter :

- nom civil ;

- adresse ;

- téléphone ;

- date de naissance si non nécessaire ;

- données sensibles.

### 19.2 Suppression et anonymisation

Prévoir dès le développement :

- suppression compte ;

- anonymisation des archives ;

- déliaison compte externe ;

- suppression ou anonymisation messages si nécessaire.

### 19.3 Données mockées

Les données de démo doivent être fictives.

Ne pas utiliser de vraies identités ou vrais emails.

## 20 Standards Swagger

### 20.1 Documentation

Chaque endpoint important doit documenter :

- body ;

- params ;

- query ;

- réponse succès ;

- erreurs principales ;

- authentification nécessaire.

### 20.2 Sécurité

Swagger ne doit jamais contenir :

- vraie clé API ;

- vrai token ;

- vrai mot de passe ;

- secret ;

- DATABASE_URL.

En production future, Swagger doit être protégé ou désactivé.

## 21 Checklist sécurité avant commit

Avant commit :

- aucun .env ajouté ;

- aucun secret dans le diff ;

- aucun console.log de token ;

- aucun passwordHash retourné ;

- DTO présents si entrée utilisateur ;

- guards présents si route privée ;

- erreurs propres ;

- logs sans secrets ;

- code lisible.

## 22 Checklist sécurité avant pull request

Avant PR :

- vérifier les permissions ;

- vérifier les routes privées ;

- vérifier les réponses API ;

- vérifier les validations ;

- vérifier les variables d'environnement ;

- vérifier Swagger ;

- vérifier mode démo ;

- vérifier absence de secret ;

- vérifier documentation si nécessaire.

## 23 Checklist sécurité avant merge

Avant merge :

- PR relue ;

- CI verte si disponible ;

- tests ou vérifications effectués ;

- aucun secret ;

- main reste stable ;

- documentation mise à jour ;

- pas de régression sur auth, permissions, Docker ou mode démo.

## 24 Priorités MVP

P0 obligatoire :

- mots de passe hashés ;

- JWT sur routes privées ;

- guards permissions ;

- validation DTO ;

- aucun secret dans Git ;

- aucun secret dans front ;

- logs sans secrets ;

- chat réservé aux membres ;

- MockProvider fiable ;

- Docker sans secrets.

P1 important :

- rate limiting ;

- requestId ;

- Swagger complet ;

- tests sécurité de base ;

- headers Helmet ;

- upload sécurisé ou désactivé ;

- suppression/anonymisation compte.

P2 évolution :

- 2FA ;

- monitoring avancé ;

- scan dépendances en CI ;

- rotation refresh token ;

- secrets manager ;

- WAF ;

- chiffrement applicatif avancé.

## 25 Risques et solutions

### 25.1 Risque : secret exposé

Impact : compromission du projet.

Solution : .gitignore, .env.example, revue du diff, rotation immédiate.

### 25.2 Risque : route privée non protégée

Impact : fuite de données.

Solution : JwtAuthGuard et tests de route sans token.

### 25.3 Risque : permissions insuffisantes

Impact : accès à des ressources d'autres utilisateurs.

Solution : ResourceOwnerGuard, TeamMemberGuard, TeamRoleGuard.

### 25.4 Risque : XSS dans chat ou profil

Impact : exécution de script côté utilisateur.

Solution : texte brut, pas de HTML, pas de dangerouslySetInnerHTML.

### 25.5 Risque : logs dangereux

Impact : fuite de tokens ou données personnelles.

Solution : règles de redaction et interdiction de logger les secrets.

### 25.6 Risque : dépendance externe instable

Impact : démo cassée.

Solution : MockProvider, cache, fallback et timeouts.

## 26 Critères d'acceptation

Les standards de sécurité développement sont respectés si :

- aucun secret n'est dans le dépôt ;

- les routes privées sont protégées ;

- les permissions sont vérifiées côté back-end ;

- les DTO valident les entrées ;

- les erreurs ne révèlent pas de détails techniques ;

- les logs ne contiennent pas de secrets ;

- le front-end n'expose pas de clés privées ;

- Socket.io vérifie l'identité et les permissions ;

- les providers externes passent par le back-end ;

- Docker ne contient pas de secrets ;

- le mode démo fonctionne sans Steam/Epic ;

- les checklists sont appliquées avant merge.

## 27 Conclusion

Les standards de sécurité développement permettent de protéger Track'N Share dès les premières lignes de code.

Le projet manipule des comptes, des statistiques, des équipes, des messages, des APIs externes, des tokens et des secrets. Il est donc essentiel d'appliquer des règles simples mais strictes : pas de secrets dans Git, validation systématique, permissions back-end, logs propres, API sécurisée, Socket.io contrôlé et mode démo fiable.

Pour le MVP, l'objectif est d'obtenir une sécurité raisonnable, démontrable et cohérente avec les documents déjà rédigés.

Ces standards devront être relus pendant le développement et mis à jour si l'architecture technique évolue.
