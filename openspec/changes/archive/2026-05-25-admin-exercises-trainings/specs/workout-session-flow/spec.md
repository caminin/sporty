## MODIFIED Requirements

### Requirement: Session sequencing by muscle group
The workout session flow SHALL sequence exercises from the active training `exerciseRefs` using interleaving keyed by catalog `muscleGroup` (replacing interleaving by named session group). Rest steps SHALL use the training `globalRestTime`.

#### Scenario: Interleave exercises across muscle groups
- **WHEN** a session is built from a training with refs in multiple muscle groups
- **THEN** exercises are ordered using the same round-robin interleaving algorithm as before, with group key = `muscleGroup`
- **THEN** each work step carries the muscle group label for display

#### Scenario: Single muscle group training
- **WHEN** all refs resolve to one `muscleGroup`
- **THEN** exercises run sequentially in `exerciseRefs` order within that group

## REMOVED Requirements

### Requirement: Session group name on work steps
**Reason**: Work steps use `muscleGroup` labels; play order is defined by `exerciseRefs` order in the training file.
