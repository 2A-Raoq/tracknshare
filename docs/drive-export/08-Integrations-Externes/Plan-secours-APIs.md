# PLAN DE SECOURS APIs

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document définit le plan de secours prévu pour Track'N Share en cas d'indisponibilité, de limitation, d'échec ou d'incompatibilité des APIs externes utilisées pour récupérer des données gaming.

Le projet Track'N Share prévoit potentiellement des intégrations avec Steam, Epic Games / Epic Online Services et d'autres APIs de jeux. Cependant, ces sources externes ne doivent pas mettre en danger le MVP, la démonstration ou l'expérience utilisateur.

Le plan de secours a donc pour objectif de garantir que l'application reste fonctionnelle même si :

- une API externe est indisponible ;

- une clé API est invalide ou absente ;

- un profil utilisateur est privé ;

- les statistiques d'un jeu ne sont pas disponibles ;

- l'API retourne une erreur ;

- l'API impose un rate limit ;

- le format de réponse change ;

- la connexion réseau échoue ;

- une intégration réelle n'est pas prête pour la soutenance.

## 1 Principe général

### 1.1 Règle principale

Track'N Share ne doit jamais dépendre uniquement d'une API externe pour fonctionner.

Les fonctionnalités principales du MVP doivent rester utilisables grâce à :

- une API mockée ;

- des données seedées ;

- un cache des dernières données valides ;

- des messages d'erreur clairs ;

- une stratégie de fallback ;

- un mode démo complet.

### 1.2 Objectif métier

Le joueur doit pouvoir :

- accéder à son dashboard ;

- consulter ses dernières statistiques disponibles ;

- voir son score ;

- consulter un leaderboard ;

- accéder aux saisons ;

- créer ou rejoindre une équipe ;

- utiliser le chat d'équipe ;

- comprendre si la synchronisation externe a échoué.

Même si une API externe est indisponible, l'application ne doit pas afficher un écran cassé ou supprimer les anciennes données.

### 1.3 Objectif soutenance

Pendant la soutenance, l'application doit pouvoir être présentée sans dépendre d'Internet, de Steam, d'Epic Games ou d'une API de jeu réelle.

Le mode démo doit être suffisant pour montrer :

- un compte utilisateur ;

- un profil joueur ;

- des statistiques ;

- un score ;

- un leaderboard solo ;

- des saisons archivées ;

- une équipe ;

- des statistiques d'équipe ;

- un chat avec historique ;

- un scénario complet d'utilisation.

## 2 APIs externes concernées

### 2.1 Steam Web API

Steam est une intégration externe pertinente pour Track'N Share.

Données potentiellement récupérables :

- profil Steam ;

- SteamID ;

- pseudo Steam ;

- avatar ;

- jeux possédés ;

- temps de jeu ;

- certaines statistiques par jeu ;

- succès et statistiques globales selon AppID.

Risques :

- clé API manquante ou invalide ;

- profil privé ;

- jeux non visibles ;

- statistiques non disponibles selon le jeu ;

- droits éditeur nécessaires pour certaines méthodes ;

- rate limit ;

- réponse partielle ou changement de format.

### 2.2 Epic Games / Epic Online Services

Epic / EOS est une intégration possible mais plus complexe.

Données potentiellement récupérables selon contexte :

- identité Epic ou Product User ID ;

- display name ;

- avatar si disponible ;

- stats configurées dans un produit compatible ;

- leaderboards configurés dans un produit compatible.

Risques :

- pas d'API universelle comparable à Steam ;

- configuration développeur nécessaire ;

- stats dépendantes du produit ;

- mapping impossible si le jeu ne fournit pas les champs nécessaires ;

- permissions insuffisantes ;

- intégration trop complexe pour le MVP.

### 2.3 APIs futures

Le plan de secours doit aussi s'appliquer à toute future API :

- Riot Games ;

- Blizzard ;

- Ubisoft ;

- Xbox ;

- PlayStation ;

- APIs spécifiques à certains jeux.

Principe :

Toute nouvelle API doit être intégrée derrière une couche d'abstraction afin que Track'N Share puisse basculer vers une source mockée ou cache en cas d'échec.

## 3 Sources de données disponibles

### 3.1 Source externe réelle

La source externe réelle correspond à une API comme Steam ou Epic/EOS.

Avantages :

- données plus crédibles ;

- intégration réelle ;

- valeur technique plus forte.

Limites :

- dépendance réseau ;

- dépendance aux permissions ;

- formats variables ;

- indisponibilité possible ;

