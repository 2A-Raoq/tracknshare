# Checklist de démo & de mise en exploitation — Track'N Share

> **Livrable RNCP — BC02-9 / BC02-11 (démo & intégrabilité)**.
> Date : 2026-07-01. Support de la présentation orale (20 min).

## 1. Comptes de démonstration (source de vérité : `seed.ts`)

| Email | Mot de passe | Pseudo | Usage |
|-------|--------------|--------|-------|
| `demo@tracknshare.local` | `Demo1234!` | DemoPlayer | Compte principal |
| `friendtest@tracknshare.local` | `Demo1234!` | FriendTester | Test amis |
| `searchtest@tracknshare.local` | `Demo1234!` | SearchTester | Test recherche |

Code d'invitation équipe démo : `DEMO0001`.

> ✅ **Cohérence vérifiée (2026-07-01)** : seed ↔ README ↔ recette utilisent bien
> `Demo1234!` (la recette mentionnait à tort `DemoPassword123!`, corrigé).

## 2. Préparation (avant la soutenance)

- [ ] `docker compose up -d --build` (sous Windows, builder les images avec `DOCKER_BUILDKIT=0` — cf. entête `docker-compose.yml`).
- [ ] `docker compose ps` → 4 conteneurs *healthy* (api, web, postgres, redis).
- [ ] Seed exécuté (`pnpm --filter api seed`) → 14 users, 3 jeux, équipe, messages.
- [ ] Vérifier `GET http://localhost:3000/api/health` → `200` (BDD + Redis OK).
- [ ] App mobile : `pnpm --filter mobile start` (Expo) sur émulateur / téléphone, API atteignable.
- [ ] Swagger accessible : `http://localhost:3000/docs`.

## 3. Parcours de démo (ordre conseillé)

1. [ ] Lancer le projet (Docker) — montrer les conteneurs *healthy*.
2. [ ] Se connecter : `demo@tracknshare.local` / `Demo1234!`.
3. [ ] Dashboard joueur (sync + stats + badges).
4. [ ] Stats mockées multi-jeux.
5. [ ] Score (formule `KD×50 + WR×40 + matches×0.5`, calculé côté back).
6. [ ] Leaderboard solo (tri, pagination).
7. [ ] Ouvrir une équipe (code `DEMO0001`).
8. [ ] Chat d'équipe en temps réel (Socket.io).
9. [ ] **Application mobile native** : mêmes fonctionnalités sur l'API.
10. [ ] Swagger (contrat d'API).
11. [ ] Sécurité & RGPD : Helmet, rate limiting, export/suppression de compte.

## 4. Points techniques à mettre en avant (oral)

- [ ] Architecture en couches NestJS + monorepo (web + mobile + api).
- [ ] Tests automatisés (76) + CI/CD GitHub Actions bloquante.
- [ ] Sécurité (JWT, bcrypt, guards, Helmet, throttler, chiffrement AES-256-GCM).
- [ ] RGPD (export, suppression, consentement, page confidentialité).
- [ ] Conteneurisation multi-tiers + migrations versionnées.
- [ ] Performance (cache Redis, index PG, pagination cursor — voir [estimation-charge.md](estimation-charge.md)).

## 5. Plan de repli (si problème en direct)

- [ ] Captures d'écran des parcours clés préparées.
- [ ] Environnement local (hors Docker) prêt : `pnpm --filter api dev` + `pnpm --filter web dev`.
- [ ] Vidéo courte de l'app mobile en fonctionnement.
