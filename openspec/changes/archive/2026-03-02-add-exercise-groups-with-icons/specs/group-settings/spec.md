## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage 5 predefined exercise groups (Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements) and allow users to manage exercises, configuring each by type ("reps" or "time") and value (count or duration in seconds). The overall configuration, including exercises and a global rest time, SHALL be saved and populated from `exercises.json`. The interface SHALL also include a separate section for managing custom exercise groups with icons.

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page
- **THEN** they see the 5 predefined exercise groups populated with default data from `exercises.json`
- **WHEN** the user adds an exercise specifying it is a "time" based exercise of 45 seconds
- **THEN** the complex exercise object is appended to the specific group's list in the UI and configuration

#### Scenario: Custom groups section
- **WHEN** the user views the group settings page
- **THEN** a separate section or tab for custom groups is available
- **THEN** custom groups are displayed with their names and associated icons
- **THEN** users can create, edit, and delete custom groups in this section

### Requirement: Export Settings as JSON
The system SHALL provide a mechanism to export the exercises categorized by groups as a JSON object, formatted appropriately for an `exercices.json` file, including both predefined and custom groups.

#### Scenario: Export configuration
- **WHEN** the user triggers the export action
- **THEN** the groups and their exercises are serialized into a JSON structure and copied to the clipboard or displayed to the user
- **THEN** both predefined groups and custom groups are included in the export
- **THEN** custom groups include their metadata (name, icon, creation date)