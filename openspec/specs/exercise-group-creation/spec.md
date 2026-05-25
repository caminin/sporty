## Purpose
Cette capability couvre l'édition et la suppression des groupes de séance existants dans l'admin. Les nouveaux groupes sont définis dans le JSON importé (`groups`), pas via un formulaire de création dans l'interface.

## Requirement: Interface d'édition des groupes personnalisés
Le système MUST permettre la modification du nom et de l'icône des groupes personnalisés existants.

#### Scenario: Modification du nom d'un groupe
- **WHEN** l'utilisateur modifie le nom d'un groupe personnalisé existant
- **THEN** le changement est sauvegardé automatiquement ou via un bouton "Sauvegarder"
- **THEN** toutes les références au groupe utilisent le nouveau nom

#### Scenario: Changement d'icône d'un groupe
- **WHEN** l'utilisateur sélectionne une nouvelle icône pour un groupe personnalisé
- **THEN** l'icône est mise à jour immédiatement dans l'interface
- **THEN** le changement est persisté

## Requirement: Suppression de groupes personnalisés
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
