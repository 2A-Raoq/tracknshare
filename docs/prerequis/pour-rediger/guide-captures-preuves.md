# Guide de captures de preuves — annexes du dossier CDAN

> **Principe (rappel du jury blanc)** : une capture ne vaut rien sans légende.
> Pour CHAQUE capture, note au moment où tu la prends : la date, la commande ou
> l'URL, et la compétence qu'elle illustre. Dans le dossier, chaque capture aura
> 2-3 lignes : *ce qu'elle montre, ce qu'elle prouve, ce qu'elle ne prouve pas*.
> Format conseillé : plein écran avec l'horloge Windows visible, ou terminal
> avec le prompt complet (chemin + commande visibles).

## A. Track'N Share — préparation commune

```bash
cd c:\Users\codcl\Documents\GitHub\tracknshare
docker compose up -d          # Postgres + Redis (+ api/web conteneurisés)
pnpm install
```

### A1. CI GitHub Actions verte (C1.2, C2.11, C3.7)
1. Ouvre https://github.com/2A-Raoq/tracknshare/actions
2. Clique sur le dernier run vert de `main` (mergé) → capture la **vue d'ensemble**
   (jobs `Lint · Build · Test` + `Typecheck Mobile` verts, durée, commit).
3. Déplie l'étape **Test API (e2e)** → capture la sortie « 8 passed » avec les
   services Postgres/Redis visibles en haut du job.
4. Déplie l'étape **Lint API** ou **Lint Web** → capture « 0 problems ».
   ⚠️ Si le dernier run date d'avant la passe qualité, pousse un commit (ou
   relance le workflow via « Re-run all jobs ») pour avoir un run daté récent.

### A2. Sorties de tests locales (C1.5, C3.7)
```bash
pnpm --filter api test          # capture : 10 suites, 46 tests verts
pnpm --filter web test -- --run # capture : 5 fichiers, 22 tests verts
pnpm --filter api test:e2e      # (Docker lancé) capture : 8 e2e verts
cd apps/mobile && npx tsc --noEmit && npx expo lint   # capture : aucune erreur
```
Prends la **fin** de chaque sortie (résumé) avec la commande visible.

### A3. Lighthouse accessibilité 100/100 (C1.7)
```bash
pnpm --filter web build
pnpm --filter web exec vite preview --port 4173
# Dans un 2e terminal — le rapport HTML s'ouvre tout seul :
npx lighthouse http://localhost:4173/login --only-categories=accessibility --view
```
Capture la jauge **100** + la liste des audits passés. Refais-le sur
`http://localhost:4173/leaderboard` (2 captures suffisent, le tableau §4.1 de
`audit-rgaa.md` couvre le reste).

### A4. Swagger (C2.13, BC04)
```bash
pnpm --filter api start:prod    # ou : docker compose up -d (api conteneurisée)
```
Ouvre http://localhost:3000/docs → capture (1) la vue d'ensemble des tags
(auth, users, teams, stats, leaderboards, messages, friends…), (2) le détail
d'un endpoint avec son DTO (ex. `POST /api/auth/register`) et le cadenas
Bearer visible.

### A5. Application lancée — parcours de démo (C2.9, C2.10)
```bash
pnpm --filter api seed    # si base vierge
pnpm dev                  # web sur :5173
```
Connecte-toi avec `demo@tracknshare.local` / `Demo1234!` et capture :
dashboard (stats + score), leaderboard, détail équipe, **chat d'équipe avec un
message envoyé en temps réel** (2 fenêtres côte à côte = preuve socket), page
privacy (RGPD). Coche au fur et à mesure la checklist de recette
(`checklist-demo.md`) → c'est ta recette exécutée + datée.

### A6. App mobile dans Expo Go (BC03, C1.7)
1. Mets à jour `apps/mobile/.env` avec l'IP LAN actuelle de ton PC
   (`ipconfig` → IPv4), API lancée.
2. `cd apps/mobile && npm start` → scanne le QR avec Expo Go.
3. Captures téléphone : login, dashboard (nom des jeux visibles — c'est le bug
   corrigé !), chat d'équipe, bannière de notification in-app (envoie un message
   depuis le web pendant que le mobile est sur un autre écran).

### A7. Git nominatif (C2.8, C3.8)
```bash
git log --oneline --graph -25          # capture
git shortlog -sne                      # capture (tes commits)
```
Ouvre aussi la PR #2 mergée sur GitHub → capture (checks verts + merge).

### A8. PWA installable (C1.3, bonus)
Dans Chrome sur http://localhost:4173 (après `vite preview`) : DevTools →
Application → Manifest (capture « Track'N Share » + icônes) et Service Workers
(sw.js actif). Bonus : l'icône d'installation dans la barre d'adresse.

## B. Roofline — captures côté entreprise (de ton poste)

### B1. Dashboard en production (C2.9, C2.11, C4.4)
- Connecte-toi à l'interface en prod → capture la **page de login** (URL visible)
  puis le **dashboard connecté** : liste des clients (⚠️ **floute noms/domaines
  clients** — garde juste le compteur « 17 »), un rapport importé avec sa période,
  la section GSC d'un client (métriques floutées si besoin).
- Capture la page **monitoring des crons** (santé des tâches planifiées).

### B2. Mail mensuel réel (C4.4, C2.10)
Retrouve un rapport mensuel envoyé (boîte `contact@roofline.fr` ou copie CC) →
capture l'e-mail reçu, en-têtes visibles (date, objet), contenu anonymisé.

### B3. Pipeline de déploiement (C2.11)
GitHub → `clement-fbe/rapport-maintenance-interface` → Actions → dernier run
de `deploy.yml` vert → capture (étapes build Vite + rsync + artisan visibles).

### B4. Plugin sur un site client (BC01)
Admin WordPress d'un site en maintenance → page du plugin : capture la
checklist par forfait remplie + la section « mises à jour collectées »
(données client floutées), et la page de config API (token **masqué**).

### B5. Tests du plugin (C3.7)
```bash
cd <clone de rapport-maintenance>
composer install && composer test     # capture : 91 tests verts
```

### B6. ROADMAP + AUDIT (C2.7)
Capture d'écran de `ROADMAP.md` rendu sur GitHub (tâches estimées/cochées avec
dates) et du sommaire d'`AUDIT_2026-06-15.md`.

## C. Règles d'anonymisation

- **Toujours flouter** : noms/domaines des clients Roofline, adresses e-mail
  clients, tokens/clés (même partiels), IP publiques.
- **Jamais dans le dossier** : mots de passe, `.env`, contenu des messages
  privés TNS (même de démo, par principe — montre l'UI, pas les payloads).
- Les identifiants de démo TNS (`demo@tracknshare.local`) sont publics par
  design : OK de les montrer.

## D. Organisation des fichiers

```
docs/prerequis/annexes-captures/
  A1-ci-verte-YYYYMMDD.png
  A2-tests-api-46.png
  ...
  B1-dashboard-prod-anonymise.png
```
Nomme chaque fichier par sa référence (A1…B6) + date : tu pourras citer
« Annexe A3 » depuis le corps du dossier sans te perdre.
