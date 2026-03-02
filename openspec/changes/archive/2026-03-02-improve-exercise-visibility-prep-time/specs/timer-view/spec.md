## MODIFIED Requirements

### Requirement: Timer UI Structure
The system MUST display a full-screen timer view with a dark theme by default, using the 'Lexend' font. It MUST show the current exercise name (e.g., "Shadow Footwork"), its subcategory/group (e.g., "Group 2 - Speed"), and a large, horizontally-centered numerical countdown timer. During transitions between exercises, the system MUST display an enhanced preview of the upcoming exercise with improved visibility.

#### Scenario: User views the timer page
- **WHEN** the user navigates to the timer session view
- **THEN** they see the exercise details, a massive countdown timer, and control buttons.

#### Scenario: Enhanced next exercise preview
- **WHEN** the current exercise is running
- **THEN** the upcoming exercise name and group MUST be displayed more prominently than before
- **THEN** the preview MUST be positioned to draw attention without interfering with current exercise focus

### Requirement: Interval Visual States (Work vs Rest)
The system MUST clearly visually distinguish between a "work" interval, "rest" interval, and "preparation" interval. The background color MUST change dynamically based on the state. For instance, the "work" state MUST use a specific background color (e.g., Emerald 500 equivalent), the "rest" state MUST use another background color (e.g., Blue 500 equivalent), and the "preparation" state MUST use a distinct color (e.g., Orange 500 equivalent) to indicate transition.

#### Scenario: Timer transitions to preparation interval
- **WHEN** a work exercise ends and another work exercise follows
- **THEN** the background color transitions to the preparation color
- **THEN** the screen displays a large countdown from 5 to 0
- **THEN** the upcoming exercise is prominently featured

#### Scenario: Timer transitions from preparation to work
- **WHEN** the preparation countdown reaches 0
- **THEN** the background transitions to the work color
- **THEN** the exercise begins with full timer functionality

### Requirement: Timer Controls
The system MUST provide fixed playback controls at the bottom of the screen. These controls MUST include a "Passer" (Skip) button to advance to the next step of the dynamic sequence, and a "Stop/Pause" button to pause the session. When paused, the Stop button MUST display a "Reprendre" (Resume) option. During preparation phase, the skip button MUST be available to bypass the countdown.

#### Scenario: User skips preparation phase
- **WHEN** the user taps the "Passer" (Skip) button during preparation countdown
- **THEN** the countdown stops immediately and the exercise begins

### Requirement: Affichage de la progression dans la séance
Le système DOIT afficher la progression de l'utilisateur dans la séance, par exemple "Exercice 3 / 7" ou une barre de progression. L'utilisateur MUST pouvoir distinguer sa position dans la séquence globale. During preparation phase, the progress indicator MUST show the upcoming exercise number.

#### Scenario: Progression during preparation
- **WHEN** the system is in preparation phase for exercise N
- **THEN** the progress indicator shows "Préparation pour N / Total"
- **THEN** the exercise number reflects the upcoming exercise being prepared for