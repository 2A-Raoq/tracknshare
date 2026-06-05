# STEAM API — DOCUMENTATION D'INTÉGRATION

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document synthétise les informations officielles utiles à l'intégration de Steam dans Track'N Share.

Les informations ci-dessous proviennent uniquement des sources officielles Valve / Steamworks / Valve Developer Community. L'objectif n'est pas de recopier toute la documentation Steam, mais d'identifier ce qui est exploitable pour Track'N Share : identité Steam, profil, jeux possédés, temps de jeu, statistiques, succès, leaderboards, authentification, contraintes de sécurité et limites.

Conclusion rapide pour Track'N Share

Steam est l'intégration externe la plus pertinente pour une première version après le MVP, car Steam propose une Web API HTTP documentée, des identifiants SteamID, des méthodes pour récupérer des informations de profil, des jeux possédés, certains temps de jeu, des statistiques de jeu et des succès selon les permissions et la visibilité du profil.

Cependant, l'intégration Steam ne doit pas être bloquante pour le MVP. Track'N Share doit conserver une API mockée et des données seedées, car les APIs Steam dépendent de clés, de permissions, de profils publics, de la configuration Steamworks et parfois du fait d'être éditeur du jeu concerné.

## 1 Sources officielles utilisées

Sources consultées :

- Steamworks Web API Overview

https://partner.steamgames.com/doc/webapi_overview

- Steamworks Web API — ISteamUser

https://partner.steamgames.com/doc/webapi/ISteamUser

- Steamworks Web API — IPlayerService

https://partner.steamgames.com/doc/webapi/IPlayerService

- Steamworks Web API — ISteamUserStats

https://partner.steamgames.com/doc/webapi/ISteamUserStats

- Steamworks — Authentification des comptes et vérification de la possession d'une application

https://partner.steamgames.com/doc/features/auth

- Steamworks API — ISteamUserStats

https://partner.steamgames.com/doc/api/ISteamUserStats

- Valve Developer Community — Steam Web API

https://developer.valvesoftware.com/wiki/Steam_Web_API

Remarque : ce document doit être mis à jour si Valve modifie les endpoints, les paramètres ou les conditions d'accès.

## 2 Vue d'ensemble de Steam Web API

### 2.1 Principe général

La documentation Steamworks indique que Steam expose une API Web basée sur HTTP. Elle permet d'accéder à plusieurs fonctionnalités Steamworks depuis une application capable d'effectuer des requêtes HTTP.

L'API contient :

- des méthodes publiques ;

- des méthodes protégées nécessitant une authentification ;

- des méthodes destinées aux serveurs back-end de confiance.

Pour Track'N Share, cela signifie que les appels sensibles doivent passer par le back-end NestJS, jamais directement depuis le front-end React/PWA.

### 2.2 Hôtes principaux

Hôte public :

https://api.steampowered.com

Hôte partenaire / éditeur :

https://partner.steam-api.com

Steam recommande l'utilisation du host partenaire pour les requêtes effectuées depuis des serveurs sécurisés d'éditeurs, lorsque ce contexte est applicable.

### 2.3 Format général d'URL

Format documenté :

https://api.steampowered.com/<interface>/<method>/v<version>/

Exemple :

https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/

### 2.4 Formats de réponse

La Valve Developer Community indique que les méthodes Steam Web API peuvent retourner différents formats, dont JSON, XML et VDF.

Pour Track'N Share, le format recommandé est JSON.

## 3 Authentification Steam et clés API

### 3.1 Clé Web API

De nombreuses méthodes Steam Web API nécessitent une clé API.

Cette clé ne doit jamais être exposée côté front-end.

Règles Track'N Share :

- stocker la clé dans une variable d'environnement ;

- ne jamais la commiter dans GitHub ;

- ne jamais l'envoyer au navigateur ;

- effectuer les appels Steam depuis le back-end NestJS ;

- prévoir un .env.example sans vraie clé.

Exemple de variable :

STEAM_WEB_API_KEY=replace_me

### 3.2 SteamID

Steam identifie chaque utilisateur via un SteamID numérique 64 bits.

Pour Track'N Share, le SteamID peut être stocké dans game_accounts.externalId.

Mapping recommandé :

