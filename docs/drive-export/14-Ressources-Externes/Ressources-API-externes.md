# RESSOURCES API EXTERNES

Projet Track'N Share

Version : 1.0

Date de vérification : 10/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document centralise les ressources liées aux APIs externes prévues ou étudiées pour Track'N Share.

Il complète les documents Documentation-Steam-API, Documentation-Epic-Games-API, Plan-secours-APIs, Gestion-rate-limiting, Mapping-donnees-externes et Liens-documentations-officielles.

L'objectif est de rassembler dans un seul document les informations utiles pour comprendre quelles APIs externes peuvent être utilisées, quelles données elles peuvent fournir, quelles limites existent, quelles précautions de sécurité appliquer et quelle stratégie retenir pour le MVP.

## 1 Vue d'ensemble

### 1.1 Rôle des APIs externes dans Track'N Share

Track'N Share est une application de suivi et de partage de statistiques gaming.

Les APIs externes peuvent permettre de :

- récupérer des données liées à un joueur ;

- récupérer des statistiques de jeu ;

- vérifier l'identité ou le compte externe d'un utilisateur ;

- consulter des classements ou données de progression ;

- enrichir le profil joueur ;

- alimenter les leaderboards ;

- comparer des performances.

### 1.2 APIs étudiées

Les APIs principalement étudiées sont :

- Steam / Steamworks Web API ;

- Epic Games / Epic Online Services ;

- MockProvider interne Track'N Share.

### 1.3 Positionnement MVP

Pour le MVP, il est recommandé de ne pas dépendre directement des APIs Steam ou Epic pour la soutenance.

Le MVP doit fonctionner avec :

- MockProvider ;

- données seedées ;

- statistiques fictives cohérentes ;

- leaderboards internes ;

- mode démo stable.

Steam et Epic restent documentés comme intégrations futures ou partielles, mais ne doivent pas bloquer la démonstration.

## 2 Principes d'intégration

### 2.1 Back-end uniquement

Toutes les communications avec les APIs externes doivent passer par le back-end.

Le front-end React ne doit jamais appeler directement une API externe nécessitant une clé ou un secret.

Raisons :

- protéger les clés API ;

- contrôler les erreurs ;

- appliquer du rate limiting ;

- normaliser les réponses ;

- éviter d'exposer des tokens ;

- conserver un fallback mock/cache.

### 2.2 Provider pattern

L'intégration doit utiliser une couche provider.

Providers recommandés :

- SteamProvider ;

- EpicProvider ;

- MockStatsProvider.

Interface commune possible :

ExternalStatsProvider

- getPlayerStats(userExternalId, gameExternalId)

- getPlayerIdentity(externalTokenOrId)

- getGameMetadata(gameExternalId)

- isAvailable()

### 2.3 Normalisation des données

Les APIs externes ne doivent pas être utilisées directement dans le front.

Le back-end doit convertir les réponses externes vers un format interne unique.

Format interne possible :

ExternalStatsResult {

provider: "STEAM" | "EPIC" | "MOCK";

externalUserId: string;

externalGameId: string;

stats: {

kills: number;

deaths: number;

wins: number;

losses: number;

matchesPlayed: number;

playtimeMinutes?: number;

};

metadata: {

mappingStatus: "COMPLETE" | "PARTIAL" | "FAILED" | "UNAVAILABLE";

lastFetchedAt: string;

};

}

### 2.4 Fallback obligatoire

En cas d'échec d'une API externe :

- ne pas bloquer le dashboard ;

- ne pas supprimer les anciennes statistiques ;

- utiliser le cache si disponible ;

- utiliser MockProvider en mode démo ;

- afficher un message clair ;

- logger l'erreur sans secret.

## 3 Steam — ressources officielles

### 3.1 Steam Web API Overview

Nom : Steamworks Web API Overview

Lien : https://partner.steamgames.com/doc/webapi_overview

Usage Track'N Share : comprendre le fonctionnement général de l'API Web Steamworks.

Points utiles :

- API HTTP ;

- méthodes publiques et méthodes protégées ;

- usage côté client ou serveur selon méthode ;

