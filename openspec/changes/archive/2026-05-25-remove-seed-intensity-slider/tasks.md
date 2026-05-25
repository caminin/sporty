## 1. Retrait du seed

- [x] 1.1 Supprimer `app/exercises/default-seed.json` et la ligne `COPY` associée dans `Dockerfile`
- [x] 1.2 Retirer `loadDefaultSeedConfig`, `seedExerciseList` de `app/exercises/lists.ts`
- [x] 1.3 Retirer `seedListWithDefaultTemplate` de `lists-actions.ts` et le bouton « Réinitialiser » + handler dans `group-settings/page.tsx`
- [x] 1.4 Supprimer ou adapter les tests seed dans `initialization-migration.test.ts`

## 2. Retrait de l’intensité (logique)

- [x] 2.1 Retirer le paramètre `intensity` de `estimateSessionDuration` et `buildSessionSteps` dans `session-utils.ts` (valeurs effectives brutes)
- [x] 2.2 Mettre à jour les tests `session-utils.test.ts` si présents

## 3. Retrait de l’intensité (UI accueil)

- [x] 3.1 Supprimer `IntensityControl` et le state `intensity` dans `app/page.tsx`
- [x] 3.2 Retirer la prop `intensity` de `ExerciseGroupBlock` et `FloatingActionButton` ; afficher les valeurs effectives non scalées
- [x] 3.3 Conserver `SessionSummary` seul dans la carte résumé (compteur, repos, durée)

## 4. Validation

- [x] 4.1 Exécuter la suite de tests concernée (listes, session-utils, page si couverte)
- [x] 4.2 Vérifier l’absence de références résiduelles à `default-seed`, `seedExerciseList`, `IntensityControl` (grep)
- [x] 4.3 Mettre à jour skill / doc `create-exercise-list` si elle mentionne encore `default-seed.json`
