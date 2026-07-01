# Rétro-documentation — Module d'authentification (AuthModule)

> **Livrable RNCP — BC04-1** « Analyse organique d'un logiciel existant (rétro-documentation disponible, fiable) ».
> Reconstitution de la conception à partir du code existant (`apps/api/src/auth`).
> Date : 2026-07-01.

## 1. Rôle du module

`AuthModule` gère l'inscription, la connexion et la protection des routes par
jeton JWT. Il s'appuie sur `UsersModule` (persistance) et `@nestjs/jwt`.

## 2. Composants (analyse organique)

| Composant | Fichier | Responsabilité |
|-----------|---------|----------------|
| `AuthController` | `auth/auth.controller.ts` | Expose `POST /auth/register`, `POST /auth/login`, `GET /auth/me`. Rate limiting renforcé (5 register/min, 10 login/min). |
| `AuthService` | `auth/auth.service.ts` | Logique métier : création utilisateur, vérification bcrypt, signature du JWT. |
| `JwtAuthGuard` | `auth/jwt-auth.guard.ts` | Protège les routes privées (extends `AuthGuard('jwt')`). |
| `JwtStrategy` (Passport) | `auth/` | Valide le token, injecte `req.user` (`userId`, `role`). |
| DTO | `auth/dto/register.dto.ts`, `login.dto.ts` | Validation des entrées (email, pseudo 3–30, mot de passe 8–72). |

## 3. Flux nominal (séquence)

```
Client            AuthController        AuthService         UsersService     JwtService
  │  POST /register    │                    │                   │               │
  ├───────────────────►│                    │                   │               │
  │                    ├─ register() ──────►│                   │               │
  │                    │                    ├─ create() ───────►│ (hash bcrypt) │
  │                    │                    │◄──────────────────┤               │
  │                    │                    ├─ signToken() ─────────────────────►│
  │                    │                    │◄──────────────────────────────────┤
  │◄─ { user, accessToken } ────────────────┤                   │               │
```

Login : identique sauf `findByEmailWithPasswordHash()` + `bcrypt.compare()` ;
échec → `401 AUTH_INVALID_CREDENTIALS`.

Accès route protégée : `JwtAuthGuard` → `JwtStrategy.validate()` → `req.user`.

## 4. Règles de gestion reconstituées

- Le mot de passe n'est **jamais** stocké en clair (bcrypt, 10 rounds).
- `passwordHash` en `select:false` : jamais renvoyé dans les réponses publiques.
- Le JWT porte `sub` (id) et `role` ; durée de vie configurée via `JWT_EXPIRES_IN`.
- Un secret JWT < 16 caractères empêche le démarrage (fail-fast, `env.validation.ts`).

## 5. Dépendances externes

- `bcrypt` (hash), `@nestjs/jwt` + `passport-jwt` (jetons), `class-validator` (DTO).

## 6. Points de vérification (fiabilité de la rétro-doc)

- Comportement confirmé par les tests : `auth.service.spec.ts`, `auth.controller.spec.ts` et les tests e2e (register→login→me, identifiants invalides → 401).
- Cohérence avec le contrat d'API : `docs/00-AI-Context/api-contract.md`.

## 7. Schéma de données concerné

`User` (id UUID, email unique, username unique, passwordHash `select:false`,
role) — voir `users/entities/user.entity.ts` et la migration initiale.
