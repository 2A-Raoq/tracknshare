# EPIC GAMES API — DOCUMENTATION D'INTÉGRATION

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document synthétise les informations officielles utiles à une éventuelle intégration Epic Games / Epic Online Services dans Track'N Share.

Les informations ci-dessous proviennent uniquement des documentations officielles Epic Games, Epic Online Services et Unreal Engine. L'objectif est de comprendre ce qui est réellement exploitable pour Track'N Share, sans supposer l'existence d'une API publique universelle équivalente à Steam pour récupérer automatiquement les statistiques de tous les joueurs Epic Games.

Conclusion rapide pour Track'N Share

L'écosystème Epic est pertinent, mais plus complexe à exploiter que Steam pour le projet Track'N Share.

Epic propose notamment Epic Online Services, l'authentification, les services de compte, les interfaces User Info, Stats et Leaderboards. Ces services sont puissants, mais ils sont surtout pensés pour des jeux intégrant EOS / Unreal Online Services, ou pour des développeurs ayant configuré leur produit dans l'écosystème Epic.

Pour Track'N Share, l'intégration Epic doit donc être considérée comme une évolution après MVP. Le MVP doit rester basé sur une API mockée et des données seedées.

## 1 Sources officielles utilisées

Sources consultées :

- Epic Online Services — Documentation officielle

https://dev.epicgames.com/docs/epic-online-services

- Epic Online Services — Web APIs

https://dev.epicgames.com/docs/web-api-ref

- Epic Online Services — Auth Interface

https://dev.epicgames.com/docs/epic-online-services/auth

- Epic Online Services — Connect Interface

https://dev.epicgames.com/docs/epic-online-services/connect

- Unreal Engine Documentation — Auth Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/auth-interface-in-unreal-engine

- Unreal Engine Documentation — User Info Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/user-info-interface-in-unreal-engine

- Unreal Engine Documentation — Stats Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/stats-interface-in-unreal-engine

- Unreal Engine Documentation — Leaderboards Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/leaderboards-interface-in-unreal-engine

- Epic Games Documentation — Fortnite Data API

https://dev.epicgames.com/documentation/fortnite-creative/using-fortnite-data-api-in-fortnite

Remarque : ce document doit être mis à jour si Epic modifie ses APIs, ses services ou ses conditions d'accès.

## 2 Clarification importante

### 2.1 Epic Games API n'est pas équivalente à Steam Web API

Contrairement à Steam Web API, il ne faut pas supposer qu'Epic fournit une API publique simple permettant à une application tierce de récupérer automatiquement les statistiques de tous les joueurs Epic Games sur n'importe quel jeu.

Les services Epic sont plutôt organisés autour de :

- Epic Online Services ;

- Unreal Online Services ;

- authentification ;

- comptes ;

- product users ;

- stats configurées pour un produit ;

- leaderboards configurés pour un produit ;

- services de jeu intégrés par les développeurs.

Conséquence pour Track'N Share :

L'intégration Epic doit être étudiée au cas par cas selon le jeu, le produit, les permissions et les services disponibles.

### 2.2 Ce qui est réaliste pour Track'N Share

Réaliste après MVP :

- documenter l'écosystème Epic ;

- préparer un provider EPIC dans le modèle game_accounts ;

- prévoir un mapping générique ;

- éventuellement lier une identité Epic si un flux officiel est mis en place ;

- exploiter EOS uniquement pour des jeux/services compatibles.

Non réaliste pour MVP :

- garantir la récupération de kills, deaths, wins, losses depuis tous les jeux Epic ;

- remplacer l'API mockée par Epic ;

- dépendre d'une intégration Epic pour la soutenance.

## 3 Epic Online Services

### 3.1 Définition

Epic Online Services, ou EOS, est un ensemble de services en ligne proposés par Epic pour les développeurs de jeux.

EOS couvre plusieurs domaines :

- authentification ;