- platform = STEAM ;

- externalId = SteamID 64 bits ;

- externalUsername = personaname ;

- avatarUrl = avatarfull ou avatarmedium ;

- profileUrl = profileurl.

### 3.3 Authentification utilisateur Steam

La documentation Steamworks décrit plusieurs scénarios d'authentification et de vérification de possession :

- tickets de session ;

- serveur principal sécurisé ;

- OpenID pour navigateur web ;

- vérification d'identité et de possession d'application.

Pour Track'N Share, deux approches sont possibles :

Approche simple MVP / démonstration :

- l'utilisateur renseigne ou simule son SteamID ;

- Track'N Share récupère des informations publiques si disponibles ;

- les statistiques critiques restent mockées.

Approche avancée :

- mettre en place un vrai flux d'authentification Steam ;

- vérifier l'identité Steam côté back-end ;

- lier le SteamID vérifié au compte Track'N Share.

## 4 Interfaces Steam utiles

### 4.1 ISteamUser

Interface principale liée aux utilisateurs Steam.

Méthodes utiles pour Track'N Share :

- GetPlayerSummaries ;

- ResolveVanityURL ;

- GetFriendList, éventuellement bonus ;

- GetPlayerBans, non prioritaire.

### 4.2 IPlayerService

Interface qui fournit des méthodes supplémentaires liées aux joueurs.

Méthodes utiles :

- GetOwnedGames ;

- GetRecentlyPlayedGames ;

- GetSingleGamePlaytime.

La documentation indique que IPlayerService est une interface de service et que ses méthodes doivent être appelées avec input_json.

### 4.3 ISteamUserStats

Interface liée aux statistiques, succès et leaderboards.

Méthodes utiles :

- GetUserStatsForGame ;

- GetGlobalStatsForGame ;

- GetGlobalAchievementPercentagesForApp ;

- fonctions Steamworks API côté SDK pour stats, achievements et leaderboards.

Pour Track'N Share, cette interface est intéressante, mais elle dépend fortement de l'AppID, des statistiques configurées pour le jeu, des permissions et de la visibilité.

## 5 Endpoints Steam pertinents

### 5.1 GetPlayerSummaries

Interface : ISteamUser

Méthode : GetPlayerSummaries

Version : v2

Endpoint :

GET https://partner.steam-api.com/ISteamUser/GetPlayerSummaries/v2/

Paramètres :

- key : clé Web API ;

- steamids : liste de SteamIDs séparés par des virgules, maximum 100 selon la documentation.

Données retournées utiles :

- steamid ;

- personaname ;

- profileurl ;

- avatar ;

- avatarmedium ;

- avatarfull ;

- communityvisibilitystate ;

- lastlogoff.

Usage Track'N Share :

- récupérer le pseudo Steam ;

- récupérer l'avatar ;

- vérifier que le SteamID existe ;

- enrichir le profil lié à un compte de jeu.

Limites :

- ne fournit pas les statistiques Track'N Share ;

- dépend de l'accès aux informations utilisateur ;

- ne doit pas remplacer le profil Track'N Share.

Mapping Track'N Share :

- steamid → game_accounts.externalId ;

- personaname → game_accounts.externalUsername ;

- avatarfull → profiles.avatarUrl optionnel ou game_accounts.metadata.avatarUrl ;

- profileurl → game_accounts.metadata.profileUrl.

### 5.2 ResolveVanityURL

Interface : ISteamUser

Méthode : ResolveVanityURL

Version : v1

Endpoint :

GET https://partner.steam-api.com/ISteamUser/ResolveVanityURL/v1/

Paramètres :

- key ;

- vanityurl ;

- url_type optionnel.

Usage Track'N Share :

- permettre à un utilisateur de saisir une URL personnalisée Steam ;

- convertir cette URL en SteamID ;

- faciliter la liaison du compte Steam.

Exemple fonctionnel :

Un utilisateur saisit son identifiant communautaire Steam. Track'N Share appelle ResolveVanityURL, récupère le SteamID, puis l'utilise avec GetPlayerSummaries.

### 5.3 GetOwnedGames

Interface : IPlayerService

Méthode : GetOwnedGames

Version : v1

Endpoint :

