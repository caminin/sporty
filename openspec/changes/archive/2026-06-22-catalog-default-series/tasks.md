## 1. Modèle et validation

- [x] 1.1 Ajouter `series?: number` sur `ExerciseDefinition` dans `types.ts`
- [x] 1.2 Étendre `normalizeExerciseDefinition` : accepter `series` optionnel (entier ≥ 2 conservé, sinon omis)
- [x] 1.3 Modifier `getEffectiveSeries(def, ref)` : `ref.series ?? def.series ?? 1` et mettre à jour tous les appels
- [x] 1.4 Propager `series` dans export/import catalogue (`exportCatalogToJson`, validation import)

## 2. Actions serveur

- [x] 2.1 Étendre `addCatalogExercise` et `updateCatalogExercise` pour persister `series` (≥ 2 seulement)
- [x] 2.2 Tests workout-config / actions pour normalisation et résolution catalogue + ref

## 3. Admin Exercices

- [x] 3.1 Ajouter champ « Séries » par défaut dans `CatalogTab.tsx` (création et édition inline)
- [x] 3.2 Afficher la valeur effective (défaut 1) et persister via `updateCatalogExercise`

## 4. Admin Entraînements

- [x] 4.1 Adapter `GroupsTab.tsx` : `effectiveSeries` inclut le défaut catalogue
- [x] 4.2 Indicateur de surcharge ref vs défaut catalogue ; reset ref retombe sur défaut catalogue

## 5. Documentation et données bundlées

- [x] 5.1 Mettre à jour `.cursor/skills/create-exercise-list/SKILL.md` avec `series` optionnel sur `catalog.json`
- [x] 5.2 (Optionnel) Ajouter `series` sur des entrées pertinentes de `exercice_list/catalog.json`

## 6. Vérification

- [x] 6.1 Mettre à jour / ajouter tests `session-utils` pour résolution catalogue → séries effectives
- [x] 6.2 Lancer la suite de tests concernée
- [x] 6.3 Vérifier manuellement : exercice catalogue à 3 séries ajouté à un entraînement sans override → 3 séries en séance
