## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage 5 predefined exercise groups (Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements) and allow users to add exercises within each group.

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page
- **THEN** they see the 5 predefined exercise groups
- **WHEN** the user adds an exercise to a group
- **THEN** the exercise is appended to that specific group's list

### Requirement: Export Settings as JSON
The system SHALL provide a mechanism to export the exercises categorized by groups as a JSON object, formatted appropriately for an `exercices.json` file.

#### Scenario: Export configuration
- **WHEN** the user triggers the export action
- **THEN** the groups and their exercises are serialized into a JSON structure and copied to the clipboard or displayed to the user
