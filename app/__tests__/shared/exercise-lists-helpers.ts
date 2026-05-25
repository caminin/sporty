import { WorkoutConfig, Group, GroupExerciseRef, ExerciseDefinition } from '../../exercises/types';
import type { MuscleGroupKey } from '../../exercises/muscle-groups';
import { DEFAULT_MUSCLE_GROUP } from '../../exercises/muscle-groups';
import { ExerciseList } from '../../exercises/lists';

function toUnifiedGroup(
  name: string,
  catalog: Record<string, ExerciseDefinition>,
  refs: GroupExerciseRef[]
): Group {
  return {
    id: `custom_${name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
    name,
    icon: 'Activity',
    color: 'blue',
    createdAt: new Date().toISOString(),
    exercises: refs,
  };
}

export function createTestConfig(overrides?: Partial<WorkoutConfig>): WorkoutConfig {
  const exercises: Record<string, ExerciseDefinition> = {
    push1: { id: 'push1', name: 'Push-ups', type: 'reps', value: 10, muscleGroup: 'pecs' },
    push2: { id: 'push2', name: 'Bench Press', type: 'reps', value: 8, muscleGroup: 'pecs' },
    pull1: { id: 'pull1', name: 'Pull-ups', type: 'reps', value: 8, muscleGroup: 'dos' },
    pull2: { id: 'pull2', name: 'Rows', type: 'reps', value: 10, muscleGroup: 'dos' },
    legs1: { id: 'legs1', name: 'Squats', type: 'reps', value: 12, muscleGroup: 'jambes' },
    legs2: { id: 'legs2', name: 'Lunges', type: 'reps', value: 10, muscleGroup: 'jambes' },
  };

  return {
    globalRestTime: 30,
    exercises,
    groups: {
      Push: toUnifiedGroup('Push', exercises, [
        { refId: 'push1', exerciseId: 'push1' },
        { refId: 'push2', exerciseId: 'push2' },
      ]),
      Pull: toUnifiedGroup('Pull', exercises, [
        { refId: 'pull1', exerciseId: 'pull1' },
        { refId: 'pull2', exerciseId: 'pull2' },
      ]),
      Legs: toUnifiedGroup('Legs', exercises, [
        { refId: 'legs1', exerciseId: 'legs1' },
        { refId: 'legs2', exerciseId: 'legs2' },
      ]),
    },
    ...overrides,
  };
}

export function createTestList(name: string = 'Test List', config?: WorkoutConfig): ExerciseList {
  const now = new Date().toISOString();
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description: `Test list: ${name}`,
    createdAt: now,
    updatedAt: now,
    config: config || createTestConfig(),
  };
}

export function createTrackedTestList(name: string = 'Test List', config?: WorkoutConfig): ExerciseList {
  const list = createTestList(name, config);

  if (typeof process !== 'undefined' && process.env.DATA_DIR?.includes('tmp/test-data')) {
    try {
      const { createdListIds } = require('./test-helpers');
      createdListIds.push(list.id);
    } catch {
      // ignore
    }
  }

  return list;
}

export function createEmptyTestConfig(): WorkoutConfig {
  return {
    globalRestTime: 5,
    exercises: {},
    groups: {},
  };
}

/** Build catalog + groups from legacy-style exercise arrays (for tests only). */
export function createCustomTestConfig(
  groups: Record<
    string,
    | { id: string; name: string; icon?: string; color?: Group['color']; createdAt?: string; exercises: { id: string; name: string; type: 'reps' | 'time'; value: number }[] }
    | { id: string; name: string; type: 'reps' | 'time'; value: number }[]
  >,
  globalRestTime: number = 30
): WorkoutConfig {
  const exercises: Record<string, ExerciseDefinition> = {};
  const unifiedGroups: WorkoutConfig['groups'] = {};

  for (const [name, val] of Object.entries(groups)) {
    const rawExercises = Array.isArray(val) ? val : val.exercises;
    const refs: GroupExerciseRef[] = [];

    for (const ex of rawExercises) {
      if (!exercises[ex.id]) {
        const muscleGroup: MuscleGroupKey =
          'muscleGroup' in ex && typeof ex.muscleGroup === 'string'
            ? (ex.muscleGroup as MuscleGroupKey)
            : DEFAULT_MUSCLE_GROUP;
        exercises[ex.id] = {
          id: ex.id,
          name: ex.name,
          type: ex.type,
          value: ex.value,
          muscleGroup,
        };
      }
      refs.push({ refId: ex.id, exerciseId: ex.id });
    }

    if (Array.isArray(val)) {
      unifiedGroups[name] = toUnifiedGroup(name, exercises, refs);
    } else {
      unifiedGroups[name] = {
        id: val.id || `custom_${name}_${Date.now()}`,
        name: val.name || name,
        icon: val.icon || 'Activity',
        color: val.color || 'blue',
        createdAt: val.createdAt || new Date().toISOString(),
        exercises: refs,
      };
    }
  }

  return { globalRestTime, exercises, groups: unifiedGroups };
}
