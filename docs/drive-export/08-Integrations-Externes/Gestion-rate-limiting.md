# GESTION DU RATE LIMITING

Projet Track'N Share

Version : 1.0

Date : 06/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la stratégie de rate limiting prévue pour Track'N Share.

Le rate limiting consiste à limiter le nombre d'actions ou de requêtes qu'un utilisateur, une adresse IP, un compte ou un service peut effectuer sur une période donnée.

Dans Track'N Share, cette stratégie est importante pour :

- protéger l'API NestJS ;

- éviter le bruteforce sur l'authentification ;

- limiter le spam dans le chat ;

- protéger les APIs externes comme Steam ou Epic/EOS ;

- éviter les abus de synchronisation de statistiques ;

- préserver les performances du back-end ;

- sécuriser la démonstration et le mode démo.

## 1 Principe général

### 1.1 Définition

Le rate limiting est un mécanisme qui bloque ou ralentit les requêtes lorsqu'un utilisateur dépasse une limite définie.

Exemple :

Un utilisateur ne peut tenter de se connecter que 5 fois en 1 minute depuis la même adresse IP.

### 1.2 Objectif métier

Le rate limiting doit protéger l'application sans bloquer l'utilisation normale.

L'utilisateur doit pouvoir :

- se connecter ;

- synchroniser ses statistiques ;

- envoyer des messages ;

- consulter les leaderboards ;

- rejoindre une équipe ;

- utiliser le dashboard.

Mais il ne doit pas pouvoir :

- spammer les endpoints ;

- tester des milliers de mots de passe ;

- envoyer des centaines de messages par minute ;

- déclencher des appels externes en boucle ;

- dépasser les quotas des APIs Steam ou Epic.

### 1.3 Règle principale

Les limites doivent être appliquées côté back-end.

Le front-end peut désactiver un bouton ou afficher un compteur, mais la vraie protection doit être côté API NestJS et Socket.io.

## 2 Zones à protéger

### 2.1 Authentification

Endpoints concernés :

- POST /auth/login ;

- POST /auth/register ;

- POST /auth/forgot-password ;

- POST /auth/reset-password ;

- POST /auth/refresh.

Risque :

- bruteforce de mot de passe ;

- création massive de comptes ;

- spam d'emails de reset ;

- abus de refresh token.

### 2.2 Synchronisation des statistiques

Endpoints concernés :

- POST /stats/sync ;

- POST /score/recalculate ;

- POST /teams/:id/stats/recalculate.

Risque :

- appels répétés aux APIs externes ;

- dépassement des quotas Steam / Epic ;

- surcharge du back-end ;

- recalculs inutiles de leaderboards.

### 2.3 APIs externes

Providers concernés :

- Steam ;

- Epic / EOS ;

- futures APIs de jeux ;

- MockProvider en développement.

Risque :

- blocage temporaire ;

- erreurs 429 ;

- temps de réponse dégradé ;

- perte de fiabilité des synchronisations.

### 2.4 Chat et Socket.io

Événements concernés :

- sendTeamMessage ;

- joinTeamRoom ;

- typingStart ;

- typingStop ;

- markTeamMessagesRead.

Risque :

- spam dans le chat ;

- surcharge Socket.io ;

- flooding de rooms ;

- mauvaise expérience utilisateur.

### 2.5 Équipes et invitations

Endpoints concernés :

- POST /teams ;

- POST /teams/join ;

- POST /teams/:id/invite-code/regenerate ;

- POST /teams/:id/invitations ;

- POST /team-invitations/:id/accept ;

- POST /team-invitations/:id/refuse.

Risque :

- spam de codes d'invitation ;

- brute force de codes ;

- création massive d'équipes ;

- spam d'invitations.

### 2.6 Recherche

Endpoints concernés :

- GET /search ;

- GET /search/users ;

- GET /search/teams ;

- GET /search/games.

Risque :

- scraping ;

- surcharge de requêtes ;

- recherche abusive.

### 2.7 Administration et démo

Endpoints concernés :

- POST /demo/seed ;

- POST /admin/seasons/:id/archive ;

- POST /admin/recalculate-leaderboards ;

- routes de maintenance.

Risque :

- reset abusif des données ;

- recalculs lourds ;

- actions critiques déclenchées trop souvent.

## 3 Stratégie technique recommandée

### 3.1 Rate limiting côté NestJS

NestJS peut utiliser un module de throttling pour limiter les requêtes HTTP.

Outils possibles :

- @nestjs/throttler ;

