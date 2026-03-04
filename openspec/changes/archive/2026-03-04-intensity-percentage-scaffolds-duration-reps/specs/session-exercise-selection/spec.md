## MODIFIED Requirements

### Requirement: Session Exercise Selection on Home Page
The system SHALL allow the user to select which exercises from the catalogue to include in the current workout session, directly from the home page.

#### Scenario: View all exercises with selection state
- **WHEN** the user opens the home page
- **THEN** all exercises from `exercises.json` are displayed, grouped by their group
- **THEN** each exercise shows a checkbox or toggle indicating whether it is selected for the session

#### Scenario: Toggle exercise selection
- **WHEN** the user taps/clicks on an exercise's toggle
- **THEN** the exercise selection state is toggled (selected ↔ deselected)
- **THEN** the session summary counter updates to reflect the new number of selected exercises

#### Scenario: Launch session with selected exercises only
- **WHEN** the user taps "Lancer la séance"
- **THEN** only the exercises that are currently selected are passed to the timer
- **THEN** deselected exercises are not included in the session
- **THEN** the encoded steps contain duration and reps scaled by the current intensity (rounded to integers)

#### Scenario: Default selection (no saved state)
- **WHEN** the user opens the home page for the first time (no localStorage data)
- **THEN** all exercises are selected by default
