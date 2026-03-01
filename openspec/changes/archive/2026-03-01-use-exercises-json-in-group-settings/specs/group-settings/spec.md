## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage 5 predefined exercise groups (Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements) and allow users to add exercises within each group. The initial state of these groups SHALL be populated by default from `exercises.json`.

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page
- **THEN** they see the 5 predefined exercise groups populated with default data from `exercises.json`
- **WHEN** the user adds an exercise to a group
- **THEN** the exercise is appended to that specific group's list
