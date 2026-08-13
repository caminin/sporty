## ADDED Requirements

### Requirement: Per-training exercise selection persistence
The system SHALL persist the user's checked exercise selection in client storage **scoped by active training id** (`selectedListId`). Each training MUST have its own independent selection state.

#### Scenario: Selection restored when switching back to a training
- **WHEN** the user has toggled exercises for training A
- **AND** the user switches to training B and toggles different exercises
- **AND** the user switches back to training A
- **THEN** the homepage restores the selection previously saved for training A
- **THEN** the selection for training B is unchanged when returning to B

#### Scenario: Default all checked for unseen training
- **WHEN** the user selects a training that has no saved selection entry
- **THEN** all exercises in that training's pool are checked by default

#### Scenario: Legacy flat array ignored safely
- **WHEN** client storage contains the legacy flat array format under `sporty_session_selection`
- **THEN** the system does not throw
- **THEN** the homepage defaults to all exercises checked for the active training
