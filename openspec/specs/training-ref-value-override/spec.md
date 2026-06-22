## ADDED Requirements

### Requirement: Edit effective value per training reference
The **Entraînements** admin tab SHALL let authenticated admins edit the effective `value` for each `exerciseRefs` entry in the active training, persisting an optional `value` override on the reference. The UI SHALL indicate when a value differs from the catalog default and SHALL allow clearing the override to revert to the catalog default.

#### Scenario: Override value on reference
- **WHEN** the admin changes the numeric value for a training reference and saves (blur or explicit save)
- **THEN** `updateTrainingExerciseRef` persists `value` on that `refId`
- **THEN** the displayed effective value updates without changing the global catalog entry

#### Scenario: Clear override to catalog default
- **WHEN** the admin resets the reference value to catalog default
- **THEN** the optional `value` field is removed from that reference
- **THEN** the effective value shown equals the catalog exercise default `value`

#### Scenario: Invalid value rejected
- **WHEN** the admin enters zero or negative value
- **THEN** the system does not persist the change
- **THEN** the previous effective value remains

### Requirement: Edit series count per training reference
The **Entraînements** admin tab SHALL let authenticated admins edit the `series` count for each `exerciseRefs` entry in the active training. The UI SHALL display the effective series count (reference override or catalog default). Values MUST be integers ≥ 1; only values ≥ 2 are persisted as `series` on the reference. Clearing a reference override SHALL revert effective series to the catalog default (which may be greater than 1).

#### Scenario: Set series on reference
- **WHEN** the admin changes the series count to 2 or more and saves (blur or explicit save)
- **THEN** `updateTrainingExerciseRef` persists `series` on that `refId`
- **THEN** the displayed effective series count updates without changing the global catalog entry

#### Scenario: Reset reference override to catalog default
- **WHEN** the admin clears the reference series override (sets reference back to inherit catalog default)
- **THEN** the `series` field is removed from that reference in persisted storage
- **THEN** effective series equals the catalog default `series` or 1 when absent

#### Scenario: Reset to single series when catalog default is 1
- **WHEN** the catalog default is 1 and the admin sets the reference series count to 1
- **THEN** the `series` field is removed from that reference in persisted storage
- **THEN** session behavior matches a reference with no `series` field and catalog without `series`

#### Scenario: Invalid series rejected
- **WHEN** the admin enters zero, negative, or non-integer series
- **THEN** the system does not persist the change
- **THEN** the previous effective series count remains

#### Scenario: Indicate override vs catalog default
- **WHEN** the admin views a training reference whose effective series differs from the catalog default because of a reference `series` override
- **THEN** the UI indicates that the series count is overridden on the reference
- **THEN** the admin can clear the override to revert to the catalog default
