# Dossier de validation CDAN (RNCP 36463) — kit complet

Point d'entrée unique pour la rédaction, les livrables et l'oral du titre
**Concepteur Développeur d'Applications Numériques**. Les deux projets supports
sont 🏢 **la chaîne de maintenance Roofline** (alternance) et 🎓 **Track'N Share**
(formation).

## 📁 Organisation du dossier

| Dossier | Contenu |
|---------|---------|
| [`reference-officielle/`](reference-officielle/) | Les 3 PDF IGS/France Compétences (source de vérité : référentiel, guide dossier, fiche entretien) |
| [`pour-rediger/`](pour-rediger/) | Ce qui sert à **écrire** le dossier (ne figure pas tel quel dans le rendu) |
| [`livrables/`](livrables/) | Les **pièces à insérer/annexer** au dossier |
| [`diagrammes/`](diagrammes/) | Les 3 schémas (PNG prêts à insérer + sources Mermaid) |
| [`oral/`](oral/) | Supports de soutenance (à rafraîchir : antérieurs à Roofline + mobile) |
| [`_archive/`](_archive/) | Documents d'analyse antérieurs, conservés pour mémoire (superseded) |

## ✅ Où trouver chaque pièce du dossier

### Pour rédiger
| Pièce | Fichier |
|-------|---------|
| Plan de la Partie 1 + règles anti-refus + **36 compétences** (contexte / angle / preuves / limite) | [pour-rediger/squelette-dossier-cdan.md](pour-rediger/squelette-dossier-cdan.md) |
| Preuves Roofline détaillées (fichier:ligne) + anecdotes orales + contexte entreprise | [pour-rediger/preuves-roofline.md](pour-rediger/preuves-roofline.md) |
| Guide des 14 captures d'annexes (commandes exactes + anonymisation) | [pour-rediger/guide-captures-preuves.md](pour-rediger/guide-captures-preuves.md) |
| Synthèse des choix techniques (bonnes pratiques) | [pour-rediger/choix-techniques-et-bonnes-pratiques.txt](pour-rediger/choix-techniques-et-bonnes-pratiques.txt) |

### Livrables / annexes
| Pièce | Fichier | Compétence |
|-------|---------|-----------|
| Tableau comparatif des 2 projets (Partie 1 §3) | [livrables/tableau-comparatif-projets.md](livrables/tableau-comparatif-projets.md) | Partie 1 |
| Matrice des risques | [livrables/matrice-risques.md](livrables/matrice-risques.md) | C1.8 |
| Audit RGAA chiffré (Lighthouse 100/100 + axe 0 violation) | [livrables/audit-rgaa.md](livrables/audit-rgaa.md) | C1.7 |
| Modèle d'attestation tuteur (Guillaume Jos) | [livrables/attestation-roofline-modele.md](livrables/attestation-roofline-modele.md) | C2.10 / C2.12 |
| PV de réception (à dater/signer en recette) | [livrables/pv-reception.md](livrables/pv-reception.md) | C2.9 (Activité 2.10 du référentiel) |
| PAQ (plan d'assurance qualité) | [livrables/paq.md](livrables/paq.md) | C1.2 |
| Plan de tests | [livrables/plan-de-tests.md](livrables/plan-de-tests.md) | C3.7 |
| Compte-rendu d'activité + taux de disponibilité | [livrables/compte-rendu-activite.md](livrables/compte-rendu-activite.md) | C3.8 / C2.7 |
| Checklist de démo / recette | [livrables/checklist-demo.md](livrables/checklist-demo.md) | C2.9 |
| Estimation de charge (autocannon) | [livrables/estimation-charge.md](livrables/estimation-charge.md) | C1.6 |
| Rétro-documentation (module Auth) | [livrables/retro-documentation-auth.md](livrables/retro-documentation-auth.md) | C4.1 |
| Note RSE / écoresponsabilité | [livrables/rse-ecoresponsabilite.md](livrables/rse-ecoresponsabilite.md) | C3.6 |

### Diagrammes (insérables dans le dossier)
| Schéma | Fichier | Compétence |
|--------|---------|-----------|
| Workflow documentaire Roofline | [diagrammes/workflow-roofline.png](diagrammes/workflow-roofline.png) | C2.3 / C2.5 |
| MCD Track'N Share (15 entités) | [diagrammes/mcd-tracknshare.png](diagrammes/mcd-tracknshare.png) | C2.4 |
| Architecture Track'N Share (3 apps) | [diagrammes/architecture-tracknshare.png](diagrammes/architecture-tracknshare.png) | C1.3 |

### Preuve de communication en anglais (C2.13)
README anglais du projet : [`../../README.en.md`](../../README.en.md) (racine du dépôt).

## 🚧 Ce qui dépend encore de toi (ne peut pas être généré)

1. **La rédaction** — 36 textes uniques à la 1ʳᵉ personne par-dessus le squelette (règle n°1 du jury : aucun paragraphe réutilisé).
2. **Les captures** (guide `pour-rediger/`) + **l'attestation signée** (Guillaume) + **le PV de recette signé**.
3. **La mise en page finale** propre (le jury blanc a refusé le texte « haché » du copier-coller ; table des matières paginée ; retirer la date de jury erronée).
4. **Rafraîchir les supports oraux** (`oral/`) avec Roofline + l'app mobile, une fois l'écrit avancé.
