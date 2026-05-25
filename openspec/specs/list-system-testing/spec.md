# list-system-testing Specification

## Purpose
TBD - created by archiving change add-list-system-tests. Update Purpose after archive.
## Requirements
### Requirement: Test Coverage for List CRUD Operations
Le système de test SHALL couvrir toutes les opérations CRUD (Create, Read, Update, Delete) du système de listes d'exercices.

#### Scenario: Création de liste testée
- **WHEN** une nouvelle liste d'exercices est créée
- **THEN** le système de test SHALL vérifier que la liste est correctement sauvegardée avec un ID unique et des métadonnées valides

#### Scenario: Lecture de liste testée
- **WHEN** une liste existante est chargée
- **THEN** le système de test SHALL vérifier que toutes les données sont correctement récupérées et validées

#### Scenario: Mise à jour de liste testée
- **WHEN** la configuration d'une liste est modifiée
- **THEN** le système de test SHALL vérifier que les changements sont persistés et que l'horodatage est mis à jour

#### Scenario: Suppression de liste testée
- **WHEN** une liste est supprimée
- **THEN** le système de test SHALL vérifier que le fichier est supprimé et que la liste n'est plus accessible

### Requirement: Validation des Données d'Exercice
Le système de test SHALL valider l'intégrité des données d'exercice dans les listes.

#### Scenario: Données valides acceptées
- **WHEN** des exercices avec des propriétés valides sont ajoutés à une liste
- **THEN** le système SHALL accepter les données sans erreur

#### Scenario: Données invalides rejetées
- **WHEN** des exercices avec des propriétés invalides sont ajoutés
- **THEN** le système SHALL rejeter les données avec une erreur appropriée

### Requirement: Test de l'Ajout d'Exercices dans Listes Non-Par Défaut
Le système de test SHALL spécifiquement vérifier l'ajout d'exercices dans des listes autres que la liste par défaut.

#### Scenario: Ajout dans liste personnalisée vide
- **WHEN** des exercices sont ajoutés à une nouvelle liste personnalisée
- **THEN** le système SHALL correctement sauvegarder les exercices dans la liste personnalisée sans affecter d'autres listes

#### Scenario: Ajout dans liste personnalisée existante
- **WHEN** des exercices sont ajoutés à une liste personnalisée déjà existante avec des exercices
- **THEN** le système SHALL préserver les exercices existants et ajouter les nouveaux sans duplication

#### Scenario: Isolation entre listes
- **WHEN** des exercices sont ajoutés à différentes listes personnalisées
- **THEN** chaque liste SHALL maintenir ses propres exercices indépendamment des autres

### Requirement: Test de l'Initialisation Automatique
Le système de test SHALL vérifier l'initialisation du système de listes sans automatisme de liste par défaut.

#### Scenario: Initialisation sur stockage vide
- **WHEN** le système est initialisé sans aucune liste existante
- **THEN** aucune liste par défaut n'est créée
- **AND** le système doit rester en état prêt (répertoire présent + API de listes opérationnelle)

#### Scenario: Initialisation avec listes existantes
- **WHEN** des listes existent déjà sur le disque
- **THEN** le système SHALL les conserver telles quelles
- **THEN** le système SHALL ne pas en créer de nouvelles

### Requirement: Test de la Gestion d'Erreurs
Le système de test SHALL vérifier la gestion appropriée des erreurs du système de fichiers.

#### Scenario: Erreur de lecture de fichier corrompu
- **WHEN** un fichier de liste contient des données JSON invalides
- **THEN** le système SHALL retourner null et logger un avertissement sans planter

#### Scenario: Erreur d'accès au répertoire
- **WHEN** le répertoire de données n'est pas accessible en écriture
- **THEN** le système SHALL retourner une erreur descriptive avec des instructions de dépannage

#### Scenario: Erreur de suppression de liste inexistante
- **WHEN** une tentative de suppression d'une liste inexistante est faite
- **THEN** le système SHALL gérer l'erreur gracieusement sans affecter les autres opérations

### Requirement: Test d'Intégration Complet
Le système de test SHALL inclure des tests d'intégration vérifiant le workflow complet de gestion des listes.

#### Scenario: Workflow complet CRUD
- **WHEN** un utilisateur effectue un cycle complet : créer → ajouter exercices → modifier → sauvegarder → charger → supprimer
- **THEN** toutes les opérations SHALL réussir et les données SHALL rester cohérentes tout au long du processus

#### Scenario: Gestion de plusieurs listes simultanées
- **WHEN** plusieurs listes sont créées et modifiées simultanément
- **THEN** le système SHALL maintenir l'isolation des données entre toutes les listes

### Requirement: Test utilities for exercise lists
The list system test suite SHALL use shared helpers that build and assert on WorkoutConfig in catalog + reference format. Tests that construct groups with embedded exercise objects SHALL be updated to use catalog entries and group references.

#### Scenario: Helpers create valid v2 configs
- **WHEN** tests use `createTestConfig`, `createCustomTestConfig`, or `createTrackedTestList`
- **THEN** `config.exercises` is present and group placements are references
- **THEN** validation tests in `data-validation.test.ts` assert catalog and reference integrity

#### Scenario: Invalid format is rejected
- **WHEN** tests load or import config without `exercises` or with embedded group exercises
- **THEN** validation fails with an explicit error
- **THEN** no silent conversion occurs

### Requirement: Admin UI simplification test coverage
The test suite SHALL cover catalog default value editing and simplified group/import admin behavior where integration or component tests exist for list management.

#### Scenario: Catalog default update persists
- **WHEN** tests update a catalog exercise default `value` through the catalog API or action used by the admin tab
- **THEN** the persisted list reflects the new default
- **THEN** a group reference without override resolves to the updated default

#### Scenario: Add to group without override
- **WHEN** tests add a catalog exercise to a session group through the group action without an override argument
- **THEN** the new reference has no `value` field
- **THEN** resolved output uses the catalog default

### Requirement: Split catalog and groups import export tests
The list system test suite SHALL cover separate catalog and groups JSON import/export paths, replace-all catalog confirmation behavior, and strict rejection of orphan group references.

#### Scenario: Catalog-only import creates list
- **WHEN** tests call catalog import with valid `exercises` JSON and a list name
- **THEN** a new list is created with the catalog persisted
- **THEN** `groups` may be empty

#### Scenario: Groups import rejects orphan exerciseId
- **WHEN** tests import groups JSON referencing an `exerciseId` not in the active catalog
- **THEN** import fails with an explicit error
- **THEN** the stored list is unchanged

#### Scenario: Replace all catalog clears then imports
- **WHEN** tests import catalog with replace-all into a list that had exercises
- **THEN** previous catalog ids not in import are removed after successful validation
- **WHEN** remaining group references would be orphan
- **THEN** import fails before persist

#### Scenario: Export helpers produce split shapes
- **WHEN** tests export catalog and groups separately
- **THEN** catalog export contains `exercises` without requiring `groups`
- **THEN** groups export contains `groups` with reference-only entries

