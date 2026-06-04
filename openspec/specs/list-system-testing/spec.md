## ADDED Requirements

### Requirement: Tests cover global catalog and trainings
Automated tests SHALL cover global catalog CRUD, training CRUD with `exerciseRefs`, catalog import replace/merge with training orphan validation, training import with catalog reference validation, and reset/load from bundled JSON fixtures.

#### Scenario: Global catalog isolated from training delete
- **WHEN** a test deletes a training
- **THEN** the global catalog file still contains exercises referenced only by other trainings

#### Scenario: Reset restores bundled snapshot
- **WHEN** a test invokes reset to bundled defaults with fixture bundle paths
- **THEN** global catalog and two default trainings match expected fixture content

### Requirement: Training entity tests
Tests under exercise list entities SHALL use terminology and storage matching **global catalog** + **training** records instead of per-list embedded `WorkoutConfig.exercises`.

#### Scenario: Training load without embedded catalog
- **WHEN** integration tests load a training from disk
- **THEN** assertions resolve exercise names via global catalog helpers
- **THEN** tests do not expect `config.groups` on trainings
