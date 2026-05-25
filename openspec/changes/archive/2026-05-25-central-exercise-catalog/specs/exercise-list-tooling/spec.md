## ADDED Requirements

### Requirement: create-exercise-list skill uses catalog format
The Cursor skill `create-exercise-list` SHALL document and generate JSON with `globalRestTime`, `exercises` (catalog map), and `groups` containing reference arrays (`refId`, `exerciseId`, optional `value`). It SHALL NOT generate embedded full exercise objects inside groups.

#### Scenario: Skill documents v2 structure
- **WHEN** an agent reads `.cursor/skills/create-exercise-list/SKILL.md`
- **THEN** the required output shape includes `exercises` and group references
- **THEN** validation rules cover catalog entries and resolvable references
- **THEN** examples use `exercice_list/*.json` or seed files as v2 templates

#### Scenario: Skill generates importable list file
- **WHEN** the user requests a new list via the skill
- **THEN** each catalog exercise is defined once in `exercises`
- **THEN** each group lists references pointing to catalog ids
- **THEN** optional per-group `value` is only set when different from the catalog default

### Requirement: Test helpers produce v2 configs
Shared test utilities SHALL build `WorkoutConfig` objects in catalog + reference format for all exercise-list tests.

#### Scenario: createTestConfig includes catalog
- **WHEN** tests call `createTestConfig` or `createCustomTestConfig`
- **THEN** the returned config includes a populated `exercises` map
- **THEN** group entries are references resolvable against that catalog

#### Scenario: Test documentation matches format
- **WHEN** a developer reads `app/__tests__/README.md` or entity READMEs
- **THEN** helper usage describes the catalog + reference shape

### Requirement: Repository JSON templates are v2
All committed templates under `exercice_list/` and `app/exercises/default-seed.json` SHALL use the catalog + reference format so manual import and seed actions work without runtime migration on every file read.

#### Scenario: exercice_list files are valid v2
- **WHEN** a file in `exercice_list/` is loaded through import or used as a skill template
- **THEN** it contains `exercises` and group references
- **THEN** validation passes as native catalog + reference format
