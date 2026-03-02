## 1. Synchronisation de l'interface de gestion

- [x] 1.1 Intégrer le contexte ExerciseListContext dans group-settings/page.tsx
- [x] 1.2 Remplacer currentList par selectedListId dans toutes les opérations d'exercices
- [x] 1.3 Supprimer la logique obsolète de currentList dans l'interface de gestion

## 2. Correction des opérations CRUD

- [x] 2.1 Corriger addExercise pour utiliser selectedListId au lieu de currentList
- [x] 2.2 Corriger deleteExercise pour utiliser selectedListId au lieu de currentList
- [x] 2.3 Corriger updateGlobalRestTime pour utiliser selectedListId au lieu de currentList

## 3. Mise à jour de l'affichage

- [x] 3.1 Synchroniser le chargement des données avec selectedListId
- [x] 3.2 Ajouter un indicateur visuel de la liste active dans l'interface
- [x] 3.3 Tester le changement automatique lors de la sélection d'une nouvelle liste

## 4. Tests et validation

- [x] 4.1 Tester l'ajout d'exercices dans différentes listes
- [x] 4.2 Vérifier que les modifications sont isolées par liste
- [x] 4.3 Valider la synchronisation entre les interfaces