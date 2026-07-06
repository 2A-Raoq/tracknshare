# Matrice des risques — Track'N Share & chaîne maintenance Roofline

> **Livrable C1.8** (« identifier les risques et leur niveau de criticité »).
> Criticité = Probabilité × Impact (échelle 1-3). À insérer telle quelle dans le
> dossier (tableau + 3 lignes de commentaire par risque traité).

| # | Risque identifié | Projet | Prob. | Impact | Criticité | Mesure mise en œuvre (preuve) |
|---|------------------|--------|-------|--------|-----------|-------------------------------|
| R1 | Fuite de données privées via le cache du service worker PWA (poste partagé : l'utilisateur suivant lit les réponses authentifiées cachées) | TNS | 2 | 3 | **6 — élevée** | **Traité** : allowlist de cache limitée au leaderboard public, purge `caches.delete` au logout, `Cache-Control: no-store` côté API (`vite.config.ts`, `clearSession()`) |
| R2 | Accès aux messages par un non-membre (équipe ou conversation) | TNS | 2 | 3 | **6 — élevée** | **Traité** : guards serveur (`TeamMemberGuard`, `ConversationParticipantGuard`) + revérification d'adhésion à chaque join/send socket + test e2e dédié |
| R3 | Vol de la base = lecture des messages privés | TNS | 1 | 3 | **3 — moyenne** | **Traité** : chiffrement AES-256-GCM au repos, clé hors BDD (env), `passwordHash` en `select:false`. Limite assumée : pas de bout en bout |
| R4 | Brute force / flood (login, chat) | TNS | 2 | 2 | **4 — moyenne** | **Traité** : `@nestjs/throttler` renforcé sur /auth + rate limiting socket (10 msg/10 s) + helmet |
| R5 | SSRF via l'URL de webhook configurable du plugin (protection WP désactivée pour autoriser les IP locales en dev) | Roofline | 1 | 2 | **2 — faible** | **Accepté & tracé** (commit « fix URL validation for local IPs ») : URL saisie par admin uniquement, flux authentifié par token. À réactiver en production — décision documentée |
| R6 | Corruption/altération du rapport CSV entre plugin et dashboard | Roofline | 1 | 2 | **2 — faible** | **Traité** : hash SHA-256 transmis avec le CSV et vérifié en `hash_equals` à la réception ; plafond 2 Mo |
| R7 | Expiration silencieuse du token Google → rapports GSC vides | Roofline | 2 | 2 | **4 — moyenne** | **Traité** : refresh token automatique + monitoring des crons + alerting en cas d'échec |
| R8 | Déploiement écrasant les données de prod (rsync) | Roofline | 1 | 3 | **3 — moyenne** | **Traité** : exclusions rsync (`.env`, base SQLite, storage des rapports) — correctif né d'un incident réel (commit `4ad9277`) |

**Risques résiduels assumés** : pas de refresh token JWT côté TNS (reconnexion à
l'expiration), secrets Roofline en clair dans `.env` serveur (hors dépôt, accès
SSH restreint), CI Roofline sans exécution des tests avant déploiement (axe
d'amélioration identifié).
