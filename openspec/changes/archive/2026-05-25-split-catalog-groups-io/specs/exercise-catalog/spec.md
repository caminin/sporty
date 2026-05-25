## ADDED Requirements

### Requirement: Catalog import and export in admin
The system SHALL expose catalog-only JSON import and export in the **Liste d'exercices** admin tab for the active list, and for creating a new list when none exists.

#### Scenario: Export catalog from admin tab
- **WHEN** the admin triggers export on the catalog tab with an active list
- **THEN** JSON containing `exercises` is copied or offered for download
- **THEN** each exercise includes `muscleGroup`

#### Scenario: Import catalog with replace confirmation
- **WHEN** the admin imports catalog JSON into an existing list
- **THEN** the system asks whether to delete all current catalog exercises before import
- **WHEN** the admin confirms replacement
- **THEN** the local catalog is cleared then filled from import, subject to group reference validation
- **WHEN** the admin declines replacement
- **THEN** imported exercises are merged by `exerciseId` without clearing unrelated ids first

#### Scenario: Catalog import not available on groups tab
- **WHEN** the admin is on the groups tab
- **THEN** catalog import and export controls are not shown