- comptes utilisateurs ;

- connect ;

- amis ;

- achievements ;

- stats ;

- leaderboards ;

- matchmaking ;

- lobby ;

- stockage et autres services selon configuration.

### 3.2 Pertinence pour Track'N Share

EOS est pertinent si Track'N Share doit intégrer un jeu ou service qui utilise déjà EOS et expose des données de statistiques ou de leaderboards.

Cependant, Track'N Share n'est pas lui-même un jeu. Il s'agit d'une plateforme tierce de suivi de statistiques. L'accès aux stats dépendra donc de ce qui est autorisé et configuré côté Epic / produit / jeu.

## 4 Authentification Epic

### 4.1 Auth Interface

La documentation Epic / Unreal décrit une Auth Interface utilisée pour authentifier un utilisateur local et obtenir des informations d'identité exploitables par les services en ligne.

Fonctions conceptuelles importantes :

- login ;

- logout ;

- vérification de statut d'authentification ;

- récupération d'identifiant utilisateur.

Dans les documentations EOS API, des fonctions comme EOS_Auth_Login et EOS_Auth_Logout existent pour gérer l'authentification.

### 4.2 Usage Track'N Share

Une intégration avancée pourrait permettre :

- connecter un utilisateur via Epic ;

- récupérer un identifiant Epic / EOS ;

- lier cette identité au compte Track'N Share ;

- utiliser cet identifiant comme externalId dans game_accounts.

Mapping possible :

- platform = EPIC ;

- externalId = Epic Account ID ou Product User ID selon le service ;

- externalUsername = display name si accessible ;

- provider = EPIC ou EOS.

### 4.3 Limites

- l'authentification Epic demande une configuration développeur ;

- les flux exacts dépendent du contexte d'intégration ;

- les tokens ne doivent jamais être exposés côté front ;

- Track'N Share doit éviter de promettre une récupération universelle de données.

## 5 Connect Interface

### 5.1 Définition

La Connect Interface d'Epic Online Services permet de connecter des utilisateurs à EOS via différents systèmes d'identité et d'obtenir un Product User ID.

Le Product User ID est utilisé par plusieurs services EOS.

### 5.2 Usage Track'N Share

La Connect Interface peut être pertinente si Track'N Share exploite des services EOS associés à un produit.

Mapping possible :

- Product User ID → game_accounts.externalId ;

- provider = EOS ;

- compte lié à l'utilisateur Track'N Share.

### 5.3 Point de vigilance

Epic Account ID et Product User ID ne doivent pas être confondus.

Le choix dépend de l'API utilisée.

## 6 User Info Interface

### 6.1 Définition

La documentation officielle Unreal User Info indique que l'interface User Info permet de récupérer des informations de profil utilisateur depuis des services en ligne compatibles, comme Epic Online Services ou d'autres plateformes.

Les informations peuvent inclure :

- display name ;

- avatar ;

- informations de profil selon disponibilité.

### 6.2 Usage Track'N Share

Track'N Share pourrait utiliser ces informations pour :

- afficher un pseudo Epic / EOS ;

- afficher un avatar ;

- confirmer qu'une identité externe existe ;

- enrichir un profil de compte lié.

Mapping :

- displayName → game_accounts.externalUsername ;

- avatar → game_accounts.metadata.avatarUrl ;

- accountId/productUserId → game_accounts.externalId.

### 6.3 Limites

- les informations disponibles dépendent du service et des permissions ;

- elles ne fournissent pas automatiquement les statistiques compétitives ;

- elles sont utiles pour l'identité, pas pour le scoring complet.

## 7 Stats Interface

### 7.1 Définition

La documentation Unreal / Epic décrit une Stats Interface permettant de manipuler des statistiques utilisateur dans un service en ligne.

Fonctions conceptuelles mentionnées dans la documentation :

- UpdateStats ;

- QueryStats ;

- BatchQueryStats ;

