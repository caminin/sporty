## ADDED Requirements

### Requirement: Interface de gestion d'exercices par liste
Le système DOIT permettre d'ajouter, modifier et supprimer des exercices dans n'importe quelle liste sélectionnée via l'interface de gestion.

#### Scenario: Ajout d'exercice dans liste sélectionnée
- **WHEN** l'utilisateur ouvre l'interface de gestion des exercices
- **THEN** tous les exercices ajoutés sont automatiquement placés dans la liste actuellement sélectionnée
- **AND** l'interface indique clairement quelle liste est active

#### Scenario: Modification d'exercice dans liste active
- **WHEN** l'utilisateur modifie un exercice dans l'interface de gestion
- **THEN** les modifications sont appliquées uniquement à la liste actuellement sélectionnée
- **AND** les autres listes restent inchangées

#### Scenario: Suppression d'exercice dans liste active
- **WHEN** l'utilisateur supprime un exercice dans l'interface de gestion
- **THEN** l'exercice est supprimé uniquement de la liste actuellement sélectionnée
- **AND** l'exercice peut exister dans d'autres listes

### Requirement: Synchronisation avec la sélection globale
L'interface de gestion DOIT toujours travailler sur la liste sélectionnée globalement dans l'application.

#### Scenario: Changement de liste globale
- **WHEN** l'utilisateur change la liste sélectionnée dans l'interface principale
- **THEN** l'interface de gestion affiche automatiquement les exercices de la nouvelle liste sélectionnée
- **AND** toutes les opérations utilisent la nouvelle liste active