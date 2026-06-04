## ADDED Requirements

### Requirement: Single global exercise catalog
The system SHALL persist exactly one exercise catalog for the entire application, independent of any training. The catalog SHALL be stored as a map keyed by exercise `id` with entries containing `id`, `name`, `type` (`time` or `reps`), default `value` (positive number), and `muscleGroup` (`MuscleGroupKey`).

#### Scenario: Load global catalog
- **WHEN** the application needs exercise definitions
- **THEN** it loads the global catalog from persistent storage
- **THEN** each entry satisfies the catalog exercise schema including `muscleGroup`

### Requirement: Global catalog CRUD in Exercices admin tab
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the **Exercices** admin tab only. This tab SHALL NOT show training selectors, training deletion, or training-scoped catalog copies.

#### Scenario: Create catalog exercise
- **WHEN** the admin submits a new exercise with name, type, default value, and muscle group on the Exercices tab
- **THEN** a new entry is added to the global catalog with a unique `id`
- **THEN** the global catalog is persisted

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, default value, or muscle group of a catalog exercise
- **THEN** the global catalog entry is updated and persisted
- **THEN** all training placements referencing that `exerciseId` resolve with the updated definition on next load

#### Scenario: Delete catalog exercise blocked when referenced
- **WHEN** the admin attempts to delete a catalog exercise referenced by at least one training
- **THEN** deletion is rejected with a message listing affected training names
- **THEN** no catalog entry is removed

#### Scenario: Delete unreferenced catalog exercise
- **WHEN** the admin deletes a catalog exercise not referenced by any training
- **THEN** the entry is removed from the global catalog
- **THEN** the global catalog is persisted

### Requirement: Global catalog import and export
The system SHALL expose catalog-only JSON import and export on the **Exercices** tab. Export SHALL serialize `exercises` only (optional `globalRestTime` MAY be omitted). Import SHALL update the global catalog with replace-or-merge confirmation when catalog entries already exist.

#### Scenario: Export global catalog
- **WHEN** the admin triggers catalog export on the Exercices tab
- **THEN** JSON containing `exercises` with `muscleGroup` on each entry is offered
- **THEN** the JSON does not contain training `exerciseRefs` or session `groups`

#### Scenario: Import global catalog with replace confirmation
- **WHEN** the admin imports catalog JSON into a non-empty global catalog
- **THEN** the system asks whether to delete all current catalog exercises before import
- **WHEN** the admin confirms replacement
- **THEN** the global catalog is cleared then filled from import
- **WHEN** the admin declines replacement
- **THEN** imported exercises are merged by `exerciseId`

#### Scenario: Import blocked if trainings would orphan
- **WHEN** replace-mode import would remove catalog ids still referenced by trainings
- **THEN** import fails with an explicit error listing missing ids and affected trainings
- **THEN** the previous global catalog remains unchanged
