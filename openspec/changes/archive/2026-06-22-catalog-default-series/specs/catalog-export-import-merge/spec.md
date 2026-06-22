## MODIFIED Requirements

### Requirement: Export catalog and training separately
The system SHALL support two separate admin export flows: **global catalog export** serializes `exercises` (with `muscleGroup` and optional `series` only when > 1) from the **Exercices** tab; **training export** serializes `exerciseRefs` and optional `globalRestTime` from the **Entraînements** tab. Session `groups` export SHALL NOT exist.

#### Scenario: Export catalog from Exercices tab
- **WHEN** the admin triggers catalog export on the Exercices tab
- **THEN** the clipboard or download contains `exercises` including `muscleGroup`
- **THEN** each exercise includes `series` only when greater than 1
- **THEN** `exerciseRefs` and `groups` are not included

#### Scenario: Export training from Entraînements tab
- **WHEN** the admin triggers training export on the Entraînements tab
- **THEN** the clipboard or download contains `exerciseRefs` with reference shape only
- **THEN** catalog `exercises` are not duplicated in the file

### Requirement: Merge catalog on import into global catalog
When importing catalog JSON into an existing global catalog, the system SHALL support replace-all or merge-by-id modes selected by the admin before import.

#### Scenario: Replace all catalog exercises
- **WHEN** the admin confirms replacing all current catalog exercises before import
- **THEN** global `exercises` is cleared before applying imported definitions
- **THEN** if any training reference points to an `exerciseId` absent from the new catalog, import fails with an explicit error listing affected trainings
- **THEN** no partial catalog replace is persisted on failure

#### Scenario: Merge catalog by exercise id
- **WHEN** the admin declines replacing all exercises (merge mode)
- **THEN** imported definitions are merged by `exerciseId`
- **THEN** existing training reference overrides (`value`, `series`) are preserved

#### Scenario: New exercise id from import
- **WHEN** imported catalog contains an `exerciseId` absent locally in merge mode
- **THEN** the definition is added to the global catalog including optional `series` when ≥ 2

#### Scenario: Conflicting exercise id
- **WHEN** imported catalog contains an `exerciseId` already present with different fields in merge mode
- **THEN** the imported definition replaces the local catalog entry for that id
- **THEN** existing training reference overrides are preserved
