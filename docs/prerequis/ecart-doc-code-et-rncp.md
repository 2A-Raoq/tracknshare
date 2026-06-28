# Écart Documentation ↔ Code ↔ RNCP — Track'N Share

> Analyse en 2 temps demandée :
> 1. **Partie A** — Ce qui est fait vs ce qui reste à faire (écart entre la doc `drive-export` et le code réel).
> 2. **Partie B** — Croisement de « ce qui reste » avec les exigences de validation du **titre RNCP CDAN (36462/36463)**.
>
> Basé sur un re-scan complet du code (`apps/api`, `apps/web`, infra) confronté aux ~55 fichiers `.md` de `docs/drive-export/` et aux 3 PDF du référentiel (`docs/prerequis/`).
> Date : 2026-06-26. Légende : ✅ fait · 🟡 partiel · 🔴 absent.

---

## ⚠️ Correctifs par rapport à la première cartographie

Le scan approfondi a invalidé 3 points qui paraissaient acquis :

| Point | Croyance initiale | Réalité vérifiée |
|-------|-------------------|------------------|
| **Tests back-end** | « tests Jest présents » 🟡 | ✅ **Résolu (2026-06-28)** : 31 tests unitaires réels (score calculator, guards d'équipe, `AuthService`, `UsersService`) verts. Restent les tests front + e2e. |
| **CI/CD** | doc présente | ✅ **Résolu (2026-06-28)** : pipeline `.github/workflows/ci.yml` (install → lint → build api+web → tests api). Build+tests bloquants. |
| **Conteneurisation** | docker-compose présent | ✅ **Résolu + vérifié end-to-end (2026-06-28)** : images api/web build OK, stack lancé, 4 conteneurs *healthy*, parcours register→login testé (201/200) via PostgreSQL+Redis. Note Windows : builder les images avec `DOCKER_BUILDKIT=0` (bug BuildKit/chemins longs pnpm), cf. entête `docker-compose.yml`. |

---

# PARTIE A — Fait vs Reste à faire (doc ↔ code)

## A.1 — Fonctionnel (MVP P0 prévu vs livré)

| Fonctionnalité MVP documentée | Statut | Constat |
|-------------------------------|--------|---------|
| Authentification (register/login JWT, guards) | ✅ | Complet, bcrypt + `select:false`, compte démo seedé |
| Dashboard joueur | ✅ | `DashboardPage.tsx` (sync + stats + badges) |
| Stats mockées + score (back) | ✅ | Formule exacte `KD×50 + WR×40 + matches×0.5` (`score.calculator.ts`) |
| Leaderboard solo | ✅ | Tri + pagination cursor + cache Redis |
| Équipes (créer/rejoindre/voir) | ✅ | create/join/detail + code d'invitation |
| Chat d'équipe temps réel | ✅ | Socket.io authentifié + fallback REST + chiffrement |
| Données de démo / seed | ✅ | 14 users, 3 jeux, équipe, messages chiffrés, achievements |
| **Modifier son profil** (`PATCH /users/me`) | ✅ | **2026-06-28** : endpoint (contrôle d'unicité du pseudo) + `ProfilePage` éditable. Tests. |
| **Quitter une équipe** | ✅ | **2026-06-28** : `DELETE /teams/:id/leave` (promotion auto du plus ancien ou dissolution) + bouton front. 4 tests. |
| **Stats d'équipe** (moyennes, meilleur joueur) | ✅ | **2026-06-28** : `getTeam` renvoie memberCount / averageScore / bestPlayer (agrégation SQL) + cartes front. |
| **Règle des 10 parties min.** (éligibilité leaderboard) | 🔴 | `leaderboards.service.ts` ne filtre pas `matchesPlayed >= 10` |
| **Filtres leaderboard** (jeu / saison) | 🟡 | Back prêt, front sans sélecteur |
| **Saisons** (module, `/seasons`, archives) | 🔴 | Entité seule ; pas de module/controller |
| **Leaderboard d'équipe** | 🔴 | Pas d'endpoint `/leaderboards/teams` |
| **Liste des jeux** (`/games`, GamesModule) | 🔴 | Entité seule, pas d'API |
| **Endpoint santé** `/health` | ✅ | **2026-06-28** : `GET /api/health` (HealthModule) vérifie BDD + Redis, `@SkipThrottle`. Healthcheck Docker pointé dessus. 3 tests. |
| **PWA installable** | 🔴 | `vite-plugin-pwa` installé mais non configuré ; pas de manifest/SW |
| Gestion d'équipe avancée (promote, exclude, update, delete) | 🔴 | Aucun endpoint ; `TeamRoleGuard` codé mais **jamais branché** |

**Bonus livrés (hors scope MVP)** : messagerie privée + emoji picker, amis, profils publics, achievements, intégration Steam, chiffrement AES-256-GCM. → utiles pour le dossier, mais développés alors que des P0 manquent.

## A.2 — Architecture, BDD & modèle de données

| Élément documenté | Statut | Constat |
|-------------------|--------|---------|
| Archi en couches NestJS, module par domaine | ✅ | 16 modules, controllers fins / services métier |
| Modèle de données (entités, relations) | ✅ | 15 entités TypeORM, contraintes d'unicité, FK CASCADE |
| Formule de score centralisée | ✅ | `score.calculator.ts` (constantes en dur, à nommer) |
| **Archivage trimestriel des saisons** | 🔴 | **Non codé du tout** : pas de `@nestjs/schedule`, pas de cron, pas de tables d'archive/snapshot, pas de transitions de statut. C'est l'écart le plus lourd vs la doc. |
| **Tables du modèle UML** (TeamSeasonStats, Notification, LeaderboardSnapshot[+Entry], Profile) | 🔴 | Absentes du code |
| **Index PG documentés** (15 « P0 ») | 🟡 | ~3/15 réellement conformes ; aucun index sur les tables de messages ; `idx_leaderboard_query` sans `DESC` ni filtre partiel |
| **Migrations versionnées** | 🔴 | `synchronize: true`, aucun dossier `migrations/` |

## A.3 — API & intégrations externes

| Élément documenté | Statut | Constat |
|-------------------|--------|---------|
| Endpoints REST (~90 documentés) | 🟡 | ~25 implémentés ; manquent games, seasons, score, health, demo, leaderboards/teams, team stats/members, profile edit |
| Swagger | 🟡 | Monté sur `/docs` (doc disait `/api/docs`), peu de décorateurs `@ApiOperation/@ApiResponse` |
| Socket.io | 🟡 | Fonctionnel mais noms d'événements ≠ doc, pas d'ack/tempId, namespace racine au lieu de `/chat` |
| Steam | 🟡 | Provider réel **mais génère des stats pseudo-aléatoires déterministes** (pas de vraies stats Steam) ; pas de ResolveVanityURL ; pas de fallback « conserver anciennes données » |
| Epic / EOS | 🔴 | Totalement absent (cohérent P2) |
| Mock déterministe (seed) | 🔴 | Utilise `Math.random()`, non déterministe |
| **Rate limiting** (doc dédiée complète) | ✅ | **@nestjs/throttler (2026-06-28)** : global 100/min + renforcé sur /auth |

## A.4 — Sécurité & RGPD

| Mesure documentée | Statut | Constat |
|-------------------|--------|---------|
| Hash bcrypt + JWT + guards | ✅ | Solide |
| Chiffrement messages AES-256-GCM | ✅ | Réel (chat + privé) |
| Validation DTO (ValidationPipe) | ✅ | whitelist+transform (`forbidNonWhitelisted` off) |
| Secrets en `.env` non commités | ✅ | `.gitignore` correct, `.env.example` sans valeurs |
| **Helmet** | ✅ | **Branché (2026-06-28)** dans `main.ts` (`app.use(helmet())`, CSP off pour Swagger). En-têtes vérifiés : X-Frame-Options, HSTS, nosniff… |
| **Rate limiting / anti-brute-force** | ✅ | **@nestjs/throttler (2026-06-28)** : 100 req/min global + 10/min sur login, 5/min sur register. 429 vérifié. |
| **Validation config au démarrage** | ✅ | **`config/env.validation.ts` (2026-06-28)** : rejette JWT_SECRET vide/court et MESSAGE_ENCRYPTION_KEY ≠ 32 octets (fail-fast). 5 tests. |
| **RGPD — droit à l'oubli** (suppression compte) | ✅ | **`DELETE /users/me` (2026-06-28)** : transaction purgeant toutes les données liées. 204 → relogin 401 vérifié. |
| **RGPD — export de données** | ✅ | **`GET /users/me/export` (2026-06-28)** : profil + stats + équipes + comptes de jeu + succès en JSON. |
| **RGPD — consentement / page confidentialité** | ✅ | **Front (2026-06-28)** : bandeau de consentement (`ConsentBanner`, choix mémorisé) + page `/privacy` (synthèse art. 13 RGPD) avec boutons export/suppression branchés sur l'API. 3 tests. |
| Logs structurés + redaction | 🔴 | Aucun logger structuré |

## A.5 — Tests, DevOps, déploiement

| Élément documenté | Statut | Constat |
|-------------------|--------|---------|
| Tests unitaires back | ✅ | 31 tests réels : `score.calculator`, `team-member.guard`, `team-role.guard`, `auth.service`, `users.service`. Commande CI `test:ci`. |
| Tests API / e2e | 🔴 | `app.e2e-spec.ts` existe mais hors `testRegex` → jamais exécuté |
| Tests sécurité (accès chat non-membre…) | 🟡 | Couvert indirectement via les tests de guards d'équipe ; reste l'accès chat/conversation à tester |
| Tests front-end | ✅ | **Vitest + Testing Library (2026-06-28)** : 19 tests (searchEmojis, AvatarInitial, EmojiSuggestion, intercepteur axios token/401). Exécutés en CI via `test:ci`. |
| **Pipeline CI/CD** | ✅ | `.github/workflows/ci.yml` : lint (non bloquant) + build api/web + tests api (bloquants) |
| **Dockerfile api / web** | ✅ | `apps/api/Dockerfile` + `apps/web/Dockerfile` multi-stage (+ `.dockerignore`, `nginx.conf`) |
| docker-compose app complète | ✅ | api + web + postgres + redis, healthchecks + `depends_on` conditionnels |
| Healthcheck / HealthModule | ✅ | **2026-06-28** : HealthModule (`GET /api/health`, BDD+Redis) + healthchecks Docker pointés dessus |
| Monitoring / logs (Sentry, winston/pino) | 🔴 | Absent |
| Variables d'env documentées | 🟡 | `.env.example` minimal vs `Variables-environnement.md` |

---

# PARTIE B — Croisement avec la validation du titre RNCP

> Rappel : le titre s'obtient via un **dossier de validation (60 p. min.) + oral 20 min**, **les 4 blocs devant TOUS être validés**. Chaque compétence doit être prouvée. Le jury évalue la **possession de la compétence**, pas l'exhaustivité du produit — donc un MVP incomplet peut suffire **si** les preuves couvrent chaque critère du référentiel.
>
> La question clé n'est donc pas « le produit est-il fini ? » mais **« chaque compétence du référentiel a-t-elle une preuve démontrable ? »**. Ci-dessous, on isole, parmi « ce qui reste », ce qui **menace réellement la validation d'un bloc**.

## B.1 — Niveau de risque par bloc

| Bloc | Risque de non-validation | Cause principale |
|------|--------------------------|------------------|
| **BC01** Conception + sécurité | 🟠 Moyen | Conception/archi/chiffrement OK, mais critères « logiciel déverminé / aucun défaut » et accessibilité non prouvés |
| **BC02** Pilotage DevOps | 🟠 Moyen-élevé | Gestion de projet bien documentée, mais **DevOps réel** (CI/CD, intégrabilité ITIL, conteneurisation) absent du code |
| **BC03** Développement | 🔴 Élevé sur 1 critère | Dev abondant et solide **sauf « préparer des jeux d'essai / livrer un logiciel déverminé »** : les tests sont des placeholders |
| **BC04** Échange de données | 🟠 Moyen | Flux REST/Socket + mapping OK, mais « scripts système / environnement de tests multi-tiers » et volet RGPD export faibles |

## B.2 — Compétences RNCP réellement menacées (et l'action qui les sauve)

| Bloc · Compétence | Critère du référentiel non prouvé | Ce qui manque | Action minimale pour valider |
|-------------------|-----------------------------------|---------------|------------------------------|
| **BC01-5** Livrer un logiciel déverminé | « Des outils de contrôle automatique du code sont utilisés. Aucun défaut visible ne persiste. » | Tests placeholders, pas d'analyse statique formalisée | Écrire de **vrais tests** (score, guards, auth) + montrer ESLint/TS en CI |
| **BC01-6** Estimer charge / utilisateurs simultanés | « L'exécution est répartie… tests de performance, calcul de robustesse » | Pas de test de charge ni estimation chiffrée | Produire une **note d'estimation de charge** + un test simple (k6/autocannon) comme preuve |
| **BC01-7** Accessibilité handicap (RGAA) | « Une norme de présentation… RGAA » | ARIA partiel, pas d'audit | **Audit RGAA** documenté (Lighthouse/axe) + corrections |
| **BC01-10** Accès sécurisé aux données | « contraintes d'intégrité et déclencheurs » | Contraintes OK, pas de déclencheurs, `synchronize:true` | Ajouter **migrations** + au moins 1 contrainte/déclencheur documenté |
| **BC02-8** Coordonner en Agile | backlog par sprint, outil de synchro | ✅ Couvert par la doc sprints/backlog | RAS — valoriser la doc `13-Sprints-Milestones/` |
| **BC02-11** Intégrabilité (ITIL) | « bon à intégrer signé, SLA, points de contrôle positifs » | Pas de CI/CD, pas de procédure réelle | **Pipeline CI** (lint+build+test) = preuve de l'intégrabilité automatisée + checklist de mise en exploitation |
| **BC02-4** Modéliser une BDD | MCD, méthode | ✅ Modèle + diagrammes UML | RAS — valoriser `06-Diagrammes-UML/` + entités |
| **BC02-9** Clôturer une mission (CFTL) | « PV de réception » | Recette doc, pas de PV signé | Produire un **PV de réception** formel |
| **BC03-2/3/4/5** Algorithmique, codage, modif, débogage | Algorithmes → code, débogage | ✅ Largement prouvé (score, pagination, commits `fix:`) | RAS — sélectionner extraits de code comme preuves |
| **BC03-6** Intégrer des services externes (RSE) | « réutilisant des services logiciels externes… politique RSE » | Steam OK ; volet écoresponsabilité non documenté | Documenter le **volet RSE/écoresponsabilité** (ex. choix techniques sobres) |
| **BC03-7** Préparer des jeux d'essai / logiciel déverminé | « Les jeux de tests utilisés ne révèlent plus aucun défaut » | **Tests placeholders** = critère non prouvé | 🔴 **Priorité n°1** : écrire de vrais jeux de tests + plan de tests exécuté |
| **BC03-8** Rendre compte de son travail | « compte-rendu d'activité, taux de disponibilité » | Suivi Git, pas de CRA formel | Produire un **compte-rendu d'activité** + état de disponibilité |
| **BC04-1** Analyse organique / rétro-doc | « rétro-documentation disponible, fiable » | Doc technique riche, à cadrer | Cadrer une **rétro-documentation** d'un module existant |
| **BC04-3** Produire des données agrégées (RGPD) | « conformes à la réglementation en vigueur » | ✅ Agrégats OK + **export + suppression RGPD + page confidentialité + consentement (2026-06-28)** | Volet RGPD complet (front + back) |
| **BC04-5** Scripts système / environnement de tests | « machines virtuelles, serveurs d'applications, Web et BDD… environnement multi-tiers » | docker-compose partiel, pas de Dockerfile | **Dockeriser api+web** + compose complet = environnement multi-tiers démontrable |

## B.3 — Ce qui « reste à faire » mais **n'impacte PAS** la validation RNCP

À ne **pas** prioriser pour le titre (le jury évalue des compétences, pas la complétude produit) :

- Epic/EOS, notifications, modération/admin, blocage utilisateur, objectifs personnels, comparaison joueur, upload avatar, recherche d'équipe, mot de passe oublié → bonus produit, hors critères.
- Archivage trimestriel **complet** : utile comme preuve de conception BDD avancée, mais **non exigé** par un critère précis → le **diagramme + une amorce** suffisent pour le dossier ; inutile de tout coder.
- Gestion d'équipe avancée (promote/exclude/delete) → un seul de ces endpoints suffit à prouver la gestion de permissions (BC01).

---

# Plan d'action priorisé pour la validation RNCP

Classé par **impact sur la validation du titre** (≠ complétude produit) :

| # | Action | Débloque (RNCP) | Effort | Priorité |
|---|--------|-----------------|--------|----------|
| 1 | **Écrire de vrais tests** (score, guards, auth, stats) + plan de tests exécuté | BC03-7, BC01-5 | 🟠 Moyen | 🔴 Critique |
| 2 | **Pipeline CI** GitHub Actions (lint + build + test) | BC02-11, BC01-5 | 🟢 Faible | 🔴 Critique |
| 3 | **Dockeriser api+web** + compose complet | BC04-5, BC02-11 | 🟠 Moyen | 🔴 Critique |
| 4 | **Brancher Helmet + rate limiting** | BC01-8/10 | 🟢 Faible | 🟠 Haute |
| 5 | **RGPD** : endpoints suppression + export de compte | BC04-3, BC01 | 🟠 Moyen | 🟠 Haute |
| 6 | **Migrations** TypeORM (sortir de `synchronize:true`) | BC01-10, BC02-4 | 🟢 Faible | 🟠 Haute |
| 7 | **Audit RGAA** (Lighthouse/axe) + corrections | BC01-7 | 🟢 Faible | 🟡 Moyenne |
| 8 | **Note d'estimation de charge** + 1 test perf | BC01-6 | 🟢 Faible | 🟡 Moyenne |
| 9 | **Endpoint `/health`** + HealthModule | BC02-11 | 🟢 Faible | 🟡 Moyenne |
| 10 | **Livrables formels** : PV de réception, PAQ, compte-rendu d'activité, rétro-doc | BC02-9, BC03-8, BC04-1 | 🟢 Faible | 🟡 Moyenne |
| 11 | **PWA** (manifest + SW) | confort démo, BC01-7 | 🟢 Faible | 🟢 Basse |
| 12 | Débloquer la démo (compose, mot de passe démo) | parcours oral | 🟢 Faible | 🟢 Basse |

> **Lecture rapide** : si tu ne devais faire que **3 choses** pour sécuriser le titre → **#1 (tests réels)**, **#2 (CI)**, **#3 (Docker complet)**. Ce sont les seuls écarts qui touchent un **critère obligatoire** de plusieurs blocs.

---

# Synthèse en une phrase

Le **produit** est mûr et riche (souvent au-delà du MVP), mais 3 piliers d'une **démarche d'ingénierie professionnelle** — **tests réels, CI/CD, conteneurisation** — sont absents alors qu'ils sont exigés par des critères des blocs **BC03, BC02 et BC04** ; les combler (≈ 1-2 jours de travail ciblé) transforme un produit démontrable en un **dossier de validation couvrant les 4 blocs**.

---

_Document généré le 2026-06-26. Voir aussi : [cartographie-competences-cdan.md](cartographie-competences-cdan.md) (mapping compétence par compétence) et `docs/audit-projet.md` (audit produit du 2026-06-05)._
