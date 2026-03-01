## ADDED Requirements

### Requirement: Session Exercise Selection on Home Page
The system SHALL allow the user to select which exercises from the catalogue to include in the current workout session, directly from the home page.

#### Scenario: View all exercises with selection state
- **WHEN** the user opens the home page
- **THEN** all exercises from `exercises.json` are displayed, grouped by their group
- **THEN** each exercise shows a checkbox or toggle indicating whether it is selected for the session

#### Scenario: Toggle exercise selection
- **WHEN** the user taps/clicks on an exercise's toggle
- **THEN** the exercise selection state is toggled (selected ↔ deselected)
- **THEN** the session summary counter updates to reflect the new number of selected exercises

#### Scenario: Launch session with selected exercises only
- **WHEN** the user taps "Lancer la séance"
- **THEN** only the exercises that are currently selected are passed to the timer
- **THEN** deselected exercises are not included in the session

#### Scenario: Default selection (no saved state)
- **WHEN** the user opens the home page for the first time (no localStorage data)
- **THEN** all exercises are selected by default

### Requirement: Persist Selection in localStorage
The system SHALL persist the exercise selection across page reloads and app restarts using the browser's localStorage.

#### Scenario: Save selection on change
- **WHEN** the user toggles an exercise
- **THEN** the updated selection is saved to localStorage under key `sporty_session_selection`

#### Scenario: Restore selection on load
- **WHEN** the user opens or reloads the home page
- **THEN** the previously saved selection is restored from localStorage
- **THEN** exercises that were selected remain selected, and deselected ones remain deselected

#### Scenario: Stale IDs in localStorage
- **WHEN** an exercise has been deleted from the catalogue (via Settings) but its ID remains in localStorage
- **THEN** that ID is silently ignored — it does not cause an error or display anything

## REMOVED Requirements

### Requirement: Edit Exercise List on Home Page
**Reason**: Exercise creation and deletion are now restricted to Settings (`/group-settings`) to maintain a clear separation between catalogue management and session configuration.
**Migration**: Users must navigate to `/group-settings` to add or remove exercises from the catalogue.
