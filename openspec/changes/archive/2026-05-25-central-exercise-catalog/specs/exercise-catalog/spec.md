## ADDED Requirements

### Requirement: Exercise catalog per list
The system SHALL store a single exercise catalog per exercise list in `WorkoutConfig.exercises`, keyed by exercise `id`. Each catalog entry SHALL define `id`, `name`, `type` (`time` or `reps`), and default `value` (positive number).

#### Scenario: Catalog structure on load
- **WHEN** a valid exercise list is loaded
- **THEN** `config.exercises` is a non-null object map of exercise definitions
- **THEN** each entry satisfies the catalog exercise schema

### Requirement: Catalog CRUD in list management
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the list management UI.

#### Scenario: Create catalog exercise
- **WHEN** the admin submits a new exercise with name, type, and default value
- **THEN** a new entry is added to `config.exercises` with a unique `id`
- **THEN** the list is persisted

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, or default value of a catalog exercise
- **THEN** the catalog entry is updated
- **THEN** group placements referencing that `exerciseId` reflect the new name and type on next resolve
- **THEN** default value changes do not alter existing group overrides

#### Scenario: Delete catalog exercise blocked when referenced
- **WHEN** the admin attempts to delete a catalog exercise still referenced by at least one group
- **THEN** the deletion is rejected with a clear message listing affected groups
- **THEN** no catalog entry is removed

#### Scenario: Delete unreferenced catalog exercise
- **WHEN** the admin deletes a catalog exercise not referenced by any group
- **THEN** the entry is removed from `config.exercises`
- **THEN** the list is persisted
