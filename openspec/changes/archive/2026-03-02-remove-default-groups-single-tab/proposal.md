## Why

L'utilisateur souhaite simplifier la page des paramètres de groupes : supprimer les groupes prédéfinis (Cardio endurance, Épaules et frappe, Adbos, etc.) et ne conserver que des groupes personnalisés créés par l'utilisateur. Cela réduit la complexité de l'interface en fusionnant les deux onglets "Groupes d'exercices" et "Groupes personnalisés" en un seul.

## What Changes

- Suppression des 5 groupes prédéfinis (Cardio endurance, Épaules et frappe, Adbos, Explosivité jambes, Agilité et déplacements)
- Fusion des onglets "Groupes d'exercices" et "Groupes personnalisés" en un seul onglet "Groupes d'exercices"
- La page `/group-settings` affiche désormais 2 onglets : "Groupes d'exercices" et "Gestion des listes"
- **BREAKING** : `exercises.json` ne contient plus de groupes par défaut ; les nouvelles listes démarrent avec `groups: {}`
- **BREAKING** : La migration depuis l'ancien format ne crée plus de groupes prédéfinis ; les données existantes migrées perdent les groupes prédéfinis (ou on les convertit en groupes personnalisés selon la stratégie choisie)

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `group-settings` : suppression de la distinction groupes prédéfinis / personnalisés ; un seul onglet pour tous les groupes (tous personnalisés)
- `custom-group-storage` : plus de groupes prédéfinis ; tous les groupes suivent le modèle des groupes personnalisés
- `exercise-group-creation` : l'interface de création n'est plus dans un onglet séparé "Groupes personnalisés" mais dans l'unique onglet "Groupes d'exercices"

## Impact

- `app/group-settings/page.tsx` : suppression du tab "groups" (prédéfinis), fusion du contenu dans un seul onglet
- `app/exercises.json` : vider les groupes ou les supprimer
- `app/exercises/types.ts` : suppression de `PREDEFINED_GROUP_ICONS`, `generatePredefinedGroupId` (ou adaptation)
- `app/exercises/actions.ts` : `addExercise` ne doit plus créer de groupes "prédéfinis" ; tous les groupes sont créés via `createGroup`
- `app/exercises/workout-config.ts` : migration ne doit plus créer de groupes prédéfinis depuis l'ancien format
- `app/exercises/lists.ts` : `ensureDefaultList` démarre avec `groups: {}` si pas de migration
- Spécifications : `openspec/specs/group-settings/spec.md`, `exercise-group-creation`, `custom-group-storage`
