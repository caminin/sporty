## MODIFIED Requirements

### Requirement: Aperçu du prochain exercice
Le système MUST afficher un aperçu bien visible du prochain exercice en bas de l'écran timer, avec une taille de police suffisante pour une lecture facile pendant les phases de travail et de repos.

#### Scenario: Aperçu affiché pendant le travail
- **WHEN** l'utilisateur effectue un exercice de travail et qu'il reste au moins un exercice après celui-ci
- **THEN** un aperçu "Suivant: [nom de l'exercice]" est affiché en bas de l'écran
- **THEN** le nom du prochain exercice est affiché en grande taille (au moins text-2xl) pour une bonne visibilité
- **THEN** le groupe musculaire du prochain exercice est affiché sous le nom

#### Scenario: Aperçu affiché pendant le repos
- **WHEN** l'utilisateur est en phase de repos et qu'il reste au moins un exercice après le repos
- **THEN** un aperçu "Suivant: [nom de l'exercice]" est affiché en bas de l'écran
- **THEN** le nom du prochain exercice est affiché en grande taille (au moins text-2xl) pour une bonne visibilité
- **THEN** le groupe musculaire du prochain exercice est affiché sous le nom

#### Scenario: Pas d'aperçu pour le dernier exercice
- **WHEN** l'utilisateur effectue le dernier exercice de la séance
- **THEN** aucun aperçu du prochain exercice n'est affiché
