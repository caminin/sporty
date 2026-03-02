## MODIFIED Requirements

### Requirement: Chargement de configuration d'exercice
Le système DOIT charger la configuration d'exercices exclusivement depuis les listes sélectionnées, sans fallback vers exercises.json.

#### Scenario: Chargement depuis liste sélectionnée
- **WHEN** getWorkoutConfig() est appelé avec un listId
- **THEN** le système charge uniquement depuis la liste correspondante
- **AND** lève une erreur si la liste n'existe pas
- **AND** n'utilise pas exercises.json comme fallback

#### Scenario: Chargement de liste par défaut
- **WHEN** getWorkoutConfig() est appelé sans listId
- **THEN** le système charge la liste 'default'
- **AND** s'assure que la liste default existe (migration automatique si nécessaire)
- **AND** lève une erreur si la migration échoue

### Requirement: Suppression des références globales
Toutes les fonctions de gestion d'exercices DOIVENT accepter un paramètre listId et travailler exclusivement avec les listes.

#### Scenario: Opérations sur exercices spécifiques à une liste
- **WHEN** addExercise, deleteExercise, ou updateGlobalRestTime sont appelés
- **THEN** ces fonctions modifient uniquement la liste spécifiée
- **AND** sauvegardent les changements dans le système de listes
- **AND** ne touchent pas exercises.json

### Requirement: Migration unique
Le système DOIT effectuer la migration depuis exercises.json vers la liste par défaut une seule fois.

#### Scenario: Migration au premier démarrage
- **WHEN** l'application démarre pour la première fois après ce changement
- **THEN** le système migre automatiquement exercises.json vers la liste 'default'
- **AND** marque la migration comme terminée
- **AND** ne tente plus de lire exercises.json par la suite