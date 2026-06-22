## MODIFIED Requirements

### Requirement: Session sequencing by muscle group
The workout session flow SHALL sequence exercises from the active training `exerciseRefs` using interleaving keyed by catalog `muscleGroup`. After ordering, each reference SHALL be expanded into `effectiveSeries` work steps (default 1 when `series` is absent). When `series` is greater than 1, all work steps for that reference SHALL run back-to-back as one block before the next reference in the optimized sequence. Rest steps SHALL use the training `globalRestTime` between every pair of consecutive work steps, including between two series of the same exercise. No rest step SHALL follow the final work step.

#### Scenario: Interleave exercises across muscle groups
- **WHEN** a session is built from a training with refs in multiple muscle groups
- **THEN** exercises are ordered using round-robin interleaving with group key = `muscleGroup`
- **THEN** each work step carries the muscle group label for display

#### Scenario: Single muscle group training
- **WHEN** all refs resolve to one `muscleGroup`
- **THEN** exercises run sequentially in `exerciseRefs` order within that group

#### Scenario: Multiple series chain back-to-back
- **WHEN** a reference has `series` 2
- **THEN** the session emits two consecutive work steps for that reference at its optimized position
- **THEN** no other reference's work step appears between those two steps
- **THEN** the two work steps are separated by one rest step of `globalRestTime`

#### Scenario: Single series unchanged
- **WHEN** a reference has no `series` field
- **THEN** the session emits exactly one work step for that reference
- **THEN** behavior matches the pre-change session flow for that reference