- données parfois incomplètes.

### 3.2 Source mockée

La source mockée est une API interne ou un service back-end qui génère des données fictives réalistes.

Avantages :

- fiable pour le MVP ;

- aucun quota externe ;

- fonctionne sans API réelle ;

- idéal pour la soutenance ;

- permet de tester tous les cas fonctionnels.

Limites :

- données non réelles ;

- doit être clairement identifiée comme démo ou mock.

### 3.3 Données seedées

Les données seedées sont insérées en base au démarrage ou via un script.

Elles doivent contenir :

- utilisateurs fictifs ;

- profils ;

- jeux ;

- comptes liés ;

- statistiques ;

- leaderboards ;

- équipes ;

- membres ;

- messages ;

- saisons actives et archivées.

### 3.4 Cache des dernières données valides

Lorsqu'une synchronisation externe réussit, les données doivent être stockées en base.

En cas d'échec ultérieur, l'application peut continuer à afficher les dernières données valides avec une mention :

"Dernière synchronisation réussie le ..."

## 4 Architecture recommandée

### 4.1 Couche d'abstraction Provider

Le back-end doit éviter d'appeler directement Steam ou Epic depuis les controllers.

Architecture recommandée :

StatsController

→ StatsService

→ ExternalStatsProviderService

→ SteamProvider / EpicProvider / MockProvider

→ Mapper

→ PlayerStatsRepository

Objectif :

- isoler les APIs externes ;

- uniformiser les réponses ;

- gérer les erreurs à un seul endroit ;

- faciliter le fallback ;

- pouvoir remplacer une source par une autre.

### 4.2 Interface commune de provider

Chaque provider doit respecter un contrat commun.

Exemple conceptuel :

interface ExternalStatsProvider {

providerName: 'STEAM' | 'EPIC' | 'MOCK';

getPlayerProfile(externalId: string): Promise<ExternalProfileResult>;

getPlayerStats(params: SyncStatsParams): Promise<ExternalStatsResult>;

isAvailable(): Promise<boolean>;

}

### 4.3 Résultat normalisé

Le provider doit retourner un format normalisé, même si la source externe a un format différent.

Exemple :

{

"provider": "STEAM",

"externalId": "76561198000000000",

"gameExternalId": "440",

"stats": {

"wins": 42,

"losses": 18,

"kills": 830,

"deaths": 510,

"matchesPlayed": 60

},

"metadata": {

"source": "steam",

"mappingStatus": "COMPLETE"

}

}

## 5 Stratégie de fallback

### 5.1 Ordre de priorité des sources

Ordre recommandé lors d'une synchronisation :

1. API externe réelle si configurée et disponible.

2. Dernières données valides en base si l'API échoue.

3. Données mockées si aucune donnée valide n'existe.

4. État vide contrôlé si aucune donnée n'est disponible.

### 5.2 Fallback lors d'un échec API

Si une API externe échoue :

- ne pas supprimer les anciennes statistiques ;

- enregistrer l'échec dans un journal technique ;

- retourner une erreur contrôlée au front ;

- afficher un message clair à l'utilisateur ;

- conserver le dashboard utilisable ;

- proposer de réessayer plus tard ;

- utiliser les dernières données valides si elles existent.

### 5.3 Fallback automatique vers mock

En environnement de développement ou démonstration, le système peut automatiquement utiliser le provider MOCK si :

- la clé API externe est absente ;

- l'API externe retourne une erreur ;

- le provider réel est désactivé ;

- la variable USE_MOCK_PROVIDER=true est activée.

### 5.4 Fallback contrôlé en production

En production, le fallback mock doit être contrôlé.

Recommandation :

- ne pas afficher des données mockées comme si elles étaient réelles ;

- indiquer clairement si les données sont simulées ;

- utiliser plutôt les dernières données valides ;

- réserver les mocks aux comptes démo ou environnements non production.

## 6 Variables d'environnement recommandées

Variables générales :

EXTERNAL_API_MODE=mock | real | hybrid

USE_MOCK_PROVIDER=true | false

ENABLE_STEAM_PROVIDER=true | false

ENABLE_EPIC_PROVIDER=true | false

EXTERNAL_API_TIMEOUT_MS=5000

EXTERNAL_API_MAX_RETRIES=2

EXTERNAL_API_CACHE_TTL_SECONDS=300

Variables Steam :

STEAM_WEB_API_KEY=replace_me

STEAM_API_BASE_URL=https://api.steampowered.com

