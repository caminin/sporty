## Why

L'application permet déjà d'exporter une configuration d'exercices en JSON (copie dans le presse-papier). Il manque la fonctionnalité inverse : importer un fichier ou un JSON collé pour créer une nouvelle liste d'exercices. Cela permet de partager des listes, de restaurer des sauvegardes, ou de créer rapidement une liste à partir d'un template externe.

## What Changes

- Ajout d'un bouton ou d'une zone "Importer JSON" dans la page group-settings (onglet listes)
- Parsing et validation du JSON (format WorkoutConfig ou compatible avec migrateWorkoutConfig)
- Création d'une nouvelle liste à partir des données importées
- Gestion des erreurs : JSON invalide, structure incompatible, feedback utilisateur clair

## Capabilities

### New Capabilities

- `json-import-list`: Permet d'importer un JSON (collé ou fichier) pour créer une nouvelle liste d'exercices. Valide le format, applique la migration si nécessaire, crée la liste et la sélectionne.

### Modified Capabilities

- `group-settings`: La page group-settings doit exposer l'action d'import JSON dans la section listes.

## Impact

- `app/group-settings/page.tsx` : UI d'import (bouton, zone de texte ou input file)
- `app/exercises/lists-actions.ts` ou nouveau module : action `importListFromJson` (parse, validate, create)
- `app/exercises/workout-config.ts` : réutilisation de `migrateWorkoutConfig` pour compatibilité ancien format
- Types existants (`WorkoutConfig`, `ExerciseList`) inchangés
