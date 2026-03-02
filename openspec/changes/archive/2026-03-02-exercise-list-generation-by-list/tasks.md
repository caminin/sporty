## 1. Modification du système de chargement d'exercices

- [x] 1.1 Supprimer le fallback vers exercises.json dans getWorkoutConfig()
- [x] 1.2 Modifier la gestion d'erreur pour lever des exceptions explicites au lieu d'utiliser un fallback
- [x] 1.3 Mettre à jour initializeExerciseLists() pour ne plus dépendre d'exercises.json
- [x] 1.4 Ajouter une fonction de validation d'intégrité des listes

## 2. Interface de sélection de liste

- [x] 2.1 Créer un composant ExerciseListSelector pour l'interface utilisateur
- [x] 2.2 Ajouter un état global pour maintenir la liste actuellement sélectionnée
- [x] 2.3 Intégrer le sélecteur dans la page principale (app/page.tsx)
- [x] 2.4 Implémenter la persistance de la sélection pendant la session

## 3. Gestion des erreurs et migration

- [x] 3.1 Modifier la logique de migration pour qu'elle soit unique et définitive
- [x] 3.2 Ajouter des messages d'erreur explicites pour les cas d'échec
- [x] 3.3 Implémenter la gestion des listes corrompues (logging et skip)
- [x] 3.4 Tester les scénarios d'erreur et de récupération

## 4. Mise à jour des composants existants

- [x] 4.1 Modifier app/page.tsx pour utiliser la liste sélectionnée
- [x] 4.2 Modifier app/group-settings/page.tsx pour utiliser la liste sélectionnée
- [x] 4.3 Vérifier que tous les appels à getWorkoutConfig() passent le bon listId
- [x] 4.4 Tester la compatibilité avec les fonctionnalités existantes

## 5. Tests et validation

- [x] 5.1 Créer des tests pour le chargement exclusif depuis les listes
- [x] 5.2 Tester l'interface de sélection de liste
- [x] 5.3 Valider la migration automatique et unique
- [x] 5.4 Tester les scénarios d'erreur et de récupération