STEAM_PARTNER_API_BASE_URL=https://partner.steam-api.com

Variables Epic / EOS :

EPIC_CLIENT_ID=replace_me

EPIC_CLIENT_SECRET=replace_me

EPIC_PRODUCT_ID=replace_me

EPIC_DEPLOYMENT_ID=replace_me

EPIC_SANDBOX_ID=replace_me

Variables de démo :

DEMO_MODE=true | false

DEMO_SEED_ENABLED=true | false

DEMO_ACCOUNT_EMAIL=demo@tracknshare.local

## 7 Modes de fonctionnement

### 7.1 Mode mock

Configuration :

EXTERNAL_API_MODE=mock

Comportement :

- toutes les synchronisations utilisent MockProvider ;

- aucune API externe n'est appelée ;

- idéal pour développement, tests et soutenance.

### 7.2 Mode real

Configuration :

EXTERNAL_API_MODE=real

Comportement :

- le système utilise les APIs externes configurées ;

- si l'API échoue, le système retourne une erreur contrôlée ;

- les anciennes données sont conservées.

### 7.3 Mode hybrid

Configuration :

EXTERNAL_API_MODE=hybrid

Comportement :

- le système tente d'abord l'API réelle ;

- si elle échoue, il utilise les dernières données valides ;

- si aucune donnée valide n'existe, il peut utiliser MockProvider selon environnement.

Recommandation :

- mode mock pour la soutenance ;

- mode hybrid pour développement avancé ;

- mode real uniquement lorsque l'intégration est fiable.

## 8 Gestion des erreurs

### 8.1 Typologie des erreurs

CONFIGURATION_ERROR

Configuration absente ou invalide.

AUTH_PROVIDER_ERROR

Clé API ou token externe invalide.

PROVIDER_UNAVAILABLE

API externe indisponible.

PROVIDER_TIMEOUT

L'API ne répond pas dans le délai prévu.

RATE_LIMIT_REACHED

Quota ou limite d'appels atteint.

EXTERNAL_PROFILE_PRIVATE

Profil privé ou données non visibles.

EXTERNAL_STATS_NOT_AVAILABLE

Statistiques inexistantes ou non exposées.

EXTERNAL_MAPPING_FAILED

Impossible de transformer les données externes vers le modèle interne.

EXTERNAL_RESPONSE_INVALID

Réponse API inattendue ou incomplète.

### 8.2 Format d'erreur interne

Format recommandé :

{

"success": false,

"error": {

"code": "PROVIDER_UNAVAILABLE",

"message": "La source externe est momentanément indisponible.",

"provider": "STEAM",

"fallbackUsed": true

}

}

### 8.3 Message utilisateur

Les messages utilisateur doivent rester compréhensibles.

Exemples :

- "Impossible de synchroniser les statistiques pour le moment. Les dernières données connues sont affichées."

- "Le profil externe semble privé ou inaccessible."

- "Les statistiques de ce jeu ne sont pas disponibles via cette API."

- "Le mode démo est utilisé pour afficher des données de test."

### 8.4 Logs techniques

Les logs peuvent contenir :

- provider ;

- code erreur ;

- endpoint appelé ;

- durée de réponse ;

- userId interne ;

- gameId ;

- timestamp.

Les logs ne doivent jamais contenir :

- clés API ;

- tokens ;

- secrets ;

- mots de passe ;

- données sensibles inutiles.

## 9 Timeout et retries

### 9.1 Timeout

Chaque appel externe doit avoir un délai maximal.

Recommandation MVP :

- 5 secondes maximum par appel API externe.

Si le timeout est dépassé :

- annuler la requête ;

- retourner une erreur contrôlée ;

- utiliser le fallback.

### 9.2 Retries

Les retries peuvent être utiles pour les erreurs temporaires.

Recommandation :

- maximum 1 à 2 retries ;

- délai court entre les tentatives ;

- ne pas retry les erreurs 400/401/403 ;

- retry uniquement les erreurs réseau, timeout, 502, 503, 504.

### 9.3 Backoff

Utiliser un backoff simple :

- tentative 1 immédiate ;

- tentative 2 après 500 ms ;

- tentative 3 après 1500 ms si autorisé.

Pour le MVP, un retry simple suffit.

## 10 Cache

### 10.1 Objectif du cache

Le cache permet de :

- réduire les appels aux APIs externes ;

- améliorer les performances ;

- limiter les risques de rate limiting ;

- afficher rapidement les dernières données ;

- protéger la démonstration.

### 10.2 Cache recommandé

Données à cacher :

