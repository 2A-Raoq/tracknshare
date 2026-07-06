# Preuves entreprise (Roofline) — analyse des 2 dépôts d'alternance

> Document de travail pour la réécriture du dossier CDAN (RNCP 36463).
> Analyse du 2026-07-07 des dépôts `clement-fbe/rapport-maintenance` (plugin WordPress)
> et `clement-fbe/rapport-maintenance-interface` (dashboard Laravel).
> Objectif : combler le manque n°1 du jury blanc — « aucune mission d'alternance concrète ».

## Le récit d'ensemble (l'histoire à raconter)

Chez Roofline, la maintenance mensuelle des sites clients était suivie à la main.
J'ai conçu et développé **une chaîne outillée complète en deux logiciels** :

1. **Plugin WordPress « Rapport Maintenance »** (PHP, from scratch, ~5 600 lignes,
   91 tests PHPUnit) — installé sur les sites clients : collecte automatique des
   mises à jour (via les logs WP Activity Log), checklist de maintenance paramétrée
   par forfait (4 niveaux), génération d'un rapport CSV normalisé, exposition
   REST + webhook sortant.
2. **Interface « rapport-maintenance-interface »** (Laravel 13 / PHP 8.3,
   ~16 000 lignes, déployée sur OVH via CI/CD GitHub Actions) — agrège les
   rapports de tous les sites (pull REST **et** push webhook), les enrichit avec
   les données **Google Search Console** (OAuth2 + refresh token), et envoie aux
   clients des **rapports mensuels programmés** par SMTP OVH (jour d'envoi par
   client, journal d'envoi, pixel de tracking d'ouverture), avec monitoring des
   crons et alerting.

Le pont entre les deux est un **contrat de données explicite** : CSV UTF-8 BOM
structuré + payload JSON versionné (`/rapport-maintenance/v1/`) avec **CSV en
base64 et hash SHA-256 vérifié à la réception (`hash_equals`)**. C'est un cas
réel et complet d'« interface d'échange de données informatisées » (BC04).

## Mapping par bloc (preuves fichier:ligne)

### BC01 — Conception sécurisée
| Preuve | Où |
|---|---|
| CSRF : nonces sur les 9 handlers AJAX + actions admin | plugin `includes/ajax.php:8-16`, `includes/admin.php:113` |
| Contrôle d'accès systématique (`current_user_can`) | plugin `ajax.php:13`, `admin.php:357/805/1706/1877` |
| Requêtes préparées `$wpdb->prepare` | plugin `rapport-maintenance.php:341-356`, `cron.php:37-51` |
| Token API comparé à temps constant (`hash_equals`) | plugin `admin.php:34-52` |
| Anti-injection de formule CSV (=,+,-,@) **testée unitairement** | plugin `pdf.php:4-13` + `tests/PdfTest.php` |
| Durcissement dossier d'export (.htaccess -Indexes + index.php) | plugin `pdf.php:32-46` |
| Whitelists + regex de validation (`^\d{4}-\d{2}$`) | plugin `helpers.php:100/167-171` ; interface `MaintenanceWebhookRequest.php:14-54` |
| Intégrité inter-logiciels : SHA-256 vérifié | interface `WordPressMaintenanceReportApiService.php:136-141` |
| CSRF OAuth (state + hash_equals) et refresh token auto | interface `GoogleSearchConsoleOAuthService.php:16-36, 74-105` |
| Auth + rôle super_admin (middleware) | interface `routes/web.php:25,66-68`, `EnsureSuperAdmin.php` |

### BC02 — Pilotage DevOps
| Preuve | Où |
|---|---|
| **CI/CD réel en production** : build Composer+Vite, rsync SSH vers OVH, secrets GitHub Actions, cache artisan post-deploy | interface `.github/workflows/deploy.yml:1-69` |
| Roadmap suivie : 17 tâches P0→P3 estimées/horodatées/cochées | interface `ROADMAP.md` |
| Audit formalisé avec plan d'action chiffré (68-90h) et 13 TODOs sécurité | interface `AUDIT_2026-06-15.md` |
| Procédure de mise en prod pas-à-pas (backup→migrate→verify→rollback) | interface `ROADMAP.md:550-558`, `docs/LEGACY_FIELDS_MIGRATION.md` |
| Supervision : monitoring cron + alerting + dashboards admin | interface `CronMonitoringService.php`, `AlertingService`, `web.php:96-99` |
| Git structuré (feat/fix/docs/refactor), TDD tracé dans les commits | plugin commits `bba85b9`, `7d58466`, `c34004c` |
| Outillage de refactoring sur mesure (script Python de découpe) | plugin `split_admin_menu.py` |

