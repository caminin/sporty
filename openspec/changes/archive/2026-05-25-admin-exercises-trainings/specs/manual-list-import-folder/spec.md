## MODIFIED Requirements

### Requirement: Manual import from configured folder
The system SHALL support importing a single JSON file from the configured manual lists directory (`DATA_DIR/manual-lists` or equivalent). Import SHALL accept only catalog-only (`exercises`) or training-only (`exerciseRefs`). Any other schema SHALL be rejected.

#### Scenario: Import catalog file from manual folder
- **WHEN** an admin or operator places a catalog JSON file in the manual folder and triggers targeted import for that filename
- **THEN** the global catalog is updated per validation rules
- **THEN** trainings are unchanged unless validation fails due to orphan refs on replace

#### Scenario: Import training file from manual folder
- **WHEN** a training JSON file is imported from the manual folder
- **THEN** a training is created or updated with `exerciseRefs`
- **THEN** all `exerciseId` values resolve against the current global catalog

#### Scenario: Reject invalid manual file
- **WHEN** a manual file is neither valid catalog nor valid training JSON
- **THEN** import fails with a clear validation error
- **THEN** no data is persisted