- GetCachedStats.

Ces fonctions servent à mettre à jour, interroger et consulter des statistiques mises en cache.

### 7.2 Usage Track'N Share

Si un jeu ou produit compatible expose des stats via EOS, Track'N Share pourrait :

- interroger les stats d'un utilisateur ;

- récupérer des valeurs définies par le produit ;

- mapper ces valeurs vers kills, deaths, wins, losses si elles existent ;

- recalculer score, K/D et winrate.

### 7.3 Limite majeure

Les stats EOS ne sont pas des statistiques universelles de tous les jeux Epic Games.

Elles doivent être définies et alimentées par le jeu ou produit concerné.

Conséquence :

Track'N Share doit prévoir un mapping spécifique par jeu / produit.

### 7.4 Mapping possible

Exemple hypothétique si un produit expose les stats nécessaires :

- stat_kills → player_stats.kills ;

- stat_deaths → player_stats.deaths ;

- stat_wins → player_stats.wins ;

- stat_losses → player_stats.losses ;

- stat_matches → player_stats.matchesPlayed.

Mais ce mapping ne doit pas être présenté comme garanti.

## 8 Leaderboards Interface

### 8.1 Définition

La documentation Unreal / Epic décrit une Leaderboards Interface permettant d'interagir avec des classements configurés dans un service en ligne.

Les leaderboards permettent de classer des utilisateurs selon des valeurs de stats ou de scores définis dans le produit.

### 8.2 Usage Track'N Share

Track'N Share pourrait éventuellement :

- lire un leaderboard externe EOS ;

- comparer un classement EOS avec son propre leaderboard ;

- importer une position ou un score si autorisé.

### 8.3 Limite

Le leaderboard Track'N Share doit rester calculé en interne à partir de ses propres règles métier.

Pourquoi :

- Track'N Share doit appliquer sa propre formule de score ;

- les leaderboards externes peuvent avoir des règles différentes ;

- les données externes peuvent être incomplètes ;

- les saisons Track'N Share durent trois mois et doivent rester cohérentes.

## 9 Fortnite Data API

### 9.1 Définition

La documentation officielle Fortnite Data API concerne les créateurs Fortnite et l'analyse de données liées aux îles / expériences Fortnite.

Elle permet d'accéder à certaines métriques liées à des créations Fortnite.

### 9.2 Pertinence pour Track'N Share

Pertinence limitée pour le MVP.

La Fortnite Data API ne doit pas être confondue avec une API générale permettant de récupérer les statistiques compétitives individuelles de tous les joueurs Fortnite.

Usage possible :

- documentation future ;

- analyse de performances d'expériences Fortnite si le projet change de périmètre.

Non recommandé pour le MVP Track'N Share.

## 10 Données exploitables pour Track'N Share

### 10.1 Identité externe

Données potentiellement exploitables :

- Epic Account ID ;

- Product User ID ;

- display name ;

- avatar ;

- service utilisé ;

- date de liaison.

Mapping :

- externalId ;

- externalUsername ;

- metadata.avatarUrl ;

- metadata.providerType ;

- lastSyncAt.

### 10.2 Statistiques

Données exploitables uniquement si disponibles dans le produit ou service :

- stats définies par le jeu ;

- valeurs de stats utilisateur ;

- scores ;

- leaderboards configurés.

Track'N Share doit toujours prévoir :

- un état data unavailable ;

- un mapping par jeu ;

- une API mockée ;

- une conservation des anciennes données.

### 10.3 Données non garanties

Non garanties par défaut :

- kills ;

- deaths ;

- wins ;

- losses ;

- matchesPlayed ;

- statistiques Fortnite individuelles ;

- statistiques compétitives universelles ;

- historique multi-jeux.

## 11 Modèle Track'N Share recommandé

11.1 game_accounts

Champs utiles :

- id ;

- userId ;

- platform = EPIC ou EOS ;

- externalId ;

