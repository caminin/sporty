## ADDED Requirements

### Requirement: Import JSON action in list management
The system SHALL expose an "Importer JSON" action in the group-settings page, within the "Gestion des listes" tab, when the user is authenticated as admin. This action SHALL allow creating a new list from imported JSON (paste or file).

#### Scenario: Import UI visible in lists tab
- **WHEN** the user navigates to the group-settings page and selects the "Gestion des listes" tab
- **THEN** an "Importer JSON" section or button is visible (alongside "Créer une nouvelle liste")
- **THEN** the user can paste JSON or select a file to import
