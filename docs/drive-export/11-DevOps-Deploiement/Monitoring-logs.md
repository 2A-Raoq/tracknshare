# MONITORING ET LOGS

Projet Track'N Share

Version : 1.0

Date : 07/05/2026

Équipe projet : Ioanes et Clément

Objectif du document

Ce document décrit la stratégie de monitoring et de journalisation prévue pour Track'N Share.

Il a pour objectif de définir quelles informations doivent être surveillées, quels événements doivent être loggés, quels indicateurs sont utiles, quelles alertes prévoir et quelles données ne doivent jamais apparaître dans les logs.

Le monitoring et les logs doivent permettre de :

- comprendre l'état de santé de l'application ;

- détecter rapidement les erreurs ;

- diagnostiquer les problèmes de déploiement ;

- surveiller l'authentification ;

- surveiller les APIs externes ;

- détecter les abus ;

- vérifier le bon fonctionnement de PostgreSQL, Redis et Socket.io ;

- sécuriser la soutenance ;

- préparer une exploitation future du projet.

## 1 Vue d'ensemble

### 1.1 Définition du monitoring

Le monitoring consiste à surveiller en continu l'état de l'application et de ses composants.

Il permet de savoir si :

- le front-end répond ;

- le back-end répond ;

- PostgreSQL est disponible ;

- Redis est disponible ;

- Socket.io fonctionne ;

- les APIs externes répondent ;

- les erreurs augmentent ;

- les temps de réponse restent acceptables ;

- les utilisateurs rencontrent des problèmes.

### 1.2 Définition des logs

Les logs sont des traces écrites produites par les différents services.

Ils peuvent indiquer :

- une requête HTTP reçue ;

- une connexion utilisateur ;

- une erreur API ;

- une synchronisation de statistiques ;

- un message Socket.io ;

- une erreur PostgreSQL ;

- une erreur Redis ;

- un appel Steam/Epic échoué ;

- une action admin ;

- un rate limit atteint.

### 1.3 Objectif MVP

Pour le MVP, la stratégie doit rester simple mais utile :

- logs back-end lisibles ;

- logs Docker consultables ;

- endpoint /health ;

- logs d'erreurs contrôlés ;

- aucune fuite de secret ;

- suivi des erreurs 401, 403, 429 et 500 ;

- monitoring manuel pour la soutenance.

### 1.4 Objectif production future

Pour une version production, il faudra envisager :

- logs structurés JSON ;

- centralisation des logs ;

- monitoring applicatif ;

- alertes ;

- suivi des performances ;

- outil de reporting d'erreurs ;

- tableaux de bord ;

- rétention maîtrisée des logs.

## 2 Composants à surveiller

### 2.1 Front-end React/PWA

À surveiller :

- chargement de l'application ;

- erreurs JavaScript ;

- erreurs réseau ;

- échecs d'appel API ;

- état PWA offline ;

- comportement après logout ;

- erreurs Socket.io côté client.

Pour le MVP, le front peut principalement être surveillé via :

- console navigateur ;

- messages d'erreur UI ;

- tests manuels ;

- retours utilisateurs.

En production future, un outil de monitoring front-end comme Sentry ou équivalent pourrait être ajouté.

### 2.2 Back-end NestJS

À surveiller :

- démarrage de l'application ;

- configuration chargée ;

- connexion PostgreSQL ;

- connexion Redis ;

- routes REST ;

- guards d'authentification ;

- erreurs métier ;

- exceptions non gérées ;

- appels providers externes ;

- gateways Socket.io ;

- jobs planifiés ;

- migrations et seeders.

### 2.3 PostgreSQL

À surveiller :

- disponibilité ;

- connexion depuis le back-end ;

- erreurs de requêtes ;

- migrations ;

- saturation éventuelle ;

- temps de réponse des requêtes ;

- volume de données ;

- sauvegardes si production.

### 2.4 Redis

À surveiller :

- disponibilité ;

- connexion depuis le back-end ;

- erreurs de cache ;

- clés de rate limiting ;

- locks ;

- leaderboards rapides ;

- éventuelle utilisation mémoire ;

- présence en ligne si activée ;

- adapter Socket.io si activé.

### 2.5 Socket.io

À surveiller :

- connexions socket ;

- déconnexions ;

- erreurs d'authentification ;

- joinTeamRoom ;

- sendTeamMessage ;

