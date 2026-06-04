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

## REMOVED Requirements

### Requirement: Fessiers and dos muscle group keys
**Reason**: Unused in the user's training model; they add empty UI sections and clutter admin pickers.

**Migration**: On catalog load or import, any entry with `muscleGroup` `fessiers` or `dos` SHALL be normalized to `autre` (or rejected with a clear error — implementation MAY choose normalize-on-import). Remove entries from `MUSCLE_GROUPS`, `MuscleGroupKey`, and `MUSCLE_GROUP_COLORS` (or equivalent).

## MODIFIED Requirements

### Requirement: Muscle group catalog in admin
The system SHALL display and edit catalog exercises grouped by predefined `muscleGroup` keys on the **Exercices** tab only. Muscle groups are anatomical classifications distinct from trainings. Sections SHALL appear only for muscle groups that have at least one catalog entry.

#### Scenario: Catalog tab groups by muscle group
- **WHEN** the admin views the Exercices tab
- **THEN** exercises are rendered in sections per allowed `muscleGroup` with icons or labels
- **THEN** no training selector appears on this tab
- **THEN** no section is shown for removed keys `fessiers` or `dos`

#### Scenario: Entraînements tab groups training refs by muscle group
- **WHEN** the admin views the Entraînements tab for an active training
- **THEN** referenced exercises are grouped under the same `muscleGroup` sections derived from the global catalog
- **THEN** adding an exercise is scoped to the section's muscle group filter