- authentification via clé API pour certaines méthodes ;

- endpoint public api.steampowered.com ;

- endpoint partenaire partner.steam-api.com pour serveurs sécurisés.

Utilité MVP : documentation et étude.

Utilité future : intégration SteamProvider.

### 3.2 Steam Web API Reference

Nom : Steamworks Web API Reference

Lien : https://partner.steamgames.com/doc/webapi

Usage Track'N Share : consulter les interfaces officiellement disponibles.

Interfaces intéressantes :

- ISteamUser ;

- ISteamUserStats ;

- ISteamUserAuth ;

- ISteamLeaderboards ;

- ISteamApps ;

- IPlayerService.

Utilité MVP : documentation.

Utilité future : analyse des endpoints réellement exploitables.

### 3.3 ISteamUserStats

Nom : ISteamUserStats Interface

Lien : https://partner.steamgames.com/doc/api/isteamuserstats

Usage Track'N Share : comprendre les statistiques, achievements et données liées aux joueurs Steam.

Points importants :

- certaines données dépendent de la configuration du jeu dans Steamworks ;

- les stats doivent exister dans l'administration Steamworks ;

- les statistiques ne sont pas forcément accessibles universellement pour tous les jeux ;

- l'accès peut dépendre de l'AppID, du jeu et des permissions.

Limite importante :

Track'N Share ne doit pas supposer qu'il peut récupérer automatiquement toutes les statistiques de tous les jeux Steam.

### 3.4 ISteamLeaderboards

Nom : ISteamLeaderboards Interface

Lien : https://partner.steamgames.com/doc/webapi/isteamleaderboards

Usage Track'N Share : comprendre la gestion de leaderboards Steam.

Points importants :

- accès aux classements Steam ;

- méthodes comme GetLeaderboardsForGame, GetLeaderboardEntries, SetLeaderboardScore ;

- plusieurs appels nécessitent une clé publisher ;

- ces appels doivent être faits depuis un serveur sécurisé ;

- ils ne doivent jamais être appelés directement depuis le client.

Utilité future : éventuellement importer ou comparer des scores Steam si le jeu et les permissions le permettent.

### 3.5 Steam User Authentication and Ownership

Nom : Steam Authentication / User Authentication and Ownership

Lien : https://partner.steamgames.com/doc/features/auth

Usage Track'N Share : vérifier une identité Steam ou la possession d'un jeu.

Utilité future : liaison de compte Steam, vérification ownership, authentification externe.

### 3.6 Steamworks API Overview

Nom : Steamworks API Overview

Lien : https://partner.steamgames.com/doc/sdk/api

Usage Track'N Share : comprendre la différence entre Steamworks SDK/API client et Steamworks Web API.

Remarque :

Track'N Share étant une application web, l'intégration pertinente est surtout la Web API côté back-end, pas le SDK client de jeu.

## 4 Steam — données potentiellement exploitables

### 4.1 Identité joueur

Données possibles :

- SteamID 64 bits ;

- profil public selon permissions ;

- avatar public ;

- pseudo public.

Usage Track'N Share :

- lier un compte Steam ;

- enrichir le profil public ;

- identifier un compte externe.

### 4.2 Jeux et AppID

Données possibles :

- AppID d'un jeu ;

- informations publiques d'application selon endpoints ;

- ownership si authentification et permissions adaptées.

Usage Track'N Share :

- mapper les jeux internes Track'N Share vers des AppID Steam ;

- vérifier qu'un utilisateur possède un jeu si fonctionnalité future.

### 4.3 Statistiques

Données possibles :

- stats configurées par jeu ;

- achievements ;

- statistiques globales ou utilisateur selon API et jeu.

Limites :

- pas de garantie d'accès universel ;

- dépend du jeu ;

- dépend de la configuration Steamworks ;

- certains profils peuvent être privés ;

- certaines méthodes exigent une clé publisher.

### 4.4 Leaderboards

Données possibles :

- leaderboards configurés pour un jeu ;

- entrées de leaderboard ;

- scores ;

- rangs.

Limites :

- dépend du jeu ;

- dépend du leaderboard configuré ;

- certaines méthodes exigent une clé publisher ;

