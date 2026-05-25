## ADDED Requirements

### Requirement: Export includes catalog and groups
The system SHALL support two separate admin export flows: **catalog export** serializes `exercises` (with `muscleGroup`) and optional `globalRestTime`; **groups export** serializes `groups` (session groups with references) and optional `globalRestTime`. Catalog export SHALL be triggered only from the **Liste d'exercices** tab. Groups export SHALL be triggered only from the **Listes de groupes** tab.

#### Scenario: Export catalog from catalog tab
- **WHEN** the admin triggers catalog export on the catalog tab
- **THEN** the clipboard or download contains `exercises` including `muscleGroup`
- **THEN** `groups` are not required in the exported file

#### Scenario: Export groups from groups tab
- **WHEN** the admin triggers groups export on the groups tab
- **THEN** the clipboard or download contains session groups with reference shape only
- **THEN** exported group entries use reference shape only

### Requirement: Strict format on import and load
The system SHALL accept catalog-only JSON with an `exercises` object and groups-only JSON with a `groups` object. Full `WorkoutConfig` combined import SHALL remain available only for manual folder import (`importListFromManualFolder`), not for admin paste/file in either tab. Legacy embedded exercises in groups SHALL be rejected with a clear validation error.

#### Scenario: Reject legacy JSON on groups import
- **WHEN** imported groups JSON has embedded `{ id, name, type, value }` without catalog references
- **THEN** import fails with a message indicating the required reference format
- **THEN** the active list is not updated

#### Scenario: Reject invalid stored list
- **WHEN** a list file on disk does not match the catalog + reference schema
- **THEN** load returns null or fails validation without silently converting

#### Scenario: Reject catalog JSON without exercises
- **WHEN** imported catalog JSON lacks a valid `exercises` map
- **THEN** import fails with a clear validation message
- **THEN** no list is created or updated

### Requirement: Merge catalog on import into existing list
When importing catalog JSON into an existing list, the system SHALL support two modes selected by the admin before import.

#### Scenario: Replace all catalog exercises
- **WHEN** the admin confirms replacing all current catalog exercises before import
- **THEN** local `config.exercises` is cleared before applying imported definitions
- **THEN** if any session group reference points to an `exerciseId` absent from the new catalog, import fails with an explicit error listing affected groups
- **THEN** no partial catalog replace is persisted on failure

#### Scenario: Merge catalog by exercise id
- **WHEN** the admin declines replacing all exercises (merge mode)
- **THEN** imported definitions are merged by `exerciseId` as today: new ids are added, conflicting ids replace local catalog entries
- **THEN** existing group reference overrides (`value`) on the local list are preserved

#### Scenario: New exercise id from import
- **WHEN** imported catalog contains an `exerciseId` absent locally in merge mode
- **THEN** the definition is added to local `config.exercises`

#### Scenario: Conflicting exercise id
- **WHEN** imported catalog contains an `exerciseId` already present with different name, type, or default value in merge mode
- **THEN** the imported definition replaces the local catalog entry for that id
- **THEN** existing group reference overrides (`value`) on the local list are preserved

### Requirement: Merge groups on import
The system SHALL merge imported groups by stable group `id` into the active list, appending references whose `refId` is not already present in the target group. Every imported reference MUST resolve to an `exerciseId` present in the active list catalog before persist.

#### Scenario: Reject orphan reference on groups import
- **WHEN** imported groups contain a reference whose `exerciseId` is not in the active list catalog
- **THEN** import fails with a clear message naming the session group and missing `exerciseId`
- **THEN** no group data from that import is persisted

#### Scenario: Merge group references
- **WHEN** an imported group shares `id` with a local group and all references are valid
- **THEN** references with new `refId` values are appended
- **WHEN** the same `refId` exists locally and in import
- **THEN** the imported reference `value` override replaces the local one

#### Scenario: New group from import
- **WHEN** imported group `id` is unknown locally and all references are valid
- **THEN** the group is added with all its references
