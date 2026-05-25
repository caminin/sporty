## Context

La page `app/group-settings/page.tsx` expose deux onglets (`groups` | `lists`) qui mélangent catalogue, groupes, sélection de listes, import/export et bouton « Réinitialiser » (seed). Le catalogue vit dans l’onglet listes ; les groupes de séance dans l’onglet groupes.

`default-seed.json` alimente uniquement `seedExerciseList` / `seedListWithDefaultTemplate`. Un change parallèle `remove-seed-intensity-slider` couvre aussi cette suppression ; **admin-three-tabs** l’intègre pour livrer une admin cohérente en une passe.

Le champ `muscleGroup` n’existe pas encore sur `ExerciseDefinition`.

### Vocabulaire (validé)

| Concept | Exemple | Rôle |
|--------|---------|------|
| **Groupe musculaire** (`muscleGroup`) | *Split step rapide* → `jambes` | Classifie un exercice du **catalogue** ; tri de l’onglet 1 |
| **Groupe de séance** (`WorkoutConfig.groups`) | *Explosivité jambes*, *Cardio endurance* | Organise la séance ; édité dans l’onglet 2 |

## Goals / Non-Goals

**Goals:**

- Trois onglets exclusifs : **Exercices** | **Groupes & listes** | **Import / Export**
- Catalogue avec `muscleGroup` obligatoire, sections triées par groupe musculaire + icône
- Onglet groupes : toutes les listes, CRUD listes (suppression), repos global, groupes de séance et placements
- Onglet import/export : création liste, import JSON, export JSON uniquement
- Suppression complète du seed (`default-seed.json`, APIs, UI, Dockerfile, tests)

**Non-Goals:**

- Catalogue central partagé entre listes (reste un catalogue par liste)
- Fusionner groupes musculaires et groupes de séance en une seule entité
- Refonte page d’accueil / séance (hors scope)
- Migration runtime des JSON sans `muscleGroup` (fichiers repo mis à jour one-shot)

## Decisions

### 1. Trois onglets et répartition des actions

| Onglet | Id interne | Contenu |
|--------|------------|---------|
| Liste d'exercices | `catalog` | Sélecteur liste active ; CRUD catalogue ; vue groupée par `muscleGroup` |
| Listes de groupes | `groups` | Sélecteur + suppression listes ; repos global ; CRUD **groupes de séance** ; add/remove refs |
| Import / Export | `io` | Créer liste ; importer JSON ; exporter liste active |

### 2. Groupes musculaires prédéfinis

```ts
type MuscleGroupKey =
  | "jambes" | "mollets" | "fessiers" | "dos"
  | "epaules" | "bras" | "abdos" | "pecs" | "autre";
```

- Constante `MUSCLE_GROUPS` : `{ key, label, icon }` (icônes Lucide)
- `ExerciseDefinition.muscleGroup: MuscleGroupKey` obligatoire à la création
- Import sans `muscleGroup` → défaut `"autre"` ; reclassification manuelle dans l’onglet 1
- Exemples de mapping repo : *Split step rapide* → `jambes` ; *Calf raises* → `mollets` ; *Crunchs* → `abdos`

**Rejeté** : clés type `cardio`, `badminton` — ce sont des familles d’entraînement / groupes de séance, pas des groupes musculaires.

### 3. Suppression du seed

- Supprimer `app/exercises/default-seed.json`, `loadDefaultSeedConfig`, `seedExerciseList`, `seedListWithDefaultTemplate`
- Retirer bouton « Réinitialiser » et tests associés
- Retirer `COPY` Dockerfile

### 4. Structure UI onglet catalogue

- Sections par `muscleGroup` (ordre fixe `MUSCLE_GROUPS`)
- En-tête : icône + label (« Jambes », « Mollets », …)
- Formulaire : nom, type, valeur, **select groupe musculaire**

### 5. Liste active

- Conserver `ExerciseListContext.selectedListId`
- Sélecteur visible dans onglets `catalog` et `groups` ; export dans `io` sur la liste active

### 6. Fichiers repo

- `exercice_list/global.json`, `dynamisme-jambes-mollets-core.json` : `muscleGroup` sur chaque entrée catalogue (mapping sémantique, pas depuis le nom du groupe de séance)

## Risks / Trade-offs

- **[Confusion groupes]** Libellés UI explicites : « Groupe musculaire » (onglet 1) vs « Groupe de séance » (onglet 2).
- **[Import sans muscleGroup]** Défaut `autre` ; inciter à reclasser.
- **[Doublon remove-seed-intensity-slider]** Fusionner tâches seed dans ce change.

## Migration Plan

1. Types + `MUSCLE_GROUPS` + validation `parseWorkoutConfig`
2. Suppression seed
3. Refonte `group-settings/page.tsx` (3 onglets)
4. JSON `exercice_list/` + skill
5. Tests

## Open Questions

- Fusionner `remove-seed-intensity-slider` pour le seed uniquement (recommandé)
- Icônes Lucide par clé : à choisir à l’implémentation (`Footprints` jambes, etc.)
