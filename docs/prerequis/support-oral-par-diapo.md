# Track'N Share — Support oral, diapo par diapo (20 min)

> Compagnon de présentation : suit **l'ordre exact des 18 diapos** de la soutenance (`TrackNShare-Soutenance.pdf`).
> Pour chaque diapo : **⏱ durée**, **🎤 qui parle**, **ce qu'il dit**, et les **fichiers à citer** si le jury creuse.
> Détail technique complet fichier par fichier → voir [`explication-projet-et-code-oral.md`](docs/prerequis/explication-projet-et-code-oral.md).
>
> **Objectif : 20 min, démo web + mobile comprise.** Le plan ci-dessous vise **19 min 30** → ~30 s de marge pour les transitions.
> Règle d'or : une diapo = **1 à 2 idées fortes**, on ne lit pas la slide, on la commente.

## Minutage global

| # | Diapo | Durée | Cumul | Intervenant |
|---|---|---|---|---|
| 1 | Titre | 0:20 | 0:20 | Les deux |
| 2 | Présentation projet & binôme | 0:30 | 0:50 | Les deux |
| 3 | Le projet en une slide | 0:45 | 1:35 | Clément |
| 4 | Organisation & méthodologie | 0:45 | 2:20 | Les deux |
| 5 | Architecture globale | 1:15 | 3:35 | Ioane |
| 6 | Modèle de données | 0:50 | 4:25 | Ioane |
| 7 | Parcours & fonctionnalités | 0:50 | 5:15 | **Clément** |
| 8 | Score & Leaderboard | 1:30 | 6:45 | Ioane |
| 9 | Multi-plateforme web/mobile | 1:30 | 8:15 | **Clément** |
| 10 | Sécurité | 1:15 | 9:30 | Ioane |
| 11 | Conformité RGPD | 0:50 | 10:20 | Ioane + Clément |
| 12 | Steam API | 0:50 | 11:10 | Ioane |
| 13 | Qualité & tests | 0:40 | 11:50 | Les deux |
| 14 | DevOps CI/CD | 0:50 | 12:40 | Ioane |
| 15 | Performance | 0:40 | 13:20 | Ioane |
| 16 | **Démo live (web + mobile)** | **4:30** | 17:50 | **Clément** (+ Ioane Swagger) |
| 17 | Difficultés & solutions | 1:00 | 18:50 | Chacun sa colonne |
| 18 | Bilan & conclusion | 0:40 | 19:30 | Les deux |
| — | **Marge / transitions** | 0:30 | **20:00** | — |

---

## Diapo 1 — Titre / page de garde · ⏱ 0:20
**Affiché** : « Track'N Share — Soutenance orale technique », binôme Clément (front web + mobile) & Ioane (back-end + DevOps + BDD).

**🎤 Clément dit** : « Bonjour, nous sommes Clément et Ioane. Nous vous présentons Track'N Share, notre projet fil rouge développé sur toute l'année. »
**🎤 Ioane dit** : « J'ai réalisé le back-end, la base de données et le DevOps ; Clément le front web et l'application mobile native. On vous montre le problème, l'architecture, quelques focus techniques, une démo, puis le bilan. »

---

## Diapo 2 — Présentation du projet & du binôme · ⏱ 0:30
**Affiché** : plateforme gaming de suivi/partage de stats (centralisation, compétition, social) ; 3 cartes (Projet fil rouge / Clément / Ioane).

**🎤 Clément dit** : « Track'N Share, en une phrase : une plateforme qui centralise les statistiques de jeu des joueurs pour les suivre, les comparer et les partager. »
**🎤 Ioane dit** : « Trois axes : la **centralisation** des stats, la **compétition** avec un leaderboard, et le **social** avec équipes et chat. »

---

## Diapo 3 — Le Projet en Une Slide (problème / cible / vision) · ⏱ 0:45
**Affiché** : problème (stats dispersées Steam/PSN/Xbox), cible (joueurs), + 3 encarts Centralisation / Couche sociale / Temps réel.

**🎤 Clément dit** :
- « Le **problème** : aujourd'hui, les stats d'un joueur sont éparpillées entre plateformes — Steam, PSN, Xbox — sans endroit unique pour les comparer ou les partager. »
- « Notre réponse : **une seule maison** où tout est centralisé — stats, score, classement, équipes, chat. »
- « La **vision** : un espace unifié où chaque joueur visualise, analyse et partage ses performances **en temps réel**. »

*Réf. vulgarisation* : Partie A de [`explication-projet-et-code-oral.md`](docs/prerequis/explication-projet-et-code-oral.md).

---

## Diapo 4 — Organisation & Méthodologie · ⏱ 0:45
**Affiché** : Agile / sprints, répartition des rôles, GitHub Projects (issues, PR reviews, milestones).

**🎤 Ioane dit** : « On a travaillé en **Agile**, par sprints, avec un backlog priorisé et des livraisons incrémentales. Le suivi se fait sur **GitHub Projects** : issues, PR reviews, milestones par sprint. »
**🎤 Clément dit** : « On s'est réparti clairement : moi le front web et le mobile, Ioane l'API, le DevOps et la base. Et on a **priorisé le MVP** avant tout bonus. »

---

## Diapo 5 — Vue d'Architecture Globale · ⏱ 1:15
**Affiché** : pile en 4 couches — Clients (Web + Mobile) → API NestJS → Cache Redis → PostgreSQL ; monorepo pnpm + Turborepo, partage de types.

**🎤 Ioane dit** :
- « Architecture **en couches**. Image simple : un restaurant — le client (le front) ne rentre jamais en cuisine. Résultat : **les calculs et les secrets restent côté serveur**, on ne peut pas tricher depuis l'extérieur. »
- « On est en **monorepo pnpm + Turborepo**, ce qui permet de **partager les types TypeScript** entre le web, le mobile et l'API : un seul contrat, cohérence garantie. »
- « **Redis** sert à deux choses : le **cache** du leaderboard (30 s) **et** le **rate limiting**. **PostgreSQL** est la base principale, notre source de vérité. »

**🎤 Clément ajoute** : « Côté clients, deux applications distinctes — web et mobile — mais qui parlent à **la même API**. »

*Réf. code* : [`app.module.ts`](apps/api/src/app.module.ts), [`redis.service.ts`](apps/api/src/redis/redis.service.ts).

---

