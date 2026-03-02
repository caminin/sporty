## MODIFIED Requirements

### Requirement: Session Start Never Begins With Rest
The system SHALL guarantee that the first step of any workout session built by `buildSessionSteps` is always a work step, never a rest step. Before each work step (except the first one), the system SHALL display a preparation screen with a 5-second countdown.

#### Scenario: Session construction starts with exercise
- **WHEN** `buildSessionSteps` is called with a non-empty WorkoutConfig
- **THEN** the first step in the returned array has `kind === "work"`
- **THEN** rest steps only appear between work steps (not before the first or after the last)

#### Scenario: Preparation phase before work steps
- **WHEN** a work step follows another step (rest or work)
- **THEN** a 5-second preparation countdown MUST be displayed before the work step begins
- **THEN** the preparation screen MUST show the upcoming exercise name and group

#### Scenario: First exercise starts immediately
- **WHEN** the session begins with the first work step
- **THEN** no preparation countdown is shown and the exercise starts immediately

#### Scenario: Preparation can be skipped
- **WHEN** the user is in the preparation phase
- **THEN** they MUST be able to skip the countdown and start the exercise immediately