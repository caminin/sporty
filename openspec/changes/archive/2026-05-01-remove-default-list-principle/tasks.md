## 1. Backend Core Refactor

- [x] 1.1 Supprimer l’appel automatique à `ensureDefaultList()` dans `initializeExerciseLists()` ou adapter `initializeExerciseLists()` pour ne plus créer d’entité `default`.
- [x] 1.2 Supprimer la logique `default` explicite dans `removeList` et autres protections (ex. blocage suppression `listId === 'default'`).
- [x] 1.3 Remplacer `ensureDefaultList()`/`resetDefaultList()` dans `app/exercises/lists.ts` par un flux seed explicite lié à une action admin (ex. `seedExerciseList(listId)`).
- [x] 1.4 Ajouter/valider une constante `MANUAL_LISTS_DIR` (ou équivalent) dans le module de stockage, basée sur `DATA_DIR/manual-lists`.

## 2. List Import UX API

- [x] 2.1 Implémenter une action serveur explicite `importListFromManualFolder` qui importe uniquement un fichier ciblé, avec parsing/migration/validation.
- [x] 2.2 Retirer tout scan automatique au boot du répertoire `manual-lists` (aucune découverte implicite au démarrage).
- [x] 2.3 Documenter ou exposer la liste des fichiers importables sans effet secondaire (read-only), pour sélection manuelle utilisateur.

## 3. Actions and Default ID Elimination

- [x] 3.1 Remplacer les signatures de `getWorkoutConfig` et `saveWorkoutList`/`saveWorkoutConfigForList` pour que `listId` soit requis explicitement (ou échoue proprement si absent).
- [x] 3.2 Supprimer la création forcée d’une liste `default` en fallback dans `saveWorkoutConfigForList`.
- [x] 3.3 Mettre à jour les points d’appel (routes/components/actions) pour fournir explicitement la liste active/choisie.
- [x] 3.4 Ajouter une stratégie claire quand aucune liste n’est sélectionnée (message d’erreur actionnable, UI de sélection).

## 4. Tests and Specs Alignment

- [x] 4.1 Mettre à jour `app/__tests__/entities/exercise-lists/initialization-migration.test.ts` pour retirer les assertions de création auto de `default`.
- [x] 4.2 Ajouter des tests sur l’absence d’auto-création (`initializeExerciseLists` n’ajoute aucune liste par défaut).
- [x] 4.3 Ajouter des tests de rejet explicite pour `listId` manquant dans les actions mutation.
- [x] 4.4 Ajouter un test de couverture import manuel ciblé (fichier choisi par nom, pas scan global).
- [x] 4.5 Valider les tests existants de seed en mode explicit-only avec comportement de fallback.

## 5. Documentation and Migration

- [x] 5.1 Mettre à jour la documentation d’usage pour le nouveau modèle “toutes les listes se valent”.
- [x] 5.2 Décrire la procédure de migration des données existantes contenant la liste `default`.
- [x] 5.3 Ajouter une note de rollback opérationnel (réactiver temporairement init implicite si nécessaire).

