## MODIFIED Requirements

### Requirement: Catalog CRUD in list management
The system SHALL allow authenticated admins to create, update, and delete catalog exercises from the **Liste d'exercices** admin tab (not from the groups or import/export tabs).

#### Scenario: Create catalog exercise
- **WHEN** the admin submits a new exercise with name, type, default value, and muscle group
- **THEN** a new entry is added to `config.exercises` with a unique `id` and the selected `muscleGroup`
- **THEN** the list is persisted

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, default value, or muscle group of a catalog exercise from the catalog tab
- **THEN** the catalog entry is updated and persisted
- **THEN** group placements referencing that `exerciseId` reflect the new name, type, and default value on next resolve
- **THEN** changing `muscleGroup` does not move or remove session group references

#### Scenario: Edit default duration or reps inline
- **WHEN** the admin changes the type or default value field on an existing catalog row and saves (blur or explicit save)
- **THEN** `config.exercises[id].type` and `config.exercises[id].value` are updated
- **THEN** session groups without a reference override use the new default on next resolve

#### Scenario: Delete catalog exercise blocked when referenced
- **WHEN** the admin attempts to delete a catalog exercise still referenced by at least one session group
- **THEN** the deletion is rejected with a clear message listing affected groups
- **THEN** no catalog entry is removed

#### Scenario: Delete unreferenced catalog exercise
- **WHEN** the admin deletes a catalog exercise not referenced by any session group
- **THEN** the entry is removed from `config.exercises`
- **THEN** the list is persisted
