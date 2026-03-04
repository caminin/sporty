## MODIFIED Requirements

### Requirement: Bibliothèque d'icônes prédéfinies
Le système MUST fournir une bibliothèque d'icônes prédéfinies organisée par catégories sportives pour la sélection lors de la création ou modification de groupes. L'utilisateur peut choisir l'ordre d'affichage des catégories (actuel ou aléatoire) via une case à cocher cochée par défaut.

#### Scenario: Affichage de la bibliothèque d'icônes
- **WHEN** l'utilisateur ouvre le sélecteur d'icônes
- **THEN** une grille d'icônes organisées par catégories est affichée
- **THEN** chaque icône est accompagnée d'un nom descriptif
- **THEN** une case à cocher permet de basculer entre l'ordre actuel et l'ordre aléatoire des catégories

#### Scenario: Catégories d'icônes disponibles
- **WHEN** l'utilisateur explore les catégories d'icônes
- **THEN** au minimum les catégories suivantes sont disponibles : cardio, musculation, sport collectif, sport individuel, mobilité, explosivité
- **THEN** chaque catégorie contient au moins 3 icônes distinctes