- rate limiting chat ;

- tentatives d'accès non autorisées ;

- nombre de sockets connectés.

### 2.6 APIs externes

À surveiller :

- SteamProvider ;

- EpicProvider / EOS si activé ;

- MockProvider ;

- timeout ;

- rate limit externe ;

- réponse invalide ;

- fallback utilisé ;

- dernière synchronisation réussie.

### 2.7 Docker

À surveiller :

- état des conteneurs ;

- logs par service ;

- redémarrages inattendus ;

- ports occupés ;

- volumes ;

- healthchecks ;

- erreurs au build.

## 3 Niveaux de logs

### 3.1 DEBUG

Usage :

- développement uniquement ;

- diagnostic détaillé ;

- informations techniques non sensibles.

Exemples :

- provider utilisé ;

- paramètres non sensibles ;

- étape de traitement ;

- état d'un job.

Interdit :

- mots de passe ;

- tokens ;

- clés API ;

- secrets ;

- contenu complet de messages privés.

### 3.2 INFO

Usage :

- événements normaux importants ;

- état de l'application ;

- actions réussies.

Exemples :

- serveur démarré ;

- connexion base réussie ;

- utilisateur connecté ;

- statistiques synchronisées ;

- saison archivée ;

- seed terminé.

### 3.3 WARN

Usage :

- événement anormal mais non bloquant ;

- tentative refusée ;

- fallback utilisé ;

- limite atteinte.

Exemples :

- token expiré ;

- accès refusé ;

- provider externe indisponible ;

- rate limit atteint ;

- profil Steam privé ;

- Redis temporairement indisponible si fallback possible.

### 3.4 ERROR

Usage :

- erreur empêchant une action ;

- exception serveur ;

- échec critique ;

- service indisponible.

Exemples :

- erreur 500 ;

- échec connexion PostgreSQL ;

- migration échouée ;

- exception non gérée ;

- échec d'archivage ;

- corruption de données détectée.

## 4 Format recommandé des logs

### 4.1 Format MVP lisible

Pour le MVP, un format lisible suffit.

Exemple :

[INFO] 2026-05-07T10:00:00.000Z AuthService Login success userId=user_123

[WARN] 2026-05-07T10:01:00.000Z TeamGuard Forbidden userId=user_123 teamId=team_999

[ERROR] 2026-05-07T10:02:00.000Z StatsSyncService Provider unavailable provider=STEAM fallback=CACHE

### 4.2 Format production recommandé

En production future, préférer des logs structurés JSON.

Exemple :

{

"level": "warn",

"timestamp": "2026-05-07T10:01:00.000Z",

"service": "backend",

"module": "TeamGuard",

"event": "TEAM_ACCESS_FORBIDDEN",

"userId": "user_123",

"teamId": "team_999",

"requestId": "req_abc123"

}

### 4.3 Champs utiles

Champs recommandés :

- timestamp ;

- level ;

- service ;

- module ;

- event ;

- requestId ;

- userId si disponible ;

- statusCode ;

- method ;

- path ;

- durationMs ;

- provider ;

- fallbackUsed ;

- environment.

## 5 Données à ne jamais logger

### 5.1 Secrets interdits

Ne jamais logger :

- mot de passe ;

- passwordHash ;

- JWT ;

- refresh token ;

- cookie de session ;

- header Authorization ;

- JWT_SECRET ;

- DATABASE_URL complète ;

- REDIS_URL complète si mot de passe ;

- STEAM_WEB_API_KEY ;

- EPIC_CLIENT_SECRET ;

- SMTP_PASSWORD ;

- clé de chiffrement ;

- token de déploiement.

### 5.2 Données personnelles à limiter

À éviter ou minimiser :

- email en clair ;

- adresse IP si non nécessaire ;

- contenu complet des messages de chat ;

- biographie complète ;

- données externes brutes ;

- export complet de profil.

### 5.3 Redaction recommandée

Les valeurs sensibles doivent être masquées.

Exemples :

Authorization: [REDACTED]

JWT_SECRET: [REDACTED]

DATABASE_URL: postgresql://tracknshare:[REDACTED]@host/db

email: c***@example.com

## 6 Logs back-end recommandés

### 6.1 Démarrage de l'application

À logger :

- environnement ;

- port ;

- préfixe API ;

- Swagger activé ou non ;

