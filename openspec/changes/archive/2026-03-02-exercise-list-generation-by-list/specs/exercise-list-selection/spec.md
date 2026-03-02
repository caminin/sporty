## ADDED Requirements

### Requirement: Liste de sélection des exercices
Le système DOIT afficher une interface permettant à l'utilisateur de sélectionner parmi les listes d'exercices disponibles.

#### Scenario: Affichage des listes disponibles
- **WHEN** l'utilisateur accède à la page principale
- **THEN** le système affiche une liste déroulante ou un sélecteur contenant toutes les listes d'exercices disponibles
- **AND** la liste par défaut est présélectionnée

#### Scenario: Changement de liste sélectionnée
- **WHEN** l'utilisateur sélectionne une liste différente dans l'interface
- **THEN** le système met à jour immédiatement la configuration d'exercices active
- **AND** recharge les exercices affichés dans l'interface

### Requirement: Persistance de la sélection
Le système DOIT mémoriser la liste sélectionnée pendant la session utilisateur.

#### Scenario: Restauration de la sélection
- **WHEN** l'utilisateur actualise la page
- **THEN** le système restaure la liste précédemment sélectionnée
- **AND** maintient cette sélection active

### Requirement: Gestion des erreurs de chargement
Le système DOIT gérer gracieusement les erreurs lors du chargement des listes.

#### Scenario: Liste introuvable
- **WHEN** la liste sélectionnée n'existe plus
- **THEN** le système affiche un message d'erreur
- **AND** revient automatiquement à la liste par défaut
- **AND** notifie l'utilisateur du problème