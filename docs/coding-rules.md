# Track'N Share — Coding Rules

## Objectif du fichier

Ce fichier donne les règles de développement à respecter dans Track'N Share.

Elles s'appliquent à toute création ou modification de code.

## Principes généraux

- Privilégier la simplicité.
- Ne pas surcomplexifier le MVP.
- Garder les fichiers courts.
- Séparer UI, logique métier et accès données.
- Typer autant que possible.
- Éviter `any`.
- Valider côté back-end.
- Ne jamais exposer de secret.
- Écrire du code lisible avant du code astucieux.

## Langue

- Code : anglais.
- Variables : anglais.
- Fonctions : anglais.
- Commentaires : français ou anglais, mais éviter les commentaires inutiles.
- Documentation projet : français.

## Git

### Branches

Format recommandé :

```txt
feature/auth-jwt
feature/stats-dashboard
feature/team-chat
fix/login-error
docs/update-readme
chore/docker-setup
```

### Commits

Format recommandé :

```txt
feat(auth): add JWT login
fix(stats): handle zero deaths ratio
docs(readme): add docker setup
chore(api): update dependencies
test(score): add score calculation tests
```

Types possibles :

```txt
feat
fix
docs
style
refactor
test
chore
ci
build
```

## TypeScript

Règles :

- éviter `any` ;
- créer des types pour les réponses API ;
- garder les types synchronisés avec les endpoints ;
- préférer des fonctions petites ;
- gérer les `null` et `undefined` explicitement ;
- ne pas ignorer les erreurs TypeScript.

## Front-end React

### Règles

- composants réutilisables dans `components/` ;
- logique métier dans `features/` ;
- appels API dans `services/` ;
- hooks dédiés pour logique réutilisable ;
- pages simples ;
- états loading/error/empty obligatoires sur les écrans data ;
- pas d'appel API dispersé dans tous les composants.

### Exemple de structure feature

```txt
features/teams/
  components/
    TeamCard.tsx
    TeamMembersList.tsx
  hooks/
    use-team.ts
  services/
    teams-api.ts
  types.ts
```

### À éviter

- composant de 500 lignes ;
- logique de score côté front ;
- clé API dans React ;
- données sensibles en cache PWA ;
- dépendances UI inutiles.

## Back-end NestJS

### Règles

- un module par domaine ;
- controller simple ;
- logique métier dans service ;
- DTO pour body/query/params ;
- guards pour permissions ;
- providers externes isolés ;
- erreurs cohérentes ;
- Swagger mis à jour.

### Structure type

```txt
auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  dto/
  strategies/
  guards/
```

### Controllers

Les controllers doivent :
- recevoir la requête ;
- appliquer guards/décorateurs ;
- appeler le service ;
- retourner une réponse.

Les controllers ne doivent pas :
- contenir de logique métier lourde ;
- calculer le score ;
- appeler directement Steam/Epic ;
- manipuler directement des requêtes SQL complexes.

### Services

Les services doivent :
- contenir la logique métier ;
- orchestrer les repositories/providers ;
- appliquer les règles métier ;
- rester testables.

## DTO et validation

DTO prioritaires :

```txt
RegisterDto
LoginDto
UpdateProfileDto
CreateTeamDto
JoinTeamDto
SendTeamMessageDto
SyncStatsDto
PaginationQueryDto
```

ValidationPipe recommandé :

```ts
whitelist: true
transform: true
```

Option stricte possible :

```ts
forbidNonWhitelisted: true
```

## API

### Réponse succès

```json
{
  "success": true,
  "data": {},
  "message": "Action effectuée avec succès."
}
```

### Réponse erreur

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible.",
    "requestId": "req_abc123"
  }
}
```

Règles :
- camelCase JSON ;
- HTTP status cohérent ;
- pagination sur les listes ;
- pas de stack trace client ;
- pas de données sensibles.

## Sécurité

### Interdits

- `.env` dans Git ;
- secret dans front ;
- clé API dans `VITE_*` ;
- passwordHash retourné ;
- JWT loggé ;
- mot de passe loggé ;
- contenu complet de message loggé ;
- route privée sans guard ;
- permissions uniquement côté front.

### Obligatoires

- DTO ;
- guards ;
- hash mot de passe ;
- validation des permissions ;
- logs propres ;
- MockProvider fiable ;
- `.env.example` à jour.

## Base de données

Règles :
- migrations versionnées ;
- seeds fictifs ;
- pas de données réelles ;
- relations propres ;
- contraintes d'unicité ;
- index sur les requêtes fréquentes ;
- éviter les suppressions destructives.

## Seeds

Le seed démo doit créer :

- compte démo ;
- utilisateurs fictifs ;
- jeux fictifs ;
- saison active ;
- stats variées ;
- leaderboard rempli ;
- équipe démo ;
- membres ;
- messages.

Règles :
- seed idempotent si possible ;
- pas de vrais emails ;
- pas de vraie clé ;
- pas de donnée personnelle réelle.

## Tests prioritaires

À prioriser :

- calcul K/D ;
- calcul winrate ;
- calcul score ;
- AuthService ;
- JwtAuthGuard ;
- TeamMemberGuard ;
- TeamRoleGuard ;
- MockProvider ;
- endpoints P0.

## PWA

Règles :
- manifest propre ;
- assets statiques cachables ;
- données privées en Network First ;
- pas de messages privés dans cache ;
- nettoyage au logout ;
- page offline neutre.

## Socket.io

Règles :
- socket authentifié ;
- userId issu du token ;
- room par équipe ;
- non-membre refusé ;
- message sauvegardé avant broadcast ;
- fallback REST possible ;
- pas de token dans logs.

## Docker

Règles :
- Docker Compose doit lancer les services nécessaires ;
- ports documentés ;
- `.env` utilisé localement ;
- pas de secret hardcodé ;
- PostgreSQL avec volume ;
- Redis non exposé inutilement ;
- tester avant soutenance.

## Documentation

Mettre à jour la documentation quand :

- un endpoint change ;
- une variable env est ajoutée ;
- une règle métier change ;
- une décision technique change ;
- Docker change ;
- une limite MVP est identifiée.

## Règle finale

En cas d'hésitation entre deux solutions, choisir :

1. la plus simple ;
2. la plus sûre ;
3. la plus démontrable ;
4. la plus alignée MVP ;
5. la plus facile à expliquer en soutenance.
