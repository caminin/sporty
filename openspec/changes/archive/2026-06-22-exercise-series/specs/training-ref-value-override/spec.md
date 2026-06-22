## ADDED Requirements

### Requirement: Edit series count per training reference
The **Entraînements** admin tab SHALL let authenticated admins edit the `series` count for each `exerciseRefs` entry in the active training. The UI SHALL treat 1 as the default (no persisted field). Values MUST be integers ≥ 1; only values ≥ 2 are persisted as `series`.

#### Scenario: Set series on reference
- **WHEN** the admin changes the series count to 2 or more and saves (blur or explicit save)
- **THEN** `updateTrainingExerciseRef` persists `series` on that `refId`
- **THEN** the displayed effective series count updates without changing the global catalog entry

#### Scenario: Reset to single series
- **WHEN** the admin sets the series count back to 1
- **THEN** the `series` field is removed from that reference in persisted storage
- **THEN** session behavior matches a reference with no `series` field

#### Scenario: Invalid series rejected
- **WHEN** the admin enters zero, negative, or non-integer series
- **THEN** the system does not persist the change
- **THEN** the previous effective series count remains
