## Requirement: Exercise transition display
The system SHALL display a transition screen with a 5-second countdown only before the first work exercise of the session. No transition SHALL be shown between subsequent exercises. When the first exercise has multiple series (`seriesTotal` > 1), the transition screen SHALL display the series position of the first block (e.g. « Série 1/3 »).

#### Scenario: Transition display appears before first exercise
- **WHEN** la séance démarre et que le premier step est un exercice de travail
- **THEN** le système affiche l'écran de transition avec le nom du premier exercice en évidence

#### Scenario: Transition display appears after initial rest
- **WHEN** la séance démarre par un repos et que le repos se termine
- **THEN** le système affiche l'écran de transition avec le nom du premier exercice en évidence

#### Scenario: No transition between exercises
- **WHEN** un exercice de travail se termine et qu'un nouvel exercice de travail suit
- **THEN** le système passe directement à l'exercice suivant sans écran de transition

#### Scenario: Preparation countdown
- **WHEN** l'écran de transition s'affiche
- **THEN** un compte à rebours de 5 secondes se lance automatiquement

#### Scenario: Transition to exercise
- **WHEN** le compte à rebours atteint 0
- **THEN** l'écran de transition disparaît et l'exercice commence

#### Scenario: Exercise information visibility
- **WHEN** l'écran de transition est affiché
- **THEN** le nom et le groupe du prochain exercice sont clairement visibles

#### Scenario: Series visible on first exercise preparation
- **WHEN** le premier work step a `seriesTotal` 3
- **THEN** l'écran de transition affiche la série 1/3 en plus du nom et du groupe

#### Scenario: Skip preparation
- **WHEN** l'utilisateur appuie sur le bouton "Passer" pendant la phase de préparation
- **THEN** le compte à rebours s'arrête et l'exercice commence immédiatement
