## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL provide the group settings admin page (`/group-settings`) with exactly three tabs: **Liste d'exercices** (catalog by muscle group), **Listes de groupes** (session groups and lists), and **Import / Export**. No other admin tabs SHALL remain. Each tab SHALL require admin authentication. The active exercise list selector SHALL be available in the catalog and groups tabs.

#### Scenario: Three tabs only
- **WHEN** an authenticated admin views the group settings page
- **THEN** exactly three tab controls are shown for catalog, session groups/lists, and import/export
- **THEN** switching tabs does not expose legacy combined layouts

#### Scenario: Catalog tab scope
- **WHEN** the admin selects the catalog tab
- **THEN** they manage the exercise catalog for the active list (CRUD, grouped by `muscleGroup`)
- **THEN** session group editing and list deletion are not shown in this tab

#### Scenario: Groups tab scope
- **WHEN** the admin selects the groups tab
- **THEN** they can view and switch among all exercise lists
- **THEN** they can delete lists, set global rest time, create/edit/delete **session groups**, and add/remove catalog exercises in groups with optional value overrides
- **THEN** catalog CRUD and import/export are not shown in this tab

#### Scenario: Import export tab scope
- **WHEN** the admin selects the import/export tab
- **THEN** they can create a new list, import JSON (paste or file), and export the active list configuration
- **THEN** group and catalog editing controls are not shown in this tab

#### Scenario: View groups with catalog-backed exercises
- **WHEN** the admin views the groups tab with an active list
- **THEN** each session group displays resolved exercise names and effective values from catalog + references
- **THEN** users add exercises to session groups only via catalog picker

#### Scenario: Custom groups section
- **WHEN** the admin views the groups tab
- **THEN** session groups are displayed with names and icons
- **THEN** admins can create, edit, and delete session groups
- **THEN** exercises are added only via catalog selection

## REMOVED Requirements

### Requirement: Catalog management in list administration tab
**Reason**: Catalog CRUD moved to dedicated "Liste d'exercices" tab.
**Migration**: Use the catalog tab for all catalog operations.

### Requirement: Import JSON action in list management
**Reason**: Import moved to dedicated "Import / Export" tab.
**Migration**: Use the import/export tab for JSON import.
