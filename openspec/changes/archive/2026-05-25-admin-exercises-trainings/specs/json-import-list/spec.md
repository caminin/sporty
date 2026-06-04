## MODIFIED Requirements

### Requirement: Import JSON to create list
The system SHALL allow admins to create a new **training** by importing training JSON (pasted or from file) from the **Entraînements** tab. The JSON MUST contain a valid `exerciseRefs` array. Every `exerciseId` MUST exist in the global catalog. Optional `globalRestTime` MAY be included. New trainings SHALL NOT be created from the Exercices tab.

#### Scenario: Import training from pasted JSON
- **WHEN** the admin pastes valid training JSON on the Entraînements tab and provides a training name when creating new
- **THEN** the system parses and validates `exerciseRefs` against the global catalog
- **THEN** a new training is created and selected as the active training

#### Scenario: Import training from file
- **WHEN** the admin selects a .json file via the Entraînements tab file input
- **THEN** the system reads the file, validates training format and catalog references
- **THEN** a new training is created or the active training is updated per admin choice

#### Scenario: No empty training creation in UI
- **WHEN** the admin opens the Entraînements tab with no trainings
- **THEN** no form to create a new training with only a name is shown
- **THEN** new trainings are created through successful training JSON import with a name or bundled reset

#### Scenario: Invalid JSON
- **WHEN** the admin provides malformed JSON (syntax error)
- **THEN** the system displays an error message indicating invalid JSON
- **THEN** no training is created or updated

#### Scenario: Invalid training structure
- **WHEN** the admin provides valid JSON but without a valid `exerciseRefs` array
- **THEN** the system displays an error message describing the validation failure
- **THEN** no training is created or updated

## MODIFIED Requirements

### Requirement: Import groups JSON on active list
The system SHALL allow admins to import global **catalog** JSON (pasted or from file) from the **Exercices** tab only. The JSON MUST contain a valid `exercises` object with `muscleGroup` on each entry (or defaulting to `autre`).

#### Scenario: Import catalog on Exercices tab
- **WHEN** the admin pastes valid catalog JSON on the Exercices tab
- **THEN** the system validates the `exercises` map
- **THEN** the global catalog is updated per replace or merge choice
- **THEN** trainings are unchanged except when replace validation fails due to orphan refs

#### Scenario: Import catalog without trainings depending on orphans
- **WHEN** replace-mode catalog import would orphan training references
- **THEN** import fails with an explicit validation error
- **THEN** the global catalog on disk is unchanged

#### Scenario: Invalid catalog structure
- **WHEN** catalog JSON is valid syntax but lacks a valid `exercises` map
- **THEN** the system displays an explicit validation error
- **THEN** the global catalog is unchanged

## REMOVED Requirements

### Requirement: Import groups JSON on active list (session groups)
**Reason**: Trainings use flat `exerciseRefs` grouped by `muscleGroup` in UI; session groups JSON is removed.
