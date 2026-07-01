# Note d'estimation de charge — Track'N Share

> **Livrable RNCP — BC01-6** « Estimer la charge de traitement / la puissance de calcul selon le nombre d'utilisateurs simultanés ».
> Date : 2026-07-01. Auteur : équipe Track'N Share.

## 1. Objectif

Estimer la capacité de l'API à absorber la charge en lecture sur le chemin
critique (leaderboard solo), vérifier la tenue en montée de connexions
concurrentes et dimensionner l'infrastructure pour la cible d'usage.

## 2. Méthodologie

- **Outil** : [autocannon](https://github.com/mcollina/autocannon) (HTTP benchmarking Node.js).
- **Script reproductible** : [`apps/api/perf/load-test.mjs`](../../../apps/api/perf/load-test.mjs) — `node apps/api/perf/load-test.mjs`.
- **Endpoint cible** : `GET /api/leaderboards/solo?limit=20` (public, représentatif : PostgreSQL + cache Redis 30 s + pagination cursor).
- **Environnement** : API NestJS (build de prod, `node dist/main.js`), PostgreSQL 16 + Redis 7 (conteneurs), machine de dev Windows 11.
- **Deux profils** mesurés :
  1. **Protégé** (config par défaut : rate limit 100 req/min/IP) — vérifie l'anti-abus.
  2. **Capacité brute** (`THROTTLE_LIMIT=1000000`) — mesure le débit réel du service.

## 3. Résultats mesurés

### 3.1 Capacité brute (limiteur relevé) — 50 connexions, 15 s

| Métrique | Valeur |
|----------|--------|
| Débit moyen | **≈ 1 970 req/s** (max ≈ 3 275 req/s) |
| Requêtes totales | 30 000 en 15,1 s (94,3 Mo lus) |
| Latence médiane (p50) | **20 ms** |
| Latence p97.5 | 56 ms |
| Latence p99 | 83 ms |
| Latence moyenne | 24,9 ms |
| Erreurs | 0 |

**Lecture** : le service tient ~2 000 req/s en lecture avec une latence p99 < 100 ms
sur une simple machine de dev, sans montée en charge horizontale. Le cache Redis
(TTL 30 s) absorbe la majorité des lectures répétées du leaderboard.

### 3.2 Profil protégé (rate limit 100 req/min) — 50 connexions, 15 s

| Métrique | Valeur |
|----------|--------|
| Réponses 200 servies | 100 (quota/minute) |
| Réponses 429 (rejetées) | ≈ 8 900 |

**Lecture** : le `ThrottlerGuard` global plafonne bien à 100 req/min/IP et rejette
l'excédent en `429 Too Many Requests` — **preuve du mécanisme anti-abus / anti-brute-force**
(BC01-8). Les endpoints sensibles `/auth/*` sont encore plus stricts (5–10/min).

## 4. Estimation pour la cible d'usage

Hypothèses de dimensionnement pour un contexte de soutenance / MVP :

| Paramètre | Hypothèse |
|-----------|-----------|
| Utilisateurs actifs simultanés visés | 200 |
| Requêtes/utilisateur/minute (navigation) | ~10 |
| Charge induite | ≈ 33 req/s |
| Capacité mesurée (1 instance) | ≈ 1 970 req/s |
| **Marge** | **~60×** la charge cible |

**Conclusion** : une **seule instance** API couvre très largement la cible (200
utilisateurs simultanés) avec une réserve de ~60×. Le facteur limitant n'est pas
le CPU applicatif mais la politique de rate limiting (volontaire) et, à plus
grande échelle, PostgreSQL.

## 5. Robustesse & pistes de montée en charge

- **Cache Redis** (TTL 30 s) déjà en place → réduit la pression BDD sur le leaderboard.
- **Index PG** `idx_leaderboard_query` + pagination cursor → requêtes bornées.
- Montée en charge horizontale possible : l'API est **stateless** (JWT), donc
  réplicable derrière un load-balancer ; Redis et PostgreSQL restent partagés.
- Prochaine étape si besoin : test d'endurance (soak test) + monitoring (p99 dans le temps).

## 6. Reproduire la mesure

```bash
# 1. Lancer l'infra + l'API
docker compose up -d

# 2. Capacité brute (limiteur relevé)
cd apps/api && pnpm build
PORT=3001 THROTTLE_LIMIT=1000000 node dist/main.js &
TARGET="http://localhost:3001/api/leaderboards/solo?limit=20" \
  CONNECTIONS=50 DURATION=15 node perf/load-test.mjs

# 3. Profil protégé (défaut 100/min) : viser directement le port 3000
node perf/load-test.mjs
```
