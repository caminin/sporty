## MODIFIED Requirements

### Requirement: Import JSON to create list
The system SHALL allow users to import a JSON string (pasted or from file) to create a new exercise list from the admin **Import / Export** tab only. The JSON MUST conform to WorkoutConfig format with `globalRestTime`, `exercises` (catalog with `muscleGroup` or defaulting to `autre`), and `groups` (session group references). Legacy embedded-exercise format SHALL be rejected. The import/export tab SHALL NOT expose a separate control to create an empty list without JSON.

#### Scenario: Import from pasted JSON
- **WHEN** the admin pastes valid JSON in the import textarea on the import/export tab and provides a list name
- **THEN** the system parses the JSON, validates catalog and groups (no legacy conversion)
- **THEN** a new list is created with catalog and group references persisted
- **THEN** the new list is selected as the active list

#### Scenario: Import from file
- **WHEN** the admin selects a .json file via the file input on the import/export tab
- **THEN** the system reads the file content, parses, and validates the catalog + reference format
- **THEN** a new list is created including imported catalog entries
- **THEN** the new list is selected as the active list

#### Scenario: No empty list creation in UI
- **WHEN** the admin opens the import/export tab
- **THEN** no form to create a new list with only a name and description is shown
- **THEN** new lists are created only through successful JSON import

#### Scenario: Invalid JSON
- **WHEN** the admin provides malformed JSON (syntax error)
- **THEN** the system displays an error message indicating invalid JSON
- **THEN** no list is created

#### Scenario: Invalid structure
- **WHEN** the admin provides valid JSON but with incompatible structure (e.g. orphan group references, invalid exercise format)
- **THEN** the system displays an error message describing the validation failure
- **THEN** no list is created
