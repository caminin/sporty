## MODIFIED Requirements

### Requirement: Rest between series uses global rest time
Between two consecutive work steps of the **same exercise reference** (intra-block series gap), the system SHALL insert a rest step of duration `Math.max(1, Math.round(globalRestTime / 2))`. Between the last work step of one exercise reference and the first work step of the next reference in the optimized sequence, the system SHALL insert a rest step of duration equal to the full training `globalRestTime`. No rest step SHALL follow the final work step of the session.

#### Scenario: Rest between series of same exercise
- **WHEN** a reference has `series` 3 and `globalRestTime` is 20 seconds
- **THEN** the session sequence is work → rest 10s → work → rest 10s → work (before the next exercise or session end)

#### Scenario: Rest between last series and next exercise
- **WHEN** exercise A has 2 series and exercise B follows in the optimized sequence
- **AND** `globalRestTime` is 30 seconds
- **THEN** a rest step of 15 seconds separates the first and second work step of A
- **THEN** a rest step of 30 seconds separates the last work step of A from the first work step of B

#### Scenario: No rest after final work step
- **WHEN** the session completes
- **THEN** the last step is a work step with no trailing rest

#### Scenario: Odd globalRestTime rounds for series gap
- **WHEN** a reference has `series` 2 and `globalRestTime` is 15 seconds
- **THEN** the rest between the two series work steps is 8 seconds (rounded half)
