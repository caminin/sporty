## 1. Modèle et validation

- [x] 1.1 Ajouter `series?: number` sur `GroupExerciseRef` et `getEffectiveSeries(ref)` dans `types.ts` / `workout-config.ts`
- [x] 1.2 Étendre `validateGroupRef` : `series` optionnel, entier ≥ 2 si présent ; omettre le champ quand = 1
- [x] 1.3 Propager `series` dans `parseTrainingJson`, export JSON et `applyTrainingImport`

## 2. Séance et estimation

- [x] 2.1 Inclure `series` dans `collectResolved` (session-utils)
- [x] 2.2 Modifier `buildSessionSteps` : expansion post-optimisation avec repos `globalRestTime` entre chaque work consécutif
- [x] 2.3 Modifier `estimateSessionDuration` selon la formule `workSteps` et `(workSteps - 1) × globalRestTime`
- [x] 2.4 Ajouter/mettre à jour les tests dans `session-utils.test.ts` (1 série, 3 séries, repos inter-séries)

## 3. Admin et actions serveur

- [x] 3.1 Étendre `updateTrainingExerciseRef` pour persister `series`
- [x] 3.2 Ajouter le champ séries dans `GroupsTab.tsx` (input entier ≥ 1, défaut 1)
- [x] 3.3 Tests actions / workout-config pour import et mise à jour de `series`

## 4. Documentation tooling

- [x] 4.1 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` avec `series` optionnel sur `exerciseRefs`

## 5. Vérification

- [x] 5.1 Lancer la suite de tests concernée
- [x] 5.2 Vérifier manuellement : entraînement avec 3 séries → timer avec pauses de `globalRestTime` entre chaque série
