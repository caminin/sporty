## ADDED Requirements

### Requirement: Session sequencing by muscle group
The workout session flow SHALL sequence exercises from the active training `exerciseRefs` using interleaving keyed by catalog `muscleGroup`. After ordering, each reference SHALL be expanded into `effectiveSeries` work steps (default 1 when `series` is absent). When `series` is greater than 1, all work steps for that reference SHALL run back-to-back as one block before the next reference in the optimized sequence. Rest steps between two work steps of the same reference SHALL use `Math.max(1, Math.round(globalRestTime / 2))`. Rest steps between the last work step of one reference and the first work step of the next reference SHALL use the full training `globalRestTime`. No rest step SHALL follow the final work step. Each expanded work step with `effectiveSeries` greater than 1 SHALL include `seriesIndex` (1-based) and `seriesTotal` equal to `effectiveSeries`. Work steps with a single series SHALL omit `seriesIndex` and `seriesTotal`.

#### Scenario: Interleave exercises across muscle groups
- **WHEN** a session is built from a training with refs in multiple muscle groups
- **THEN** exercises are ordered using round-robin interleaving with group key = `muscleGroup`
- **THEN** each work step carries the muscle group label for display

#### Scenario: Single muscle group training
- **WHEN** all refs resolve to one `muscleGroup`
- **THEN** exercises run sequentially in `exerciseRefs` order within that group

#### Scenario: Multiple series chain back-to-back
- **WHEN** a reference has `series` 2 and `globalRestTime` is 20 seconds
- **THEN** the session emits two consecutive work steps for that reference at its optimized position
- **THEN** no other reference's work step appears between those two steps
- **THEN** the two work steps are separated by one rest step of 10 seconds

#### Scenario: Single series unchanged
- **WHEN** a reference has no `series` field
- **THEN** the session emits exactly one work step for that reference
- **THEN** behavior matches the pre-change session flow for that reference

#### Scenario: Multi-series work steps carry metadata
- **WHEN** a reference resolves to 3 effective series
- **THEN** `buildSessionSteps` emits three work steps for that exercise
- **THEN** the work steps have `seriesIndex` 1, 2, and 3 and `seriesTotal` 3 respectively

#### Scenario: Single series omits metadata
- **WHEN** a reference resolves to 1 effective series
- **THEN** the emitted work step does not include `seriesIndex` or `seriesTotal`

#### Scenario: Encoded session preserves series metadata
- **WHEN** a session is encoded for the timer URL
- **THEN** work steps with multiple series retain `seriesIndex` and `seriesTotal` after decode
