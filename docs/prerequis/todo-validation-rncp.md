# TODO — Validation du titre RNCP CDAN (36462/36463)

> Liste d'actions restantes pour valider les **4 blocs** du titre.
> Basée sur la vérification du code réel au **2026-07-01** (branche `feat/mobile-app`).
> Le code MVP + démarche d'ingénierie (tests, CI, Docker, sécurité, RGPD) est **déjà livré** ✅.
> Ce qui reste = surtout des **livrables/preuves** documentaires + quelques finitions.
>
> Légende : 🔴 critique · 🟠 haute · 🟡 moyenne · 🟢 basse. `[ ]` à faire · `[x]` fait.
>
> **MàJ 2026-07-01** — L'essentiel est traité. Tests e2e écrits + branchés en CI, docs de suivi mises à jour (mobile), et **livrables rédigés dans [`livrables/`](livrables/)**. Ne restent que 3 finitions manuelles : exécuter l'audit RGAA, signer le PV de réception, préparer l'oral.

---

## 0. Mettre à jour les documents de suivi (bascule mobile)

Les docs `ecart-doc-code-et-rncp.md` et `cartographie-competences-cdan.md` datent d'avant l'app mobile et ne la créditent pas.

- [x] 🟠 Recréditer l'**app mobile native** (Expo/React Native, `apps/mobile/`) comme preuve : BC03, BC04-4, BC01-7. ✅
- [x] 🟠 Retirer / marquer **obsolète l'action « PWA »** (#11) : remplacée par l'app mobile. ✅
- [x] 🟢 Réaligner les taux de couverture par bloc dans la vue synthétique. ✅ (BC01 ~90 %, BC02 ~80 %, BC03 ~95 %, BC04 ~85 %)

---

## 1. Preuves de qualité logicielle (BC03-7, BC01-5) — 🔴 critique

- [x] 🔴 **Activer et écrire les tests e2e** : `apps/api/test/app.e2e-spec.ts` réécrit — 8 tests (auth register→login→me, non-membre chat 403, anonyme 401, RGPD delete→relogin 401). ✅ **8/8 verts**
- [x] 🟠 **Brancher les tests e2e dans la CI** : script `test:e2e` + étape CI + services PostgreSQL/Redis dans `.github/workflows/ci.yml`. ✅
- [x] 🟡 **Formaliser un plan de tests** → [livrables/plan-de-tests.md](livrables/plan-de-tests.md) (76 tests). ✅

## 2. Accessibilité (BC01-7) — 🟠 haute

- [x] 🟠 **Guide d'audit RGAA** rédigé (procédure Lighthouse/axe + revue mobile) → [livrables/audit-rgaa.md](livrables/audit-rgaa.md). ✅
- [ ] 🟡 **Exécuter** Lighthouse/axe, consigner les scores dans la grille et corriger les écarts. ⚙️ *action manuelle restante*

## 3. Estimation de charge & performance (BC01-6) — 🟡 moyenne

- [x] 🟡 **Note d'estimation de charge** (chiffres réels : ~1970 req/s, p99 83 ms, marge ~60×) → [livrables/estimation-charge.md](livrables/estimation-charge.md). ✅
- [x] 🟡 **Test de charge** autocannon reproductible → `apps/api/perf/load-test.mjs` (exécuté). ✅

## 4. Intégrations & RSE (BC03-6) — 🟡 moyenne

- [x] 🟡 **Volet RSE / écoresponsabilité** → [livrables/rse-ecoresponsabilite.md](livrables/rse-ecoresponsabilite.md). ✅

## 5. Livrables formels du dossier (BC02-9, BC03-8, BC04-1) — 🟡 moyenne

- [x] 🟡 **PV de réception** (modèle) → [livrables/pv-reception.md](livrables/pv-reception.md). ✅ *à dater/signer en recette*
- [x] 🟡 **PAQ** → [livrables/paq.md](livrables/paq.md). ✅
- [x] 🟡 **Compte-rendu d'activité (CRA)** + taux de disponibilité → [livrables/compte-rendu-activite.md](livrables/compte-rendu-activite.md). ✅
- [x] 🟡 **Rétro-documentation** (module Auth) → [livrables/retro-documentation-auth.md](livrables/retro-documentation-auth.md). ✅
- [x] 🟡 **Diagramme de workflow** → [livrables/diagramme-workflow.md](livrables/diagramme-workflow.md). ✅
- [ ] 🟢 **Document structuré en anglais** (BC02-13) — ex. un README technique EN. *(optionnel)*

## 6. Préparation de la soutenance (BC02-10) — 🟢 basse

- [x] 🟢 **Harmoniser le mot de passe démo** : recette corrigée `DemoPassword123!` → `Demo1234!` (source seed). ✅
- [x] 🟢 **Checklist du parcours de démo** → [livrables/checklist-demo.md](livrables/checklist-demo.md). ✅
- [ ] 🟢 **Rejouer le parcours de démo end-to-end** avant l'oral (Docker → login → … → mobile → Swagger). ⚙️
- [ ] 🟢 **Répartir les contributions par compétence** (dossier individuel Clément/Ioanes). ⚙️
- [ ] 🟢 Préparer le **discours oral 20 min**. ⚙️

---

## État au 2026-07-01

Le seul critère **obligatoire** encore non prouvé (tests e2e) est **résolu**. Tous
les livrables sont rédigés dans [`livrables/`](livrables/). Ne restent que des
**actions manuelles non bloquantes** :

1. Exécuter l'audit RGAA et consigner les scores (§2).
2. Dater/signer le PV de réception après la recette (§5).
3. Rejouer la démo + préparer l'oral + répartir les preuves par candidat (§6).

---

_Généré le 2026-07-01. Voir [ecart-doc-code-et-rncp.md](ecart-doc-code-et-rncp.md) et [cartographie-competences-cdan.md](cartographie-competences-cdan.md)._
