## MODIFIED Requirements

### Requirement: Exercise catalog per list
The system SHALL store a single **global** exercise catalog independent of trainings, keyed by exercise `id`. Each catalog entry SHALL define `id`, `name`, `type` (`time` or `reps`), default `value` (positive number), and `muscleGroup` (`MuscleGroupKey`).

#### Scenario: Catalog structure on load
- **WHEN** the global catalog is loaded
- **THEN** `exercises` is a non-null object map of exercise definitions
- **THEN** each entry satisfies the catalog exercise schema including `muscleGroup`

## MODIFIED Requirements

### Requirement: Catalog CRUD in list management
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the **Exercices** admin tab only (not from the Entraînements tab).

#### Scenario: Create catalog exercise
- **WHEN** the admin submits a new exercise with name, type, default value, and muscle group on the Exercices tab
- **THEN** a new entry is added to the global catalog with a unique `id` and the selected `muscleGroup`
- **THEN** the global catalog is persisted

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, default value, or muscle group of a catalog exercise from the Exercices tab
- **THEN** the catalog entry is updated and persisted
- **THEN** training placements referencing that `exerciseId` reflect the new name, type, and default value on next resolve
- **THEN** changing `muscleGroup` updates which muscle-group section displays the exercise in admin without removing training references

#### Scenario: Edit default duration or reps inline
- **WHEN** the admin changes the type or default value field on an existing catalog row and saves
- **THEN** `exercises[id].type` and `exercises[id].value` are updated in the global catalog
- **THEN** training references without a `value` override use the new default on next resolve

#### Scenario: Delete catalog exercise blocked when referenced
- **WHEN** the admin attempts to delete a catalog exercise still referenced by at least one training
- **THEN** the deletion is rejected with a clear message listing affected trainings
- **THEN** no catalog entry is removed

#### Scenario: Delete unreferenced catalog exercise
- **WHEN** the admin deletes a catalog exercise not referenced by any training
- **THEN** the entry is removed from the global catalog
- **THEN** the global catalog is persisted

## MODIFIED Requirements

### Requirement: Catalog import and export in admin
The system SHALL expose global catalog-only JSON import and export in the **Exercices** admin tab.

#### Scenario: Export catalog from admin tab
- **WHEN** the admin triggers export on the Exercices tab
- **THEN** JSON containing `exercises` is copied or offered for download
- **THEN** each exercise includes `muscleGroup`

#### Scenario: Import catalog with replace confirmation
- **WHEN** the admin imports catalog JSON into an existing global catalog
- **THEN** the system asks whether to delete all current catalog exercises before import
- **WHEN** the admin confirms replacement
- **THEN** the global catalog is cleared then filled from import, subject to training reference validation
- **WHEN** the admin declines replacement
- **THEN** imported exercises are merged by `exerciseId` without clearing unrelated ids first

#### Scenario: Catalog import not available on Entraînements tab
- **WHEN** the admin is on the Entraînements tab
- **THEN** global catalog import and export controls are not shown
