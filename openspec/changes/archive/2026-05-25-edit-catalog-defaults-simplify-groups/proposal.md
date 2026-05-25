## Why

L’admin catalogue permet d’ajouter des exercices mais pas de modifier la durée ou les répétitions par défaut après création. L’onglet groupes de séance expose des actions redondantes (création de groupe, surcharge de valeur, liste complète du catalogue) alors que la configuration réelle se fait en JSON et que les valeurs doivent rester alignées sur le catalogue, rangé par groupe musculaire.

## What Changes

- **Onglet Liste d’exercices** : édition inline du type et de la valeur par défaut (durée en secondes ou répétitions) pour chaque entrée du catalogue, en plus du groupe musculaire déjà modifiable.
- **Onglet Listes de groupes** :
  - Affichage des exercices d’un groupe de séance **regroupés par `muscleGroup`**, dans le même ordre et libellés que l’onglet catalogue (données catalogue, pas de copie).
  - **Suppression** de l’UI de surcharge de valeur sur les placements (toujours la valeur catalogue).
  - **Suppression** de l’UI « Créer un groupe de séance » (les groupes viennent du JSON importé).
  - Sélecteur d’ajout d’exercice **filtré** : seuls les exercices du catalogue dont le `muscleGroup` correspond à la section musculaire courante sont proposés.
  - Conservation : repos global, ajout/retrait d’exercices dans un groupe existant, édition/suppression de groupe et de listes si déjà présentes.
- **Onglet Import / Export** : **suppression** du formulaire « créer une liste vide » ; création de listes **uniquement** par import JSON (collage ou fichier).
- Données : le champ optionnel `value` sur `GroupExerciseRef` peut rester en lecture pour d’anciens JSON, mais l’admin ne l’écrit plus.

## Capabilities

### New Capabilities

_Aucune — extensions des capacités existantes._

### Modified Capabilities

- `exercise-catalog` : édition des valeurs par défaut (type + value) depuis l’onglet catalogue.
- `group-settings` : simplification UI groupes (pas de création de groupe, pas de surcharge, affichage par muscle group, picker filtré).
- `group-exercise-references` : admin n’expose plus les surcharges ; résolution affichée = catalogue.
- `json-import-list` : plus de création de liste vide dans l’UI ; import JSON seul pour nouvelles listes.
- `exercise-group-creation` : retrait des exigences d’interface de **création** de groupe (édition/suppression via JSON + admin limité conservés ailleurs).
- `list-system-testing` : scénarios alignés sur les nouveaux flux admin.

## Impact

- `app/group-settings/CatalogTab.tsx` — champs éditables type/valeur
- `app/group-settings/GroupsTab.tsx` — sections muscle group, picker filtré, retrait création/surcharge
- `app/group-settings/ImportExportTab.tsx` — retrait création liste
- `app/exercises/actions.ts` — usage existant de `updateCatalogExercise`
- `openspec/specs/group-settings/spec.md`, `exercise-catalog`, `group-exercise-references`, `json-import-list`, `exercise-group-creation`, `list-system-testing` (deltas)
- Tests admin / listes si présents