GET https://partner.steam-api.com/IPlayerService/GetOwnedGames/v1/

Paramètres documentés :

- key ;

- steamid ;

- include_appinfo ;

- include_played_free_games ;

- appids_filter.

Usage Track'N Share :

- vérifier les jeux possédés par un utilisateur ;

- récupérer certains temps de jeu ;

- proposer automatiquement des jeux suivis par Track'N Share ;

- filtrer les jeux pertinents avec appids_filter.

Limites importantes :

- les résultats dépendent de la visibilité des détails de jeux du profil ;

- les profils privés ou restreints peuvent ne pas retourner les données attendues ;

- cette méthode ne donne pas forcément des statistiques de performance détaillées comme kills, deaths ou winrate.

Mapping possible :

- appid → games.externalAppId ;

- name → games.name ;

- playtime_forever → game_accounts.metadata.playtimeForever ;

- img_icon_url → games.metadata.icon.

### 5.4 GetRecentlyPlayedGames

Interface : IPlayerService

Méthode : GetRecentlyPlayedGames

Version : v1

Endpoint :

GET https://partner.steam-api.com/IPlayerService/GetRecentlyPlayedGames/v1/

Paramètres :

- key ;

- steamid ;

- count.

Usage Track'N Share :

- afficher les jeux récemment joués ;

- détecter les jeux pertinents pour une synchronisation ;

- enrichir le dashboard en bonus.

Priorité : P1 ou P2.

### 5.5 GetSingleGamePlaytime

Interface : IPlayerService

Méthode : GetSingleGamePlaytime

Version : v1

Endpoint :

GET https://partner.steam-api.com/IPlayerService/GetSingleGamePlaytime/v1/

Paramètres :

- key ;

- steamid ;

- appid.

Usage Track'N Share :

- récupérer le temps de jeu pour un AppID précis ;

- afficher un indicateur de pratique ;

- compléter les statistiques internes.

Limite :

Le temps de jeu n'est pas équivalent à une performance compétitive.

### 5.6 GetUserStatsForGame

Interface : ISteamUserStats

Méthode : GetUserStatsForGame

Version : v2

Endpoint :

GET https://partner.steam-api.com/ISteamUserStats/GetUserStatsForGame/v2/

Paramètres :

- key ;

- steamid ;

- appid.

Description officielle :

Permet d'obtenir la liste de statistiques définies par la personne spécifiée dans une application.

Usage Track'N Share :

- tenter de récupérer des statistiques de jeu ;

- mapper certaines statistiques Steam vers le modèle Track'N Share si elles existent ;

- alimenter le dashboard à partir d'une source réelle.

Limites :

- toutes les applications Steam ne fournissent pas les stats nécessaires ;

- les noms de stats dépendent du jeu ;

- les statistiques doivent être configurées et publiées côté Steamworks ;

- Track'N Share ne peut pas garantir une disponibilité uniforme des champs kills, deaths, wins ou losses.

Priorité : P1/P2.

Pour le MVP, utiliser l'API mockée.

### 5.7 GetGlobalStatsForGame

Interface : ISteamUserStats

Usage :

- récupérer des statistiques globales d'un jeu ;

- éventuellement enrichir des pages publiques.

Pertinence Track'N Share : faible pour le MVP.

Cette méthode ne remplace pas les statistiques individuelles nécessaires au scoring.

### 5.8 GetGlobalAchievementPercentagesForApp

Interface : ISteamUserStats

Usage :

- récupérer les pourcentages globaux de succès d'une application.

Pertinence Track'N Share : bonus.

Peut servir à afficher des informations communautaires sur un jeu, mais pas à calculer les stats individuelles MVP.

## 6 Données exploitables pour Track'N Share

### 6.1 Données utilisateur

Données Steam possibles :

- SteamID ;

- pseudo Steam ;

- URL de profil ;

- avatar ;

- statut de visibilité communautaire ;

- dernière déconnexion selon méthode.

Données Track'N Share correspondantes :

- game_accounts.externalId ;

- game_accounts.externalUsername ;

- game_accounts.metadata.profileUrl ;

- game_accounts.metadata.avatarUrl ;

- profiles.avatarUrl optionnel.

### 6.2 Données jeux

Données possibles :

- AppID ;