## Diapo 6 — Modèle de Données · ⏱ 0:50
**Affiché** : entités (Users, GameAccounts, Stats/Scores, Teams, Messages, Seasons, Games, Leaderboard) + choix (3NF, migrations TypeORM, FK).

**🎤 Ioane dit** :
- « Les **entités clés** : Users, GameAccounts (comptes liés par plateforme), Stats/Scores, Teams avec membres et rôles, et Messages chiffrés. »
- « Choix : **normalisation 3NF** contre la redondance, **migrations TypeORM** pour versionner le schéma, et des **clés étrangères** avec intégrité référentielle. »
- « Point d'optimisation : un **index composite** (gameId, seasonId, score) qui accélère la requête de classement. »

*Réf. code* : [`player-stats.entity.ts`](apps/api/src/stats/entities/player-stats.entity.ts), migration [`Init`](apps/api/src/database/migrations/1782672862490-Init.ts).

---

## Diapo 7 — Parcours & Fonctionnalités Clés · ⏱ 0:50
**Affiché** : Dashboard, Statistiques détaillées, Leaderboard compétitif, Gestion d'équipes.

**🎤 Clément dit** :
- « Le **dashboard** : la vue centralisée des stats, avec les états **loading / erreur / vide** gérés proprement. »
- « Les **stats détaillées** : historique, courbes de progression. »
- « Le **leaderboard** : classement temps réel, filtres par jeu et saison, et route **publique** — consultable sans compte, ça incite à s'inscrire. »
- « Les **équipes** : création, invitation par code, et le chat qui apporte la dimension sociale. »

*Réf. code (front)* : [`DashboardPage.tsx`](apps/web/src/pages/DashboardPage.tsx), [`LeaderboardPage.tsx`](apps/web/src/pages/LeaderboardPage.tsx), [`TeamChatPage.tsx`](apps/web/src/pages/TeamChatPage.tsx).

---

## Diapo 8 — Focus Algorithmique : Score & Leaderboard ⭐ · ⏱ 1:30
**Affiché** : pipeline Réception → Calcul → Cache Redis → Réponse ; 3 encarts (Calcul back-end / Cache Redis / Cursor Pagination).

**🎤 Ioane dit** :
- « Le **score est calculé côté serveur, donc non falsifiable**. La formule : K/D × 50 + % de victoires × 40 + matchs × 0,5, avec des **fonctions pures**, faciles à tester. »
- « On met le classement en **cache Redis pendant 30 s** : on ne le recalcule pas à chaque requête. La clé est **invalidée à l'écriture**, et si Redis tombe, on retombe sur **PostgreSQL** — dégradation gracieuse. »
- « Enfin, **pagination par curseur** et non par offset : sur un classement qui bouge, l'offset crée des doublons ou des trous. Le curseur {score, id} pointe un endroit précis → **stable et rapide** car il utilise l'index. Petite astuce : on demande limit+1 pour savoir s'il reste une page **sans faire de COUNT**. »

*Réf. code* : [`score.calculator.ts`](apps/api/src/stats/utils/score.calculator.ts), [`leaderboards.service.ts`](apps/api/src/leaderboards/leaderboards.service.ts), [`http-cache.interceptor.ts`](apps/api/src/common/interceptors/http-cache.interceptor.ts).

---

## Diapo 9 — Développement Multi-Plateforme ⭐ · ⏱ 1:30
**Affiché** : Web (React + TS + Vite), Mobile natif (Expo/React Native), défis de cohérence UI/UX, partage des types.

