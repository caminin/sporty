## MODIFIED Requirements

### Requirement: Training exercise references resolve from global catalog
The system SHALL store exercise placements on a training as `exerciseRefs` entries with `refId`, `exerciseId`, optional `value` override, and optional `series` (integer ≥ 2 only — omitted when effective series is 1). Resolution SHALL load definitions from the **global** catalog. Session display label for grouping SHALL use catalog `muscleGroup`. Effective `series` SHALL default to 1 when omitted.

#### Scenario: Resolve reference for UI
- **WHEN** a training `exerciseRefs` entry is displayed in admin or session
- **THEN** `name`, `type`, and default `value` come from the global catalog entry for `exerciseId`
- **THEN** effective `value` uses the reference override when present
- **THEN** effective `series` is the reference `series` when present, otherwise 1

#### Scenario: Single series omits field
- **WHEN** a reference has effective series 1
- **THEN** persisted JSON does not include a `series` property on that reference

#### Scenario: Reject invalid exerciseId on training save
- **WHEN** a training is saved with a reference whose `exerciseId` is absent from the global catalog
- **THEN** save fails with an explicit validation error
- **THEN** the previous training file remains unchanged

#### Scenario: Reject invalid series on training save
- **WHEN** a training is saved with a reference whose `series` is 1, zero, negative, or non-integer
- **THEN** save or validation fails with an explicit error, or `series` is stripped when equal to 1
- **THEN** the previous effective series value remains unchanged for invalid values
