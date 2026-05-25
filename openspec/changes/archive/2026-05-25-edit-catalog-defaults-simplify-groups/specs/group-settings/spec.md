## MODIFIED Requirements

### Requirement: Group Settings UI Integration
The system SHALL provide the group settings admin page (`/group-settings`) with exactly three tabs: **Liste d'exercices** (catalog by muscle group), **Listes de groupes** (session groups and lists), and **Import / Export**. No other admin tabs SHALL remain. Each tab SHALL require admin authentication. The active exercise list selector SHALL be available in the catalog and groups tabs.

#### Scenario: Three tabs only
- **WHEN** an authenticated admin views the group settings page
- **THEN** exactly three tab controls are shown for catalog, session groups/lists, and import/export
- **THEN** switching tabs does not expose legacy combined layouts

#### Scenario: Catalog tab scope
- **WHEN** the admin selects the catalog tab
- **THEN** they manage the exercise catalog for the active list (CRUD including inline edit of default type and value, grouped by `muscleGroup`)
- **THEN** session group editing and list deletion are not shown in this tab

#### Scenario: Groups tab scope
- **WHEN** the admin selects the groups tab
- **THEN** they can view and switch among all exercise lists
- **THEN** they can delete lists, set global rest time, edit or delete **existing** session groups (from imported data), and add or remove catalog exercises in groups
- **THEN** they cannot create new session groups from the UI
- **THEN** they cannot override per-placement duration or reps from the UI
- **THEN** catalog CRUD and import/export are not shown in this tab

#### Scenario: Import export tab scope
- **WHEN** the admin selects the import/export tab
- **THEN** they can import JSON (paste or file) and export the active list configuration
- **THEN** they cannot create an empty list from a form in this tab
- **THEN** group and catalog editing controls are not shown in this tab

#### Scenario: View groups with catalog-backed exercises
- **WHEN** the admin views the groups tab with an active list
- **THEN** each session group displays exercises grouped by catalog `muscleGroup` in the same order and labels as the catalog tab
- **THEN** resolved names, types, and values come from the catalog (no admin override controls)
- **THEN** users add exercises only via a picker scoped to the muscle-group section they are adding from

#### Scenario: Custom groups section without creation UI
- **WHEN** the admin views the groups tab
- **THEN** existing session groups are displayed with names and icons
- **THEN** no form to create a new session group is shown
- **THEN** exercises are added only via catalog selection filtered to the active muscle-group section
