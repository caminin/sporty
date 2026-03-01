## ADDED Requirements

### Requirement: Timer UI Structure
The system MUST display a full-screen timer view with a dark theme by default, using the 'Lexend' font. It MUST show the current exercise name (e.g., "Shadow Footwork"), its subcategory/group (e.g., "Group 2 - Speed"), and a large, horizontally-centered numerical countdown timer.

#### Scenario: User views the timer page
- **WHEN** the user navigates to the timer session view
- **THEN** they see the exercise details, a massive countdown timer, and control buttons.

### Requirement: Interval Visual States (Work vs Rest)
The system MUST clearly visually distinguish between a "work" interval and a "rest" interval. The background color MUST change dynamically based on the state. For instance, the "work" state MUST use a specific background color (e.g., Emerald 500 equivalent) and the "rest" state MUST use another background color (e.g., Blue 500 equivalent). The label text indicating the current phase (e.g., "Work Interval" or "Rest Phase") MUST update accordingly.

#### Scenario: Timer transitions to a rest interval
- **WHEN** the work interval countdown reaches 0 and a rest interval begins
- **THEN** the background color smoothly transitions, and the interval label changes to indicate it is a rest period.

### Requirement: Timer Controls
The system MUST provide fixed playback controls at the bottom of the screen. These controls MUST include at least a primary "Passer" (Skip) button to advance to the next interval or exercise, and a secondary "Stop" button to end or pause the session.

#### Scenario: User skips the current interval
- **WHEN** the user taps the "Passer" (Skip next) button
- **THEN** the timer immediately stops the current countdown and transitions to the subsequent interval or exercise in the plan.

### Requirement: Audio/Volume Controls
The system MUST provide an audio toggle/volume control button in the top-right header area.

#### Scenario: User toggles audio
- **WHEN** the user clicks the volume button
- **THEN** the audio feedback for countdown ticks and interval changes is toggled on or off.
