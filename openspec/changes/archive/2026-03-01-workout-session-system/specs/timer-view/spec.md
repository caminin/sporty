## ADDED Requirements

### Requirement: Réception de la séquence dynamique d'exercices
Le système DOIT lire le paramètre URL `session` (JSON encodé en base64) et construire la liste des steps à exécuter. Si le paramètre est absent ou invalide, le timer MUST afficher un message d'erreur et proposer un retour à l'accueil.

#### Scenario: Paramètre session valide
- **WHEN** l'utilisateur arrive sur `/timer?session=<base64json>`
- **THEN** le timer charge la séquence et commence le premier step automatiquement

#### Scenario: Paramètre session absent ou invalide
- **WHEN** l'utilisateur arrive sur `/timer` sans paramètre `session` valide
- **THEN** un message d'erreur est affiché avec un bouton de retour à l'accueil

### Requirement: Gestion des exercices de type `reps`
Pour les steps de type `work` avec `type: "reps"`, le système DOIT afficher le nombre de répétitions à effectuer (ex: "15 reps") au lieu d'un compte à rebours. Le timer ne MUST PAS décompter automatiquement. Un bouton "Valider / Terminé" MUST être disponible pour passer manuellement au step suivant.

#### Scenario: Affichage d'un exercice de type reps
- **WHEN** le step courant est de type `work` avec `type: "reps"`
- **THEN** le nombre de reps est affiché en grand, le timer ne décompte pas, et un bouton "Valider" est visible

#### Scenario: Validation manuelle d'un exercice reps
- **WHEN** l'utilisateur appuie sur "Valider"
- **THEN** le step suivant commence (soit un repos automatique, soit l'exercice suivant)

### Requirement: Gestion des exercices de type `time`
Pour les steps de type `work` avec `type: "time"`, le système DOIT afficher un compte à rebours basé sur la durée de l'exercice (en secondes). La transition au step suivant MUST se faire automatiquement quand le compte à rebours atteint 0.

#### Scenario: Compte à rebours automatique
- **WHEN** le step courant est de type `work` avec `type: "time"`
- **THEN** le timer décompte depuis la durée configurée et passe automatiquement au step suivant à 0

### Requirement: Affichage de la progression dans la séance
Le système DOIT afficher la progression de l'utilisateur dans la séance, par exemple "Exercice 3 / 7" ou une barre de progression. L'utilisateur MUST pouvoir distinguer sa position dans la séquence globale.

#### Scenario: Progression visible
- **WHEN** l'utilisateur est sur le step N d'une séquence de M steps
- **THEN** un indicateur de progression (ex: "3 / 7") est visible à l'écran

## MODIFIED Requirements

### Requirement: Timer Controls
The system MUST provide fixed playback controls at the bottom of the screen. These controls MUST include a "Passer" (Skip) button to advance to the next step of the dynamic sequence, and a "Stop" button to pause the session. When paused, the Stop button MUST display a "Reprendre" (Resume) option.

#### Scenario: User skips the current step
- **WHEN** the user taps the "Passer" (Skip) button
- **THEN** the timer immediately stops the current countdown and transitions to the next step in the dynamic sequence

#### Scenario: User pauses and resumes
- **WHEN** the user taps the "Stop" button during an active step
- **THEN** the countdown pauses and the button changes to allow resuming the session
