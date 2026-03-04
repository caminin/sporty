## Requirement: Home Page Exercise List Display
The system SHALL display all exercises from `exercises.json` on the home page, organized by their respective groups. The session summary card SHALL display: number of selected exercises, rest time per exercise, and estimated session duration. The "Difficulté" (Difficulty) indicator SHALL NOT be displayed. Each exercise SHALL display its **effective** value (reps or duration) scaled by the current intensity multiplier.

#### Scenario: View grouped exercises
- **WHEN** the user navigates to the home page
- **THEN** they see exercises organized by their group
- **THEN** each exercise displays its name, type (reps or time), and value scaled by the current intensity

#### Scenario: Exercise values update when intensity changes
- **WHEN** the user adjusts the intensity slider
- **THEN** each exercise's displayed value (reps or duration) updates immediately to reflect the new intensity

#### Scenario: Session summary shows estimated duration instead of difficulty
- **WHEN** the user views the home page session summary card
- **THEN** the card displays three columns: number of selected exercises, rest time per exercise, and estimated session duration
- **THEN** no "Difficulté" or difficulty indicator is shown

#### Scenario: Default intensity is 1.0
- **WHEN** the user opens the home page for the first time (or reloads)
- **THEN** the intensity slider value starts at **1.0** (not 1.2 or any other value)
