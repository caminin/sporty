## MODIFIED Requirements

### Requirement: Group Settings UI Integration
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
