# CAHIER DES CHARGES

Projet Track'N Share

Version : 1.0

Date : 24/04/2026

Équipe projet : Ioanes et Clément

Rôles principaux :

- Chef de projet : Ioanes

- Chef front-end : Clément

- Chef back-end : Ioanes

- Chef mobile / PWA : Clément

Sources de travail utilisées : cahier d'idées Track'N Share, récapitulatif projet, notes générales du projet et structure documentaire du Drive.

## 1 Présentation générale du projet

### 1.1 Nom du projet

Le projet s'intitule Track'N Share.

### 1.2 Nature du projet

Track'N Share est une plateforme web et mobile sous forme de Progressive Web App permettant aux joueurs de suivre, partager et comparer leurs performances sur différents jeux vidéo.

L'application a pour but de centraliser des statistiques de jeu, de les transformer en indicateurs lisibles, de proposer un système de score, puis de classer les joueurs ou les équipes dans des leaderboards dynamiques.

Le projet combine plusieurs dimensions :

- gestion utilisateur ;

- connexion à des comptes de jeu externes ;

- récupération ou simulation de statistiques ;

- système de points ;

- classements solo et par équipe ;

- saisons de trois mois ;

- équipes et invitations ;

- chat d'équipe ;

- PWA installable ;

- sécurité et confidentialité des données.

### 1.3 Vision du projet

Track'N Share doit permettre à un joueur de suivre ses performances dans le temps, de se comparer aux autres joueurs, de rejoindre une équipe, de participer à une dynamique compétitive et de partager sa progression.

La plateforme doit être pensée comme un espace communautaire autour de la performance gaming. Elle doit rester simple à utiliser, visuelle, responsive et suffisamment complète pour démontrer des compétences front-end, back-end, base de données, temps réel, sécurité et architecture logicielle.

### 1.4 Problématique

Les statistiques de jeu sont souvent dispersées entre plusieurs plateformes, jeux ou services. Les joueurs disposent rarement d'un outil unique leur permettant de comparer facilement leurs performances avec celles de leurs amis ou de leur équipe.

Track'N Share répond à cette problématique en proposant une plateforme centralisée, structurée autour de la donnée, de la compétition et du partage.

## 2 Objectifs du projet

### 2.1 Objectif principal

L'objectif principal est de développer une plateforme web/PWA permettant à des joueurs de créer un compte, de lier ou simuler un compte de jeu, de consulter leurs statistiques, de calculer un score, de participer à des leaderboards et de créer ou rejoindre des équipes.

### 2.2 Objectifs fonctionnels

Le projet doit permettre de :

- créer un compte utilisateur ;

- se connecter et se déconnecter ;

- gérer un profil joueur ;

- lier un compte de jeu réel ou simulé ;

- récupérer ou générer des statistiques de jeu ;

- afficher les statistiques principales d'un joueur ;

- calculer un score à partir des performances ;

- classer les joueurs dans un leaderboard solo ;

- créer une équipe ;

- rejoindre une équipe grâce à un code d'invitation ;

- consulter les statistiques globales d'une équipe ;

- afficher un leaderboard par équipe ;

- gérer des saisons de trois mois ;

- archiver les statistiques et classements par saison ;

- permettre un chat d'équipe simple en temps réel ;

- proposer une interface responsive et installable en PWA.

### 2.3 Objectifs techniques

Le projet doit montrer la maîtrise de :

- React et TypeScript côté front-end ;

- NestJS et TypeScript côté back-end ;

- une API REST structurée ;

- Socket.io pour le temps réel ;

- une base de données adaptée aux relations entre utilisateurs, équipes, statistiques et saisons ;

- Docker et Docker Compose ;

- une architecture claire et maintenable ;

- une gestion sécurisée de l'authentification ;

- des bonnes pratiques de sécurité web ;

- une approche mobile-first et PWA.

### 2.4 Objectifs pédagogiques

Ce projet doit permettre à l'équipe de démontrer ses compétences sur :

- l'analyse d'un besoin ;

- la conception d'une architecture applicative ;

- la gestion d'un projet complet ;

- le développement d'interfaces modernes ;

- la conception d'API ;

- le stockage et l'exploitation de données ;

- le temps réel ;

- la sécurité ;

- la préparation d'une démonstration professionnelle.

## 3 Public cible

### 3.1 Utilisateurs principaux

