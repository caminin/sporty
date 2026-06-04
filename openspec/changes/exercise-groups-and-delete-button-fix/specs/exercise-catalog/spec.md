## MODIFIED Requirements

### Requirement: Catalog CRUD in Exercices tab
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

#### Scenario: Delete button removes the targeted row
- **WHEN** the admin clicks the delete action on a specific exercise row that is not referenced
- **THEN** the system calls the delete flow with that row's exact `exerciseId`
- **THEN** only the targeted exercise disappears from the Exercices tab list after persistence
