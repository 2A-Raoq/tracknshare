# Cartographie compétences CDAN (RNCP 36462/36463) ↔ Track'N Share

> Document de travail pour le dossier de validation CDAN.
> Met en relation chaque **compétence attestée** des 4 blocs du référentiel avec les **fonctionnalités et preuves concrètes** présentes dans le projet Track'N Share.
>
> Légende statut :
> - ✅ **Couvert** : preuve directe et démontrable dans le code/la doc.
> - 🟡 **Partiel** : amorce présente, à compléter ou à formaliser pour le dossier.
> - 🔴 **À produire** : pas encore couvert, action nécessaire avant la soutenance.

---

## Vue synthétique

| Bloc | Intitulé | Taux de couverture estimé |
|------|----------|---------------------------|
| **BC01** | Concevoir des applications numériques en intégrant les recommandations de sécurité | ✅ ~80 % |
| **BC02** | Piloter un projet DevOps de développement d'application numérique | 🟡 ~65 % |
| **BC03** | Développer des applications numériques | ✅ ~85 % |
| **BC04** | Réaliser une interface d'échange de données informatisées | 🟡 ~60 % |

> Évaluation finale = **dossier de validation (60 pages min.) + présentation orale 20 min** devant un jury. Tous les blocs doivent être validés. Chaque compétence doit être accompagnée d'une **preuve** (extrait de code, capture d'écran, livrable, diagramme).

---

## BC01 — Concevoir des applications numériques en intégrant les recommandations de sécurité

