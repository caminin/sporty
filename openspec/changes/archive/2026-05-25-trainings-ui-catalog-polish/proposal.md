## Why

Après la refonte catalogue / entraînements, l’usage quotidien révèle des frictions UI (liste d’exercices trop étroite, titres illisibles, couleurs de groupes musculaires absentes sur l’accueil) et des lacunes données (doublons dans le catalogue, groupe « Jambes » trop fourre-tout, entraînements mal nommés, curls haltères manquants, pas d’édition de la valeur par défaut dans un entraînement).

## What Changes

- Élargir la liste des exercices (onglet Exercices admin) pour afficher les titres complets sans troncature excessive.
- Permettre de modifier la **valeur effective** d’un exercice **dans l’entraînement** (override `value` sur `exerciseRefs`, avec retour au défaut catalogue).
- Corriger les **couleurs par groupe musculaire** sur la page d’accueil (aujourd’hui titres blancs sans fond coloré car `color` n’est pas transmis).
- **Répartir** les exercices du catalogue : sortir du bucket « jambes » ce qui relève surtout de **mollets** (le reste reste jambes / abdos).
- **BREAKING** : supprimer les clés `fessiers` et `dos` de `MuscleGroupKey`, de l’admin et des mappings (imports legacy → `autre`).
- **Dédoublonner** le catalogue global (ex. Mountain climbers, Burpees, gainage en double).
- Renommer les deux entraînements embarqués : **« Jambes »** et **« Haut du corps »**, et mettre à jour leur contenu d’exercices en cohérence.
- Ajouter au catalogue : **Curl haltères** et **Curl Zottman haltères** (curl torsadé haltères), groupés sous **Bras**.
- Mettre à jour les JSON source (`exercice_list/`) et le bundle `public/bundled-exercice-list/`.

## Capabilities

### New Capabilities

- `muscle-group-home-colors` : couleurs distinctes par groupe musculaire sur la page d’accueil (mapping clé → `GroupColorKey`).
- `training-ref-value-override` : édition UI de la valeur par référence dans l’onglet Entraînements (réutilise `updateTrainingExerciseRef`).

### Modified Capabilities

- `home-page-exercise-management` : blocs musculaires colorés, lisibilité des titres d’exercices.
- `group-settings` : liste catalogue plus large ; override valeur dans Entraînements.
- `global-exercise-catalog` : dédoublonnage, reclassement muscleGroup, nouveaux curls.
- `workout-trainings` : noms et contenus des entraînements embarqués « Jambes » / « Haut du corps ».
- `bundled-trainings-reset` : libellés et fichiers bundle alignés sur les nouveaux noms.
- `exercise-muscle-group-catalog` : suppression `fessiers` / `dos` ; granularité jambes vs mollets ; **autre** en fallback invisible si vide.
- `exercise-list-tooling` : skill / fichiers JSON source pour les deux entraînements renommés.

## Impact

- UI : `app/page.tsx`, `app/group-settings/CatalogTab.tsx`, `app/group-settings/GroupsTab.tsx` (TrainingsTab).
- Données : `exercice_list/catalog.json`, `entrainement-global.json`, `entrainement-dynamisme-jambes-mollets-core.json`, copies bundle, script `copy-bundled-exercice-list`.
- Config : `app/exercises/muscle-groups.ts` (suppression fessiers/dos, couleurs), normalisation import dans `workout-config` si besoin.
- Actions existantes : `updateTrainingExerciseRef` déjà présent — exposition UI uniquement.
- Tests listes / catalogue / actions à adapter aux nouveaux noms et ids consolidés.
