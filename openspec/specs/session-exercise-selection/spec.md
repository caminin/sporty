### Requirement: Session Exercise Selection on Home Page

The system SHALL allow the user to select which group placements (`refId`) to include in the current workout session from the home page.

#### Scenario: View all exercises with selection state

- **WHEN** the user opens the home page
- **THEN** all resolved placements are displayed, grouped by their group
- **THEN** each placement shows a checkbox or toggle for session selection

#### Scenario: Toggle exercise selection

- **WHEN** the user toggles a placement
- **THEN** selection state toggles by `refId`
- **THEN** the session summary counter updates

#### Scenario: Launch session with selected exercises only

- **WHEN** the user taps "Lancer la séance"
- **THEN** only selected placements are passed to the timer
- **THEN** encoded steps use effective values without intensity scaling

#### Scenario: Default selection (no saved state)

- **WHEN** the user opens the home page for the first time (no localStorage data)
- **THEN** all placements are selected by default

### Requirement: Persist Selection in localStorage

The system SHALL persist placement selection (`refId` set) across reloads under key `sporty_session_selection`.

#### Scenario: Save selection on change

- **WHEN** the user toggles a placement
- **THEN** the updated `refId` set is saved to localStorage

#### Scenario: Restore selection on load

- **WHEN** the user opens or reloads the home page
- **THEN** previously saved `refId` selections are restored

#### Scenario: Stale IDs in localStorage

- **WHEN** a `refId` no longer exists in the active list config
- **THEN** that id is silently ignored
