## MODIFIED Requirements

### Requirement: Import JSON to create list
The system SHALL allow users to import a JSON string (pasted or from file) to create a new exercise list. The JSON MUST conform to WorkoutConfig format with `globalRestTime`, `exercises` (catalog), and `groups` (references). Legacy embedded-exercise format SHALL be rejected.

#### Scenario: Import from pasted JSON
- **WHEN** the user pastes valid JSON in the import textarea and provides a list name
- **THEN** the system parses the JSON, validates catalog and groups (no legacy conversion)
- **THEN** a new list is created with catalog and group references persisted
- **THEN** the new list is selected as the active list

#### Scenario: Import from file
- **WHEN** the user selects a .json file via the file input
- **THEN** the system reads the file content, parses, and validates the catalog + reference format
- **THEN** a new list is created including imported catalog entries
- **THEN** the new list is selected as the active list

#### Scenario: Invalid JSON
- **WHEN** the user provides malformed JSON (syntax error)
- **THEN** the system displays an error message indicating invalid JSON
- **THEN** no list is created

#### Scenario: Invalid structure
- **WHEN** the user provides valid JSON but with incompatible structure (e.g. orphan group references, invalid exercise format)
- **THEN** the system displays an error message describing the validation failure
- **THEN** no list is created