- mode provider : mock, real ou hybrid ;

- DEMO_MODE activé ou non ;

- connexion PostgreSQL réussie ;

- connexion Redis réussie.

À ne pas logger :

- valeur du JWT_SECRET ;

- DATABASE_URL complète ;

- clés API externes.

### 6.2 Requêtes HTTP

À logger :

- méthode ;

- chemin ;

- status code ;

- durée ;

- requestId ;

- userId si authentifié.

Exemple :

[INFO] HTTP GET /api/stats/me 200 42ms userId=user_123 requestId=req_abc

### 6.3 Authentification

À logger :

- login réussi ;

- login échoué sans préciser si email existe ;

- logout ;

- token expiré ;

- refresh token invalide ;

- rate limit login.

À ne pas logger :

- mot de passe ;

- email complet si évitable ;

- token JWT.

Exemples d'événements :

- AUTH_LOGIN_SUCCESS ;

- AUTH_LOGIN_FAILED ;

- AUTH_TOKEN_EXPIRED ;

- AUTH_RATE_LIMITED ;

- AUTH_LOGOUT.

### 6.4 Autorisation

À logger :

- accès refusé 403 ;

- rôle insuffisant ;

- tentative d'accès à une ressource non propriétaire ;

- tentative d'accès à une équipe non membre ;

- route admin refusée.

Exemples d'événements :

- RESOURCE_OWNER_REQUIRED ;

- TEAM_MEMBER_REQUIRED ;

- TEAM_ROLE_REQUIRED ;

- ADMIN_REQUIRED.

### 6.5 Statistiques et synchronisation

À logger :

- début de sync ;

- fin de sync ;

- provider utilisé ;

- fallback utilisé ;

- mapping failed ;

- ancien cache utilisé ;

- score recalculé ;

- leaderboard mis à jour.

À ne pas logger :

- réponse brute complète Steam/Epic ;

- clé API ;

- données inutiles.

Exemples d'événements :

- STATS_SYNC_STARTED ;

- STATS_SYNC_SUCCESS ;

- STATS_SYNC_FAILED ;

- STATS_SYNC_FALLBACK_CACHE ;

- STATS_SYNC_FALLBACK_MOCK.

### 6.6 Équipes et invitations

À logger :

- création d'équipe ;

- jointure via code ;

- code invalide ;

- rate limit invitation ;

- promotion / rétrogradation ;

- exclusion membre ;

- suppression équipe.

Événements :

- TEAM_CREATED ;

- TEAM_JOIN_SUCCESS ;

- TEAM_JOIN_FAILED ;

- TEAM_INVITE_CODE_REGENERATED ;

- TEAM_MEMBER_PROMOTED ;

- TEAM_MEMBER_REMOVED ;

- TEAM_DELETED.

### 6.7 Chat

À logger :

- message envoyé avec métadonnées minimales ;

- message refusé ;

- tentative non-membre ;

- rate limit chat.

À ne pas logger :

- contenu complet du message ;

- conversation complète ;

- données privées inutiles.

Exemple :

[INFO] CHAT_MESSAGE_SENT userId=user_123 teamId=team_456 messageId=msg_789

### 6.8 Administration

À logger impérativement :

- action admin ;

- archivage manuel ;

- recalcul leaderboard global ;

- désactivation compte ;

- modification jeu ;

- exécution seed si autorisée.

Événements :

- ADMIN_ACTION ;

- SEASON_ARCHIVE_STARTED ;

- SEASON_ARCHIVE_SUCCESS ;

- LEADERBOARD_RECALCULATE_STARTED ;

- DEMO_SEED_EXECUTED.

## 7 Logs front-end recommandés

### 7.1 MVP

Pour le MVP, les logs front-end peuvent rester limités.

À surveiller :

- erreurs API visibles ;

- erreurs Socket.io ;

- erreurs de routing ;

- erreurs PWA ;

- session expirée ;

- échec de chargement dashboard.

### 7.2 Production future

En production future, prévoir éventuellement :

- outil d'erreur front comme Sentry ;

- capture des erreurs JavaScript ;

- suivi des erreurs réseau ;

- release version ;

- environnement ;

- breadcrumb sans données sensibles.

### 7.3 Données à ne pas envoyer

Ne jamais envoyer à un outil de monitoring front :

- JWT ;

- refresh token ;

- mot de passe ;