- nom du jeu ;

- icône ;

- temps de jeu ;

- jeux possédés ;

- jeux récemment joués.

Données Track'N Share :

- games.externalAppId ;

- games.name ;

- games.platform = STEAM ;

- game_accounts.metadata.playtime.

### 6.3 Données statistiques

Données potentiellement récupérables :

- statistiques définies par un jeu ;

- succès ;

- données de leaderboards selon SDK/API et configuration.

Difficulté :

Les noms, formats et disponibilités varient selon le jeu.

Track'N Share doit donc prévoir un mapping par jeu.

## 7 Mapping vers le modèle Track'N Share

### 7.1 Table game_accounts

Steam → Track'N Share :

- steamid → externalId ;

- personaname → externalUsername ;

- platform → STEAM ;

- profileurl → metadata.profileUrl ;

- avatarfull → metadata.avatarUrl ;

- lastSyncAt → date de dernière synchronisation.

### 7.2 Table player_stats

Steam stats → Track'N Share :

- kills → kills si stat disponible ;

- deaths → deaths si stat disponible ;

- wins → wins si stat disponible ;

- losses → losses si stat disponible ;

- matchesPlayed → gamesPlayed ou calcul wins + losses selon disponibilité ;

- score → calcul interne Track'N Share ;

- kdRatio → calcul interne ;

- winrate → calcul interne.

### 7.3 Table games

Steam → Track'N Share :

- appid → externalAppId ;

- name → name ;

- platform → STEAM ;

- isActive → géré par Track'N Share ;

- apiProvider → STEAM.

## 8 Exemple de flux d'intégration Steam

### 8.1 Liaison de compte Steam simple

1. L'utilisateur connecté ouvre la page Comptes liés.

2. Il saisit son SteamID ou son URL personnalisée.

3. Si URL personnalisée, Track'N Share appelle ResolveVanityURL.

4. Track'N Share récupère le SteamID.

5. Track'N Share appelle GetPlayerSummaries.

6. Le back-end affiche un résumé du profil Steam.

7. L'utilisateur confirme la liaison.

8. Track'N Share crée un game_account avec platform = STEAM.

### 8.2 Synchronisation de données Steam

1. L'utilisateur clique sur Synchroniser.

2. Le back-end récupère le compte Steam lié.

3. Le back-end vérifie la saison active.

4. Le back-end appelle les endpoints Steam pertinents.

5. Le back-end transforme les données via un mapper.

6. Le back-end calcule K/D, winrate et score.

7. Le back-end sauvegarde les stats.

8. Le leaderboard est mis à jour.

## 9 Gestion des erreurs

Erreurs possibles :

- clé API absente ;

- clé API invalide ;

- SteamID invalide ;

- profil privé ;

- jeu non possédé ou invisible ;

- stats non disponibles pour l'AppID ;

- API Steam indisponible ;

- réponse incomplète ;

- rate limit ou blocage temporaire.

Réponses Track'N Share recommandées :

- afficher un message clair ;

- conserver les anciennes données ;

- ne pas vider le dashboard ;

- proposer de réessayer ;

- basculer sur données mockées pour la démonstration.

## 10 Sécurité

### 10.1 Appels côté serveur uniquement

Toutes les requêtes nécessitant une clé Steam doivent être exécutées côté NestJS.

Interdit :

- appeler Steam avec la clé depuis React ;

- stocker la clé dans le front-end ;

- mettre la clé dans le dépôt GitHub.

### 10.2 Variables d'environnement

Variables possibles :

- STEAM_WEB_API_KEY ;

- STEAM_API_BASE_URL ;

- STEAM_PARTNER_API_BASE_URL.

### 10.3 Protection des données utilisateur

Ne pas stocker :

- données inutiles ;

- tokens sensibles ;

- informations privées non nécessaires.

Stocker uniquement :

- SteamID ;

- pseudo Steam ;

- avatar / profile URL si utile ;

- date de dernière synchronisation ;

- stats réellement nécessaires au projet.

## 11 Limites officielles importantes

### 11.1 Visibilité des profils

Certaines données comme les jeux possédés ou détails de jeux peuvent dépendre de la visibilité du profil Steam.

Conséquence :

Track'N Share doit gérer les profils privés ou incomplets.

