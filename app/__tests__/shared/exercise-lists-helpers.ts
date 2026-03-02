import { WorkoutConfig } from '../../exercises/types';
import { ExerciseList } from '../../exercises/lists';
import { createTrackedExerciseList } from './test-helpers';

/** Convertit un groupe au format tableau vers le format unifié */
function toUnifiedGroup(name: string, exercises: { id: string; name: string; type: 'reps' | 'time'; value: number }[]) {
  return {
    id: `custom_${name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
    name,
    icon: 'Activity',
    createdAt: new Date().toISOString(),
    exercises
  };
}

/**
 * Utilitaires pour créer des configurations de test pour les listes d'exercices
 */
export function createTestConfig(overrides?: Partial<WorkoutConfig>): WorkoutConfig {
  return {
    globalRestTime: 30,
    groups: {
      'Push': toUnifiedGroup('Push', [
        { id: 'push1', name: 'Push-ups', type: 'reps', value: 10 },
        { id: 'push2', name: 'Bench Press', type: 'reps', value: 8 }
      ]),
      'Pull': toUnifiedGroup('Pull', [
        { id: 'pull1', name: 'Pull-ups', type: 'reps', value: 8 },
        { id: 'pull2', name: 'Rows', type: 'reps', value: 10 }
      ]),
      'Legs': toUnifiedGroup('Legs', [
        { id: 'legs1', name: 'Squats', type: 'reps', value: 12 },
        { id: 'legs2', name: 'Lunges', type: 'reps', value: 10 }
      ])
    },
    ...overrides
  };
}

/**
 * Crée une liste d'exercices de test
 */
export function createTestList(name: string = 'Test List', config?: WorkoutConfig): ExerciseList {
  const now = new Date().toISOString();
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description: `Test list: ${name}`,
    createdAt: now,
    updatedAt: now,
    config: config || createTestConfig()
  };
}

/**
 * Crée une liste d'exercices de test avec tracking automatique pour le nettoyage
 */
export function createTrackedTestList(name: string = 'Test List', config?: WorkoutConfig): ExerciseList {
  const list = createTestList(name, config);

  // Tracker automatiquement si on est dans un environnement de test
  if (typeof process !== 'undefined' && process.env.DATA_DIR?.includes('tmp/test-data')) {
    try {
      // Importer dynamiquement pour éviter les dépendances circulaires
      const { createdListIds } = require('./test-helpers');
      createdListIds.push(list.id);
    } catch {
      // Ignore les erreurs d'import
    }
  }

  return list;
}

/**
 * Crée une configuration de test minimale (liste vide)
 */
export function createEmptyTestConfig(): WorkoutConfig {
  return {
    globalRestTime: 5,
    groups: {}
  };
}

/**
 * Crée une configuration de test avec des exercices personnalisés.
 * Accepte groups au format ancien (tableaux) ou nouveau (objets Group).
 */
export function createCustomTestConfig(
  groups: Record<string, { id: string; name: string; icon?: string; createdAt?: string; exercises: { id: string; name: string; type: 'reps' | 'time'; value: number }[] } | { id: string; name: string; type: 'reps' | 'time'; value: number }[]>,
  globalRestTime: number = 30
): WorkoutConfig {
  const unifiedGroups: WorkoutConfig['groups'] = {};
  for (const [name, val] of Object.entries(groups)) {
    if (Array.isArray(val)) {
      unifiedGroups[name] = toUnifiedGroup(name, val);
    } else {
      unifiedGroups[name] = {
        id: val.id || `custom_${name}_${Date.now()}`,
        name: val.name || name,
        icon: val.icon || 'Activity',
        createdAt: val.createdAt || new Date().toISOString(),
        exercises: val.exercises
      };
    }
  }
  return { globalRestTime, groups: unifiedGroups };
}