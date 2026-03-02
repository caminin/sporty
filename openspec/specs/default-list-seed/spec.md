# default-list-seed Specification

## Purpose

Source de vérité pour le contenu initial de la liste par défaut, au format Group unifié. Permet d'initialiser une liste par défaut avec des groupes et exercices prédéfinis sans logique de migration de l'ancien format.

## Requirements

### Requirement: Fichier seed au format Group

Le système MUST fournir un fichier seed contenant une WorkoutConfig valide au format Group unifié.

#### Scenario: Structure du seed

- **WHEN** le fichier seed est chargé
- **THEN** il contient `globalRestTime` (number) et `groups` (Record<string, Group>)
- **THEN** chaque groupe a `id`, `name`, `icon`, `createdAt`, `exercises`
- **THEN** chaque exercice a `id`, `name`, `type`, `value`

#### Scenario: Validation de la structure

- **WHEN** le fichier seed est chargé
- **THEN** tous les groupes sont validés par `validateGroup`
- **THEN** les groupes invalides sont ignorés ou une erreur est levée selon la politique de chargement

### Requirement: Chargement du seed par ensureDefaultList

Le système MUST charger le seed par défaut lors de la création de la liste par défaut si aucune liste n'existe.

#### Scenario: Création avec seed

- **WHEN** `ensureDefaultList` est appelé et aucune liste par défaut n'existe
- **AND** le fichier default-seed.json existe et est valide
- **THEN** la liste par défaut est créée avec le contenu du seed
- **THEN** le globalRestTime est pris du seed

#### Scenario: Création sans seed

- **WHEN** `ensureDefaultList` est appelé et aucune liste par défaut n'existe
- **AND** le fichier default-seed.json est absent ou invalide
- **THEN** la liste par défaut est créée avec `globalRestTime: 15` et `groups: {}`
- **THEN** un avertissement est loggé
