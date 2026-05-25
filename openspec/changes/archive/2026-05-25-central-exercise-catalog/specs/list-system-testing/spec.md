## MODIFIED Requirements

### Requirement: Test utilities for exercise lists
The list system test suite SHALL use shared helpers that build and assert on WorkoutConfig in catalog + reference format. Tests that construct groups with embedded exercise objects SHALL be updated to use catalog entries and group references.

#### Scenario: Helpers create valid v2 configs
- **WHEN** tests use `createTestConfig`, `createCustomTestConfig`, or `createTrackedTestList`
- **THEN** `config.exercises` is present and group placements are references
- **THEN** validation tests in `data-validation.test.ts` assert catalog and reference integrity

#### Scenario: Invalid format is rejected
- **WHEN** tests load or import config without `exercises` or with embedded group exercises
- **THEN** validation fails with an explicit error
- **THEN** no silent conversion occurs