- Redis comme stockage partagé ;

- middleware personnalisé pour les besoins avancés.

Pour le MVP, @nestjs/throttler est suffisant.

Pour une version plus robuste, utiliser Redis afin que les limites fonctionnent même avec plusieurs instances back-end.

### 3.2 Rate limiting côté Socket.io

Socket.io nécessite une logique dédiée.

Les limites peuvent être appliquées :

- par socketId ;

- par userId ;

- par teamId ;

- par adresse IP ;

- par événement.

Exemple :

Un utilisateur ne peut pas envoyer plus de 20 messages par minute dans une même équipe.

### 3.3 Redis pour le stockage des compteurs

Redis est recommandé pour stocker les compteurs de rate limit.

Avantages :

- très rapide ;

- expiration automatique des clés ;

- compatible avec plusieurs instances ;

- utile aussi pour sessions, cache, leaderboards et Socket.io.

Exemples de clés :

rate:auth:login:ip:{ip}

rate:auth:login:user:{emailHash}

rate:stats:sync:user:{userId}:game:{gameId}

rate:chat:message:user:{userId}:team:{teamId}

rate:teams:join:user:{userId}

rate:external:steam:user:{userId}

rate:external:steam:global

## 4 Limites recommandées pour le MVP

### 4.1 Authentification

POST /auth/login

Limite recommandée :

- 5 tentatives par minute par IP ;

- 10 tentatives par 15 minutes par email ou email hashé.

Comportement :

- retourner 429 Too Many Requests ;

- afficher un message générique ;

- ne pas préciser si l'email existe.

POST /auth/register

Limite recommandée :

- 3 créations de compte par heure par IP ;

- limite plus stricte si abus détecté.

POST /auth/forgot-password

Limite recommandée :

- 3 demandes par heure par email ;

- 5 demandes par heure par IP.

POST /auth/refresh

Limite recommandée :

- 30 appels par minute par utilisateur ou session ;

- détecter les refresh loops côté front.

### 4.2 Synchronisation des statistiques

POST /stats/sync

Limite recommandée :

- 1 synchronisation toutes les 2 à 5 minutes par utilisateur et par jeu ;

- 10 synchronisations maximum par heure par utilisateur ;

- limite globale par provider externe.

Règle MVP :

Une synchronisation récente doit retourner les dernières données connues plutôt que refaire un appel externe.

POST /score/recalculate

Limite recommandée :

- réservé au système ou déclenché automatiquement après sync ;

- pas d'appel manuel libre par les joueurs.

POST /teams/:id/stats/recalculate

Limite recommandée :

- 1 recalcul toutes les 5 minutes par équipe ;

- réservé au capitaine, admin ou système.

### 4.3 Chat Socket.io

sendTeamMessage

Limite recommandée :

- 20 messages par minute par utilisateur et par équipe ;

- 5 messages en 5 secondes pour éviter le flood court.

typingStart / typingStop

Limite recommandée :

- 1 événement par seconde maximum par utilisateur ;

- ne pas sauvegarder ces événements en base.

joinTeamRoom

Limite recommandée :

- 30 tentatives par minute par utilisateur ;

- refuser rapidement les non-membres.

### 4.4 Équipes et invitations

POST /teams

Limite recommandée :

- 5 créations d'équipe par jour par utilisateur ;

- plus strict si l'application ne prévoit qu'une équipe principale.

POST /teams/join

Limite recommandée :

- 10 tentatives de code par heure par utilisateur ;

- 20 tentatives par heure par IP.

Objectif :

- éviter le brute force de codes d'invitation.

POST /teams/:id/invite-code/regenerate

Limite recommandée :

- 5 régénérations par jour par équipe.

POST /teams/:id/invitations

Limite recommandée :

- 20 invitations par jour par équipe ;

- 10 invitations par heure par capitaine/co-capitaine.

### 4.5 Recherche

GET /search

Limite recommandée :

- 60 requêtes par minute par IP ;

- pagination obligatoire ;

- longueur minimale de recherche, par exemple 2 ou 3 caractères.

### 4.6 Mode démo et administration

POST /demo/seed

Limite recommandée :

- désactivé en production ;

- réservé admin ou environnement local ;

- 1 exécution toutes les 5 minutes maximum.

POST /admin/seasons/:id/archive

Limite recommandée :

- réservé admin ou système ;

- idempotent ;

- éviter les doubles archivages.

POST /admin/recalculate-leaderboards

Limite recommandée :

