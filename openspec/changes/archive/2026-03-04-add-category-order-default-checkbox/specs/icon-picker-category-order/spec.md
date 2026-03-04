## ADDED Requirements

### Requirement: Ordre configurable des catégories dans le sélecteur d'icônes

Le système SHALL permettre à l'utilisateur de choisir l'ordre d'affichage des catégories d'icônes dans le sélecteur : ordre actuel (cardio, musculation, sport collectif, etc.) ou ordre aléatoire.

#### Scenario: Case cochée par défaut

- **WHEN** l'utilisateur ouvre le sélecteur d'icônes pour la première fois
- **THEN** une case à cocher « Ordre aléatoire des catégories » est affichée
- **THEN** la case est cochée par défaut
- **THEN** les catégories sont affichées dans un ordre aléatoire

#### Scenario: Ordre aléatoire quand la case est cochée

- **WHEN** l'utilisateur coche la case « Ordre aléatoire des catégories »
- **THEN** les catégories sont immédiatement réaffichées dans un ordre aléatoire

#### Scenario: Persistance du choix

- **WHEN** l'utilisateur modifie l'état de la case à cocher
- **THEN** le choix est persisté (localStorage)
- **THEN** lors de la prochaine ouverture du sélecteur, l'état de la case correspond au choix sauvegardé
