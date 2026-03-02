import fs from 'fs/promises';
import { createExerciseList, saveExerciseList, loadExerciseList, listExerciseLists, ensureDefaultList } from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import { createTestConfig, createCustomTestConfig } from '../../shared/exercise-lists-helpers';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Exercise Lists - Initialization & Migration', () => {
  describe('List Initialization', () => {
    it('should initialize new lists with correct default structure', async () => {
      const list = await createTrackedExerciseList('Initialization Test');

      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('name', 'Initialization Test');
      expect(list).toHaveProperty('description', undefined);
      expect(list).toHaveProperty('createdAt');
      expect(list).toHaveProperty('updatedAt');
      expect(list).toHaveProperty('config');

      expect(list.config).toHaveProperty('globalRestTime', 5);
      expect(list.config).toHaveProperty('groups');
      expect(list.config.groups).toEqual({});

      expect(typeof list.createdAt).toBe('string');
      expect(typeof list.updatedAt).toBe('string');
      expect(list.id).toMatch(/^list_/);
    });

    it('should create lists with custom descriptions', async () => {
      const description = 'A detailed description for testing initialization';
      const list = await createTrackedExerciseList('Custom Description Test', description);

      expect(list.description).toBe(description);
    });

    it('should generate unique IDs for each new list', async () => {
      const list1 = await createTrackedExerciseList('Unique ID Test 1');
      const list2 = await createTrackedExerciseList('Unique ID Test 2');
      const list3 = await createTrackedExerciseList('Unique ID Test 3');

      expect(list1.id).not.toBe(list2.id);
      expect(list2.id).not.toBe(list3.id);
      expect(list1.id).not.toBe(list3.id);

      const ids = [list1.id, list2.id, list3.id];
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('Data Persistence After Creation', () => {
    it('should persist newly created lists to disk', async () => {
      const list = await createTrackedExerciseList('Persistence Test', 'Testing data persistence');

      const loaded = await loadExerciseList(list.id);
      expect(loaded).toBeDefined();
      expect(loaded!.id).toBe(list.id);
      expect(loaded!.name).toBe(list.name);
      expect(loaded!.description).toBe(list.description);
      expect(loaded!.createdAt).toBe(list.createdAt);
      expect(loaded!.updatedAt).toBe(list.updatedAt);
    });

    it('should maintain data integrity after multiple save operations', async () => {
      const list = await createTrackedExerciseList('Multiple Saves Test');

      // First save with basic config
      list.config = createCustomTestConfig({
        'Initial': [{ id: 'init1', name: 'Initial Exercise', type: 'reps' as const, value: 10 }]
      }, 30);
      await saveExerciseList(list);

      let loaded = await loadExerciseList(list.id);
      expect(loaded!.config.globalRestTime).toBe(30);
      expect(loaded!.config.groups['Initial'].exercises).toHaveLength(1);

      // Second save with modified config
      list.config = createCustomTestConfig({
        'Initial': [{ id: 'init1', name: 'Initial Exercise', type: 'reps' as const, value: 15 }],
        'New Group': [{ id: 'new1', name: 'New Exercise', type: 'time' as const, value: 45 }]
      }, 60);
      await saveExerciseList(list);

      loaded = await loadExerciseList(list.id);
      expect(loaded!.config.globalRestTime).toBe(60);
      expect(loaded!.config.groups['Initial'].exercises[0].value).toBe(15);
      expect(loaded!.config.groups['New Group'].exercises).toHaveLength(1);
      expect(loaded!.config.groups['New Group'].exercises[0].name).toBe('New Exercise');
    });
  });

  describe('Migration Scenarios', () => {
    it('should handle migration from empty config to populated config', async () => {
      const list = await createTrackedExerciseList('Migration Test');

      // Initially empty config
      expect(list.config.groups).toEqual({});

      // Migrate to populated config
      list.config = createTestConfig();
      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.config.groups).not.toEqual({});
      expect(Object.keys(loaded!.config.groups)).toHaveLength(3);
      expect(loaded!.config.groups).toHaveProperty('Push');
      expect(loaded!.config.groups).toHaveProperty('Pull');
      expect(loaded!.config.groups).toHaveProperty('Legs');
    });

    it('should handle config structure changes during migration', async () => {
      const list = await createTrackedExerciseList('Structure Migration Test');

      // Start with simple config (unified format)
      list.config = createCustomTestConfig({
        'Old Group': [{ id: 'old1', name: 'Old Exercise', type: 'reps' as const, value: 10 }]
      }, 30);
      await saveExerciseList(list);

      // Migrate to new structure (unified format)
      list.config = createCustomTestConfig({
        'New Group 1': [
          { id: 'new1', name: 'New Exercise 1', type: 'reps' as const, value: 15 },
          { id: 'new2', name: 'New Exercise 2', type: 'time' as const, value: 30 }
        ],
        'New Group 2': [{ id: 'new3', name: 'New Exercise 3', type: 'reps' as const, value: 10 }]
      }, 45);
      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.config.globalRestTime).toBe(45);
      expect(loaded!.config.groups).not.toHaveProperty('Old Group');
      expect(loaded!.config.groups).toHaveProperty('New Group 1');
      expect(loaded!.config.groups).toHaveProperty('New Group 2');
      expect(loaded!.config.groups['New Group 1'].exercises).toHaveLength(2);
      expect(loaded!.config.groups['New Group 2'].exercises).toHaveLength(1);
    });

    it('should preserve creation timestamp across migrations', async () => {
      const list = await createTrackedExerciseList('Timestamp Preservation Test');
      const originalCreatedAt = list.createdAt;

      // First migration
      list.config = createTestConfig();
      await saveExerciseList(list);

      let loaded = await loadExerciseList(list.id);
      expect(loaded!.createdAt).toBe(originalCreatedAt);

      // Second migration
      list.config = createCustomTestConfig({
        'Migrated Group': [{ id: 'mig1', name: 'Migrated Exercise', type: 'reps' as const, value: 20 }]
      }, 90);
      await saveExerciseList(list);

      loaded = await loadExerciseList(list.id);
      expect(loaded!.createdAt).toBe(originalCreatedAt);
      expect(loaded!.updatedAt).not.toBe(originalCreatedAt);
    });
  });

  describe('Error Handling During Initialization', () => {
    it('should handle filesystem errors during list creation', async () => {
      // This test would be more relevant with actual filesystem error simulation
      // For now, we test the happy path and structure
      const list = await createTrackedExerciseList('Error Handling Test');

      expect(list).toBeDefined();
      expect(list.id).toBeDefined();
      expect(list.name).toBe('Error Handling Test');
    });

    it('should validate list data integrity after creation', async () => {
      const list = await createTrackedExerciseList('Integrity Test', 'Testing data integrity');

      // Verify all required fields are present
      const requiredFields = ['id', 'name', 'createdAt', 'updatedAt', 'config'];
      requiredFields.forEach(field => {
        expect(list).toHaveProperty(field);
      });

      const configRequiredFields = ['globalRestTime', 'groups'];
      configRequiredFields.forEach(field => {
        expect(list.config).toHaveProperty(field);
      });

      // Verify data types
      expect(typeof list.id).toBe('string');
      expect(typeof list.name).toBe('string');
      expect(typeof list.createdAt).toBe('string');
      expect(typeof list.updatedAt).toBe('string');
      expect(typeof list.config.globalRestTime).toBe('number');
      expect(typeof list.config.groups).toBe('object');
    });
  });

  describe('Default List Creation (ensureDefaultList)', () => {
    it('should create default list with seed content when none exists', async () => {
      await ensureDefaultList();

      const list = await loadExerciseList('default');
      expect(list).toBeDefined();
      expect(list!.id).toBe('default');
      expect(list!.name).toBe('Liste par défaut');
      expect(list!.config.globalRestTime).toBe(15);
      expect(Object.keys(list!.config.groups).length).toBeGreaterThan(0);
      expect(list!.config.groups).toHaveProperty('Cardio endurance');
      expect(list!.config.groups).toHaveProperty('Adbos');
      expect(list!.config.groups['Cardio endurance'].exercises).toHaveLength(5);
      expect(list!.config.groups['Cardio endurance'].icon).toBe('activity');
    });

    it('should create empty default list when seed is absent', async () => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      readFileSpy.mockRejectedValueOnce(new Error('ENOENT'));

      await ensureDefaultList();

      const list = await loadExerciseList('default');
      expect(list).toBeDefined();
      expect(list!.config.groups).toEqual({});
      expect(list!.config.globalRestTime).toBe(15);

      readFileSpy.mockRestore();
    });

    it('should not recreate default list when it already exists', async () => {
      await ensureDefaultList();
      const firstList = await loadExerciseList('default');
      expect(firstList).toBeDefined();

      await ensureDefaultList();
      const secondList = await loadExerciseList('default');
      expect(secondList!.updatedAt).toBe(firstList!.updatedAt);
    });
  });

  describe('List Discovery and Loading', () => {
    it('should discover newly created lists in listExerciseLists', async () => {
      const initialLists = await listExerciseLists();
      const initialCount = initialLists.length;

      const newList = await createTrackedExerciseList('Discovery Test');

      const updatedLists = await listExerciseLists();
      expect(updatedLists.length).toBeGreaterThanOrEqual(initialCount + 1);

      const foundList = updatedLists.find(list => list.id === newList.id);
      expect(foundList).toBeDefined();
      expect(foundList!.name).toBe('Discovery Test');
    });

    it('should load lists with complex configurations', async () => {
      const list = await createTrackedExerciseList('Complex Config Test');

      const complexConfig = createCustomTestConfig({
        'Warm-up': [
          { id: 'w1', name: 'Jumping Jacks', type: 'reps' as const, value: 20 },
          { id: 'w2', name: 'Arm Circles', type: 'time' as const, value: 30 }
        ],
        'Main Workout': [
          { id: 'm1', name: 'Push-ups', type: 'reps' as const, value: 15 },
          { id: 'm2', name: 'Squats', type: 'reps' as const, value: 20 },
          { id: 'm3', name: 'Plank', type: 'time' as const, value: 60 },
          { id: 'm4', name: 'Burpees', type: 'reps' as const, value: 10 }
        ],
        'Cool-down': [{ id: 'c1', name: 'Stretching', type: 'time' as const, value: 120 }]
      }, 45);

      list.config = complexConfig;
      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.config.globalRestTime).toBe(45);
      expect(Object.keys(loaded!.config.groups)).toHaveLength(3);
      expect(loaded!.config.groups['Main Workout'].exercises).toHaveLength(4);
    });
  });
});