## MODIFIED Requirements

### Requirement: Structure étendue du fichier de configuration
The system SHALL use a unified structure for all groups. There are no predefined groups; all groups follow the same structure: `{ id, name, icon, createdAt, exercises }`. The `groups` property in the configuration contains all groups (previously "custom" only).

#### Scenario: Structure unifiée des groupes
- **WHEN** the application loads the exercise configuration
- **THEN** all groups are stored in the `groups` property with the structure `{ id, name, icon, createdAt, exercises }`
- **THEN** each group has an `id` generated at creation (e.g. `custom_` prefix)
- **THEN** there is no separate `customGroups` property; all groups are user-created

#### Scenario: Structure des groupes
- **WHEN** a group is created
- **THEN** it is stored with the structure: `{ id, name, icon, createdAt, exercises }`
- **THEN** the `id` is a unique identifier generated automatically
- **THEN** `createdAt` is an ISO timestamp of creation
- **THEN** `exercises` is an array of exercises in the existing format

### Requirement: Migration backward-compatible
The system SHALL support loading configurations. When migrating from an old format (groups as arrays of exercises), the system SHALL NOT create predefined groups; the migrated configuration SHALL have empty groups or only groups already in the unified format.

#### Scenario: Chargement de configuration sans groupes prédéfinis
- **WHEN** the application loads the default seed from `exercises.json`
- **THEN** the seed contains `groups: {}` (no predefined groups)
- **THEN** new lists start with empty groups

#### Scenario: Validation de la structure des groupes
- **WHEN** the application loads the configuration
- **THEN** each group is validated to contain the required properties
- **THEN** invalid groups are reported but do not prevent loading of others

## REMOVED Requirements

### Requirement: Séparation customGroups / groups
**Reason**: All groups are now user-created; no need for a separate storage for custom vs predefined.
**Migration**: Single `groups` property contains all groups.
