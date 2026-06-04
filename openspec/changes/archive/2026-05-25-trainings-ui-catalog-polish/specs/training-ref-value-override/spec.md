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