Les utilisateurs principaux sont des joueurs de jeux vidéo souhaitant suivre leurs performances, comparer leurs statistiques et progresser dans un environnement compétitif.

### 3.2 Profils utilisateurs

Les profils visés sont :

- joueurs solo souhaitant comparer leurs statistiques ;

- joueurs en équipe souhaitant suivre leurs performances collectives ;

- groupes d'amis voulant se challenger ;

- équipes amateurs cherchant une vue globale de leur progression ;

- utilisateurs intéressés par les classements et la gamification.

### 3.3 Besoins utilisateurs

Les utilisateurs ont besoin de :

- consulter rapidement leurs statistiques ;

- comprendre leur progression ;

- comparer leurs performances ;

- rejoindre une équipe ;

- discuter avec leur équipe ;

- voir leur classement ;

- garder un historique par saison ;

- partager leur profil ou leurs résultats.

## 4 Périmètre du projet

### 4.1 Périmètre du MVP

Le MVP doit se concentrer sur les fonctionnalités essentielles permettant de rendre l'application utilisable et démontrable.

Fonctionnalités incluses dans le MVP :

1. Authentification utilisateur.

2. Profil utilisateur.

3. PWA installable.

4. Connexion ou simulation d'un compte de jeu.

5. Affichage des statistiques joueur.

6. Calcul d'un score.

7. Leaderboard solo.

8. Création d'équipe.

9. Invitation ou accès par code d'équipe.

10. Statistiques d'équipe.

11. Leaderboard d'équipe.

12. Saisons de trois mois.

13. Archivage des statistiques.

14. Chat d'équipe simple.

15. Sécurité de base.

16. Confidentialité minimale des messages.

### 4.2 Fonctionnalités bonus réalistes

Ces fonctionnalités peuvent être ajoutées si le MVP est terminé :

- système d'amis ;

- messages privés ;

- badges et achievements ;

- objectifs personnels ;

- graphiques de progression ;

- comparaison joueur contre joueur ;

- notifications internes ;

- mode sombre ;

- recherche de joueurs et d'équipes ;

- page publique partageable.

### 4.3 Fonctionnalités avancées hors MVP

Ces fonctionnalités sont considérées comme évolutions futures :

- tournois internes ;

- calendrier d'équipe ;

- votes et sondages ;

- feed social complet ;

- bibliothèque de replays ;

- chiffrement de bout en bout ;

- notifications push PWA ;

- matchmaking avancé ;

- rapports mensuels ou annuels ;

- modération complète.

### 4.4 Hors périmètre initial

Ne sont pas prioritaires pour la première version :

- application mobile native ;

- connexion à de nombreuses APIs de jeux dès le début ;

- système de tournoi complet ;

- réseau social complet ;

- chiffrement de bout en bout complet ;

- outil d'administration avancé.

## 5 Description fonctionnelle détaillée

### 5.1 Authentification

L'application doit proposer un système d'authentification sécurisé.

Fonctionnalités attendues :

- inscription ;

- connexion ;

- déconnexion ;

- protection des routes privées ;

- modification du profil ;

- suppression du compte ;

- mot de passe oublié si le temps le permet ;

- vérification d'e-mail en bonus.

Données minimales d'un utilisateur :

- identifiant unique ;

- email ;

- pseudo ;

- mot de passe hashé ;

- avatar ;

- bannière ;

- bio ;

- rôle ;

- statut de confidentialité ;

- date de création ;

- date de dernière connexion.

Règles de sécurité :

- les mots de passe ne doivent jamais être stockés en clair ;

- les mots de passe doivent être hashés avec Argon2 ou bcrypt ;

- les tokens ne doivent pas être exposés côté front ;

- les routes privées doivent être vérifiées côté back-end.

### 5.2 Profil utilisateur

Chaque utilisateur doit disposer d'un profil affichant ses informations et ses performances.

Le profil peut contenir :

- avatar ;

- bannière ;

- pseudo ;

- bio ;

- jeux liés ;

- score actuel ;

- rang actuel ;

- statistiques principales ;

- historique des saisons ;

- équipes ;

- badges en bonus ;

- visibilité publique ou privée.

URL possible :

/profile/:id

ou

/players/:username

### 5.3 Connexion ou simulation de compte de jeu

L'utilisateur doit pouvoir lier un compte de jeu afin de récupérer ses statistiques.

