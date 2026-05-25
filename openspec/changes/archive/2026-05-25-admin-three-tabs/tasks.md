## 1. Groupes musculaires et schéma catalogue

- [x] 1.1 Ajouter `MuscleGroupKey`, registre `MUSCLE_GROUPS` (label + icon) dans `app/exercises/`
- [x] 1.2 Étendre `ExerciseDefinition` avec `muscleGroup` ; valider dans `parseWorkoutConfig` / import (défaut `autre` si absent)
- [x] 1.3 Étendre `addCatalogExercise` / update pour accepter `muscleGroup`
- [x] 1.4 Mettre à jour helpers de tests (`createTestConfig`, fixtures) avec `muscleGroup`

## 2. Suppression du seed

- [x] 2.1 Supprimer `app/exercises/default-seed.json` et entrée `COPY` dans `Dockerfile`
- [x] 2.2 Retirer `loadDefaultSeedConfig`, `seedExerciseList` de `lists.ts`
- [x] 2.3 Retirer `seedListWithDefaultTemplate` de `lists-actions.ts`
- [x] 2.4 Retirer tests seed dans `initialization-migration.test.ts` et grep résiduel

## 3. Données repo

- [x] 3.1 Ajouter `muscleGroup` sur chaque entrée de `exercice_list/global.json` (mapping sémantique, ex. shadow → `jambes` ou `autre` selon l’exercice)
- [x] 3.2 Ajouter `muscleGroup` sur `exercice_list/dynamisme-jambes-mollets-core.json` (ex. split step → `jambes`, calf raises → `mollets`)
- [x] 3.3 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` (`muscleGroup` + sans default-seed)

## 4. Refonte UI admin (3 onglets)

- [x] 4.1 Extraire `CatalogTab`, `GroupsTab`, `ImportExportTab` depuis `group-settings/page.tsx`
- [x] 4.2 Onglet **Liste d'exercices** : sélecteur liste, CRUD catalogue, sections par groupe musculaire avec icônes
- [x] 4.3 Onglet **Listes de groupes** : toutes les listes, suppression, repos global, CRUD groupes de séance, add/remove refs + overrides
- [x] 4.4 Onglet **Import / Export** : créer liste, import JSON, export ; retirer ces blocs des autres onglets
- [x] 4.5 Supprimer anciens onglets `groups` | `lists`, bouton « Réinitialiser », code mort

## 5. Tests et validation

- [x] 5.1 Adapter tests pour `muscleGroup` et absence de seed
- [x] 5.2 Vérifier import/export avec `muscleGroup` dans JSON exporté
- [x] 5.3 Suite tests exercise-lists verte
- [x] 5.4 Grep : plus de `default-seed`, `seedExerciseList`, `domain` (ancien nom)

## 6. OpenSpec

- [x] 6.1 Fusionner / abandonner tâches seed de `remove-seed-intensity-slider` si redondant
- [x] 6.2 Archiver le change après revue des 3 onglets
