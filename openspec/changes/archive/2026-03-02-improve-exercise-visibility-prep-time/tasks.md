## 1. Préparation et types

- [x] 1.1 Ajouter l'état "preparing" au type SessionState
- [x] 1.2 Créer le composant ExerciseTransitionDisplay avec props pour l'exercice suivant et le compte à rebours

## 2. Logique de transition

- [x] 2.1 Modifier la fonction advanceStep pour gérer la phase de préparation avant les exercices de travail
- [x] 2.2 Implémenter le timer de compte à rebours de 5 secondes pour la préparation
- [x] 2.3 Ajouter la logique pour passer automatiquement de la préparation à l'exercice

## 3. Interface utilisateur

- [x] 3.1 Intégrer le composant ExerciseTransitionDisplay dans la vue timer
- [x] 3.2 Ajouter les couleurs de fond spécifiques pour l'état de préparation (orange)
- [x] 3.3 Améliorer la visibilité du composant NextExercisePreview dans l'affichage normal
- [x] 3.4 Mettre à jour les contrôles pour permettre de passer la phase de préparation

## 4. Gestion des états et transitions

- [x] 4.1 Gérer la progression affichée pendant la phase de préparation
- [x] 4.2 Assurer que le premier exercice ne passe pas par la phase de préparation
- [x] 4.3 Tester les transitions entre tous les états (work → preparing → work, rest → preparing → work)

## 5. Tests et validation

- [x] 5.1 Tester le comportement avec différents types d'exercices (time et reps)
- [x] 5.2 Vérifier que la fonctionnalité de skip fonctionne pendant la préparation
- [x] 5.3 Tester l'audio et les contrôles de volume pendant les transitions