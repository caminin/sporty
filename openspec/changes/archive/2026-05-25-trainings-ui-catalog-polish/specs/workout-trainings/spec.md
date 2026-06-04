## MODIFIED Requirements

### Requirement: Training admin in Entraînements tab
The system SHALL manage trainings from the **Entraînements** admin tab: list trainings, select active training, create via import, delete training, configure `globalRestTime`, add/remove catalog exercises to the training, edit per-reference value overrides, and import/export training JSON.

#### Scenario: List and select trainings
- **WHEN** an authenticated admin opens the Entraînements tab
- **THEN** all trainings are listed with names
- **THEN** the admin can select one as the active training for the app session context

#### Scenario: Display exercises by muscle group
- **WHEN** the admin views the active training
- **THEN** referenced exercises are grouped and labeled by catalog `muscleGroup`
- **THEN** resolved name, type, and effective value come from the global catalog unless `value` is overridden on the ref

#### Scenario: Edit reference value override
- **WHEN** the admin edits the value field for a training reference
- **THEN** the override is persisted on `exerciseRefs`
- **THEN** clearing the override restores the catalog default value

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

## ADDED Requirements

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
