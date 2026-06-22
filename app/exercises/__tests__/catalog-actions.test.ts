import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  addCatalogExercise,
  deleteCatalogExercise,
  updateCatalogExercise,
  addExerciseToTraining,
} from '../actions';
import {
  createCustomTestWorkoutView,
  persistTestCatalogAndTraining,
} from '../../__tests__/shared/exercise-lists-helpers';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../__tests__/shared/test-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);

describe('catalog and training ref actions', () => {
  let trainingId: string;

  beforeEach(async () => {
    const training = await createTrackedExerciseList('catalog-actions-test');
    const view = createCustomTestWorkoutView({
      TestGroup: [{ id: 'squat1', name: 'Squat', type: 'reps', value: 10, muscleGroup: 'jambes' }],
    });
    training.exerciseRefs = view.exerciseRefs;
    training.globalRestTime = view.globalRestTime;
    await persistTestCatalogAndTraining(training, { exercises: view.exercises });
    trainingId = training.id;
  });

  it('should update catalog type and default value', async () => {
    const catalog = await updateCatalogExercise('squat1', { type: 'time', value: 45 });
    expect(catalog.exercises.squat1.type).toBe('time');
    expect(catalog.exercises.squat1.value).toBe(45);
  });

  it('should update catalog default series', async () => {
    const catalog = await updateCatalogExercise('squat1', { series: 3 });
    expect(catalog.exercises.squat1.series).toBe(3);

    const reset = await updateCatalogExercise('squat1', { series: 1 });
    expect(reset.exercises.squat1.series).toBeUndefined();
  });

  it('should add training ref without value override', async () => {
    const withPlank = await addCatalogExercise({
      name: 'Plank',
      type: 'time',
      value: 30,
      muscleGroup: 'abdos',
    });
    const plankId = Object.keys(withPlank.exercises).find(
      (id) => withPlank.exercises[id].name === 'Plank'
    )!;
    const afterAdd = await addExerciseToTraining(trainingId, plankId);
    const ref = afterAdd.exerciseRefs.find((r) => r.exerciseId === plankId);
    expect(ref).toBeDefined();
    expect(ref?.value).toBeUndefined();
  });

  it('should delete unreferenced catalog exercise', async () => {
    const withPlank = await addCatalogExercise({
      name: 'Plank',
      type: 'time',
      value: 30,
      muscleGroup: 'abdos',
    });
    const plankId = Object.keys(withPlank.exercises).find(
      (id) => withPlank.exercises[id].name === 'Plank'
    )!;

    const afterDelete = await deleteCatalogExercise(plankId);
    expect(afterDelete.exercises[plankId]).toBeUndefined();
  });

  it('should block deleting catalog exercise still referenced by a training', async () => {
    await expect(deleteCatalogExercise('squat1')).rejects.toThrow(/utilisé dans/i);
  });
});
