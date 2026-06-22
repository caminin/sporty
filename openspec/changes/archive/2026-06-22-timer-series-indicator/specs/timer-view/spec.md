## ADDED Requirements

### Requirement: Series progress on work steps
When the current work step has `seriesTotal` greater than 1, the timer view SHALL display the current series position in the form **Série X/Y** (or an equivalent compact **X/Y** badge). The indicator MUST remain visible without obscuring the exercise name or primary timer value.

#### Scenario: Display series during work
- **WHEN** the current work step has `seriesIndex` 2 and `seriesTotal` 3
- **THEN** the timer shows a series indicator equivalent to « Série 2/3 »
- **THEN** the global session progress indicator (ex. « 5 / 12 ») remains visible

#### Scenario: No series indicator for single series
- **WHEN** the current work step has no `seriesTotal` or `seriesTotal` is 1
- **THEN** no series badge is shown
- **THEN** the timer layout matches the previous single-series behavior

### Requirement: Contextual rest between series
When the current step is `rest` and the next work step is another series of the same exercise (`seriesIndex` greater than 1, same `name` as the previous work step), the timer SHALL indicate that the rest is before the next series, including the upcoming series position (ex. « Repos avant série 2/3 »).

#### Scenario: Rest between two series of same exercise
- **WHEN** the user completes work step « Pompes » with `seriesIndex` 1 and `seriesTotal` 3
- **AND** the next step is rest followed by another « Pompes » work step with `seriesIndex` 2
- **THEN** during the rest step the UI shows contextual copy referencing series 2/3 and the exercise name

#### Scenario: Rest before different exercise unchanged
- **WHEN** the rest step precedes a work step for a different exercise name
- **THEN** the rest label remains a generic rest indicator without series copy

### Requirement: Next preview distinguishes next series from next exercise
When the upcoming work step is another series of the same exercise, the « Suivant » preview SHALL NOT repeat the exercise name as if it were a new exercise. It SHALL highlight the upcoming series position (ex. « Série suivante 2/3 »). When the upcoming work step is a different exercise, the existing next-exercise preview behavior SHALL be preserved.

#### Scenario: Preview before series 2 of same exercise
- **WHEN** the current work step is series 1/3 of « Pompes »
- **AND** the next work step is series 2/3 of « Pompes »
- **THEN** the preview emphasizes the next series number rather than duplicating the exercise title as a new movement

#### Scenario: Preview before different exercise
- **WHEN** the next work step has a different exercise name
- **THEN** the preview shows the next exercise name and group as today

## MODIFIED Requirements

### Requirement: Affichage de la progression dans la séance
Le système DOIT afficher la progression de l'utilisateur dans la séance, par exemple « Exercice 3 / 7 » ou une barre de progression. L'utilisateur MUST pouvoir distinguer sa position dans la séquence globale. During preparation phase, the progress indicator MUST show the upcoming exercise number. When the upcoming or current work step has multiple series, the series position MUST be shown in addition to the global work-step counter.

#### Scenario: Progression visible
- **WHEN** l'utilisateur est sur le step N d'une séquence de M steps work
- **THEN** un indicateur de progression (ex. « 3 / 7 ») est visible à l'écran

#### Scenario: Progression during preparation
- **WHEN** the system is in preparation phase for exercise N
- **THEN** the progress indicator shows preparation context for N / Total
- **THEN** the exercise number reflects the upcoming exercise being prepared for

#### Scenario: Global and series progress together
- **WHEN** the user is on work step 5 of 12 globally and series 2 of 3 for the current exercise
- **THEN** both the global counter and the series indicator are visible and distinguishable
