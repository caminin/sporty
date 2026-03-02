## Why

L'interface utilisateur pour la sélection de listes d'exercices présente des problèmes de réactivité et de cohérence. Lorsque l'utilisateur clique sur une nouvelle liste, l'indicateur visuel de sélection (carré vert) ne se met pas à jour, et le bouton "ajouter" reste masqué pour toutes les listes autres que celle par défaut. Ces problèmes rendent l'interface confuse et empêchent une utilisation fluide du système de listes d'exercices.

## What Changes

- **Correction de l'indicateur visuel de sélection** : Le carré vert doit suivre correctement la liste sélectionnée
- **Affichage conditionnel du bouton ajouter** : Le bouton "ajouter" doit apparaître dans toutes les listes d'exercices, pas seulement la liste par défaut
- **Synchronisation état-interface** : L'état de sélection de liste doit être correctement synchronisé avec l'interface utilisateur

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `exercise-list-management`: Correction de l'interface de sélection et de l'affichage du bouton ajouter
- `exercise-list-selection`: Amélioration de l'indicateur visuel de sélection de liste

## Impact

- Interface utilisateur : Correction de l'indicateur visuel de sélection et de l'affichage du bouton ajouter
- Composants affectés : `ExerciseListSelector.tsx`, composants de gestion d'exercices
- Expérience utilisateur : Navigation fluide entre les listes d'exercices