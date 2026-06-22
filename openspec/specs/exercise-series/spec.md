## ADDED Requirements

### Requirement: Series count per training reference
The system SHALL support an optional positive integer `series` on each `exerciseRefs` entry **only when greater than 1**. When absent or equal to 1, the effective series count SHALL be **1** and the `series` field SHALL NOT be persisted or exported.

#### Scenario: Default single series without field
- **WHEN** a training reference has no `series` field
- **THEN** the effective series count is 1
- **THEN** session building emits one work step for that reference (after sequencing)
- **THEN** persisted and exported JSON omit `series` on that reference

#### Scenario: Multiple series on reference
- **WHEN** a training reference has `series` set to 2 or more
- **THEN** the effective series count equals that value
- **THEN** session building emits that many work steps for the reference, chained back-to-back at its optimized slot

### Requirement: Series of same exercise chain back-to-back
When a reference has `series` greater than 1, all its work steps SHALL run consecutively as one block before the next exercise in the optimized sequence. No other exercise SHALL be interleaved between series of the same reference.

#### Scenario: Two series chain before next exercise
- **WHEN** push-ups have `series` 2 and squats follow in the optimized sequence
- **THEN** the session order is push-ups → rest → push-ups → rest → squats
- **THEN** no other exercise appears between the two push-up work steps

#### Scenario: Three series block
- **WHEN** a reference has `series` 3
- **THEN** all three work steps for that reference appear consecutively at its optimized position
- **THEN** the next exercise in the optimized sequence starts only after the last series of that reference

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

### Requirement: Series expansion preserves optimized sequencing
The system SHALL apply muscle-group optimized sequencing to one logical entry per `exerciseRefs` reference, then expand each entry into its `series` work steps without reordering references relative to the optimized sequence.

#### Scenario: Series block stays in optimized slot
- **WHEN** optimized order places exercise A before exercise B
- **AND** A has `series` 3
- **THEN** all three work steps for A appear before the first work step for B
