## MODIFIED Requirements

### Requirement: Training entity
The system SHALL store **trainings** (entraînements) as separate persisted records. Each training SHALL have `id`, `name`, `globalRestTime`, ordered `exerciseRefs` (`refId`, `exerciseId`, optional `value`, optional `series` only when overriding the catalog default with a value > 1), `createdAt`, and `updatedAt`. A training SHALL NOT embed a duplicate `exercises` catalog map. When `series` is omitted on a reference, the effective series count SHALL be the catalog default `series` or **1**.

#### Scenario: Load training
- **WHEN** a training file is loaded from persistent storage
- **THEN** it contains `exerciseRefs` as an array
- **THEN** it does not contain `config.exercises` or `config.groups`

### Requirement: Training admin in Entraînements tab
The system SHALL manage trainings from the **Entraînements** admin tab: list trainings, select active training, create via import, delete training, configure `globalRestTime`, add/remove catalog exercises to the training, edit per-reference value overrides, edit per-reference series count (only persisted when overriding catalog default with value > 1), and import/export training JSON.

#### Scenario: List and select trainings
- **WHEN** an authenticated admin opens the Entraînements tab
- **THEN** all trainings are listed with names
- **THEN** the admin can select one as the active training for the app session context

#### Scenario: Display exercises by muscle group
- **WHEN** the admin views the active training
- **THEN** referenced exercises are grouped and labeled by catalog `muscleGroup`
- **THEN** resolved name, type, and effective value come from the global catalog unless `value` is overridden on the ref
- **THEN** effective series comes from the reference override when present, otherwise from the catalog default, otherwise 1
- **THEN** a reference `series` override is indicated when it differs from the catalog default

#### Scenario: Edit reference value override
- **WHEN** the admin edits the value field for a training reference
- **THEN** the override is persisted on `exerciseRefs`
- **THEN** clearing the override restores the catalog default value

#### Scenario: Edit reference series count
- **WHEN** the admin sets the series field to an integer ≥ 2 that differs from inheriting the catalog default
- **THEN** `series` is persisted on that `exerciseRefs` entry
- **WHEN** the admin clears the reference series override
- **THEN** the `series` field is removed from persisted JSON and effective series reverts to the catalog default

#### Scenario: Add exercise to training from muscle group section
- **WHEN** the admin adds an exercise from a muscle-group section
- **THEN** a new `exerciseRefs` entry is appended with `exerciseId` from the global catalog and no `series` field
- **THEN** effective series immediately reflects the catalog default for that `exerciseId`
- **THEN** the training is persisted

#### Scenario: Remove exercise from training
- **WHEN** the admin removes a reference from the training
- **THEN** the matching `refId` entry is removed from `exerciseRefs`
- **THEN** the global catalog is unchanged

#### Scenario: Delete training
- **WHEN** the admin deletes a training
- **THEN** its persisted file is removed
- **THEN** the global catalog is unchanged
