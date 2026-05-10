# Track'N Share — Cahier d'idées, MVP, architecture et sécurité

## 1. Résumé du projet

**Track'N Share** est une plateforme web et mobile sous forme de **PWA** permettant aux joueurs de suivre, partager et comparer leurs performances sur différents jeux vidéo.

Le projet repose sur trois grands piliers :

1. **Tracking des statistiques de jeu**
   - Récupération des statistiques via des APIs externes : Steam, Epic Games ou APIs propres à certains jeux.
   - Stockage des données en base.
   - Conservation d'un historique par période, notamment par saison de 3 mois.

2. **Comparaison et compétition**
   - Système de points basé sur les performances.
   - Leaderboards solo et par équipe.
   - Comparaisons entre joueurs, équipes et saisons.

3. **Communauté**
   - Profils utilisateurs.
   - Équipes.
   - Amis.
   - Invitations.
   - Chat d'équipe.
   - Messages privés.
   - Badges, achievements et fonctionnalités sociales.

L'objectif est de créer une plateforme compétitive et sociale autour des statistiques gaming, tout en proposant une expérience moderne, responsive et installable sur mobile grâce à la PWA.

---

## 2. Équipe et répartition des rôles

L'équipe est composée de deux développeurs :

| Rôle | Responsable |
|---|---|
| Chef de projet | Ioanes |
| Chef front-end | Clément |
| Chef back-end | Ioanes |
| Chef mobile / PWA | Clément |

Cette répartition permet de clarifier les responsabilités tout en gardant une collaboration forte entre le front, le back, la base de données et l'expérience mobile.

---

## 3. Pitch du projet

**Track'N Share** est une plateforme permettant aux joueurs de suivre, partager et comparer leurs performances de jeu à travers un système de points basé sur leurs statistiques comme le ratio victoires/défaites, le K/D ratio et l'activité sur une saison donnée.

Les joueurs peuvent connecter leurs comptes de jeux, consulter leurs statistiques, rejoindre ou créer des équipes, comparer leurs performances avec d'autres joueurs, discuter via messagerie privée ou chat d'équipe, et progresser dans des leaderboards dynamiques.

Le projet met l'accent sur :

- la compétition ;
- la comparaison de statistiques ;
- le suivi de progression ;
- la création d'équipes ;
- la communication entre joueurs ;
- la résilience des données ;
- la sécurité des données utilisateurs ;
- l'expérience mobile via PWA.

---

## 4. Stack technique envisagée

### Front-end

- React
- TypeScript
- Wouter pour le routing
- Valtio pour le state management
- Socket.io client pour le temps réel
- PWA dès le début du projet
- Responsive design mobile-first

### Back-end

- NestJS
- TypeScript
- Socket.io serveur
- Authentification sécurisée
- API REST
- Possibilité d'ajouter Swagger pour documenter l'API

### Base de données

- Redis-JSON prévu initialement
- Alternative recommandée : PostgreSQL pour les données relationnelles
- Redis utile pour :
  - cache ;
  - sessions ;
  - leaderboards rapides ;
  - Socket.io ;
  - files d'attente ;
  - données temporaires.

### APIs externes

- Steam API
- Epic Games API, si disponible et exploitable
- APIs spécifiques à certains jeux
- API mockée en fallback pour sécuriser la démonstration

### Temps réel

- Socket.io pour :
  - chat d'équipe ;
  - messages privés ;
  - notifications ;
  - statut en ligne/hors ligne.

### Containerisation

- Docker
- Docker Compose pour lancer :
  - front ;
  - back ;
  - base de données ;
  - Redis ;
  - services annexes si nécessaire.

---

## 5. PWA à prévoir dès le début

La version mobile du projet sera une **Progressive Web App**. Il est donc important de penser la PWA dès l'initialisation du projet, et non à la fin.

### Objectifs de la PWA

La PWA doit permettre :

- une utilisation confortable sur mobile ;
- une installation sur l'écran d'accueil ;
- une navigation responsive ;
- une expérience proche d'une application mobile ;
- un chargement rapide ;
- une meilleure résilience en cas de connexion instable.