| # | Compétence attestée | Statut | Preuves / fonctionnalités Track'N Share |
|---|---------------------|--------|------------------------------------------|
| 1 | Formaliser les procédures des services utilisateurs pour recenser les résultats attendus (cahier des charges, spécifications fonctionnelles) | ✅ | `docs/drive-export/01-Gestion-Projet/Cahier-des-charges.md`, `docs/drive-export/02-Documentation-Fonctionnelle/Specifications-fonctionnelles.md`, `docs/00-AI-Context/mvp-scope.md`, `api-contract.md` (contrat d'API = liste de contrôle des attendus) |
| 2 | Prendre en compte les impératifs utilisateurs en respectant les normes qualité pour l'architecture (PAQ, application en couches) | ✅ | Architecture en couches NestJS (controllers → services → repositories), `docs/00-AI-Context/architecture.md`, `docs/drive-export/04-Architecture-Technique/`. PAQ à formaliser → 🟡 |
| 3 | Concevoir l'architecture d'une solution fiable / logiciel générique réutilisable | ✅ | Monorepo `apps/api` + `apps/web`, modules par domaine (16 modules NestJS), interface commune `providers/external-stats-provider.interface.ts` (MOCK/STEAM interchangeables), composants front réutilisables |
| 4 | Concevoir des services d'accès aux données indépendants du mode de stockage / logiciel partageable | ✅ | Pattern Repository TypeORM, services métier découplés de PostgreSQL, `RedisService` abstrait le cache, providers de stats abstraits derrière une interface |
| 5 | Envisager toutes les possibilités pour livrer un logiciel déverminé (recherche systématique d'erreur) | 🟡 | ✅ **Renforcé (2026-06-28)** : 31 tests unitaires verts + **CI GitHub Actions** (build+test bloquants) = outils de contrôle automatique du code en place. Restent les tests front + e2e pour la preuve « aucun défaut visible » complète. Voir [ecart-doc-code-et-rncp.md](ecart-doc-code-et-rncp.md) |
| 6 | Estimer la charge de traitement / puissance de calcul selon le nombre d'utilisateurs simultanés | 🟡 | Optimisations perf : index PG `idx_leaderboard_query`, cache Redis (TTL 30s), QueryBuilder sélectif, pagination cursor, `HttpCacheInterceptor`. `docs/drive-export/05-Base-de-Donnees/Strategies-indexation.md`. **Manque** : tests de charge / estimation chiffrée documentée |
| 7 | Respecter une norme de présentation des écrans / accessibilité handicap (RGAA) | 🟡 | UI sombre gaming responsive mobile-first, ARIA (`role`, `aria-label`, `aria-modal`), navigation clavier (emoji autocomplete), HTML sémantique. Maquettes Figma `docs/drive-export/03-Design-UX-UI/`. **Manque** : audit RGAA formalisé |
| 8 | Identifier les risques et leur niveau de criticité (prévention) | ✅ | `docs/drive-export/01-Gestion-Projet/Risques-et-solutions.md`, `docs/drive-export/09-Securite-RGPD/Protection-attaques.md`, `Plan-secours-APIs.md` |
| 9 | Orienter son style de programmation : code lisible/maintenable/robuste par approche objets (POO, réutilisation >80%, charte nommage, doc 8-15%) | ✅ | TypeScript orienté objets (classes NestJS `@Injectable`, entités, DTO), charte de nommage `docs/drive-export/12-Standards-Developpement/Conventions-code.md`, conventions Git. **Vérifier** : taux de doc interne 8-15% → 🟡 |
| 10 | Garantir un accès sécurisé aux données (contraintes d'intégrité, déclencheurs) | ✅ | Contraintes TypeORM : `@Unique`, `@Index`, FK avec `onDelete: CASCADE`, colonnes `select:false` sur données sensibles, validation `ValidationPipe` whitelist/transform. Chiffrement AES-256-GCM des messages. **Déclencheurs SQL** → 🟡 |

**Preuves transverses sécurité BC01 :**
- Hash bcrypt (10 rounds) — `apps/api/src/auth/auth.service.ts`, `users/users.service.ts`
- JWT Bearer + `JwtAuthGuard` + Passport strategy — `apps/api/src/auth/`
- Chiffrement messages AES-256-GCM — `apps/api/src/security/encryption.service.ts` + `encryption.util.ts`
- Guards de permissions équipe / conversation — `teams/guards/`, `messages/guards/`
- Documentation : `docs/drive-export/09-Securite-RGPD/` (Conformite-RGPD, Politique-securite, Gestion-secrets-env)

---

## BC02 — Piloter un projet DevOps de développement d'application numérique

| # | Compétence attestée | Statut | Preuves / fonctionnalités Track'N Share |
|---|---------------------|--------|------------------------------------------|
| 1 | Formaliser les procédures des services utilisateurs (conformité gouvernance) | 🟡 | `CONTRIBUTING.md`, `AI_USAGE_POLICY.md`, `docs/drive-export/12-Standards-Developpement/Definition-of-Done.md`. À relier explicitement à une « gouvernance d'entreprise » |
| 2 | Réaliser une réingénierie d'un processus (amélioration résultats/conditions) | 🟡 | Historique Git : refactos perf (commit `13f16ab`), harmonisation layout, audit projet `docs/audit-projet.md`. À narrer comme réingénierie |
| 3 | Formaliser la circulation des documents (diagramme de workflow) | 🟡 | `docs/drive-export/06-Diagrammes-UML/` (activité, séquence). **Manque** : diagramme de workflow documentaire explicite |
| 4 | Modéliser une base de données adaptée (règles de gestion, existant) | ✅ | Modèle de données complet : 15 entités TypeORM, relations, `docs/00-AI-Context/domain-model.md`, `docs/drive-export/06-Diagrammes-UML/` (classes), MCD |
| 5 | S'insérer dans l'urbanisation du SI (éléments réutilisables, structure en couches) | ✅ | Architecture en couches, modules par domaine, `docs/drive-export/04-Architecture-Technique/Stack-technique-detaillee.md`, `docs/00-AI-Context/architecture.md` |
| 6 | Choisir le degré de réutilisation (équipe, CMMI, sprint backlog SCRUM) | 🟡 | `docs/drive-export/13-Sprints-Milestones/Backlog-priorise.md` + 4 sprints détaillés. **Manque** : décision de réutilisation tracée + livre de bord |
| 7 | Estimer des délais de réalisation (taux de disponibilité, dates départ/livraison) | 🟡 | Roadmap & milestones `docs/drive-export/13-Sprints-Milestones/Roadmap-MVP.md`, `Milestones-projet.md`. **Manque** : planning prévisionnel chiffré + taux de dispo |
| 8 | Coordonner un projet en méthodologie Agile (coûts/délais/qualité, backlog à chaque sprint) | ✅ | 4 sprints documentés (`Sprint-0` → `Sprint-4`), backlog priorisé P0/P1/P2, suivi Git. Co-dev Clément (front) / Ioanes (back) |
| 9 | Clôturer une mission (validation livrable, CFTL, PV de réception) | 🟡 | `docs/drive-export/10-Tests/Recette-soutenance.md`. **Manque** : PV de réception formel signé |
| 10 | Adapter son discours à l'auditoire (adhésion décideurs) | 🔴 | À produire lors de la **présentation orale 20 min** (parcours de démo défini dans CLAUDE.md & README) |
| 11 | Réaliser la procédure d'intégrabilité (ITIL, points de contrôle, bon à intégrer, SLA) | 🟡 | `docs/drive-export/11-DevOps-Deploiement/` (CI-CD-pipeline, Procedure-deploiement). **Manque** : pipeline CI/CD réel (.github/) + checklist de mise en exploitation |
| 12 | Interagir efficacement en environnement collaboratif (reformulation, handicap) | ✅ | `CONTRIBUTING.md` (process PR, review), conventions Git, collaboration 2 développeurs, accessibilité front |
| 13 | Communication professionnelle français/anglais (partage d'informations structurées) | 🟡 | Documentation FR complète + commentaires/code EN, Swagger EN. **Renforcer** : preuve d'un document EN structuré |

**Preuves transverses DevOps BC02 :**
- Monorepo pnpm + Turborepo (`package.json`, `turbo.json`, `pnpm-workspace.yaml`)
- Conteneurisation `docker-compose.yml` (PostgreSQL 16 + Redis 7) — ⚠️ **services api/web à ajouter** (cf. `docs/audit-projet.md`)
- Documentation DevOps : `docs/drive-export/11-DevOps-Deploiement/` (CI/CD, Docker, monitoring, déploiement)
- Méthodologie : `docs/drive-export/13-Sprints-Milestones/`
- **Action clé** : ajouter un pipeline CI/CD réel (GitHub Actions) pour solidifier les compétences 11.

---

## BC03 — Développer des applications numériques

| # | Compétence attestée | Statut | Preuves / fonctionnalités Track'N Share |
|---|---------------------|--------|------------------------------------------|
| 1 | Utiliser les ressources / expert externe pour lever doutes et inconnus | ✅ | `AI_USAGE_POLICY.md` (usage encadré de l'IA = ressource), `docs/drive-export/14-Ressources-Externes/`, documentation officielle référencée |
| 2 | Décomposer un problème complexe en sous-problèmes (algorithmique) | ✅ | Calcul de score décomposé `apps/api/src/stats/utils/score.calculator.ts` (KD → winrate → score), pagination cursor encodée base64, génération déterministe stats Steam (`steam-stats.provider.ts`) |
| 3 | Traduire une solution algorithmique en code (langage approprié) | ✅ | Toute la base de code TypeScript : formule score `(K/D×50)+(winrate×40)+(matchs×0.5)`, leaderboard ranking, etc. |
| 4 | Modifier un algorithme sans dysfonctionnement (s'adapter au code existant) | ✅ | Historique Git : évolution score/perf, refacto `QueryBuilder`, ajout cursor pagination sans casser l'offset (commit `13f16ab`) |
| 5 | Remédier aux erreurs de codage/logique (débogage, messages compilateur) | ✅ | Commits `fix:` (login password hash, Steam modal scroll, achievement columns), TypeScript strict, gestion d'exceptions structurée |
| 6 | Intégrer des éléments logiciels hétérogènes / services externes (local/distant, RSE) | ✅ | Intégration **Steam API** réelle (`providers/steam/steam-stats.provider.ts`, `game-accounts/`), Socket.io temps réel, Redis, axios front. **RSE/écoresponsabilité** → 🟡 à documenter |
| 7 | Préparer des jeux d'essai (logiciel déverminé, sans anomalie) | 🟡 | ✅ **Renforcé (2026-06-28)** : 31 tests unitaires réels (score, guards, auth, users) verts + exécutés en CI via `test:ci`. Restent les tests front (Vitest) et e2e pour atteindre une couverture probante. Voir [ecart-doc-code-et-rncp.md](ecart-doc-code-et-rncp.md) |
| 8 | Estimer son taux de disponibilité réel et rendre compte (outil de suivi) | 🟡 | Suivi Git + sprints. **Manque** : compte-rendu d'activité / état statistique de disponibilité formalisé |

**Preuves transverses dev BC03 :**
- Back-end NestJS : 16 modules, ~30 endpoints REST, 2 gateways Socket.io
- Front-end React/TS/Vite : 13 routes, état auth Valtio, services API centralisés
- Temps réel : chat équipe + messagerie privée (Socket.io avec fallback REST)
- Intégration externe : Steam (link compte, jeux suivis, sync stats)
- Fonctionnalités : dashboard, stats multi-jeux, score, leaderboard, équipes, chat, amis, profils publics, achievements, emoji picker

---

## BC04 — Réaliser une interface d'échange de données informatisées

| # | Compétence attestée | Statut | Preuves / fonctionnalités Track'N Share |
|---|---------------------|--------|------------------------------------------|
| 1 | Analyse organique d'un logiciel existant (rétro-documentation) | 🟡 | Documentation technique riche (`docs/00-AI-Context/`, diagrammes UML, `domain-model.md`, Swagger auto-généré). **À cadrer** comme rétro-doc d'une appli existante |
| 2 | Tables de correspondance / dictionnaires de données (aucune référence orpheline) | ✅ | Mapping providers : `RawStats` → `PlayerStats` (`stats.service.ts` `upsertStats`), `SteamGameSummary` → `SteamTrackedGame` → `Game`, contraintes FK garantissant l'intégrité référentielle |
| 3 | Produire des données indisponibles par agrégation/consolidation/calcul (RGPD) | ✅ | Agrégats calculés : KD ratio, winrate, score, `leaderboardRank` (count + 1), progression achievements. Conformité RGPD `docs/drive-export/09-Securite-RGPD/Conformite-RGPD.md`. Champs publics filtrés (`toPublic`, `getPublicBadges`) |
| 4 | Exportation/importation de données entre logiciels (formats compatibles, flux synchrones/asynchrones) | ✅ | **Flux synchrone** : REST API JSON (Steam ↔ API ↔ front) ; **flux asynchrone** : Socket.io (messages temps réel). Import Steam → normalisation → PostgreSQL. `docs/drive-export/07-API-Documentation/` + `08-Integrations-Externes/Steam-API-documentation.md` |
| 5 | Écrire des scripts système / shell (VM, serveurs d'applications, Web, BDD = environnement de tests) | 🟡 | `docker-compose.yml` (provisionne PostgreSQL + Redis), scripts pnpm (`dev`, `build`, `seed`), seed de données `database/seed.ts`. **Manque** : conteneurisation complète api/web + descriptif environnement multi-tiers |

**Preuves transverses échange de données BC04 :**
- Contrat d'API : `docs/00-AI-Context/api-contract.md`, `docs/drive-export/07-API-Documentation/Endpoints-REST-API.md`
- Documentation Socket.io : `docs/drive-export/07-API-Documentation/Documentation-Socket-io.md`
- Intégrations externes : `docs/drive-export/08-Integrations-Externes/` (Steam, Epic, rate-limiting, plan de secours)
- Swagger OpenAPI : `http://localhost:3000/docs`
- **Action clé** : compléter `docker-compose.yml` (services api + web) pour la compétence 5.

---

## Plan d'action prioritaire avant soutenance

Actions qui débloquent le plus de compétences pour le dossier :

| Priorité | Action | Compétences renforcées | Référence |
|----------|--------|------------------------|-----------|
| ✅ fait | ~~Compléter `docker-compose.yml` avec services **api + web** (+ healthchecks)~~ — Dockerfiles api/web + compose complet (2026-06-28) | BC02-11, BC04-5 | `apps/*/Dockerfile`, `docker-compose.yml` |
| ✅ fait | ~~Ajouter un **pipeline CI/CD** (GitHub Actions : lint + build + test)~~ — `.github/workflows/ci.yml` (2026-06-28) | BC02-8/11, BC03-7 | `.github/workflows/ci.yml` |
| ✅ fait | ~~Tests back-end réels (score, guards, auth, users)~~ — 31 tests verts (2026-06-28) | BC01-5, BC03-7 | `apps/api/src/**/*.spec.ts` |
| 🔴 1 | Harmoniser le **mot de passe démo** (seed ↔ recette) | BC02-9, démo | `docs/audit-projet.md` |
| 🟠 2 | Ajouter des **tests front-end** (Vitest) + monter la couverture | BC03-7, BC01-5 | `CONTRIBUTING.md` |
| 🟠 5 | **Configurer la PWA** (vite-plugin-pwa : manifest + SW) | BC01-7, BC03-6 | `vite.config.ts` |
| 🟡 6 | Ajouter le **rate limiting** (`@nestjs/throttler` + Redis) | BC01-8/10 | `docs/audit-projet.md` |
| 🟡 7 | Formaliser un **audit RGAA** d'accessibilité | BC01-7 | `docs/drive-export/03-Design-UX-UI/` |
| 🟡 8 | Documenter **estimation de charge / tests de perf** | BC01-6 | `docs/drive-export/05-Base-de-Donnees/` |
| 🟡 9 | Produire les **livrables formels** : PAQ, PV de réception, diagramme de workflow, compte-rendu d'activité | BC01-2, BC02-3/9, BC03-8 | dossier |
| 🟢 10 | Préparer la **présentation orale** (parcours de démo) | BC02-10 | `README.md`, `CLAUDE.md` |

---

## Correspondance bloc ↔ rôle (co-développement)

- **Clément** (front-end / PWA) : preuves fortes BC01-7 (UI/accessibilité), BC03 (dev front), BC04-4 (flux front/temps réel).
- **Ioanes** (back-end) : preuves fortes BC01 (sécurité), BC02 (DevOps/BDD), BC04 (interfaces de données, Steam).
- Chaque candidat doit pouvoir **présenter individuellement** les preuves des 4 blocs (le dossier est individuel) : prévoir une répartition claire des contributions par compétence.

---

_Document généré le 2026-06-26 à partir d'un scan complet du dépôt (apps/api, apps/web, docs, infra) et des 3 PDF du référentiel CDAN (`docs/prerequis/`)._