- profil externe ;

- jeux possédés ;

- dernière réponse de stats normalisée ;

- leaderboard courant si nécessaire ;

- statut de disponibilité provider.

### 10.3 TTL recommandé

Profil externe : 1 heure à 24 heures.

Jeux possédés : 1 heure à 24 heures.

Statistiques : 5 minutes à 1 heure selon usage.

Provider healthcheck : 1 à 5 minutes.

### 10.4 Source de vérité

Le cache n'est pas la source de vérité durable.

Les statistiques validées doivent être sauvegardées en base dans player_stats.

## 11 Données seedées

### 11.1 Objectif

Les données seedées garantissent que l'application est utilisable même sans API externe.

### 11.2 Données minimales

Pour le MVP, prévoir :

- 15 à 30 joueurs ;

- 4 à 8 équipes ;

- 3 à 5 jeux ;

- 1 saison active ;

- 2 saisons archivées ;

- statistiques cohérentes ;

- leaderboards remplis ;

- messages de chat ;

- un compte démo complet.

### 11.3 Compte démo

Le compte démo doit avoir :

- un profil complet ;

- un compte de jeu mocké ;

- des statistiques sur la saison active ;

- un historique sur les saisons archivées ;

- une équipe ;

- un chat avec messages ;

- un rang visible.

## 12 API mockée

### 12.1 Objectif

L'API mockée simule une API externe fiable.

Elle doit pouvoir générer :

- wins ;

- losses ;

- kills ;

- deaths ;

- matchesPlayed ;

- K/D ;

- winrate ;

- score ;

- données d'équipe ;

- données de leaderboard.

### 12.2 Règles de cohérence

Les données mockées doivent être crédibles.

Exemples :

- matchesPlayed = wins + losses ;

- deaths peut être 0 mais doit être géré ;

- winrate doit correspondre aux wins/losses ;

- K/D doit correspondre aux kills/deaths ;

- les scores doivent permettre un classement logique.

### 12.3 Seed déterministe

Pour les tests et la soutenance, il est recommandé de pouvoir générer des données déterministes.

Objectif :

- obtenir les mêmes résultats à chaque seed ;

- éviter des leaderboards incohérents ;

- faciliter les captures et démonstrations.

## 13 Mode dégradé côté front-end

### 13.1 États UI à prévoir

Le front-end doit prévoir :

- chargement ;

- succès ;

- erreur API ;

- fallback utilisé ;

- données anciennes ;

- état vide ;

- mode démo.

### 13.2 Affichage des données anciennes

Si les données ne sont pas fraîches :

Afficher :

"Dernière synchronisation réussie : 06/05/2026 à 14:30"

### 13.3 Affichage fallback mock

Si les données sont simulées :

Afficher :

"Données de démonstration"

ou :

"Source : Mock API"

### 13.4 Bouton réessayer

En cas d'échec de synchronisation, proposer :

- Réessayer ;

- Utiliser les données de démo ;

- Lier un autre compte ;

- Consulter les dernières données disponibles.

## 14 Plan de secours par scénario

### 14.1 Clé Steam absente

Cause :

La variable STEAM_WEB_API_KEY n'est pas configurée.

Comportement :

- désactiver SteamProvider ;

- utiliser MockProvider si mode démo/dev ;

- afficher une erreur contrôlée si mode réel.

Message admin :

"Configuration Steam manquante."

Message utilisateur :

"La synchronisation Steam n'est pas disponible pour le moment."

### 14.2 Profil Steam privé

Cause :

Le profil ou les détails de jeux ne sont pas publics.

Comportement :

- afficher un message clair ;

- ne pas supprimer les anciennes données ;

- proposer de rendre le profil public ou d'utiliser le mode démo.

### 14.3 Stats Steam indisponibles

Cause :

Le jeu ne fournit pas les statistiques nécessaires via Steam Web API.

Comportement :

- conserver le compte lié ;

- marquer mappingStatus = UNAVAILABLE ;

- utiliser les données mockées si environnement démo ;

- expliquer que ce jeu ne fournit pas les stats nécessaires.

### 14.4 Epic/EOS non configuré

Cause :

Identifiants Epic absents ou service non prêt.

Comportement :

- provider EPIC désactivé ;

- intégration marquée comme future ;

- fallback mock pour le MVP.

### 14.5 API externe timeout

Cause :

L'API ne répond pas assez vite.

Comportement :

- annuler la requête ;

- utiliser cache ou dernières données ;

- afficher une erreur temporaire ;

