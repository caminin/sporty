## MODIFIED Requirements

### Requirement: Bundle exercice_list at build time
The build and development toolchain SHALL treat `exercice_list/` as the single editable source for bundled defaults. It SHALL generate `public/bundled-exercice-list/` from that source before any workflow that depends on bundled assets (including build, development startup, and automated checks that read bundled defaults).

#### Scenario: Build embeds generated defaults
- **WHEN** `npm run build` completes successfully
- **THEN** bundled copies of `catalog.json` and the two default training files exist under `public/bundled-exercice-list/`
- **THEN** generated bundled files are byte-equivalent to the canonical source files from `exercice_list/`
- **THEN** the production image contains these generated bundled files

#### Scenario: Development uses generated defaults
- **WHEN** a developer starts a local workflow that serves or validates bundled defaults
- **THEN** `public/bundled-exercice-list/` is regenerated from `exercice_list/` before bundled files are consumed
- **THEN** no manual edit in the bundled folder is required to reflect source changes

#### Scenario: Out-of-sync bundled files are rejected
- **WHEN** source files in `exercice_list/` differ from generated files in `public/bundled-exercice-list/`
- **THEN** the synchronization check fails with an explicit remediation message
- **THEN** CI/local validation exits non-zero until bundle generation is rerun

### Requirement: Reset to bundled defaults
The system SHALL provide an authenticated admin action **Réinitialiser** on the **Entraînements** tab that restores runtime data from bundled defaults generated from canonical `exercice_list/` data: global catalog plus exactly the two default trainings. Bundled training display names SHALL be **Jambes** and **Haut du corps**.

#### Scenario: Reset with confirmation
- **WHEN** the admin clicks Réinitialiser and confirms
- **THEN** the global catalog is overwritten from bundled `catalog.json` generated from canonical source data
- **THEN** the two default training files are recreated from bundled training JSON with names **Jambes** and **Haut du corps**
- **THEN** other trainings MAY be removed or left unchanged per implementation choice documented in release notes (default: remove non-bundled trainings)

#### Scenario: Reset cancelled
- **WHEN** the admin dismisses the confirmation dialog
- **THEN** no catalog or training files are modified

#### Scenario: Initialize empty data directory from generated bundle
- **WHEN** the application starts with an empty `DATA_DIR` and no catalog file
- **THEN** it MAY initialize catalog and default trainings from the same generated bundled JSON used by reset
- **THEN** the user can use the app without manual import
