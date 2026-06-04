## ADDED Requirements

### Requirement: Allowed muscle group keys
The system SHALL support exactly these `MuscleGroupKey` values: `jambes`, `mollets`, `epaules`, `bras`, `abdos`, `pecs`, and `autre`. Keys `fessiers` and `dos` SHALL NOT exist in types, admin selectors, color mappings, or bundled catalog data.

#### Scenario: Admin muscle group picker excludes removed keys
- **WHEN** the admin creates or edits a catalog exercise
- **THEN** the muscle group dropdown lists only the allowed keys
- **THEN** `fessiers` and `dos` are not offered

#### Scenario: Granular leg muscle classification
- **WHEN** lower-body exercises are classified in the bundled catalog
- **THEN** dynamism and general leg work use `jambes`
- **THEN** calf-specific work uses `mollets`

#### Scenario: Homepage shows separate leg sections
- **WHEN** a training contains exercises in mollets and jambes groups
- **THEN** the homepage renders separate blocks for each non-empty muscle group

### Requirement: Autre muscle group as invisible fallback
The **autre** `muscleGroup` key SHALL remain for legacy or invalid values after normalization. Admin and homepage sections for **autre** SHALL only render when at least one catalog exercise uses that key.

#### Scenario: Empty autre section hidden
- **WHEN** no catalog exercise has `muscleGroup` **autre**
- **THEN** no **Autre** section appears on the Exercices tab, Entraînements tab, or homepage

### Requirement: Muscle group catalog in admin
The system SHALL display and edit catalog exercises grouped by predefined `muscleGroup` keys on the **Exercices** tab only. Muscle groups are anatomical classifications distinct from trainings. On the **Exercices** tab, sections SHALL appear only for muscle groups that have at least one catalog entry. On the **Entraînements** tab, sections SHALL appear for all allowed `MuscleGroupKey` values so admins can add an exercise even when a group is currently empty in the active training.

#### Scenario: Catalog tab groups by muscle group
- **WHEN** the admin views the Exercices tab
- **THEN** exercises are rendered in sections per allowed `muscleGroup` with icons or labels
- **THEN** no training selector appears on this tab
- **THEN** no section is shown for removed keys `fessiers` or `dos`

#### Scenario: Entraînements tab groups training refs by muscle group
- **WHEN** the admin views the Entraînements tab for an active training
- **THEN** training references are displayed under their matching `muscleGroup` sections derived from the global catalog
- **THEN** sections for allowed groups without exercises are still rendered
- **THEN** adding an exercise is scoped to the section's muscle group filter

#### Scenario: Add first exercise in an empty group
- **WHEN** a muscle-group section has zero exercises in the active training
- **THEN** the section still exposes the add-exercise control for that group
- **THEN** selecting an exercise from that control adds the first reference in the same group