- réservé admin ;

- limite stricte, par exemple 1 fois toutes les 10 minutes.

## 5 Rate limiting des APIs externes

### 5.1 Principe

Track'N Share doit protéger ses propres quotas externes.

Même si un utilisateur clique plusieurs fois sur Synchroniser, le back-end ne doit pas forcément appeler Steam ou Epic à chaque fois.

### 5.2 Steam

Steam peut refuser, limiter ou ralentir certaines requêtes selon l'endpoint, la clé, l'hôte utilisé et le contexte.

Règles recommandées :

- ne pas appeler Steam directement depuis le front ;

- centraliser les appels côté back-end ;

- limiter les appels par utilisateur ;

- limiter les appels par provider ;

- mettre en cache les réponses non critiques ;

- utiliser les dernières données valides si une limite est atteinte.

Limites internes recommandées :

- profil Steam : cache 1 heure minimum ;

- jeux possédés : cache 1 à 24 heures ;

- stats : pas plus d'une sync toutes les 5 minutes par utilisateur et jeu ;

- limite globale Steam : à ajuster selon les quotas réels observés.

### 5.3 Epic / EOS

Epic / EOS dépend davantage de la configuration du produit, des permissions et des services utilisés.

Règles recommandées :

- ne pas appeler Epic/EOS sans configuration complète ;

- limiter les essais de synchronisation ;

- utiliser l'API mockée si le provider n'est pas prêt ;

- ne pas promettre de stats universelles ;

- prévoir mappingStatus = UNAVAILABLE si les données ne sont pas disponibles.

### 5.4 Provider global limit

Il est utile d'avoir une limite globale par provider.

Exemple :

- Steam : maximum X appels par minute au niveau application ;

- Epic : maximum X appels par minute au niveau application ;

- Mock : limite légère pour éviter les abus, mais plus permissive.

Comme les quotas réels peuvent varier selon compte, contrat ou endpoint, les valeurs exactes doivent être configurables dans .env.

## 6 Configuration recommandée

### 6.1 Variables d'environnement

Variables générales :

RATE_LIMIT_ENABLED=true

RATE_LIMIT_STORE=memory | redis

RATE_LIMIT_DEFAULT_TTL=60

RATE_LIMIT_DEFAULT_LIMIT=100

Auth :

RATE_LIMIT_LOGIN_TTL=60

RATE_LIMIT_LOGIN_LIMIT=5

RATE_LIMIT_REGISTER_TTL=3600

RATE_LIMIT_REGISTER_LIMIT=3

RATE_LIMIT_FORGOT_PASSWORD_TTL=3600

RATE_LIMIT_FORGOT_PASSWORD_LIMIT=3

Stats :

RATE_LIMIT_STATS_SYNC_TTL=300

RATE_LIMIT_STATS_SYNC_LIMIT=1

RATE_LIMIT_STATS_SYNC_HOURLY_LIMIT=10

Chat :

RATE_LIMIT_CHAT_MESSAGE_TTL=60

RATE_LIMIT_CHAT_MESSAGE_LIMIT=20

RATE_LIMIT_CHAT_BURST_TTL=5

RATE_LIMIT_CHAT_BURST_LIMIT=5

Teams :

RATE_LIMIT_TEAM_JOIN_TTL=3600

RATE_LIMIT_TEAM_JOIN_LIMIT=10

RATE_LIMIT_INVITE_REGEN_TTL=86400

RATE_LIMIT_INVITE_REGEN_LIMIT=5

External APIs :

RATE_LIMIT_STEAM_GLOBAL_TTL=60

RATE_LIMIT_STEAM_GLOBAL_LIMIT=60

RATE_LIMIT_EPIC_GLOBAL_TTL=60

RATE_LIMIT_EPIC_GLOBAL_LIMIT=60

### 6.2 Configuration par environnement

Développement :

- limites plus permissives ;

- logs détaillés ;

- MockProvider activé.

Test :

- limites désactivables pour certains tests ;

- tests spécifiques de rate limiting.

Soutenance :

- mode mock ;

- limites raisonnables ;

- éviter les blocages accidentels.

Production :

- limites strictes ;

- Redis recommandé ;

- monitoring activé ;

- routes de seed désactivées.

## 7 Format des réponses 429

### 7.1 Réponse standard

Lorsqu'une limite est atteinte, l'API doit retourner :

HTTP 429 Too Many Requests

Format :

