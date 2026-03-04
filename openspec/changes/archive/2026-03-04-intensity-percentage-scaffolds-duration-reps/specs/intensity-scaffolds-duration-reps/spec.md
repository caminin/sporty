## ADDED Requirements

### Requirement: Intensity multiplies duration and reps
The system SHALL apply the global intensity multiplier (0.5x to 2x) to exercise values: duration (seconds) for time-based exercises, and repetition count for reps-based exercises. Scaled values SHALL be rounded to the nearest integer.

#### Scenario: Intensity scales time-based exercise
- **WHEN** an exercise has type "time" and value 60 seconds
- **AND** the user sets intensity to 1.5
- **THEN** the effective duration SHALL be 90 seconds (60 × 1.5, rounded)

#### Scenario: Intensity scales reps-based exercise
- **WHEN** an exercise has type "reps" and value 10
- **AND** the user sets intensity to 1.2
- **THEN** the effective reps SHALL be 12 (10 × 1.2, rounded)

#### Scenario: Intensity at 0.5 reduces values
- **WHEN** an exercise has value 10 (reps) or 30 (seconds)
- **AND** the user sets intensity to 0.5
- **THEN** the effective value SHALL be 5 (reps) or 15 (seconds)
