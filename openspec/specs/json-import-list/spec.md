## Requirement: Import JSON to create list
The system SHALL allow admins to create a new exercise list by importing catalog JSON (pasted or from file) from the **Liste d'exercices** tab only. The JSON MUST contain a valid `exercises` catalog (with `muscleGroup` or defaulting to `autre`). Optional `globalRestTime` MAY be included. Legacy embedded-exercise group format SHALL NOT be accepted on this tab. New lists SHALL NOT be created from the groups tab.

#### Scenario: Import catalog from pasted JSON
- **WHEN** the admin pastes valid catalog JSON on the catalog tab and provides a list name (when no list exists or creating new)
- **THEN** the system parses and validates the `exercises` map
- **THEN** a new list is created with the catalog persisted and empty `groups` unless groups are added later
- **THEN** the new list is selected as the active list

#### Scenario: Import catalog from file
- **WHEN** the admin selects a .json file via the catalog tab file input
- **THEN** the system reads the file, validates catalog format
- **THEN** a new list is created when no target list is selected for merge, or the active list catalog is updated when merging/replacing per admin choice

#### Scenario: No empty list creation in UI
- **WHEN** the admin opens the catalog tab with no lists
- **THEN** no form to create a new list with only a name is shown
- **THEN** new lists are created only through successful catalog JSON import with a name

#### Scenario: Invalid JSON
- **WHEN** the admin provides malformed JSON (syntax error)
- **THEN** the system displays an error message indicating invalid JSON
- **THEN** no list is created or updated

#### Scenario: Invalid catalog structure
- **WHEN** the admin provides valid JSON but without a valid `exercises` map
- **THEN** the system displays an error message describing the validation failure
- **THEN** no list is created or updated

## Requirement: Import groups JSON on active list
The system SHALL allow admins to import session groups JSON (pasted or from file) from the **Listes de groupes** tab into the **active** exercise list only. The JSON MUST contain a valid `groups` object with reference arrays.

#### Scenario: Import groups on active list
- **WHEN** the admin pastes valid groups JSON on the groups tab with an active list selected
- **THEN** the system validates all references against the active catalog
- **THEN** groups are merged into the active list and persisted
- **THEN** the active list remains selected

#### Scenario: Import groups without active list
- **WHEN** no list is selected or the catalog is empty
- **THEN** groups import is disabled or fails with a message to import catalog first

#### Scenario: Invalid groups structure
- **WHEN** groups JSON is valid syntax but references are invalid or orphan
- **THEN** the system displays an explicit validation error
- **THEN** the list on disk is unchanged