{

"success": false,

"error": {

"code": "RATE_LIMITED",

"message": "Trop de requêtes. Veuillez réessayer plus tard.",

"retryAfterSeconds": 60

}

}

### 7.2 Headers recommandés

Headers utiles :

- Retry-After ;

- X-RateLimit-Limit ;

- X-RateLimit-Remaining ;

- X-RateLimit-Reset.

Exemple :

Retry-After: 60

X-RateLimit-Limit: 5

X-RateLimit-Remaining: 0

X-RateLimit-Reset: 1715003600

### 7.3 Messages utilisateur

Messages front-end recommandés :

- "Trop de tentatives. Réessayez dans quelques minutes."

- "Une synchronisation a déjà été effectuée récemment."

- "Vous envoyez des messages trop rapidement."

- "Trop de tentatives de code d'invitation. Réessayez plus tard."

## 8 UX côté front-end

### 8.1 Prévention côté interface

Le front-end doit aider à éviter les limites.

Exemples :

- désactiver temporairement le bouton Synchroniser après un clic ;

- afficher un compte à rebours ;

- empêcher l'envoi d'un message vide ;

- limiter les doubles clics ;

- afficher un loader pendant les appels.

### 8.2 Ne pas cacher la vraie sécurité

Le front-end améliore l'expérience, mais le back-end reste responsable de la sécurité.

### 8.3 Cas de synchronisation

Après une synchronisation :

- afficher la date de dernière sync ;

- désactiver le bouton pendant 2 à 5 minutes ;

- proposer de consulter les dernières données ;

- ne pas forcer un appel externe immédiat.

### 8.4 Cas du chat

Si l'utilisateur écrit trop vite :

- afficher un message discret ;

- ne pas supprimer le texte saisi ;

- permettre de réessayer après quelques secondes.

## 9 Algorithmes possibles

### 9.1 Fixed window

Principe :

Limiter un nombre de requêtes sur une fenêtre fixe.

Exemple :

5 tentatives par minute.

Avantages :

- simple ;

- facile à implémenter ;

- adapté au MVP.

Limites :

- effets de bord au changement de fenêtre.

### 9.2 Sliding window

Principe :

Limiter les requêtes sur une fenêtre glissante.

Avantages :

- plus précis ;

- évite certains pics.

Limites :

- plus complexe.

### 9.3 Token bucket

Principe :

Un utilisateur consomme des jetons, qui se régénèrent progressivement.

Avantages :

- bon pour absorber des pics raisonnables ;

- adapté aux messages et APIs.

Limites :

- plus complexe à expliquer et implémenter.

### 9.4 Recommandation MVP

Pour le MVP :

- fixed window avec @nestjs/throttler ;

- logique personnalisée simple pour /stats/sync et Socket.io ;

- Redis si disponible.

Pour une évolution :

- sliding window ou token bucket via Redis.

## 10 Implémentation NestJS recommandée

### 10.1 Module Throttler

Exemple conceptuel :

ThrottlerModule.forRoot([

{

ttl: 60000,

limit: 100,

},

])

### 10.2 Décorateurs par route

Exemple :

@Throttle({ default: { limit: 5, ttl: 60000 } })

@Post('login')

login() {}

### 10.3 Guard global

Un guard global peut appliquer une limite par défaut à toute l'API.

Ensuite, certaines routes peuvent avoir des limites spécifiques.

### 10.4 Limites personnalisées

Certaines règles nécessitent une logique métier.

Exemple :

POST /stats/sync doit limiter par userId + gameId, pas seulement par IP.

Pseudo-logique :

1. Lire userId depuis JWT.

2. Lire gameId depuis body.

3. Construire clé rate:stats:sync:user:{userId}:game:{gameId}.

4. Vérifier Redis.

5. Si limite atteinte, retourner 429 ou les dernières données.

6. Sinon, lancer la synchronisation.

## 11 Implémentation Socket.io recommandée

### 11.1 Limitation sendTeamMessage

Clé Redis possible :

rate:socket:sendMessage:user:{userId}:team:{teamId}

Règle :

- incrémenter à chaque message ;

- TTL 60 secondes ;

- si > 20, refuser l'événement.

Erreur socket :

{

"code": "RATE_LIMITED",

"message": "Vous envoyez des messages trop rapidement.",

"retryAfterSeconds": 30

}

### 11.2 Limitation typing

Clé :

rate:socket:typing:user:{userId}:team:{teamId}

Règle :

- ignorer les événements trop fréquents ;

- ne pas forcément retourner d'erreur visible.

### 11.3 Limitation joinTeamRoom

