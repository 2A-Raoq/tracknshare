# Compte-rendu d'activité (CRA) — Track'N Share

> **Livrable RNCP — BC03-8** « Rendre compte de son travail (compte-rendu d'activité, taux de disponibilité) ».
> Période : 2026-05-09 → 2026-06-30. Date de rédaction : 2026-07-01.

## 1. Synthèse de l'activité

| Indicateur | Valeur |
|------------|--------|
| Période | 9 mai → 30 juin 2026 (~7,5 semaines) |
| Commits total | 47 |
| Répartition par type | 17 `feat`, 11 `chore`, 9 `fix`, 2 `docs`, 1 `test`, 1 `security`, 1 `perf` |
| Applications livrées | API (NestJS), Web (React/Vite), Mobile (Expo/React Native) |
| Tests automatisés | 76 (46 unit + 8 e2e + 22 front) |
| Sprints | 4 (Sprint 0 → Sprint 4) |

## 2. Activités par sprint (résumé)

| Sprint | Objectif principal | Livrables |
|--------|--------------------|-----------|
| 0 | Cadrage, stack, monorepo | pnpm + Turborepo, Docker (PG/Redis), docs IA |
| 1 | Authentification & fondations | JWT/bcrypt, guards, users, dashboard |
| 2 | Stats, score, leaderboard | MockProvider, score calculator, cache Redis, pagination cursor |
| 3 | Équipes & chat temps réel | Teams, Socket.io, chiffrement messages |
| 4 | Sécurité, RGPD, DevOps, mobile | Helmet, throttler, RGPD, CI/CD, tests e2e, app mobile native |

## 3. Taux de disponibilité

| Élément | Estimation |
|---------|------------|
| Disponibilité de l'environnement de dev | > 95 % (Docker local + CI GitHub Actions) |
| Disponibilité applicative visée (démo) | Healthchecks Docker (api/web/postgres/redis), endpoint `/api/health` (BDD + Redis) |
| Empêchements notables | Contournement bug BuildKit/pnpm sous Windows (`DOCKER_BUILDKIT=0`) documenté |

## 4. Faits marquants / décisions

- **Bascule PWA → application mobile native** (Expo/React Native) : l'évaluateur ayant refusé la PWA, une app native consommant l'API a été développée (18 écrans).
- **Renforcement de la démarche d'ingénierie** : ajout de tests réels (unit + e2e), pipeline CI/CD, conteneurisation complète, migrations versionnées.
- **Mise en conformité RGPD** : export, suppression de compte, consentement, page confidentialité.
- **Sécurité** : Helmet, rate limiting anti-brute-force, validation de configuration au démarrage.

## 5. Reste à faire (à la date du CRA)

- Exécuter et consigner l'audit RGAA (procédure prête — [audit-rgaa.md](audit-rgaa.md)).
- Signer les livrables formels (PV de réception, PAQ).
- Préparer la présentation orale (parcours de démo).

## 6. Répartition (co-développement)

- **Clément** : front web, application mobile native, accessibilité, UX.
- **Ioanes** : API NestJS, sécurité, base de données, DevOps/CI, intégration Steam.

_Note : chaque candidat présente individuellement les preuves des 4 blocs (dossier individuel)._
