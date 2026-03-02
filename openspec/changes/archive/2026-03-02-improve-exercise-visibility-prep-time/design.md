## Context

L'application Sporty est une application d'entraînement avec timer qui guide l'utilisateur à travers des séances d'exercices structurées. Actuellement, les transitions entre exercices se font instantanément, ce qui peut être déstabilisant pour l'utilisateur qui n'a pas le temps de se préparer.

L'architecture actuelle utilise un composant React principal (`TimerInner`) qui gère l'état de la séance et les transitions via la fonction `advanceStep`. Le prochain exercice est affiché via le composant `NextExercisePreview`, mais seulement de manière statique.

## Goals / Non-Goals

**Goals:**
- Ajouter un état de préparation de 5 secondes avant chaque nouvel exercice
- Améliorer la visibilité du prochain exercice pendant les transitions
- Créer une expérience utilisateur plus fluide lors des changements d'exercices

**Non-Goals:**
- Modifier la structure globale de l'application
- Ajouter des fonctionnalités de personnalisation avancées
- Changer l'API existante des séances

## Decisions

- **État de préparation**: Ajouter un nouvel état "preparing" au SessionState qui sera actif pendant 5 secondes avant le début de chaque exercice de travail
- **Composant de transition**: Créer un nouveau composant `ExerciseTransitionDisplay` qui affiche un compte à rebours de préparation avec le prochain exercice en évidence
- **Gestion du timer**: Modifier la logique dans `advanceStep` pour passer par l'état de préparation avant de commencer l'exercice
- **Audio**: Garder le système audio existant mais ajouter des indications sonores spécifiques pour la phase de préparation

## Risks / Trade-offs

- **Complexité ajoutée**: L'ajout d'un état intermédiaire peut légèrement complexifier la logique de transition, mais reste gérable
- **Performance**: L'ajout d'un timer supplémentaire est négligeable en termes de performance
- **Expérience utilisateur**: Risque que les 5 secondes soient perçues comme trop longues/courtes, mais cela peut être ajusté ultérieurement