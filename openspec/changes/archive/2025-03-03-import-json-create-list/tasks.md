## 1. Backend - Action d'import

- [x] 1.1 Ajouter `importListFromJson` dans `lists-actions.ts` : parse JSON, extraire config (WorkoutConfig ou config depuis ExerciseList), appliquer migrateWorkoutConfig
- [x] 1.2 Valider la config migrée (globalRestTime, groups avec structure Group) et retourner erreur explicite si invalide
- [x] 1.3 Créer la liste via createExerciseList avec le nom fourni, remplacer config par la config importée, sauvegarder
- [x] 1.4 Retourner `{ success, listId?, error? }` avec vérification admin (même auth que createList)

## 2. UI - Section Import dans group-settings

- [x] 2.1 Ajouter une section "Importer JSON" dans l'onglet listes (après "Créer une nouvelle liste")
- [x] 2.2 Champ nom de liste + textarea pour coller le JSON + input file pour sélectionner un .json
- [x] 2.3 Bouton "Importer" qui appelle importListFromJson, affiche erreur en cas d'échec
- [x] 2.4 En cas de succès : rafraîchir les listes, sélectionner la nouvelle liste (setSelectedListId), vider le formulaire
