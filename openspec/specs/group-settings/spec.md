## Requirement: Group Settings Routing
The system SHALL provide a route for accessing the group settings page under the badminton section.

#### Scenario: Navigate to group settings
- **WHEN** the user navigates to `/badminton/group-settings`
- **THEN** the group settings page is displayed

## Requirement: Group Settings UI Integration
The system SHALL provide the group settings admin page (`/group-settings`) with exactly two tabs: **Liste d'exercices** (catalog by muscle group, including catalog import/export) and **Listes de groupes** (session groups and lists, including groups import/export). The former **Import / Export** tab SHALL NOT exist. Each tab SHALL require admin authentication. The active exercise list selector SHALL be available in both tabs.

#### Scenario: Two tabs only
- **WHEN** an authenticated admin views the group settings page
- **THEN** exactly two tab controls are shown for catalog and session groups/lists
- **THEN** no third tab for import/export is shown
- **THEN** switching tabs does not expose legacy combined layouts or a dedicated I/O tab

#### Scenario: Catalog tab scope
- **WHEN** the admin selects the catalog tab
- **THEN** they manage the exercise catalog for the active list (CRUD including inline edit of default type and value, grouped by `muscleGroup`)
- **THEN** they can import and export catalog JSON (paste or file) from this tab
- **THEN** they can create a new list by providing a name and importing catalog JSON when no lists exist
- **THEN** session group editing and list deletion are not shown in this tab

#### Scenario: Groups tab scope
- **WHEN** the admin selects the groups tab
- **THEN** they can view and switch among all exercise lists
- **THEN** they can delete lists, set global rest time, edit or delete **existing** session groups (from imported data), and add or remove catalog exercises in groups
- **THEN** they can import and export session groups JSON (paste or file) for the active list from this tab
- **THEN** they cannot create new session groups from the UI
- **THEN** they cannot override per-placement duration or reps from the UI
- **THEN** catalog CRUD is not shown in this tab

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

## Requirement: Export Settings as JSON
The system SHALL export configuration in two separate JSON shapes: catalog export from the **Liste d'exercices** tab (`exercises` and optional `globalRestTime`) and groups export from the **Listes de groupes** tab (`groups` and optional `globalRestTime`). Combined full `WorkoutConfig` export from a dedicated tab SHALL NOT be offered in the admin UI.

#### Scenario: Export catalog from catalog tab
- **WHEN** the admin triggers catalog export on the catalog tab with an active list
- **THEN** the serialized JSON contains `exercises` with `muscleGroup` on each entry
- **THEN** the JSON does not require `groups` for a valid catalog export file

#### Scenario: Export groups from groups tab
- **WHEN** the admin triggers groups export on the groups tab with an active list
- **THEN** the serialized JSON contains session `groups` with reference shape only
- **THEN** custom group metadata (name, icon, color, creation date) is included per group

## Requirement: Global Rest Time Configuration
The system SHALL provide an input in the group settings page (groups tab) to configure a single, universal rest time (in seconds) that applies iteratively between all exercises.

#### Scenario: Configure rest time
- **WHEN** the user enters a new duration for the global rest time
- **THEN** the value is updated and saved for the active list under `globalRestTime`
