## ADDED Requirements

### Requirement: Training entity
The system SHALL store **trainings** (entraînements) as separate persisted records. Each training SHALL have `id`, `name`, `globalRestTime`, ordered `exerciseRefs` (`refId`, `exerciseId`, optional `value`), `createdAt`, and `updatedAt`. A training SHALL NOT embed a duplicate `exercises` catalog map.

#### Scenario: Load training
- **WHEN** a training file is loaded from persistent storage
- **THEN** it contains `exerciseRefs` as an array
- **THEN** it does not contain `config.exercises` or `config.groups`

### Requirement: Training admin in Entraînements tab
The system SHALL manage trainings from the **Entraînements** admin tab: list trainings, select active training, create via import, delete training, configure `globalRestTime`, add/remove catalog exercises to the training, and import/export training JSON.

#### Scenario: List and select trainings
- **WHEN** an authenticated admin opens the Entraînements tab
- **THEN** all trainings are listed with names
- **THEN** the admin can select one as the active training for the app session context

#### Scenario: Display exercises by muscle group
- **WHEN** the admin views the active training
- **THEN** referenced exercises are grouped and labeled by catalog `muscleGroup`
- **THEN** resolved name, type, and effective value come from the global catalog unless `value` is overridden on the ref

#### Scenario: Add exercise to training from muscle group section
- **WHEN** the admin adds an exercise from a muscle-group section
- **THEN** a new `exerciseRefs` entry is appended with `exerciseId` from the global catalog
- **THEN** the training is persisted

#### Scenario: Remove exercise from training
- **WHEN** the admin removes a reference from the training
- **THEN** the matching `refId` entry is removed from `exerciseRefs`
- **THEN** the global catalog is unchanged

#### Scenario: Delete training
- **WHEN** the admin deletes a training
- **THEN** its persisted file is removed
- **THEN** the global catalog is unchanged

### Requirement: Training JSON import and export
The system SHALL support training-only JSON with `exerciseRefs` (array) and optional `globalRestTime` on the Entraînements tab. Every `exerciseId` MUST exist in the global catalog before persist.

#### Scenario: Export active training
- **WHEN** the admin exports on the Entraînements tab with an active training
- **THEN** JSON contains `exerciseRefs` and optional `globalRestTime`
- **THEN** JSON does not duplicate catalog `exercises`

#### Scenario: Import training
- **WHEN** the admin imports valid training JSON with a name
- **THEN** a new training is created or the active training is updated per UI choice
- **THEN** all references are validated against the global catalog

#### Scenario: Reject orphan references on import
- **WHEN** imported training JSON references an `exerciseId` absent from the global catalog
- **THEN** import fails with an explicit error
- **THEN** no training file is partially updated