- pas forcément adapté à tous les jeux suivis par Track'N Share.

## 5 Steam — limites et précautions

### 5.1 Limites fonctionnelles

Steam ne doit pas être considéré comme une source universelle de statistiques pour tous les jeux.

Risques :

- jeu sans stats exposées ;

- profil privé ;

- AppID non mappé ;

- stats non standardisées ;

- clés nécessaires ;

- conditions d'accès dépendantes du statut développeur/publisher.

### 5.2 Limites sécurité

Règles obligatoires :

- clé Steam uniquement côté back-end ;

- jamais de clé Steam dans React ;

- jamais de clé dans Swagger ;

- jamais de clé dans les logs ;

- timeout sur appels externes ;

- fallback en cas d'erreur.

### 5.3 Limites MVP

Pour le MVP :

- SteamProvider peut être simulé ;

- MockProvider reste prioritaire ;

- Steam ne doit pas être obligatoire pour la démo ;

- les limites doivent être expliquées dans la documentation.

## 6 Epic Games / Epic Online Services — ressources officielles

### 6.1 Epic Online Services SDK

Nom : Epic Online Services SDK

Lien : https://onlineservices.epicgames.com/en-US/sdk

Usage Track'N Share : comprendre l'accès EOS, le téléchargement SDK, la configuration via Developer Portal et la documentation associée.

Points utiles :

- SDK disponible pour plusieurs plateformes ;

- configuration via Developer Portal ;

- services à explorer via documentation Epic ;

- nécessite un compte développeur Epic pour certaines actions.

### 6.2 Epic Developer Documentation

Nom : Epic Developer Documentation

Lien : https://dev.epicgames.com/docs/

Usage Track'N Share : point d'entrée vers la documentation officielle Epic.

Utilité :

- Epic Online Services ;

- Epic Games Store ;

- SDK ;

- Auth ;

- Stats ;

- Achievements ;

- Leaderboards ;

- Player Data Storage.

### 6.3 Epic Developer Portal

Nom : Epic Developer Portal

Lien : https://dev.epicgames.com/portal

Usage Track'N Share : configuration des produits, credentials, services EOS, paramètres développeur.

Utilité future : intégration EpicProvider réelle.

### 6.4 Epic Player & Game Data

Nom : Epic Online Services — Player & Game Data

Lien : https://onlineservices.epicgames.com/player-game-data

Usage Track'N Share : identifier les services Epic liés aux données joueur.

Services intéressants :

- Stats ;

- Leaderboards ;

- Achievements ;

- Player Data Storage ;

- Title Storage.

### 6.5 Epic Online Services Support

Nom : Epic Developer Support

Lien : https://dev.epicgames.com/support

Usage Track'N Share : support développeur si intégration EOS réelle.

## 7 Epic — données potentiellement exploitables

### 7.1 Stats

Usage possible :

- suivre des statistiques de jeu définies par un développeur ;

- alimenter achievements ou leaderboards ;

- synchroniser progression selon services EOS.

Limite :

Les stats EOS sont surtout pertinentes pour un jeu configuré dans Epic Online Services. Track'N Share ne peut pas supposer récupérer les statistiques de n'importe quel jeu Epic tiers.

### 7.2 Leaderboards

Usage possible :

- leaderboards cross-platform ;

- classement de joueurs ;

- comparaison de scores.

Limite :

Nécessite une configuration côté produit/jeu et l'intégration EOS adaptée.

### 7.3 Achievements

Usage possible :

- afficher une progression ;

- enrichir le profil joueur ;

- montrer des objectifs atteints.

Limite :

Dépend du jeu, de l'intégration EOS et des autorisations.

### 7.4 Player Data Storage

Usage possible :

- stockage de données joueur ;

- sauvegarde cloud ;

- progression.

Limite :

Pas une source universelle de stats publiques pour tous les jeux.

## 8 Epic — limites et précautions

### 8.1 Limites fonctionnelles

Epic/EOS ne doit pas être considéré comme une API magique permettant de récupérer toutes les statistiques de tous les jeux Epic Games Store.

Risques :

