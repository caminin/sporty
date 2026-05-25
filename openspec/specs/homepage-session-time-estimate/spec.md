### Requirement: Session Time Estimate Display

The system SHALL compute and display an estimated total duration for the workout session on the home page, based on the currently selected placements and their effective values (no intensity multiplier).

The estimation formula is:

- **5 seconds** of startup time per selected placement
- **3 seconds × reps** for reps-based placements (effective reps, rounded if applicable)
- **duration in seconds** for time-based placements (effective duration)
- **globalRestTime seconds** of rest between each placement (not after the last)

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