Plateformes envisagées :

- Steam ;

- Epic Games si disponible ;

- APIs propres à certains jeux ;

- API mockée ou données seedées pour sécuriser la démonstration.

Données récupérées ou simulées :

- nombre de parties ;

- victoires ;

- défaites ;

- kills ;

- deaths ;

- K/D ratio ;

- winrate ;

- temps de jeu ;

- rang si disponible ;

- historique de matchs si disponible.

Recommandation : commencer par une API mockée ou une seule API réelle pour limiter les risques techniques.

### 5.4 Statistiques joueur

L'application doit afficher les statistiques principales d'un joueur.

Statistiques minimales :

- victoires ;

- défaites ;

- ratio victoire/défaite ;

- kills ;

- deaths ;

- K/D ratio ;

- nombre de parties jouées ;

- score global ;

- saison en cours.

Le dashboard utilisateur doit permettre de voir rapidement :

- score actuel ;

- rang actuel ;

- K/D ;

- winrate ;

- nombre de parties ;

- équipe active ;

- progression de la saison.

### 5.5 Système de points

Le système de points doit être simple, compréhensible et documenté.

Formule proposée pour le MVP :

Score = (K/D ratio x 50) + (Winrate x 40) + (Nombre de parties x 0,5)

Variables possibles :

- K/D ratio ;

- winrate ;

- nombre de parties jouées ;

- activité récente ;

- bonus de régularité ;

- bonus de série de victoires ;

- malus d'inactivité.

Règle anti-abus :

Un joueur doit avoir joué au moins 10 parties pendant la saison pour apparaître dans un leaderboard.

Le score doit être recalculé après chaque synchronisation de statistiques.

### 5.6 Saisons et historique trimestriel

Le projet doit utiliser une logique de saisons plutôt qu'un simple récapitulatif trimestriel.

Une saison dure trois mois :

- Saison 1 : janvier à mars ;

- Saison 2 : avril à juin ;

- Saison 3 : juillet à septembre ;

- Saison 4 : octobre à décembre.

À la fin d'une saison :

- les statistiques sont archivées ;

- les leaderboards sont figés ;

- les meilleurs joueurs et équipes sont sauvegardés ;

- une nouvelle saison commence ;

- les utilisateurs peuvent consulter leurs anciennes performances.

### 5.7 Leaderboards

L'application doit proposer plusieurs types de classements.

Leaderboards MVP :

- leaderboard solo par jeu ;

- leaderboard par équipe ;

- leaderboard par saison.

Données affichées pour un joueur :

- rang ;

- pseudo ;

- avatar ;

- score ;

- K/D ;

- winrate ;

- parties jouées ;

- saison.

Données affichées pour une équipe :

- rang ;

- nom de l'équipe ;

- score moyen ;

- K/D moyen ;

- winrate moyen ;

- nombre de membres ;

- saison.

### 5.8 Équipes

L'application doit permettre la création et la gestion d'équipes.

Fonctionnalités attendues :

- créer une équipe ;

- générer un code d'invitation ;

- rejoindre une équipe via un code ;

- inviter un ami en bonus ;

- accepter ou refuser une invitation ;

- quitter une équipe ;

- supprimer une équipe ;

- consulter les membres ;

- consulter les statistiques globales de l'équipe.

Rôles proposés :

- Capitaine : modifier l'équipe, inviter, exclure, supprimer l'équipe ;

- Co-capitaine : inviter et gérer certains membres ;

- Membre : voir l'équipe, discuter, participer ;

- Invité : en attente d'acceptation.

Statistiques d'équipe :

- score moyen ;

- score total ;

- winrate moyen ;

- K/D moyen ;

- meilleur joueur ;

- progression de la saison ;

- position dans le leaderboard.

### 5.9 Chat d'équipe

Le chat d'équipe doit permettre aux membres d'une équipe de communiquer en temps réel.

Fonctionnalités MVP :

- envoyer un message ;

- recevoir les messages en temps réel ;

- afficher l'historique de conversation ;

- afficher l'auteur et la date ;

- limiter l'accès au chat aux membres de l'équipe.

Fonctionnalités bonus :

- messages privés ;

- statut lu/non lu ;

- suppression ou masquage de messages ;

- statut en ligne/hors ligne ;

- notifications.

Les messages doivent être considérés comme des données sensibles.

### 5.10 PWA