- externalUsername ;

- provider ;

- metadata ;

- lastSyncAt ;

- linkedAt.

11.2 player_stats

Les stats importées, si disponibles, doivent être transformées vers :

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- kdRatio ;

- winrate ;

- score ;

- isEligible ;

- seasonId.

11.3 mapping externe

Une table ou configuration de mapping peut être nécessaire :

external_stat_mappings :

- id ;

- provider ;

- gameId ;

- externalStatName ;

- internalField ;

- transformRule ;

- isRequired.

## 12 Exemple de flux d'intégration Epic / EOS

### 12.1 Liaison de compte Epic avancée

1. L'utilisateur Track'N Share clique sur Lier Epic.

2. Le front lance le flux d'authentification officiel si disponible.

3. Le back reçoit ou vérifie l'identité externe.

4. Le back récupère l'identifiant Epic/EOS.

5. Le back stocke le compte lié dans game_accounts.

6. L'utilisateur voit son compte Epic lié.

### 12.2 Synchronisation de stats EOS

1. L'utilisateur clique sur Synchroniser.

2. Le back identifie le provider EPIC/EOS.

3. Le back vérifie la saison active.

4. Le back interroge les stats disponibles pour le produit.

5. Le back applique le mapping de stats.

6. Le back calcule K/D, winrate et score.

7. Le back sauvegarde dans player_stats.

8. Le leaderboard Track'N Share est mis à jour.

### 12.3 Si les stats ne sont pas disponibles

Le back doit :

- retourner une erreur contrôlée ;

- conserver les anciennes données ;

- indiquer que la source externe ne fournit pas ces stats ;

- proposer l'API mockée ou les données de démo.

## 13 Sécurité

### 13.1 Tokens Epic / EOS

Règles :

- ne jamais exposer les tokens côté front ;

- ne jamais les écrire dans les logs ;

- stocker les secrets dans les variables d'environnement ;

- chiffrer les tokens si stockage nécessaire ;

- limiter les permissions demandées.

### 13.2 Variables d'environnement possibles

EPIC_CLIENT_ID=replace_me

EPIC_CLIENT_SECRET=replace_me

EPIC_DEPLOYMENT_ID=replace_me

EPIC_PRODUCT_ID=replace_me

EPIC_SANDBOX_ID=replace_me

EPIC_ENVIRONMENT=development

Ces noms sont indicatifs et dépendront de l'implémentation réelle.

### 13.3 Appels côté back-end

Les appels aux APIs Epic / EOS doivent être effectués côté back-end.

Le front-end ne doit pas contenir :

- client secret ;

- clés privées ;

- tokens techniques ;

- configuration sensible.

## 14 Gestion des erreurs

Erreurs possibles :

- configuration Epic absente ;

- identifiant externe invalide ;

- token expiré ;

- permissions insuffisantes ;

- stats non configurées ;

- leaderboard inexistant ;

- service indisponible ;

- mapping impossible ;

- réponse incomplète.

Comportement recommandé :

- afficher un message clair ;

- ne pas supprimer les anciennes stats ;

- logger le code d'erreur technique sans données sensibles ;

- basculer vers données mockées pour la démo ;

- distinguer erreur technique et absence de donnée.

## 15 Limites officielles à prendre en compte

### 15.1 Pas de garantie de données universelles

Les services Epic / EOS ne garantissent pas, pour une application tierce, l'accès universel aux statistiques de tous les jeux Epic.

### 15.2 Stats dépendantes du produit

Les stats doivent être définies, alimentées et rendues disponibles dans le contexte du produit ou service concerné.

### 15.3 Leaderboards dépendants du produit

Les leaderboards EOS sont liés à des configurations de produit et ne remplacent pas automatiquement les leaderboards Track'N Share.

### 15.4 Configuration développeur nécessaire

Une intégration réelle nécessite une configuration Epic Developer Portal / EOS.

