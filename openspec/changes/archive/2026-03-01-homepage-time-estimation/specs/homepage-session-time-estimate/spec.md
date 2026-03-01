## ADDED Requirements

### Requirement: Session Time Estimate Display
The system SHALL compute and display an estimated total duration for the workout session on the home page, based on the currently selected exercises.

The estimation formula is:
- **5 seconds** of startup time per exercise
- **3 seconds × number of repetitions** for reps-based exercises
- **Exercise duration in seconds** for time-based exercises
- **globalRestTime seconds** of rest between each exercise (not after the last)

#### Scenario: Display estimated duration for mixed exercises
- **WHEN** the user has selected at least one exercise
- **THEN** the home page displays an estimated session duration computed using the formula above
- **THEN** the duration is shown in a human-readable format: `Xm Ys` if ≥ 60 seconds, otherwise `Xs`

#### Scenario: Estimate updates on selection change
- **WHEN** the user toggles an exercise on or off
- **THEN** the estimated duration updates immediately to reflect the new selection

#### Scenario: No exercises selected
- **WHEN** zero exercises are selected
- **THEN** the estimated duration displays as `0s`
