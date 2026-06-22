## Why

Les séries sont aujourd'hui configurables uniquement par référence dans un entraînement. Or certains exercices du catalogue ont naturellement plusieurs séries par défaut (ex. pompes × 3) ; sans valeur catalogue, chaque ajout à un entraînement repart à 1 série ou impose une surcharge manuelle répétée sur chaque référence.

## What Changes

- Ajout d'un champ optionnel `series` sur chaque entrée du **catalogue global** (`catalog.json`, `ExerciseDefinition`) — **uniquement quand > 1** ; une seule série = pas de champ (rétrocompatible).
- Résolution : `effectiveSeries = ref.series ?? catalog.series ?? 1` (même hiérarchie que `value`).
- L'admin **Exercices** permet d'éditer le nombre de séries par défaut d'un exercice catalogue.
- L'admin **Entraînements** conserve la surcharge par référence ; l'UI indique quand les séries diffèrent du défaut catalogue et permet de revenir au défaut catalogue.
- Import/export catalogue accepte et propage `series` optionnel sur les entrées `exercises`.
- Le skill `create-exercise-list` documente `series` optionnel sur le catalogue.

## Capabilities

### New Capabilities

_Aucune — extension du modèle catalogue et de la résolution existante._

### Modified Capabilities

- `global-exercise-catalog` : schéma catalogue avec `series` optionnel ; CRUD et import/export.
- `exercise-catalog` : édition inline des séries par défaut dans l'onglet Exercices.
- `group-exercise-references` : résolution `effectiveSeries` depuis catalogue puis surcharge référence.
- `training-ref-value-override` : UI Entraînements — indicateur de surcharge séries et reset vers défaut catalogue.
- `workout-trainings` : nouvelle référence hérite du défaut catalogue ; affichage séries effectives.
- `exercise-list-tooling` : documentation `series` sur `catalog.json`.
- `catalog-export-import-merge` : merge/import catalogue avec champ `series`.

## Impact

- `app/exercises/types.ts` : `ExerciseDefinition` avec `series?`.
- `app/exercises/workout-config.ts` : `normalizeExerciseDefinition`, `getEffectiveSeries`, validation import catalogue.
- `app/exercises/actions.ts` : `updateCatalogExercise`, `addCatalogExercise`.
- `app/group-settings/CatalogTab.tsx` : champ séries par défaut.
- `app/group-settings/GroupsTab.tsx` : affichage défaut catalogue vs surcharge référence.
- `exercice_list/catalog.json` : entrées pouvant inclure `series`.
- `.cursor/skills/create-exercise-list/SKILL.md` : format catalogue documenté.
- Tests : workout-config, actions, session-utils (résolution catalogue).
