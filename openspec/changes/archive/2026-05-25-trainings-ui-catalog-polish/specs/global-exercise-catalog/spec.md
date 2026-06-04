## ADDED Requirements

### Requirement: Catalog uniqueness
The global catalog SHALL NOT contain duplicate logical exercises (same movement under different ids with identical or near-identical names). Bundled `catalog.json` SHALL be deduplicated before release.

#### Scenario: No duplicate Mountain climbers entries
- **WHEN** the bundled catalog is loaded
- **THEN** at most one catalog entry represents « Mountain climbers »
- **THEN** training refs point to the canonical id

#### Scenario: Biceps curl exercises present
- **WHEN** the bundled catalog is loaded
- **THEN** entries exist for « Curl haltères » and « Curl Zottman haltères » (or equivalent approved French label for twisted dumbbell curl)
- **THEN** both use `muscleGroup` **bras**

### Requirement: Reject or normalize removed muscle groups on import
Catalog import and normalization SHALL NOT persist `muscleGroup` values `fessiers` or `dos`. Such values SHALL be mapped to `autre` during normalization, or import SHALL fail with an explicit error.

#### Scenario: Legacy fessiers on import
- **WHEN** imported catalog JSON contains `muscleGroup` **fessiers** or **dos**
- **THEN** the persisted entry uses **autre** after normalization, or import is rejected with a clear message
- **THEN** no catalog entry remains with **fessiers** or **dos**

## MODIFIED Requirements

### Requirement: Global catalog CRUD in Exercices admin tab
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the **Exercices** admin tab only. This tab SHALL NOT show training selectors, training deletion, or training-scoped catalog copies. The exercise list layout SHALL prioritize readable exercise names over compact truncation.

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

#### Scenario: Display full exercise name
- **WHEN** the admin views the catalog exercise list
- **THEN** each exercise name is shown in full or wrapped across lines
- **THEN** the primary name label does not use `truncate` as the only display mode
