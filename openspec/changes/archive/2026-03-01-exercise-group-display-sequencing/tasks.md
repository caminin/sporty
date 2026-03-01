## 1. Algorithme de séquençage optimisé

- [x] 1.1 Créer la fonction `optimizeExerciseSequence` dans session-utils.ts qui implémente l'algorithme glouton d'alternance maximale des groupes
- [x] 1.2 Implémenter la logique de calcul de distance pour chaque groupe musculaire
- [x] 1.3 Ajouter la préservation de l'ordre relatif des exercices dans un même groupe
- [x] 1.4 Modifier `buildSessionSteps` pour utiliser le nouvel algorithme optimisé au lieu de l'ordre séquentiel
- [x] 1.5 Tester l'algorithme avec différentes configurations de groupes (2, 3, 4+ groupes)

## 2. Composants UI pour l'affichage des groupes

- [x] 2.1 Créer le composant `ExerciseGroupBadge` pour afficher le groupe musculaire avec un style discret
- [x] 2.2 Créer le composant `NextExercisePreview` pour afficher l'aperçu du prochain exercice
- [x] 2.3 Définir les styles CSS pour les badges et aperçus (couleurs, tailles de police, positionnement)
- [x] 2.4 Ajouter la logique conditionnelle pour masquer l'aperçu lors du dernier exercice

## 3. Intégration dans l'interface timer

- [x] 3.1 Intégrer `ExerciseGroupBadge` dans le composant timer pour l'exercice actuel
- [x] 3.2 Intégrer `NextExercisePreview` en bas de l'écran timer
- [x] 3.3 Calculer l'index du prochain exercice de travail pour l'aperçu
- [x] 3.4 Gérer l'affichage conditionnel pendant les phases de repos et de travail
- [x] 3.5 Tester l'affichage avec différents types d'exercices (time/reps) et groupes

## 4. Tests et validation

- [x] 4.1 Ajouter des tests unitaires pour l'algorithme de séquençage optimisé
- [x] 4.2 Tester l'affichage des groupes avec des données réelles depuis exercises.json
- [x] 4.3 Valider que la séquence commence toujours par un work step
- [x] 4.4 Tester les cas limites (un seul groupe, groupes vides, dernier exercice)
- [x] 4.5 Vérifier la compatibilité avec les fonctionnalités existantes (replay, navigation)