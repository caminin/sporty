# list-system-testing Specification (Delta)

## MODIFIED Requirements

### Requirement: Test de l'Initialisation Automatique

Le système de test SHALL vérifier l'initialisation automatique du système de listes.

#### Scenario: Création automatique de la liste par défaut

- **WHEN** le système est initialisé sans listes existantes
- **THEN** le système SHALL créer automatiquement une liste par défaut avec la configuration appropriée

#### Scenario: Chargement du seed par défaut

- **WHEN** le fichier default-seed.json existe et aucune liste par défaut n'est présente
- **THEN** le système SHALL charger le contenu du seed et créer la liste par défaut avec ce contenu

#### Scenario: Fallback sans seed

- **WHEN** le fichier default-seed.json est absent et aucune liste par défaut n'est présente
- **THEN** le système SHALL créer une liste par défaut vide (groups: {})