- email complet si non nécessaire ;

- contenu de chat ;

- clé API ;

- données sensibles.

## 8 Logs Docker

### 8.1 Commandes utiles

Tous les services :

docker compose logs -f

Back-end :

docker compose logs -f backend

Front-end :

docker compose logs -f frontend

PostgreSQL :

docker compose logs -f postgres

Redis :

docker compose logs -f redis

### 8.2 Événements Docker à surveiller

- conteneur qui redémarre en boucle ;

- erreur au build ;

- port déjà utilisé ;

- échec de connexion base ;

- erreur de volume ;

- dépendance non prête ;

- migration échouée.

### 8.3 Utilité soutenance

Pendant la soutenance, Docker logs permet de diagnostiquer rapidement :

- back-end non démarré ;

- front inaccessible ;

- base non prête ;

- Redis non disponible ;

- erreur CORS ;

- migration ou seed absent.

## 9 Monitoring PostgreSQL

### 9.1 Healthcheck

Endpoint recommandé côté API :

GET /health/database

Réponse possible :

{

"success": true,

"data": {

"database": "ok"

}

}

### 9.2 À surveiller

- connexion active ;

- erreurs de migration ;

- erreurs de requête ;

- lenteurs ;

- tables absentes ;

- erreurs d'unicité ;

- volume de données.

### 9.3 Logs utiles

- migration démarrée ;

- migration terminée ;

- migration échouée ;

- seed démarré ;

- seed terminé ;

- erreur de connexion.

## 10 Monitoring Redis

### 10.1 Healthcheck

Endpoint recommandé :

GET /health/redis

Réponse possible :

{

"success": true,

"data": {

"redis": "ok"

}

}

### 10.2 À surveiller

- connexion Redis ;

- erreurs de lecture/écriture ;

- rate limiting ;

- locks ;

- clés expirées ;

- utilisation mémoire ;

- indisponibilité temporaire.

### 10.3 Fallback Redis

Si Redis est indisponible :

- l'API doit continuer à fonctionner pour les fonctionnalités essentielles si possible ;

- certaines fonctionnalités peuvent être dégradées : rate limiting, cache, présence, locks ;

- l'erreur doit être loggée en WARN ou ERROR selon impact.

## 11 Monitoring Socket.io

### 11.1 Événements à suivre

- SOCKET_CONNECTED ;

- SOCKET_DISCONNECTED ;

- SOCKET_AUTH_FAILED ;

- SOCKET_JOIN_TEAM_ROOM ;

- SOCKET_JOIN_TEAM_ROOM_FORBIDDEN ;

- SOCKET_MESSAGE_SENT ;

- SOCKET_MESSAGE_RATE_LIMITED ;

- SOCKET_ERROR.

### 11.2 Métriques utiles

- nombre de sockets connectés ;

- nombre de rooms actives ;

- nombre de messages envoyés ;

- nombre de refus non-membres ;

- nombre de rate limits chat ;

- erreurs de broadcast.

### 11.3 Sécurité

Les logs Socket.io ne doivent pas contenir :

- token reçu au handshake ;

- contenu complet des messages ;

- données privées inutiles.

## 12 Monitoring APIs externes

### 12.1 Providers concernés

- SteamProvider ;

- EpicProvider / EOS ;

- MockProvider.

### 12.2 Événements à logger

- PROVIDER_REQUEST_STARTED ;

- PROVIDER_REQUEST_SUCCESS ;

- PROVIDER_REQUEST_FAILED ;

- PROVIDER_TIMEOUT ;

- PROVIDER_RATE_LIMITED ;

- PROVIDER_MAPPING_FAILED ;

- PROVIDER_FALLBACK_USED.

### 12.3 Métriques utiles

- taux de succès par provider ;

- nombre de timeouts ;

- temps moyen de réponse ;

- nombre de fallbacks ;

- nombre de profils privés ;

- nombre de mappings impossibles ;

- dernière synchronisation réussie.

### 12.4 Règle importante

Ne jamais logger :

- clé Steam ;

- secret Epic ;

- tokens externes ;

- réponse brute complète si elle contient trop de données.

## 13 Healthchecks

### 13.1 Endpoint global

Endpoint recommandé :

GET /health

Réponse possible :

{

"success": true,

"data": {

"status": "ok",

"timestamp": "2026-05-07T10:00:00.000Z",

"environment": "development"

}

}

