## MODIFIED Requirements

### Requirement: Export includes catalog and groups
The system SHALL export `WorkoutConfig` as JSON containing `globalRestTime`, `exercises` (with `muscleGroup`), and `groups` (session groups with references) so a list can be fully reconstructed. Export SHALL be triggered only from the admin **Import / Export** tab.

#### Scenario: Export from active list
- **WHEN** the admin triggers export on the import/export tab
- **THEN** the clipboard or download contains `exercises` (including `muscleGroup`) and session groups with references
- **THEN** exported group entries use reference shape only
