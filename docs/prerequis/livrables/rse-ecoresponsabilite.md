# Volet RSE & écoconception numérique — Track'N Share

> **Livrable RNCP — BC03-6** « Intégrer des éléments logiciels… en tenant compte d'une politique RSE / d'écoresponsabilité ».
> Date : 2026-07-01.

## 1. Démarche

Track'N Share applique des principes d'**écoconception logicielle** (sobriété
numérique) et de **responsabilité sociétale** cohérents avec un projet étudiant.
L'objectif : limiter la consommation de ressources (CPU, réseau, stockage) tout
en garantissant l'accessibilité et la protection des données.

## 2. Sobriété technique — décisions et preuves

| Levier d'écoconception | Mise en œuvre dans le projet | Bénéfice |
|------------------------|------------------------------|----------|
| **Cache pour éviter les recalculs** | Cache Redis (TTL 30 s) sur le leaderboard, `HttpCacheInterceptor` | Moins de requêtes SQL → moins de CPU/énergie BDD |
| **Requêtes ciblées** | QueryBuilder sélectif, `select:false` sur colonnes sensibles, pagination **cursor** (pas d'`OFFSET` coûteux) | Volume de données transféré et scanné minimal |
| **Index adaptés** | `idx_leaderboard_query` et contraintes ciblées | Requêtes bornées, pas de full-scan |
| **Payloads légers** | DTO/`toPublic()` ne renvoient que les champs utiles (pas de sur-fetching) | Bande passante réduite (≈ 3 Ko/réponse leaderboard) |
| **Images légères côté conteneurs** | Images Docker `*-alpine` (PostgreSQL/Redis), Dockerfiles **multi-stage** (build ≠ runtime) | Empreinte disque et surface réseau réduites |
| **Une seule instance suffit** | Capacité mesurée ≈ 60× la charge cible (voir [estimation-charge.md](estimation-charge.md)) | Pas de sur-provisionnement matériel |
| **Client mobile natif efficient** | App Expo/React Native réutilisant le même contrat d'API (pas de duplication back) | Réutilisation → moins de code à maintenir/exécuter |

## 3. Responsabilité sociétale

- **Accessibilité** : UI responsive, ARIA, navigation clavier, contrastes sombres — démarche RGAA amorcée (voir [audit-rgaa.md](audit-rgaa.md)). Inclusion des utilisateurs en situation de handicap.
- **Protection des données (RGPD)** : minimisation des données, droit à l'oubli (`DELETE /users/me`), portabilité (`GET /users/me/export`), consentement explicite, chiffrement AES-256-GCM des messages. Voir `docs/drive-export/09-Securite-RGPD/`.
- **Usage encadré de l'IA** : `AI_USAGE_POLICY.md` documente un recours transparent et responsable aux assistants IA.
- **Données de démo fictives** : aucun jeu de données personnel réel n'est utilisé pour la soutenance.

## 4. Pistes d'amélioration (mentionnées comme perspectives)

- Mesurer l'empreinte carbone via un outil type **GreenIT / EcoIndex** sur le front.
- Politique de rétention/purge automatique des messages anciens.
- Optimisation des assets front (lazy-loading, compression images).
- Hébergement sur une infrastructure à faible intensité carbone.

## 5. Synthèse

L'écoresponsabilité n'a pas été traitée comme une couche ajoutée *a posteriori*
mais comme une **conséquence de choix d'architecture sobres** (cache, requêtes
ciblées, images légères, réutilisation), déjà présents dans le code et mesurables.
