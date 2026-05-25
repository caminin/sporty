## MODIFIED Requirements

### Requirement: Home Page Exercise List Display

The system SHALL display all group placements from the active list on the home page, organized by group. Each row SHALL show the resolved exercise name, type, and **effective** value (catalog default or group override) without any global multiplier. The session summary card SHALL display: number of selected placements, rest time per exercise, and estimated session duration. The system SHALL NOT display a global intensity slider or difficulty indicator.

#### Scenario: View grouped exercises

- **WHEN** the user navigates to the home page with an active list
- **THEN** they see resolved placements organized by group
- **THEN** each placement displays name, type, and effective value (not scaled)

#### Scenario: Session summary shows exercise count, rest, and duration

- **WHEN** the user views the home page session summary card
- **THEN** the card displays selected count, rest time per exercise, and estimated duration
- **THEN** no intensity slider and no difficulty indicator are shown
