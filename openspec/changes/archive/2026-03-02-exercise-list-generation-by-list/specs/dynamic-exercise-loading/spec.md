## ADDED Requirements

### Requirement: Chargement exclusif depuis les listes
Le système DOIT charger les exercices exclusivement depuis le système de listes, sans fallback vers exercises.json.

#### Scenario: Chargement normal
- **WHEN** l'application démarre
- **THEN** le système initialise uniquement le système de listes
- **AND** ne tente pas de lire exercises.json

#### Scenario: Migration automatique
- **WHEN** aucune liste n'existe encore
- **THEN** le système effectue automatiquement la migration depuis exercises.json
- **AND** crée la liste par défaut
- **AND** supprime la dépendance à exercises.json après migration

### Requirement: Gestion d'erreur sans fallback
Le système DOIT lever une erreur explicite si aucune liste n'est disponible au lieu d'utiliser un fallback.

#### Scenario: Aucune liste disponible
- **WHEN** le système de listes est vide et exercises.json n'existe pas
- **THEN** le système affiche un message d'erreur clair
- **AND** empêche le démarrage de l'application
- **AND** guide l'utilisateur vers la création d'une liste

### Requirement: Validation des listes
Le système DOIT valider l'intégrité des listes chargées.

#### Scenario: Liste corrompue
- **WHEN** une liste contient des données invalides
- **THEN** le système ignore la liste corrompue
- **AND** log l'erreur
- **AND** continue avec les autres listes disponibles