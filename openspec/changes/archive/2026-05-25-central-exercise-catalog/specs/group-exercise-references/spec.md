## ADDED Requirements

### Requirement: Groups reference catalog exercises
Each group SHALL store `exercises` as an array of references `{ refId, exerciseId, value? }` where `exerciseId` MUST exist in the list catalog. `refId` SHALL be unique within the group.

#### Scenario: Add exercise from catalog to group
- **WHEN** the user adds an exercise to a group from the catalog picker
- **THEN** a new reference is appended with a unique `refId` and the chosen `exerciseId`
- **THEN** no inline creation of a new catalog entry occurs in the group form

#### Scenario: Optional value override in group
- **WHEN** a group reference has no `value` field
- **THEN** the effective value for display and session is the catalog default
- **WHEN** a group reference has `value` set
- **THEN** the effective value is the reference `value`, not the catalog default

#### Scenario: Update override only from group UI
- **WHEN** the user edits duration or reps on a group placement
- **THEN** only the reference `value` is updated (or cleared to fall back to default)
- **THEN** the catalog default remains unchanged unless edited in catalog management

### Requirement: Resolved exercise for consumers
The system SHALL expose resolution from catalog + reference to a resolved exercise `{ refId, exerciseId, name, type, value }` used by home page, session builder, and duration estimation.

#### Scenario: Resolve for display
- **WHEN** a group reference points to a valid catalog entry
- **THEN** resolved `name` and `type` come from the catalog
- **THEN** resolved `value` equals reference override or catalog default

#### Scenario: Invalid exerciseId
- **WHEN** a reference points to a missing catalog `exerciseId`
- **THEN** the reference is omitted from resolved output
- **THEN** validation on save or import reports the orphan reference
