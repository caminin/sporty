# Tests pour l'entité Workouts

Ce dossier contient les tests pour l'entité "workouts" (séances d'entraînement).

## Structure recommandée

```
app/__tests__/entities/workouts/
├── crud-operations.test.ts      # Tests CRUD de base
├── workout-execution.test.ts    # Tests d'exécution des workouts
├── timer-integration.test.ts    # Tests d'intégration avec le timer
├── data-validation.test.ts      # Tests de validation des données
├── error-handling.test.ts       # Tests de gestion d'erreurs
└── performance.test.ts          # Tests de performance
```

## Utilitaires partagés

Utilisez les utilitaires du dossier `../../shared/` :

- `tempFilesystemSetup` pour la configuration filesystem temporaire
- `createTestWorkout()` pour créer des workouts de test (à créer)
- `createTestExercise()` pour créer des exercices de test

## Exemple d'utilisation

```typescript
import { tempFilesystemSetup } from '../../shared/test-helpers';
import { createTestWorkout } from '../../shared/workout-helpers';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Workouts - CRUD Operations', () => {
  it('should create a new workout', async () => {
    const workout = await createTestWorkout('My Workout');
    expect(workout.id).toBeDefined();
    expect(workout.name).toBe('My Workout');
  });
});
```

## Helpers à créer

Vous devrez créer `app/__tests__/shared/workouts-helpers.ts` avec des fonctions comme :

- `createTestWorkout(name, config?)`
- `createWorkoutConfig(exercises?)`
- `createTestExercise(name, type, value)`

Cela permettra de réutiliser la logique de création d'objets de test entre tous les tests de workouts.