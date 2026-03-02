## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage all exercise groups (both predefined and custom) and allow users to manage exercises, configuring each by type ("reps" or "time") and value (count or duration in seconds). The overall configuration, including exercises and a global rest time, SHALL be saved and populated from `exercises.json`.

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page
- **THEN** they see all exercise groups (predefined and custom) populated with their data
- **WHEN** the user adds an exercise specifying it is a "time" based exercise of 45 seconds
- **THEN** the complex exercise object is appended to the specific group's list in the UI and configuration

### Requirement: Export Settings as JSON
The system SHALL provide a mechanism to export all exercises categorized by groups (including custom groups) as a JSON object, formatted appropriately for an `exercises.json` file.

#### Scenario: Export configuration
- **WHEN** the user triggers the export action
- **THEN** all groups (predefined and custom) and their exercises are serialized into a JSON structure and copied to the clipboard or displayed to the user