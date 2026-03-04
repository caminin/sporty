## Purpose
Cette capability gère la sélection et l'affichage des icônes associées aux groupes d'exercices personnalisés, permettant une identification visuelle rapide et une meilleure organisation de l'interface utilisateur.

## Requirement: Bibliothèque d'icônes prédéfinies
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

## Requirement: Sélection d'icône lors de la création
Le système MUST permettre la sélection d'une icône lors de la création d'un nouveau groupe personnalisé.

#### Scenario: Sélection d'icône par défaut
- **WHEN** l'utilisateur crée un nouveau groupe sans sélectionner d'icône
- **THEN** une icône par défaut (générique) est automatiquement assignée
- **THEN** l'utilisateur peut la modifier ultérieurement

#### Scenario: Aperçu de l'icône sélectionnée
- **WHEN** l'utilisateur survole ou sélectionne une icône
- **THEN** un aperçu en taille réelle de l'icône est affiché
- **THEN** la couleur de l'icône s'adapte au thème de l'application

## Requirement: Affichage des icônes dans l'interface
Le système MUST afficher les icônes des groupes personnalisés dans toutes les interfaces appropriées.

#### Scenario: Affichage dans la liste des groupes
- **WHEN** l'utilisateur visualise la liste des groupes personnalisés
- **THEN** chaque groupe affiche son icône à côté du nom
- **THEN** l'icône a une taille cohérente avec les autres éléments de l'interface

#### Scenario: Affichage dans les sélecteurs d'exercices
- **WHEN** l'utilisateur sélectionne des exercices par groupe
- **THEN** les groupes personnalisés sont affichés avec leur icône respective
- **THEN** l'icône aide à l'identification rapide du groupe

## Requirement: Persistance des icônes
Le système MUST sauvegarder et restaurer correctement les icônes associées aux groupes personnalisés.

#### Scenario: Sauvegarde de l'icône
- **WHEN** l'utilisateur modifie l'icône d'un groupe
- **THEN** la nouvelle icône est sauvegardée dans la configuration persistante
- **THEN** l'icône est restaurée correctement lors du rechargement de l'application

#### Scenario: Migration d'anciens groupes
- **WHEN** l'application charge des groupes personnalisés sans icône assignée
- **THEN** l'icône par défaut est automatiquement assignée
- **THEN** l'utilisateur peut la modifier manuellement
