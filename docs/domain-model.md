# Track'N Share — Domain Model

## Objectif du fichier

Ce fichier décrit les principales entités métier de Track'N Share.

Il sert de référence pour les données manipulées côté API, base de données et front-end.

## Vue d'ensemble

Le modèle métier tourne autour de :

- utilisateurs ;
- jeux ;
- comptes de jeux ;
- statistiques joueur ;
- saisons ;
- leaderboards ;
- équipes ;
- membres d'équipe ;
- invitations ;
- chat d'équipe ;
- messages ;
- notifications futures ;
- achievements futurs.

## User

Représente un utilisateur de la plateforme.

Champs recommandés :

```txt
id
email
username
passwordHash
avatar
banner
bio
role
privacyStatus
createdAt
updatedAt
lastLoginAt
```

Règles :
- `email` unique ;
- `passwordHash` jamais retourné au front ;
- rôle par défaut : `PLAYER` ;
- les données sensibles ne doivent jamais être loggées.

## Game

Représente un jeu supporté ou simulé.

Champs recommandés :

```txt
id
name
slug
platform
type
isTeamBased
apiProvider
createdAt
updatedAt
```

Exemples :
- Valorant mock ;
- Rocket League mock ;
- Counter-Strike mock ;
- Steam game future ;
- Epic game future.

## GameAccount

Représente le lien entre un utilisateur Track'N Share et une plateforme externe ou simulée.

Champs recommandés :

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
createdAt
updatedAt
```

Règles :
- les tokens externes restent côté back-end ;
- si des tokens sont stockés, ils doivent être chiffrés ;
- le MVP peut utiliser un compte mock sans token réel.

## Season

Représente une période compétitive de 3 mois.

Champs recommandés :

```txt
id
name
startDate
endDate
status
createdAt
updatedAt
```

Statuts possibles :

```txt
ACTIVE
ARCHIVED
UPCOMING
```

Règles :
- une seule saison active à la fois ;
- les stats sont rattachées à une saison ;
- les leaderboards peuvent être filtrés par saison.

## PlayerStats

Représente les statistiques d'un joueur pour un jeu et une saison.

Champs recommandés :

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
playtimeMinutes
kdRatio
winrate
score
fetchedAt
createdAt
updatedAt
```

Règles :
- `kdRatio`, `winrate` et `score` sont calculés côté back-end ;
- gérer `deaths = 0` ;
- gérer `matchesPlayed = 0` ;
- ne pas faire confiance au front pour le score ;
- conserver les anciennes données si le provider échoue.

## Score

Formule MVP recommandée :

```txt
Score = (K/D ratio × 50) + (Winrate × 40) + (Nombre de parties × 0.5)
```

Règles :
- formule centralisée dans un service ou util back-end ;
- test unitaire recommandé ;
- score arrondi de manière cohérente ;
- possibilité d'ajuster la formule plus tard.

## LeaderboardEntry

Peut être calculé depuis PlayerStats ou stocké dans une table dédiée plus tard.

Champs utiles côté API :

```txt
rank
userId
username
avatar
gameId
gameName
seasonId
score
kdRatio
winrate
matchesPlayed
```

Règles :
- trier par score décroissant ;
- exclure les joueurs sans stats exploitables ;
- prévoir pagination ;
- filtrer par jeu et saison.

## Team

Représente une équipe de joueurs.

Champs recommandés :

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

Visibilités possibles :

```txt
PUBLIC
PRIVATE
INVITE_ONLY
```

Règles :
- le créateur devient capitaine ;
- `inviteCode` ne doit pas être trop prévisible ;
- une équipe peut avoir des statistiques agrégées plus tard.

## TeamMember

Représente l'appartenance d'un utilisateur à une équipe.

Champs recommandés :

```txt
id
teamId
userId
role
joinedAt
createdAt
updatedAt
```

Rôles MVP :

```txt
CAPTAIN
MEMBER
```

Rôles futurs possibles :

```txt
CO_CAPTAIN
INVITED
```

Règles :
- un membre ne peut pas exécuter une action capitaine ;
- un non-membre ne peut pas lire le chat ;
- les permissions sont toujours vérifiées côté back-end.

## TeamInvitation

Optionnel pour le MVP si le code d'invitation est stocké directement dans `Team`.

Champs possibles :

```txt
id
teamId
invitedUserId
invitedById
code
status
expiresAt
createdAt
updatedAt
```

Statuts possibles :

```txt
PENDING
ACCEPTED
REFUSED
EXPIRED
CANCELLED
```

## ChatMessage

Message du chat d'équipe.

Champs recommandés :

```txt
id
teamId
senderId
content
createdAt
editedAt
deletedAt
```

Version plus sécurisée future :

```txt
contentEncrypted
iv
```

Règles :
- membre requis ;
- message vide refusé ;
- longueur maximale ;
- ne pas logger le contenu complet ;
- historique limité par pagination ;
- Socket.io diffuse seulement aux membres de la room.

## Conversation et Message

Pour les messages privés futurs.

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

À reporter après MVP sauf besoin explicite.

## Achievement

Bonus futur.

```txt
id
name
description
condition
icon
points
```

## UserAchievement

Bonus futur.

```txt
id
userId
achievementId
unlockedAt
```

## Notification

Bonus ou P1.

```txt
id
userId
type
title
content
readAt
createdAt
```

Types possibles :
- invitation équipe ;
- nouveau message ;
- changement de rang ;
- fin de saison ;
- badge débloqué.

## Relations principales

```txt
User 1---n GameAccount
User 1---n PlayerStats
Game 1---n PlayerStats
Season 1---n PlayerStats
User 1---n TeamMember
Team 1---n TeamMember
Team 1---n ChatMessage
User 1---n ChatMessage
```

## Règles métier prioritaires

- Un utilisateur ne peut modifier que son propre profil.
- Un joueur ne peut consulter ses stats privées que s'il est autorisé.
- Un non-membre ne peut pas lire les messages d'une équipe.
- Un membre simple ne peut pas gérer les invitations sensibles.
- Un capitaine peut gérer son équipe.
- Le score est toujours calculé côté back-end.
- Les données de démo doivent être fictives.
