### Requirement: Session Time Estimate Display

The system SHALL compute and display an estimated total duration for the workout session on the home page, based on the currently selected placements, their effective values, and their effective series counts (no intensity multiplier).

The estimation formula is:

- **5 seconds** of startup time per work step (each series counts as one work step)
- **3 seconds × reps** for reps-based placements (effective reps, rounded if applicable) per work step
- **duration in seconds** for time-based placements (effective duration) per work step
- **Half rest** (`Math.max(1, Math.round(globalRestTime / 2))`) between consecutive work steps of the same reference (intra-block series gaps)
- **Full `globalRestTime`** between the last work step of one reference and the first work step of the next reference in the optimized sequence
- No rest after the last work step of the session

#### Scenario: Display estimated duration for mixed exercises

- **WHEN** the user has selected at least one placement
- **THEN** the home page displays an estimated session duration computed using the formula above
- **THEN** the duration is shown in a human-readable format: `Xm Ys` if ≥ 60 seconds, otherwise `Xs`

#### Scenario: Estimate updates on selection change

- **WHEN** the user toggles a placement on or off
- **THEN** the estimated duration updates immediately to reflect the new selection

#### Scenario: No exercises selected

- **WHEN** zero placements are selected
- **THEN** the estimated duration displays as `0s`

#### Scenario: Estimate includes multiple series

- **WHEN** a selected placement has `series` 3 and `globalRestTime` is 20 seconds
- **THEN** the estimate counts three work steps for that placement
- **THEN** the estimate includes two intra-block rest periods of 10 seconds each (not full `globalRestTime`)

#### Scenario: Estimate uses full rest between exercises

- **WHEN** two selected placements each have `series` 1 and `globalRestTime` is 30 seconds
- **THEN** the estimate includes one inter-exercise rest period of 30 seconds between them
