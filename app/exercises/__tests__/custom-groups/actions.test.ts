import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  addExerciseToTraining,
  deleteExerciseFromTraining,
  getGlobalCatalog,
  updateTrainingExerciseRef,
} from '../../actions';
import { placementsByMuscleGroup } from '../../workout-config';
import { initializeExerciseLists } from '../../lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../../__tests__/shared/test-helpers';
import {
  createTestCatalog,
  persistTestCatalogAndTraining,
} from '../../../__tests__/shared/exercise-lists-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);

describe('Training exercise ref actions', () => {
  let trainingId: string;

  beforeEach(async () => {
    await initializeExerciseLists();
    const training = await createTrackedExerciseList('Test Training', 'For exercise refs');
    await persistTestCatalogAndTraining(training, createTestCatalog());
    trainingId = training.id;
  });

  it('should add an exercise ref to a training', async () => {
    const view = await addExerciseToTraining(trainingId, 'push1');

    const ref = view.exerciseRefs.find((r) => r.exerciseId === 'push1');
    expect(ref).toBeDefined();
    expect(ref!.refId).toBeDefined();
    expect(ref!.value).toBeUndefined();
  });

  it('should add a ref with value override', async () => {
    const view = await addExerciseToTraining(trainingId, 'push2', 20);

    const ref = view.exerciseRefs.find((r) => r.exerciseId === 'push2');
    expect(ref).toBeDefined();
    expect(ref!.value).toBe(20);
  });

  it('should update and clear ref value override', async () => {
    const withRef = await addExerciseToTraining(trainingId, 'push1');
    const refId = withRef.exerciseRefs.find((r) => r.exerciseId === 'push1')!.refId;

    const overridden = await updateTrainingExerciseRef(trainingId, refId, 25);
    const ref = overridden.exerciseRefs.find((r) => r.refId === refId);
    expect(ref!.value).toBe(25);

    const cleared = await updateTrainingExerciseRef(trainingId, refId, null);
    expect(cleared.exerciseRefs.find((r) => r.refId === refId)!.value).toBeUndefined();
  });

  it('should delete an exercise ref from a training', async () => {
    const withRef = await addExerciseToTraining(trainingId, 'pull1');
    const refId = withRef.exerciseRefs.find((r) => r.exerciseId === 'pull1')!.refId;

    const afterDelete = await deleteExerciseFromTraining(trainingId, refId);

    expect(afterDelete.exerciseRefs.find((r) => r.refId === refId)).toBeUndefined();
    expect(afterDelete.exerciseRefs.find((r) => r.exerciseId === 'pull1')).toBeUndefined();
  });

  it('should throw error when adding unknown catalog exercise', async () => {
    await expect(addExerciseToTraining(trainingId, 'unknown-id')).rejects.toThrow(
      /absent du catalogue/
    );
  });

  it('should no-op when deleting non-existent ref', async () => {
    const before = await addExerciseToTraining(trainingId, 'push1');
    const after = await deleteExerciseFromTraining(trainingId, 'non-existent-ref');

    expect(after.exerciseRefs).toEqual(before.exerciseRefs);
  });

  it('should expose empty groups and allow adding first exercise in one group', async () => {
    const catalog = await getGlobalCatalog();
    const emptySections = placementsByMuscleGroup(catalog, [], { includeEmpty: true });
    const abdosSection = emptySections.find((section) => section.meta.key === 'abdos');
    expect(abdosSection).toBeDefined();
    expect(abdosSection?.placements).toHaveLength(0);

    const updated = await addExerciseToTraining(trainingId, 'push1');
    const sectionsAfterAdd = placementsByMuscleGroup(
      { exercises: updated.exercises },
      updated.exerciseRefs,
      { includeEmpty: true }
    );
    const pecsSection = sectionsAfterAdd.find((section) => section.meta.key === 'pecs');
    expect(pecsSection?.placements.some((row) => row.resolved.exerciseId === 'push1')).toBe(true);
  });
});