- données disponibles seulement pour les jeux intégrés à EOS ;

- configuration Developer Portal nécessaire ;

- credentials nécessaires ;

- intégration plus orientée jeu/développeur que tracker universel ;

- disponibilité des stats dépendante du jeu.

### 8.2 Limites MVP

Pour le MVP :

- EpicProvider peut rester documenté ;

- aucune dépendance obligatoire à Epic ;

- MockProvider couvre la démonstration ;

- Epic est une intégration future ou optionnelle.

### 8.3 Règles sécurité

- EPIC_CLIENT_SECRET côté back-end uniquement ;

- jamais dans VITE_* ;

- jamais dans Swagger ;

- jamais dans logs ;

- scopes et permissions minimales ;

- timeout et fallback ;

- documentation des limites.

## 9 MockProvider interne

### 9.1 Rôle du MockProvider

Le MockProvider est un provider interne qui simule les données externes.

Il permet de :

- développer sans dépendre de Steam/Epic ;

- tester les mappings ;

- alimenter le dashboard ;

- remplir les leaderboards ;

- assurer la soutenance ;

- déclencher des cas d'erreur contrôlés.

### 9.2 Données fournies

Données possibles :

- externalUserId fictif ;

- externalGameId fictif ;

- kills ;

- deaths ;

- wins ;

- losses ;

- matchesPlayed ;

- playtimeMinutes ;

- achievementsUnlocked ;

- lastFetchedAt ;

- provider = MOCK.

### 9.3 Cas d'erreur à simuler

Le MockProvider peut aussi simuler :

- provider unavailable ;

- timeout ;

- mapping partial ;

- player not found ;

- private profile ;

- rate limit.

### 9.4 Avantages MVP

- données stables ;

- aucune clé requise ;

- aucun risque de panne externe ;

- démo reproductible ;

- tests facilités ;

- cohérence avec les seeders.

## 10 Comparatif des providers

| Critère | Steam | Epic/EOS | MockProvider |

|---|---|---|---|

| Source officielle disponible | Oui | Oui | Interne |

| Données universelles tous jeux | Non garanti | Non garanti | Oui, simulées |

| Nécessite clé/credentials | Souvent oui | Oui pour intégration réelle | Non |

| Utilisable en soutenance | Risqué seul | Risqué seul | Oui |

| Stats joueur | Selon jeu/API | Selon configuration EOS | Oui |

| Leaderboards | Selon jeu/API | Selon configuration EOS | Oui |

| Risque de rate limit | Oui | Oui | Non significatif |

| Secret côté front autorisé | Non | Non | Non nécessaire |

| Priorité MVP | Documentation/futur | Documentation/futur | P0 |

## 11 Stratégie recommandée Track'N Share

### 11.1 MVP

Pour le MVP :

- utiliser MockProvider ;

- stocker des stats internes en base ;

- calculer les scores côté back-end ;

- alimenter les leaderboards depuis PostgreSQL/Redis ;

- documenter Steam/Epic ;

- désactiver les providers réels en soutenance.

Configuration recommandée :

EXTERNAL_API_MODE=mock

MOCK_PROVIDER_ENABLED=true

STEAM_PROVIDER_ENABLED=false

EPIC_PROVIDER_ENABLED=false

### 11.2 Après MVP

Évolutions possibles :

- implémenter SteamProvider partiel ;

- ajouter liaison compte Steam ;

- tester endpoints Steam sur jeux compatibles ;

- implémenter EpicProvider uniquement si un cas d'usage clair existe ;

- ajouter cache et rate limiting ;

- ajouter monitoring des providers ;

- enrichir Mapping-donnees-externes.

### 11.3 Production future

Pour une production future :

- activer providers uniquement si testés ;

- utiliser des secrets forts ;

- protéger les clés ;

- mettre en cache les réponses ;

- gérer les quotas ;

- prévoir fallback ;

- documenter les données réellement récupérables ;

- respecter les conditions d'utilisation des plateformes.

## 12 Mapping des données externes

### 12.1 Champs externes possibles

Champs à mapper :

- provider ;

- externalUserId ;

- externalUsername ;

- externalAvatarUrl ;

