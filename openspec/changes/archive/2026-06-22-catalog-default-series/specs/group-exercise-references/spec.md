## MODIFIED Requirements

### Requirement: Training exercise references resolve from global catalog
The system SHALL store exercise placements on a training as `exerciseRefs` entries with `refId`, `exerciseId`, optional `value` override, and optional `series` (integer ≥ 2 only — omitted when effective series equals the catalog default without a reference override). Resolution SHALL load definitions from the **global** catalog. Session display label for grouping SHALL use catalog `muscleGroup`. Effective `series` SHALL be `ref.series` when present, otherwise `catalog.series` when present, otherwise **1**.

#### Scenario: Resolve reference for UI
- **WHEN** a training `exerciseRefs` entry is displayed in admin or session
- **THEN** `name`, `type`, and default `value` come from the global catalog entry for `exerciseId`
- **THEN** effective `value` uses the reference override when present
- **THEN** effective `series` uses the reference `series` when present, otherwise the catalog default `series`, otherwise 1

#### Scenario: Single series omits field on reference
- **WHEN** a reference has no `series` override and the catalog default is 1
- **THEN** persisted training JSON does not include a `series` property on that reference

#### Scenario: Catalog default series without reference override
- **WHEN** a catalog entry has `series` 3 and the training reference has no `series` field
- **THEN** effective `series` is 3
- **THEN** persisted training JSON omits `series` on that reference

#### Scenario: Reject invalid exerciseId on training save
- **WHEN** a training is saved with a reference whose `exerciseId` is absent from the global catalog
- **THEN** save fails with an explicit validation error
- **THEN** the previous training file remains unchanged

#### Scenario: Reject invalid series on training save
- **WHEN** a training is saved with a reference whose `series` is 1, zero, negative, or non-integer
- **THEN** save or validation fails with an explicit error, or `series` is stripped when equal to 1
- **THEN** the previous effective series value remains unchanged for invalid values
