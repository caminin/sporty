## REMOVED Requirements

### Requirement: Test coverage for explicit seed (partial scenarios)
**Reason**: `seedExerciseList` and `default-seed.json` are removed.
**Migration**: Tests create lists via `createTestConfig` or import JSON fixtures from `exercice_list/`.

#### Scenario: Initialisation sans lecture automatique du seed
**Reason**: Seed file no longer exists; scenario redundant with existing init tests.
**Migration**: Keep assertion that `initializeExerciseLists` does not auto-create lists.

#### Scenario: Gestion d'erreur de seed lors d'un import explicite
**Reason**: Seed API removed.
**Migration**: Remove test; cover empty list creation separately if needed.
