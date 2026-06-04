# default-list-seed Specification

## Purpose

Bundled defaults from `exercice_list/` replace the former explicit seed mechanism.

## Requirements

### Requirement: Bundled defaults replace explicit seed
The system SHALL NOT use `default-seed.json` or `seedExerciseList`. Initial and reset data SHALL come from bundled `exercice_list/catalog.json` and bundled `entrainement-*.json` files copied at build time.

#### Scenario: No default-seed.json in app
- **WHEN** the codebase is built for production
- **THEN** `app/exercises/default-seed.json` does not exist
- **THEN** no server action named `seedExerciseList` is exposed in admin UI

#### Scenario: Reset uses bundle instead of seed
- **WHEN** the admin resets to bundled defaults
- **THEN** catalog and default trainings are loaded from build assets, not from an embedded TypeScript seed object
