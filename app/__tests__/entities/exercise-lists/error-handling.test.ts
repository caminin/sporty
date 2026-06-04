import {
  saveExerciseList,
  loadExerciseList,
  deleteExerciseList,
  listExerciseLists,
} from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import { createTestTraining, persistTestCatalogAndTraining } from '../../shared/exercise-lists-helpers';
import fs from 'fs/promises';
import path from 'path';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

function trainingsPath(id: string): string {
  return path.join(process.env.DATA_DIR!, 'trainings', `${id}.json`);
}

describe('Trainings - Error Handling', () => {
  describe('Data Corruption Handling', () => {
    it('should return null for corrupted JSON files', async () => {
      const listId = 'corrupted';
      await fs.mkdir(path.dirname(trainingsPath(listId)), { recursive: true });
      await fs.writeFile(trainingsPath(listId), 'not json {{{', 'utf-8');
      expect(await loadExerciseList(listId)).toBeNull();
    });

    it('should return null for legacy WorkoutConfig shape', async () => {
      const listId = 'legacy-shape';
      await fs.mkdir(path.dirname(trainingsPath(listId)), { recursive: true });
      await fs.writeFile(
        trainingsPath(listId),
        JSON.stringify({
          id: listId,
          name: 'Legacy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          config: { globalRestTime: 30, exercises: {}, groups: {} },
        }),
        'utf-8'
      );
      expect(await loadExerciseList(listId)).toBeNull();
    });
  });

  describe('Invalid Data Handling', () => {
    it('should reject save when refs point to missing catalog exercises', async () => {
      const training = createTestTraining('Orphan refs');
      await expect(saveExerciseList(training)).rejects.toThrow(/catalogue global/);
    });

    it('should save when catalog and refs are consistent', async () => {
      const training = createTestTraining('Valid');
      await expect(persistTestCatalogAndTraining(training)).resolves.not.toThrow();
    });
  });

  describe('Concurrent Operation Errors', () => {
    it('should handle concurrent save operations on the same training', async () => {
      const view = {
        globalRestTime: 30,
        exercises: {
          ex1: { id: 'ex1', name: 'A', type: 'reps' as const, value: 10, muscleGroup: 'jambes' as const },
        },
        exerciseRefs: [{ refId: 'ex1', exerciseId: 'ex1' }],
      };
      const training = await createTrackedExerciseList('Concurrent');
      training.exerciseRefs = view.exerciseRefs;
      await persistTestCatalogAndTraining(training, { exercises: view.exercises });
      await Promise.all([saveExerciseList(training), saveExerciseList(training)]);
      expect(await loadExerciseList(training.id)).toBeDefined();
    });
  });

  describe('Recovery Mechanisms', () => {
    it('should provide meaningful error messages for orphan refs', async () => {
      const training = createTestTraining('Bad');
      await expect(saveExerciseList(training)).rejects.toThrow(/absent du catalogue/);
    });

    it('should list trainings after filesystem init', async () => {
      const lists = await listExerciseLists();
      expect(Array.isArray(lists)).toBe(true);
    });
  });
});
