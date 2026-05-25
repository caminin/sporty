## Requirement: Lancement de la séance depuis la page d'accueil
Le système DOIT permettre à l'utilisateur de lancer la séance en appuyant sur le bouton "Lancer la séance". La séquence d'exercices (filtrée des groupes vides) DOIT être encodée et transmise au composant timer via les paramètres d'URL. Les groupes ne contenant aucun exercice MUST être ignorés.

#### Scenario: Lancement avec des exercices configurés
- **WHEN** l'utilisateur appuie sur le bouton "Lancer la séance" et qu'au moins un groupe contient des exercices
- **THEN** l'application navigue vers `/timer` avec la séquence d'exercices encodée en paramètre URL `session`

#### Scenario: Lancement avec tous les groupes vides
- **WHEN** l'utilisateur appuie sur "Lancer la séance" et aucun groupe ne contient d'exercices
- **THEN** une indication visuelle (toast ou alert) indique à l'utilisateur qu'il n'y a aucun exercice à lancer

## Requirement: Construction de la séquence de session
Le système DOIT construire une séquence de steps `[work, rest, work, rest, ..., work]` à partir des placements sélectionnés, résolus via le catalogue (valeur effective), en utilisant l'algorithme d'alternance entre groupes. Le dernier step MUST être de type `work`.

#### Scenario: Séquence correctement construite
- **WHEN** la config contient N placements sélectionnés au total
- **THEN** la séquence générée contient N steps `work` et N-1 steps `rest`
- **THEN** chaque step `work` utilise la valeur effective (override ou défaut catalogue) pour durée ou répétitions

#### Scenario: Alternance maximale des groupes musculaires
- **WHEN** la config contient des placements de plusieurs groupes
- **THEN** la séquence maximise l'alternance entre groupes différents

## Requirement: Fin de boucle — proposition de relancer
Le système DOIT afficher un écran de fin lorsque tous les steps de la séquence ont été complétés. Cet écran DOIT présenter deux options : **Oui, refaire** (relancer la séquence depuis le début) et **Terminer** (retourner à la page d'accueil).

#### Scenario: Fin de séance — l'utilisateur choisit de refaire
- **WHEN** le dernier step est terminé et l'utilisateur appuie sur "Oui, refaire"
- **THEN** la séquence repart depuis le premier step (index 0) sans rechargement de page

#### Scenario: Fin de séance — l'utilisateur choisit de terminer
- **WHEN** le dernier step est terminé et l'utilisateur appuie sur "Terminer"
- **THEN** l'application navigue vers la page d'accueil (`/`)

## Requirement: Session Start Never Begins With Rest
The system SHALL guarantee that the first step of any workout session built by `buildSessionSteps` is always a work step, never a rest step. Before each work step (except the first one), the system SHALL display a preparation screen with a 5-second countdown.

#### Scenario: Session construction starts with exercise
- **WHEN** `buildSessionSteps` is called with a non-empty WorkoutConfig
- **THEN** the first step in the returned array has `kind === "work"`
- **THEN** rest steps only appear between work steps (not before the first or after the last)

#### Scenario: Preparation phase before work steps
- **WHEN** a work step follows another step (rest or work)
- **THEN** a 5-second preparation countdown MUST be displayed before the work step begins
- **THEN** the preparation screen MUST show the upcoming exercise name and group

#### Scenario: First exercise starts immediately
- **WHEN** the session begins with the first work step
- **THEN** no preparation countdown is shown and the exercise starts immediately

#### Scenario: Preparation can be skipped
- **WHEN** the user is in the preparation phase
- **THEN** they MUST be able to skip the countdown and start the exercise immediately
