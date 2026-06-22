## MODIFIED Requirements

### Requirement: Session step expansion with series
The workout session flow SHALL sequence exercises from the active training `exerciseRefs` using interleaving keyed by catalog `muscleGroup`. After ordering, each reference SHALL be expanded into `effectiveSeries` work steps (default 1 when `series` is absent). When `series` is greater than 1, all work steps for that reference SHALL run back-to-back as one block before the next reference in the optimized sequence. Rest steps SHALL use the training `globalRestTime` between every pair of consecutive work steps, including between two series of the same exercise. No rest step SHALL follow the final work step. Each expanded work step with `effectiveSeries` greater than 1 SHALL include `seriesIndex` (1-based) and `seriesTotal` equal to `effectiveSeries`. Work steps with a single series SHALL omit `seriesIndex` and `seriesTotal`.

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
