## 1. Attente uniquement au début

- [x] 1.1 Dans `advanceStep`, inverser la condition : afficher "preparing" quand `workStepsBeforeNext === 0` (premier exercice), passer en "running" directement pour les exercices suivants
- [x] 1.2 À l'initialisation du timer, si le premier step est un exercice de travail (`steps[0].kind === "work"`), initialiser `sessionState` à "preparing" au lieu de "running"
- [x] 1.3 Dans `handleReplay`, si le premier step est un exercice de travail, remettre `sessionState` à "preparing" (et `preparationCountdown` à 5) au lieu de "running"

## 2. Aperçu du prochain exercice plus visible

- [x] 2.1 Dans `NextExercisePreview`, augmenter la taille du nom de l'exercice de `text-lg` à `text-2xl` ou `text-3xl`
- [x] 2.2 Augmenter proportionnellement le label "Suivant" et le groupe musculaire pour garder une hiérarchie visuelle cohérente