### BC03 — Développement
| Preuve | Où |
|---|---|
| 91 tests PHPUnit + WP_Mock (WordPress mocké, $wpdb Mockery, dates figées) | plugin `tests/*`, `phpunit.xml.dist`, `composer test` |
| Tests interface : PHPUnit Feature/Unit (~24 fichiers) + Playwright E2E | interface `tests/`, `playwright.config.ts` |
| **Intégration hétérogène (C6)** : WordPress (CSV/JSON) + Google GSC (OAuth2/REST) + SMTP OVH + IA, normalisés vers un modèle unique | interface `artisan-cron.php:26-63`, `MonthlyReportMailService.php:168-203` |
| Algorithme métier : calcul des mouvements de mots-clés GSC sur 2 fenêtres de 28 j | interface `GoogleSearchConsoleService.php:180-300` |
| Migration structurante JSON DB → SQL en 3 phases (refactor sans régression) | interface commits `f33a3cb`, `0178182`, `1505bbe`, `3f59c8b` |
| Manipulation de dates robuste (DateTimeImmutable + wp_timezone) | plugin `helpers.php:112-138` |

### BC04 — Échange de données
| Preuve | Où |
|---|---|
| API REST exposée versionnée (`/rapport-maintenance/v1/…`) | plugin `rapport-maintenance.php:282-296` |
| **Deux modes d'échange** : pull synchrone (REST) + push asynchrone (webhook) | plugin `build_dashboard_payload` ; interface `routes/api.php:11` |
| **Table de correspondance** formulaire/CSV → colonnes BDD | interface `ClientSqlDatabaseService.php:114-162` (updateBulkClientLinks) |
| Normalisation réponse plugin → structure stable | interface `WordPressMaintenanceReportApiService.php:88-189` |
| Exports CSV multi-formats (clients, rapports, GSC) | interface `ClientCsvExportService.php:16-128` |
| Flux asynchrone programmé : cron OVH → envoi mails par jour client + journal | interface `artisan-cron-emails.php`, `MonthlyReportMailService.php:50-89`, `logEmailSend` |
| Agrégation/calcul de données indisponibles (CTR, positions, mouvements) | interface `GoogleSearchConsoleService.php:305-413` |

## Anecdotes pour l'oral (vraies, traçables)

