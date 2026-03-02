## Why

L'utilisateur souhaite étendre le système de gestion des exercices pour supporter plusieurs listes d'exercices au lieu d'une seule liste fixe. Actuellement, l'application ne peut charger qu'une seule liste d'exercices depuis `exercises.json`. Il faut permettre de créer, modifier et charger différentes listes d'exercices avec une protection par mot de passe admin.

## What Changes

- Créer un système de gestion des listes d'exercices avec authentification admin
- Permettre de créer, modifier et supprimer des listes d'exercices
- Ajouter un mot de passe admin "sporty" pour protéger les modifications
- Sauvegarder les listes sur le serveur dans des fichiers séparés
- Mettre à jour la configuration Docker pour persister les données avec des volumes

## Capabilities

### New Capabilities
- `exercise-lists-management`: Système de gestion des listes d'exercices avec authentification
- `exercise-lists-storage`: Stockage et chargement des listes depuis le serveur

### Modified Capabilities
- `group-settings`: Ajout de la gestion des listes dans l'interface d'administration
- Docker configuration: Ajout de volumes pour la persistance des listes

## Impact

- Nouveau système de stockage des listes d'exercices
- Interface d'administration étendue avec authentification
- Configuration Docker mise à jour
- API pour gérer les listes d'exercices