- permettre une nouvelle tentative.

### 14.6 Rate limit atteint

Cause :

Trop d'appels externes.

Comportement :

- arrêter temporairement les appels ;

- utiliser cache ;

- planifier un retry plus tard ;

- limiter les synchronisations manuelles.

### 14.7 Réponse API invalide

Cause :

Format inattendu ou champ manquant.

Comportement :

- ne pas écraser les statistiques existantes ;

- logger l'erreur ;

- marquer la synchronisation comme échouée ;

- afficher les anciennes données.

### 14.8 Absence d'Internet pendant la soutenance

Comportement :

- lancer l'application en local avec Docker ;

- utiliser données seedées ;

- utiliser MockProvider ;

- ne pas dépendre des APIs externes ;

- préparer un compte démo.

## 15 Rate limiting interne

### 15.1 Pourquoi limiter les synchronisations

Même si l'utilisateur déclenche une synchronisation manuelle, Track'N Share doit éviter :

- spam d'appels externes ;

- dépassement de quotas ;

- surcharge serveur ;

- blocage API.

### 15.2 Règles recommandées

Pour POST /stats/sync :

- limiter à une synchronisation toutes les 1 à 5 minutes par utilisateur et par jeu ;

- limiter le nombre de tentatives échouées ;

- utiliser les données cache si une synchronisation a été faite récemment.

### 15.3 Message utilisateur

"Une synchronisation a déjà été effectuée récemment. Réessayez dans quelques minutes."

## 16 Healthcheck providers

### 16.1 Endpoint interne recommandé

GET /integrations/status

Réponse possible :

{

"success": true,

"data": {

"steam": {

"enabled": true,

"configured": true,

"available": true,

"lastCheckAt": "2026-05-06T12:00:00.000Z"

},

"epic": {

"enabled": false,

"configured": false,

"available": false

},

"mock": {

"enabled": true,

"available": true

}

}

}

### 16.2 Usage

Cet endpoint peut être réservé à l'administration ou au mode développement.

Il permet de savoir rapidement quelle source est disponible.

## 17 Sécurité

### 17.1 Secrets

Les clés API et secrets doivent être stockés dans .env.

Interdit :

- secrets dans le front-end ;

- secrets dans GitHub ;

- secrets dans les logs ;

- secrets dans Swagger public.

### 17.2 Données personnelles

Ne pas collecter plus que nécessaire.

Pour les comptes externes :

- externalId ;

- externalUsername ;

- avatarUrl optionnel ;

- profileUrl optionnel ;

- lastSyncAt.

### 17.3 Tokens externes

Si des tokens externes sont stockés :

- les chiffrer ;

- limiter leur durée ;

- permettre leur révocation ;

- ne jamais les envoyer au front.

## 18 Monitoring et logs

### 18.1 Logs utiles

Logger :

- provider utilisé ;

- succès ou échec ;

- durée de réponse ;

- code erreur ;

- fallback utilisé ou non ;

- date de dernière réussite.

### 18.2 Indicateurs à suivre

- taux de succès Steam ;

- taux de succès Epic ;

- nombre de fallbacks mock ;

- nombre de timeouts ;

- nombre de rate limits ;

- temps moyen de synchronisation ;

- âge moyen des dernières données valides.

### 18.3 Ne pas logger

- clés API ;

- tokens ;

- mots de passe ;

- contenus privés ;

- réponses complètes contenant des données sensibles.

## 19 Plan de soutenance

### 19.1 Préparation avant soutenance

Avant la démonstration :

- lancer Docker Compose ;

- vérifier que la base est seedée ;

- vérifier que DEMO_MODE=true ;

- vérifier que EXTERNAL_API_MODE=mock ;

- tester le compte démo ;

- vérifier dashboard, stats, leaderboard, équipe, chat ;

- couper volontairement les dépendances externes pour confirmer que tout fonctionne.

### 19.2 Scénario de démonstration sécurisé

1. Ouvrir la landing page.

2. Se connecter avec le compte démo.

3. Afficher le dashboard.

4. Montrer les statistiques et score.

5. Cliquer sur Synchroniser les stats avec MockProvider.

6. Montrer le leaderboard mis à jour.

7. Montrer la saison active et les archives.

8. Montrer l'équipe et le chat.

9. Expliquer que Steam/Epic sont documentés comme intégrations futures ou optionnelles.

### 19.3 Démonstration du fallback

Scénario possible :

- simuler une erreur Steam ;

- afficher le message d'erreur contrôlé ;

- montrer que les anciennes données restent visibles ;

