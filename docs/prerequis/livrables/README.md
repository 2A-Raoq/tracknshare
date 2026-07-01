# Livrables RNCP CDAN — Track'N Share

> Livrables produits le 2026-07-01 pour compléter le dossier de validation du
> titre RNCP CDAN (36462/36463). Complètent [../ecart-doc-code-et-rncp.md](../ecart-doc-code-et-rncp.md)
> et [../cartographie-competences-cdan.md](../cartographie-competences-cdan.md).

## Index des livrables

| Livrable | Bloc(s) RNCP | Statut |
|----------|--------------|--------|
| [plan-de-tests.md](plan-de-tests.md) | BC03-7, BC01-5 | ✅ 76 tests verts |
| [estimation-charge.md](estimation-charge.md) | BC01-6 | ✅ Mesures réelles + script |
| [rse-ecoresponsabilite.md](rse-ecoresponsabilite.md) | BC03-6 | ✅ Rédigé |
| [audit-rgaa.md](audit-rgaa.md) | BC01-7 | ⚙️ Procédure prête, scores à consigner |
| [pv-reception.md](pv-reception.md) | BC02-9 | ⚙️ À dater/signer |
| [paq.md](paq.md) | BC01-2, BC02 | ✅ Rédigé |
| [compte-rendu-activite.md](compte-rendu-activite.md) | BC03-8 | ✅ Rédigé |
| [retro-documentation-auth.md](retro-documentation-auth.md) | BC04-1 | ✅ Rédigé |
| [diagramme-workflow.md](diagramme-workflow.md) | BC02-3 | ✅ Rédigé |
| [checklist-demo.md](checklist-demo.md) | BC02-9/11 | ✅ Rédigé |

## Preuves code associées (déjà dans le dépôt)

- Tests e2e : `apps/api/test/app.e2e-spec.ts` (8 tests) + script `test:e2e`.
- CI/CD : `.github/workflows/ci.yml` (lint + build + tests unit + e2e, PostgreSQL + Redis).
- Script de charge : `apps/api/perf/load-test.mjs`.
- Application mobile native : `apps/mobile/` (Expo/React Native, 18 écrans).

## Reste à faire (non bloquant pour un critère obligatoire)

1. Exécuter Lighthouse/axe et consigner les scores dans [audit-rgaa.md](audit-rgaa.md).
2. Dater et signer [pv-reception.md](pv-reception.md) après la recette.
3. Préparer la présentation orale à partir de [checklist-demo.md](checklist-demo.md).
