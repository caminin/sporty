# exercise-group-display Specification

## Purpose
Cette capability gère l'affichage du groupe musculaire de l'exercice actuel et l'aperçu du prochain exercice dans l'interface timer, améliorant la clarté et la préparation mentale de l'utilisateur pendant l'entraînement.
## Requirements
### Requirement: Affichage du groupe musculaire de l'exercice actuel
Le système DOIT afficher le groupe musculaire de l'exercice en cours dans l'interface timer, sous forme d'un badge discret avec un style visuel distinctif.

#### Scenario: Affichage du groupe pendant un exercice chronométré
- **WHEN** l'utilisateur visualise un step de type "work" avec un exercice chronométré
- **THEN** le groupe musculaire de l'exercice est affiché dans un badge sous le nom de l'exercice
- **THEN** le badge utilise une couleur de fond légère et une police plus petite que le nom de l'exercice

#### Scenario: Affichage du groupe pendant un exercice en répétitions
- **WHEN** l'utilisateur visualise un step de type "work" avec un exercice en répétitions
- **THEN** le groupe musculaire de l'exercice est affiché dans un badge sous le nom de l'exercice
- **THEN** le badge utilise une couleur de fond légère et une police plus petite que le nom de l'exercice

### Requirement: Aperçu du prochain exercice
Le système DOIT afficher un aperçu compact du prochain exercice en bas de l'écran timer, visible pendant les phases de travail et de repos.

#### Scenario: Aperçu affiché pendant le travail
- **WHEN** l'utilisateur effectue un exercice de travail et qu'il reste au moins un exercice après celui-ci
- **THEN** un aperçu "Suivant: [nom de l'exercice]" est affiché en bas de l'écran
- **THEN** le groupe musculaire du prochain exercice est affiché en plus petite taille sous le nom

#### Scenario: Aperçu affiché pendant le repos
- **WHEN** l'utilisateur est en phase de repos et qu'il reste au moins un exercice après le repos
- **THEN** un aperçu "Suivant: [nom de l'exercice]" est affiché en bas de l'écran
- **THEN** le groupe musculaire du prochain exercice est affiché en plus petite taille sous le nom

#### Scenario: Pas d'aperçu pour le dernier exercice
- **WHEN** l'utilisateur effectue le dernier exercice de la séance
- **THEN** aucun aperçu du prochain exercice n'est affiché

