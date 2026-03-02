## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage exercise groups. All groups are user-created (custom groups) with name and icon. The interface SHALL provide a single tab "Groupes d'exercices" for creating, editing, and managing groups and their exercises. Each exercise is configured by type ("reps" or "time") and value (count or duration in seconds). The configuration, including groups and global rest time, SHALL be saved and populated from the list storage. There are no predefined groups.

#### Scenario: View groups (empty state)
- **WHEN** the user views the group settings page and the list has no groups
- **THEN** an empty state is displayed with a form to create the first group and add its first exercise

#### Scenario: View and add exercises to groups
- **WHEN** the user views the group settings page and groups exist
- **THEN** they see all user-created groups with their names and icons
- **WHEN** the user adds an exercise specifying it is a "time" based exercise of 45 seconds to a group
- **THEN** the exercise object is appended to the group's list in the UI and configuration

#### Scenario: Single tab for groups
- **WHEN** the user views the group settings page
- **THEN** exactly two tabs are displayed: "Groupes d'exercices" and "Gestion des listes"
- **THEN** the "Groupes d'exercices" tab contains both the creation of new groups and the management of existing groups (no separate tab for custom groups)

### Requirement: Export Settings as JSON
The system SHALL provide a mechanism to export the exercises categorized by groups as a JSON object, formatted appropriately for the configuration format, including all groups.

#### Scenario: Export configuration
- **WHEN** the user triggers the export action
- **THEN** the groups and their exercises are serialized into a JSON structure and copied to the clipboard or displayed to the user
- **THEN** all groups are included in the export with their metadata (name, icon, creation date)

## REMOVED Requirements

### Requirement: Predefined exercise groups
**Reason**: The user wants only custom groups; predefined groups are removed.
**Migration**: Users create their own groups via the "Groupes d'exercices" tab.
