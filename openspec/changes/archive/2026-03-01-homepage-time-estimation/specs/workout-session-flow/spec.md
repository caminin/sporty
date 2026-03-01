## ADDED

### Requirement: Session Start Never Begins With Rest
The system SHALL guarantee that the first step of any workout session built by `buildSessionSteps` is always a work step, never a rest step.

#### Scenario: Session construction starts with exercise
- **WHEN** `buildSessionSteps` is called with a non-empty WorkoutConfig
- **THEN** the first step in the returned array has `kind === "work"`
- **THEN** rest steps only appear between work steps (not before the first or after the last)