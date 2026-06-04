## MODIFIED Requirements

### Requirement: Repository templates use catalog and training split
All committed files under `exercice_list/` SHALL use the split format only (`catalog.json` + `entrainement-*.json`). Monolithic files with `exercises` and `groups` SHALL NOT exist in the repository.

#### Scenario: exercice_list files are valid split format
- **WHEN** a file in `exercice_list/` is loaded through import or used as a skill template
- **THEN** `catalog.json` validates as global catalog-only JSON
- **THEN** each `entrainement-*.json` validates as training-only JSON with refs resolvable against `catalog.json`

#### Scenario: Two default trainings exist
- **WHEN** the repository is checked out
- **THEN** exactly two default training files exist besides `catalog.json`
- **THEN** their `name` fields are **Jambes** and **Haut du corps** respectively
- **THEN** file slugs MAY remain `entrainement-global` and `entrainement-dynamisme-jambes-mollets-core` for stable ids

## ADDED Requirements

### Requirement: Skill documents bundled training names
The `create-exercise-list` skill SHALL reference default training display names **Jambes** and **Haut du corps** and SHALL document deduplication and muscle-group reclassement when editing `catalog.json`.

#### Scenario: Skill names trainings in French
- **WHEN** an agent follows the skill to create default trainings
- **THEN** examples set `name` to **Jambes** or **Haut du corps**
- **THEN** examples do not use legacy labels « Global » or « Dynamisme jambes mollets core »

### Requirement: Skill lists allowed muscle groups only
The `create-exercise-list` skill SHALL document allowed `muscleGroup` values: `jambes`, `mollets`, `epaules`, `bras`, `abdos`, `pecs`, `autre`. It SHALL NOT reference `fessiers` or `dos`.

#### Scenario: Skill muscle group enum
- **WHEN** an agent reads the skill to edit `catalog.json`
- **THEN** the documented enum excludes `fessiers` and `dos`
