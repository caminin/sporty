## MODIFIED Requirements

### Requirement: Single global exercise catalog
The system SHALL persist exactly one exercise catalog for the entire application, independent of any training. The catalog SHALL be stored as a map keyed by exercise `id` with entries containing `id`, `name`, `type` (`time` or `reps`), default `value` (positive number), `muscleGroup` (`MuscleGroupKey`), and optional `series` (integer ≥ 2 only — omitted when effective series is 1).

#### Scenario: Load global catalog
- **WHEN** the application needs exercise definitions
- **THEN** it loads the global catalog from persistent storage
- **THEN** each entry satisfies the catalog exercise schema including `muscleGroup`
- **THEN** optional `series` on an entry is an integer ≥ 2 or absent

#### Scenario: Update catalog exercise
- **WHEN** the admin edits name, type, default value, muscle group, or default series of a catalog exercise
- **THEN** the global catalog entry is updated and persisted
- **THEN** all training placements referencing that `exerciseId` resolve with the updated definition on next load

#### Scenario: Export global catalog
- **WHEN** the admin triggers catalog export on the Exercices tab
- **THEN** JSON containing `exercises` with `muscleGroup` on each entry is offered
- **THEN** each exercise includes `series` only when greater than 1
- **THEN** the JSON does not contain training `exerciseRefs` or session `groups`
