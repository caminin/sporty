## 1. Modèle et validation (nouveau format uniquement)

- [x] 1.1 Étendre `types.ts` (`ExerciseDefinition`, `GroupExerciseRef`, `WorkoutConfig.exercises`)
- [x] 1.2 Implémenter `resolveGroupExercises` / `getEffectiveValue` dans `workout-config.ts`
- [x] 1.3 Validation stricte : `validateCatalog`, `validateGroup` (refs), rejeter exercices embarqués
- [x] 1.4 Supprimer ou vider la conversion legacy dans `migrateWorkoutConfig` ; retirer auto-save migration dans `getWorkoutConfig` / `loadExerciseList`
- [x] 1.5 Adapter `validateExerciseList` dans `lists.ts`

## 2. Actions serveur

- [x] 2.1 CRUD catalogue : `addCatalogExercise`, `updateCatalogExercise`, `deleteCatalogExercise`
- [x] 2.2 Remplacer `addExerciseToGroup` par ajout de ref depuis `exerciseId` + override optionnel
- [x] 2.3 `updateGroupExerciseRef` pour modifier la surcharge `value`
- [x] 2.4 Supprimer les chemins de création inline d'exercice dans un groupe
- [x] 2.5 Implémenter `mergeImportedConfig` (catalogue + groupes) pour import

## 3. Import / export

- [x] 3.1 Mettre à jour `exportWorkoutConfigToJson` (inclure `exercises`)
- [x] 3.2 Import : validation stricte uniquement (`importListFromJson`, `importListFromManualFolder`, `loadManualListConfig`) — erreur si legacy
- [x] 3.3 Tests : merge import + rejet JSON sans catalogue

## 4. Données, seed et skill agent (réécriture one-shot)

- [x] 4.1 Réécrire `app/exercises/default-seed.json` au format catalogue + refs
- [x] 4.2 Réécrire tous les fichiers `exercice_list/*.json`
- [x] 4.3 Réécrire `.cursor/skills/create-exercise-list/SKILL.md` (nouveau schéma uniquement)
- [x] 4.4 Vérifier que les JSON repo passent la validation stricte

## 5. UI paramètres

- [x] 5.1 Section catalogue CRUD dans l'onglet « Gestion des listes »
- [x] 5.2 Picker « Ajouter depuis le catalogue » par groupe (onglet groupes)
- [x] 5.3 Édition surcharge durée/répétitions par placement ; retirer formulaire création inline
- [x] 5.4 Messages d'erreur suppression catalogue référencé

## 6. Séance, accueil et composants

- [x] 6.1 `app/page.tsx` : affichage résolu, sélection par `refId`, filtrage séance
- [x] 6.2 `session-utils.ts` + `session-utils.test.ts` : placements résolus
- [x] 6.3 `app/timer/page.tsx` + tests timer
- [x] 6.4 Composants preview/badge si types `Exercise` à ajuster
- [x] 6.5 `ExerciseListContext` / `ExerciseListSelector`

## 7. Tests, helpers et nettoyage legacy

- [x] 7.1 Refactor `exercise-lists-helpers.ts` (format catalogue + refs uniquement)
- [x] 7.2 Mettre à jour `app/__tests__/entities/exercise-lists/*`
- [x] 7.3 Supprimer ou remplacer tests `migration.test.ts` / scénarios legacy dans `initialization-migration.test.ts`
- [x] 7.4 Mettre à jour `custom-groups/actions.test.ts`, READMEs tests
- [x] 7.5 Grep et suppression : `migrateWorkoutConfig` legacy, `Omit<Exercise` dans add group, consommateurs format embarqué
- [x] 7.6 Suite Jest complète
