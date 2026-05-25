# manual-list-import-folder Specification

## Purpose
TBD - created by archiving change remove-default-list-principle. Update Purpose after archive.
## Requirements
### Requirement: Dossier local de listes importables
The system SHALL provide an explicit local folder for JSON list files used for manual imports.

#### Scenario: Référencement du dossier
- **WHEN** l'application expose l'action d'import manuel
- **THEN** l'action indique clairement le chemin du dossier local configuré
- **AND** ce chemin doit pointer vers un répertoire dédié (ex. `DATA_DIR/manual-lists`)

### Requirement: Import explicite sans scan automatique
The system SHALL import lists from this folder only through explicit user/admin action. Imported JSON MUST use the catalog + reference format and the same strict validation as paste import (reject legacy shape).

#### Scenario: Pas de scan automatique au démarrage
- **WHEN** le système démarre
- **AND** des fichiers JSON sont présents dans le dossier d'import
- **THEN** ces fichiers ne sont pas importés automatiquement
- **AND** les listes existantes restent inchangées

#### Scenario: Import manuel déclenché
- **WHEN** l'opération d'import manuel est appelée avec un fichier ciblé
- **THEN** le JSON est validé (catalogue + références obligatoires)
- **THEN** le catalogue et les groupes importés sont persistés
- **THEN** une nouvelle liste est créée (ID non réservé) et activée si nécessaire
