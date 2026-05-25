## ADDED Requirements

### Requirement: Admin UI simplification test coverage
The test suite SHALL cover catalog default value editing and simplified group/import admin behavior where integration or component tests exist for list management.

#### Scenario: Catalog default update persists
- **WHEN** tests update a catalog exercise default `value` through the catalog API or action used by the admin tab
- **THEN** the persisted list reflects the new default
- **THEN** a group reference without override resolves to the updated default

#### Scenario: Add to group without override
- **WHEN** tests add a catalog exercise to a session group through the group action without an override argument
- **THEN** the new reference has no `value` field
- **THEN** resolved output uses the catalog default
