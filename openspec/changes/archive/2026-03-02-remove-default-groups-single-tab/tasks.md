## 1. Données et configuration

- [x] 1.1 Vider `app/exercises.json` : remplacer les groupes par `"groups": {}`, garder `globalRestTime`
- [x] 1.2 Modifier `migrateWorkoutConfig` dans `workout-config.ts` : pour l'ancien format (groupes en tableaux), ne plus créer de groupes prédéfinis ; retourner `groups: {}`

## 2. Nettoyage des types et actions

- [x] 2.1 Supprimer `PREDEFINED_GROUP_ICONS` et `generatePredefinedGroupId` de `app/exercises/types.ts`
- [x] 2.2 Modifier `addExercise` dans `actions.ts` : si le groupe n'existe pas, lever une erreur au lieu de créer un groupe prédéfini (ou créer un groupe avec id `custom_`)

## 3. Page group-settings : fusion des onglets

- [x] 3.1 Supprimer l'onglet "Groupes d'exercices" (prédéfinis) et l'onglet "Groupes personnalisés"
- [x] 3.2 Créer un seul onglet "Groupes d'exercices" qui affiche le contenu actuel de "Groupes personnalisés" (création + liste des groupes)
- [x] 3.3 Adapter le formulaire "premier groupe" (état vide) : appeler `createGroup` puis `addExerciseToGroup` au lieu de `addExercise` seul
- [x] 3.4 Conserver l'onglet "Gestion des listes" inchangé
- [x] 3.5 Mettre à jour le type `Tab` : `'groups' | 'lists'` (ou équivalent) et supprimer les références à `custom-groups`

## 4. Vérifications

- [x] 4.1 Vérifier que l'export JSON inclut tous les groupes
- [x] 4.2 Vérifier que le repos global et la liste active restent affichés dans l'onglet Groupes d'exercices
