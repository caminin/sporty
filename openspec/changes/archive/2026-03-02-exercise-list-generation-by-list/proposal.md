## Why

Actuellement, le système d'exercices repose encore partiellement sur un fichier global `exercises.json` comme source de vérité, malgré l'existence d'un système de listes d'exercices. Cela crée une dépendance au fichier global et limite la flexibilité du système de listes. L'utilisateur souhaite que la génération d'exercices soit entièrement basée sur les listes individuelles, permettant une gestion plus modulaire et flexible des programmes d'entraînement.

## What Changes

- **Suppression de la dépendance au fichier global** : Retirer les références à `exercises.json` dans le code de génération d'exercices
- **Chargement dynamique des listes** : Permettre à l'utilisateur de sélectionner et charger différentes listes d'exercices dans l'interface
- **Migration complète** : S'assurer que toutes les fonctionnalités utilisent exclusivement le système de listes
- **Interface de sélection de liste** : Ajouter une UI pour choisir quelle liste utiliser pour la session d'entraînement

## Capabilities

### New Capabilities
- `exercise-list-selection`: Interface utilisateur pour sélectionner et charger une liste d'exercices spécifique
- `dynamic-exercise-loading`: Système de chargement d'exercices basé uniquement sur les listes, sans fallback vers exercises.json

### Modified Capabilities
- `exercise-generation`: Modification pour utiliser exclusivement les listes au lieu du fichier global

## Impact

- Code affecté : `app/exercises-actions.ts`, `app/page.tsx`, `app/group-settings/page.tsx`, composants liés au timer
- Suppression du fichier `app/exercises.json` comme source de données active
- Nouvelle interface utilisateur pour la sélection de listes
- Changements dans la logique de chargement des exercices dans les sessions d'entraînement