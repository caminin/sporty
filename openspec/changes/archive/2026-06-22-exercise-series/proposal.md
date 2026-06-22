## Why

Aujourd'hui, chaque référence d'exercice dans un entraînement n'est exécutée qu'une seule fois pendant la séance. En musculation et en renforcement, il est courant de répéter un même exercice en plusieurs séries ; sans cette notion, l'utilisateur doit dupliquer manuellement la même référence dans l'entraînement ou relancer une boucle complète à la fin de séance.

## What Changes

- Ajout d'un champ optionnel `series` sur chaque `exerciseRefs` **uniquement quand > 1** ; une seule série = pas de champ (comportement actuel, rétrocompatible).
- Lors de la construction de séance, les séries d'un même exercice s'enchaînent d'affilée en bloc (ex. pompes × 2 → pompes → repos → pompes, puis exercice suivant) ; entre chaque série, pause de `globalRestTime` (identique à celle entre deux exercices).
- L'admin **Entraînements** permet de configurer le nombre de séries par référence.
- L'estimation de durée sur la page d'accueil intègre les séries supplémentaires (temps de travail et repos associés).
- Import/export JSON des entraînements accepte et propage `series`.

## Capabilities

### New Capabilities

- `exercise-series`: Nombre de séries par référence d'exercice, expansion en étapes de séance, repos inter-séries et estimation de durée.

### Modified Capabilities

- `group-exercise-references`: Champ optionnel `series` sur `GroupExerciseRef`, validation et résolution.
- `workout-trainings`: Édition admin du nombre de séries par référence ; persistance et affichage.
- `workout-session-flow`: Expansion des étapes work/rest en tenant compte des séries et de `globalRestTime` entre chaque série.
- `homepage-session-time-estimate`: Calcul de durée incluant les répétitions et repos inter-séries.
- `training-ref-value-override`: UI admin étendue pour éditer les séries à côté de la valeur effective.
- `exercise-list-tooling`: Format JSON d'entraînement documenté avec `series` optionnel sur `exerciseRefs`.

## Impact

- `app/exercises/types.ts` : `GroupExerciseRef`, éventuellement `ResolvedExercise`.
- `app/exercises/workout-config.ts` : validation, normalisation, import/export.
- `app/session-utils.ts` : `buildSessionSteps`, `estimateSessionDuration`.
- `app/group-settings/GroupsTab.tsx` : champ séries dans l'UI admin.
- `app/exercises/actions.ts` : `updateTrainingExerciseRef` ou action dédiée pour `series`.
- `exercice_list/*.json` : fichiers d'entraînement bundlés (optionnel, défaut 1).
- Tests : `session-utils.test.ts`, tests workout-config / actions.
