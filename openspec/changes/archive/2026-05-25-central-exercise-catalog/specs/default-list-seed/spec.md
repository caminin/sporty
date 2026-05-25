## MODIFIED Requirements

### Requirement: Fichier seed au format Group

Le système MUST fournir un fichier seed contenant une WorkoutConfig valide avec catalogue `exercises` et groupes en références.

#### Scenario: Structure du seed

- **WHEN** le fichier seed est chargé
- **THEN** il contient `globalRestTime`, `exercises` (catalogue), et `groups`
- **THEN** chaque groupe a `id`, `name`, `icon`, `color`, `createdAt`, `exercises` (tableau de références)
- **THEN** chaque référence a `refId`, `exerciseId`, et `value` optionnel
- **THEN** chaque entrée catalogue a `id`, `name`, `type`, `value`

#### Scenario: Validation de la structure

- **WHEN** le fichier seed est chargé
- **THEN** le catalogue et les groupes sont validés (références résolvables)
- **THEN** les groupes ou exercices invalides sont ignorés ou une erreur est levée selon la politique de chargement

### Requirement: Chargement du seed par action explicite
The system MUST charge le seed **seulement** lorsqu'une action utilisateur/admin explicite le demande.

#### Scenario: Initialisation explicite depuis un identifiant de liste
- **WHEN** `seedExerciseList(listId)` est appelée avec un `listId` valide
- **THEN** le fichier `default-seed.json` est lu et validé (catalogue + références)
- **THEN** le seed est appliqué sur la liste cible
- **THEN** `globalRestTime`, `exercises`, et `groups` reflètent le seed

#### Scenario: Chargement explicite sans seed
- **WHEN** `seedExerciseList(listId)` est appelée
- **AND** `default-seed.json` est absent ou invalide
- **THEN** la liste cible reçoit `globalRestTime: 15`, `exercises: {}`, et `groups: {}`
- **THEN** l'opération échoue uniquement si la liste cible est introuvable