### 11.2 Statistiques non uniformes

GetUserStatsForGame dépend de l'AppID et des statistiques réellement exposées par le jeu.

Conséquence :

Track'N Share ne peut pas garantir un mapping automatique universel kills/deaths/wins/losses pour tous les jeux Steam.

### 11.3 API éditeur vs API publique

Certaines méthodes nécessitent des clés ou accès éditeur.

Conséquence :

Il ne faut pas baser le MVP sur des méthodes qui nécessitent des droits que l'équipe ne possède pas.

### 11.4 Rate limiting et disponibilité

Steam peut limiter certains accès et les erreurs 403 peuvent entraîner des restrictions strictes côté host partenaire.

Conséquence :

Track'N Share doit prévoir cache, retry contrôlé et fallback.

## 12 Recommandation pour le MVP

Pour le MVP, Steam ne doit pas être une dépendance obligatoire.

Approche recommandée :

- documenter l'intégration ;

- préparer le modèle game_accounts ;

- prévoir provider = STEAM ;

- intégrer éventuellement GetPlayerSummaries si simple ;

- garder l'API mockée pour les statistiques compétitives ;

- utiliser les données seedées pour la soutenance.

## 13 Recommandation après MVP

Priorité 1 :

- liaison SteamID ;

- ResolveVanityURL ;

- GetPlayerSummaries ;

- stockage du compte lié.

Priorité 2 :

- GetOwnedGames ;

- GetRecentlyPlayedGames ;

- affichage des jeux Steam liés.

Priorité 3 :

- GetUserStatsForGame par jeu compatible ;

- mapping spécifique par AppID ;

- synchronisation réelle des stats.

Priorité 4 :

- authentification Steam complète ;

- vérification de possession ;

- intégration plus poussée avec Steamworks.

## 14 Endpoints internes Track'N Share liés à Steam

POST /game-accounts/steam/resolve-vanity

Convertit une URL personnalisée Steam en SteamID.

POST /game-accounts/steam/link

Lie un compte Steam au compte Track'N Share.

GET /game-accounts/steam/profile

Retourne le résumé du profil Steam lié.

POST /stats/sync

Peut accepter provider = STEAM si l'intégration réelle est activée.

## 15 Exemple de mapping JSON interne

Exemple game_account :

{

"platform": "STEAM",

"externalId": "76561198000000000",

"externalUsername": "SteamPlayer",

"metadata": {

"profileUrl": "https://steamcommunity.com/profiles/76561198000000000/",

"avatarUrl": "https://.../avatarfull.jpg",

"visibilityState": 3

},

"lastSyncAt": "2026-05-06T10:00:00.000Z"

}

Exemple stats mappées :

{

"provider": "STEAM",

"gameId": "game_steam_1",

"externalAppId": 440,

"kills": 120,

"deaths": 80,

"wins": 15,

"losses": 10,

"matchesPlayed": 25,

"mappingStatus": "PARTIAL"

}

## 16 Critères d'acceptation

L'intégration Steam est considérée correctement préparée si :

- la clé Steam est stockée côté serveur ;

- aucune clé n'est exposée côté front ;

- un SteamID peut être stocké dans game_accounts ;

- ResolveVanityURL est prévu pour les vanity URLs ;

- GetPlayerSummaries est identifié pour récupérer pseudo/avatar ;

- GetOwnedGames est identifié pour récupérer les jeux visibles ;

- GetUserStatsForGame est identifié mais marqué comme dépendant du jeu ;

- les profils privés sont gérés proprement ;

- un fallback mock existe ;

- les anciennes stats ne sont pas supprimées en cas d'échec Steam.

## 17 Conclusion

Steam est une source externe pertinente pour Track'N Share, surtout pour lier un profil joueur, récupérer des informations publiques et éventuellement certaines statistiques par jeu.

La principale limite est que Steam ne fournit pas un format universel de statistiques compétitives pour tous les jeux. Les données disponibles dépendent de l'AppID, de la configuration Steamworks, des permissions et de la visibilité utilisateur.

Pour cette raison, Track'N Share doit utiliser Steam comme intégration progressive après MVP et conserver une API mockée fiable pour les statistiques, les leaderboards et la soutenance.
