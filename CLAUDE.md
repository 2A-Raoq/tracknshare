# Track'N Share — Instructions Claude Code

## Projet

Track'N Share est une PWA gaming permettant aux joueurs de suivre, partager et comparer leurs performances.

L'objectif du projet est de créer une plateforme compétitive autour des statistiques de jeu, avec dashboard joueur, score, leaderboards, équipes et chat d'équipe.

## Stack

- Front-end : React, TypeScript, Vite, PWA
- Back-end : NestJS, TypeScript
- Temps réel : Socket.io
- BDD principale : PostgreSQL
- Cache / temps réel / rate limiting : Redis
- Monorepo : pnpm workspace + Turborepo
- Apps :
  - `apps/web`
  - `apps/api`

## Structure du projet

```txt
TRACKNSHARE/
  apps/
    api/
    web/
  docs/
    00-AI-Context/
    drive-export/
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  turbo.json
  CLAUDE.md
```

## Priorité absolue

Toujours prioriser le MVP :

1. Authentification
2. Dashboard joueur
3. Stats mockées
4. Score
5. Leaderboard solo
6. Équipes
7. Chat d'équipe
8. Sécurité de base
9. Données de démo
10. Polish / soutenance

Ne pas développer les bonus avant que les P0 soient terminés.

## Documentation à lire en priorité

Avant de modifier le projet, lire ces fichiers :

- `docs/00-AI-Context/project-overview.md`
- `docs/00-AI-Context/mvp-scope.md`
- `docs/00-AI-Context/architecture.md`
- `docs/00-AI-Context/domain-model.md`
- `docs/00-AI-Context/api-contract.md`
- `docs/00-AI-Context/security-rgpd.md`
- `docs/00-AI-Context/sprints-roadmap.md`
- `docs/00-AI-Context/coding-rules.md`
- `docs/00-AI-Context/front-ui-reference.md`

## Documentation complète exportée du Drive

La documentation complète du projet est dans :

```txt
docs/drive-export/
```

Cette documentation sert de référence longue.

Les fichiers de `docs/00-AI-Context/` sont prioritaires pour comprendre rapidement le projet.  
Les fichiers de `docs/drive-export/` servent à vérifier les détails si nécessaire.

## Référence UI / Front

Pour la landing page et l'ambiance graphique, lire :

- `docs/00-AI-Context/front-ui-reference.md`

La référence visuelle Figma est stockée ici :

```txt
docs/drive-export/03-Design-UX-UI/Maquettes/landing-hero-figma-reference.png
```

S'inspirer de cette maquette pour créer une interface :

- sombre ;
- gaming ;
- responsive ;
- moderne ;
- compétitive ;
- avec header compact ;
- avec hero visuel ;
- avec cartes d'action semi-transparentes.

Ne pas copier exactement une image sous droits non maîtrisés dans une version finale publique.  
Pour le MVP étudiant, une image placeholder ou une image libre peut être utilisée.

## Règles importantes

- Ne jamais mettre de secret dans le front-end.
- Ne jamais exposer de clé Steam/Epic côté React.
- Les providers externes doivent rester côté back-end.
- Le MockProvider doit rester fiable pour la soutenance.
- Les routes privées doivent être protégées par guards.
- Les permissions d'équipe doivent être vérifiées côté back-end.
- Les messages de chat ne doivent pas être accessibles aux non-membres.
- Les DTO doivent valider les entrées.
- Les controllers NestJS doivent rester simples.
- La logique métier doit rester dans les services.
- Les appels API front doivent être centralisés.
- Le score doit être calculé côté back-end.
- Les données de démo doivent rester fictives.
- Ne pas ajouter de bonus tant que le MVP P0 n'est pas terminé.

## Règles front-end

Dans `apps/web` :

- utiliser React + TypeScript ;
- privilégier des composants simples ;
- créer des pages lisibles ;
- centraliser les appels API ;
- prévoir les états loading, error et empty ;
- faire du responsive mobile-first ;
- respecter l'ambiance sombre gaming ;
- éviter les dépendances inutiles ;
- ne jamais mettre de secret dans le code front.

Pages MVP prioritaires :

```txt
/
/login
/register
/dashboard
/leaderboard
/teams
/teams/:id
/teams/:id/chat
```

## Règles back-end

Dans `apps/api` :

- utiliser NestJS + TypeScript ;
- créer un module par domaine ;
- garder les controllers simples ;
- mettre la logique métier dans les services ;
- valider les entrées avec des DTO ;
- protéger les routes avec des guards ;
- documenter les endpoints avec Swagger ;
- garder les providers externes côté back-end ;
- utiliser le MockProvider pour le MVP.

Modules MVP prioritaires :

```txt
AuthModule
UsersModule
GamesModule
StatsModule
LeaderboardModule
TeamsModule
ChatModule
HealthModule
```

## Fonctionnalités à ne pas prioriser

Ne pas développer avant stabilisation du MVP :

- SteamProvider réel complet ;
- EpicProvider réel complet ;
- amis ;
- messages privés ;
- feed social ;
- tournois ;
- matchmaking avancé ;
- badges avancés ;
- modération complète ;
- chiffrement de bout en bout ;
- dashboard admin complet.

Ces fonctionnalités peuvent être mentionnées comme évolutions futures.

## Commandes utiles

Depuis la racine :

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
docker compose up -d --build
docker compose ps
```

Commandes utiles par application :

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api build
pnpm --filter web build
```

## Objectif Claude Code

Aider à développer le MVP proprement, sprint par sprint, sans élargir inutilement le scope.

Avant de coder :

1. Lire la documentation IA.
2. Vérifier le sprint concerné.
3. Identifier si la tâche est P0, P1 ou P2.
4. Respecter l'architecture existante.
5. Proposer une solution simple et démontrable.
6. Ne pas casser le parcours de soutenance.

## Parcours de démo cible

Le parcours final doit permettre de :

1. Lancer le projet.
2. Se connecter avec un compte démo.
3. Voir le dashboard.
4. Voir les stats mockées.
5. Voir le score.
6. Voir le leaderboard.
7. Ouvrir une équipe.
8. Utiliser le chat d'équipe.
9. Montrer Swagger.
10. Expliquer la sécurité et les choix techniques.