## ADDED Requirements

### Requirement: Export includes catalog and groups
The system SHALL export `WorkoutConfig` as JSON containing `globalRestTime`, `exercises`, and `groups` so a list can be fully reconstructed.

#### Scenario: Export from active list
- **WHEN** the user triggers export on the group settings page
- **THEN** the clipboard or download contains `exercises` and groups with references
- **THEN** exported group entries use reference shape only

### Requirement: Strict format on import and load
The system SHALL accept only configs with `exercises` (catalog) and group reference arrays. Legacy embedded exercises in groups SHALL be rejected with a clear validation error — no automatic conversion.

#### Scenario: Reject legacy JSON on import
- **WHEN** imported JSON has groups with embedded `{ id, name, type, value }` but no `exercises` catalog
- **THEN** import fails with a message indicating the required format
- **THEN** no list is created or updated

#### Scenario: Reject invalid stored list
- **WHEN** a list file on disk does not match the catalog + reference schema
- **THEN** load returns null or fails validation without silently converting

### Requirement: Merge catalog on import into existing list
When importing into an existing list (or merging imported config), the system SHALL merge exercise definitions by `exerciseId`.

#### Scenario: New exercise id from import
- **WHEN** imported catalog contains an `exerciseId` absent locally
- **THEN** the definition is added to local `config.exercises`

#### Scenario: Conflicting exercise id
- **WHEN** imported catalog contains an `exerciseId` already present with different name, type, or default value
- **THEN** the imported definition replaces the local catalog entry for that id
- **THEN** existing group reference overrides (`value`) on the local list are preserved

### Requirement: Merge groups on import
The system SHALL merge imported groups by stable group `id`, appending references whose `refId` is not already present in the target group.

#### Scenario: Merge group references
- **WHEN** an imported group shares `id` with a local group
- **THEN** references with new `refId` values are appended
- **WHEN** the same `refId` exists locally and in import
- **THEN** the imported reference `value` override replaces the local one

#### Scenario: New group from import
- **WHEN** imported group `id` is unknown locally
- **THEN** the group is added with all its references
- **THEN** references with missing `exerciseId` in the merged catalog are rejected with a validation error
