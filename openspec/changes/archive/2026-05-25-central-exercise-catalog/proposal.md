## Why

Aujourd’hui, chaque liste d’entraînement duplique les exercices à l’intérieur de chaque groupe (`group.exercises` contient des objets `Exercise` complets). Modifier le nom, le type ou la valeur par défaut d’un exercice utilisé dans plusieurs groupes oblige à le changer partout, et l’import/export ne distingue pas le catalogue des sélections de groupe. Une liste centrale d’exercices par liste, avec des groupes qui ne font que référencer ce catalogue (et surchargent éventuellement durée/répétitions), simplifie la maintenance, évite les incohérences et rend la fusion à l’import prévisible.

## What Changes

- **BREAKING** : le format `WorkoutConfig` inclut un catalogue `exercises` (Record ou tableau indexé par `id`) distinct des groupes ; les groupes stockent des références (`exerciseId` + `value` optionnel) au lieu d’objets `Exercise` embarqués.
- Ajout de la résolution « valeur effective » : `value` du groupe si présent, sinon `value` par défaut du catalogue.
- UI paramètres (onglet groupes) : plus de création libre d’exercice dans un groupe ; ajout uniquement depuis le catalogue de la liste, avec édition optionnelle de la surcharge durée/répétitions.
- UI gestion des listes : gestion CRUD du catalogue d’exercices de la liste (créer / modifier / supprimer des exercices du catalogue).
- Export JSON d’une liste : inclut `exercises` + `groups` + `globalRestTime` (format unique, pas de variant legacy).
- Import JSON : **uniquement** le nouveau format ; rejet explicite si `exercises` ou références manquants ; fusion catalogue + groupes à l’import selon les règles du design.
- **Pas de migration runtime** des anciens formats (ni au chargement, ni à l’import). Les fichiers repo (`default-seed.json`, `exercice_list/*.json`) sont **réécrits** au nouveau format une fois pour toutes.
- Mise à jour des parcours séance (accueil, timer, estimation durée, intensité) pour utiliser la valeur effective et des identifiants de placement stables dans les groupes.
- Inventaire et mise à jour de **tous les consommateurs** du format liste (code app, tests, seed, JSON repo, skills Cursor, docs de tests).

## Capabilities

### New Capabilities

- `exercise-catalog` : catalogue d’exercices par liste (structure, CRUD, validation, valeurs par défaut).
- `group-exercise-references` : références groupe → exercice, surcharge optionnelle de `value`, résolution pour affichage et séance.
- `catalog-export-import-merge` : export/import au format catalogue + références, validation stricte, fusion à l’import (exercices et groupes).
- `exercise-list-tooling` : skill agent, helpers de tests, fichiers `exercice_list/`, documentation alignés sur le format catalogue + références.

### Modified Capabilities

- `group-settings` : ajout d’exercices depuis le catalogue uniquement ; gestion du catalogue ; export/import étendus.
- `json-import-list` : import crée ou fusionne le catalogue selon les règles de merge.
- `home-page-exercise-management` : affichage et sélection basés sur les entrées de groupe résolues (valeur effective, ids de placement).
- `session-exercise-selection` : sélection et comptage via références résolues.
- `intensity-scaffolds-duration-reps` : intensité appliquée sur la valeur effective (surcharge ou défaut).
- `workout-session-flow` : étapes de séance construites depuis les références résolues.
- `default-list-seed` : seed et fichiers `exercice_list` au nouveau format.
- `manual-list-import-folder` : validation import manuel inclut le catalogue.
- `list-system-testing` : helpers et fixtures de tests au format v2.

## Impact

**Cœur données / API**

- `app/exercises/types.ts`, `workout-config.ts`, `lists.ts`, `lists-actions.ts`, `actions.ts`

**UI et contexte**

- `app/group-settings/page.tsx`
- `app/page.tsx`, `app/timer/page.tsx`
- `app/contexts/ExerciseListContext.tsx`
- `app/components/ExerciseListSelector.tsx`, `ExerciseTransitionDisplay.tsx`, `NextExercisePreview.tsx`, `ExerciseGroupBadge.tsx`

**Séance**

- `app/session-utils.ts`, `app/session-utils.test.ts`

**Données et templates**

- `app/exercises/default-seed.json`
- `exercice_list/*.json` (ex. `global.json`, `dynamisme-jambes-mollets-core.json`, listes badminton non suivies)

**Outils agent et documentation**

- `.cursor/skills/create-exercise-list/SKILL.md` (structure JSON, validation, exemples, règles d’IDs)
- `app/__tests__/shared/exercise-lists-helpers.ts` (`createTestConfig`, `createCustomTestConfig`, `createEmptyTestConfig`)
- `app/__tests__/shared/test-helpers.ts`
- `app/__tests__/README.md`, `app/__tests__/entities/workouts/README.md`

**Tests (tous à aligner sur catalogue + refs)**

- `app/__tests__/entities/exercise-lists/*` (crud, validation, migration, intégration, custom-lists, error-handling)
- `app/exercises/__tests__/migration.test.ts`, `custom-groups/actions.test.ts`
- `app/timer/__tests__/*` si fixtures WorkoutConfig
