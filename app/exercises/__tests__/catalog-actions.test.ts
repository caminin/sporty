import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  addCatalogExercise,
  updateCatalogExercise,
  addExerciseToGroup,
  getWorkoutConfig,
} from '../actions';
import { saveExerciseList } from '../lists';
import { createCustomTestConfig } from '../../__tests__/shared/exercise-lists-helpers';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../__tests__/shared/test-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);

describe('catalog and group actions', () => {
  let listId: string;

  beforeEach(async () => {
    const list = await createTrackedExerciseList('catalog-actions-test');
    list.config = createCustomTestConfig({
      TestGroup: [{ id: 'squat1', name: 'Squat', type: 'reps', value: 10, muscleGroup: 'jambes' }],
    });
    await saveExerciseList(list);
    listId = list.id;
  });

  it('should update catalog type and default value', async () => {
    const updated = await updateCatalogExercise('squat1', { type: 'time', value: 45 }, listId);
    expect(updated.exercises.squat1.type).toBe('time');
    expect(updated.exercises.squat1.value).toBe(45);
  });

  it('should add group reference without value override', async () => {
    const withPlank = await addCatalogExercise(
      { name: 'Plank', type: 'time', value: 30, muscleGroup: 'abdos' },
      listId
    );
    const plankId = Object.keys(withPlank.exercises).find(
      (id) => withPlank.exercises[id].name === 'Plank'
    )!;
    const afterAdd = await addExerciseToGroup('TestGroup', plankId, listId);
    const ref = afterAdd.groups.TestGroup.exercises.find((r) => r.exerciseId === plankId);
    expect(ref).toBeDefined();
    expect(ref?.value).toBeUndefined();
  });
});
