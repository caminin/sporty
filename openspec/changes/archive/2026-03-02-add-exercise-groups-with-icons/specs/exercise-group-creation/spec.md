## Purpose
Cette capability permet aux utilisateurs de créer, modifier et supprimer des groupes d'exercices personnalisés dans l'interface de paramètres des groupes, offrant une flexibilité supplémentaire pour organiser les séances d'entraînement selon leurs besoins spécifiques.

## ADDED Requirements

### Requirement: Interface de création de groupes personnalisés
Le système MUST fournir une interface permettant aux utilisateurs de créer de nouveaux groupes d'exercices personnalisés avec un nom et une icône.

#### Scenario: Accès à l'interface de création
- **WHEN** l'utilisateur navigue vers l'onglet "Groupes personnalisés" dans la page de paramètres
- **THEN** une interface de création de groupe est affichée avec des champs pour le nom et la sélection d'icône

#### Scenario: Création d'un groupe valide
- **WHEN** l'utilisateur saisit un nom unique et sélectionne une icône
- **WHEN** il clique sur le bouton "Créer le groupe"
- **THEN** un nouveau groupe personnalisé est créé et ajouté à la liste
- **THEN** l'utilisateur est redirigé vers l'interface d'édition du nouveau groupe

#### Scenario: Validation du nom du groupe
- **WHEN** l'utilisateur tente de créer un groupe avec un nom vide
- **THEN** la création est empêchée et un message d'erreur est affiché
- **WHEN** l'utilisateur tente de créer un groupe avec un nom déjà existant
- **THEN** la création est empêchée et un message d'erreur indique le conflit

### Requirement: Interface d'édition des groupes personnalisés
Le système MUST permettre la modification du nom et de l'icône des groupes personnalisés existants.

#### Scenario: Modification du nom d'un groupe
- **WHEN** l'utilisateur modifie le nom d'un groupe personnalisé existant
- **THEN** le changement est sauvegardé automatiquement ou via un bouton "Sauvegarder"
- **THEN** toutes les références au groupe utilisent le nouveau nom

#### Scenario: Changement d'icône d'un groupe
- **WHEN** l'utilisateur sélectionne une nouvelle icône pour un groupe personnalisé
- **THEN** l'icône est mise à jour immédiatement dans l'interface
- **THEN** le changement est persisté

### Requirement: Suppression de groupes personnalisés
Le système MUST permettre la suppression des groupes personnalisés créés par l'utilisateur.

#### Scenario: Suppression d'un groupe vide
- **WHEN** l'utilisateur supprime un groupe personnalisé ne contenant aucun exercice
- **THEN** le groupe est supprimé définitivement
- **THEN** un message de confirmation est affiché

#### Scenario: Tentative de suppression d'un groupe avec exercices
- **WHEN** l'utilisateur tente de supprimer un groupe contenant des exercices
- **THEN** une boîte de dialogue de confirmation est affichée
- **THEN** l'utilisateur doit confirmer la suppression et la perte des exercices

#### Scenario: Annulation de suppression
- **WHEN** l'utilisateur annule la suppression d'un groupe
- **THEN** le groupe reste intact avec tous ses exercices