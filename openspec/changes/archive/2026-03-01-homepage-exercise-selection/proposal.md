## Why

Actuellement, la page d'accueil affiche **tous** les exercices de `exercises.json` et les inclut automatiquement dans la séance. L'utilisateur n'a aucun moyen de choisir quels exercices faire ce jour précis sans aller les supprimer manuellement (ce qui les efface définitivement). Il faut permettre de **sélectionner les exercices voulus pour la séance** sans modifier `exercises.json`, et mémoriser cette sélection en localStorage pour éviter de la re-saisir à chaque ouverture.

## What Changes

- Ajout d'une UI de sélection sur la page d'accueil : chaque exercice aura une case à cocher (ou un toggle) pour l'inclure ou l'exclure de la séance en cours
- La sélection est sauvegardée en **localStorage** et restaurée automatiquement à l'ouverture
- La fonctionnalité "Lancer la séance" n'utilise que les exercices **sélectionnés**
- Le compteur "Exercices total" dans le résumé de séance reflète uniquement les exercices sélectionnés
- La création/suppression d'exercices reste **uniquement dans les Settings** (`/group-settings`) ; on retire les boutons "Ajouter un exercice" et "Supprimer" de la page d'accueil

## Capabilities

### New Capabilities

- `session-exercise-selection`: Permet à l'utilisateur de cocher/décocher les exercices à inclure dans la séance depuis la page d'accueil. La sélection est persistée en localStorage.

### Modified Capabilities

- `home-page-exercise-management`: La page d'accueil ne permet plus d'ajouter ni de supprimer des exercices (lecture seule + sélection). Les requirements d'édition inline sont retirés de ce spec.

## Impact

- `app/page.tsx` : refactoring du composant `ExerciseGroupBlock` et de la logique principale (ajout état de sélection, suppression des formulaires Add/Delete)
- `app/session-utils.ts` : `buildSessionSteps` doit filtrer selon la sélection
- Aucune modification de `exercises.json` ni des Server Actions (`exercises-actions.ts`)
- Aucune nouvelle dépendance externe (localStorage natif)
