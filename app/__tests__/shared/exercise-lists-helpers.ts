import type {
    GlobalCatalog,
    GroupExerciseRef,
    ExerciseDefinition,
    Training,
    WorkoutView,
} from '../../exercises/types';
import type { MuscleGroupKey } from '../../exercises/muscle-groups';
import { DEFAULT_MUSCLE_GROUP } from '../../exercises/muscle-groups';

const DEFAULT_EXERCISES: Record<string, ExerciseDefinition> = {
    push1: { id: 'push1', name: 'Push-ups', type: 'reps', value: 10, muscleGroup: 'pecs' },
    push2: { id: 'push2', name: 'Bench Press', type: 'reps', value: 8, muscleGroup: 'pecs' },
    pull1: { id: 'pull1', name: 'Pull-ups', type: 'reps', value: 8, muscleGroup: 'epaules' },
    pull2: { id: 'pull2', name: 'Rows', type: 'reps', value: 10, muscleGroup: 'epaules' },
    legs1: { id: 'legs1', name: 'Squats', type: 'reps', value: 12, muscleGroup: 'jambes' },
    legs2: { id: 'legs2', name: 'Lunges', type: 'reps', value: 10, muscleGroup: 'jambes' },
};

const DEFAULT_REFS: GroupExerciseRef[] = [
    { refId: 'push1', exerciseId: 'push1' },
    { refId: 'push2', exerciseId: 'push2' },
    { refId: 'pull1', exerciseId: 'pull1' },
    { refId: 'pull2', exerciseId: 'pull2' },
    { refId: 'legs1', exerciseId: 'legs1' },
    { refId: 'legs2', exerciseId: 'legs2' },
];

export function createTestCatalog(
    exercises: Record<string, ExerciseDefinition> = DEFAULT_EXERCISES
): GlobalCatalog {
    return { exercises: { ...exercises } };
}

export function createTestWorkoutView(overrides?: Partial<WorkoutView>): WorkoutView {
    return {
        globalRestTime: 30,
        exercises: { ...DEFAULT_EXERCISES },
        exerciseRefs: DEFAULT_REFS.map((r) => ({ ...r })),
        ...overrides,
    };
}

/** @deprecated Use createTestWorkoutView */
export const createTestConfig = createTestWorkoutView;

export function createTestTraining(
    name: string = 'Test Training',
    view?: WorkoutView
): Training {
    const v = view ?? createTestWorkoutView();
    const now = new Date().toISOString();
    return {
        id: `training_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        name,
        description: `Test training: ${name}`,
        globalRestTime: v.globalRestTime,
        exerciseRefs: v.exerciseRefs.map((r) => ({ ...r })),
        createdAt: now,
        updatedAt: now,
    };
}

/** @deprecated Use createTestTraining */
export const createTestList = createTestTraining;

export function createTrackedTestList(name: string = 'Test Training', view?: WorkoutView): Training {
    const training = createTestTraining(name, view);
    if (typeof process !== 'undefined' && process.env.DATA_DIR?.includes('tmp/test-data')) {
        try {
            const { createdListIds } = require('./test-helpers');
            createdListIds.push(training.id);
        } catch {
            // ignore
        }
    }
    return training;
}

export async function persistTestCatalogAndTraining(
    training: Training,
    catalog: GlobalCatalog = createTestCatalog()
): Promise<void> {
    const { loadGlobalCatalog, saveGlobalCatalog } = await import('../../exercises/catalog');
    const { saveTraining } = await import('../../exercises/lists');
    const existing = await loadGlobalCatalog();
    await saveGlobalCatalog({
        exercises: { ...existing.exercises, ...catalog.exercises },
    });
    await saveTraining(training);
}

export function createEmptyTestWorkoutView(): WorkoutView {
    return { globalRestTime: 5, exercises: {}, exerciseRefs: [] };
}

/** @deprecated */
export const createEmptyTestConfig = createEmptyTestWorkoutView;

export function createCustomTestWorkoutView(
    sections: Record<
        string,
        { id: string; name: string; type: 'reps' | 'time'; value: number; muscleGroup?: MuscleGroupKey }[]
    >,
    globalRestTime: number = 30
): WorkoutView {
    const exercises: Record<string, ExerciseDefinition> = {};
    const exerciseRefs: GroupExerciseRef[] = [];

    for (const items of Object.values(sections)) {
        for (const ex of items) {
            const muscleGroup: MuscleGroupKey = ex.muscleGroup ?? DEFAULT_MUSCLE_GROUP;
            if (!exercises[ex.id]) {
                exercises[ex.id] = {
                    id: ex.id,
                    name: ex.name,
                    type: ex.type,
                    value: ex.value,
                    muscleGroup,
                };
            }
            exerciseRefs.push({ refId: ex.id, exerciseId: ex.id });
        }
    }

    return { globalRestTime, exercises, exerciseRefs };
}

/** @deprecated Use createCustomTestWorkoutView */
export const createCustomTestConfig = createCustomTestWorkoutView;
