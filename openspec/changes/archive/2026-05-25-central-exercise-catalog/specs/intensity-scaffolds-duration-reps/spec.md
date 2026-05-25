## MODIFIED Requirements

### Requirement: Intensity multiplies duration and reps
The system SHALL apply the global intensity multiplier (0.5x to 2x) to each placement's **effective** value: duration (seconds) for time-based exercises, repetition count for reps-based exercises. Effective value SHALL be `reference.value ?? catalog.value`. Scaled values SHALL be rounded to the nearest integer.

#### Scenario: Intensity scales time-based exercise
- **WHEN** a placement resolves to type "time" with effective value 60 seconds
- **AND** the user sets intensity to 1.5
- **THEN** the effective duration SHALL be 90 seconds (rounded)

#### Scenario: Intensity scales reps-based exercise
- **WHEN** a placement resolves to type "reps" with effective value 10
- **AND** the user sets intensity to 1.2
- **THEN** the effective reps SHALL be 12 (rounded)

#### Scenario: Intensity at 0.5 reduces values
- **WHEN** a placement has effective value 10 (reps) or 30 (seconds)
- **AND** the user sets intensity to 0.5
- **THEN** the effective value SHALL be 5 or 15 respectively (rounded)
