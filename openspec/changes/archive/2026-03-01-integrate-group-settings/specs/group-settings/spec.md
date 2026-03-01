## ADDED Requirements

### Requirement: Group Settings Routing
The system SHALL provide a route for accessing the group settings page under the badminton section.

#### Scenario: Navigate to group settings
- **WHEN** the user navigates to `/badminton/group-settings`
- **THEN** the group settings page is displayed

### Requirement: Group Settings UI Integration
The system SHALL display the group settings interface matching the "Exercise Group Settings" design, including settings for notifications, group privacy, and member management.

#### Scenario: View settings options
- **WHEN** the user views the group settings page
- **THEN** they should see options to configure the group priorities and details

### Requirement: Export Settings as JSON
The system SHALL provide a mechanism to export the current group settings state as a JSON string.

#### Scenario: Export configuration
- **WHEN** the user triggers the export action (e.g., clicks an "Export" button)
- **THEN** the settings state is serialized to JSON and copied to the clipboard or displayed out to the user

