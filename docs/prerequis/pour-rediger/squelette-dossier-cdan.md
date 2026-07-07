# Squelette de réécriture — Dossier CDAN (RNCP 36463) — Clément FABRE

> **Mode d'emploi.** Pour chacune des 36 compétences : le **contexte** choisi
> (🏢 Roofline / 🎓 Track'N Share / les deux), l'**angle** (ce que TU racontes,
> à la première personne), les **preuves** à citer/capturer, et la **limite** à
> assumer. Tu écris le texte final TOI-MÊME par-dessus chaque angle — 10 à 20
> lignes par compétence, AUCUN paragraphe réutilisé d'une compétence à l'autre.
>
> **Règles absolues (tirées du rapport du jury blanc) :**
> 1. Zéro paragraphe template répété. Chaque compétence = un texte unique.
> 2. « Je » en situation : une action datée, un choix, une difficulté, un résultat.
> 3. Chaque affirmation est adossée à une preuve matérielle (capture annotée en annexe).
> 4. Les limites sont dites en une phrase, sans s'auto-décrédibiliser en préambule.
> 5. Supprimer toute trace de méta-discours (« la preuve finale devra être… »).

## Partie 1 — Écrit narratif (plan corrigé)

1. **Qui je suis + parcours** : garder le §1.1 du dossier blanc (seule partie sincère), resserré.
2. **Roofline (NOUVEAU — c'était le manque n°1)** : zoom agence → service → poste.
   Agence web 360° à Albi ; équipe dev : Guillaume Jos (senior, tuteur), Jordan
   Nickol (dev), moi (alternant dev). Mes missions : sites WordPress, automatisations
   de process (Make/Automa), et surtout **la chaîne de rapports de maintenance**
   (plugin WP + dashboard Laravel) utilisée pour **17 clients en production**.
3. **Les deux projets supports** (1 page) : tableau comparatif Roofline / Track'N Share
   (contexte, stack, rôle, état). Annoncer que chaque compétence s'appuie sur le
   contexte le plus probant.
4. **Métier CDAN** : réécrire en 15 lignes personnelles (ce que l'alternance t'a
   appris du métier : traduire un besoin de gérante en outil, maintenir du code
   d'un collègue, livrer en prod).
5. **Supprimer** le préambule « méthode de rédaction » → remplacé par 10 lignes :
   pourquoi ces deux projets, quel est mon rôle exact dans chacun, usage de l'IA
   assumé et encadré (AI_USAGE_POLICY.md dans le repo).

---

## BC01 — Concevoir des applications numériques en intégrant la sécurité

### C1.1 — Formaliser les procédures / recenser les résultats attendus
- **Contexte :** 🏢 principal, 🎓 appui.
- **Angle :** le besoin exprimé oralement par la gérante (« centraliser les rapports
  de maintenance de nos 17 clients ») → je l'ai traduit en fonctionnalités listées
  et priorisées (ROADMAP 17 tâches P0-P3). En parallèle, sur TNS : MVP figé dans
  `mvp-scope.md` + contrat d'API écrit AVANT le front (`api-contract.md`).
- **Preuves :** capture ROADMAP.md (tâches estimées/cochées) ; capture mvp-scope.md ;
  extrait api-contract.md.
- **Limite :** pas de cahier des charges signé côté Roofline (commande orale de la
  gérante — c'est la réalité d'une petite agence, dis-le).

### C1.2 — Impératifs utilisateurs + recommandations qualité
- **Contexte :** 🎓 principal.
- **Angle :** qualité outillée et BLOQUANTE : ESLint zéro-warning + Prettier unifié
  + TypeScript strict + CI qui refuse le merge si lint/tests échouent. Raconte la
  passe de fiabilisation : 131 problèmes lint corrigés sans un seul `eslint-disable`.
- **Preuves :** capture CI verte (jobs lint/build/test) ; `.prettierrc` racine ;
  capture `tsconfig` strict ; PAQ (livrable docs/prerequis/livrables/).
- **Limite :** le PAQ a été formalisé tard (en fin de projet).

### C1.3 — Architecture fiable et réutilisable
- **Contexte :** 🎓 principal, 🏢 appui.
- **Angle :** monorepo 3 apps + package `@tracknshare/shared-types` (né d'un VRAI bug :
  types dupliqués web/mobile qui avaient divergé → dashboard mobile affichait « Jeu »
  au lieu du nom du jeu ; j'ai éliminé la classe de bugs, pas juste le bug).
  Interface de providers Mock/Steam interchangeables. **Prépare la question 7 du
  jury** : wouter plutôt que React Router (2 Ko, API hooks suffisante pour 13 routes),
  valtio plutôt que Redux (proxy-state minimal, pas de boilerplate pour un MVP à 2 devs).
- **Preuves :** arborescence packages/shared-types ; `external-stats-provider.interface.ts` ;
  schéma d'architecture (À PRODUIRE, draw.io).
- **Limite :** mobile hors workspace pnpm (contrainte Expo, choix documenté au README).

### C1.4 — Services d'accès aux données indépendants du stockage
- **Contexte :** 🏢 principal (preuve rare et forte).
- **Angle :** sur l'interface Laravel, j'ai migré le stockage **JSON → SQL en 3 phases
  sans toucher les appels métier** grâce à la façade `ClientRepository` : la preuve
  vivante que l'accès aux données était découplé du mode de stockage. Sur TNS :
  pattern Repository TypeORM + `RedisService` abstrait le cache.
- **Preuves :** `ClientRepository.php:9-14` ; commits `f33a3cb`→`3f59c8b` ;
  extrait `redis.service.ts` TNS.
- **Limite :** table `clients` dénormalisée (colonnes JSON) — héritage de la
  migration, assumé.

### C1.5 — Rechercher systématiquement l'erreur (contrôle automatique)
- **Contexte :** 🎓 + 🏢 à égalité.
- **Angle :** TNS : 46 tests API + 8 e2e (Postgres/Redis réels en CI) + 22 tests
  front, TOUS bloquants en CI. Roofline : 91 tests PHPUnit avec WordPress mocké
  (WP_Mock), écrits en TDD (cycles visibles dans les commits).
- **Preuves :** capture sortie `pnpm test` + job CI e2e ; capture `composer test`
  du plugin ; extrait d'un test WP_Mock (nonce KO → rejet).
- **Limite :** couverture partielle du plugin (fonctions pures/AJAX, pas le rendu).

### C1.6 — Estimer la charge / puissance de calcul
- **Contexte :** 🎓 principal.
- **Angle :** note d'estimation de charge + script autocannon, et les optimisations
  qui en découlent : index PG sur le leaderboard, cache Redis TTL 30 s **avec
  invalidation à la sync**, pagination par curseur. Roofline en écho : respect des
  quotas API Google (pause aléatoire 2-5 s entre clients, passage hebdo le lundi 3h).
- **Preuves :** `estimation-charge.md` + sortie du script perf (À CAPTURER) ;
  `CheckGscForClients.php:62-64` ; ROADMAP §GSC.
- **Limite :** estimation sur environnement local, pas de test de charge en prod.

### C1.7 — Normes de présentation / accessibilité RGAA
- **Contexte :** 🎓 (preuve désormais chiffrée — était NA au blanc).
- **Angle :** audit exécuté le 2026-07-06 : Lighthouse **100/100 sur 5 pages
  publiques**, axe-core WCAG 2.1 AA **0 violation sur 8 pages authentifiées** —
  après avoir trouvé une violation réelle (fil de messages scrollable non focusable
  au clavier), corrigée (`tabIndex` + `role="log"`) et contre-auditée. Raconte le
  cycle complet : mesure → constat → correctif → re-mesure.
- **Preuves :** `docs/prerequis/livrables/audit-rgaa.md` (tableaux de scores) ;
  diff du correctif TeamChatPage/ConversationPage ; capture Lighthouse.
- **Limite :** revue TalkBack/VoiceOver mobile encore à faire (planifiée, guide §3.2).

### C1.8 — Identifier les risques et leur criticité
- **Contexte :** 🎓 principal (anecdote en or), 🏢 appui.
- **Angle :** revue de sécurité systématique sur TNS → découverte d'un risque réel :
  le service worker PWA cachait des réponses authentifiées indexées par URL → sur un
  poste partagé, l'utilisateur suivant pouvait lire les données du précédent.
  Correctif : allowlist stricte (leaderboard public uniquement) + purge du cache au
  logout + `Cache-Control: no-store` côté API. Roofline : arbitrage SSRF tracé en
  commit (« fix URL validation for local IPs ») — risque identifié, accepté en dev,
  encadré par token.
- **Preuves :** diff vite.config.ts + `clearSession()` ; commit du plugin ;
  AUDIT_2026-06-15.md (13 TODOs sécurité priorisés).
- **Limite :** pas de matrice criticité/probabilité formelle — la produire en 10
  lignes dans le dossier (5 risques × criticité) coûte peu et coche le critère.

### C1.9 — Code lisible, maintenable, robuste (POO)
- **Contexte :** 🎓 principal.
- **Angle :** POO NestJS (classes injectables, DTO, entités), conventions de nommage
  documentées, et le chiffre qui remplace SonarQube : **0 erreur, 0 warning ESLint
  sur 3 apps + TypeScript strict**, imposés par la CI. Réutilisation : shared-types,
  composants UI communs, constante partagée MESSAGE_MAX_LENGTH (extraite de 6
  duplications).
- **Preuves :** capture lint 0/0 ; `Conventions-code.md` ; exemple de service NestJS
  commenté.
- **Limite :** pas de mesure de taux de réutilisation/documentation chiffrée type
  SonarQube (dis-le et donne tes métriques à toi).

### C1.10 — Accès sécurisé aux données (contraintes, intégrité, anomalies)
- **Contexte :** 🎓 principal, 🏢 appui.
- **Angle :** contraintes d'unicité en BDD (`@Unique`) ET gestion de la violation en
  concurrence : deux « rejoindre l'équipe » simultanés → détection Postgres 23505 →
  409 métier au lieu d'un 500. Chiffrement AES-256-GCM des messages au repos,
  `passwordHash` en `select:false`. Roofline : intégrité inter-logiciels par SHA-256
  vérifié en `hash_equals` à la réception du CSV.
- **Preuves :** `is-unique-violation.ts` + extrait teams.service ; entités ;
  `WordPressMaintenanceReportApiService.php:136-141`.
- **Limite :** pas de triggers SQL (choix ORM assumé).

---

## BC02 — Piloter un projet DevOps

### C2.1 — Formaliser les procédures (gouvernance)
- **Contexte :** 🎓 + 🏢.
- **Angle :** procédures écrites et VERSIONNÉES : CONTRIBUTING.md (process PR + review),
  AI_USAGE_POLICY.md (usage IA encadré — assume-le, c'est ta meilleure défense à la
  question 2 du jury), Definition-of-Done ; Roofline : procédure de mise en prod
  pas-à-pas avec rollback (`LEGACY_FIELDS_MIGRATION.md`).
- **Preuves :** captures des 3 documents + du workflow de PR (#2 mergée avec CI).

### C2.2 — Réingénierie d'un processus
- **Contexte :** 🏢 principal (LE récit du dossier), 🎓 appui.
- **Angle :** raconte la v1 du plugin co-développée avec Jordan (1 fichier PHP, zéro
  test, récupération « bricolée », pas de git) → ta refonte : découpage en modules,
  TDD, API REST versionnée, webhook. Avant/après mesurable : 1 fichier → 6 modules +
  91 tests. Leçon apprise : versionner dès le premier jour. En écho TNS : PWA refusée
  par l'évaluateur → pivot vers une app mobile native Expo en réutilisant la même API.
- **Preuves :** arborescence avant (décrite)/après (capture includes/), commits TDD ;
  pour TNS : `apps/mobile` + note d'architecture.
- **Limite :** la v1 n'étant pas versionnée, l'« avant » repose sur ton témoignage
  (et celui de Jordan/Guillaume si attestation).

### C2.3 — Circulation des documents (workflow)
- **Contexte :** 🏢 principal.
- **Angle :** LE flux documentaire réel de l'agence : plugin sur le site client →
  rapport CSV/JSON (pull REST ou push webhook) → dashboard central → enrichissement
  GSC → mail mensuel au client (jour paramétré par client) → journal d'envoi + pixel
  d'ouverture. **PRODUIRE le diagramme de ce workflow** (draw.io, 1 page) — c'est le
  livrable qui manquait au blanc.
- **Preuves :** diagramme À PRODUIRE ; `artisan-cron-emails.php` ; `email_log`.

### C2.4 — Modéliser une base de données
- **Contexte :** 🎓 principal.
- **Angle :** 15 entités TypeORM, relations, contraintes, migration versionnée
  (`1782672862490-Init.ts`). **PRODUIRE le MCD** (draw.io/dbdiagram à partir des
  entités — le jury blanc l'exigeait). Roofline : conception de la table `clients`
  et arbitrage dénormalisation JSON vs relationnel (assumé et expliqué).
- **Preuves :** MCD À PRODUIRE ; migration ; `domain-model.md`.

### C2.5 — Urbanisation du SI
- **Contexte :** 🏢 principal (c'est du VRAI SI d'entreprise).
- **Angle :** la chaîne maintenance s'insère dans le SI de l'agence : sites WordPress
  clients (existants) + WSAL (existant) + dashboard central (nouveau) + webmail OVH
  (existant) + GSC (externe). Tu as urbanisé : chaque brique a un rôle, des contrats
  d'échange, sans remplacer l'existant.
- **Preuves :** schéma du SI (même diagramme que C2.3 avec les frontières systèmes).

### C2.6 — Choisir le degré de réutilisation (backlog, sprints)
- **Contexte :** 🎓 principal.
- **Angle :** backlog priorisé P0/P1/P2 de 73 tâches (CSV répartition), règle « pas de
  bonus avant P0 » tenue (leaderboard équipe sacrifié, chat livré). Réutilisation
  choisie : shared-types plutôt que duplication, MockProvider réutilisé par le sync
  Steam.
- **Preuves :** capture du CSV Kanban (déjà en annexe du blanc, la garder) ;
  mvp-scope P0/P1/P2.

### C2.7 — Estimer les délais
- **Contexte :** 🏢 principal (preuve nette qui manquait totalement au blanc).
- **Angle :** ROADMAP.md : 17 tâches TOUTES estimées en heures, horodatées, cochées,
  avec dépendances — et l'audit qui chiffre le reste à faire (68-90 h). TNS : tailles
  S/M/L par tâche + 9 sprints tenus.
- **Preuves :** capture ROADMAP (colonnes estimation/statut) ; AUDIT §plan.
- **Limite :** pas de Gantt — la roadmap datée en tient lieu, dis-le simplement.

### C2.8 — Coordonner un projet Agile
- **Contexte :** 🎓 principal.
- **Angle :** binôme avec Ioanes : répartition écrite (39/26/8 tâches), sprints S0→S8,
  branches + PR avec CI bloquante, contrat d'API comme point de synchronisation
  front/back. Anecdote : la PR #2 (13 commits mobile) mergée après checks verts.
- **Preuves :** capture GitHub (PR, branches, checks) ; CSV répartition.
- **Limite :** pas de cérémonies Scrum formelles (2 devs — rituels allégés, assumé).

### C2.9 — Clôturer une mission (recette)
- **Contexte :** 🎓 + 🏢.
- **Angle :** TNS : checklist de recette 15 points + PV de réception (livrables) — LE
  FAIRE SIGNER par Ioanes/référent école avant dépôt. Roofline : mise en prod +
  utilisation réelle sur 17 clients + retours clients positifs (via la gérante).
- **Preuves :** PV signé (À FAIRE) ; checklist exécutée avec captures ; capture du
  dashboard prod connecté.

### C2.10 — Présenter les livrables aux décideurs
- **Contexte :** 🏢 principal (était NA au blanc).
- **Angle :** l'interface est née d'un échange avec LA GÉRANTE (décideuse) : besoin
  exprimé → démo → ajustements → adoption en prod. C'est une vraie présentation à
  décideur, pas un scénario de soutenance. TNS : supports d'oral + parcours de démo
  répété.
- **Preuves :** attestation Roofline mentionnant la commande/validation par la
  gérante (À OBTENIR) ; supports d'oral TNS.

### C2.11 — Procédure d'intégrabilité (ITIL, bon à intégrer)
- **Contexte :** 🎓 + 🏢 (deux pipelines différents = excellente comparaison).
- **Angle :** TNS : CI GitHub Actions BLOQUANTE (lint zéro-warning + build + tests +
  e2e sur Postgres/Redis provisionnés) = « bon à intégrer » automatisé ; Docker
  multi-tiers reproductible. Roofline : pipeline de DÉPLOIEMENT réel (build Vite +
  rsync SSH vers OVH + exclusions données + cache artisan post-deploy, secrets
  GitHub). Compare les deux : l'un protège l'intégration, l'autre automatise la
  livraison — et dis ce que tu ferais converger (tests dans le pipeline Roofline).
- **Preuves :** ci.yml + deploy.yml annotés ; capture run vert de chaque.
- **Limite :** le pipeline Roofline ne lance pas les tests avant de déployer — tu
  l'as identifié comme axe d'amélioration (l'audit du dépôt le dit aussi).

### C2.12 — Environnement collaboratif
- **Contexte :** 🏢 + 🎓.
- **Angle :** Roofline : v1 du plugin AVEC Jordan (reprise de code d'autrui = la
  collaboration la plus concrète qui soit), missions annexes sur les projets de
  Jordan et Guillaume, tutorat de Guillaume Jos. TNS : binôme, reviews de PR,
  conventions communes.
- **Preuves :** attestation (rôles) ; CONTRIBUTING ; PR reviewée.

### C2.13 — Communication FR/EN
- **Contexte :** 🎓 (critère bloquant, désormais couvert).
- **Angle :** README.en.md complet (traduction professionnelle du README), Swagger et
  code en anglais, doc FR pour l'équipe — choix de langue PAR AUDIENCE, explique-le.
- **Preuves :** capture README.en.md côte à côte avec le FR ; Swagger.

---

## BC03 — Développer des applications numériques

### C3.1 — Lever les doutes (ressources, expert externe)
- **Contexte :** 🎓 anecdote précise.
- **Angle :** les notifications push mobiles : doute → lecture de la doc Expo →
  constat que le push est impossible dans Expo Go → solution de repli conçue
  (bannière in-app sur socket global). Cite aussi le recours au tuteur Guillaume
  (senior) chez Roofline et l'usage ENCADRÉ de l'IA (AI_USAGE_POLICY).
- **Preuves :** doc Expo citée ; `useGlobalNotifications.ts` + NotificationBanner.

### C3.2 — Décomposer un problème complexe
- **Contexte :** 🏢 principal.
- **Angle :** « centraliser la maintenance de 17 clients » décomposé en : collecte
  (plugin par site) / transport (CSV+API+webhook) / agrégation (dashboard) /
  enrichissement (GSC) / restitution (mails programmés) / surveillance (monitoring
  cron). Chaque sous-problème = un module nommé. TNS en écho : chaîne de notification
  mobile (socket → store → bannière → navigation).
- **Preuves :** le diagramme C2.3 ; arborescence app/Services (15 services nommés).

### C3.3 — Traduire une solution algorithmique en code
- **Contexte :** 🏢 + 🎓.
- **Angle :** l'algo des mouvements de mots-clés GSC : 2 fenêtres glissantes de 28 j,
  détection de la dernière date disponible (J-1→J-7), calcul entrées/sorties/deltas
  de position. Et le score TNS : `(K/D×50)+(winrate×40)+(matchs×0.5)` avec fonction
  pure testée. Montre le code des DEUX.
- **Preuves :** `GoogleSearchConsoleService.php:180-300` ; `score.calculator.ts` +
  son spec.

### C3.4 — Modifier un algorithme existant sans dysfonctionnement
- **Contexte :** 🏢 + 🎓 (preuves multiples, était NA).
- **Angle :** trois cas réels : (1) reprise du code v1 de Jordan → refonte sans perte
  fonctionnelle ; (2) migration JSON→SQL en 3 phases avec fallback puis suppression ;
  (3) TNS : passage en TypeScript strict + refactor de 10 effets React, validés par
  les 22 tests qui n'ont jamais cassé.
- **Preuves :** commits des 3 phases ; diff refactor TNS + tests verts avant/après.

### C3.5 — Déverminer et interpréter les erreurs
- **Contexte :** les deux — tu as QUATRE vrais bugs avec message d'erreur (question
  11 du jury couverte plusieurs fois).
- **Angle :** choisis-en deux et raconte-les à fond : (1) le dashboard mobile
  affichait « Jeu » au lieu du nom → cause : types dupliqués divergents
  (`gameName` vs `game.name`) → fix + prévention (package de types partagés) ;
  (2) SyntaxError JS sur la page API du plugin → cause : guillemets typographiques
  introduits par mon script Python de refactoring → leçon : revalider toute
  transformation automatisée. En réserve : 504 OVH résolu par CDN ; reconnexion
  socket qui ne re-joignait pas les rooms.
- **Preuves :** diff du fix gameName ; capture de la SyntaxError console ; commit CDN.

### C3.6 — Intégrer des éléments hétérogènes (+ RSE)
- **Contexte :** 🏢 principal.
- **Angle :** un même pipeline orchestre : plugin WordPress (CSV base64/JSON), API
  Google (OAuth2 + refresh token), SMTP OVH (mails), cron OVH (planification),
  SQLite (stockage), IA (audit semi-manuel). TNS : Steam + Redis + Socket.io.
  **RSE (obligatoire, absent au blanc)** : écris 5 lignes concrètes — cache Redis et
  pagination réduisent les requêtes ; check GSC hebdomadaire et non quotidien ;
  pauses anti-quota ; PWA NetworkFirst limite le trafic répété ; sobriété du choix
  SQLite (pas de serveur BDD dédié).
- **Preuves :** `artisan-cron.php` ; config OAuth ; extraits cités en §BC04.

### C3.7 — Jeux d'essai et tests unitaires
- **Contexte :** les deux (force majeure du dossier).
- **Angle :** 91 tests PHPUnit/WP_Mock côté plugin (TDD), 46 unit + 8 e2e + 22 front
  côté TNS, exécutés en CI bloquante. Détaille UN test parlant de chaque côté :
  le test anti-injection CSV (plugin) et le test e2e « un non-membre ne lit pas le
  chat » (TNS). Plan de tests écrit en livrable.
- **Preuves :** captures des sorties de tests (À FAIRE) ; plan-de-tests.md ; extraits
  des 2 tests choisis.

### C3.8 — Rendre compte de son activité
- **Contexte :** 🏢 + 🎓.
- **Angle :** ROADMAP horodatée tâche par tâche (Roofline), CRA (livrable TNS),
  historique git nominatif structuré (feat/fix/docs), kanban à statuts. Montre un
  extrait de git log annoté.
- **Preuves :** CRA ; ROADMAP ; `git log --oneline` capturé des deux dépôts.

---

## BC04 — Réaliser une interface d'échange de données informatisées

### C4.1 — Rétro-documentation
- **Contexte :** 🎓 principal (preuve récente et réelle).
- **Angle :** l'audit de juillet a révélé une dérive doc↔code : j'ai rétro-documenté
  l'API réelle — `api-contract.md` resynchronisé (formats d'erreur réels, routes
  réellement implémentées, modules non documentés ajoutés : friends, messages
  privés, achievements…) et `architecture.md` mis à jour (3 apps). Roofline :
  AUDIT_2026-06-15.md = rétro-analyse formalisée de l'existant.
- **Preuves :** diff api-contract.md (avant/après) ; AUDIT.

### C4.2 — Tables de correspondance de données
- **Contexte :** 🏢 principal (était NA).
- **Angle :** trois mappings explicites : (1) champs du formulaire d'import bulk →
  colonnes BDD (`updateBulkClientLinks` : `url_client→site_url`,
  `gsc_property_url→gsc_config.property_url`…) ; (2) réponse JSON du plugin →
  structure stable normalisée (`normalizeResponse`) ; (3) TNS : `RawStats` des
  providers → entité `PlayerStats`. Présente le premier sous forme de table dans le
  dossier (colonnes source → destination → transformation).
- **Preuves :** `ClientSqlDatabaseService.php:114-162` ; `normalizeResponse` ;
  `upsertStats`.

### C4.3 — Produire des données par agrégation/calcul (+ RGPD)
- **Contexte :** 🎓 + 🏢.
- **Angle :** données calculées inexistantes à la source : K/D, winrate, score,
  rang (TNS) ; CTR, positions moyennes, mouvements de mots-clés (GSC). **RGPD réel
  et implémenté** (absent au blanc) : export portabilité `GET /users/me/export`,
  droit à l'oubli `DELETE /users/me` (transactionnel), bannière de consentement,
  page confidentialité, données de démo fictives.
- **Preuves :** endpoints RGPD + test e2e RGPD ; `GoogleSearchConsoleService` métriques.

### C4.4 — Importation/exportation entre logiciels (sync/async)
- **Contexte :** 🏢 principal — C'EST LA COMPÉTENCE STAR DU DOSSIER.
- **Angle :** deux logiciels QUE J'AI ÉCRITS échangent : export CSV normalisé
  (BOM UTF-8, sections) + payload JSON versionné `/v1/` avec CSV base64 + SHA-256
  vérifié à la réception. Deux modes : pull REST synchrone, push webhook asynchrone.
  En aval : exports CSV multi-formats du dashboard, envois mail programmés par cron
  (asynchrone), et TNS : une API consommée par DEUX clients (web + mobile) en
  REST + Socket.io.
- **Preuves :** extrait du CSV réel ; payload JSON (Swagger du plugin) ; webhook
  controller ; tableau sync/async (déjà dans preuves-roofline.md).

### C4.5 — Scripts système / environnement de test
- **Contexte :** 🎓 + 🏢 (était NA — c'est désormais du solide).
- **Angle :** TNS : environnement multi-tiers scripté — docker-compose (api, web,
  Postgres, Redis, healthchecks), Dockerfiles multi-stage, CI qui PROVISIONNE
  Postgres+Redis comme services pour les e2e, migrations + seed scriptés.
  Roofline : wrappers cron PHP autonomes sur OVH (bootstrap Laravel manuel, failover,
  logging, monitoring) + rsync de déploiement avec exclusions de données.
- **Preuves :** docker-compose.yml + ci.yml (bloc services) ; artisan-cron.php
  annoté ; deploy.yml.

---

## Annexes à produire (checklist matérielle)

- [ ] **Attestation Roofline** (Guillaume Jos) : contexte, rôle de Clément sur les
      2 outils, autonomie, mise en prod, 17 clients. (Je peux rédiger le modèle.)
- [ ] **Captures datées** : CI TNS verte (lint+tests+e2e) · sorties de tests (3 suites
      TNS + PHPUnit plugin) · dashboard Roofline EN PROD connecté (masquer les données
      clients) · un mail mensuel reçu (anonymisé) · Swagger TNS · app mobile dans
      Expo Go · commits git des 2 dépôts · Lighthouse 100/100.
- [ ] **Diagrammes** : workflow documentaire Roofline (C2.3/C2.5) · MCD TNS (C2.4) ·
      schéma d'architecture TNS 3 apps + shared-types (C1.3).
- [ ] **PV de recette TNS signé** + checklist exécutée.
- [ ] **Matrice de risques** 5 lignes (C1.8).
- [ ] Corrections rapides avant jury : bug guillemets du plugin (le corriger et le
      raconter), header « Author: Ton Nom » du plugin, README du dépôt interface
      (remplacer le template Laravel), retirer la route debug morte.
- [ ] Page de garde : retirer « Date du jury : 13 Mai » (incohérente), pagination
      réelle de la table des matières.