**🎤 Clément dit** (c'est SA partie forte, à défendre) :
- « Côté **web**, une SPA React + TypeScript + Vite. J'ai choisi **wouter** comme routeur — 1,5 ko, largement suffisant — **Valtio** pour l'état global, sans le boilerplate de Redux, et **Axios centralisé** : le token est injecté une seule fois et les 401 sont gérés à un seul endroit. »
- « Côté **mobile**, c'est une **vraie application native** Expo / React Native, pas une PWA. Et elle consomme **exactement la même API NestJS** que le web. »
- « Ma priorité, c'était la **cohérence** : mêmes patterns entre web et mobile — même Valtio, même client Axios, même contrat Socket.io. Si je comprends l'un, je comprends l'autre. »
- « Le vrai défi, c'était d'**adapter aux contraintes natives** — navigation, clavier, gestes — tout en gardant un **design system unifié**. »

*Réf. code (Clément)* : [`store/auth.store.ts`](apps/web/src/store/auth.store.ts) & [`store/auth.ts`](apps/mobile/src/store/auth.ts), [`services/api.ts`](apps/web/src/services/api.ts) & [`lib/api.ts`](apps/mobile/src/lib/api.ts), [`theme.ts`](apps/mobile/src/theme.ts).

---

## Diapo 10 — Sécurité · ⏱ 1:15
**Affiché** : Authentification (JWT + bcrypt + Guards), En-têtes HTTP (Helmet), Rate limiting (Throttler), Chiffrement (AES-256-GCM).

**🎤 Ioane dit** :
- « **Auth** : mots de passe hachés en **bcrypt**, jamais en clair ; comparaison à temps constant ; **JWT stateless** ; et un **Guard NestJS** sur chaque route protégée. »
- « **En-têtes** de sécurité via **Helmet** ; **rate limiting** global avec Throttler, renforcé sur login et register contre le brute-force. »
- « **Chiffrement** des messages en **AES-256-GCM** : confidentialité **et** intégrité — le tag d'authentification détecte toute altération, avec un IV aléatoire unique par message. »

**🎤 Clément ajoute** : « Et côté client, le token n'est jamais en clair : sur mobile il est dans le **coffre-fort matériel** (Keychain / Keystore), et une garde `ProtectedRoute` double le contrôle du serveur — défense en profondeur. »

*Réf. code* : [`auth.service.ts`](apps/api/src/auth/auth.service.ts), [`jwt.strategy.ts`](apps/api/src/auth/strategies/jwt.strategy.ts), [`encryption.service.ts`](apps/api/src/security/encryption.service.ts), [`main.ts`](apps/api/src/main.ts).

---

## Diapo 11 — Conformité RGPD · ⏱ 0:50
**Affiché** : Minimisation, Consentement, Export des données (JSON), Suppression de compte.

**🎤 Clément dit** : « Côté front, une **bannière de consentement explicite** : le choix est mémorisé, on ne le redemande pas à chaque visite. »
**🎤 Ioane dit** : « Côté back, deux droits RGPD implémentés : l'**export** de toutes ses données en JSON — portabilité — et la **suppression** de compte, en **transaction atomique** : tout ou rien, avec les cascades. Et on applique la **minimisation** : on ne collecte que le nécessaire. »

*Réf. code* : [`users.service.ts`](apps/api/src/users/users.service.ts), [`ConsentBanner.tsx`](apps/web/src/components/ConsentBanner.tsx).

---

## Diapo 12 — Intégration externe : Steam API · ⏱ 0:50
**Affiché** : Données réelles, Interface IStatsProvider (Mock ↔ Steam), Stats dérivées, Gestion des erreurs.

**🎤 Ioane dit** :
- « On a un **pattern Provider** : une interface, deux implémentations interchangeables par injection de dépendance — un **Mock** et le **vrai Steam**. Le Mock garantit une **démo fiable même sans réseau**. »
- « Steam n'expose pas les K/D, donc on les **dérive du temps de jeu réel** via un hash **déterministe** : mêmes entrées, mêmes stats, pas de valeurs qui sautent. »
- « Les cas d'erreur sont traités proprement : SteamID invalide → 400, profil privé → 403, API indisponible → 503. »

*Réf. code* : [`external-stats-provider.interface.ts`](apps/api/src/providers/external-stats-provider.interface.ts), [`mock-stats.provider.ts`](apps/api/src/providers/mock/mock-stats.provider.ts), [`steam-stats.provider.ts`](apps/api/src/providers/steam/steam-stats.provider.ts).

---

## Diapo 13 — Qualité & Tests · ⏱ 0:40
**Affiché** : 46 tests unitaires back + 22 front, 8 e2e, **76 tests automatisés** ; pyramide de tests.

**🎤 Ioane dit** : « Une **pyramide de tests** : une base large d'unitaires rapides — 46 côté back sur les services, guards et pipes — plus **8 tests e2e** en Jest + Supertest qui valident les flux complets. »
**🎤 Clément dit** : « Et 22 tests unitaires front sur les composants, les services et l'intercepteur Axios. J'ai pris **Vitest**, natif à Vite, avec jsdom pour simuler le navigateur. »

*Réf. code* : [`vitest.config.ts`](apps/web/vitest.config.ts).

---

## Diapo 14 — DevOps : CI/CD & Conteneurisation · ⏱ 0:50
**Affiché** : pipeline Lint → Build (API + Web) → Tests ; Docker multi-tiers ; fiabilité.

**🎤 Ioane dit** :
- « Une **CI GitHub Actions bloquante** sur le build et les tests — le lint est informatif. **Aucun merge** sans build et tests verts. »
- « **Docker multi-tiers** : des conteneurs séparés pour l'API, le front et PostgreSQL → déploiements reproductibles, isolation, rollback facile. »
- « Argument clé : le **même docker-compose en dev et en CI** → environnement déterministe, zéro surprise. »

*Réf.* : `docker-compose.yml` (racine), workflows CI GitHub Actions.

---

## Diapo 15 — Performance · ⏱ 0:40
**Affiché** : ~1 970 req/s, p99 < 100 ms, autocannon (50 connexions, 30 s) sur `/leaderboards`, scalabilité.

**🎤 Ioane dit** :
- « Mesure réelle : environ **1 970 requêtes/seconde**, avec un **p99 sous 100 ms** — 99 % des requêtes répondent en moins de 100 ms. Testé avec **autocannon**, 50 connexions, 30 secondes, sur l'endpoint leaderboard. »
- « Pourquoi c'est rapide : le cache Redis, l'index composite et la pagination curseur — ce qu'on a vu diapo 8. Et comme l'API est **stateless**, elle est prête à **scaler horizontalement**. »

*Réf. code* : [`leaderboards.service.ts`](apps/api/src/leaderboards/leaderboards.service.ts) + script de charge (racine repo).

---

## Diapo 16 — Démonstration Live (web + mobile) 🎬 · ⏱ 4:30
**Affiché** : parcours Connexion → Tableau → Classement → Chat ; points clés + plan de repli.

> **C'est le moment le plus important. Clément pilote. Répartition ~4:30 : web ~2:30, mobile ~1:30, filet ~0:30.**

**🎤 Clément — partie WEB (~2:30)** :
1. « Connexion avec le compte démo (identifiants pré-remplis). J'ouvre les devtools : **voici le JWT** renvoyé par l'API. »
2. « Le **dashboard** : mes stats, mes graphiques, et le bouton **sync** qui fusionne les stats. »
3. « Le **leaderboard** temps réel, avec les filtres. »
4. « J'ouvre l'équipe **Track Masters** (code `DEMO0001`) et j'envoie un message : il arrive **en temps réel** via Socket.io. »

**🎤 Ioane — appoint (~0:20)** : « Et côté API, tout est documenté : voici **Swagger** sur `/docs`. »

**🎤 Clément — partie MOBILE (~1:30)** :
5. « Sur l'**application mobile native**, je me connecte avec le même compte : **c'est la même API**. »
6. « Je montre le dashboard mobile, puis j'ouvre le **chat d'équipe** — et là je tape un message : la **barre de saisie remonte au-dessus du clavier** (c'est ma difficulté technique, diapo suivante). »
7. « Un message envoyé depuis le mobile apparaît **sur le web en temps réel**, et inversement. »

**🎤 Clément — plan de repli (à dire si souci)** : « En cas de pépin réseau : on a des **captures annotées** et une **courte vidéo** préparées, et le **MockProvider** prend le relais si Steam est indisponible. La démo ne peut pas échouer. »

*Réf. code* : [`LoginPage.tsx`](apps/web/src/pages/LoginPage.tsx), [`TeamChatPage.tsx`](apps/web/src/pages/TeamChatPage.tsx), [`chat.tsx`](<apps/mobile/src/app/teams/[id]/chat.tsx>), [`seed.ts`](apps/api/src/database/seed.ts).

---

## Diapo 17 — Difficultés & Solutions ⭐ · ⏱ 1:00
**Affiché** : deux colonnes — **Clément** (clavier virtuel mobile) / **Ioane** (parité Docker dev↔CI) + leçon commune.

**🎤 Clément dit (sa vraie difficulté technique) (~0:30)** :
- « Ma difficulté : sur les écrans de chat mobile, avec l'**edge-to-edge d'Expo SDK 54**, le composant standard `KeyboardAvoidingView` **ne décalait pas correctement** la barre de saisie — elle passait sous le clavier. »
- « Solution : j'ai écrit un **hook custom `useKeyboardHeight`** qui écoute les événements du clavier, calcule sa hauteur exacte et ajuste l'interface. Plusieurs itérations pour le fiabiliser sur Expo Go. »

**🎤 Ioane dit (~0:20)** : « De mon côté, des divergences d'environnement entre le local et la CI. Solution : **un seul docker-compose** partagé → environnement déterministe. »

**🎤 Ensemble (~0:10)** : « Leçon commune : anticiper les frictions d'intégration **dès la conception**, pas à la fin. »

*Réf. code (Clément)* : [`useKeyboardHeight.ts`](apps/mobile/src/lib/useKeyboardHeight.ts), écran [`chat.tsx`](<apps/mobile/src/app/teams/[id]/chat.tsx>).

---

## Diapo 18 — Bilan & Conclusion · ⏱ 0:40
**Affiché** : compétences acquises, ce qu'on referait, perspectives ; « Merci ».

**🎤 Clément dit** : « Ce que j'en retire : de l'architecture React avancée, le state management avec Valtio, et le passage du web au **mobile natif Expo**. »
**🎤 Ioane dit** : « De mon côté : NestJS, le DevOps et la CI, le chiffrement, les tests e2e. Ce qu'on referait : définir les **contrats d'API plus tôt** et intégrer les **tests dès le sprint 1**. En perspective : notifications push, OAuth Steam, tournois. »
**🎤 Ensemble** : « Merci pour votre attention, nous sommes prêts à répondre à vos questions. »

> Enchaîner sur la **Partie C** (questions probables du jury) de [`explication-projet-et-code-oral.md`](docs/prerequis/explication-projet-et-code-oral.md).

---

## Aide-mémoire : qui pilote quelle diapo

| Diapo | Sujet | Pilote | Durée |
|---|---|---|---|
| 1–2 | Intro & projet | Les deux | 0:50 |
| 3 | Problème / vision | Clément | 0:45 |
| 4 | Organisation | Les deux | 0:45 |
| 5–6 | Architecture, données | Ioane | 2:05 |
| 7 | Parcours (front) | **Clément** | 0:50 |
| 8 | Score & Leaderboard | Ioane | 1:30 |
| 9 | Multi-plateforme | **Clément** | 1:30 |
| 10–12 | Sécurité, RGPD, Steam | Ioane (+ Clément RGPD/sécu front) | 2:55 |
| 13 | Tests | Les deux | 0:40 |
| 14–15 | DevOps, Performance | Ioane | 1:30 |
| 16 | **Démo (web + mobile)** | **Clément** (+ Swagger : Ioane) | 4:30 |
| 17 | Difficultés | Chacun sa colonne | 1:00 |
| 18 | Bilan | Les deux | 0:40 |
| — | Marge | — | 0:30 |
| | **TOTAL** | | **20:00** |

> Rappel : les questions du jury sont préparées en **Partie C** de [`explication-projet-et-code-oral.md`](docs/prerequis/explication-projet-et-code-oral.md).

---

# ⚖️ JUSTIFICATION DES DÉPENDANCES — « pourquoi celle-là et pas une autre ? »

> Pour chaque techno : **son rôle**, **l'alternative qu'on aurait pu prendre**, et **pourquoi on a tranché ainsi**.
> C'est la question piège classique du jury : montrer qu'un choix est **assumé**, pas subi.

## Front-end web (Clément)

- **React** *(vs Vue / Angular)* : librairie d'UI. **Choisi** car c'est **le standard du marché** (employabilité), un **écosystème énorme**, et surtout ça permet de **réutiliser mes compétences sur mobile** via React Native → un seul paradigme pour le web et l'app. Angular aurait été plus lourd/rigide pour un projet de cette taille ; Vue, moins transférable vers le natif.
- **Vite** *(vs Create React App / Webpack)* : outil de build et serveur de dev. **Choisi** pour son **démarrage quasi instantané** et son **hot-reload ultra-rapide** (serveur natif ESM). Create React App est **abandonné/déprécié** ; Webpack seul demande une config lourde. Vite = zéro config, build prod optimisé.
- **wouter** *(vs React Router)* : routeur de la SPA. **Choisi** car **~1,5 ko** contre plusieurs dizaines de ko pour React Router, avec une API quasi identique. Pour **8 routes simples**, React Router serait **surdimensionné**. (Argument déjà cité diapo 9.)
- **Valtio** *(vs Redux / Zustand / Context API)* : état global (utilisateur, token). **Choisi** pour son **absence de boilerplate** : je modifie `authStore.user = ...` directement, là où Redux impose actions/reducers/dispatch. Zustand était proche, mais Valtio (modèle proxy) est encore plus direct. La Context API seule aurait causé des **re-renders inutiles** sur un état partagé partout.
- **Axios** *(vs `fetch` natif)* : client HTTP. **Choisi** pour ses **intercepteurs** : le token JWT est injecté **une seule fois** et le 401 est géré **à un seul endroit**, au lieu de répéter cette logique dans chaque appel `fetch`. Gère aussi le JSON et les erreurs plus proprement que `fetch` nu.
- **socket.io-client** *(vs WebSocket natif)* : temps réel côté client. **Choisi** pour la **reconnexion automatique**, les **rooms** et la **compatibilité descendante** (fallback long-polling si le WebSocket est bloqué). Le WebSocket brut aurait demandé de recoder tout ça à la main.
- **Vitest** *(vs Jest)* : tests front. **Choisi** car **natif à Vite** → **même config, même transformateur**, pas de setup Babel/ts-jest en double. Jest aurait dupliqué la config de build.

## Application mobile (Clément)

- **Expo** *(vs React Native « bare » / CLI)* : framework mobile. **Choisi** pour la **rapidité de mise en route** (pas de config Xcode/Android Studio lourde), le **rechargement à chaud sur téléphone réel** (Expo Go) et l'accès simple aux API natives (clavier, stockage sécurisé). Le mode « bare » aurait été plus flexible mais **beaucoup plus long à configurer** pour un gain nul ici.
- **expo-router** *(vs React Navigation)* : navigation mobile. **Choisi** pour le **routing par fichiers** (chaque fichier = un écran, comme Next.js) → structure **lisible et prévisible**. React Navigation impose de **déclarer les routes en JS** manuellement, plus verbeux. (expo-router est d'ailleurs bâti au-dessus de React Navigation.)
- **expo-secure-store** *(vs AsyncStorage)* : stockage du token. **Choisi** car il utilise le **coffre-fort matériel** (Keychain iOS / Keystore Android), **chiffré**. AsyncStorage stocke **en clair** → inacceptable pour un token d'authentification.
- **Valtio / Axios / socket.io-client** : **volontairement les mêmes que le web** → cohérence, courbe d'apprentissage partagée, un seul contrat temps réel côté serveur.

## Back-end (Ioane)

- **NestJS** *(vs Express / Fastify nu)* : framework d'API. **Choisi** pour son **architecture structurée** (modules, services, guards, DI intégrée) qui **impose de bonnes pratiques** et documente le code par sa structure. Express seul aurait laissé toute l'architecture à improviser. NestJS tourne d'ailleurs sur Express en dessous.
- **TypeORM** *(vs Prisma / Sequelize)* : ORM. **Choisi** pour son **intégration native à NestJS** (décorateurs `@Entity`, injection de repositories) et sa gestion des **migrations**. Prisma était une alternative solide mais avec un workflow de génération à part ; TypeORM colle mieux au modèle « classes = tables » de Nest.
- **PostgreSQL** *(vs MySQL / MongoDB)* : base principale. **Choisi** car nos données sont **fortement relationnelles** (users ↔ équipes ↔ stats ↔ messages) → une base **SQL avec contraintes FK** garantit l'intégrité. MongoDB (NoSQL) aurait mal géré ces relations. PostgreSQL > MySQL pour sa robustesse et ses fonctions avancées (index composites, etc.).
- **Redis** *(vs cache en mémoire dans l'API)* : cache + rate limiting. **Choisi** car il est **partagé entre plusieurs instances** de l'API (un cache en mémoire process serait dupliqué et incohérent après scaling). Ultra-rapide (RAM), avec TTL natif.
- **ioredis** *(vs node-redis)* : client Redis. **Choisi** pour son support fin des **options de résilience** (timeout, pas de file d'attente hors-ligne) qui permettent la **dégradation gracieuse**.
- **Passport + JWT** *(vs sessions serveur)* : authentification. **Choisi** pour le **stateless** → le serveur ne stocke aucune session, ce qui **scale horizontalement**. Les sessions auraient imposé un store partagé (encore du Redis) et un couplage.
- **bcrypt** *(vs argon2 / SHA)* : hachage des mots de passe. **Choisi** car **éprouvé, stable et largement audité**. Argon2 est théoriquement supérieur mais bcrypt reste une **référence sûre** et suffisante. Un simple SHA serait **inadapté** (trop rapide → vulnérable au brute-force).
- **class-validator (DTO)** *(vs validation manuelle)* : validation des entrées. **Choisi** pour une validation **déclarative** (`@IsEmail`, `@Length`) directement sur les DTO, appliquée automatiquement par le `ValidationPipe`. Écrire les `if` à la main serait verbeux et faillible.
- **Helmet** *(vs en-têtes manuels)* : en-têtes de sécurité HTTP. **Choisi** car il pose **d'un coup** un ensemble de bonnes pratiques (CSP, HSTS, X-Frame-Options) maintenues par la communauté.
- **@nestjs/throttler** : rate limiting. **Choisi** car **intégré à NestJS** (guard global + décorateur `@Throttle` par route), adossé à Redis.
- **Swagger (@nestjs/swagger)** : documentation d'API. **Choisi** car il **génère la doc automatiquement** depuis les décorateurs → toujours à jour, testable en ligne sur `/docs`.
- **Jest + Supertest** *(vs autre runner)* : tests back. **Choisi** car **Jest est le standard NestJS** (fourni par défaut) et **Supertest** permet de tester les routes HTTP de bout en bout.

## Outillage du monorepo

- **pnpm** *(vs npm / yarn)* : gestionnaire de paquets. **Choisi** pour sa **gestion des workspaces** (plusieurs applis dans un dépôt) et son **économie de disque** (librairies mutualisées via liens). Plus rapide et plus strict que npm classique.
- **Turborepo** *(vs Nx / Lerna)* : orchestrateur de tâches. **Choisi** pour sa **simplicité** (config minimale) et son **cache de builds** efficace. Nx est plus puissant mais **plus lourd à configurer** ; Lerna est surtout orienté publication de paquets, pas notre besoin.
- **TypeScript** *(vs JavaScript)* : partout. **Choisi** pour le **typage statique** (erreurs détectées à la compilation) et surtout le **partage des types** entre front, mobile et API via le monorepo → un seul contrat, refactorings sûrs.
- **Docker / docker-compose** *(vs installation locale manuelle)* : environnement. **Choisi** pour un environnement **identique en dev, en CI et en prod** → « ça marche pareil partout », fin des « ça marche sur ma machine ».

---

# 📖 LEXIQUE — tous les termes techniques expliqués

> Pour chaque terme : **ce que veut dire le sigle**, **à quoi ça sert**, **comment on l'a utilisé dans Track'N Share**.
> But : pouvoir répondre au jury même sur un mot isolé, sans hésiter.

## 1. Architecture & organisation du code

- **API** *(Application Programming Interface — interface de programmation)* : le **point d'entrée** par lequel le front (web/mobile) demande des données au serveur. Chez nous, c'est l'**API NestJS** : elle reçoit les requêtes, applique la logique métier, renvoie du JSON. Le web ET le mobile utilisent **la même API**.
- **REST** *(REpresentational State Transfer)* : un **style d'API** basé sur les URL et les verbes HTTP (`GET` lire, `POST` créer, `DELETE` supprimer…). Nos routes suivent REST : `GET /leaderboards/solo`, `POST /teams/:id/messages`, etc.
- **SPA** *(Single Page Application — application à page unique)* : un site qui **ne recharge jamais la page entière** ; c'est le JavaScript qui change l'affichage. Notre front web est une SPA React → navigation instantanée.
- **PWA** *(Progressive Web App)* : un site web qui **s'installe comme une appli**. On en parle pour dire qu'on a **choisi de NE PAS** faire ça sur mobile : on a fait une **vraie appli native** (plus puissante). C'est un point que le jury peut soulever.
- **Monorepo** *(mono = un seul + repo = repository/dépôt)* : **un seul dépôt Git** qui contient les trois applications (`apps/api`, `apps/web`, `apps/mobile`) au lieu d'un dépôt par appli. Avantage majeur : on **partage le même code et les mêmes types TypeScript** entre le web, le mobile et l'API (un seul contrat, une seule source de vérité), et on installe/build tout d'un coup.
- **npm** *(Node Package Manager)* : le **gestionnaire de paquets** historique de l'écosystème Node.js : il télécharge et gère les librairies (React, Axios, NestJS…) listées dans `package.json`.
- **pnpm** *(performant npm)* : une **alternative plus rapide et plus économe** à npm. Il **mutualise les librairies** sur le disque (une seule copie partagée entre projets → moins d'espace) et gère nativement les **workspaces** (plusieurs applis dans un même dépôt). C'est pour ça qu'on l'a choisi pour notre monorepo.
- **Workspace** : la fonctionnalité de pnpm qui permet de **gérer plusieurs applis/paquets dans un seul dépôt** et de les faire dépendre les unes des autres (ex. le web et le mobile importent des types communs).
- **Turborepo** : un **outil qui accélère les tâches du monorepo** (build, lint, test). Il fait deux choses : (1) il **met en cache** le résultat d'une tâche → si le code n'a pas changé, il ne la relance pas ; (2) il **parallélise** les tâches indépendantes. Résultat : builds beaucoup plus rapides, surtout en CI.
- **DI** *(Dependency Injection — injection de dépendances)* : au lieu qu'une classe crée elle-même ses dépendances, **NestJS les lui fournit**. Ça nous permet de **remplacer le vrai Steam par un Mock** sans toucher au reste du code (voir Provider).

## 2. Front-end (partie Clément)

- **React** : la **librairie d'interface** (composants réutilisables). Base du web ET du mobile (via React Native).
- **TypeScript (TS)** : du **JavaScript avec des types**. Ça attrape les erreurs **avant l'exécution** (ex. passer un texte là où un nombre est attendu) → code plus fiable. Tout le projet est en TS.
- **Vite** : l'**outil de build/dev du web**. Ultra-rapide, avec **hot-reload** (la page se met à jour instantanément quand on code). Bundling optimisé pour la prod.
- **Expo / React Native** : **React Native** permet d'écrire une appli **native iOS/Android** en React ; **Expo** est la boîte à outils qui simplifie ça (build, accès caméra/clavier/stockage…). C'est notre appli mobile.
- **wouter** : un **routeur** (associe chaque URL à une page). Choisi pour sa **taille minuscule (~1,5 ko)** vs React Router — suffisant pour une SPA de cette taille.
- **expo-router** : le routeur du mobile où **chaque fichier = un écran** (comme Next.js). La structure des dossiers *est* la carte de l'appli.
- **Valtio** : la **gestion d'état global** (qui est connecté, son token…). Choisi car **sans boilerplate** : on modifie `authStore.user = ...` directement, contrairement à Redux qui demande actions/reducers. Même Valtio sur web et mobile → cohérence.
- **Axios** : la **librairie d'appels réseau** (HTTP). On l'a préférée à `fetch` pour ses **intercepteurs** : le token JWT est ajouté **automatiquement** à chaque requête, et une déconnexion sur erreur 401 est gérée **à un seul endroit**.
- **Intercepteur** : une **fonction qui s'exécute avant/après chaque requête**. Chez nous : injecter le token (avant) et purger la session sur 401 (après).
- **Hook (React)** : une **fonction réutilisable** qui encapsule une logique (`useAuth`, `useKeyboardHeight`…). Notre `useKeyboardHeight` est un hook custom (voir difficulté, diapo 17).
- **FlatList** : composant de liste **virtualisée** de React Native : il n'affiche **que les lignes visibles** à l'écran → l'appli reste fluide même avec une longue liste (leaderboard, messages).
- **jsdom** : un **faux navigateur en mémoire** utilisé par les tests front pour simuler le DOM sans ouvrir Chrome.
- **localStorage** : petit **stockage clé/valeur du navigateur**. On y garde le token (web) et le choix de consentement RGPD.

## 3. Temps réel

- **WebSocket** : une **connexion permanente bidirectionnelle** entre client et serveur (contrairement à HTTP qui est requête/réponse ponctuelle). Permet le **push instantané** (chat).
- **Socket.io** : la **librairie** qui simplifie les WebSockets (reconnexion auto, « rooms »…). On l'utilise pour le **chat temps réel**. Mêmes événements (`team:join`, `team:message:new`) sur web et mobile.
- **Room (Socket.io)** : un **canal** auquel on s'abonne. Chaque équipe a sa room `team:<id>` → un message n'est diffusé **qu'aux membres** connectés à cette room.
- **Fallback REST** : plan de secours — si le socket est déconnecté, l'envoi passe par une requête REST classique (`POST`) → **aucun message perdu**.

## 4. Base de données (partie Ioane)

- **PostgreSQL** : la **base de données relationnelle** principale (sur disque). C'est notre **source de vérité** durable.
- **Redis** *(REmote DIctionary Server)* : une base **en mémoire (RAM)**, donc ultra-rapide mais temporaire. Chez nous : **cache** du leaderboard (30 s) **et** compteur du **rate limiting**.
- **ORM** *(Object-Relational Mapping)* : une couche qui fait correspondre les **tables SQL** à des **objets/classes** du code → on écrit du TypeScript au lieu de SQL brut.
- **TypeORM** : l'**ORM** qu'on utilise avec NestJS. Il gère les entités (`User`, `Team`…), les relations et les **migrations**.
- **Entité** : une **classe qui représente une table** (ex. `PlayerStats` ↔ table des stats).
- **3NF** *(Troisième Forme Normale)* : une **règle de conception de base de données** qui **évite la redondance** (chaque information n'est stockée qu'une fois, au bon endroit). On a normalisé notre schéma en 3NF → pas de doublons incohérents.
- **FK** *(Foreign Key — clé étrangère)* : une **colonne qui référence la clé d'une autre table** (ex. une stat pointe vers son `userId`). Garantit l'**intégrité référentielle** : impossible d'avoir une stat sans utilisateur.
- **Migration** : un **script versionné qui fait évoluer le schéma** de la base (créer/modifier des tables). Permet un **historique** et un **rollback**. Notre migration `Init` crée tout le schéma. En prod on utilise les migrations plutôt que `synchronize` (automatique mais risqué).
- **Index** : une **structure qui accélère les recherches** (comme l'index d'un livre). Notre **index composite** `(gameId, seasonId, score)` rend la requête de classement rapide (pas de balayage complet de la table).
- **Index composite** : un index **sur plusieurs colonnes à la fois**, optimisé pour une requête précise (filtrer par jeu + saison, trier par score).
- **QueryBuilder** : l'outil de TypeORM pour **construire des requêtes SQL** finement (SELECT sélectif, JOINs ciblés) plutôt qu'un `SELECT *`.
- **upsert** *(update + insert)* : « **mets à jour si ça existe, sinon crée** ». Utilisé pour les stats et le seed.
- **Idempotent** : une opération qu'on peut **rejouer plusieurs fois sans changer le résultat**. Notre `seed.ts` est idempotent → on peut le relancer sans casser les données.
- **Transaction** : un **groupe d'opérations « tout ou rien »** : si une échoue, tout est annulé. Utilisé pour la **suppression RGPD** → cohérence garantie.
- **Cascade** : quand on supprime une ligne, ses **dépendances liées sont supprimées automatiquement** (ex. supprimer une équipe supprime ses messages).

## 5. Sécurité (partie Ioane, + stockage token côté Clément)

- **Authentification** : vérifier **qui tu es** (login). À ne pas confondre avec l'**autorisation** = vérifier **ce que tu as le droit de faire** (Guards).
- **JWT** *(JSON Web Token)* : un **jeton signé** renvoyé après connexion, qu'on présente à chaque requête (au lieu de renvoyer le mot de passe). Il contient l'`userId` et le rôle. **Stateless** : le serveur ne stocke rien, il **vérifie juste la signature**.
- **Stateless** *(sans état)* : le serveur **ne garde aucune session en mémoire**. Avantage : on peut **multiplier les instances** de l'API (scalabilité horizontale) sans partager de session.
- **bcrypt** : un **algorithme de hachage de mots de passe** conçu pour être **lent** (résiste au brute-force). Le mot de passe n'est **jamais stocké en clair**, seulement son hash. Comparaison à **temps constant** (anti timing-attack).
- **Salt** : une **valeur aléatoire ajoutée** au mot de passe avant hachage → deux mots de passe identiques donnent des hash différents. bcrypt le gère (salt 10).
- **Hash / hachage** : transformer une donnée en une **empreinte irréversible**. On ne peut pas « déhacher » un mot de passe.
- **AES-256-GCM** *(Advanced Encryption Standard, clé 256 bits, mode Galois/Counter Mode)* : l'**algorithme de chiffrement** des messages. **AES** = standard de chiffrement symétrique ; **256** = taille de la clé (très robuste) ; **GCM** = mode **authentifié** → il chiffre **ET** détecte toute altération. Utilisé pour chiffrer le contenu des messages en base.
- **Chiffrement symétrique** : **la même clé** chiffre et déchiffre (vs asymétrique = 2 clés). AES est symétrique.
- **IV** *(Initialization Vector — vecteur d'initialisation)* : une **valeur aléatoire unique par message** ajoutée au chiffrement → deux messages identiques donnent des résultats chiffrés différents. On en génère un neuf à chaque message.
- **authTag** *(authentication tag — tag d'authentification)* : une **signature produite par GCM** qui prouve que le message chiffré **n'a pas été modifié**. On le vérifie au déchiffrement.
- **Guard (NestJS)** : un **portier** qui autorise ou bloque l'accès à une route selon une condition. `JwtAuthGuard` (connecté ?), `TeamMemberGuard` (membre de l'équipe ?), `TeamRoleGuard` (capitaine ?).
- **DTO** *(Data Transfer Object — objet de transfert de données)* : une **classe qui décrit et valide** la forme des données entrantes (ex. `RegisterDto` : email valide, mot de passe 8–72 caractères). Rejette les requêtes mal formées **avant** d'atteindre la logique.
- **ValidationPipe** : le mécanisme NestJS qui **applique les règles des DTO** automatiquement. Avec `whitelist` il **supprime les champs non prévus** (anti-injection).
- **Helmet** : un **middleware** qui pose des **en-têtes HTTP de sécurité** par défaut (voir ci-dessous).
- **Middleware** : une fonction qui **s'exécute entre la requête et la réponse** (ex. Helmet, CORS).
- **En-têtes HTTP de sécurité** :
  - **CSP** *(Content Security Policy)* : limite **quelles sources** de scripts/styles le navigateur accepte → anti-XSS.
  - **HSTS** *(HTTP Strict Transport Security)* : **force le HTTPS**.
  - **X-Frame-Options** : empêche d'**afficher le site dans une iframe** → anti-clickjacking.
- **CORS** *(Cross-Origin Resource Sharing)* : la règle qui définit **quels sites (origines) ont le droit d'appeler l'API**. Configuré souple en dev, strict en prod.
- **Rate limiting** *(limitation de débit)* : **limiter le nombre de requêtes** par IP sur une période → anti brute-force / anti-abus.
- **Throttler** : le **module NestJS** qui fait le rate limiting (ex. 100 req/min global, 10/min sur le login).
- **SecureStore (expo-secure-store)** : le **stockage sécurisé du token sur mobile**, adossé au matériel :
  - **Keychain** (iOS) / **Keystore** (Android) = **coffre-fort chiffré du téléphone**, bien plus sûr qu'un stockage en clair.
- **Défense en profondeur** : **plusieurs couches** de sécurité qui se doublent (ex. `ProtectedRoute` côté client **+** Guard côté serveur). Si une couche est contournée, l'autre tient.
- **fail-fast** : **échouer tôt et vite** — l'app **refuse de démarrer** si un secret manque/est invalide, plutôt que de planter plus tard.

## 6. Domaine métier (score, stats, Steam)

- **Provider (pattern)** : un **contrat (interface) avec plusieurs implémentations interchangeables**. `IStatsProvider` a deux versions : `MockStatsProvider` et `SteamStatsProvider`. On bascule de l'une à l'autre par DI.
- **MockProvider / Mock** : la version **« faux Steam »** qui génère des stats crédibles → **démo fiable sans réseau ni compte Steam**.
- **Steam API** : l'**API officielle de Steam** (profil, jeux possédés). On récupère des **données réelles** en production.
- **SteamID** : l'**identifiant unique** d'un compte Steam (17 chiffres). On le valide par regex `/^\d{17}$/`.
- **K/D** *(Kill/Death ratio)* : le **ratio éliminations / morts** — indicateur de skill. Steam ne le fournit pas → on le **dérive du temps de jeu**.
- **Winrate** : le **pourcentage de victoires** (`wins / matchs × 100`).
- **Déterministe** : **mêmes entrées → mêmes sorties, à chaque fois**. Nos stats Steam dérivées sont déterministes (via un hash) → pas de valeurs qui « sautent » à chaque synchro.
- **Score** : notre note pondérée, **calculée côté serveur** (non falsifiable) : `K/D × 50 + %victoires × 40 + matchs × 0,5`.
- **Fonction pure** : une fonction **sans effet de bord** qui ne dépend que de ses entrées → **facile à tester**. Notre calcul de score en est une.

## 7. Cache & pagination

- **Cache** : garder un résultat **prêt à l'emploi** pour ne pas le recalculer. Notre leaderboard est mis en cache Redis.
- **TTL** *(Time To Live — durée de vie)* : le **temps avant qu'une donnée en cache expire** (30 s chez nous).
- **Invalidation** : **effacer le cache** quand la donnée change (à l'écriture) pour ne pas servir du périmé.
- **Dégradation gracieuse** : si un service secondaire tombe (Redis), l'app **continue de fonctionner** en mode réduit (on relit PostgreSQL, on perd juste la vitesse du cache).
- **Pagination** : renvoyer les résultats **par pages** (20 à la fois) au lieu de tout d'un coup.
- **Offset** : pagination classique « saute les N premiers » → **instable** si les données bougent (doublons/trous).
- **Pagination curseur** : on mémorise **un point de repère précis** (`{score, id}`) pour reprendre exactement où on s'est arrêté → **stable et rapide** (utilise l'index). C'est ce qu'on utilise.

## 8. Tests, qualité, DevOps (partie Ioane)

- **Test unitaire** : teste **une petite fonction isolée** (ex. le calcul de score). Rapide et nombreux.
- **Test e2e** *(end-to-end — de bout en bout)* : teste **un flux complet** comme un vrai utilisateur (ex. register → login → accès protégé).
- **Pyramide de tests** : principe = **beaucoup d'unitaires** (base) **+ quelques e2e** (sommet). C'est notre répartition : 46 back + 22 front unitaires, 8 e2e.
- **Vitest** : le **framework de tests du front**, **natif à Vite** (même config, pas de setup en double).
- **Jest** : le **framework de tests du back** (NestJS).
- **Supertest** : librairie pour **tester les routes HTTP** dans les tests e2e (simule des requêtes à l'API).
- **Lint / ESLint** : un **analyseur qui repère les erreurs de style/code** avant l'exécution. Dans notre CI il est **informatif** (non bloquant).
- **CI/CD** *(Continuous Integration / Continuous Deployment)* : **CI** = à chaque push, on **build + teste automatiquement** ; **CD** = déploiement automatisé. Notre CI **bloque tout merge** sans build + tests verts.
- **GitHub Actions** : l'**outil qui exécute la CI** (les workflows) sur GitHub.
- **Pipeline** : la **suite d'étapes** de la CI : Lint → Build → Tests.
- **Docker** : outil de **conteneurisation** — emballe une appli avec **tout son environnement** dans une « boîte » qui marche **pareil partout**.
- **Conteneur** : l'**instance qui tourne** à partir d'une image Docker (notre API, notre front, notre PostgreSQL = 3 conteneurs).
- **docker-compose** : fichier qui **orchestre plusieurs conteneurs** ensemble. Le **même en dev et en CI** → environnement déterministe (c'est la difficulté résolue par Ioane).
- **Multi-tiers** : architecture à **plusieurs couches séparées** (front / API / base) → isolation, rollback facilité.

## 9. Performance

- **req/s** *(requêtes par seconde)* : le **débit** que l'API encaisse. On mesure ~**1 970 req/s** sur le leaderboard.
- **p99** *(99e percentile)* : le temps sous lequel **99 % des requêtes** répondent. Le nôtre est **< 100 ms** → très réactif même pour les cas les plus lents.
- **autocannon** : l'**outil de test de charge** utilisé (50 connexions, 30 s) pour mesurer débit et latence.
- **Scalabilité horizontale** : capacité à **ajouter des serveurs en parallèle** pour tenir la charge. Rendue possible par l'API **stateless** + la conteneurisation.

## 10. Conformité & méthode

- **RGPD** *(Règlement Général sur la Protection des Données)* : la **loi européenne** sur les données personnelles. On implémente : **consentement**, **export** (portabilité), **suppression** (droit à l'oubli), **minimisation**.
- **MVP** *(Minimum Viable Product — produit minimum viable)* : la **version essentielle** qui marche, livrée avant les bonus. On a **priorisé le MVP**.
- **Agile / Sprint** : méthode de travail **itérative** ; un **sprint** = un cycle court de développement avec des objectifs définis.
- **Swagger / OpenAPI** : la **documentation interactive de l'API**, générée automatiquement, accessible sur `/docs`. On peut y tester les routes en direct.

## 11. Mobile — la difficulté technique de Clément (diapo 17)

- **Edge-to-edge** : mode d'affichage où le contenu **occupe tout l'écran**, jusque sous la barre de statut et la barre de navigation. **Activé par défaut à partir d'Expo SDK 54**.
- **SDK** *(Software Development Kit)* : l'**ensemble d'outils/versions** fourni par Expo. On est sur le **SDK 54**.
- **KeyboardAvoidingView** : le composant **standard** de React Native censé **remonter l'interface au-dessus du clavier**. Chez nous, il **buggait** avec l'edge-to-edge du SDK 54 (barre de saisie masquée).
- **useKeyboardHeight** : mon **hook custom** qui écoute les événements clavier (`keyboardWillShow/DidShow`), **calcule sa hauteur exacte** et ajuste le `paddingBottom` → barre de saisie toujours visible. **C'est ma vraie difficulté technique**, résolue après plusieurs itérations.

---

*Document généré le 2026-07-02 — support de présentation aligné sur les 18 diapos de la soutenance, minuté sur 20 min (démo web + mobile comprise). Lexique technique complet inclus.*
