## ADDED Requirements

### Requirement: Exercise Lists File Storage
Le système DOIT stocker chaque liste d'exercices dans un fichier JSON séparé dans le répertoire `/data/exercise-lists/`.

#### Scenario: List file naming convention
- **WHEN** une nouvelle liste est créée avec l'identifiant "my-workout"
- **THEN** un fichier `my-workout.json` est créé dans `/data/exercise-lists/`

#### Scenario: List file structure
- **WHEN** une liste est sauvegardée
- **THEN** le fichier JSON contient les métadonnées (nom, description, date de création)
- **THEN** le fichier contient le contenu des exercices identique au format `exercises.json` actuel

### Requirement: Exercise Lists Loading
Le système DOIT permettre de charger n'importe quelle liste d'exercices depuis le stockage serveur.

#### Scenario: Available lists enumeration
- **WHEN** l'utilisateur accède à la gestion des listes
- **THEN** le système liste tous les fichiers `.json` du répertoire `/data/exercise-lists/`
- **THEN** les métadonnées de chaque liste sont affichées (nom, description)

#### Scenario: List content loading
- **WHEN** une liste est sélectionnée
- **THEN** son fichier JSON est lu depuis le serveur
- **THEN** les exercices sont chargés dans l'interface d'administration

### Requirement: Default List Migration
Le système DOIT migrer automatiquement `exercises.json` existant vers une liste par défaut lors du premier démarrage.

#### Scenario: Automatic migration on first run
- **WHEN** l'application démarre pour la première fois avec le nouveau système
- **THEN** le contenu de `exercises.json` est copié vers `/data/exercise-lists/default.json`
- **THEN** la liste "default" devient la liste active

#### Scenario: Backward compatibility
- **WHEN** aucune liste n'est explicitement sélectionnée
- **THEN** la liste "default" est automatiquement chargée