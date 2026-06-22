## MODIFIED Requirements

### Requirement: Global exercise catalog
The system SHALL store a single **global** exercise catalog independent of trainings, keyed by exercise `id`. Each catalog entry SHALL define `id`, `name`, `type` (`time` or `reps`), default `value` (positive number), `muscleGroup` (`MuscleGroupKey`), and optional `series` (integer ≥ 2 only — omitted when effective series is 1).

#### Scenario: Catalog structure on load
- **WHEN** the global catalog is loaded
- **THEN** `exercises` is a non-null object map of exercise definitions
- **THEN** each entry satisfies the catalog exercise schema including `muscleGroup`
- **THEN** optional `series` is an integer ≥ 2 or absent

### Requirement: Catalog CRUD in Exercices tab
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the **Exercices** admin tab only (not from the Entraînements tab).

#### Scenario: Create catalog exercise
- **WHEN** the admin submits a new exercise with name, type, default value, muscle group, and optional default series on the Exercices tab
- **THEN** a new entry is added to the global catalog with a unique `id` and the selected `muscleGroup`
- **THEN** `series` is persisted only when ≥ 2
- **THEN** the global catalog is persisted

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, default value, default series, or muscle group of a catalog exercise from the Exercices tab
- **THEN** the catalog entry is updated and persisted
- **THEN** training placements referencing that `exerciseId` reflect the new name, type, default value, and default series on next resolve (unless the reference overrides `value` or `series`)
- **THEN** changing `muscleGroup` updates which muscle-group section displays the exercise in admin without removing training references

#### Scenario: Edit default duration or reps inline
- **WHEN** the admin changes the type or default value field on an existing catalog row and saves
- **THEN** `exercises[id].type` and `exercises[id].value` are updated in the global catalog
- **THEN** training references without a `value` override use the new default on next resolve

#### Scenario: Edit default series inline
- **WHEN** the admin changes the default series field on an existing catalog row and saves
- **THEN** `exercises[id].series` is updated when ≥ 2, or removed when set to 1
- **THEN** training references without a `series` override use the new catalog default on next resolve

#### Scenario: Delete catalog exercise blocked when referenced
- **WHEN** the admin attempts to delete a catalog exercise still referenced by at least one training
- **THEN** the deletion is rejected with a clear message listing affected trainings
- **THEN** no catalog entry is removed

#### Scenario: Delete unreferenced catalog exercise
- **WHEN** the admin deletes a catalog exercise not referenced by any training
- **THEN** the entry is removed from the global catalog
- **THEN** the global catalog is persisted

#### Scenario: Delete button removes the targeted row
- **WHEN** the admin clicks the delete action on a specific exercise row that is not referenced
- **THEN** the system calls the delete flow with that row's exact `exerciseId`
- **THEN** only the targeted exercise disappears from the Exercices tab list after persistence

### Requirement: Catalog import and export in admin
The system SHALL expose global catalog-only JSON import and export in the **Exercices** admin tab.

#### Scenario: Export catalog from admin tab
- **WHEN** the admin triggers export on the Exercices tab
- **THEN** JSON containing `exercises` is copied or offered for download
- **THEN** each exercise includes `muscleGroup`
- **THEN** each exercise includes `series` only when greater than 1

#### Scenario: Import catalog with replace confirmation
- **WHEN** the admin imports catalog JSON into an existing global catalog
- **THEN** the system asks whether to delete all current catalog exercises before import
- **WHEN** the admin confirms replacement
- **THEN** the global catalog is cleared then filled from import, subject to training reference validation
- **WHEN** the admin declines replacement
- **THEN** imported exercises are merged by `exerciseId` without clearing unrelated ids first
- **THEN** optional `series` on imported entries is validated as integer ≥ 2 or omitted

#### Scenario: Catalog import not available on Entraînements tab
- **WHEN** the admin is on the Entraînements tab
- **THEN** global catalog import and export controls are not shown
