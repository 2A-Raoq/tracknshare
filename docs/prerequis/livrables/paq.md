# Plan d'Assurance Qualité (PAQ) — Track'N Share

> **Livrable RNCP — BC01-2 / BC02** « Respecter les normes qualité pour l'architecture / gouvernance ».
> Date : 2026-07-01.

## 1. Objet

Ce PAQ décrit les dispositions prises pour garantir la qualité du logiciel
Track'N Share tout au long du cycle de développement (MVP étudiant, 2 développeurs).

## 2. Organisation

| Rôle | Titulaire | Responsabilités |
|------|-----------|-----------------|
| Front / PWA / Mobile | Clément | UI web, application mobile native, accessibilité |
| Back-end / DevOps / BDD | Ioanes | API NestJS, sécurité, base de données, CI/CD |

Méthodologie : **Agile / Scrum** léger — 4 sprints documentés
(`docs/drive-export/13-Sprints-Milestones/`), backlog priorisé P0/P1/P2.

## 3. Normes et conventions

- **Code** : TypeScript, conventions `docs/drive-export/12-Standards-Developpement/Conventions-code.md`.
- **Architecture** : NestJS en couches (controllers → services → repositories), un module par domaine.
- **Commits** : convention `type(scope): message` (feat, fix, chore…).
- **Revue** : Pull Requests + `CONTRIBUTING.md`, `Definition-of-Done.md`.

## 4. Gestion de configuration

- Monorepo pnpm + Turborepo, dépôt Git (branche `main` protégée, branches de feature).
- Secrets hors dépôt (`.gitignore`, `.env.example` sans valeurs).
- Base de données pilotée par **migrations versionnées** (TypeORM).

## 5. Contrôle qualité

| Contrôle | Outil | Fréquence |
|----------|-------|-----------|
| Analyse statique | ESLint + TypeScript strict | À chaque commit / CI |
| Tests unitaires | Jest / Vitest (76 tests) | À chaque push (CI bloquante) |
| Tests e2e | Jest + supertest | À chaque push (CI bloquante) |
| Build | `nest build` / `vite build` | CI bloquante |
| Revue de code | Pull Request | À chaque fusion |

Pipeline : `.github/workflows/ci.yml` (lint + build + tests).

## 6. Sécurité qualité

- Hash bcrypt, JWT + guards, validation DTO (whitelist/transform).
- Helmet (headers HTTP), rate limiting (`@nestjs/throttler`).
- Chiffrement AES-256-GCM des messages, validation de la config au démarrage (fail-fast).
- Conformité RGPD (export, suppression, consentement).

## 7. Gestion des anomalies

- Suivi via Git (commits `fix:`) et issues.
- Critère de sortie : aucun test rouge, aucun défaut critique connu sur les parcours P0.

## 8. Livrables qualité associés

- [Plan de tests](plan-de-tests.md), [Estimation de charge](estimation-charge.md),
  [Audit RGAA](audit-rgaa.md), [PV de réception](pv-reception.md),
  [Compte-rendu d'activité](compte-rendu-activite.md), [Volet RSE](rse-ecoresponsabilite.md).
