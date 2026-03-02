## Requirement: Timer UI Structure
The system MUST display a full-screen timer view with a dark theme by default, using the 'Lexend' font. It MUST show the current exercise name (e.g., "Shadow Footwork"), its subcategory/group (e.g., "Group 2 - Speed"), and a large, horizontally-centered numerical countdown timer. During transitions between exercises, the system MUST display an enhanced preview of the upcoming exercise with improved visibility.

#### Scenario: User views the timer page
- **WHEN** the user navigates to the timer session view
- **THEN** they see the exercise details, a massive countdown timer, and control buttons.

#### Scenario: Enhanced next exercise preview
- **WHEN** the current exercise is running
- **THEN** the upcoming exercise name and group MUST be displayed more prominently than before
- **THEN** the preview MUST be positioned to draw attention without interfering with current exercise focus

## Requirement: Interval Visual States (Work vs Rest)
The system MUST clearly visually distinguish between a "work" interval, "rest" interval, and "preparation" interval. The background color MUST change dynamically based on the state. For instance, the "work" state MUST use a specific background color (e.g., Emerald 500 equivalent), the "rest" state MUST use another background color (e.g., Blue 500 equivalent), and the "preparation" state MUST use a distinct color (e.g., Orange 500 equivalent) to indicate transition. The label text indicating the current phase (e.g., "Work Interval", "Rest Phase", or "Preparation") MUST update accordingly.

#### Scenario: Timer transitions to a rest interval
- **WHEN** the work interval countdown reaches 0 and a rest interval begins
- **THEN** the background color smoothly transitions, and the interval label changes to indicate it is a rest period.

#### Scenario: Timer transitions to preparation interval
- **WHEN** a work exercise ends and another work exercise follows
- **THEN** the background color transitions to the preparation color
- **THEN** the screen displays a large countdown from 5 to 0
- **THEN** the upcoming exercise is prominently featured

#### Scenario: Timer transitions from preparation to work
- **WHEN** the preparation countdown reaches 0
- **THEN** the background transitions to the work color
- **THEN** the exercise begins with full timer functionality

## Requirement: Timer Controls
The system MUST provide fixed playback controls at the bottom of the screen. These controls MUST include a "Passer" (Skip) button to advance to the next step of the dynamic sequence, and a "Stop/Pause" button to pause the session. When paused, the Stop button MUST display a "Reprendre" (Resume) option. During preparation phase, the skip button MUST be available to bypass the countdown.

#### Scenario: User skips the current step
- **WHEN** the user taps the "Passer" (Skip) button
- **THEN** the timer immediately stops the current countdown and transitions to the next step in the dynamic sequence

#### Scenario: User pauses and resumes
- **WHEN** the user taps the "Stop" button during an active step
- **THEN** the countdown pauses and the button changes to allow resuming the session

#### Scenario: User skips preparation phase
- **WHEN** the user taps the "Passer" (Skip) button during preparation countdown
- **THEN** the countdown stops immediately and the exercise begins

## Requirement: Audio/Volume Controls
The system MUST provide an audio toggle/volume control button in the top-right header area.

#### Scenario: User toggles audio
- **WHEN** the user clicks the volume button
- **THEN** the audio feedback for countdown ticks and interval changes is toggled on or off.

## Requirement: Réception de la séquence dynamique d'exercices
Le système DOIT lire le paramètre URL `session` (JSON encodé en base64) et construire la liste des steps à exécuter. Si le paramètre est absent ou invalide, le timer MUST afficher un message d'erreur et proposer un retour à l'accueil.

#### Scenario: Paramètre session valide
- **WHEN** l'utilisateur arrive sur `/timer?session=<base64json>`
- **THEN** le timer charge la séquence et commence le premier step automatiquement

#### Scenario: Paramètre session absent ou invalide
- **WHEN** l'utilisateur arrive sur `/timer` sans paramètre `session` valide
- **THEN** un message d'erreur est affiché avec un bouton de retour à l'accueil

## Requirement: Gestion des exercices de type `reps`
Pour les steps de type `work` avec `type: "reps"`, le système DOIT afficher le nombre de répétitions à effectuer (ex: "15 reps") au lieu d'un compte à rebours. Le timer ne MUST PAS décompter automatiquement. Un bouton "Valider / Terminé" MUST être disponible pour passer manuellement au step suivant.

#### Scenario: Affichage d'un exercice de type reps
- **WHEN** le step courant est de type `work` avec `type: "reps"`
- **THEN** le nombre de reps est affiché en grand, le timer ne décompte pas, et un bouton "Valider" est visible

#### Scenario: Validation manuelle d'un exercice reps
- **WHEN** l'utilisateur appuie sur "Valider"
- **THEN** le step suivant commence (soit un repos automatique, soit l'exercice suivant)

## Requirement: Gestion des exercices de type `time`
Pour les steps de type `work` avec `type: "time"`, le système DOIT afficher un compte à rebours basé sur la durée de l'exercice (en secondes). La transition au step suivant MUST se faire automatiquement quand le compte à rebours atteint 0.

#### Scenario: Compte à rebours automatique
- **WHEN** le step courant est de type `work` avec `type: "time"`
- **THEN** le timer décompte depuis la durée configurée et passe automatiquement au step suivant à 0

## Requirement: Affichage de la progression dans la séance
Le système DOIT afficher la progression de l'utilisateur dans la séance, par exemple "Exercice 3 / 7" ou une barre de progression. L'utilisateur MUST pouvoir distinguer sa position dans la séquence globale. During preparation phase, the progress indicator MUST show the upcoming exercise number.

#### Scenario: Progression visible
- **WHEN** l'utilisateur est sur le step N d'une séquence de M steps
- **THEN** un indicateur de progression (ex: "3 / 7") est visible à l'écran

#### Scenario: Progression during preparation
- **WHEN** the system is in preparation phase for exercise N
- **THEN** the progress indicator shows "Préparation pour N / Total"
- **THEN** the exercise number reflects the upcoming exercise being prepared for
