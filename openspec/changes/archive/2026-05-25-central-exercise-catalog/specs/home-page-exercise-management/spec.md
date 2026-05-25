## MODIFIED Requirements

### Requirement: Home Page Exercise List Display
The system SHALL display all group placements from the active list on the home page, organized by group. Each row SHALL show the resolved exercise name, type, and **effective** value (catalog default or group override) scaled by the current intensity multiplier. The session summary card SHALL display: number of selected placements, rest time per exercise, and estimated session duration.

#### Scenario: View grouped exercises
- **WHEN** the user navigates to the home page with an active list
- **THEN** they see resolved placements organized by group
- **THEN** each placement displays name, type, and effective value scaled by intensity

#### Scenario: Exercise values update when intensity changes
- **WHEN** the user adjusts the intensity slider
- **THEN** each displayed effective value updates immediately

#### Scenario: Session summary shows estimated duration instead of difficulty
- **WHEN** the user views the home page session summary card
- **THEN** the card displays selected count, rest time, and estimated duration
- **THEN** no difficulty indicator is shown

#### Scenario: Default intensity is 1.0
- **WHEN** the user opens the home page for the first time (or reloads)
- **THEN** the intensity slider starts at 1.0
