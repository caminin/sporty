## ADDED Requirements

### Requirement: Skip preserves next step timer
When the user skips the current step, the next step's countdown MUST start with the correct duration for that step. The timer MUST NOT inherit or reuse the remaining time from the previous step.

#### Scenario: Skip from work to rest - correct rest duration
- **WHEN** the user taps "Passer" during a work step (e.g. 45s exercise with 20s remaining)
- **AND** the next step is a rest of 30s
- **THEN** the rest countdown MUST start at 30s (not 20s or any other value)

#### Scenario: Skip from rest to work - correct exercise duration
- **WHEN** the user taps "Passer" during a rest step (e.g. 30s rest with 10s remaining)
- **AND** the next step is a work exercise of 45s
- **THEN** the work countdown MUST start at 45s (not 10s or any other value)

#### Scenario: Skip from work to work (via preparation) - correct next exercise duration
- **WHEN** the user taps "Passer" during a work step
- **AND** the next step is another work exercise
- **THEN** after the preparation phase (or when skipping preparation), the next exercise countdown MUST start at its configured duration
