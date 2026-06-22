## ADDED Requirements

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

### Requirement: Training JSON import and export
The system SHALL support training-only JSON with `exerciseRefs` (array; `series` only when > 1) and optional `globalRestTime` on the Entraînements tab. Every `exerciseId` MUST exist in the global catalog before persist.

#### Scenario: Export active training
- **WHEN** the admin exports on the Entraînements tab with an active training
- **THEN** JSON contains `exerciseRefs` and optional `globalRestTime`
- **THEN** JSON does not duplicate catalog `exercises`
- **THEN** exported refs include `series` only when greater than 1

#### Scenario: Import training
- **WHEN** the admin imports valid training JSON with a name
- **THEN** a new training is created or the active training is updated per UI choice
- **THEN** all references are validated against the global catalog
- **THEN** optional `series` on each ref is validated as integer ≥ 2, or omitted for single series

#### Scenario: Reject orphan references on import
- **WHEN** imported training JSON references an `exerciseId` absent from the global catalog
- **THEN** import fails with an explicit error
- **THEN** no training file is partially updated

### Requirement: Default bundled training names
The two default bundled trainings SHALL display the French names **Jambes** and **Haut du corps** respectively. Their `exerciseRefs` SHALL reflect the intended split: lower-body focused vs upper-body and core, using the deduplicated catalog ids.

#### Scenario: Bundled training Jambes
- **WHEN** the bundled lower-body training is loaded
- **THEN** its `name` is **Jambes**
- **THEN** its exercises emphasize legs, calves, and dynamism (not full upper-body staples)

#### Scenario: Bundled training Haut du corps
- **WHEN** the bundled upper-body training is loaded
- **THEN** its `name` is **Haut du corps**
- **THEN** its exercises include pecs, arms (including curl variants), and abs as present in the bundled catalog