L'application doit être pensée comme une PWA dès le début du projet.

Objectifs PWA :

- installation sur l'écran d'accueil ;

- mode standalone ;

- responsive mobile-first ;

- chargement rapide ;

- page offline simple ;

- expérience proche d'une application native.

Éléments techniques :

- fichier manifest.webmanifest ;

- icônes 192x192 et 512x512 ;

- service worker ;

- cache des assets statiques ;

- stratégie network first pour les données utilisateur ;

- fallback offline.

Point de vigilance : les données sensibles ne doivent pas être mises en cache sans réflexion.

## 6 Exigences non fonctionnelles

### 6.1 Performance

L'application doit être fluide et agréable à utiliser.

Exigences :

- temps de chargement raisonnable ;

- dashboard rapide à afficher ;

- pagination ou limitation des leaderboards ;

- optimisation des requêtes API ;

- cache intelligent pour les données non sensibles ;

- utilisation de Redis pour les données temporaires ou classements rapides si possible.

### 6.2 Sécurité

La sécurité doit être intégrée dès le début.

Exigences front-end :

- ne jamais stocker de mot de passe côté front ;

- ne jamais exposer de clé API dans le code front ;

- éviter le stockage de tokens sensibles dans localStorage ;

- préférer les cookies HttpOnly, Secure et SameSite ;

- protéger les routes privées ;

- nettoyer les entrées utilisateur avant affichage ;

- éviter l'injection HTML directe ;

- mettre en place une Content Security Policy si possible.

Exigences back-end :

- validation stricte des DTO ;

- class-validator et class-transformer ;

- authentification robuste ;

- guards NestJS ;

- autorisation par rôles ;

- rate limiting ;

- protection contre le bruteforce ;

- gestion centralisée des erreurs ;

- logs sans données sensibles ;

- variables d'environnement pour les secrets ;

- CORS configuré précisément ;

- Helmet pour les headers de sécurité ;

- vérification des permissions sur chaque ressource.

### 6.3 Confidentialité

Données sensibles identifiées :

- email ;

- mot de passe ;

- comptes de jeux liés ;

- tokens externes ;

- messages privés ;

- chats d'équipe ;

- statistiques privées ;

- données de profil.

Les messages privés et chats doivent au minimum être protégés en base.

Niveaux possibles :

- niveau 1 : chiffrement en base ;

- niveau 2 : chiffrement applicatif côté serveur avec AES-GCM ;

- niveau 3 : chiffrement de bout en bout en évolution future.

Pour le MVP, le niveau 1 ou 2 est recommandé.

### 6.4 Fiabilité

L'application doit rester utilisable même si une API externe est indisponible.

Mesures prévues :

- API mockée ;

- données seedées ;

- fallback de démonstration ;

- historique sauvegardé ;

- gestion propre des erreurs ;

- possibilité de synchronisation manuelle.

### 6.5 Maintenabilité

Le code doit être organisé de manière claire.

Exigences :

- architecture modulaire ;

- séparation front/back ;

- dossiers par fonctionnalités ;

- services API centralisés ;

- types TypeScript ;

- variables d'environnement ;

- documentation API avec Swagger si possible ;

- Docker pour lancer l'environnement.

### 6.6 Accessibilité et responsive

L'interface doit être utilisable sur mobile et desktop.

Exigences :

- design mobile-first ;

- navigation claire ;

- boutons adaptés au mobile ;

- tableaux adaptés ou scrollables ;

- cartes de statistiques lisibles ;

- contraste suffisant ;

- pages principales utilisables sur petit écran.

## 7 Architecture technique

### 7.1 Stack front-end

Technologies prévues :

- React ;

- TypeScript ;

- Wouter pour le routing ;

- Valtio pour le state management ;

- Socket.io client ;

- PWA ;

- responsive design mobile-first.

Structure front-end proposée :

/src

/assets

/components

/features

/auth

/profile

/dashboard

/games

/leaderboard

/teams

/chat

/messages

/friends

/settings

/pwa

/layouts

/pages

/services

/stores

/types

/utils

### 7.2 Stack back-end

Technologies prévues :

- NestJS ;

- TypeScript ;

- API REST ;

- Socket.io serveur ;

- authentification sécurisée ;

- Swagger en bonus ;

- tâches planifiées avec @nestjs/schedule.

Modules NestJS proposés :

