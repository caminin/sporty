## ADDED Requirements

### Requirement: Groups reference catalog exercises
Each group SHALL store `exercises` as an array of references `{ refId, exerciseId, value? }` where `exerciseId` MUST exist in the list catalog. `refId` SHALL be unique within the group. Import of groups JSON and catalog replace operations SHALL fail with an explicit error if any reference violates this rule.

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
- **WHEN** imported groups JSON contains `value` on a group reference
- **THEN** runtime resolution MAY still apply that override for session and home page after successful validation
- **THEN** the admin UI does not display or edit override fields

#### Scenario: Optional value override in group (runtime)
- **WHEN** a group reference has no `value` field
- **THEN** the effective value for display and session is the catalog default
- **WHEN** a group reference has `value` set (e.g. from imported JSON)
- **THEN** the effective value is the reference `value`, not the catalog default

#### Scenario: Reject import with missing exerciseId
- **WHEN** groups JSON import includes a reference whose `exerciseId` is absent from the active catalog
- **THEN** import fails with a message identifying the session group name and missing `exerciseId`
- **THEN** no references from that import are persisted

### Requirement: Resolved exercise for consumers
The system SHALL expose resolution from catalog + reference to a resolved exercise `{ refId, exerciseId, name, type, value }` used by home page, session builder, and duration estimation.

#### Scenario: Resolve for display
- **WHEN** a group reference points to a valid catalog entry
- **THEN** resolved `name` and `type` come from the catalog
- **THEN** resolved `value` equals reference override or catalog default

#### Scenario: Invalid exerciseId at runtime
- **WHEN** a reference points to a missing catalog `exerciseId` on loaded data
- **THEN** the reference is omitted from resolved output
- **THEN** validation on save, catalog replace, or groups import reports the orphan reference with an explicit error and blocks persist when invoked from admin import flows
