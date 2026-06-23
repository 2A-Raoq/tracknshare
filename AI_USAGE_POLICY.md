# AI Usage Policy — Track'N Share

Ce document définit les règles d'utilisation de l'IA (Claude) dans le développement de Track'N Share.

## Table des matières

- [Principes généraux](#principes-généraux)
- [Cas d'usage autorisés](#cas-dusage-autorisés)
- [Cas d'usage interdits](#cas-dusage-interdits)
- [Qualité et validation](#qualité-et-validation)
- [Propriété intellectuelle](#propriété-intellectuelle)
- [Sécurité et secrets](#sécurité-et-secrets)
- [Documentation et attribution](#documentation-et-attribution)
- [Revue et approbation](#revue-et-approbation)
- [Limites éthiques](#limites-éthiques)
- [Escalade et décisions](#escalade-et-décisions)

---

## Principes généraux

### Philosophie

L'IA est un **outil d'assistance**, pas un remplaçant :

- ✅ Augmente la productivité et la qualité
- ✅ Accélère les tâches répétitives
- ✅ Aide à la documentation et au refactoring
- ✅ Propose des solutions alternatives
- ❌ Ne remplace pas la relecture humaine
- ❌ Ne remplace pas la compréhension du code
- ❌ Ne remplace pas les tests

### Responsabilité

**Tout code généré par l'IA reste la responsabilité du développeur qui l'accepte et le merge.**

- Valider le code avant merge
- Tester les fonctionnalités
- Comprendre le code genéré
- Documenter les choix de l'IA
- Accepter les conséquences des bugs

---

## Cas d'usage autorisés

### 1. Génération de code simple et répétitif

✅ **Autorisé** :

- CRUD basiques (Create, Read, Update, Delete)
- DTOs et types TypeScript boilerplate
- Getters/setters simples
- Tests unitaires standards
- Migrations de base de données simples
- Configuration Prettier/ESLint

```typescript
// ✅ OK - Généré par l'IA
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 2. Documentation et commentaires

✅ **Autorisé** :

- Documentation de modules et services
- README et guides utilisateur
- API documentation (Swagger)
- Commentaires expliquant la logique métier
- Migration de documentation (docx → markdown)
- Génération d'exemples d'utilisation

```typescript
/**
 * Service pour gérer les utilisateurs
 * Responsabilités:
 * - Créer/lire/mettre à jour des utilisateurs
 * - Valider les données avec DTO
 * - Calculer les statistiques utilisateur
 */
@Injectable()
export class UsersService {
  // ...
}
```

### 3. Refactoring et optimisation

✅ **Autorisé** :

- Simplification de code existant
- Extraction de constantes
- Suppression de duplication
- Migration de patterns (callback → async/await)
- Optimisation de requêtes SQL
- Amélioration de la lisibilité
- Addition d'indexes PostgreSQL

**Condition** : Le code refactorisé doit passer les tests existants.

### 4. Debugging et diagnostique

✅ **Autorisé** :

- Analyser un stacktrace et proposer des fixes
- Identifier les race conditions
- Vérifier la logique métier
- Proposer des optimisations de performance
- Lister les cas limites non gérés
- Analyser les logs et erreurs

### 5. Architecture et design

✅ **Autorisé** :

- Proposer une architecture pour une nouvelle feature
- Valider une architecture proposée par un dev
- Identifier les violations du pattern existant
- Planifier le split de responsabilités
- Vérifier la cohérence avec CLAUDE.md et le MVP

**Condition** : Toute décision architecture doit être validée par le lead du domaine.

### 6. Tests et assertions

✅ **Autorisé** :

- Générer des tests unitaires
- Générer des tests d'intégration
- Écrire des assertions complexes
- Créer des fixtures et mocks
- Générer des scénarios de test

**Condition** : Les tests doivent couvrir les cas nominaux et limites.

### 7. Configuration et DevOps

✅ **Autorisé** :

- Générer des fichiers de configuration
- Créer des scripts de déploiement
- Configurer Docker et docker-compose
- Écrire des workflows GitHub Actions
- Gérer les variables d'environnement

**Condition** : Toute config sensible doit être validée en revue.

---

## Cas d'usage interdits

### 1. Sécurité et authentification

❌ **Interdit** :

- Générer du code d'authentification sans relecture complète
- Générer du code de permission/autorisation sans review sécurité
- Créer de la crypto ou du hashing custom
- Implémenter de la validation de password custom
- Générer des tokens ou sessions sans supervision

**Raison** : Les failles de sécurité peuvent compromettre tout le projet.

**Process** : Toute feature d'auth doit être :
1. Générée avec prompt très détaillé
2. Reviewée par un expert sécurité
3. Testée avec des cas de boundary
4. Documentée explicitementc

### 2. Logique métier critique

❌ **Interdit** :

- Calculer le score sans supervision
- Implémenter des permissions d'équipe sans validation
- Générer du code d'accès aux données sensibles
- Créer la logique de chat d'équipe sans review
- Implémenter le système de modération

**Raison** : Les bugs métier affectent la compétitivité et l'intégrité du jeu.

**Process** :
1. Algorithme défini clairement en document
2. Code généré sur base de ce document
3. Tests exhaustifs avec cas limites
4. Validation métier par le product owner

### 3. Gestion de secrets

❌ **Interdit** :

- Mettre des API keys dans le code
- Générer des tokens hardcoded
- Créer des passwords en plaintext
- Stocker des secrets en variables globales
- Afficher des secrets dans les logs

**Process** :
- Tous les secrets dans `.env`
- Variables d'environnement validées au startup
- Rotation des secrets documentée
- Audit des accès aux secrets

### 4. Décisions architecturales majeures

❌ **Interdit sans approbation** :

- Ajouter une nouvelle base de données
- Changer le pattern d'authentification
- Refactoriser un module core
- Introduire une dépendance majeure
- Changer le modèle de données fondamental

**Process** :
1. Proposer l'architecture
2. Valider avec les leads (Clément + Ioanes)
3. Documenter la décision
4. Implémenter après approbation

### 5. Code trop complexe sans supervision

❌ **Interdit** :

- Générer > 100 lignes sans revue intermédiaire
- Générer du code avec > 3 niveaux de nesting
- Générer des patterns personnalisés non documentés
- Générer du code avec des dépendances externes bizarres
- Générer des optimisations "magiques" non commentées

**Process** :
- Diviser en chunks plus petits
- Reviewer à chaque étape
- Commenter chaque choix non-évident
- Tester incrementalement

### 6. Propriété intellectuelle tierce

❌ **Interdit** :

- Copier du code d'autres projets sans attribution
- Utiliser des algoritmes propriétaires sans licence
- Générer du code basé sur des sources copyrightées
- Incorporer des designs ou assets propriétaires

**Process** :
- Toujours demander la source à l'IA
- Vérifier les licences (MIT, Apache, GPL, etc.)
- Attribuer les sources externes
- Demander permission si GPL

---

## Qualité et validation

### Standards minimums

Tout code généré par l'IA doit :

- [ ] **Compiler sans erreurs** — `pnpm build` doit passer
- [ ] **Passer le linting** — `pnpm lint` doit passer
- [ ] **Passer les type checks** — TypeScript strict mode
- [ ] **Avoir des tests** — couverture minimum 70%
- [ ] **Être documented** — README ou code comments
- [ ] **Respecter l'architecture** — CLAUDE.md et structure existante
- [ ] **Pas de secrets** — zéro clé, token ou password
- [ ] **Lisible** — pas d'obfuscation, noms clairs
- [ ] **Maintenable** — pas de "magic" non documenté

### Processus de validation

**Étape 1 : Validation automatique**
```bash
pnpm lint      # ESLint + Prettier
pnpm build     # TypeScript + compilation
pnpm test      # Tests unitaires et d'intégration
```

**Étape 2 : Revue manuelle**
- [ ] Code lisible et compréhensible
- [ ] Pas de duplication avec le code existant
- [ ] Performance acceptable
- [ ] Gestion d'erreurs complète
- [ ] Respect des patterns du projet
- [ ] Documentation suffisante

**Étape 3 : Tests fonctionnels**
- [ ] Tester localement en `pnpm dev`
- [ ] Vérifier les cas nominaux
- [ ] Vérifier les cas limites et erreurs
- [ ] Tester sur mobile si UI
- [ ] Tester la performance si requis

**Étape 4 : Merge**
- Minimum 1 approbation
- Tous les checks passent
- Documentation mise à jour

---

## Propriété intellectuelle

### Attribution

**Toute contribution IA doit être documentée :**

```markdown
## IA-Assisted Development

Cette feature a été développée avec l'aide de Claude AI (Anthropic):
- Architecture proposée par Claude
- Code généré par Claude
- Tests écrits par Claude
- Validation et refactoring manuel

Claude a aidé à:
- [ ] Architecture et design
- [ ] Génération de code boilerplate
- [ ] Tests et validation
- [ ] Documentation

Validation humaine:
- [ ] Code review - @dev-name
- [ ] Tests manuels - @dev-name
- [ ] Security review - @security-lead
```

### Propriété

- **Code généré par l'IA** → Propriété du projet Track'N Share
- **Licences respectées** → Tous les packages doivent respecter la licence du projet
- **Génération IA** → Documentée dans les commits et PRs

---

## Sécurité et secrets

### Règles absolues

❌ **JAMAIS dans le code généré** :

- Clés API Steam, Epic, Discord
- Tokens JWT ou sessions
- Database passwords
- Private keys ou certificates
- Clés de chiffrement
- URLs sensibles avec credentials
- Noms d'utilisateurs/emails de test réels

✅ **Toujours dans `.env`** :

```bash
# .env (git-ignored)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
STEAM_API_KEY=xxx
JWT_SECRET=xxx
```

### Validation avant merge

**Checklist sécurité** :

```bash
# Chercher les patterns dangereux
grep -r "password\|secret\|api.?key\|token" src/ --include="*.ts" --include="*.tsx"

# Vérifier les .env ne sont pas tracked
git ls-files | grep -E "\.env(\.|$)"

# Vérifier les logs ne contiennent pas de secrets
grep -r "console.log.*password\|secret" src/
```

---

## Documentation et attribution

### Dans les commits

```
feat(api): add user scoring with AI assistance

- Generated score calculation algorithm with Claude
- Added caching layer for performance
- Implemented cursor pagination

AI-assisted: architecture + code generation + tests
Validated: manual review + security audit + performance testing

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Dans les PRs

```markdown
## AI Contribution

- **Generated with**: Claude AI (Anthropic)
- **Scope**: Score calculation logic, tests, documentation
- **Assistance**: 
  - Architecture design
  - Code generation
  - Unit tests
  - API documentation
- **Review**: Manual validation of logic, security, performance
```

### Dans le code

```typescript
/**
 * Score calculation service
 * 
 * Logic:
 * - Base score from game performance
 * - Multiplier based on game difficulty
 * - Time bonus for speed
 * 
 * Generated with AI assistance (Claude)
 * Validated against spec in docs/00-AI-Context/domain-model.md
 */
@Injectable()
export class ScoreService {
  // ...
}
```

---

## Revue et approbation

### Qui revoit ?

| Type | Reviewer | Effort |
|------|----------|--------|
| Code simple/CRUD | Tout dev | Low |
| Logique métier | Clément (web) ou Ioanes (api) | Medium |
| Sécurité/Auth | Lead security (à désigner) | High |
| Architecture | Clément + Ioanes | High |
| Performance | Performance specialist | Medium |

### Checklist de revue IA

```markdown
### Code Generation Review
- [ ] Source à l'IA explicitée ("généré à partir de...")
- [ ] Pas de dépendance inattendues
- [ ] Pas de secrets hardcoded
- [ ] Pas de duplication avec le code existant
- [ ] Lint passe (pnpm lint)
- [ ] Build passe (pnpm build)
- [ ] Tests passe (pnpm test)
- [ ] Tests couvrent les cas limites
- [ ] Documentation présente
- [ ] Performance acceptable
- [ ] Pas de breaking changes
```

---

## Limites éthiques

### Ce qu'on accepte

✅ Utiliser l'IA pour :
- Augmenter la productivité
- Maintenir la qualité du code
- Éduquer sur les best practices
- Accélérer le MVP

### Ce qu'on refuse

❌ Refusé :
- Générer du code sans l'examiner
- Accepter du code juste parce qu'il "semble ok"
- Utiliser l'IA pour contourner la sécurité
- Générer du contenu offensant/discriminant
- Contourner les règles de gouvernance
- Laisser l'IA prendre des décisions métier

### Responsabilité humaine

**Le développeur humain reste responsable du code qui sort, peu importe son origine.**

- Si un bug se produit → c'est ta responsabilité
- Si une faille de sécurité est trouvée → c'est ta responsabilité
- Si la perf est mauvaise → c'est ta responsabilité
- Si les specs ne sont pas respectées → c'est ta responsabilité

---

## Escalade et décisions

### Quand demander une approbation spéciale ?

**Demander avant d'implémenter si** :

- La feature touche à l'authentification ou permissions
- La logique métier est complexe ou nouvelle
- C'est une décision architecturale majeure
- C'est potentiellement une faille de sécurité
- C'est une performance critique
- Tu n'es pas certain si c'est "IA-friendly"

### Comment demander ?

1. **Créer une issue** avec le label `ai-decision-needed`
2. **Proposer la solution** (la suggestion IA)
3. **Justifier les choix** (pourquoi cette approche)
4. **Lister les risques** (quoi pourrait mal tourner)
5. **Mentionner les validateurs** (@clément, @ioanes, etc.)

### Processus d'escalade

```
Développeur avec doute
         ↓
Issue avec propositionIA
         ↓
Revue par lead du domaine
         ↓
Approbation explicite
         ↓
Implémentation
         ↓
Merge après review standard
```

---

## Cas particuliers

### Données de test et mocks

✅ **Autorisé** :

- Générer des données mock pour les tests
- Créer des fixtures avec des données fictives
- Générer des seeded databases pour le dev local

❌ **Interdit** :

- Utiliser des données réelles de vrais utilisateurs
- Créer des données personnelles realistes
- Générer des données sensibles (emails réels, etc.)

### Migrations de base de données

✅ **Autorisé** :

- Générer les migrations SQL basiques
- Vérifier la syntaxe PostgreSQL
- Proposer des indexes

❌ **Interdit sans revue** :

- Changer le modèle de données fondamental
- Supprimer des colonnes (risque de perte de données)
- Changer les types de colonnes
- Migrations sur données en production

### Performance et optimisations

✅ **Autorisé** :

- Proposer des indexes PostgreSQL
- Suggérer du caching Redis
- Optimiser les queries N+1
- Utiliser cursor pagination

❌ **Interdit** :

- Implémenter une "optimisation magique" sans compréhension
- Faire du micro-optimizing prématuré
- Ajouter de la complexité pour "juste au cas où"

---

## Metrics et suivi

### Qu'on mesure

- **PRs IA-assisted** : % des PRs avec contribution IA
- **Code coverage** : doit rester > 70%
- **Build success rate** : doit rester 100%
- **Review time** : temps moyen de review
- **Incident rate** : bugs trouvés en production

### Rapport mensuel

```markdown
## IA Usage Report - [Month]

### Metrics
- Total PRs: X
- IA-assisted: Y (Z%)
- Code coverage: A%
- Build success: B%

### Top use cases
1. ...
2. ...
3. ...

### Issues found
- Incident: ...
- Fix: ...

### Recommendations
- Continue using IA for: ...
- Reduce IA usage for: ...
- Training needed on: ...
```

---

## Formation et training

### Obligatoire pour tous

Avant d'utiliser l'IA sur le projet, lire :

- [ ] Ce document (AI_USAGE_POLICY.md)
- [ ] CLAUDE.md (instructions Claude Code)
- [ ] CONTRIBUTING.md (guide de contribution)
- [ ] Les docs du projet (docs/00-AI-Context/)

### Sessions de training

- Mensuel : review de l'usage IA
- Trimestriel : atelier "IA best practices"
- Ad-hoc : security audits si faille découverte

---

## Contacts et questions

- **Questions techniques IA** : @clément
- **Questions sécurité** : @security-lead (à définir)
- **Questions légales/contrats** : Management
- **Problèmes éthiques** : Team + Management

---

## Changelog

| Version | Date | Changements |
|---------|------|-------------|
| 1.0.0 | 2026-06-23 | Création initiale de la politique d'usage IA |

---

**Objectif : Utiliser l'IA intelligemment pour accélérer le MVP sans compromettre la qualité ou la sécurité. 🚀**
