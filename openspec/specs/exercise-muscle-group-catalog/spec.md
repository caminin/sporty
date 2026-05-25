## ADDED Requirements

### Requirement: Predefined muscle groups
The system SHALL define a fixed set of muscle groups (`MuscleGroupKey`) for catalog classification only — anatomical / functional targets (e.g. *Split step rapide* → `jambes`). Each key SHALL have a French display label and icon for UI rendering. This is distinct from session **groups** (`WorkoutConfig.groups`, e.g. *Explosivité jambes*), which organize exercises during a workout.

Allowed keys: `jambes`, `mollets`, `fessiers`, `dos`, `epaules`, `bras`, `abdos`, `pecs`, `autre`.

#### Scenario: Muscle group registry available
- **WHEN** the admin catalog tab or validation layer needs muscle group metadata
- **THEN** a single registry maps each allowed key to `label` and `icon`
- **THEN** unknown keys are rejected on save

#### Scenario: Distinct from session groups
- **WHEN** an exercise has `muscleGroup: "jambes"` in the catalog
- **THEN** it may appear in any session group (e.g. *Cardio endurance*, *Explosivité jambes*) via group references
- **THEN** changing session group membership does not change `muscleGroup`

### Requirement: Muscle group field on catalog entries
Each `ExerciseDefinition` in `WorkoutConfig.exercises` SHALL include a required `muscleGroup` field of type `MuscleGroupKey`.

#### Scenario: Catalog entry includes muscle group
- **WHEN** a catalog exercise is created or loaded from a valid list
- **THEN** the entry contains `id`, `name`, `type`, `value`, and `muscleGroup`
- **THEN** `muscleGroup` is one of the predefined keys

#### Scenario: Import assigns default muscle group when missing
- **WHEN** imported JSON catalog entries omit `muscleGroup`
- **THEN** each entry receives `muscleGroup: "autre"` before persistence
- **THEN** the admin can reassign the muscle group in the catalog tab

### Requirement: Catalog tab grouped by muscle group
The admin "Liste d'exercices" tab SHALL display catalog exercises grouped by `muscleGroup`, sorted in registry order, with the muscle group icon and label as section headers (UI label: « Groupe musculaire »).

#### Scenario: View exercises by muscle group
- **WHEN** the admin opens the catalog tab with an active list
- **THEN** exercises appear under their muscle group section with the section icon visible
- **THEN** empty muscle groups are omitted from the layout

#### Scenario: Create exercise with muscle group
- **WHEN** the admin creates a catalog exercise from the catalog tab
- **THEN** they MUST select a muscle group before submission
- **THEN** the new entry is persisted with the chosen `muscleGroup`