1. **Arbitrage de sécurité conscient** : désactivation de la protection anti-SSRF de
   `wp_remote_post` (`reject_unsafe_urls => false`) pour autoriser un dashboard en
   IP locale en dev — commits « fix URL validation for local IPs ». Défense : choix
   motivé, tracé, encadré (token d'auth), à réactiver en prod.
2. **Bug réel avec message d'erreur** (question 11 du jury blanc) : guillemets
   typographiques `'…'` introduits par le script Python de refactoring dans le JS
   de la page « API Mises à jour » (plugin `admin.php:1786-1862`) → SyntaxError,
   bouton « Régénérer le token » cassé. Leçon : toute transformation automatisée
   doit être revalidée. (→ à corriger avant la soutenance, le fix est trivial.)
3. **Fix de prod concret** : 504 Gateway Timeout sur OVH résolu en passant les
   assets par CDN (interface, commit `47a49e4`) + exclusion de `database.sqlite`
   du rsync pour ne pas écraser les données en déploiement (`4ad9277`).
4. **Respect des quotas d'API** : pause aléatoire 2-5 s entre clients lors du
   check GSC, planifié le lundi 3h UTC (interface `CheckGscForClients.php:62-64`,
   ROADMAP) — décision documentée.
5. **TDD réel** : cycle rouge/vert visible dans les messages de commits du plugin.
6. **Réingénierie vécue (la meilleure)** : reprise de la v1 du plugin
   (co-développée avec Jordan Nickol : 1 fichier PHP, zéro test, récupération
   « bricolée », pas de git) → refonte structurée en modules avec TDD, API REST
   et webhook. Avant/après concret, collaboratif puis autonome, avec une leçon
   (« versionner dès le premier jour »).
7. **Dialogue avec le décideur** : l'interface est née d'un échange avec la
   gérante (besoin : centraliser 17 rapports clients) — traduction d'un besoin
   métier exprimé oralement en solution outillée livrée en prod.

## ⚠️ À NE PAS survendre (et questions à préparer)

- **« BDD sur OVH » = SQLite** (pas MySQL) : `.env.example` `DB_CONNECTION=sqlite`,
  fichier exclu du rsync. Dire « base SQLite hébergée sur l'espace OVH ».
- **Historique git reconstitué** : les 2 dépôts sont des re-publications récentes
  (plugin : 9 commits sur 3 jours ; interface : 50 commits, hashes cités par
  l'audit absents de l'historique). Email de commit = Ynov, pseudo `2A-Raoq`.
  → prévoir une **attestation Roofline** + captures de la prod
  (`dashboard.roofline.fr`) pour établir le lien nominatif et la réalité prod.
- **La CI déploie sans lancer les tests** — à présenter comme axe d'amélioration
  identifié (l'audit du dépôt le dit lui-même).
- Résidus connus : commande cron `clients:prune-legacy-all-clients` inexistante
  (échoue silencieusement le lundi 2h), route debug `/debug/json-db` référençant
  une classe supprimée, double scheduling (wrappers cron vs Laravel Scheduler)
  aux cadences divergentes, token webhook comparé sans `hash_equals`.
  → soit corriger avant le jury, soit les assumer comme dette tracée.
- Plugin : procédural (pas de POO) ; `admin.php` 2 124 lignes ; couverture de
  tests partielle (fonctions pures/AJAX, pas le rendu ni le REST de bout en bout) ;
  pas de PDF malgré le nom `pdf.php` ; versions incohérentes (3/3.2/3.4) ;
  header « Author: Ton Nom » à corriger.
- Audit « IA » de l'interface : workflow semi-manuel (copier-coller), pas un
  appel API automatisé.

## Contexte entreprise (réponses de Clément, 2026-07-07)

- **Échelle réelle** : **17 clients en maintenance** (Roofline inclus). L'interface
  tourne **en production** avec authentification (identifiants de connexion).
- **Tuteur entreprise** : **Guillaume Jos**, développeur senior chez Roofline
  → source naturelle de l'attestation nominative demandée par le jury.
- **Équipe** : agence web ; collègue développeur **Jordan Nickol** ; gérante en
  contact direct avec les clients.
- **Genèse du plugin (récit de réingénierie — BC02-C2 / BC03-C4)** :
  la **v1 a été co-développée avec Jordan Nickol** : un seul fichier PHP, sans
  tests, récupération du rapport « bricolée », **sans versionning** (le git est
  venu après). Clément a ensuite **repris et réécrit le plugin seul** :
  découpage en `includes/`, démarche TDD (91 tests PHPUnit + WP_Mock), API REST
  versionnée, webhook. → C'est une vraie réingénierie d'un existant, et cela
  **explique honnêtement l'historique git court** : le code v1 n'était pas
  versionné, le dépôt actuel est la re-publication propre de la refonte.
- **Genèse de l'interface (besoin → cadrage — BC01-C1 / BC02-C10)** : idée
  **co-construite entre la gérante et Clément** pour centraliser les rapports de
  tous les sites. Interlocuteur décideur = la gérante.
- **Re-publication des dépôts** : volonté de regrouper tous ses projets sur un
  seul compte GitHub (avant : éparpillés entre plusieurs comptes). Défendable
  tel quel à l'oral.
- **Retours clients** : recueillis par la gérante au téléphone — clients
  **satisfaits de la prestation**. (Formuler prudemment : retour indirect,
  pas de verbatim écrit.)
- **Autres activités Roofline (mentions secondaires possibles)** : création de
  sites WordPress (peu valorisable RNCP, assumé), **automatisations de process
  avec Make/IA et Automa** (utilisable en une phrase pour BC02 — automatisation
  de processus d'agence), un plugin Prestashop (expérience vécue, peut servir
  d'exemple de contrainte technique subie), missions annexes sur les projets de
  Jordan et Guillaume (preuve de travail en équipe existante — BC02-C12).
