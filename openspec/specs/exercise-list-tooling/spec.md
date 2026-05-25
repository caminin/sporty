## ADDED Requirements

### Requirement: create-exercise-list skill uses catalog format
The Cursor skill `create-exercise-list` SHALL document and generate JSON with `globalRestTime`, `exercises` (catalog map with `muscleGroup` on each entry), and `groups` (session group reference arrays: `refId`, `exerciseId`, optional `value`). It SHALL NOT generate embedded full exercise objects inside groups or reference `default-seed.json`. It SHALL document that `muscleGroup` is anatomical (e.g. `jambes`), distinct from session group names (e.g. *Explosivité jambes*).

#### Scenario: Skill documents v2 structure
- **WHEN** an agent reads `.cursor/skills/create-exercise-list/SKILL.md`
- **THEN** the required output shape includes `exercises` with `muscleGroup` and session group references
- **THEN** validation rules cover catalog entries and resolvable references
- **THEN** examples use `exercice_list/*.json` as templates

#### Scenario: Skill generates importable list file
- **WHEN** the user requests a new list via the skill
- **THEN** each catalog exercise is defined once in `exercises` with a valid `muscleGroup`
- **THEN** each session group lists references pointing to catalog ids
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
All committed templates under `exercice_list/` SHALL use the catalog + reference format with `muscleGroup` on each catalog entry. `app/exercises/default-seed.json` SHALL NOT exist.

#### Scenario: exercice_list files are valid v2
- **WHEN** a file in `exercice_list/` is loaded through import or used as a skill template
- **THEN** it contains `exercises` (with `muscleGroup`) and session group references
- **THEN** validation passes as native catalog + reference format
