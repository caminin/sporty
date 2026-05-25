## ADDED Requirements

### Requirement: Split catalog and groups import export tests
The list system test suite SHALL cover separate catalog and groups JSON import/export paths, replace-all catalog confirmation behavior, and strict rejection of orphan group references.

#### Scenario: Catalog-only import creates list
- **WHEN** tests call catalog import with valid `exercises` JSON and a list name
- **THEN** a new list is created with the catalog persisted
- **THEN** `groups` may be empty

#### Scenario: Groups import rejects orphan exerciseId
- **WHEN** tests import groups JSON referencing an `exerciseId` not in the active catalog
- **THEN** import fails with an explicit error
- **THEN** the stored list is unchanged

#### Scenario: Replace all catalog clears then imports
- **WHEN** tests import catalog with replace-all into a list that had exercises
- **THEN** previous catalog ids not in import are removed after successful validation
- **WHEN** remaining group references would be orphan
- **THEN** import fails before persist

#### Scenario: Export helpers produce split shapes
- **WHEN** tests export catalog and groups separately
- **THEN** catalog export contains `exercises` without requiring `groups`
- **THEN** groups export contains `groups` with reference-only entries
