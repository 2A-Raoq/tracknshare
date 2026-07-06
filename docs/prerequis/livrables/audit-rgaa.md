# Audit d'accessibilité (RGAA) — Track'N Share

> **Livrable RNCP — BC01-7** « Respecter une norme de présentation des écrans / accessibilité handicap (RGAA) ».
> Créé le 2026-07-01 (guide). **Audit exécuté le 2026-07-06** : résultats consignés en §4.
> Statut : ✅ **audit web réalisé et corrigé** — revue mobile manuelle (§3.2) à faire sur device.

## 1. Périmètre

Application web (`apps/web`) + application mobile native (`apps/mobile`).
Référentiel visé : **RGAA 4.1** (aligné WCAG 2.1 AA), critères prioritaires.

## 2. Bonnes pratiques déjà en place (preuves)

| Thème RGAA | Mise en œuvre | Où |
|------------|---------------|-----|
| Structure sémantique | HTML sémantique, landmarks, titres hiérarchisés | `apps/web/src` |
| Rôles & états ARIA | `role`, `aria-label`, `aria-modal` sur modales, listes | composants web |
| Navigation clavier | Autocomplétion emoji navigable au clavier, focus gérés, fils de messages focusables (`tabIndex`) | `EmojiSuggestion`, pages de chat |
| Contrastes | Thème sombre gaming à fort contraste texte/fond | design tokens |
| Responsive | Mobile-first, pas de perte d'information au zoom | layout global |
| Équivalents textuels | Avatars à initiales (`AvatarInitial`) au lieu d'images sans alt | `components/AvatarInitial` |
| Mobile natif | Composants RN accessibles (`accessibilityLabel` à généraliser) | `apps/mobile/src` |

## 3. Procédure d'audit (exécutée le 2026-07-06)

### 3.1 Web — outils automatiques

- **Lighthouse 13.4.0** (catégorie *Accessibility*, Chrome headless), sur le **build de
  production** servi par `vite preview` (port 4173), API et données de démo réelles :

  ```bash
  pnpm --filter web build
  pnpm --filter web exec vite preview --port 4173
  npx lighthouse http://localhost:4173/<page> --only-categories=accessibility --output=json
  ```

- **axe-core 4.x** (règles `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) piloté par
  puppeteer-core + Chrome, **session authentifiée** (compte démo injecté via
  `localStorage`) pour couvrir les pages privées que Lighthouse ne peut pas atteindre.

### 3.2 Mobile — revue manuelle (reste à faire)

- Activer **TalkBack (Android)** / **VoiceOver (iOS)** et parcourir les écrans.
- Vérifier `accessibilityLabel` / `accessibilityRole` sur boutons et icônes.
- Vérifier la taille des cibles tactiles (≥ 44 px) et les contrastes.

## 4. Relevé des résultats (2026-07-06)

### 4.1 Lighthouse — pages publiques (score /100)

| Page | Score a11y | Audits évalués | Échecs |
|------|-----------|----------------|--------|
| `/` (landing) | **100** | 21 | 0 |
| `/login` | **100** | 22 | 0 |
| `/register` | **100** | 22 | 0 |
| `/leaderboard` | **100** | 24 | 0 |
| `/privacy` | **100** | 22 | 0 |

Contrastes (`color-contrast`), labels de formulaires (`label`), noms accessibles des
boutons (`button-name`) : tous conformes.

### 4.2 axe-core WCAG 2.1 A/AA — pages authentifiées (compte démo)

| Page / écran | Règles passées | Violations |
|--------------|----------------|------------|
| `/dashboard` | 25 | **0** |
| `/profile` (édition) | 22 | **0** |
| `/leaderboard` (connecté) | 21 | **0** |
| `/teams` | 22 | **0** |
| `/teams/:id` (détail équipe) | 21 | **0** |
| `/messages/teams/:id` (chat d'équipe) | 22 | **0** ¹ |
| `/messages` (messagerie) | 19 | **0** |
| `/friends` | 22 | **0** |

¹ Une violation **serious** avait été détectée au premier passage :
`scrollable-region-focusable` (le fil de messages, zone scrollable, n'était pas
atteignable au clavier).

### 4.3 Correction apportée

- **Fichiers** : `apps/web/src/pages/TeamChatPage.tsx` et `ConversationPage.tsx`.
- **Correctif** : ajout de `tabIndex={0}`, `role="log"` et `aria-label` sur le
  conteneur scrollable des messages (`.dc-chat__feed`). Le rôle `log` annonce en
  outre les nouveaux messages aux lecteurs d'écran (aria-live implicite).
- **Contre-audit** : re-exécution d'axe-core après rebuild → **0 violation**.

## 5. Checklist des correctifs récurrents

- [x] `alt` / équivalents textuels sur les éléments porteurs d'information (avatars à initiales, icônes décoratives ignorées).
- [x] Association `label` ↔ `input` sur tous les formulaires (validé par Lighthouse `label` sur /login, /register).
- [x] Ordre de tabulation cohérent + zones scrollables focusables (correctif §4.3).
- [x] Contraste ≥ 4.5:1 pour le texte courant (validé par `color-contrast` sur les 13 pages).
- [ ] Messages d'erreur reliés au champ (`aria-describedby`) — amélioration continue.
- [ ] Mobile : généraliser `accessibilityLabel` sur les `Pressable`/icônes sans texte.

## 6. Conclusion

L'accessibilité est **intégrée dès la conception** (sémantique, ARIA, clavier,
contrastes) et désormais **prouvée par la mesure** : Lighthouse **100/100 sur les
5 pages publiques** et **0 violation WCAG 2.1 A/AA (axe-core) sur les 8 pages
authentifiées** du parcours de démonstration, après correction d'une violation
détectée puis contre-auditée. La démarche complète — outil, périmètre, résultat,
correctif, contre-audit — est reproductible via la procédure §3.