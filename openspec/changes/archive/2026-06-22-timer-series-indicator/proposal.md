## Why

Les exercices multi-séries génèrent plusieurs steps `work` consécutifs avec le même nom ; le timer n'indique ni la série en cours (ex. 1/3) ni la distinction entre repos inter-séries et passage à un autre exercice. L'utilisateur perd le fil pendant la séance.

## What Changes

- Enrichir les steps `work` encodés dans la session avec `seriesIndex` et `seriesTotal` (uniquement quand `seriesTotal > 1`).
- Afficher un indicateur de série **style `1/3`** sur l'écran timer (travail, repos inter-séries, préparation du premier exercice).
- Adapter l'aperçu « Suivant » : même exercice → « Série 2/3 » plutôt qu'un doublon trompeur du nom.
- Améliorer la hiérarchie visuelle : badge série sous le titre, libellé de repos contextualisé, progression globale conservée mais plus lisible.
- Rétrocompatibilité : sessions sans métadonnées série restent affichées comme aujourd'hui (pas de badge).

## Capabilities

### New Capabilities

_Aucune — extension de l'affichage timer et du flux de séance existants._

### Modified Capabilities

- `workout-session-flow` : métadonnées `seriesIndex` / `seriesTotal` sur les steps `work` à l'expansion.
- `timer-view` : affichage série en cours, repos inter-séries, aperçu suivant et mise en page.
- `exercise-transition-display` : série visible sur l'écran de préparation quand le premier exercice a plusieurs séries.

## Impact

- `app/exercises/types.ts` : champs optionnels sur `SessionStep` work.
- `app/session-utils.ts` : `buildSessionSteps`, éventuellement helper de dérivation pour le timer.
- `app/timer/page.tsx` : rendu série + ajustements layout.
- `app/components/NextExercisePreview.tsx` : mode série suivante.
- `app/components/ExerciseTransitionDisplay.tsx` : badge série.
- Tests : `session-utils.test.ts`, `app/timer/__tests__/`.
