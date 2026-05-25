## MODIFIED Requirements

### Requirement: Groups reference catalog exercises
Each group SHALL store `exercises` as an array of references `{ refId, exerciseId, value? }` where `exerciseId` MUST exist in the list catalog. `refId` SHALL be unique within the group.

#### Scenario: Add exercise from catalog to group
- **WHEN** the admin adds an exercise to a session group from the groups tab
- **THEN** a new reference is appended with a unique `refId` and the chosen `exerciseId`
- **THEN** no `value` override is set by the admin UI
- **THEN** no inline creation of a new catalog entry occurs in the group form

#### Scenario: Catalog default is effective in admin
- **WHEN** the admin views a placement in a session group
- **THEN** the displayed duration or reps match the catalog default for that `exerciseId`
- **THEN** no input is provided to set or clear a reference override

#### Scenario: Legacy override in imported JSON
- **WHEN** imported JSON contains `value` on a group reference
- **THEN** runtime resolution MAY still apply that override for session and home page
- **THEN** the admin UI does not display or edit override fields

## REMOVED Requirements

### Requirement: Update override only from group UI
**Reason**: Les valeurs effectives sont gérées dans le catalogue ; l’admin ne surcharge plus les placements.
**Migration**: Modifier `config.exercises[id].value` dans l’onglet catalogue ou éditer le JSON importé ; retirer les champs `value` des références si une valeur unique catalogue suffit.
