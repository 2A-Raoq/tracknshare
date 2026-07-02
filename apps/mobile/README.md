# Track'N Share — Application mobile (Expo / React Native)

Application mobile native qui consomme l'**API NestJS** du projet (mêmes
comptes, mêmes données, même base PostgreSQL). C'est un **client séparé** :
aucun backend ni base de données spécifique à l'app mobile.

## Prérequis
- Le backend doit tourner (`docker compose up` à la racine du repo) — API sur le port 3000.
- Node 20+, et l'app **Expo Go** sur ton téléphone (ou un émulateur Android / simulateur iOS).

## Installation
```bash
cd apps/mobile
npm install
```
> Cette app est **hors du workspace pnpm** (voir `pnpm-workspace.yaml`) pour
> éviter les soucis de symlinks avec Metro : on utilise `npm` ici.

## Configuration de l'URL de l'API
Par défaut, l'app cible automatiquement :
- **Émulateur Android** : `http://10.0.2.2:3000/api`
- **Simulateur iOS / web** : `http://localhost:3000/api`

Pour un **téléphone physique** (via Expo Go), il faut pointer vers l'IP locale
de ta machine. Crée un fichier `.env` :
```
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.X.X:3000
```
(remplace `192.168.X.X` par l'IP LAN de ton PC ; `ipconfig` sous Windows).

## Lancer
```bash
npm start          # QR code à scanner avec Expo Go
npm run android    # émulateur Android
npm run ios        # simulateur iOS (macOS)
```

## Comptes de démo
Mêmes comptes que le web (mot de passe `Demo1234!`) :
`demo@tracknshare.local`, `ace@tracknshare.local`, etc.

## Structure
- `src/app/` — écrans (Expo Router, routing par fichiers)
  - `(auth)/` — login, register
  - `(tabs)/` — dashboard, leaderboard, teams, profile
  - `teams/[id]/` — détail d'équipe, chat
- `src/services/` — appels à l'API NestJS
- `src/store/` — état d'auth (Valtio)
- `src/lib/` — client axios (JWT), stockage sécurisé du token
- `src/components/ui.tsx` — primitives UI (thème sombre gaming)