Objectif :

- éviter les tentatives répétées d'accès à des rooms privées.

Clé :

rate:socket:join:user:{userId}

## 12 Cas spécifiques Track'N Share

### 12.1 Synchronisation manuelle des stats

Règle :

Un utilisateur ne doit pas pouvoir spammer la synchronisation.

Comportement recommandé :

- si dernière sync < 5 minutes, retourner les stats actuelles avec message ;

- ne pas rappeler l'API externe ;

- afficher lastSyncAt.

Réponse possible :

{

"success": true,

"data": {

"stats": {},

"source": "CACHE",

"lastSyncAt": "2026-05-06T12:00:00.000Z"

},

"message": "Synchronisation récente, dernières données affichées."

}

### 12.2 API mockée

Même le MockProvider doit avoir une limite légère.

Pourquoi :

- éviter que les tests ou clics répétés déclenchent trop de recalculs ;

- garder une logique identique aux providers réels.

### 12.3 Leaderboards

Les endpoints GET de leaderboard peuvent être beaucoup appelés.

Recommandations :

- pagination ;

- cache Redis ;

- limite par IP ;

- éviter les recalculs à chaque GET.

### 12.4 Archivage trimestriel

L'archivage ne doit pas être déclenché plusieurs fois.

Règles :

- job idempotent ;

- lock Redis ou statut CLOSED/ARCHIVED ;

- route admin limitée ;

- vérification qu'un snapshot n'existe pas déjà.

## 13 Locks et anti-double action

### 13.1 Pourquoi utiliser un lock

Certaines actions ne doivent pas s'exécuter deux fois en parallèle.

Exemples :

- synchronisation stats ;

- archivage de saison ;

- recalcul leaderboard global ;

- seed de données.

### 13.2 Clés de lock possibles

lock:stats:sync:user:{userId}:game:{gameId}

lock:season:archive:{seasonId}

lock:leaderboard:recalculate:{gameId}:{seasonId}

lock:demo:seed

### 13.3 Comportement

Si un lock existe :

- ne pas relancer l'action ;

- retourner une réponse contrôlée ;

- indiquer qu'une opération est déjà en cours.

## 14 Sécurité

### 14.1 Ne pas révéler trop d'informations

Sur /auth/login, une erreur de rate limit ne doit pas confirmer qu'un email existe.

Message générique :

"Trop de tentatives. Veuillez réessayer plus tard."

### 14.2 Hash des emails dans les clés Redis

Éviter de stocker directement les emails dans les clés Redis.

Préférer :

rate:auth:login:emailHash:{hash}

### 14.3 IP et proxy

Si l'application est derrière un proxy ou reverse proxy, configurer correctement la récupération IP.

Sinon, toutes les requêtes peuvent sembler venir de la même adresse.

### 14.4 Protection des routes admin

Le rate limiting ne remplace pas les rôles et permissions.

Une route admin doit être :

- authentifiée ;

- protégée par rôle ;

- limitée ;

- journalisée si critique.

## 15 Monitoring et logs

### 15.1 Logs à produire

Logger :

- endpoint limité ;

- userId si disponible ;

- IP ;

- type de limite ;

- provider concerné ;

- retryAfter ;

- timestamp.

### 15.2 Logs à éviter

Ne pas logger :

- mots de passe ;

- tokens ;

- clés API ;

- emails en clair si évitable ;

- contenu complet de messages privés.

### 15.3 Indicateurs utiles

- nombre de 429 par endpoint ;

- nombre de 429 par IP ;

- nombre de sync bloquées ;

- nombre de messages chat bloqués ;

- nombre d'erreurs provider 429 ;

- temps moyen entre deux syncs ;

- taux d'utilisation du cache.

## 16 Tests à prévoir

### 16.1 Tests authentification

Tester :

- 5 mauvais logins autorisés ;

- 6e tentative retourne 429 ;

- attente du délai puis nouvelle tentative possible ;

- message d'erreur générique.

### 16.2 Tests synchronisation

Tester :

- première sync autorisée ;

- deuxième sync immédiate retourne cache ou 429 ;

- sync après délai autorisée ;

- ancienne donnée conservée si provider échoue.

### 16.3 Tests chat

Tester :

- 20 messages par minute autorisés ;

- message suivant refusé ;

- non-membre toujours refusé même sans limite atteinte ;

- typing events ignorés si trop fréquents.

### 16.4 Tests équipes

Tester :

- trop de tentatives de code invitation ;

