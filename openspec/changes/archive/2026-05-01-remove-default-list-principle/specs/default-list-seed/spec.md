## MODIFIED Requirements

### Requirement: Chargement du seed par action explicite
The system MUST charge le seed **seulement** lorsqu’une action utilisateur/admin explicite le demande (pas lors de l’initialisation du stockage).

#### Scenario: Initialisation explicite depuis un identifiant de liste
- **WHEN** `seedExerciseList(listId)` est appelée avec un `listId` valide
- **THEN** le fichier `default-seed.json` est lu et validé
- **THEN** les groupes valides sont filtrés avec `validateGroup`
- **THEN** le seed est appliqué sur la liste cible
- **THEN** `globalRestTime` et `groups` reflètent le seed (ou la valeur de secours définie) pour cette liste

#### Scenario: Chargement explicite sans seed
- **WHEN** `seedExerciseList(listId)` est appelée
- **AND** `default-seed.json` est absent ou invalide
- **THEN** la liste cible reçoit `globalRestTime: 15` et `groups: {}`
- **THEN** l’opération échoue uniquement si la liste cible est introuvable

### Requirement: Suppression de l’initialisation implicite par `ensureDefaultList`
The system MUST NOT créer automatiquement une liste de type default lors de l’initialisation.

#### Scenario: Initialisation sans création implicite
- **WHEN** `initializeExerciseLists()` est appelée sur un stockage vide
- **THEN** le système crée le répertoire de données si nécessaire
- **THEN** aucune liste n’est auto-créée
- **THEN** aucune liste n’obtient un identifiant réservé de type `default`

