## MODIFIED Requirements

### Requirement: Session Time Estimate Display

The system SHALL compute and display an estimated total duration for the workout session on the home page, based on the currently selected placements, their effective values, and their effective series counts (no intensity multiplier).

The estimation formula is:

- **5 seconds** of startup time per work step (each series counts as one work step)
- **3 seconds × reps** for reps-based placements (effective reps, rounded if applicable) per work step
- **duration in seconds** for time-based placements (effective duration) per work step
- **globalRestTime seconds** of rest between each consecutive pair of work steps (`totalWorkSteps - 1`), not after the last work step

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

- **WHEN** a selected placement has `series` 3
- **THEN** the estimate counts three work steps for that placement
- **THEN** the estimate includes two additional rest periods of `globalRestTime` attributable to the extra series (as part of total work-step gaps)