- régénération code limitée ;

- spam invitation limité.

### 16.5 Tests admin

Tester :

- archivage manuel non répétable ;

- seed non déclenchable plusieurs fois ;

- recalcul leaderboard limité.

## 17 Tableau récapitulatif des limites MVP

| Zone | Clé de limitation | Limite recommandée | Priorité |

|---|---|---|---|

| Login | IP + email hashé | 5/min IP, 10/15min email | P0 |

| Register | IP | 3/heure | P0 |

| Forgot password | IP + email hashé | 3/heure | P1 |

| Stats sync | userId + gameId | 1 toutes les 2-5 min | P0 |

| Sync horaire | userId | 10/heure | P0 |

| Steam provider | global + userId | configurable | P1 |

| Epic provider | global + userId | configurable | P2 |

| Chat message | userId + teamId | 20/min | P0 |

| Chat burst | userId + teamId | 5/5s | P0 |

| Join team | userId + IP | 10/heure | P0 |

| Invite regen | teamId | 5/jour | P1 |

| Search | IP | 60/min | P1 |

| Demo seed | admin/env | 1/5min, désactivé prod | P0 |

| Archive season | seasonId | idempotent + lock | P1 |

## 18 Plan d'implémentation recommandé

Phase 1 — Limites globales API

- installer @nestjs/throttler ;

- ajouter une limite par défaut ;

- protéger login, register, stats sync.

Phase 2 — Limites métier

- limiter /stats/sync par userId + gameId ;

- limiter /teams/join ;

- limiter régénération de code ;

- ajouter messages d'erreur propres.

Phase 3 — Socket.io

- limiter sendTeamMessage ;

- limiter typing ;

- limiter joinTeamRoom.

Phase 4 — Redis

- déplacer les compteurs en Redis ;

- ajouter locks pour sync, archive et seed ;

- préparer le scaling.

Phase 5 — Providers externes

- limiter Steam globalement ;

- limiter Epic globalement ;

- ajouter cache provider ;

- intégrer le plan de secours APIs.

## 19 Critères d'acceptation

La gestion du rate limiting est considérée fonctionnelle si :

- POST /auth/login est limité ;

- POST /auth/register est limité ;

- POST /stats/sync ne peut pas être spammé ;

- les appels externes ne sont pas déclenchés en boucle ;

- les anciennes données sont utilisées si sync récente ;

- sendTeamMessage est limité ;

- un non-membre ne peut pas contourner les permissions via Socket.io ;

- les tentatives de code d'invitation sont limitées ;

- les routes admin critiques sont protégées et limitées ;

- les erreurs 429 sont claires ;

- le front affiche un message compréhensible ;

- Redis peut être utilisé pour les compteurs en évolution ;

- les secrets et données sensibles ne sont pas loggés.

## 20 Risques et solutions

### 20.1 Risque : limites trop strictes

Impact : utilisateur bloqué dans un usage normal.

Solution : ajuster les seuils, afficher retryAfter, garder un mode développement plus permissif.

### 20.2 Risque : limites trop faibles

Impact : spam, bruteforce ou dépassement de quotas externes.

Solution : limiter endpoints sensibles, monitorer les 429, ajouter Redis.

### 20.3 Risque : rate limiting seulement par IP

Impact : plusieurs utilisateurs derrière la même IP peuvent être bloqués.

Solution : combiner IP, userId, email hashé et ressource.

### 20.4 Risque : rate limiting contourné par Socket.io

Impact : spam chat malgré API protégée.

Solution : limiter aussi les événements Socket.io.

### 20.5 Risque : sync externe trop fréquente

Impact : blocage API Steam/Epic.

Solution : cache, limites par userId/gameId et provider global.

### 20.6 Risque : seed ou archivage déclenché plusieurs fois

Impact : données incohérentes.

Solution : locks, idempotence et permissions admin.

## 21 Conclusion

Le rate limiting est une protection essentielle pour Track'N Share.

Il doit sécuriser les zones sensibles : authentification, synchronisation des statistiques, APIs externes, chat, équipes, invitations, recherche, administration et mode démo.

Pour le MVP, l'approche recommandée est simple :

- limites globales via NestJS ;

- limites spécifiques sur login, register, stats sync et chat ;

- messages d'erreur propres ;

- cache des dernières données ;

- MockProvider pour la soutenance ;

- Redis en évolution pour une solution plus robuste.

Cette stratégie permet de protéger l'application tout en gardant une expérience utilisateur fluide et démontrable.
