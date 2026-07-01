# Plan de tests — Track'N Share

> **Livrable RNCP — BC03-7 / BC01-5** « Préparer des jeux d'essai / livrer un logiciel déverminé ».
> Date : 2026-07-01. Statut global : ✅ **76 tests verts** (46 unitaires back + 8 e2e + 22 front), exécutés en CI.

## 1. Stratégie de test

| Niveau | Outil | Portée | Où |
|--------|-------|--------|-----|
| Unitaire back | Jest | Logique métier isolée (calcul de score, guards, services, validation config) | `apps/api/src/**/*.spec.ts` |
| End-to-end back | Jest + supertest | Parcours HTTP réels contre PostgreSQL + Redis | `apps/api/test/app.e2e-spec.ts` |
| Unitaire front | Vitest + Testing Library | Composants, utils, intercepteur axios | `apps/web/src/**/*.test.tsx` |
| Intégration continue | GitHub Actions | Lint + build + tous les tests, bloquants | `.github/workflows/ci.yml` |

## 2. Cas de tests — back-end unitaire (46)

| Module | Fichier | Cas couverts |
|--------|---------|--------------|
| Score | `stats/utils/score.calculator.spec.ts` | Formule `KD×50 + WR×40 + matches×0.5`, cas limites (0 death, 0 match) |
| Guard membre | `teams/guards/team-member.guard.spec.ts` | Accès autorisé membre / refusé non-membre / équipe absente |
| Guard rôle | `teams/guards/team-role.guard.spec.ts` | CAPTAIN vs MEMBER, permissions |
| Auth | `auth/auth.service.spec.ts`, `auth.controller.spec.ts` | Register, login, identifiants invalides, hash bcrypt |
| Users | `users/users.service.spec.ts`, `users.controller.spec.ts` | Unicité pseudo, export RGPD, suppression compte |
| Config | `config/env.validation.spec.ts` | Rejet JWT_SECRET court, clé de chiffrement ≠ 32 octets |
| Health | `health/health.controller.spec.ts` | Statut BDD + Redis |
| Teams | `teams/teams.service.spec.ts` | Création, join, leave (promotion/dissolution) |
| Events | `events/events.gateway.spec.ts` | Gateway Socket.io |

## 3. Cas de tests — end-to-end (8) — parcours critique

Contre une **vraie base PostgreSQL + Redis** (conteneurs de service en CI).

| # | Scénario | Attendu |
|---|----------|---------|
| 1 | Inscription au payload invalide | `400 Bad Request` |
| 2 | Register → login → `GET /auth/me` avec token | `201` / `200` / `200` |
| 3 | Login identifiants inconnus | `401 Unauthorized` |
| 4 | Non-membre lit le chat d'une équipe | `403 Forbidden` |
| 5 | Non-membre poste un message | `403 Forbidden` |
| 6 | Non-membre voit le détail d'une équipe | `403 Forbidden` |
| 7 | Accès anonyme au chat | `401 Unauthorized` |
| 8 | RGPD : suppression compte → reconnexion | `204` puis `401` (données inexploitables) |

## 4. Cas de tests — front-end (22)

| Cible | Fichier | Cas |
|-------|---------|-----|
| Recherche emojis | `data/emojis.test.ts` | Filtrage, correspondances |
| Avatar initiales | `components/AvatarInitial.test.tsx` | Rendu selon pseudo |
| Bandeau consentement | `components/ConsentBanner.test.tsx` | Affichage, mémorisation du choix |
| Suggestion emoji | `components/EmojiSuggestion.test.tsx` | Autocomplétion clavier |
| Intercepteur API | `services/api.test.ts` | Injection du token, gestion 401 |

## 5. Exécution

```bash
pnpm --filter api test:ci     # 46 tests unitaires back
pnpm --filter api test:e2e    # 8 tests e2e (nécessite PostgreSQL)
pnpm --filter web test:ci     # 22 tests front
```

En CI, ces trois commandes sont **bloquantes** : un échec empêche l'intégration.

## 6. Résultat

Au 2026-07-01 : **76/76 tests verts**. Les jeux d'essai couvrent le calcul métier,
la sécurité d'accès (guards + parcours e2e), la conformité RGPD et le contrat
front. Aucun défaut connu ne persiste sur les chemins critiques.

## 7. Limites & perspectives

- Couverture e2e centrée sur le parcours critique (auth, sécurité, RGPD) ; extension possible au chat temps réel Socket.io.
- Pas encore de mesure de couverture formalisée (`test:cov` disponible).
- Tests de charge traités séparément (voir [estimation-charge.md](estimation-charge.md)).
