## MODIFIED Requirements

### Requirement: Interface de création de groupes personnalisés
The system SHALL provide an interface allowing users to create new exercise groups with a name and an icon. This interface is available in the "Groupes d'exercices" tab (the single tab for all groups), not in a separate "Groupes personnalisés" tab.

#### Scenario: Accès à l'interface de création
- **WHEN** the user navigates to the "Groupes d'exercices" tab in the settings page
- **THEN** a group creation interface is displayed with fields for name and icon selection
- **THEN** the creation form is visible either in the empty state or as a dedicated section when groups exist

#### Scenario: Création d'un groupe valide
- **WHEN** the user enters a unique name and selects an icon
- **WHEN** they click the "Créer le groupe" button
- **THEN** a new group is created and added to the list
- **THEN** the user can immediately add exercises to the new group

#### Scenario: Validation du nom du groupe
- **WHEN** the user attempts to create a group with an empty name
- **THEN** creation is prevented and an error message is displayed
- **WHEN** the user attempts to create a group with an already existing name
- **THEN** creation is prevented and an error message indicates the conflict