## 16 Recommandation pour le MVP

Pour le MVP Track'N Share :

- ne pas dépendre d'Epic ;

- conserver provider = MOCK pour les statistiques ;

- documenter provider = EPIC / EOS dans le modèle ;

- prévoir le mapping dans la feuille Mapping-donnees-externes ;

- présenter Epic comme une intégration future.

## 17 Recommandation après MVP

Priorité 1 :

- créer provider EPIC/EOS dans le modèle ;

- documenter les variables d'environnement ;

- préparer un flux de liaison théorique ;

- ne pas encore dépendre des stats réelles.

Priorité 2 :

- mettre en place une authentification Epic officielle ;

- stocker l'identifiant externe ;

- récupérer display name / avatar si disponible.

Priorité 3 :

- intégrer Stats Interface pour un produit compatible ;

- créer un mapping par jeu ;

- gérer les erreurs de stats absentes.

Priorité 4 :

- lire des leaderboards externes compatibles ;

- comparer avec le leaderboard Track'N Share ;

- ajouter des enrichissements communautaires.

## 18 Endpoints internes Track'N Share liés à Epic

Endpoints possibles :

POST /game-accounts/epic/link

Lie un compte Epic / EOS.

GET /game-accounts/epic/me

Retourne les données du compte Epic lié.

POST /stats/sync

Peut accepter provider = EPIC ou EOS si activé.

GET /integrations/epic/status

Vérifie si l'intégration Epic est configurée.

## 19 Exemple JSON interne

Exemple game_account :

{

"platform": "EPIC",

"provider": "EOS",

"externalId": "product_user_id_example",

"externalUsername": "EpicPlayer",

"metadata": {

"accountType": "PRODUCT_USER_ID",

"avatarUrl": "https://example.com/avatar.png"

},

"lastSyncAt": "2026-05-06T10:00:00.000Z"

}

Exemple mapping de stats :

{

"provider": "EOS",

"gameId": "game_1",

"mappings": [

{

"externalStatName": "stat_kills",

"internalField": "kills"

},

{

"externalStatName": "stat_deaths",

"internalField": "deaths"

}

],

"mappingStatus": "GAME_SPECIFIC"

}

## 20 Comparaison Steam / Epic pour Track'N Share

Steam :

- Web API HTTP plus directement exploitable ;

- SteamID, profil, jeux possédés et certaines stats ;

- meilleure candidate pour une première intégration externe réelle.

Epic / EOS :

- services puissants mais plus liés aux produits intégrés ;

- statistiques et leaderboards dépendants du jeu ou produit ;

- intégration plus complexe ;

- meilleure candidate pour une évolution future ciblée.

## 21 Critères d'acceptation

La documentation Epic est considérée correcte si :

- elle ne prétend pas qu'Epic fournit des stats universelles ;

- elle distingue Epic Account ID et Product User ID ;

- elle identifie Auth, Connect, User Info, Stats et Leaderboards ;

- elle précise les limites des stats et leaderboards ;

- elle recommande l'API mockée pour le MVP ;

- elle prévoit un provider EPIC/EOS dans game_accounts ;

- elle indique que les secrets restent côté back-end ;

- elle prévoit une gestion propre des erreurs ;

- elle renvoie aux sources officielles Epic.

## 22 Conclusion

Epic Games / Epic Online Services est une intégration intéressante mais plus complexe que Steam pour Track'N Share.

Les services officiels Epic permettent de gérer l'authentification, les identités, les informations utilisateur, les statistiques et les leaderboards dans des contextes compatibles. Cependant, ils ne doivent pas être présentés comme une source universelle de statistiques joueurs pour tous les jeux Epic.

Pour le MVP, Track'N Share doit s'appuyer sur une API mockée et des données seedées. Epic doit être documenté comme une intégration future, à activer seulement si un jeu ou produit compatible permet un mapping fiable vers les statistiques internes de Track'N Share.