- montrer que l'application ne plante pas.

## 20 Plan d'implémentation recommandé

Phase 1 — MockProvider

- créer un provider mock ;

- générer des stats cohérentes ;

- brancher /stats/sync dessus ;

- tester dashboard et leaderboard.

Phase 2 — Données seedées

- créer joueurs fictifs ;

- créer équipes ;

- créer saisons ;

- créer messages ;

- créer leaderboards.

Phase 3 — Couche provider

- créer ExternalStatsProvider interface ;

- créer ProviderFactory ;

- gérer provider STEAM, EPIC, MOCK ;

- normaliser les résultats.

Phase 4 — Gestion d'erreurs

- créer codes d'erreur externes ;

- ajouter timeout ;

- ajouter retry ;

- ajouter fallback dernières données.

Phase 5 — Steam minimal

- ResolveVanityURL ;

- GetPlayerSummaries ;

- liaison de compte Steam ;

- pas encore de dépendance aux stats réelles.

Phase 6 — Epic futur

- préparer provider EPIC/EOS ;

- documenter config ;

- n'activer que si un contexte compatible existe.

## 21 Critères d'acceptation

Le plan de secours APIs est considéré comme fonctionnel si :

- l'application fonctionne sans API externe ;

- le mode mock peut alimenter les statistiques ;

- les données seedées remplissent dashboard, leaderboards, saisons et équipes ;

- une erreur API externe ne supprime pas les anciennes données ;

- un timeout API est géré proprement ;

- un profil privé ou des stats indisponibles affichent un message clair ;

- les clés API restent côté serveur ;

- les erreurs sont loggées sans secrets ;

- le front affiche un état fallback ou données anciennes ;

- la soutenance peut être réalisée avec EXTERNAL_API_MODE=mock ;

- Steam et Epic peuvent être désactivés sans casser l'application.

## 22 Risques et solutions

### 22.1 Risque : API externe indisponible

Impact : synchronisation impossible.

Solution : utiliser les dernières données valides puis MockProvider en démo.

### 22.2 Risque : profil externe privé

Impact : données non accessibles.

Solution : message clair et conservation des anciennes stats.

### 22.3 Risque : stats non disponibles pour un jeu

Impact : impossible de calculer score réel.

Solution : mapping par jeu et fallback mock.

### 22.4 Risque : dépendance à Internet pendant la soutenance

Impact : démonstration bloquée.

Solution : Docker local, seeders et mode mock.

### 22.5 Risque : clé API exposée

Impact : faille de sécurité.

Solution : appels côté serveur et variables d'environnement.

### 22.6 Risque : rate limit

Impact : blocage temporaire des appels externes.

Solution : cache, limitation sync, retries contrôlés.

### 22.7 Risque : données mock confondues avec données réelles

Impact : perte de confiance.

Solution : afficher clairement le mode démo ou la source mock.

## 23 Tableau récapitulatif

| Scénario | Cause | Réponse système | Réponse utilisateur |

|---|---|---|---|

| Steam indisponible | API down ou timeout | Utiliser cache / anciennes données | Message temporaire |

| Clé API absente | .env incomplet | Désactiver provider réel | Sync indisponible |

| Profil privé | Visibilité Steam | Ne pas écraser les stats | Demander profil public ou mock |

| Stats non disponibles | Jeu non compatible | mappingStatus UNAVAILABLE | Expliquer la limite |

| Epic non configuré | Intégration future | Provider désactivé | Non proposé ou message clair |

| Rate limit | Trop d'appels | Cache + blocage temporaire | Réessayer plus tard |

| Soutenance hors ligne | Pas d'Internet | Mock + seeders | Application fonctionnelle |

| Réponse invalide | Format changé | Log + fallback | Anciennes données affichées |

## 24 Conclusion

Le plan de secours APIs est indispensable pour Track'N Share.

Steam et Epic sont des intégrations intéressantes, mais elles ne doivent pas mettre en danger le MVP. La plateforme doit rester pleinement démontrable grâce à une API mockée, des données seedées, un cache des dernières données valides et une gestion propre des erreurs.

La stratégie recommandée est donc :

- MockProvider obligatoire pour le MVP ;

- données seedées complètes ;

- APIs externes derrière une couche provider ;

- fallback vers cache ou mock ;

- erreurs contrôlées ;

- secrets côté serveur ;

- démonstration possible sans Internet.

Ainsi, Track'N Share peut progresser vers de vraies intégrations externes sans compromettre la stabilité du projet.
