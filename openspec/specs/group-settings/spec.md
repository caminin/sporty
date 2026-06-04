## Requirement: Group Settings Routing
The system SHALL provide a route for accessing the group settings page under the badminton section.

#### Scenario: Navigate to group settings
- **WHEN** the user navigates to `/badminton/group-settings`
- **THEN** the group settings page is displayed

## Requirement: Group Settings UI Integration
The system SHALL provide the group settings admin page (`/group-settings`) with exactly two tabs: **Exercices** (global catalog by muscle group, catalog import/export) and **Entraînements** (trainings list, active training, exercises grouped by `muscleGroup`, training import/export, reset to bundled defaults). Each tab SHALL require admin authentication. The active training selector SHALL appear only on the **Entraînements** tab.

#### Scenario: Two tabs only
- **WHEN** an authenticated admin views the group settings page
- **THEN** exactly two tab controls are shown: Exercices and Entraînements
- **THEN** no third tab for import/export is shown
- **THEN** switching tabs does not expose list-scoped catalog editing on the Exercices tab

#### Scenario: Exercices tab scope
- **WHEN** the admin selects the Exercices tab
- **THEN** they manage the global exercise catalog (CRUD including inline edit of default type and value, grouped by `muscleGroup`)
- **THEN** exercise names in the list are displayed with enough width to read full titles (no single-line truncate on the primary name label)
- **THEN** they can import and export global catalog JSON from this tab
- **THEN** no training selector, training deletion, or training exercise editing is shown

#### Scenario: Entraînements tab scope
- **WHEN** the admin selects the Entraînements tab
- **THEN** they can view and switch among all trainings
- **THEN** they can delete trainings, set global rest time for the active training, and add or remove catalog exercises in the active training
- **THEN** they can edit the effective value per training reference (override with reset to catalog default)
- **THEN** exercises in the active training are displayed grouped by catalog `muscleGroup`
- **THEN** they can import and export training JSON for the active training
- **THEN** they can trigger **Réinitialiser** to restore bundled catalog and default trainings
- **THEN** global catalog CRUD is not shown in this tab

#### Scenario: View training with catalog-backed exercises
- **WHEN** the admin views the Entraînements tab with an active training
- **THEN** each muscle-group section displays exercises with resolved names, types, and values from the global catalog
- **THEN** users add exercises only via a picker scoped to the muscle-group section they are adding from

## Requirement: Export Settings as JSON
The system SHALL export configuration in two separate JSON shapes: global **catalog** export from the **Exercices** tab (`exercises` only) and **training** export from the **Entraînements** tab (`exerciseRefs` and optional `globalRestTime`). Combined full `WorkoutConfig` export from admin UI SHALL NOT be offered.

#### Scenario: Export catalog from Exercices tab
- **WHEN** the admin triggers catalog export on the Exercices tab
- **THEN** the serialized JSON contains `exercises` with `muscleGroup` on each entry
- **THEN** the JSON does not contain `exerciseRefs` or session `groups`

#### Scenario: Export training from Entraînements tab
- **WHEN** the admin triggers training export on the Entraînements tab with an active training
- **THEN** the serialized JSON contains `exerciseRefs` with reference shape only
- **THEN** the JSON does not duplicate catalog `exercises`

## Requirement: Global Rest Time Configuration
The system SHALL provide an input in the **Entraînements** tab to configure a single rest time (in seconds) for the active training that applies iteratively between all exercises in that training.

#### Scenario: Configure rest time
- **WHEN** the user enters a new duration for the global rest time on the Entraînements tab
- **THEN** the value is updated and saved on the active training as `globalRestTime`
