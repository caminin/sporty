## ADDED Requirements

### Requirement: Session sequencing by muscle group
The workout session flow SHALL sequence exercises from the active training `exerciseRefs` using interleaving keyed by catalog `muscleGroup`. Rest steps SHALL use the training `globalRestTime`.

#### Scenario: Interleave exercises across muscle groups
- **WHEN** a session is built from a training with refs in multiple muscle groups
- **THEN** exercises are ordered using round-robin interleaving with group key = `muscleGroup`
- **THEN** each work step carries the muscle group label for display

#### Scenario: Single muscle group training
- **WHEN** all refs resolve to one `muscleGroup`
- **THEN** exercises run sequentially in `exerciseRefs` order within that group
