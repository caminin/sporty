## ADDED Requirements

### Requirement: Bundle exercice_list at build time
The build pipeline SHALL copy committed files from `exercice_list/` (global `catalog.json` and default training JSON files) into application assets included in the production Docker image.

#### Scenario: Build embeds default data
- **WHEN** `npm run build` completes successfully
- **THEN** bundled copies of `catalog.json` and the two default training files exist under a stable app-relative path (e.g. `public/bundled-exercice-list/`)
- **THEN** the production image contains these bundled files

### Requirement: Reset to bundled defaults
The system SHALL provide an authenticated admin action **Réinitialiser** on the **Entraînements** tab that restores runtime data from bundled defaults: global catalog plus exactly the two default trainings. Bundled training display names SHALL be **Jambes** and **Haut du corps**.

#### Scenario: Reset with confirmation
- **WHEN** the admin clicks Réinitialiser and confirms
- **THEN** the global catalog is overwritten from bundled `catalog.json` (deduplicated catalog, curls included)
- **THEN** the two default training files are recreated from bundled entrainement JSON with names **Jambes** and **Haut du corps**
- **THEN** other trainings MAY be removed or left unchanged per implementation choice documented in release notes (default: remove non-bundled trainings)

#### Scenario: Reset cancelled
- **WHEN** the admin dismisses the confirmation dialog
- **THEN** no catalog or training files are modified

#### Scenario: Initialize empty data directory from bundle
- **WHEN** the application starts with an empty `DATA_DIR` and no catalog file
- **THEN** it MAY initialize catalog and default trainings from the same bundled JSON used by reset
- **THEN** the user can use the app without manual import
