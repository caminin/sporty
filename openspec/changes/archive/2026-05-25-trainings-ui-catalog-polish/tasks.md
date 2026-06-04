## 1. Groupes musculaires et catalogue

- [x] 1.1 Supprimer `fessiers` et `dos` de `muscle-groups.ts` (type, listes, couleurs) ; normaliser import legacy → `autre`
- [x] 1.2 Dédoublonner `exercice_list/catalog.json` (fusion ids) et mettre à jour les refs des entraînements
- [x] 1.3 Reclasser `muscleGroup` : mollets vs jambes vs abdos
- [x] 1.4 Ajouter **Curl haltères** et **Curl Zottman haltères** (`bras`) au catalogue
- [x] 1.5 Renommer entraînements : `name` **Jambes** et **Haut du corps** ; réorganiser `exerciseRefs`
- [x] 1.6 Copier bundle et aligner texte reset admin sur les nouveaux noms

## 2. Couleurs page d'accueil

- [x] 2.1 Ajouter `MUSCLE_GROUP_COLORS` (mapping `MuscleGroupKey` → `GroupColorKey`)
- [x] 2.2 Passer `color` à `ExerciseGroupBlock` dans `app/page.tsx` pour chaque section musculaire
- [x] 2.3 Vérifier contraste titres en light/dark (ajuster classe titre si besoin)

## 3. Admin UI

- [x] 3.1 `CatalogTab` : layout lisible (retirer `truncate` sur le nom, `break-words` / flex élargi)
- [x] 3.2 `GroupsTab` (Entraînements) : champ valeur par ref + indicateur override + reset défaut via `updateTrainingExerciseRef`
- [x] 3.3 (Optionnel) `ExerciseListSelector` : éviter troncature excessive du nom d'entraînement sélectionné

## 4. Tooling et tests

- [x] 4.1 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` (clés muscleGroup sans fessiers/dos, noms Jambes / Haut du corps)
- [x] 4.2 Adapter tests catalogue / trainings / helpers aux ids fusionnés et nouveaux noms
- [x] 4.3 Test ou vérif manuelle : couleurs accueil, override valeur, reset bundle
