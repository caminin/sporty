import {
  createExerciseList,
  loadExerciseList,
  saveExerciseList,
  deleteExerciseList,
  listExerciseLists,
} from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import {
  createTestTraining,
  createTrackedTestList,
  createTestWorkoutView,
  persistTestCatalogAndTraining,
} from '../../shared/exercise-lists-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Trainings - CRUD Operations', () => {
  describe('createExerciseList', () => {
    it('should create a new training with valid data', async () => {
      const result = await createTrackedExerciseList('My Custom Training', 'A test training');

      expect(result.id).toBeDefined();
      expect(result.name).toBe('My Custom Training');
      expect(result.description).toBe('A test training');
      expect(result.globalRestTime).toBe(30);
      expect(result.exerciseRefs).toEqual([]);
      expect(result).not.toHaveProperty('config');
      expect(result).not.toHaveProperty('groups');
    });

    it('should generate unique IDs', async () => {
      const list1 = await createTrackedExerciseList('Training 1');
      const list2 = await createTrackedExerciseList('Training 2');
      expect(list1.id).not.toBe(list2.id);
      expect(list1.id).toMatch(/^training_/);
    });
  });

  describe('loadExerciseList', () => {
    it('should load an existing training', async () => {
      const view = createTestWorkoutView();
      const training = createTrackedTestList('Test Training', view);
      await persistTestCatalogAndTraining(training, { exercises: view.exercises });

      const loaded = await loadExerciseList(training.id);
      expect(loaded?.id).toBe(training.id);
      expect(loaded?.exerciseRefs).toEqual(view.exerciseRefs);
      expect(loaded?.globalRestTime).toBe(30);
    });

    it('should return null for non-existent training', async () => {
      expect(await loadExerciseList('non-existent-id')).toBeNull();
    });

    it('should return null for corrupted JSON file', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');
      const testDataDir = process.env.DATA_DIR!;
      const filePath = path.join(testDataDir, 'trainings', 'corrupted-list.json');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, 'invalid json', 'utf-8');
      expect(await loadExerciseList('corrupted-list')).toBeNull();
    });
  });

  describe('saveExerciseList', () => {
    it('should save a training to disk', async () => {
      const view = createTestWorkoutView();
      const training = createTrackedTestList('Save Test');
      await persistTestCatalogAndTraining(training, { exercises: view.exercises });
      training.exerciseRefs = view.exerciseRefs;
      await saveExerciseList(training);

      const loaded = await loadExerciseList(training.id);
      expect(loaded?.exerciseRefs).toEqual(view.exerciseRefs);
    });

    it('should update updatedAt when saving', async () => {
      const training = await createTrackedExerciseList('Timestamp Test');
      const original = training.updatedAt;
      await new Promise((r) => setTimeout(r, 10));
      await saveExerciseList(training);
      const loaded = await loadExerciseList(training.id);
      expect(new Date(loaded!.updatedAt).getTime()).toBeGreaterThan(new Date(original).getTime());
    });
  });

  describe('deleteExerciseList', () => {
    it('should delete an existing training', async () => {
      const training = await createTrackedExerciseList('Delete Test');
      await saveExerciseList(training);
      await deleteExerciseList(training.id);
      expect(await loadExerciseList(training.id)).toBeNull();
    });
  });

  describe('listExerciseLists', () => {
    it('should list trainings metadata without full refs in list call', async () => {
      const t1 = await createTrackedExerciseList('List A');
      const t2 = await createTrackedExerciseList('List B');
      await saveExerciseList(t1);
      await saveExerciseList(t2);

      const lists = await listExerciseLists();
      expect(lists.length).toBeGreaterThanOrEqual(2);
      expect(lists[0]).not.toHaveProperty('exerciseRefs');
    });
  });
});