### 13.2 Endpoint détaillé

Endpoint recommandé :

GET /health/full

Réponse possible :

{

"success": true,

"data": {

"api": "ok",

"database": "ok",

"redis": "ok",

"providers": {

"mock": "ok",

"steam": "disabled",

"epic": "disabled"

}

}

}

### 13.3 Sécurité des healthchecks

En production :

- /health peut être public avec informations limitées ;

- /health/full peut être protégé ou réservé admin ;

- ne jamais exposer les secrets ;

- ne pas afficher les URLs complètes avec mots de passe.

## 14 Alertes recommandées

### 14.1 Alertes P0

Alertes critiques :

- API indisponible ;

- PostgreSQL indisponible ;

- trop d'erreurs 500 ;

- route admin appelée de manière suspecte ;

- fuite de secret détectée ;

- accès chat non autorisé répété ;

- migrations échouées ;

- archivage de saison échoué.

### 14.2 Alertes P1

Alertes importantes :

- Redis indisponible ;

- nombreux 401 ;

- nombreux 403 ;

- nombreux 429 ;

- provider Steam indisponible ;

- provider Epic indisponible ;

- fallback mock utilisé trop souvent ;

- latence API élevée.

### 14.3 Alertes P2

Alertes évolution :

- forte croissance du nombre de messages ;

- croissance stockage ;

- cache peu efficace ;

- statistiques de synchronisation trop lentes ;

- trop de profils privés externes.

## 15 Métriques à suivre

### 15.1 Métriques API

- nombre de requêtes ;

- taux d'erreur ;

- temps moyen de réponse ;

- endpoints les plus appelés ;

- nombre de 401 ;

- nombre de 403 ;

- nombre de 429 ;

- nombre de 500.

### 15.2 Métriques utilisateurs

- connexions réussies ;

- connexions échouées ;

- inscriptions ;

- utilisateurs actifs ;

- utilisateurs déconnectés ;

- comptes supprimés ou anonymisés.

### 15.3 Métriques statistiques

- synchronisations réussies ;

- synchronisations échouées ;

- provider utilisé ;

- fallback utilisé ;

- scores recalculés ;

- leaderboards mis à jour ;

- temps moyen de sync.

### 15.4 Métriques équipes et chat

- équipes créées ;

- membres ajoutés ;

- tentatives de code invitation ;

- messages envoyés ;

- messages refusés ;

- connexions Socket.io ;

- rooms actives.

### 15.5 Métriques infrastructure

- état des conteneurs ;

- redémarrages ;

- CPU ;

- mémoire ;

- stockage ;

- utilisation PostgreSQL ;

- utilisation Redis.

## 16 Outils recommandés

### 16.1 MVP

Outils suffisants pour MVP :

- logs NestJS ;

- docker compose logs ;

- console navigateur ;

- endpoints /health ;

- Swagger ;

- tests manuels ;

- logs PostgreSQL / Redis via Docker.

### 16.2 Production future

Outils possibles :

- Sentry pour erreurs front/back ;

- Grafana + Prometheus pour métriques ;

- Loki ou ELK pour logs centralisés ;

- outil hébergeur pour métriques ;

- alerting email ou Discord/Slack si équipe.

### 16.3 Recommandation projet

Pour la soutenance, ne pas surcharger l'architecture.

Un monitoring simple et clair est préférable :

- endpoint health ;

- logs bien structurés ;

- absence de secrets ;

- scénarios de diagnostic documentés.

## 17 Rétention des logs

### 17.1 Principe

Les logs ne doivent pas être conservés indéfiniment.

### 17.2 Recommandations

Développement :

- conservation locale courte ;

- suppression possible à tout moment.

Soutenance :

- logs temporaires ;

- pas de données sensibles ;

- conservation non nécessaire après présentation.

Production future :

- logs applicatifs : 1 à 3 mois selon besoin ;

- logs sécurité : 3 à 12 mois selon politique ;

- logs très détaillés : durée courte ;

- suppression ou anonymisation si nécessaire.

### 17.3 RGPD

Les logs peuvent contenir des données personnelles indirectes.

Il faut donc :

- minimiser les données ;

- éviter les emails en clair ;

- limiter les IP si non nécessaires ;

- documenter la durée de conservation ;

- protéger l'accès aux logs.

## 18 Gestion des erreurs

