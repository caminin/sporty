## MODIFIED Requirements

### Requirement: Session exercise pool from active training
The system SHALL build the selectable exercise pool for a session from the **active training** `exerciseRefs` resolved against the **global catalog**, not from per-list embedded catalogs or named session groups.

#### Scenario: Pool uses global catalog resolution
- **WHEN** the user starts or configures a session with an active training selected
- **THEN** each selectable exercise is resolved from `exerciseRefs` and the global catalog
- **THEN** the exercise `group` label used in sequencing equals the catalog `muscleGroup` key

#### Scenario: No active training
- **WHEN** no training is selected
- **THEN** session exercise selection is empty or blocked with a message to select a training
