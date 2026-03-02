import { createExerciseList, loadExerciseList, saveExerciseList, deleteExerciseList, listExerciseLists } from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import { createTestList, createTrackedTestList, createTestConfig } from '../../shared/exercise-lists-helpers';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Exercise Lists - CRUD Operations', () => {
  describe('createExerciseList', () => {
    it('should create a new exercise list with valid data', async () => {
      const listName = 'My Custom List';
      const listDescription = 'A test list for my workout';

      const result = await createTrackedExerciseList(listName, listDescription);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(listName);
      expect(result.description).toBe(listDescription);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.config).toBeDefined();
      expect(result.config.globalRestTime).toBe(5); // Default value
      expect(result.config.groups).toEqual({}); // Empty groups by default
    });

    it('should create a list without description', async () => {
      const listName = 'List Without Description';

      const result = await createTrackedExerciseList(listName);

      expect(result.name).toBe(listName);
      expect(result.description).toBeUndefined();
    });

    it('should generate unique IDs for different lists', async () => {
      const list1 = await createTrackedExerciseList('List 1');
      const list2 = await createTrackedExerciseList('List 2');

      expect(list1.id).not.toBe(list2.id);
      expect(list1.id).toMatch(/^list_\d+_[a-z0-9]+$/);
      expect(list2.id).toMatch(/^list_\d+_[a-z0-9]+$/);
    });
  });

  describe('loadExerciseList', () => {
    it('should load an existing exercise list', async () => {
      const createdList = await createTrackedExerciseList('Test List', 'Test description');
      const testConfig = createTestConfig();
      createdList.config = testConfig;
      await saveExerciseList(createdList);

      const loadedList = await loadExerciseList(createdList.id);

      expect(loadedList).toBeDefined();
      expect(loadedList!.id).toBe(createdList.id);
      expect(loadedList!.name).toBe(createdList.name);
      expect(loadedList!.description).toBe(createdList.description);
      expect(loadedList!.config).toEqual(testConfig);
    });

    it('should return null for non-existent list', async () => {
      const result = await loadExerciseList('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null for corrupted JSON file', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');

      const testDataDir = process.env.DATA_DIR!;
      const listId = 'corrupted-list';
      const listPath = path.join(testDataDir, 'exercise-lists', `${listId}.json`);
      await fs.mkdir(path.dirname(listPath), { recursive: true });
      await fs.writeFile(listPath, 'invalid json content', 'utf-8');

      const result = await loadExerciseList(listId);

      expect(result).toBeNull();
    });
  });

  describe('saveExerciseList', () => {
    it('should save an exercise list to disk', async () => {
      const testList = createTrackedTestList('Save Test List');
      const testConfig = createTestConfig();
      testList.config = testConfig;

      await saveExerciseList(testList);

      const loadedList = await loadExerciseList(testList.id);

      expect(loadedList).toBeDefined();
      expect(loadedList!.id).toBe(testList.id);
      expect(loadedList!.name).toBe(testList.name);
      expect(loadedList!.config).toEqual(testConfig);
    });

    it('should update the updatedAt timestamp when saving', async () => {
      const testList = createTrackedTestList('Timestamp Test');
      const originalUpdatedAt = testList.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      await saveExerciseList(testList);

      const loadedList = await loadExerciseList(testList.id);

      expect(loadedList!.updatedAt).not.toBe(originalUpdatedAt);
      expect(new Date(loadedList!.updatedAt).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
    });

    it('should overwrite existing list with same ID', async () => {
      const testList = createTrackedTestList('Overwrite Test');
      testList.config = createTestConfig();

      await saveExerciseList(testList);

      testList.name = 'Modified Name';
      testList.config.globalRestTime = 60;
      await saveExerciseList(testList);

      const loadedList = await loadExerciseList(testList.id);

      expect(loadedList!.name).toBe('Modified Name');
      expect(loadedList!.config.globalRestTime).toBe(60);
    });
  });

  describe('deleteExerciseList', () => {
    it('should delete an existing exercise list', async () => {
      const testList = createTrackedTestList('Delete Test List');
      await saveExerciseList(testList);

      let loadedList = await loadExerciseList(testList.id);
      expect(loadedList).toBeDefined();

      await deleteExerciseList(testList.id);

      loadedList = await loadExerciseList(testList.id);
      expect(loadedList).toBeNull();
    });

    it('should handle error when deleting non-existent list', async () => {
      await expect(deleteExerciseList('non-existent-id')).rejects.toThrow('Failed to delete exercise list');
    });

    it('should allow recreating a list with same name after deletion', async () => {
      const listName = 'Recreate Test';

      const list1 = await createTrackedExerciseList(listName);
      await deleteExerciseList(list1.id);

      const list2 = await createTrackedExerciseList(listName);

      expect(list1.id).not.toBe(list2.id);
      expect(list2.name).toBe(listName);
    });
  });

  describe('listExerciseLists', () => {
    it('should return array of exercise lists', async () => {
      const list1 = createTrackedTestList('Test List 1');
      const list2 = createTrackedTestList('Test List 2');
      await saveExerciseList(list1);
      await saveExerciseList(list2);

      const lists = await listExerciseLists();

      expect(Array.isArray(lists)).toBe(true);
      expect(lists.length).toBeGreaterThanOrEqual(2);

      const listNames = lists.map(l => l.name);
      expect(listNames).toEqual(expect.arrayContaining(['Test List 1', 'Test List 2']));

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(list1.id);
      await deleteExerciseList(list2.id);
    });

    it('should list all exercise lists', async () => {
      const list1 = createTrackedTestList('List A');
      const list2 = createTrackedTestList('List B');
      const list3 = createTrackedTestList('List C');

      await saveExerciseList(list1);
      await saveExerciseList(list2);
      await saveExerciseList(list3);

      const lists = await listExerciseLists();

      expect(lists.length).toBeGreaterThanOrEqual(3);

        expect(new Date(lists[0].updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(lists[1].updatedAt).getTime());
        expect(new Date(lists[1].updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(lists[2].updatedAt).getTime());

      const listNames = lists.map(l => l.name);
      expect(listNames).toEqual(expect.arrayContaining(['List A', 'List B', 'List C']));

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(list1.id);
      await deleteExerciseList(list2.id);
      await deleteExerciseList(list3.id);
    });

    it('should include metadata but not full config', async () => {
      const testList = createTrackedTestList('Metadata Test', createTestConfig());
      await saveExerciseList(testList);

      const lists = await listExerciseLists();

      expect(lists.length).toBeGreaterThanOrEqual(1);
      const list = lists[0];

      expect(list.id).toBe(testList.id);
      expect(list.name).toBe(testList.name);
      expect(list.description).toBe(testList.description);
      expect(list.createdAt).toBe(testList.createdAt);
      expect(list.updatedAt).toBe(testList.updatedAt);
      expect(list).not.toHaveProperty('config');

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(testList.id);
    });

    it('should skip corrupted list files and continue', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');

      const validList = createTrackedTestList('Valid List');
      await saveExerciseList(validList);

      const testDataDir = process.env.DATA_DIR!;
      const corruptedPath = path.join(testDataDir, 'exercise-lists', 'corrupted.json');
      await fs.mkdir(path.dirname(corruptedPath), { recursive: true });
      await fs.writeFile(corruptedPath, 'invalid json', 'utf-8');

      const lists = await listExerciseLists();

      expect(lists.length).toBeGreaterThanOrEqual(1);
      expect(lists[0].name).toBe('Valid List');

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(validList.id);
    });
  });
});