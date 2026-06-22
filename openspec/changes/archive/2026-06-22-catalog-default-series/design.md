## Context

Les séries par référence d'entraînement sont en place (`GroupExerciseRef.series`, expansion en séance, UI Entraînements). Le catalogue global (`ExerciseDefinition`, `catalog.json`) ne porte que `name`, `type`, `value` et `muscleGroup`. Le modèle `value` établit déjà le pattern souhaité : défaut catalogue + override optionnel par référence. Les séries doivent suivre la même hiérarchie.

## Goals / Non-Goals

**Goals:**

- Ajouter `series` optionnel sur `ExerciseDefinition` (persisté uniquement quand ≥ 2).
- Résoudre `effectiveSeries = ref.series ?? catalog.series ?? 1` dans `getEffectiveSeries` / `resolveRef`.
- Permettre l'édition du défaut catalogue dans l'onglet **Exercices**.
- Adapter l'onglet **Entraînements** pour afficher le défaut catalogue et distinguer surcharge vs défaut (comme pour `value`).
- Valider et normaliser `series` à l'import catalogue ; propager à l'export.
- Documenter le format dans le skill `create-exercise-list`.

**Non-Goals:**

- Changer la logique d'expansion en séance (déjà gérée par `effectiveSeries` sur `ResolvedExercise`).
- Modifier `globalRestTime` ou le comportement inter-séries.
- Migrer automatiquement les `series` des références vers le catalogue (données existantes restent sur les refs).
- Indicateur « série 2/3 » dans le timer.

## Decisions

### 1. `series` optionnel sur `ExerciseDefinition`

```ts
interface ExerciseDefinition {
  id: string;
  name: string;
  type: ExerciseType;
  value: number;
  muscleGroup: MuscleGroupKey;
  series?: number; // ≥ 2 seulement ; absent = 1 série
}
```

**Rationale :** Symétrie avec `GroupExerciseRef.series` et rétrocompatibilité totale des `catalog.json` existants.

### 2. Hiérarchie de résolution

```ts
function getEffectiveSeries(
  def: ExerciseDefinition,
  ref: GroupExerciseRef
): number {
  return ref.series ?? def.series ?? 1;
}
```

**Rationale :** La référence surcharge le catalogue, comme pour `value`. Une ref sans `series` hérite du défaut catalogue.

**Alternative rejetée :** Catalogue comme plafond (min/max) — complexité inutile pour le besoin actuel.

### 3. Normalisation catalogue

`normalizeExerciseDefinition` accepte `series` optionnel ; si présent et < 2 ou non entier, rejet ou strip (aligné sur refs : seuls ≥ 2 sont conservés). Export catalogue omet `series` quand effectif = 1.

### 4. UI Exercices

Champ numérique « Séries » par ligne catalogue (défaut affiché 1). Sauvegarde via `updateCatalogExercise` étendu. Création d'exercice : optionnel, défaut 1 non persisté.

### 5. UI Entraînements

Réutiliser le pattern `value` :

- `effectiveSeries = ref.series ?? catalog.series ?? 1`
- `hasSeriesOverride` quand `ref.series` est défini et ≥ 2
- Reset à 1 sur la ref supprime `ref.series` et retombe sur le défaut catalogue (peut être > 1)
- Indicateur visuel si `effectiveSeries !== (catalog.series ?? 1)` à cause d'un override ref

### 6. Ajout d'exercice à un entraînement

Nouvelle ref sans `series` : hérite immédiatement du défaut catalogue via résolution, sans copier `series` sur la ref.

## Risks / Trade-offs

- **[Confusion défaut vs override]** → Même UX que `value` (indicateur + reset ref).
- **[Catalogue modifié après refs]** → Comportement voulu : refs sans override suivent le nouveau défaut catalogue.
- **[JSON legacy]** → Absence de `series` sur catalogue = 1 ; aucune migration destructive.

## Migration Plan

1. Types + `normalizeExerciseDefinition` + `getEffectiveSeries(def, ref)`.
2. Mettre à jour tous les appels à `getEffectiveSeries(ref)` pour passer le catalogue.
3. UI CatalogTab + extension `updateCatalogExercise` / `addCatalogExercise`.
4. Ajustement GroupsTab (affichage défaut catalogue).
5. Skill + tests.
6. Optionnel : peupler `series` sur quelques entrées de `catalog.json` bundlé.

Rollback : ignorer `series` sur le catalogue ; résolution retombe sur `ref.series ?? 1`.

## Open Questions

- Aucune — le pattern `value` fait autorité pour le comportement attendu.
