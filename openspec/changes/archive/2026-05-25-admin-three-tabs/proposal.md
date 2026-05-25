## Why

La page admin (`/group-settings`) mélange aujourd’hui catalogue, groupes, listes, import/export et réinitialisation seed dans deux onglets peu lisibles. Le fichier `default-seed.json` et le bouton « Réinitialiser » doublonnent le flux `exercice_list/` + import sans valeur au quotidien. Une structure en trois onglets dédiés clarifie les responsabilités et aligne l’UI sur le modèle catalogue → groupes de séance → échange de données.

## What Changes

- **BREAKING** : la page admin n’expose plus que **trois onglets** — plus d’ancienne disposition « Groupes d’exercices » + « Gestion des listes » telle quelle.
- **Onglet 1 — Liste d’exercices** : CRUD du catalogue de la liste active ; affichage **trié par groupe musculaire** (`muscleGroup`) avec **icône** par section ; ex. *Split step rapide* → `jambes`. Création/édition : nom, type, valeur par défaut, groupe musculaire.
- **Onglet 2 — Listes de groupes** : sélection et édition de **toutes** les listes ; suppression de listes ; temps de repos global ; gestion des **groupes de séance** (créer/modifier/supprimer) ; ajout/retrait d’exercices dans chaque groupe ; surcharge optionnelle de valeur par placement. Distinct de l’onglet 1 : ici *Explosivité jambes*, *Cardio endurance*, etc.
- **Onglet 3 — Import / Export** : création de liste, import JSON (collage ou fichier), export JSON de la liste active — **uniquement** dans cet onglet.
- **BREAKING** : suppression de `default-seed.json`, `seedExerciseList`, `seedListWithDefaultTemplate` et du bouton « Réinitialiser ».
- **BREAKING** : champ `muscleGroup` obligatoire sur chaque entrée du catalogue ; clés prédéfinies : `jambes`, `mollets`, `fessiers`, `dos`, `epaules`, `bras`, `abdos`, `pecs`, `autre`.
- Mise à jour des tests, du `Dockerfile`, des specs et du skill `create-exercise-list` pour refléter `muscleGroup` et absence de seed.

## Capabilities

### New Capabilities

- `exercise-muscle-group-catalog` : groupes musculaires prédéfinis, champ `muscleGroup` sur le catalogue, regroupement et icônes dans l’onglet Liste d’exercices (distinct des groupes de séance).

### Modified Capabilities

- `group-settings` : structure UI en trois onglets ; répartition des actions (catalogue / groupes+listes / import-export).
- `exercise-catalog` : schéma et CRUD incluent `muscleGroup` ; tri par groupe musculaire dans l’admin.
- `default-list-seed` : capacité entièrement retirée.
- `json-import-list` : import JSON visible uniquement dans l’onglet Import/Export.
- `catalog-export-import-merge` : export déplacé vers l’onglet Import/Export.
- `exercise-list-tooling` : plus de référence à `default-seed.json` ; templates avec `muscleGroup` sur les exercices.
- `list-system-testing` : retrait des scénarios seed explicite.

## Impact

- `app/group-settings/page.tsx` (refonte majeure)
- `app/exercises/types.ts`, `workout-config.ts`, `actions.ts`
- `app/exercises/lists.ts`, `lists-actions.ts`
- `app/exercises/default-seed.json` (suppression), `Dockerfile`
- `exercice_list/*.json` (ajout `muscleGroup` sur les entrées catalogue)
- `app/__tests__/entities/exercise-lists/`
- `.cursor/skills/create-exercise-list/SKILL.md`
- Specs OpenSpec listées ci-dessus