### Éléments techniques à mettre en place

#### Manifest

Créer un fichier `manifest.webmanifest` avec :

- nom de l'application ;
- nom court ;
- icône ;
- couleur principale ;
- couleur de fond ;
- mode d'affichage `standalone` ;
- orientation si nécessaire ;
- URL de démarrage.

Exemple :

```json
{
  "name": "Track'N Share",
  "short_name": "TNS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker

Le service worker permettra de gérer :

- le cache des assets ;
- une page fallback hors-ligne ;
- l'amélioration des performances ;
- éventuellement la synchronisation différée plus tard.

Stratégies possibles :

| Type de ressource | Stratégie |
|---|---|
| Assets statiques | Cache first |
| Données utilisateur | Network first |
| Images et avatars | Stale while revalidate |
| Pages critiques | Network first avec fallback |

#### Responsive mobile-first

Le design doit être pensé d'abord pour mobile :

- navigation simple ;
- menu bas ou menu burger ;
- cartes statistiques lisibles ;
- boutons assez grands ;
- tableaux adaptés au mobile ;
- leaderboards scrollables ;
- pages de profil optimisées.

#### Fonctionnalités PWA bonus

À prévoir en bonus si le temps le permet :

- notifications push ;
- mode hors-ligne limité ;
- synchronisation différée ;
- badge sur l'icône de l'application ;
- prompt d'installation personnalisé.

### Points importants pour la soutenance

La PWA peut être valorisée en montrant :

- l'installation de l'application sur mobile ;
- le mode standalone ;
- le responsive design ;
- la rapidité de chargement ;
- une page offline ;
- une expérience proche d'une app native.

---

## 6. Fonctionnalités principales

### 6.1 Authentification utilisateur

Fonctionnalités de base :

- inscription ;
- connexion ;
- déconnexion ;
- modification du profil ;
- suppression du compte ;
- mot de passe oublié ;
- vérification d'email, si possible.

Informations du profil :

- pseudo ;
- email ;
- avatar ;
- bannière ;
- bio ;
- badges ;
- jeux liés ;
- statistiques publiques ou privées.

---

### 6.2 Connexion de comptes de jeu

L'utilisateur pourra lier ses comptes de jeu afin de récupérer ses statistiques.

Plateformes possibles :

- Steam ;
- Epic Games ;
- APIs de jeux spécifiques ;
- API mockée en développement ou fallback.

Données récupérées :

- nombre de parties ;
- victoires ;
- défaites ;
- kills ;
- deaths ;
- K/D ratio ;
- winrate ;
- temps de jeu ;
- rang, si disponible ;
- historique de matchs, si disponible.

Il est recommandé de commencer avec une seule API réelle ou une API simulée afin de garantir un MVP stable.

---

### 6.3 Système de points

Le système de points doit être compréhensible, équilibré et documenté.

Exemple de formule :

```txt
Score = (K/D ratio × 50) + (Winrate × 40) + (Nombre de parties × 0.5)
```

Variables possibles :

- K/D ratio ;
- winrate ;
- nombre de parties jouées ;
- activité récente ;
- bonus de régularité ;
- bonus de série de victoires ;
- malus en cas d'inactivité.

Pour éviter les abus, il faut prévoir un minimum de parties jouées pour apparaître dans un leaderboard.

Exemple :

```txt
Un joueur doit avoir joué au moins 10 parties pendant la saison pour être classé.
```

---

### 6.4 Saisons et historique trimestriel

Le récapitulatif tous les 3 mois peut être transformé en système de **saisons**.

Une saison dure 3 mois :

- Saison 1 : janvier à mars ;
- Saison 2 : avril à juin ;
- Saison 3 : juillet à septembre ;
- Saison 4 : octobre à décembre.

À la fin de chaque saison :

- les statistiques sont archivées ;
- les leaderboards sont figés ;
- les meilleurs joueurs et équipes sont sauvegardés ;
- une nouvelle saison commence ;
- les utilisateurs peuvent consulter leur historique.

Avantages :

- logique gaming plus claire ;
- meilleure motivation des utilisateurs ;
- conservation des performances passées ;
- possibilité de comparer les saisons.

---

### 6.5 Leaderboards

Types de leaderboards :

- leaderboard solo par jeu ;
- leaderboard par équipe pour les jeux multijoueurs ;
- leaderboard par saison ;
- leaderboard global ;
- leaderboard entre amis ;
- leaderboard interne à une équipe.

Colonnes possibles :

| Rang | Joueur | Score | K/D | Winrate | Parties | Saison |
|---|---|---:|---:|---:|---:|---|

Pour les équipes :

| Rang | Équipe | Score moyen | K/D moyen | Winrate | Membres | Saison |
|---|---|---:|---:|---:|---:|---|

---

### 6.6 Équipes

Fonctionnalités principales :

- créer une équipe ;
- générer un code d'invitation ;
- rejoindre une équipe via un code ;
- inviter un ami ;
- accepter ou refuser une invitation ;
- quitter une équipe ;
- supprimer une équipe ;
- consulter les membres ;
- consulter les statistiques globales.

Rôles proposés :

| Rôle | Permissions |
|---|---|
| Capitaine | Modifier l'équipe, inviter, exclure, supprimer l'équipe |
| Co-capitaine | Inviter, gérer certains membres |
| Membre | Voir l'équipe, discuter, participer |
| Invité | En attente d'acceptation |

Statistiques d'équipe :

- score moyen ;
- score total ;
- winrate moyen ;
- K/D moyen ;
- meilleur joueur ;
- progression de la saison ;
- position dans le leaderboard.

---

### 6.7 Matchmaking interne

Le matchmaking peut être une fonctionnalité de recommandation plutôt qu'un vrai système de lancement de parties.

Objectifs :

- trouver des joueurs de niveau similaire ;
- trouver des équipes qui recrutent ;
- recommander des coéquipiers ;
- comparer des profils compatibles.

Critères possibles :

- jeu ;
- niveau ;
- K/D ratio ;
- winrate ;
- disponibilité ;
- rôle préféré ;
- langue ;
- plateforme ;
- style de jeu.

Exemple :

```txt
Cette équipe recherche :
- un joueur Valorant
- rôle : support
- K/D minimum : 1.2
- disponible le soir
```

---

### 6.8 Chat d'équipe et messages privés

Fonctionnalités :

- chat de team ;
- messages privés ;
- statut lu/non lu ;
- statut en ligne/hors ligne ;
- notifications de nouveaux messages ;
- historique de conversation ;
- suppression ou masquage de messages.

Point important : les messages privés doivent être traités comme des données sensibles.

---

### 6.9 Profils utilisateurs

Un profil utilisateur peut afficher :

- avatar ;
- bannière ;
- pseudo ;
- bio ;
- jeux liés ;
- badges ;
- score actuel ;
- rang actuel ;
- statistiques principales ;
- historique des saisons ;
- équipes ;
- amis ;
- visibilité publique ou privée.

URL possible :

```txt
/profile/:id
```

ou :

```txt
/players/:username
```

---

### 6.10 Fonctionnalités sociales

Fonctionnalités possibles :

- ajout d'amis ;
- suppression d'amis ;
- liste d'amis ;
- statut en ligne/hors ligne ;
- fil d'actualité ;
- réactions ;
- commentaires ;
- partage de performances ;
- notifications sociales.

À garder en bonus si le temps est limité.

---

### 6.11 Gamification

Idées de badges :

| Badge | Condition |
|---|---|
| First Blood | Première partie enregistrée |
| Team Founder | Première équipe créée |
| Hot Streak | 5 victoires d'affilée |
| MVP | Meilleur joueur de son équipe sur une saison |
| Veteran | 100 parties enregistrées |
| Clutch Player | Winrate supérieur à 70 % |
| Challenger | Premier défi envoyé |
| Social Player | 10 amis ajoutés |

Autres idées :

- niveaux d'expérience ;
- titres débloquables ;
- streaks de connexion ;
- objectifs personnels ;
- records personnels.

---

### 6.12 Comparaison joueur contre joueur

Page possible :

```txt
/compare
```

Exemple de comparaison :

| Statistique | Clément | Ioanes |
|---|---:|---:|
| Score | 1840 | 1710 |
| K/D | 1.8 | 1.5 |
| Winrate | 62 % | 58 % |
| Parties jouées | 120 | 98 |
| Rang | #12 | #18 |

Intérêt :

- très visuel ;
- simple à comprendre ;
- utile pour la démonstration ;
- bon rendu front-end.

---

### 6.13 Graphiques et analyses

Graphiques possibles :

- évolution du score ;
- évolution du K/D ;
- évolution du winrate ;
- évolution du classement ;
- comparaison entre saisons ;
- comparaison avec la moyenne de l'équipe.

Librairies possibles :

- Recharts ;
- Chart.js ;
- Nivo ;
- Tremor.

---

## 7. Sécurité, confidentialité et protection des données

La sécurité doit être pensée dès le début du projet, surtout parce que la plateforme contient :

- comptes utilisateurs ;
- emails ;
- mots de passe ;
- comptes de jeux liés ;
- statistiques ;
- équipes ;
- messages privés ;
- chats ;
- tokens éventuels d'APIs externes.

---

### 7.1 Sécurité front-end

Bonnes pratiques :

- ne jamais stocker de mot de passe côté front ;
- ne jamais exposer de clé API dans le code front ;
- éviter de stocker les tokens dans le `localStorage` si possible ;
- préférer des cookies `HttpOnly`, `Secure`, `SameSite`;
- protéger les routes privées ;
- vérifier les rôles côté front pour l'affichage, mais jamais uniquement côté front ;
- nettoyer les entrées utilisateur avant affichage ;
- se protéger contre les attaques XSS ;
- éviter l'injection HTML directe ;
- mettre en place une Content Security Policy, si possible.

Points PWA spécifiques :

- ne pas mettre en cache les données sensibles sans réflexion ;
- éviter de stocker les messages privés en clair dans le cache ;
- ne pas rendre accessible hors-ligne des données confidentielles sans protection ;
- invalider le cache lors de la déconnexion ;
- protéger les pages privées même en mode PWA.

---

### 7.2 Sécurité back-end

Bonnes pratiques avec NestJS :

- validation stricte des DTO ;
- utilisation de `class-validator` et `class-transformer` ;
- authentification robuste ;
- autorisation par rôles ;
- guards NestJS ;
- rate limiting ;
- protection contre le bruteforce ;
- logs propres sans données sensibles ;
- gestion centralisée des erreurs ;
- variables d'environnement pour les secrets ;
- jamais de secrets dans GitHub ;
- CORS configuré précisément ;
- helmet pour les headers de sécurité ;
- limitation de taille des payloads ;
- vérification des permissions sur chaque ressource.

Exemples de contrôles importants :

- un utilisateur ne peut modifier que son propre profil ;
- un membre ne peut pas exclure un capitaine ;
- un joueur ne peut pas accéder aux messages privés d'un autre ;
- un utilisateur ne peut pas rejoindre une équipe privée sans invitation ;
- un utilisateur bloqué ne peut plus envoyer de messages privés.

---

### 7.3 Authentification

Options possibles :

#### JWT avec cookies sécurisés

Approche recommandée :

- access token court ;
- refresh token plus long ;
- refresh token stocké en cookie `HttpOnly`;
- rotation des refresh tokens ;
- révocation à la déconnexion.

#### Sécurité des mots de passe

Les mots de passe doivent être hashés avec :

- Argon2, recommandé ;
- ou bcrypt.

À ne jamais faire :

- stocker les mots de passe en clair ;
- utiliser un simple hash SHA256 sans salt ;
- envoyer le mot de passe dans les logs ;
- renvoyer le hash au front.

---

### 7.4 Sécurité de la base de données

À prévoir :

- accès BDD uniquement depuis le back-end ;
- pas d'accès direct depuis le front ;
- identifiants BDD dans `.env`;
- sauvegardes régulières ;
- séparation des environnements dev/prod ;
- chiffrement des données sensibles ;
- principe du moindre privilège ;
- protection contre les injections ;
- validation côté back avant écriture.

Si Redis-JSON est utilisé :

- activer l'authentification Redis ;
- ne pas exposer Redis publiquement ;
- restreindre l'accès réseau ;
- utiliser des préfixes de clés clairs ;
- définir une stratégie de sauvegarde ;
- éviter de stocker des secrets en clair ;
- surveiller la mémoire utilisée ;
- prévoir l'expiration des données temporaires.

Exemples de clés Redis :

```txt
user:{id}
profile:{userId}
gameAccount:{userId}:{platform}
stats:{userId}:{gameId}:{seasonId}
team:{id}
teamMembers:{teamId}
leaderboard:{gameId}:{seasonId}
conversation:{id}
messages:{conversationId}
season:{id}
```

---

### 7.5 Confidentialité des messages privés

Les messages privés et les chats d'équipe doivent être traités comme des données sensibles.

Il existe plusieurs niveaux possibles.

#### Niveau 1 — Chiffrement en base

Les messages sont chiffrés avant stockage en base.

Avantages :

- protège les données en cas de fuite de base ;
- plus simple à mettre en place qu'un vrai chiffrement de bout en bout.

Limite :

- le serveur peut encore lire les messages au moment du traitement.

#### Niveau 2 — Chiffrement applicatif

Le back-end chiffre les messages avant de les enregistrer, avec une clé gérée côté serveur.

À prévoir :

- clé de chiffrement dans les variables d'environnement ;
- rotation des clés ;
- séparation des clés par environnement ;
- IV unique par message ;
- algorithme moderne comme AES-GCM.

#### Niveau 3 — Chiffrement de bout en bout

Les messages sont chiffrés côté client et le serveur ne peut pas les lire.

Avantages :

- confidentialité maximale ;
- même le serveur ne peut pas lire les messages.

Limites :

- beaucoup plus complexe ;
- gestion des clés difficile ;
- récupération de compte compliquée ;
- recherche dans les messages difficile ;
- notifications avec contenu impossible ou limité.

Pour un projet étudiant, il est recommandé de viser au minimum le **niveau 1 ou 2**, puis de présenter le chiffrement de bout en bout comme une évolution possible.

---

### 7.6 Tokens d'APIs externes

Si vous stockez des tokens Steam, Epic ou autres :

- ne jamais les exposer côté front ;
- les chiffrer en base ;
- stocker uniquement ce qui est nécessaire ;
- prévoir la révocation ;
- prévoir l'expiration ;
- ne jamais les écrire dans les logs ;
- demander uniquement les permissions nécessaires.

---

### 7.7 Protection contre les abus

À prévoir :

- rate limit sur login ;
- rate limit sur envoi de messages ;
- rate limit sur invitations ;
- blocage utilisateur ;
- signalement de contenu ;
- modération ;
- anti-spam ;
- limitation du nombre d'équipes créées ;
- limitation des messages trop longs ;
- validation des uploads d'avatar.

---

### 7.8 Sécurité des fichiers et avatars

Si les utilisateurs peuvent uploader des avatars ou bannières :

- limiter la taille des fichiers ;
- accepter uniquement certains formats ;
- renommer les fichiers ;
- ne jamais exécuter les fichiers uploadés ;
- scanner ou vérifier les fichiers ;
- stocker les fichiers hors du dossier exécutable ;
- utiliser un CDN ou stockage dédié si possible.

Formats recommandés :

- PNG ;
- JPG ;
- WebP.

---

### 7.9 RGPD et données personnelles

Même pour un projet étudiant, il est intéressant de prévoir une section RGPD.

À prévoir :

- consentement utilisateur ;
- politique de confidentialité ;
- suppression du compte ;
- export des données ;
- modification des informations personnelles ;
- choix de visibilité du profil ;
- profil public ou privé ;
- masquage des statistiques ;
- suppression ou anonymisation des messages si besoin.

Données personnelles possibles :

- email ;
- pseudo ;
- avatar ;
- comptes de jeux liés ;
- messages privés ;
- amis ;
- équipes ;
- activité.

---

### 7.10 Logs et monitoring

Les logs doivent aider à débugger sans exposer les données privées.

À éviter dans les logs :

- mots de passe ;
- tokens ;
- emails si pas nécessaire ;
- contenu des messages privés ;
- clés API ;
- refresh tokens.

À logger :

- erreurs techniques ;
- identifiants internes non sensibles ;
- date ;
- endpoint ;
- statut HTTP ;
- temps de réponse ;
- événements de sécurité importants.

---

## 8. Administration et modération

Fonctionnalités d'administration possibles :

- voir les utilisateurs ;
- désactiver un compte ;
- gérer les signalements ;
- supprimer un message inapproprié ;
- bannir temporairement un utilisateur ;
- gérer les équipes signalées ;
- consulter les logs d'activité ;
- gérer les jeux disponibles.

Fonctionnalités de modération côté utilisateur :

- signaler un profil ;
- signaler un message ;
- bloquer un utilisateur ;
- rendre son profil privé ;
- masquer ses statistiques.

---

## 9. Pages principales

### Pages MVP

```txt
/                          Landing page
/register                  Inscription
/login                     Connexion
/dashboard                 Dashboard utilisateur
/profile/:id               Profil utilisateur
/settings                  Paramètres
/games                     Liste des jeux
/games/:id/leaderboard     Leaderboard par jeu
/teams                     Mes équipes
/teams/create              Création d'équipe
/teams/:id                 Page équipe
/teams/:id/chat            Chat d'équipe
/compare                   Comparaison de joueurs
/seasons                   Archives des saisons
```

### Pages bonus

```txt
/friends                   Liste d'amis
/messages                  Messages privés
/notifications             Notifications
/achievements              Badges
/admin                     Administration
/search                    Recherche globale
/tournaments               Tournois
```

---

## 10. Modèle de données proposé

### User

```txt
id
email
username
passwordHash
avatar
banner
bio
createdAt
updatedAt
lastLoginAt
privacyStatus
role
```

### GameAccount

```txt
id
userId
platform
externalUsername
externalId
accessTokenEncrypted
refreshTokenEncrypted
linkedAt
lastSyncAt
```

### Game

```txt
id
name
platform
type
isTeamBased
apiProvider
createdAt
```

### PlayerStats

```txt
id
userId
gameId
seasonId
wins
losses
kills
deaths
matchesPlayed
kdRatio
winrate
score
fetchedAt
```

### Team

```txt
id
name
tag
description
avatar
ownerId
inviteCode
visibility
createdAt
updatedAt
```

### TeamMember

```txt
id
teamId
userId
role
joinedAt
```

### Season

```txt
id
name
startDate
endDate
status
createdAt
```

### Conversation

```txt
id
type
createdAt
updatedAt
```

### Message

```txt
id
conversationId
senderId
contentEncrypted
iv
createdAt
editedAt
deletedAt
readAt
```

### Achievement

```txt
id
name
description
condition
icon
points
```

### UserAchievement

```txt
id
userId
achievementId
unlockedAt
```

### Notification

```txt
id
userId
type
title
content
readAt
createdAt
```

---

## 11. Architecture back-end proposée

Modules NestJS possibles :

```txt
AuthModule
UsersModule
ProfilesModule
GamesModule
GameAccountsModule
StatsModule
LeaderboardModule
TeamsModule
TeamInvitationsModule
FriendsModule
MessagesModule
NotificationsModule
SeasonsModule
AchievementsModule
AdminModule
SecurityModule
```

Services importants :

- `AuthService`
- `UsersService`
- `StatsSyncService`
- `LeaderboardService`
- `SeasonService`
- `TeamService`
- `MessageService`
- `EncryptionService`
- `NotificationService`

Tâches planifiées :

- rafraîchir les stats ;
- archiver les saisons ;
- recalculer les leaderboards ;
- supprimer les invitations expirées ;
- nettoyer les notifications anciennes ;
- vérifier les comptes de jeux déconnectés.

Avec NestJS :

```txt
@nestjs/schedule
```

---

## 12. Architecture front-end proposée

Structure possible :

```txt
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
```

Éléments à prévoir :

- composants réutilisables ;
- layout desktop ;
- layout mobile ;
- guards de routes ;
- service API centralisé ;
- gestion des erreurs ;
- store utilisateur ;
- store notifications ;
- store socket ;
- hooks personnalisés ;
- gestion du thème clair/sombre.

---

## 13. MVP recommandé

Le projet complet est ambitieux. Il faut donc prioriser.

### MVP obligatoire

1. Authentification
2. Profil utilisateur
3. PWA installable
4. Connexion ou simulation d'un compte de jeu
5. Affichage des statistiques joueur
6. Système de score
7. Leaderboard solo
8. Création d'équipe
9. Invitation via code
10. Statistiques d'équipe
11. Leaderboard d'équipe
12. Saisons de 3 mois
13. Archivage des statistiques
14. Chat d'équipe simple
15. Sécurité de base
16. Confidentialité minimale des messages

### Bonus réalistes

1. Amis
2. Messages privés
3. Badges
4. Objectifs personnels
5. Graphiques de progression
6. Comparaison joueur contre joueur
7. Notifications
8. Mode sombre
9. Recherche de joueurs et équipes
10. Page publique partageable

### Bonus avancés

1. Tournois internes
2. Calendrier d'équipe
3. Votes et sondages
4. Feed social
5. Replays et bibliothèque d'équipe
6. Chiffrement de bout en bout
7. Notifications push PWA
8. Matchmaking avancé
9. Rapports mensuels ou annuels
10. Modération complète

---

## 14. Roadmap proposée

### Phase 1 — Initialisation

- Créer le repo.
- Initialiser React + TypeScript.
- Initialiser NestJS + TypeScript.
- Ajouter Docker.
- Ajouter Redis ou PostgreSQL.
- Préparer les variables d'environnement.
- Mettre en place la base PWA.
- Créer le manifest.
- Préparer le service worker.

### Phase 2 — Authentification et sécurité de base

- Inscription.
- Connexion.
- Déconnexion.
- Hash des mots de passe.
- JWT ou sessions.
- Guards NestJS.
- Routes protégées.
- Validation des DTO.
- Rate limiting.
- CORS propre.
- Helmet.

### Phase 3 — Profils utilisateurs

- Profil utilisateur.
- Modification du profil.
- Avatar.
- Bio.
- Paramètres de confidentialité.
- Page publique de profil.

### Phase 4 — Jeux et statistiques

- Créer les entités jeux.
- Lier un compte de jeu.
- Récupérer ou simuler des stats.
- Stocker les stats.
- Calculer K/D, winrate et score.
- Afficher les stats sur le dashboard.

### Phase 5 — Leaderboards et saisons

- Créer les saisons.
- Créer le leaderboard solo.
- Filtrer par jeu.
- Archiver les stats.
- Afficher les anciennes saisons.

### Phase 6 — Équipes

- Création d'équipe.
- Code d'invitation.
- Rejoindre une équipe.
- Rôles.
- Statistiques d'équipe.
- Leaderboard équipe.

### Phase 7 — Temps réel

- Socket.io.
- Chat d'équipe.
- Statut en ligne/hors ligne.
- Notifications simples.

### Phase 8 — Sécurité avancée

- Chiffrement des messages en base.
- Chiffrement des tokens externes.
- Logs sécurisés.
- Gestion des signalements.
- Blocage utilisateur.
- Suppression de compte.
- Export des données.

### Phase 9 — Bonus et polish

- Graphiques.
- Badges.
- Comparaison joueur contre joueur.
- Objectifs personnels.
- Mode sombre.
- Notifications PWA.
- Mode démo.
- Données seedées.

---

## 15. Idées pour la démonstration finale

Pour une soutenance réussie, il faut éviter une application vide.

À préparer :

- un mode démo ;
- plusieurs utilisateurs fictifs ;
- plusieurs équipes ;
- plusieurs jeux ;
- plusieurs saisons ;
- un leaderboard déjà rempli ;
- des messages dans un chat d'équipe ;
- des badges débloqués ;
- des graphiques avec historique ;
- une démonstration mobile PWA.

Scénario de démo possible :

1. Arrivée sur la landing page.
2. Connexion avec un compte démo.
3. Affichage du dashboard.
4. Consultation des stats.
5. Comparaison avec un autre joueur.
6. Ouverture du leaderboard.
7. Création ou consultation d'une équipe.
8. Chat d'équipe en temps réel.
9. Affichage de l'historique d'une saison.
10. Installation de la PWA sur mobile ou navigateur.

---

## 16. Points de vigilance

### APIs externes

Les APIs de jeux peuvent être complexes ou limitées. Il faut donc prévoir :

- une API mockée ;
- des données seedées ;
- un fallback ;
- une synchronisation manuelle ;
- une gestion propre des erreurs.

### Scope du projet

Le projet est très riche. Il faut éviter de vouloir tout coder.

Priorité :

1. faire un MVP propre ;
2. sécuriser les fonctionnalités principales ;
3. rendre l'app agréable ;
4. ajouter les bonus seulement après.

### Redis-JSON

Redis-JSON peut fonctionner, mais il faut faire attention aux relations complexes.

Pour un projet avec utilisateurs, équipes, amis, messages, saisons et historiques, une base relationnelle comme PostgreSQL serait plus naturelle.

Recommandation idéale :

```txt
PostgreSQL : données principales
Redis : cache, sessions, leaderboards, temps réel
```

Mais si Redis-JSON est imposé, il faut bien structurer les clés et les documents.

---

## 17. Fonctionnalités proposées en plus

### Cartes de performance partageables

Permettre à un utilisateur de générer une carte visuelle :

```txt
Clément — Saison 2
Top 4 %
K/D : 1.82
Winrate : 64 %
Rang : #128
```

Cette carte pourrait être partagée sur un profil ou exportée en image.

### Objectifs personnels

Exemples :

- atteindre 2.0 de K/D ;
- dépasser 60 % de winrate ;
- gagner 10 parties cette semaine ;
- entrer dans le top 100 ;
- battre son record personnel.

### Rivalités

Un joueur ou une équipe peut suivre un rival :

- comparaison directe ;
- écart de points ;
- historique des confrontations ;
- défi amical.

### Recherche avancée

Recherche de :

- joueurs ;
- équipes ;
- jeux ;
- amis ;
- classements.

Filtres :

- jeu ;
- rang ;
- winrate ;
- K/D ;
- statut en ligne ;
- équipe ouverte ;
- disponibilité.

### Pages publiques partageables

Exemples :

```txt
/players/clement
/teams/tracknshare
```

Ces pages afficheraient :

- statistiques ;
- badges ;
- rang ;
- historique ;
- jeux connectés.

---

## 18. Conclusion

Track'N Share est un projet très complet, pertinent pour un projet final de troisième année en développement.

Il permet de montrer des compétences sur :

- front-end moderne ;
- back-end structuré ;
- base de données ;
- temps réel ;
- APIs externes ;
- sécurité ;
- PWA ;
- architecture ;
- UX/UI ;
- gestion de projet.

La priorité doit être de construire un MVP solide autour de :

- l'authentification ;
- les profils ;
- les statistiques ;
- le scoring ;
- les leaderboards ;
- les équipes ;
- les saisons ;
- le chat ;
- la PWA ;
- la sécurité.

Les fonctionnalités sociales, la gamification, les tournois, le matchmaking avancé et le chiffrement de bout en bout peuvent être présentés comme des évolutions futures ou ajoutés progressivement si le temps le permet.
