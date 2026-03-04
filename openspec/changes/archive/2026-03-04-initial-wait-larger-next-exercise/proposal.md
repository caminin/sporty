## Why

L'attente de 5 secondes avant chaque exercice interrompt le rythme de la séance. Une seule attente au tout début suffit pour se préparer. Par ailleurs, l'aperçu du prochain exercice (NextExercisePreview) est trop petit et peu lisible pendant l'exercice en cours.

## What Changes

- Attente de préparation uniquement au tout début de la séance (avant le premier exercice), plus d'attente entre les exercices suivants
- Agrandir l'affichage du prochain exercice pour le rendre plus visible pendant le travail et le repos

## Capabilities

### New Capabilities
- Aucune

### Modified Capabilities
- `exercise-transition-display`: L'écran de transition avec compte à rebours s'affiche uniquement avant le premier exercice de la séance, pas entre les exercices
- `exercise-group-display`: L'aperçu du prochain exercice doit être plus grand et plus visible (taille de police, contraste)

## Impact

- `app/timer/page.tsx`: Logique de déclenchement de la phase "preparing" (inverser la condition workStepsBeforeNext)
- `app/timer/page.tsx`: État initial si le premier step est work (démarrer en "preparing")
- `app/components/NextExercisePreview.tsx`: Tailles de police et styles pour plus de visibilité
