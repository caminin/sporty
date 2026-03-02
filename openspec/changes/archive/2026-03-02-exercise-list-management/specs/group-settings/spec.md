## MODIFIED Requirements

### Requirement: Exercise Lists Management Interface
Le système DOIT étendre l'interface des paramètres avec un onglet "Gestion des listes" protégé par authentification admin.

#### Scenario: New Lists tab in settings
- **WHEN** l'utilisateur accède aux paramètres
- **THEN** un nouvel onglet "Gestion des listes" est visible
- **THEN** cet onglet nécessite une authentification admin pour être accessible

#### Scenario: List selection interface
- **WHEN** l'utilisateur est authentifié dans l'onglet gestion des listes
- **THEN** un menu déroulant affiche toutes les listes disponibles
- **THEN** des boutons permettent de créer, modifier et supprimer des listes

#### Scenario: Current active list indication
- **WHEN** une liste est chargée
- **THEN** son nom est clairement indiqué comme "liste active"
- **THEN** les modifications s'appliquent à cette liste

## ADDED Requirements

### Requirement: Exercise Lists Integration with Settings
Le système DOIT intégrer la gestion des listes avec l'interface existante de configuration des groupes.

#### Scenario: Unified exercise management
- **WHEN** une liste est chargée dans l'onglet gestion des listes
- **THEN** les onglets existants (groupes d'exercices) affichent le contenu de cette liste
- **THEN** les modifications sont sauvegardées dans la liste active

#### Scenario: List switching
- **WHEN** l'utilisateur change de liste active
- **THEN** l'interface se met à jour pour afficher le contenu de la nouvelle liste
- **THEN** les modifications précédentes sont préservées