- externalGameId ;

- externalGameName ;

- kills ;

- deaths ;

- wins ;

- losses ;

- matchesPlayed ;

- playtimeMinutes ;

- leaderboardRank ;

- achievementsCount ;

- lastSyncAt.

### 12.2 Champs internes Track'N Share

Champs internes :

- userId ;

- gameId ;

- seasonId ;

- provider ;

- providerAccountId ;

- statsRaw ;

- statsNormalized ;

- score ;

- kdRatio ;

- winrate ;

- isEligible ;

- lastSyncAt.

### 12.3 États de mapping

États possibles :

- COMPLETE : toutes les données utiles sont mappées ;

- PARTIAL : certaines données manquent ;

- FAILED : mapping impossible ;

- UNAVAILABLE : provider indisponible ;

- MOCKED : données simulées.

## 13 Rate limiting et cache

### 13.1 Objectif

Les APIs externes doivent être protégées contre les appels trop fréquents.

Règles :

- limiter les synchronisations par utilisateur ;

- limiter les appels par provider ;

- mettre en cache les réponses ;

- éviter de synchroniser à chaque affichage dashboard ;

- utiliser une date lastSyncAt.

### 13.2 Cache recommandé

Cache possible :

- Redis pour données temporaires ;

- PostgreSQL pour dernier état fiable ;

- TTL adapté selon provider.

### 13.3 Exemples de stratégie

- sync manuelle utilisateur : toutes les 15 minutes ;

- cache provider : 5 à 30 minutes selon données ;

- leaderboard recalculé périodiquement ;

- fallback sur dernières stats connues si provider indisponible.

## 14 Sécurité des APIs externes

### 14.1 Secrets

Secrets concernés :

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_ID ;

- EPIC_CLIENT_SECRET ;

- tokens OAuth éventuels ;

- clés publisher ;

- credentials Developer Portal.

Règles :

- secrets dans .env côté back uniquement ;

- jamais dans le front ;

- jamais dans Git ;

- jamais dans Swagger ;

- jamais dans les logs ;

- rotation en cas de fuite.

### 14.2 Logs

À logger :

- provider utilisé ;

- succès/échec ;

- durée ;

- fallback ;

- code erreur non sensible ;

- requestId.

À ne jamais logger :

- clé API ;

- secret ;

- token ;

- réponse brute complète si trop sensible ;

- header Authorization.

### 14.3 Front-end

Le front-end reçoit uniquement :

- données normalisées ;

- erreurs propres ;

- statut de synchronisation ;

- lastSyncAt ;

- source affichable si utile.

Le front-end ne reçoit jamais :

- clés API ;

- tokens externes ;

- secrets ;

- URLs internes avec credentials.

## 15 Gestion des erreurs providers

### 15.1 Codes d'erreur recommandés

- PROVIDER_UNAVAILABLE ;

- PROVIDER_TIMEOUT ;

- PROVIDER_RATE_LIMITED ;

- PROVIDER_AUTH_FAILED ;

- PROVIDER_MAPPING_FAILED ;

- PROVIDER_DATA_PARTIAL ;

- PROVIDER_NOT_CONFIGURED ;

- PROVIDER_PROFILE_PRIVATE.

### 15.2 Réponse API Track'N Share

Exemple :

{

"success": false,

"error": {

"code": "PROVIDER_UNAVAILABLE",

"message": "La synchronisation est temporairement indisponible.",

"requestId": "req_abc123"

}

}

### 15.3 Comportement attendu

En cas d'erreur :

- garder les dernières stats ;

- ne pas casser le dashboard ;

- afficher un message clair ;

- utiliser fallback mock en démo ;

- logguer l'incident sans secret.

## 16 Tests recommandés

### 16.1 Tests MockProvider

- données retournées ;

- mapping complet ;

- score calculé ;

- leaderboard alimenté ;

- timeout simulé ;

- mapping partial simulé.

### 16.2 Tests SteamProvider futur

- clé absente ;

- clé invalide ;

- profil privé ;

- AppID inconnu ;

- stats indisponibles ;

- timeout ;

- rate limit ;

- fallback.

