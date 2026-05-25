## REMOVED Requirements

### Requirement: Fichier seed au format Group
**Reason**: `default-seed.json` and explicit seed APIs are removed; lists are created via import or empty config.
**Migration**: Import from `exercice_list/*.json` or create an empty list and configure via the three admin tabs.

### Requirement: Chargement du seed par action explicite
**Reason**: No seed file or `seedExerciseList` API.
**Migration**: Duplicate a list by export/import or copy JSON from `exercice_list/`.

### Requirement: Suppression de l'initialisation implicite par `ensureDefaultList`
**Reason**: Requirement already satisfied; retained in main spec without seed dependency.
**Migration**: N/A — behavior unchanged.
