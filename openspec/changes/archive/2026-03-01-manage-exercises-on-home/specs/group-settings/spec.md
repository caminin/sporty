## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage 5 predefined exercise groups (Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements) and allow users to manage exercises, configuring each by type ("reps" or "time") and value (count or duration in seconds). The overall configuration, including exercises and a global rest time, SHALL be saved and populated from `exercises.json`.

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page
- **THEN** they see the 5 predefined exercise groups populated with default data from `exercises.json`
- **WHEN** the user adds an exercise specifying it is a "time" based exercise of 45 seconds
- **THEN** the complex exercise object is appended to the specific group's list in the UI and configuration

## ADDED Requirements

### Requirement: Global Rest Time Configuration
The system SHALL provide an input in the group settings page to configure a single, universal rest time (in seconds) that applies iteratively between all exercises.

#### Scenario: Configure rest time
- **WHEN** the user enters a new duration for the global rest time
- **THEN** the value is updated and saved synchronously in `exercises.json` under the `globalRestTime` key
