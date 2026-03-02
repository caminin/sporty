## Why

Le système de listes d'exercices permet aux utilisateurs de créer et gérer plusieurs configurations d'entraînement. Cependant, il n'existe actuellement aucun système de test automatisé pour vérifier que cette fonctionnalité fonctionne correctement. En particulier, l'ajout d'éléments dans des listes non-par défaut n'est pas testé, ce qui peut entraîner des bugs non détectés lors de l'utilisation de listes personnalisées.

## What Changes

- Ajouter un fichier de tests complet pour le système de listes d'exercices (`exercise-lists.test.ts`)
- Tester toutes les fonctionnalités CRUD (Create, Read, Update, Delete) des listes
- Vérifier spécifiquement l'ajout d'exercices dans des listes non-par défaut
- Tester la validation des données et la gestion d'erreur
- Tester l'initialisation et la migration automatique vers la liste par défaut
- S'assurer que les listes sont correctement sauvegardées et chargées depuis le système de fichiers

## Capabilities

### New Capabilities
- `list-system-testing`: Tests automatisés complets pour le système de gestion des listes d'exercices, incluant la validation des opérations CRUD et l'ajout d'éléments dans des listes personnalisées

### Modified Capabilities
<!-- Aucune modification des spécifications existantes -->

## Impact

- Code affecté: `app/exercise-lists.ts`, `app/exercise-lists-actions.ts`
- Tests: Nouveau fichier `app/exercise-lists.test.ts`
- Dépendances: Utilisation du framework de test existant (Jest)
- Système de fichiers: Tests nécessiteront un répertoire temporaire pour les tests de sauvegarde/chargement