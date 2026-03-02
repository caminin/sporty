## Why

Après l'implémentation du système de listes d'exercices, les utilisateurs ne peuvent ajouter des exercices que dans la liste par défaut. Cette limitation rend le système de listes inutilisable pour créer des programmes d'entraînement personnalisés, car tous les nouveaux exercices sont automatiquement ajoutés à la liste 'default' indépendamment de la liste actuellement sélectionnée.

## What Changes

- **Correction de l'ajout d'exercices** : Modifier l'interface de gestion des exercices pour permettre l'ajout dans n'importe quelle liste sélectionnée
- **Sélection de liste dans l'interface** : Ajouter un sélecteur de liste dans l'interface d'ajout d'exercices
- **Synchronisation avec la liste active** : S'assurer que les opérations d'ajout/modification/suppression utilisent toujours la liste actuellement sélectionnée

## Capabilities

### New Capabilities
- `exercise-list-management`: Interface complète pour gérer les exercices dans différentes listes

### Modified Capabilities
- `exercise-group-display`: Modification pour permettre l'ajout d'exercices dans n'importe quelle liste sélectionnée

## Impact

- Code affecté : `app/group-settings/page.tsx`, composants d'ajout d'exercices
- Interface utilisateur : Ajout d'un sélecteur de liste dans l'interface de gestion des exercices
- Fonctionnalité : Possibilité d'ajouter des exercices dans toutes les listes disponibles