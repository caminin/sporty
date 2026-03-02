## Requirement: Exercise transition display
Le système DOIT afficher un écran de transition avec un compte à rebours de 5 secondes avant le début de chaque exercice de travail.

#### Scenario: Transition display appears
- **WHEN** un exercice se termine et qu'un nouvel exercice de travail suit
- **THEN** le système affiche un écran de transition avec le nom du prochain exercice en évidence

#### Scenario: Preparation countdown
- **WHEN** l'écran de transition s'affiche
- **THEN** un compte à rebours de 5 secondes se lance automatiquement

#### Scenario: Transition to exercise
- **WHEN** le compte à rebours atteint 0
- **THEN** l'écran de transition disparaît et l'exercice commence

#### Scenario: Exercise information visibility
- **WHEN** l'écran de transition est affiché
- **THEN** le nom et le groupe du prochain exercice sont clairement visibles

#### Scenario: Skip preparation
- **WHEN** l'utilisateur appuie sur le bouton "Passer" pendant la phase de préparation
- **THEN** le compte à rebours s'arrête et l'exercice commence immédiatement