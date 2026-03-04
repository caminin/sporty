# admin-password-config Specification

## Purpose
TBD - created by archiving change admin-password-env-var. Update Purpose after archive.
## Requirements
### Requirement: Mot de passe admin configurable via variable d'environnement

Le système SHALL lire le mot de passe admin depuis la variable d'environnement `ADMIN_PASSWORD` pour la vérification d'authentification des actions protégées (création, suppression, sauvegarde, import, reset de listes).

#### Scenario: Vérification avec variable définie

- **WHEN** `ADMIN_PASSWORD` est défini dans l'environnement (ex. `ADMIN_PASSWORD=secret123`)
- **AND** l'utilisateur fournit le mot de passe correct (`secret123`) pour une action admin
- **THEN** l'authentification réussit et l'action est exécutée

#### Scenario: Vérification avec mot de passe incorrect

- **WHEN** `ADMIN_PASSWORD` est défini
- **AND** l'utilisateur fournit un mot de passe incorrect
- **THEN** l'authentification échoue et l'action retourne une erreur (ex. "Invalid admin password")

#### Scenario: Fallback en développement

- **WHEN** `ADMIN_PASSWORD` n'est pas défini
- **THEN** le système utilise la valeur de fallback `'sporty'` pour la comparaison
- **AND** l'authentification fonctionne avec le mot de passe `'sporty'`

#### Scenario: Variable vide

- **WHEN** `ADMIN_PASSWORD` est défini mais vide (`ADMIN_PASSWORD=`)
- **THEN** le mot de passe attendu est la chaîne vide
- **AND** seul le mot de passe vide authentifie correctement

