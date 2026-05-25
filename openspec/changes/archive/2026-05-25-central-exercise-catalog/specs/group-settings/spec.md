## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL display an interface to manage exercise groups for the active list. Each group SHALL contain placements selected from the list exercise catalog. Users SHALL configure per-placement duration or reps (optional override); name and type SHALL be edited only in the catalog. The configuration SHALL include `exercises` (catalog), `groups` (references), and `globalRestTime`. Custom groups with icons and colors remain supported.

#### Scenario: View groups with catalog-backed exercises
- **WHEN** the user views the group settings page with an active list
- **THEN** each group displays resolved exercise names and effective values from catalog + references
- **THEN** users cannot create a new exercise inline in a group without selecting from the catalog

#### Scenario: Add exercise to group from catalog
- **WHEN** the user adds an exercise to a group
- **THEN** they pick from the list catalog (picker or list)
- **THEN** an optional override value may be set; if omitted, the catalog default applies

#### Scenario: Custom groups section
- **WHEN** the user views the group settings page
- **THEN** custom groups are displayed with names and icons
- **THEN** users can create, edit, and delete groups
- **THEN** exercises are added only via catalog selection

### Requirement: Export Settings as JSON
The system SHALL export the active list configuration as JSON including `globalRestTime`, `exercises` (catalog), and `groups` (references with optional overrides).

#### Scenario: Export configuration
- **WHEN** the user triggers the export action
- **THEN** the serialized JSON includes catalog and groups
- **THEN** custom group metadata (name, icon, color, creation date) is included
- **THEN** the format can be re-imported with catalog merge rules

## ADDED Requirements

### Requirement: Catalog management in list administration tab
The system SHALL provide catalog CRUD in the "Gestion des listes" tab for authenticated admins: create, edit, and delete catalog exercises for the selected list.

#### Scenario: Manage catalog from lists tab
- **WHEN** the admin opens the list management tab and selects a list
- **THEN** they can view and edit the exercise catalog for that list
- **THEN** deleting a catalog exercise used in a group is blocked with an explanatory message