- AuthModule ;

- UsersModule ;

- ProfilesModule ;

- GamesModule ;

- GameAccountsModule ;

- StatsModule ;

- LeaderboardModule ;

- TeamsModule ;

- TeamInvitationsModule ;

- MessagesModule ;

- NotificationsModule ;

- SeasonsModule ;

- AchievementsModule ;

- AdminModule ;

- SecurityModule.

### 7.3 Base de données

Redis-JSON est prévu initialement. Cependant, le projet contient beaucoup de données relationnelles : utilisateurs, équipes, membres, messages, saisons, invitations et statistiques.

Architecture recommandée si possible :

- PostgreSQL pour les données principales ;

- Redis pour le cache, les sessions, les leaderboards rapides, Socket.io, les files d'attente et les données temporaires.

Si Redis-JSON est imposé, les clés devront être structurées clairement.

Exemples de clés Redis :

- user:{id}

- profile:{userId}

- gameAccount:{userId}:{platform}

- stats:{userId}:{gameId}:{seasonId}

- team:{id}

- teamMembers:{teamId}

- leaderboard:{gameId}:{seasonId}

- conversation:{id}

- messages:{conversationId}

- season:{id}

### 7.4 Temps réel

Socket.io sera utilisé pour :

- chat d'équipe ;

- messages privés en bonus ;

- notifications ;

- statut en ligne/hors ligne.

### 7.5 Containerisation

Docker et Docker Compose doivent permettre de lancer :

- front-end ;

- back-end ;

- base de données ;

- Redis ;

- services annexes si nécessaire.

## 8 Modèle de données

### 8.1 User

Champs principaux :

- id ;

- email ;

- username ;

- passwordHash ;

- avatar ;

- banner ;

- bio ;

- createdAt ;

- updatedAt ;

- lastLoginAt ;

- privacyStatus ;

- role.

### 8.2 GameAccount

Champs principaux :

- id ;

- userId ;

- platform ;

- externalUsername ;

- externalId ;

- accessTokenEncrypted ;

- refreshTokenEncrypted ;

- linkedAt ;

- lastSyncAt.

### 8.3 Game

Champs principaux :

- id ;

- name ;

- platform ;

- type ;

- isTeamBased ;

- apiProvider ;

- createdAt.

### 8.4 PlayerStats

Champs principaux :

- id ;

- userId ;

- gameId ;

- seasonId ;

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- kdRatio ;

- winrate ;

- score ;

- fetchedAt.

### 8.5 Team

Champs principaux :

- id ;

- name ;

- tag ;

- description ;

- avatar ;

- ownerId ;

- inviteCode ;

- visibility ;

- createdAt ;

- updatedAt.

### 8.6 TeamMember

Champs principaux :

- id ;

- teamId ;

- userId ;

- role ;

- joinedAt.

### 8.7 Season

Champs principaux :

- id ;

- name ;

- startDate ;

- endDate ;

- status ;

- createdAt.

### 8.8 Conversation et Message

Conversation :

- id ;

- type ;

- createdAt ;

- updatedAt.

Message :

- id ;

- conversationId ;

- senderId ;

- contentEncrypted ;

- iv ;

- createdAt ;

- editedAt ;

- deletedAt ;

- readAt.

### 8.9 Achievement et Notification

Achievement :

- id ;

- name ;

- description ;

- condition ;

- icon ;

- points.

Notification :

- id ;

- userId ;

- type ;

- title ;

- content ;

- readAt ;

- createdAt.

## 9 Pages attendues

### 9.1 Pages MVP

Pages principales :

- / : landing page ;

- /register : inscription ;

- /login : connexion ;

- /dashboard : dashboard utilisateur ;

- /profile/:id : profil utilisateur ;

- /settings : paramètres ;

- /games : liste des jeux ;

- /games/:id/leaderboard : leaderboard par jeu ;

- /teams : mes équipes ;

- /teams/create : création d'équipe ;

- /teams/:id : page équipe ;

- /teams/:id/chat : chat d'équipe ;

- /compare : comparaison de joueurs ;

- /seasons : archives des saisons.

### 9.2 Pages bonus

Pages optionnelles :

- /friends : liste d'amis ;

- /messages : messages privés ;

- /notifications : notifications ;

- /achievements : badges ;

- /admin : administration ;

- /search : recherche globale ;

- /tournaments : tournois.

