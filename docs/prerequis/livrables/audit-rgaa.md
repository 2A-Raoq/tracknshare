# Audit d'accessibilité (RGAA) — Track'N Share

> **Livrable RNCP — BC01-7** « Respecter une norme de présentation des écrans / accessibilité handicap (RGAA) ».
> Date : 2026-07-01. Statut : ⚙️ **guide + relevé à compléter** (procédure prête, à exécuter puis consigner les scores).

## 1. Périmètre

Application web (`apps/web`) + application mobile native (`apps/mobile`).
Référentiel visé : **RGAA 4.1** (aligné WCAG 2.1 AA), critères prioritaires.

## 2. Bonnes pratiques déjà en place (preuves)

| Thème RGAA | Mise en œuvre | Où |
|------------|---------------|-----|
| Structure sémantique | HTML sémantique, landmarks, titres hiérarchisés | `apps/web/src` |
| Rôles & états ARIA | `role`, `aria-label`, `aria-modal` sur modales, listes | composants web |
| Navigation clavier | Autocomplétion emoji navigable au clavier, focus gérés | `EmojiSuggestion` |
| Contrastes | Thème sombre gaming à fort contraste texte/fond | design tokens |
| Responsive | Mobile-first, pas de perte d'information au zoom | layout global |
| Équivalents textuels | Avatars à initiales (`AvatarInitial`) au lieu d'images sans alt | `components/AvatarInitial` |
| Mobile natif | Composants RN accessibles (`accessibilityLabel` à généraliser) | `apps/mobile/src` |

## 3. Procédure d'audit à exécuter

### 3.1 Web — outils automatiques

```bash
# Lighthouse (catégorie Accessibility)
npx lighthouse http://localhost:5173/dashboard --only-categories=accessibility --view

# axe-core (via l'extension navigateur axe DevTools, ou CLI)
npx @axe-core/cli http://localhost:5173/dashboard
```

Pages à auditer : `/`, `/login`, `/register`, `/dashboard`, `/leaderboard`,
`/teams`, `/teams/:id`, `/teams/:id/chat`, `/privacy`.

### 3.2 Mobile — revue manuelle

- Activer **TalkBack (Android)** / **VoiceOver (iOS)** et parcourir les 18 écrans.
- Vérifier `accessibilityLabel` / `accessibilityRole` sur boutons et icônes.
- Vérifier la taille des cibles tactiles (≥ 44 px) et les contrastes.

## 4. Grille de relevé (à remplir après exécution)

| Page / écran | Score Lighthouse a11y | Erreurs axe (critiques) | Corrections apportées |
|--------------|-----------------------|-------------------------|-----------------------|
| `/dashboard` | _à mesurer_ | _à mesurer_ | _à documenter_ |
| `/login` | _à mesurer_ | _à mesurer_ | _à documenter_ |
| `/leaderboard` | _à mesurer_ | _à mesurer_ | _à documenter_ |
| … | | | |

## 5. Correctifs récurrents anticipés (checklist)

- [ ] `alt` explicite sur toute image porteuse d'information.
- [ ] Association `label` ↔ `input` sur tous les formulaires (login, register, chat).
- [ ] Ordre de tabulation cohérent + focus visible sur tous les éléments interactifs.
- [ ] Contraste ≥ 4.5:1 pour le texte courant (vérifier les gris secondaires).
- [ ] Messages d'erreur reliés au champ (`aria-describedby`) et annoncés (`aria-live`).
- [ ] Mobile : `accessibilityLabel` sur les `Pressable`/icônes sans texte.

## 6. Conclusion

La démarche d'accessibilité est **intégrée dès la conception** (sémantique, ARIA,
clavier, contrastes). Ce livrable fournit la **procédure d'audit reproductible** ;
il reste à exécuter Lighthouse/axe, consigner les scores dans la grille §4 et
appliquer les correctifs §5 pour disposer d'une preuve chiffrée complète.