### 16.3 Tests EpicProvider futur

- credentials absents ;

- configuration incomplète ;

- produit non configuré ;

- stats indisponibles ;

- token expiré ;

- fallback.

### 16.4 Tests sécurité

- aucune clé dans front ;

- aucune clé dans logs ;

- Swagger sans secret ;

- routes sync protégées ;

- rate limit sync.

## 17 Ressources à éviter ou utiliser avec prudence

### 17.1 APIs non officielles

À éviter comme base principale :

- endpoints non documentés ;

- scraping de pages Steam/Epic ;

- reverse engineering ;

- bibliothèques non maintenues ;

- wrappers communautaires non vérifiés ;

- données extraites de profils sans respect des paramètres de confidentialité.

### 17.2 Pourquoi éviter ces sources

Risques :

- instabilité ;

- violation de conditions d'utilisation ;

- données incorrectes ;

- changements non annoncés ;

- sécurité faible ;

- difficulté à justifier en soutenance.

## 18 Décision projet

### 18.1 Décision MVP

Pour Track'N Share MVP, la décision recommandée est :

- MockProvider en provider principal ;

- Steam/Epic documentés ;

- Steam/Epic désactivés en soutenance ;

- providers externes réels traités comme évolutions futures.

### 18.2 Justification

Cette décision est justifiée par :

- stabilité de la soutenance ;

- absence de dépendance externe ;

- limites d'accès aux stats universelles ;

- protection des clés ;

- facilité de tests ;

- cohérence avec les seeders ;

- maîtrise des données affichées.

## 19 Checklist avant intégration réelle

Avant d'implémenter Steam ou Epic réellement :

- vérifier documentation officielle à jour ;

- confirmer les données réellement disponibles ;

- créer un compte développeur si nécessaire ;

- créer les credentials ;

- stocker les secrets côté back-end ;

- définir les scopes ;

- définir le mapping ;

- ajouter timeouts ;

- ajouter cache ;

- ajouter rate limiting ;

- ajouter tests provider ;

- ajouter monitoring ;

- mettre à jour Mapping-donnees-externes ;

- mettre à jour Variables-environnement ;

- mettre à jour Plan-secours-APIs.

## 20 Synthèse des ressources prioritaires

Steam :

- Steam Web API Overview : https://partner.steamgames.com/doc/webapi_overview

- Steam Web API Reference : https://partner.steamgames.com/doc/webapi

- ISteamLeaderboards : https://partner.steamgames.com/doc/webapi/isteamleaderboards

- ISteamUserStats : https://partner.steamgames.com/doc/api/isteamuserstats

- Steam Authentication : https://partner.steamgames.com/doc/features/auth

Epic :

- Epic Online Services SDK : https://onlineservices.epicgames.com/en-US/sdk

- Epic Developer Documentation : https://dev.epicgames.com/docs/

- Epic Developer Portal : https://dev.epicgames.com/portal

- Epic Player & Game Data : https://onlineservices.epicgames.com/player-game-data

- Epic Developer Support : https://dev.epicgames.com/support

Interne Track'N Share :

- Documentation-Steam-API ;

- Documentation-Epic-Games-API ;

- Plan-secours-APIs ;

- Gestion-rate-limiting ;

- Mapping-donnees-externes ;

- Tests-API ;

- Tests-securite ;

- Recette-soutenance.

## 21 Conclusion

Les APIs externes sont importantes pour l'évolution de Track'N Share, mais elles ne doivent pas mettre en danger le MVP.

Steam et Epic proposent des services officiels intéressants autour des utilisateurs, statistiques, achievements, leaderboards ou données joueur, mais leur usage réel dépend fortement des permissions, du jeu, des credentials et de la configuration développeur.

Pour le MVP et la soutenance, le choix le plus fiable est d'utiliser un MockProvider interne avec des données seedées. Cette approche permet de démontrer le produit, tester les mappings, valider les parcours et documenter clairement les intégrations futures.

Les intégrations réelles Steam/Epic pourront être ajoutées progressivement après validation technique et fonctionnelle, en respectant les règles de sécurité, de rate limiting, de cache et de mapping définies dans ce document.