### 18.1 Erreurs utilisateur

Les erreurs destinées à l'utilisateur doivent être claires.

Exemples :

- "Votre session a expiré." ;

- "Vous n'avez pas accès à cette équipe." ;

- "Trop de requêtes, réessayez plus tard." ;

- "La synchronisation est temporairement indisponible."

### 18.2 Erreurs techniques

Les erreurs techniques détaillées doivent rester côté serveur.

Exemples à ne pas montrer au client :

- stack trace ;

- requête SQL complète ;

- chemins serveur ;

- variables d'environnement ;

- clés API.

### 18.3 Format d'erreur API

Format recommandé :

{

"success": false,

"error": {

"code": "PROVIDER_UNAVAILABLE",

"message": "La synchronisation est temporairement indisponible.",

"requestId": "req_abc123"

}

}

Le requestId permet de retrouver le log serveur correspondant.

## 19 Request ID et corrélation

### 19.1 Objectif

Un requestId permet de relier :

- une erreur affichée côté front ;

- un log back-end ;

- un appel provider ;

- une requête base de données.

### 19.2 Recommandation

Pour chaque requête HTTP :

- générer un requestId ;

- le mettre dans les logs ;

- le retourner dans les réponses d'erreur ;

- le transmettre éventuellement aux appels internes.

### 19.3 Exemple

Client reçoit :

requestId=req_abc123

Log serveur :

[ERROR] requestId=req_abc123 StatsSyncService provider=STEAM error=TIMEOUT fallback=CACHE

## 20 Monitoring sécurité

### 20.1 Événements sécurité à suivre

- AUTH_LOGIN_FAILED ;

- AUTH_RATE_LIMITED ;

- AUTH_TOKEN_INVALID ;

- AUTH_TOKEN_EXPIRED ;

- ADMIN_REQUIRED ;

- TEAM_MEMBER_REQUIRED ;

- RESOURCE_OWNER_REQUIRED ;

- CHAT_NOT_TEAM_MEMBER ;

- RATE_LIMITED ;

- SECRET_EXPOSURE_DETECTED si outil disponible.

### 20.2 Signaux d'abus

- beaucoup de login échoués ;

- beaucoup de codes invitation invalides ;

- beaucoup de messages refusés ;

- nombreuses erreurs 403 ;

- nombreuses tentatives de joinTeamRoom non autorisées ;

- pics de synchronisation stats.

### 20.3 Réponses possibles

- renforcer rate limiting ;

- bloquer temporairement ;

- inspecter les logs ;

- vérifier les permissions ;

- corriger une faille ;

- faire une rotation de secrets si nécessaire.

## 21 Monitoring du mode démo

### 21.1 Objectif

Le mode démo doit être stable pendant la soutenance.

À surveiller :

- seed exécuté ;

- compte démo disponible ;

- dashboard chargé ;

- leaderboard rempli ;

- équipe disponible ;

- chat opérationnel ;

- MockProvider activé ;

- Steam/Epic désactivés.

### 21.2 Logs utiles

- DEMO_MODE_ENABLED ;

- DEMO_SEED_STARTED ;

- DEMO_SEED_SUCCESS ;

- MOCK_PROVIDER_ENABLED ;

- DEMO_ACCOUNT_READY.

### 21.3 Avant la soutenance

Vérifier :

- docker compose ps ;

- docker compose logs backend ;

- /health ;

- login compte démo ;

- chat d'équipe ;

- Swagger si prévu.

## 22 Procédure de diagnostic rapide

### 22.1 L'application ne démarre pas

Vérifier :

- docker compose ps ;

- docker compose logs backend ;

- variables d'environnement ;

- DATABASE_URL ;

- REDIS_URL ;

- port déjà utilisé.

### 22.2 Le front ne charge pas les données

Vérifier :

- console navigateur ;

- VITE_API_BASE_URL ;

- CORS ;

- backend disponible ;

- token expiré ;

- logs backend.

### 22.3 La base ne répond pas

Vérifier :

- docker compose logs postgres ;

- healthcheck ;

- DATABASE_URL ;

- migrations ;

- volume PostgreSQL.

### 22.4 Le chat ne fonctionne pas

Vérifier :

- VITE_SOCKET_URL ;

- logs Socket.io ;

- token JWT ;

- appartenance équipe ;

- CORS Socket.io ;

- rate limiting.

