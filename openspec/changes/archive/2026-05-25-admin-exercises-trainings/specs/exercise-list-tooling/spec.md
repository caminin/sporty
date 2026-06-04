## MODIFIED Requirements

### Requirement: Exercise list skill documents split files
The `create-exercise-list` agent skill SHALL document three file types under `exercice_list/`: global `catalog.json`, and per-training `entrainement-*.json` files containing `exerciseRefs` only (no embedded catalog).

#### Scenario: Skill references catalog file
- **WHEN** an agent follows the skill to add catalog exercises
- **THEN** examples use `exercice_list/catalog.json` for `exercises` with `muscleGroup`
- **THEN** examples do not duplicate catalog entries inside training files

#### Scenario: Skill references training files
- **WHEN** an agent creates or updates a default training
- **THEN** examples use `exercice_list/entrainement-<slug>.json` with `exerciseRefs` and optional `globalRestTime`
- **THEN** every `exerciseId` in refs exists in `catalog.json`

## MODIFIED Requirements

### Requirement: Repository templates use catalog and training split
All committed files under `exercice_list/` SHALL use the split format only (`catalog.json` + `entrainement-*.json`). Monolithic files with `exercises` and `groups` SHALL NOT exist in the repository.

#### Scenario: exercice_list files are valid split format
- **WHEN** a file in `exercice_list/` is loaded through import or used as a skill template
- **THEN** `catalog.json` validates as global catalog-only JSON
- **THEN** each `entrainement-*.json` validates as training-only JSON with refs resolvable against `catalog.json`

#### Scenario: Two default trainings exist
- **WHEN** the repository is checked out after this change
- **THEN** exactly two default training files exist besides `catalog.json` (global and dynamisme-jambes-mollets-core)
