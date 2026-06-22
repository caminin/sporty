## MODIFIED Requirements

### Requirement: Exercise list skill documents split files
The `create-exercise-list` agent skill SHALL document three file types under `exercice_list/`: global `catalog.json`, and per-training `entrainement-*.json` files containing `exerciseRefs` only (no embedded catalog). Each catalog `exercises` entry MAY include optional `series` (integer ≥ 2 only; omitted when a single series). Each `exerciseRefs` entry MAY include optional `series` to override the catalog default (integer ≥ 2 only).

#### Scenario: Skill references catalog file
- **WHEN** an agent follows the skill to add catalog exercises
- **THEN** examples use `exercice_list/catalog.json` for `exercises` with `muscleGroup`
- **THEN** examples MAY include `series` on catalog entries when an exercise should default to multiple series
- **THEN** examples do not duplicate catalog entries inside training files

#### Scenario: Skill references training files
- **WHEN** an agent creates or updates a default training
- **THEN** examples use `exercice_list/entrainement-<slug>.json` with `exerciseRefs` and optional `globalRestTime`
- **THEN** every `exerciseId` in refs exists in `catalog.json`
- **THEN** examples include `series` on refs only when overriding the catalog default