### 22.5 Les stats ne se synchronisent pas

Vérifier :

- EXTERNAL_API_MODE ;

- MockProvider activé ;

- provider Steam/Epic désactivé ou configuré ;

- logs StatsSyncService ;

- rate limit ;

- cache ou fallback.

## 23 Checklist monitoring MVP

- Endpoint /health disponible.

- Logs back-end lisibles.

- Logs Docker consultables.

- Connexion PostgreSQL loggée au démarrage.

- Connexion Redis loggée au démarrage.

- Login success / failed loggés sans mot de passe.

- 401 / 403 / 429 / 500 suivis.

- Sync stats loggée avec provider et fallback.

- Erreurs APIs externes loggées sans secrets.

- Chat Socket.io loggé sans contenu complet.

- Actions admin loggées.

- Aucun JWT dans les logs.

- Aucune clé API dans les logs.

- Aucun passwordHash dans les logs.

- RequestId prévu ou recommandé.

- Procédure de diagnostic rapide documentée.

## 24 Checklist production future

- Logs structurés JSON.

- Centralisation des logs.

- Monitoring erreurs front/back.

- Alertes sur API down.

- Alertes sur DB down.

- Alertes sur hausse des 500.

- Alertes sur hausse des 403/429.

- Dashboard métriques API.

- Dashboard métriques Redis/PostgreSQL.

- Rétention des logs définie.

- Accès aux logs restreint.

- Données personnelles minimisées.

- Secret redaction automatique.

- Sauvegardes surveillées.

## 25 Risques et solutions

### 25.1 Risque : logs contenant des secrets

Impact : fuite de tokens, clés API ou accès base.

Solution : redaction automatique, règles de logging, revue des logs.

### 25.2 Risque : absence de logs en cas d'incident

Impact : diagnostic difficile.

Solution : logger les événements critiques et requestId.

### 25.3 Risque : logs trop verbeux

Impact : bruit, coût, fuite de données.

Solution : adapter LOG_LEVEL selon environnement.

### 25.4 Risque : monitoring absent pendant la soutenance

Impact : impossible de diagnostiquer rapidement.

Solution : Docker logs, /health, procédure de diagnostic.

### 25.5 Risque : erreurs API externe invisibles

Impact : synchronisation incompréhensible.

Solution : logs provider, fallbackUsed, message utilisateur clair.

### 25.6 Risque : conservation excessive des logs

Impact : risque RGPD.

Solution : durée de rétention définie et minimisation.

## 26 Plan d'implémentation recommandé

Phase 1 — MVP

- logs NestJS simples ;

- niveaux debug/info/warn/error ;

- logs d'authentification ;

- logs de guards ;

- logs stats sync ;

- logs Socket.io essentiels ;

- endpoint /health ;

- Docker logs documentés.

Phase 2 — Qualité

- requestId ;

- logs structurés ;

- redaction automatique ;

- endpoints /health/database et /health/redis ;

- meilleure gestion des erreurs.

Phase 3 — Production future

- monitoring front ;

- monitoring back ;

- alertes ;

- centralisation ;

- dashboards ;

- rétention configurable ;

- alertes sécurité.

## 27 Critères d'acceptation

Le monitoring et les logs sont considérés prêts pour le MVP si :

- les logs permettent de comprendre le démarrage de l'application ;

- les erreurs critiques sont visibles ;

- les appels API sont traçables ;

- les erreurs 401, 403, 429 et 500 sont identifiables ;

- les synchronisations stats sont loggées ;

- les providers externes sont surveillés ;

- Socket.io logge les événements critiques ;

- Docker permet de consulter les logs par service ;

- /health indique l'état de l'API ;

- aucun secret n'apparaît dans les logs ;

- une procédure de diagnostic est documentée ;

- le mode démo peut être vérifié avant soutenance.

## 28 Conclusion

Le monitoring et les logs sont indispensables pour exploiter correctement Track'N Share.

Pour le MVP, une stratégie simple suffit : logs lisibles, Docker logs, endpoint /health, suivi des erreurs principales, surveillance de PostgreSQL, Redis, Socket.io et providers externes.

Le point le plus important est de produire des logs utiles sans jamais exposer de secrets ou de données sensibles.

Pour une production future, il faudra renforcer cette base avec des logs structurés, un outil de centralisation, des métriques, des alertes et une politique de rétention claire.