## 10 Parcours utilisateurs principaux

### 10.1 Création de compte et première connexion

1. L'utilisateur arrive sur la landing page.

2. Il crée un compte.

3. Il se connecte.

4. Il accède à son dashboard.

5. Il complète son profil.

6. Il lie ou simule un compte de jeu.

7. Il consulte ses premières statistiques.

### 10.2 Consultation des statistiques

1. L'utilisateur se connecte.

2. Il accède au dashboard.

3. Il voit son score, son K/D, son winrate et son classement.

4. Il peut filtrer par jeu ou par saison.

5. Il peut consulter l'historique des saisons précédentes.

### 10.3 Création et gestion d'équipe

1. L'utilisateur crée une équipe.

2. Il devient capitaine.

3. Un code d'invitation est généré.

4. Il partage ce code avec un autre joueur.

5. Le joueur rejoint l'équipe.

6. L'équipe apparaît dans le leaderboard d'équipe.

7. Les membres peuvent discuter dans le chat d'équipe.

### 10.4 Démonstration finale

Scénario recommandé :

1. Arrivée sur la landing page.

2. Connexion avec un compte démo.

3. Affichage du dashboard.

4. Consultation des statistiques.

5. Ouverture du leaderboard.

6. Comparaison avec un autre joueur.

7. Consultation ou création d'une équipe.

8. Utilisation du chat d'équipe en temps réel.

9. Consultation de l'historique d'une saison.

10. Installation de la PWA ou affichage en mode standalone.

## 11 Contraintes et risques

### 11.1 Risques liés aux APIs externes

Les APIs de jeux peuvent être limitées, indisponibles, incomplètes ou complexes à utiliser.

Solutions prévues :

- commencer par une seule API ;

- prévoir une API mockée ;

- préparer des données seedées ;

- gérer les erreurs proprement ;

- permettre une démonstration sans dépendre d'une API externe.

### 11.2 Risque de scope trop large

Le projet contient de nombreuses idées. Le risque principal est de vouloir tout développer dès le début.

Solution :

- prioriser le MVP ;

- documenter les bonus ;

- développer les évolutions seulement après validation du socle principal.

### 11.3 Risque lié à Redis-JSON

Redis-JSON peut être utilisé, mais il est moins naturel pour des relations complexes.

Solution :

- structurer clairement les clés ;

- limiter les relations trop complexes ;

- utiliser PostgreSQL si possible ;

- garder Redis pour le cache et les classements rapides si l'architecture le permet.

### 11.4 Risques sécurité

Le projet manipule des emails, mots de passe, messages, profils et tokens potentiels.

Solutions :

- hash des mots de passe ;

- cookies sécurisés ;

- validation des DTO ;

- rate limiting ;

- chiffrement des messages ou tokens sensibles ;

- logs sans données sensibles ;

- permissions vérifiées côté back-end.

## 12 Critères d'acceptation

### 12.1 Authentification

Le module est accepté si :

- un utilisateur peut s'inscrire ;

- un utilisateur peut se connecter ;

- un utilisateur peut se déconnecter ;

- les routes privées sont protégées ;

- le mot de passe est hashé ;

- un utilisateur ne peut pas accéder aux données privées d'un autre.

### 12.2 Profil

Le module est accepté si :

- un profil utilisateur est visible ;

- l'utilisateur peut modifier ses informations ;

- les statistiques principales sont affichées ;

- la visibilité publique ou privée est prise en compte si implémentée.

### 12.3 Statistiques et score

Le module est accepté si :

- des statistiques sont récupérées ou simulées ;

- le K/D est calculé ;

- le winrate est calculé ;

- le score est calculé ;

- les statistiques sont associées à une saison.

### 12.4 Leaderboard

Le module est accepté si :

- les joueurs sont classés par score ;

- les données affichées sont correctes ;

- un minimum de parties est pris en compte ;

- le classement peut être filtré par jeu ou saison.

### 12.5 Équipes

Le module est accepté si :

- un utilisateur peut créer une équipe ;

- un code d'invitation est généré ;

- un autre utilisateur peut rejoindre l'équipe ;

- les membres sont visibles ;

- les rôles sont pris en compte ;

- les statistiques d'équipe sont affichées.

### 12.6 Chat d'équipe

Le module est accepté si :

- un membre peut envoyer un message ;

- les autres membres reçoivent le message en temps réel ;

