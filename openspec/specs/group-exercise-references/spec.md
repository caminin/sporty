## ADDED Requirements

### Requirement: Training exercise references resolve from global catalog
The system SHALL store exercise placements on a training as `exerciseRefs` entries with `refId`, `exerciseId`, and optional `value` override. Resolution SHALL load definitions from the **global** catalog. Session display label for grouping SHALL use catalog `muscleGroup`.

#### Scenario: Resolve reference for UI
- **WHEN** a training `exerciseRefs` entry is displayed in admin or session
- **THEN** `name`, `type`, and default `value` come from the global catalog entry for `exerciseId`
- **THEN** effective `value` uses the reference override when present

#### Scenario: Reject invalid exerciseId on training save
- **WHEN** a training is saved with a reference whose `exerciseId` is absent from the global catalog
- **THEN** save fails with an explicit validation error
- **THEN** the previous training file remains unchanged
