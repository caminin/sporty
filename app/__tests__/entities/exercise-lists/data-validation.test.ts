import { createExerciseList, saveExerciseList, loadExerciseList } from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import { createCustomTestConfig } from '../../shared/exercise-lists-helpers';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Exercise Lists - Data Validation', () => {
  describe('Exercise Data Integrity', () => {
    it('should handle exercises with all required fields', async () => {
      const list = await createTrackedExerciseList('Validation Test');

      const validExercises = [
        { id: 'ex1', name: 'Push-ups', type: 'reps' as const, value: 10 },
        { id: 'ex2', name: 'Plank', type: 'time' as const, value: 30 },
        { id: 'ex3', name: 'Running', type: 'reps' as const, value: 100 }
      ];

      list.config = createCustomTestConfig({
        'Valid Exercises': validExercises
      });

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      const loadedExercises = loaded!.config.groups['Valid Exercises'].exercises;

      expect(loadedExercises).toHaveLength(3);
      loadedExercises.forEach((exercise, index) => {
        expect(exercise.id).toBe(validExercises[index].id);
        expect(exercise.name).toBe(validExercises[index].name);
        expect(exercise.type).toBe(validExercises[index].type);
        expect(exercise.value).toBe(validExercises[index].value);
      });
    });

    it('should preserve exercise data types', async () => {
      const list = await createTrackedExerciseList('Data Types Test');

      const exercisesWithTypes = [
        { id: 'int', name: 'Integer Reps', type: 'reps' as const, value: 15 },
        { id: 'float', name: 'Float Time', type: 'time' as const, value: 45 },
        { id: 'large', name: 'Large Reps', type: 'reps' as const, value: 5000 }
      ];

      list.config = createCustomTestConfig({
        'Data Types': exercisesWithTypes
      });

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      const loadedExercises = loaded!.config.groups['Data Types'].exercises;

      expect(loadedExercises[0].value).toBe(15);
      expect(typeof loadedExercises[0].value).toBe('number');

      expect(loadedExercises[1].value).toBe(45);
      expect(typeof loadedExercises[1].value).toBe('number');

      expect(loadedExercises[2].value).toBe(5000);
      expect(typeof loadedExercises[2].value).toBe('number');
    });

    it('should handle empty exercise arrays', async () => {
      const list = await createTrackedExerciseList('Empty Exercises Test');

      list.config = createCustomTestConfig({
        'Empty Group': [],
        'Another Empty Group': []
      });

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.config.groups['Empty Group'].exercises).toEqual([]);
      expect(loaded!.config.groups['Another Empty Group'].exercises).toEqual([]);
    });

    it('should handle special characters in exercise names', async () => {
      const list = await createTrackedExerciseList('Special Characters Test');

      const exercisesWithSpecialChars = [
        { id: 'special1', name: 'Push-ups (Modified)', type: 'reps' as const, value: 10 },
        { id: 'special2', name: 'Plank - Advanced', type: 'time' as const, value: 60 },
        { id: 'special3', name: 'Running: 5K', type: 'reps' as const, value: 10 },
        { id: 'special4', name: 'Squats & Lunges', type: 'reps' as const, value: 15 }
      ];

      list.config = createCustomTestConfig({
        'Special Characters': exercisesWithSpecialChars
      });

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      const loadedExercises = loaded!.config.groups['Special Characters'].exercises;

      expect(loadedExercises[0].name).toBe('Push-ups (Modified)');
      expect(loadedExercises[1].name).toBe('Plank - Advanced');
      expect(loadedExercises[2].name).toBe('Running: 5K');
      expect(loadedExercises[3].name).toBe('Squats & Lunges');
    });
  });

  describe('Configuration Data Integrity', () => {
    it('should preserve globalRestTime values', async () => {
      const testCases = [0, 30, 120, 300, 999];

      for (const restTime of testCases) {
        const list = await createTrackedExerciseList(`Rest Time ${restTime}`);

        list.config = createCustomTestConfig({}, restTime);
        await saveExerciseList(list);

        const loaded = await loadExerciseList(list.id);
        expect(loaded!.config.globalRestTime).toBe(restTime);
      }
    });

    it('should handle empty groups object', async () => {
      const list = await createTrackedExerciseList('Empty Groups Test');

      list.config = {
        globalRestTime: 30,
        groups: {}
      };

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.config.groups).toEqual({});
      expect(Object.keys(loaded!.config.groups)).toHaveLength(0);
    });

    it('should preserve group names with spaces and special characters', async () => {
      const list = await createTrackedExerciseList('Group Names Test');

      const groupsWithSpecialNames = {
        'Basic Exercises': [
          { id: 'basic1', name: 'Push-up', type: 'reps' as const, value: 10 }
        ],
        'Advanced (Level 2)': [
          { id: 'adv1', name: 'Pistol Squat', type: 'reps' as const, value: 5 }
        ],
        'Cardio & Core': [
          { id: 'cardio1', name: 'Burpee', type: 'reps' as const, value: 8 }
        ]
      };

      list.config = createCustomTestConfig(groupsWithSpecialNames);

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(Object.keys(loaded!.config.groups)).toHaveLength(3);
      expect(loaded!.config.groups).toHaveProperty('Basic Exercises');
      expect(loaded!.config.groups).toHaveProperty('Advanced (Level 2)');
      expect(loaded!.config.groups).toHaveProperty('Cardio & Core');
    });
  });

  describe('List Metadata Integrity', () => {
    it('should preserve list names with special characters', async () => {
      const testNames = [
        'My Workout (Advanced)',
        'Morning Routine - Week 1',
        'Cardio: HIIT Session',
        'Strength & Power',
        'Recovery + Mobility'
      ];

      const lists = [];

      for (const name of testNames) {
        const list = await createTrackedExerciseList(name, `Description for ${name}`);
        await saveExerciseList(list);
        lists.push(list);
      }

      for (const list of lists) {
        const loaded = await loadExerciseList(list.id);
        expect(loaded!.name).toBe(list.name);
        expect(loaded!.description).toBe(list.description);
      }
    });

    it('should handle very long list names and descriptions', async () => {
      const longName = 'A'.repeat(200);
      const longDescription = 'B'.repeat(1000);

      const list = await createTrackedExerciseList(longName, longDescription);
      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(loaded!.name).toBe(longName);
      expect(loaded!.description).toBe(longDescription);
    });

    it('should preserve timestamps correctly', async () => {
      const list = await createTrackedExerciseList('Timestamp Test');

      const createdAt = list.createdAt;
      const updatedAt = list.updatedAt;

      await saveExerciseList(list);

      const loaded = await loadExerciseList(list.id);
      expect(new Date(loaded!.createdAt).getTime()).toBeCloseTo(new Date(createdAt).getTime(), -2); // Within 100ms
      expect(new Date(loaded!.updatedAt).getTime()).toBeCloseTo(new Date(updatedAt).getTime(), -2);

      // Wait a bit and save again to test updatedAt changes
      await new Promise(resolve => setTimeout(resolve, 10));

      list.config.globalRestTime = 60;
      await saveExerciseList(list);

      const reloaded = await loadExerciseList(list.id);
      expect(reloaded!.createdAt).toBe(createdAt);
      expect(reloaded!.updatedAt).not.toBe(updatedAt);
      expect(new Date(reloaded!.updatedAt).getTime()).toBeGreaterThan(new Date(updatedAt).getTime());
    });
  });

  describe('File System Resilience', () => {
    it('should handle concurrent file operations', async () => {
      const lists = [];

      // Create multiple lists simultaneously
      const promises = [];
      for (let i = 1; i <= 10; i++) {
        promises.push(createTrackedExerciseList(`Concurrent ${i}`));
      }

      const createdLists = await Promise.all(promises);

      // Save them simultaneously
      const savePromises = createdLists.map(list => {
        list.config = createCustomTestConfig({
          [`Group ${list.name}`]: [
            { id: `ex${list.name}`, name: `Exercise ${list.name}`, type: 'reps' as const, value: 10 }
          ]
        });
        return saveExerciseList(list);
      });

      await Promise.all(savePromises);

      // Load them simultaneously
      const loadPromises = createdLists.map(list => loadExerciseList(list.id));
      const loadedLists = await Promise.all(loadPromises);

      loadedLists.forEach((loaded, index) => {
        expect(loaded).toBeDefined();
        expect(loaded!.name).toBe(createdLists[index].name);
        expect(loaded!.config.groups[`Group ${loaded!.name}`].exercises).toHaveLength(1);
      });
    });

    it('should handle file system race conditions', async () => {
      const list1 = await createTrackedExerciseList('Race Condition Test 1');
      const list2 = await createTrackedExerciseList('Race Condition Test 2');

      // Both lists try to modify and save simultaneously
      const promise1 = (async () => {
        list1.config = createCustomTestConfig({
          'Group 1': [{ id: 'r1', name: 'Race Exercise 1', type: 'reps' as const, value: 5 }]
        });
        await saveExerciseList(list1);
        return loadExerciseList(list1.id);
      })();

      const promise2 = (async () => {
        list2.config = createCustomTestConfig({
          'Group 2': [{ id: 'r2', name: 'Race Exercise 2', type: 'reps' as const, value: 10 }]
        });
        await saveExerciseList(list2);
        return loadExerciseList(list2.id);
      })();

      const [loaded1, loaded2] = await Promise.all([promise1, promise2]);

      expect(loaded1!.config.groups['Group 1'].exercises[0].value).toBe(5);
      expect(loaded2!.config.groups['Group 2'].exercises[0].value).toBe(10);
    });
  });
});