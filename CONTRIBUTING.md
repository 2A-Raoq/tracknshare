# Contributing to Track'N Share

Merci de votre intérêt pour Track'N Share ! Ce document définit les règles et standards pour contribuer au projet.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Avant de commencer](#avant-de-commencer)
- [Processus de contribution](#processus-de-contribution)
- [Standards de code](#standards-de-code)
- [Commits et branches](#commits-et-branches)
- [Pull Requests](#pull-requests)
- [Tests et qualité](#tests-et-qualité)
- [Documentation](#documentation)
- [AI Usage & Policy](#ai-usage--policy)
- [Priorisation MVP](#priorisation-mvp)

---

## Code de conduite

Tous les contributeurs doivent :

- Respecter les autres membres de l'équipe
- Communiquer clairement et professionnellement
- Rester focus sur les objectifs du MVP
- Partager les connaissances et aider les autres
- Respecter les délais et engagements

---

## Avant de commencer

### Lecture obligatoire

Avant toute contribution, lire :

1. `CLAUDE.md` — Instructions et contexte global
2. `AI_USAGE_POLICY.md` — **Politique d'usage de l'IA** (obligatoire si tu utilises Claude Code)
3. `docs/00-AI-Context/project-overview.md` — Vue d'ensemble du projet
4. `docs/00-AI-Context/mvp-scope.md` — Scope du MVP
5. `docs/00-AI-Context/architecture.md` — Architecture du projet
6. `docs/00-AI-Context/coding-rules.md` — Règles de code
7. `docs/00-AI-Context/sprints-roadmap.md` — État des sprints

### Stack du projet

- **Frontend** : React, TypeScript, Vite, PWA
- **Backend** : NestJS, TypeScript
- **Temps réel** : Socket.io
- **BDD** : PostgreSQL
- **Cache/Rate limiting** : Redis
- **Build** : Turborepo + pnpm workspace

### Setup local

```bash
# Installation
pnpm install

# Développement
pnpm dev

# Build
pnpm build

# Linting
pnpm lint

# Docker
docker compose up -d --build
```

---

## Processus de contribution

### 1. Créer une issue ou s'assigner une existante

- Vérifier que l'issue n'existe pas déjà
- Créer une issue descriptive avec :
  - **Titre** : descriptif et court
  - **Description** : contexte et objectif
  - **Label** : `P0` (MVP prioritaire), `P1`, `P2`, `bug`, `feature`, `docs`
  - **Assignee** : vous-même
  - **Sprint** : sprint concerné si applicable

### 2. Créer une branche

```bash
git checkout -b feature/ISSUE-xxx-description
# ou
git checkout -b fix/ISSUE-xxx-description
```

**Convention** : `<type>/<issue-number>-<short-description>`

Types autorisés : `feature`, `fix`, `docs`, `chore`, `refactor`

### 3. Développer localement

- Respecter les standards de code (voir section ci-dessous)
- Tester régulièrement
- Faire des commits atomiques et compréhensibles
- Ne pas committer de secrets ou clés API

### 4. Soumettre une PR

Voir section [Pull Requests](#pull-requests)

---

## Standards de code

### Général

- **Langage** : TypeScript partout (frontend et backend)
- **Formatage** : Prettier (configuration projet)
- **Linting** : ESLint
- **Pas de secrets** : Jamais de clés ou tokens dans le code
- **Pas de dépendances inutiles** : Minimiser les imports externes

### Frontend (`apps/web`)

```typescript
// ✅ BON
const [isLoading, setIsLoading] = useState(false);
const handleSubmit = async (data: FormData) => {
  setIsLoading(true);
  try {
    await apiService.submitForm(data);
  } catch (error) {
    // Gérer l'erreur
  } finally {
    setIsLoading(false);
  }
};

// ❌ MAUVAIS
const [loading, setLoading] = useState(false);
const handleSubmit = () => {
  fetch('/api/form', { method: 'POST', body: JSON.stringify(data) })
    .then(r => r.json())
    .then(d => setData(d));
};
```

**Règles** :

- Composants simples et lisibles
- Utiliser les custom hooks pour la logique réutilisable
- Centraliser les appels API dans `src/api/`
- Gérer les états : `loading`, `error`, `empty`
- Mobile-first responsive
- Thème gaming sombre (voir `docs/00-AI-Context/front-ui-reference.md`)
- Jamais de secrets frontend

### Backend (`apps/api`)

```typescript
// ✅ BON
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async findById(id: string): Promise<User> {
    return this.repository.findById(id);
  }
}

// ❌ MAUVAIS
@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);
    return user;
  }
}
```

**Règles** :

- 1 module par domaine (Auth, Users, Games, Stats, Leaderboard, Teams, Chat)
- Controllers simples (< 20 lignes par méthode)
- Logique métier dans les Services
- Validation avec DTO (class-validator)
- Guards pour protéger les routes
- DocumentAPI avec Swagger
- Providers externes (Steam, Epic) côté backend uniquement
- Pas de secrets en frontend
- Scoring côté backend
- Permissions d'équipe vérifiées backend

### Conventions de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Constantes | UPPER_SNAKE_CASE | `MAX_ATTEMPTS`, `API_TIMEOUT` |
| Classes | PascalCase | `UserService`, `AuthController` |
| Fichiers composant | PascalCase.tsx | `UserCard.tsx`, `LoginForm.tsx` |
| Fichiers service | camelCase.ts | `userService.ts`, `authService.ts` |
| Interfaces | PascalCase + I prefix (optionnel) | `IUser` ou `User` |
| Enums | PascalCase | `UserRole`, `GameStatus` |
| Private methods | #method ou _method | `#calculateScore()` |

---

## Commits et branches

### Convention de commit

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types** :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `perf` : optimisation de performance
- `docs` : documentation
- `style` : formatage, sans changement logique
- `refactor` : refactoring sans changement fonctionnel
- `test` : ajout/modification de tests
- `chore` : tâches diverses (deps, config)

**Scopes** : `web`, `api`, `db`, `docker`, `auth`, `users`, `games`, `stats`, `leaderboard`, `teams`, `chat`

**Exemples** :

```
feat(web): add emoji picker to team chat
fix(api): resolve race condition in score calculation
perf(api): add Redis cache layer for leaderboard
docs(web): update dashboard component documentation
chore(db): add user_email index to users table
```

**Règles** :
- Sujet < 50 caractères
- Utiliser l'impératif ("add", "fix", "update")
- Ne pas terminer par un point
- Le body explique le **pourquoi**, pas le **quoi**
- Commits atomiques (une responsabilité par commit)

---

## Pull Requests

### Créer une PR

**Checklist avant de soumettre** :

- [ ] Code testé localement (`pnpm dev` ou tests)
- [ ] Aucun `console.log` en production
- [ ] Lint passes (`pnpm lint`)
- [ ] Pas de secrets ou clés API
- [ ] Branche à jour avec `main`
- [ ] Description complète de la PR
- [ ] Screenshots/GIFs si changement UI
- [ ] Tests ajoutés ou modifiés
- [ ] Documentation mise à jour si nécessaire

### Template PR

```markdown
## Description
Brève description de ce que fait cette PR.

## Type de changement
- [ ] Feature (nouvelle fonctionnalité)
- [ ] Fix (correction de bug)
- [ ] Breaking change (change incompatible)
- [ ] Docs (documentation uniquement)

## Linkedissues
Closes #123

## Changements clés
- Ajout de X
- Modification de Y
- Suppression de Z

## Tests
Comment tester cette PR :
1. Aller à `/page`
2. Faire X
3. Vérifier que Y se passe

## Screenshots/Vidéo
[Si applicable, ajouter captures d'écran]

## AI Contribution (si applicable)
- [ ] Code généré avec l'IA
- Scope : [architecture / code generation / tests / documentation]
- Validé et compris ✅

## Checklist
- [ ] Code reviewed
- [ ] Tests ajoutés
- [ ] Documentation mise à jour
- [ ] Aucun breaking change non documenté
- [ ] Aucun secret hardcoded
- [ ] Politique IA respectée (si applicable)
```

### Revue de code

**Points d'attention lors de la review** :

- ✅ Code lisible et maintenable
- ✅ Pas de duplication
- ✅ Performance acceptable
- ✅ Gestion d'erreurs complète
- ✅ Tests présents et significatifs
- ✅ Documentation suffisante
- ✅ Respect de l'architecture
- ✅ Si code IA-généré : source documentée et code compris par le dev
- ✅ Pas de secrets hardcoded (surtout si généré par IA)

**Approbation** :

- Minimum 1 approbation avant merge
- 2 approbations si changement sensible (auth, sécurité, core)
- Discussions résolues
- Tous les checks passent (CI/CD)

### Merge

- Utiliser "Squash and merge" pour les petites PRs
- Utiliser "Create a merge commit" pour les features majeures
- Supprimer la branche après merge
- Fermer automatiquement les issues liées

---

## Tests et qualité

### Couverture minimale

- **Backend** : minimum 70% de couverture
- **Frontend** : tests pour logique métier, composants critiques
- Tous les endpoints API doivent avoir au moins un test

### Exécuter les tests

```bash
pnpm test              # Tous les tests
pnpm --filter api test # Backend uniquement
pnpm --filter web test # Frontend uniquement
```

### Types de tests

| Type | Lieu | Exemple |
|------|------|---------|
| Unit | `*.spec.ts` | Service method, utility function |
| Integration | `*.spec.ts` avec base de données | API endpoint, database query |
| E2E | `apps/web/e2e` | User flow, critical path |

### Bonnes pratiques

```typescript
// ✅ BON
describe('UserService', () => {
  it('should return user by id', async () => {
    const user = await service.findById('123');
    expect(user.id).toBe('123');
  });

  it('should throw if user not found', async () => {
    await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
  });
});

// ❌ MAUVAIS
describe('UserService', () => {
  it('should work', async () => {
    const user = await service.findById('123');
    expect(user).toBeDefined();
  });
});
```

---

## Documentation

### Fichiers obligatoires

- **README.md** : Vue d'ensemble du projet
- **CONTRIBUTING.md** : Guide de contribution (ce fichier)
- **docs/00-AI-Context/** : Documentation technique complète
- **Code comments** : Uniquement pour logique non-évidente

### Commenter le code

```typescript
// ✅ BON
// Redis key format: user:scores:{userId}
// TTL is set to 1 hour to avoid stale data after game updates
const key = `user:scores:${userId}`;

// ❌ MAUVAIS
// This is a key
const key = `user:scores:${userId}`;

// ❌ TRÈS MAUVAIS
const key = `user:scores:${userId}`; // Set the key
```

**Règles** :

- Commenter le **pourquoi**, pas le **quoi**
- Code self-documenting avec bons noms
- Comments au-dessus de la ligne concernée
- Pas de comments inutiles
- 1 ligne de comment max (2 en cas de besoin)

### Documentation API

Tous les endpoints doivent être documentés avec Swagger :

```typescript
@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiParam({ name: 'id', description: 'User ID' })
@ApiResponse({ status: 200, description: 'User found', type: UserDto })
@ApiResponse({ status: 404, description: 'User not found' })
async getUser(@Param('id') id: string) {
  return this.usersService.findById(id);
}
```

---

## AI Usage & Policy

### Contexte

Track'N Share utilise Claude AI (Anthropic) pour accélérer le développement du MVP. **L'IA est un outil d'assistance, pas un remplaçant** — tout code généré reste la responsabilité du développeur qui l'accepte.

### Lecture obligatoire

**Avant d'utiliser l'IA sur ce projet, lire** :

- 📋 **[AI_USAGE_POLICY.md](AI_USAGE_POLICY.md)** — Politique complète d'usage de l'IA

Cette politique couvre :
- ✅ Cas d'usage autorisés (CRUD, tests, docs, refactoring)
- ❌ Cas d'usage interdits (sécurité, secrets, logique métier critique)
- 🔍 Standards de qualité et validation
- 🔐 Règles de sécurité absolues
- 📝 Attribution et propriété intellectuelle
- 👥 Processus de revue et approbation

### Principes clés

1. **L'IA augmente, ne remplace pas**
   - Valider tout code avant merge
   - Comprendre ce que l'IA génère
   - Tester les fonctionnalités
   - Documenter les choix

2. **Responsabilité du développeur**
   - Tu acceptes le code → tu es responsable
   - Si un bug se produit → ta responsabilité
   - Si une faille de sécurité → ta responsabilité

3. **Zéro secrets**
   - ❌ Jamais de clés API, tokens, passwords dans le code
   - ✅ Toujours dans `.env` (git-ignored)
   - 🔍 Validation pré-merge obligatoire

4. **Cas critiques demandent approbation**
   - Authentification & permissions
   - Logique métier (scores, leaderboards)
   - Décisions architecturales majeures
   - → Créer une issue `ai-decision-needed` avant d'implémenter

### Attribution dans les commits

Si tu utilises l'IA, ajoute dans le commit :

```
feat(api): add score calculation with AI assistance

Generated score algorithm with Claude
Added tests and documentation

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Checklist IA avant PR

- [ ] Code généré compris et validé
- [ ] Tests écrits (70%+ couverture)
- [ ] Aucun secret hardcoded
- [ ] Lint et build passent
- [ ] Source IA documentée dans commit
- [ ] Revue sécurité si auth/permissions
- [ ] Documentation mise à jour

### Questions fréquentes sur l'IA

**Q : Je peux générer du code d'authentification ?**
R : Oui, mais doit être reviewé en détail avant merge. Voir AI_USAGE_POLICY.md section "Sécurité".

**Q : Je peux générer le scoring ?**
R : Oui, avec documentation de l'algorithme et tests exhaustifs. Demander approbation métier d'abord.

**Q : Je peux générer les permissions d'équipe ?**
R : Oui, mais revue sécurité obligatoire backend.

**Q : Quel cas c'est pas bon pour l'IA ?**
R : Voir AI_USAGE_POLICY.md "Cas d'usage interdits" — secrets, logique critique sans specs claires.

---

## Priorisation MVP

### Priority Levels

**P0 (MVP Critiques)** — Doit être terminé avant la soutenance :

1. Authentification
2. Dashboard joueur
3. Stats mockées
4. Score
5. Leaderboard solo
6. Équipes
7. Chat d'équipe
8. Sécurité de base

**P1 (Important)** — À faire après P0 :

- Données de démo
- Polish UI/UX
- Performance optimizations
- Documentation complète

**P2 (Bonus)** — Après MVP stable :

- Steam/Epic integrations complètes
- Amis et messages privés
- Feed social
- Tournois
- Matchmaking avancé
- Badges avancés
- Modération
- Chiffrement E2E

### Règle d'or

**Ne jamais ajouter de P2 tant que le P0 n'est pas terminé.**

Toute feature bonus doit attendre la stabilisation du MVP.

---

## Workflows et CI/CD

### Pre-commit checks

```bash
pnpm lint      # ESLint
pnpm format    # Prettier (auto-fix)
pnpm build     # Type check et build
```

### CI/CD sur push

- ✅ Lint pass
- ✅ Type check (TypeScript)
- ✅ Tests pass
- ✅ Build success
- ✅ Code coverage threshold

---

## Questions fréquentes

**Q : Je peux ajouter une nouvelle dépendance ?**
R : Demander dans une issue ou une discussion. Éviter les dépendances inutiles.

**Q : Où mettre les variables d'environnement ?**
R : Backend dans `.env`, frontend dans `.env.local`. Jamais dans le repo.

**Q : Comment tester avec de vraies données Steam/Epic ?**
R : Utiliser le MockProvider pour le MVP. Les vrais providers restent pour après la soutenance.

**Q : Je peux refactoriser l'architecture ?**
R : Demander d'abord. L'architecture est gelée pour le MVP.

**Q : Quel est le plan pour la sécurité ?**
R : Voir `docs/00-AI-Context/security-rgpd.md`. Review obligatoire pour tout changement d'auth ou permissions.

**Q : Je peux utiliser l'IA pour générer du code ?**
R : Oui, avec conditions. Lire [AI_USAGE_POLICY.md](AI_USAGE_POLICY.md) pour les cas autorisés/interdits, et attribuer Claude dans le commit.

**Q : L'IA peut générer de la logique métier (scores, leaderboards) ?**
R : Oui, mais doit avoir une spec claire d'abord et reviewer les tests. Sécurité + métier doivent approuver.

**Q : Quoi je peux pas demander à l'IA de générer ?**
R : Secrets, auth sans supervision, refactoring architecture sans approbation. Voir AI_USAGE_POLICY.md "Cas d'usage interdits".

**Q : Comment on attribut l'IA dans les commits ?**
R : Ajouter `Co-Authored-By: Claude <noreply@anthropic.com>` dans le footer du commit.

---

## Contacts et support

- **Lead Frontend** : Clément
- **Lead Backend** : Ioanes
- **Questions** : Créer une issue avec le label `question`

---

## Changelog

| Version | Date | Changements |
|---------|------|-------------|
| 1.1.0 | 2026-06-23 | Ajout de la politique d'usage IA et intégration AI_USAGE_POLICY.md |
| 1.0.0 | 2026-06-23 | Création initiale du guide de contribution |

---

**Merci de votre contribution à Track'N Share ! 🎮**
