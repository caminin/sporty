## 1. Catalogue — édition des valeurs par défaut

- [x] 1.1 Ajouter sur chaque ligne de `CatalogTab` un select `type` et un input `value` (min 1) avec persistance via `updateCatalogExercise`
- [x] 1.2 Gérer les états pending/erreur comme pour le changement de `muscleGroup`
- [x] 1.3 Vérifier que les tests ou actions catalogue couvrent la mise à jour de `type` et `value`

## 2. Groupes de séance — affichage et picker

- [x] 2.1 Extraire un helper (ex. dans `workout-config.ts` ou util dédié) pour regrouper les exercices résolus d’un groupe par `muscleGroup` selon l’ordre `MUSCLE_GROUPS`
- [x] 2.2 Refondre `GroupsTab` : sections par muscle group avec liste des placements (nom, type, valeur catalogue)
- [x] 2.3 Retirer les champs de surcharge et les appels `updateGroupExerciseRef` / override à l’ajout
- [x] 2.4 Picker d’ajout par section : filtrer le catalogue sur `muscleGroup`, exclure les `exerciseId` déjà dans le groupe ; état picker clé `(groupName, muscleGroup)`
- [x] 2.5 Retirer le bloc « Créer un groupe de séance » et le message invitant à créer un groupe ; pointer vers Import/Export si aucun groupe
- [x] 2.6 Conserver repos global, ajout/retrait d’exercices, édition/suppression de groupes existants, suppression de listes

## 3. Import / Export

- [x] 3.1 Retirer le formulaire de création de liste vide dans `ImportExportTab` (état + handler `createList`)
- [x] 3.2 Ajuster les textes d’aide : nouvelles listes uniquement par import JSON

## 4. Specs et tests

- [x] 4.1 Mettre à jour les tests listes/groupes impactés (ajout sans override, édition catalogue)
- [x] 4.2 Archiver ou valider les deltas OpenSpec au merge (`openspec validate` si disponible)
- [x] 4.3 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` : groupes et listes via JSON, défauts éditables dans l’onglet catalogue
