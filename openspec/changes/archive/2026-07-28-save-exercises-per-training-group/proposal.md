## Why

Sur la page d'accueil, la sélection des exercices cochés est persistée dans un seul tableau `localStorage` global (`sporty_session_selection`). Quand l'utilisateur change d'entraînement, seuls les exercices présents dans les deux listes restent cochés — ce qui donne l'impression que la sélection « fuit » d'un entraînement à l'autre au lieu de conserver un état propre par entraînement.

## What Changes

- Persister la sélection d'exercices **par entraînement** (clé = `selectedListId`), et non plus dans une liste globale partagée.
- Au changement d'entraînement, recharger la sélection sauvegardée pour cet entraînement (ou tout cocher par défaut si aucune sauvegarde).
- Ignorer silencieusement l'ancien format tableau (pas de migration) : fallback « tout coché ».

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `session-exercise-selection` : la persistance client de la sélection d'exercices doit être scopée par entraînement actif.
- `home-page-exercise-management` : le scénario de changement d'entraînement doit restaurer la sélection propre à chaque entraînement.

## Impact

- `app/page.tsx` : helpers `loadSelection` / `saveSelection` et clé `localStorage`.
- Tests éventuels autour de la persistance de sélection par entraînement.
- Aucun changement serveur ni schéma de données disque.