- l'historique est visible ;

- un utilisateur externe à l'équipe ne peut pas accéder au chat.

### 12.7 PWA

La PWA est acceptée si :

- un manifest est présent ;

- les icônes sont définies ;

- l'application peut être installée ;

- le responsive mobile est correct ;

- une page ou stratégie offline simple existe.

## 13 Roadmap de réalisation

Phase 1 — Initialisation

- créer le repository ;

- initialiser React + TypeScript ;

- initialiser NestJS + TypeScript ;

- ajouter Docker ;

- préparer la base de données ;

- préparer les variables d'environnement ;

- mettre en place la base PWA.

Phase 2 — Authentification et sécurité de base

- inscription ;

- connexion ;

- déconnexion ;

- hash des mots de passe ;

- JWT ou sessions ;

- guards NestJS ;

- routes protégées ;

- validation des DTO ;

- rate limiting ;

- CORS propre ;

- Helmet.

Phase 3 — Profils utilisateurs

- profil utilisateur ;

- modification du profil ;

- avatar ;

- bio ;

- paramètres de confidentialité ;

- page publique de profil.

Phase 4 — Jeux et statistiques

- créer les entités jeux ;

- lier ou simuler un compte de jeu ;

- récupérer ou générer des statistiques ;

- stocker les statistiques ;

- calculer K/D, winrate et score ;

- afficher les statistiques sur le dashboard.

Phase 5 — Leaderboards et saisons

- créer les saisons ;

- créer le leaderboard solo ;

- filtrer par jeu ;

- archiver les statistiques ;

- afficher les anciennes saisons.

Phase 6 — Équipes

- création d'équipe ;

- code d'invitation ;

- rejoindre une équipe ;

- rôles ;

- statistiques d'équipe ;

- leaderboard d'équipe.

Phase 7 — Temps réel

- Socket.io ;

- chat d'équipe ;

- statut en ligne/hors ligne en bonus ;

- notifications simples en bonus.

Phase 8 — Sécurité avancée

- chiffrement des messages en base ;

- chiffrement des tokens externes ;

- logs sécurisés ;

- signalements ;

- blocage utilisateur ;

- suppression de compte ;

- export des données.

Phase 9 — Bonus et polish

- graphiques ;

- badges ;

- comparaison joueur contre joueur ;

- objectifs personnels ;

- mode sombre ;

- notifications PWA ;

- mode démo ;

- données seedées.

## 14 Livrables attendus

Livrables fonctionnels :

- application front-end ;

- application back-end ;

- base de données ;

- PWA installable ;

- système d'authentification ;

- dashboard ;

- leaderboards ;

- équipes ;

- chat d'équipe ;

- données de démonstration.

Livrables documentaires :

- cahier des charges ;

- répartition des tâches ;

- risques et solutions ;

- documentation technique ;

- documentation API ;

- maquettes ;

- schéma de base de données ;

- guide d'installation ;

- support de soutenance.

## 15 Recommandations pour la soutenance

Pour éviter une application vide, il est recommandé de préparer :

- un mode démo ;

- plusieurs utilisateurs fictifs ;

- plusieurs équipes ;

- plusieurs jeux ;

- plusieurs saisons ;

- un leaderboard déjà rempli ;

- des messages dans un chat d'équipe ;

- des badges débloqués en bonus ;

- des graphiques avec historique en bonus ;

- une démonstration mobile PWA.

La soutenance doit montrer :

- la connexion ;

- le dashboard ;

- les statistiques ;

- le score ;

- les leaderboards ;

- les équipes ;

- le chat ;

- les saisons ;

- la PWA ;

- les choix de sécurité.

## 16 Conclusion

Track'N Share est un projet complet et pertinent pour un projet fil rouge ou un projet final de développement.

Il permet de démontrer des compétences variées : front-end moderne, back-end structuré, base de données, temps réel, PWA, sécurité, architecture, UX/UI et gestion de projet.

La priorité est de construire un MVP solide autour de l'authentification, des profils, des statistiques, du scoring, des leaderboards, des équipes, des saisons, du chat d'équipe, de la PWA et de la sécurité.

Les fonctionnalités sociales avancées, la gamification, les tournois, le matchmaking avancé et le chiffrement de bout en bout peuvent être présentés comme des évolutions futures ou ajoutés progressivement si le temps le permet.
