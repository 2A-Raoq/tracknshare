# Procès-verbal de réception — Track'N Share

> **Livrable RNCP — BC02-9** « Clôturer une mission (validation du livrable, PV de réception) ».
> Modèle à dater et signer lors de la recette finale.

## 1. Identification

| Champ | Valeur |
|-------|--------|
| Projet | Track'N Share — plateforme de suivi de statistiques de jeu |
| Version livrée | MVP 1.0 (web + API + application mobile native) |
| Date de recette | _à compléter_ |
| Lieu | _à compléter_ |
| Maîtrise d'ouvrage (recette) | _à compléter_ |
| Maîtrise d'œuvre | Clément (front / mobile), Ioanes (back) |

## 2. Périmètre réceptionné

- Authentification (JWT, bcrypt, guards).
- Dashboard joueur + stats + score calculé côté back.
- Leaderboard solo (tri, pagination cursor, cache Redis).
- Équipes (création, join, détail, quitter) + chat temps réel (Socket.io + fallback REST, chiffrement AES-256-GCM).
- RGPD (export, suppression de compte, consentement, page confidentialité).
- Application mobile native (Expo/React Native) consommant l'API.
- Documentation Swagger, seed de démo, conteneurisation Docker, CI/CD.

## 3. Résultats de la recette

| Domaine | Critère | Résultat |
|---------|---------|----------|
| Parcours nominal | Register → login → dashboard → stats → score → leaderboard → équipe → chat | ✅ (voir `docs/drive-export/10-Tests/Recette-soutenance.md`) |
| Sécurité | Accès chat interdit aux non-membres, mots de passe hashés, headers Helmet, rate limiting | ✅ (tests e2e + unitaires) |
| RGPD | Export + suppression + consentement | ✅ |
| Tests automatisés | 76 tests verts (46 unit + 8 e2e + 22 front) en CI | ✅ |
| Conteneurisation | 4 conteneurs *healthy* (api, web, postgres, redis) | ✅ |
| Mobile | 18 écrans fonctionnels sur l'API | ✅ |

## 4. Réserves / anomalies

| # | Description | Criticité | Décision |
|---|-------------|-----------|----------|
| _ex._ | Audit RGAA à finaliser (scores à consigner) | Mineure | Sans blocage de la réception |
| | | | |

## 5. Décision de réception

- [ ] **Réception sans réserve**
- [ ] **Réception avec réserves** (voir §4)
- [ ] **Réception refusée**

## 6. Signatures

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Maîtrise d'ouvrage | | | |
| Maîtrise d'œuvre | | | |
