import { createExerciseList, saveExerciseList, loadExerciseList, deleteExerciseList } from '../../../exercises/lists';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import { createTestConfig, createCustomTestConfig } from '../../shared/exercise-lists-helpers';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Exercise Lists - Custom Lists Operations', () => {
  describe('Adding Exercises to Custom Lists', () => {
    it('should add exercises to an empty custom list', async () => {
      const customList = await createTrackedExerciseList('My Custom Workout', 'A personalized training plan');

      expect(customList.config.groups).toEqual({});

      const customConfig = createCustomTestConfig({
        'Warm-up': [
          { id: 'warm1', name: 'Jumping Jacks', type: 'reps', value: 20 },
          { id: 'warm2', name: 'Arm Circles', type: 'time', value: 30 }
        ],
        'Main Workout': [
          { id: 'main1', name: 'Push-ups', type: 'reps', value: 15 },
          { id: 'main2', name: 'Squats', type: 'reps', value: 20 },
          { id: 'main3', name: 'Plank', type: 'time', value: 60 }
        ]
      }, 45);

      customList.config = customConfig;
      await saveExerciseList(customList);

      const loadedList = await loadExerciseList(customList.id);
      expect(loadedList).toBeDefined();
      expect(loadedList!.config.globalRestTime).toBe(45);
      expect(Object.keys(loadedList!.config.groups)).toHaveLength(2);
      expect(loadedList!.config.groups['Warm-up'].exercises).toHaveLength(2);
      expect(loadedList!.config.groups['Main Workout'].exercises).toHaveLength(3);

      expect(loadedList!.config.groups['Main Workout'].exercises[0].name).toBe('Push-ups');
      expect(loadedList!.config.groups['Main Workout'].exercises[1].name).toBe('Squats');
      expect(loadedList!.config.groups['Main Workout'].exercises[2].name).toBe('Plank');
    });

    it('should allow different exercise configurations in custom lists', async () => {
      const cardioList = await createTrackedExerciseList('Cardio Focused', 'High intensity cardio workout');
      const strengthList = await createTrackedExerciseList('Strength Training', 'Heavy lifting session');

      const cardioConfig = createCustomTestConfig({
        'HIIT': [
          { id: 'hiit1', name: 'Burpees', type: 'reps', value: 10 },
          { id: 'hiit2', name: 'Mountain Climbers', type: 'time', value: 30 }
        ]
      }, 20);

      const strengthConfig = createCustomTestConfig({
        'Compound Lifts': [
          { id: 'comp1', name: 'Deadlift', type: 'reps', value: 5 },
          { id: 'comp2', name: 'Bench Press', type: 'reps', value: 8 }
        ]
      }, 120);

      cardioList.config = cardioConfig;
      strengthList.config = strengthConfig;

      await saveExerciseList(cardioList);
      await saveExerciseList(strengthList);

      const loadedCardio = await loadExerciseList(cardioList.id);
      const loadedStrength = await loadExerciseList(strengthList.id);

      expect(loadedCardio!.config.globalRestTime).toBe(20);
      expect(loadedStrength!.config.globalRestTime).toBe(120);

      expect(loadedCardio!.config.groups['HIIT'].exercises[0].name).toBe('Burpees');
      expect(loadedStrength!.config.groups['Compound Lifts'].exercises[0].name).toBe('Deadlift');

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(cardioList.id);
      await deleteExerciseList(strengthList.id);
    });

    it('should add exercises to an existing custom list with exercises', async () => {
      const existingList = await createTrackedExerciseList('Progressive Training', 'Building up over time');

      const initialConfig = createCustomTestConfig({
        'Foundation': [
          { id: 'found1', name: 'Bodyweight Squats', type: 'reps', value: 15 },
          { id: 'found2', name: 'Wall Push-ups', type: 'reps', value: 10 }
        ]
      }, 60);

      existingList.config = initialConfig;
      await saveExerciseList(existingList);

      expect((await loadExerciseList(existingList.id))!.config.groups['Foundation'].exercises).toHaveLength(2);

      const expandedConfig = createCustomTestConfig({
        'Foundation': [
          { id: 'found1', name: 'Bodyweight Squats', type: 'reps', value: 15 },
          { id: 'found2', name: 'Wall Push-ups', type: 'reps', value: 10 }
        ],
        'Progression': [
          { id: 'prog1', name: 'Regular Squats', type: 'reps', value: 20 },
          { id: 'prog2', name: 'Knee Push-ups', type: 'reps', value: 12 },
          { id: 'prog3', name: 'Plank Hold', type: 'time', value: 45 }
        ],
        'Advanced': [
          { id: 'adv1', name: 'Pistol Squats', type: 'reps', value: 8 },
          { id: 'adv2', name: 'Full Push-ups', type: 'reps', value: 15 }
        ]
      }, 60);

      existingList.config = expandedConfig;
      await saveExerciseList(existingList);

      const updatedLoaded = await loadExerciseList(existingList.id);
      const updatedExercises = updatedLoaded!.config.groups;

      expect(Object.keys(updatedExercises)).toHaveLength(3);
      expect(updatedExercises['Foundation'].exercises).toHaveLength(2);
      expect(updatedExercises['Progression'].exercises).toHaveLength(3);
      expect(updatedExercises['Advanced'].exercises).toHaveLength(2);

      expect(updatedExercises['Foundation'].exercises[0]).toEqual(initialConfig.groups['Foundation'].exercises[0]);
      expect(updatedExercises['Foundation'].exercises[1]).toEqual(initialConfig.groups['Foundation'].exercises[1]);

      expect(updatedExercises['Progression'].exercises[2].name).toBe('Plank Hold');
      expect(updatedExercises['Advanced'].exercises[1].name).toBe('Full Push-ups');

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(existingList.id);
    });

    it('should preserve existing exercises when adding new ones', async () => {
      const list = await createTrackedExerciseList('Preservation Test');

      const initialExercises = [
        { id: 'preserve1', name: 'Exercise to Preserve 1', type: 'reps' as const, value: 10 },
        { id: 'preserve2', name: 'Exercise to Preserve 2', type: 'time' as const, value: 30 },
        { id: 'preserve3', name: 'Exercise to Preserve 3', type: 'reps' as const, value: 10 }
      ];

      list.config = createCustomTestConfig({
        'Existing Group': initialExercises
      }, 45);
      await saveExerciseList(list);

      const originalLoaded = await loadExerciseList(list.id);
      const originalExercises = originalLoaded!.config.groups['Existing Group'].exercises;

      const newExercises = [
        { id: 'new1', name: 'New Exercise 1', type: 'reps' as const, value: 15 },
        { id: 'new2', name: 'New Exercise 2', type: 'time' as const, value: 45 }
      ];

      list.config.groups['Existing Group'].exercises.push(...newExercises);
      await saveExerciseList(list);

      const updatedLoaded = await loadExerciseList(list.id);
      const updatedExercises = updatedLoaded!.config.groups['Existing Group'].exercises;

      expect(updatedExercises).toHaveLength(5);

      expect(updatedExercises[0]).toEqual(originalExercises[0]);
      expect(updatedExercises[1]).toEqual(originalExercises[1]);
      expect(updatedExercises[2]).toEqual(originalExercises[2]);

      expect(updatedExercises[3]).toEqual(newExercises[0]);
      expect(updatedExercises[4]).toEqual(newExercises[1]);

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(list.id);
    });
  });

  describe('Data Isolation Between Custom Lists', () => {
    it('should maintain separate exercise data between different custom lists', async () => {
      const listA = await createTrackedExerciseList('List A', 'First custom list');
      const listB = await createTrackedExerciseList('List B', 'Second custom list');
      const listC = await createTrackedExerciseList('List C', 'Third custom list');

      const configA = createCustomTestConfig({
        'Upper Body': [
          { id: 'a1', name: 'Push-ups A', type: 'reps', value: 10 },
          { id: 'a2', name: 'Rows A', type: 'reps', value: 12 }
        ]
      }, 30);

      const configB = createCustomTestConfig({
        'Lower Body': [
          { id: 'b1', name: 'Squats B', type: 'reps', value: 20 },
          { id: 'b2', name: 'Lunges B', type: 'reps', value: 15 }
        ]
      }, 60);

      const configC = createCustomTestConfig({
        'Core': [
          { id: 'c1', name: 'Plank C', type: 'time', value: 60 },
          { id: 'c2', name: 'Russian Twists C', type: 'reps', value: 25 }
        ]
      }, 90);

      listA.config = configA;
      listB.config = configB;
      listC.config = configC;

      await saveExerciseList(listA);
      await saveExerciseList(listB);
      await saveExerciseList(listC);

      const loadedA = await loadExerciseList(listA.id);
      const loadedB = await loadExerciseList(listB.id);
      const loadedC = await loadExerciseList(listC.id);

      expect(loadedA!.config.globalRestTime).toBe(30);
      expect(loadedB!.config.globalRestTime).toBe(60);
      expect(loadedC!.config.globalRestTime).toBe(90);

      expect(loadedA!.config.groups['Upper Body'].exercises[0].name).toBe('Push-ups A');
      expect(loadedB!.config.groups['Lower Body'].exercises[0].name).toBe('Squats B');
      expect(loadedC!.config.groups['Core'].exercises[0].name).toBe('Plank C');

      expect(loadedA!.config.groups).not.toHaveProperty('Lower Body');
      expect(loadedA!.config.groups).not.toHaveProperty('Core');
      expect(loadedB!.config.groups).not.toHaveProperty('Upper Body');
      expect(loadedB!.config.groups).not.toHaveProperty('Core');
      expect(loadedC!.config.groups).not.toHaveProperty('Upper Body');
      expect(loadedC!.config.groups).not.toHaveProperty('Lower Body');

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(listA.id);
      await deleteExerciseList(listB.id);
      await deleteExerciseList(listC.id);
    });

    it('should allow same exercise names in different custom lists', async () => {
      const list1 = await createTrackedExerciseList('Morning Workout');
      const list2 = await createTrackedExerciseList('Evening Workout');

      const exerciseName = 'Push-ups';

      list1.config = createCustomTestConfig({
        'Morning': [
          { id: 'morn1', name: exerciseName, type: 'reps', value: 15 }
        ]
      }, 30);

      list2.config = createCustomTestConfig({
        'Evening': [
          { id: 'eve1', name: exerciseName, type: 'reps', value: 10 }
        ]
      }, 45);

      await saveExerciseList(list1);
      await saveExerciseList(list2);

      const loaded1 = await loadExerciseList(list1.id);
      const loaded2 = await loadExerciseList(list2.id);

      expect(loaded1!.config.groups['Morning'].exercises[0].name).toBe(exerciseName);
      expect(loaded1!.config.groups['Morning'].exercises[0].value).toBe(15);

      expect(loaded2!.config.groups['Evening'].exercises[0].name).toBe(exerciseName);
      expect(loaded2!.config.groups['Evening'].exercises[0].value).toBe(10);

      expect(loaded1!.config.groups['Morning'].exercises[0].id).not.toBe(loaded2!.config.groups['Evening'].exercises[0].id);

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(list1.id);
      await deleteExerciseList(list2.id);
    });

    it('should prevent interference when modifying one custom list', async () => {
      const list1 = await createTrackedExerciseList('List 1');
      const list2 = await createTrackedExerciseList('List 2');

      list1.config = createTestConfig();
      list2.config = createCustomTestConfig({}, 5);

      await saveExerciseList(list1);
      await saveExerciseList(list2);

      list1.config = createCustomTestConfig({
        'Push': [
          { id: 'push1', name: 'Push-ups', type: 'reps' as const, value: 10 },
          { id: 'push2', name: 'Bench Press', type: 'reps' as const, value: 8 }
        ],
        'Pull': [
          { id: 'pull1', name: 'Pull-ups', type: 'reps' as const, value: 8 },
          { id: 'pull2', name: 'Rows', type: 'reps' as const, value: 10 }
        ],
        'Legs': [
          { id: 'legs1', name: 'Squats', type: 'reps' as const, value: 12 },
          { id: 'legs2', name: 'Lunges', type: 'reps' as const, value: 10 }
        ],
        'New Group': [{ id: 'new1', name: 'New Exercise', type: 'reps' as const, value: 25 }]
      }, 120);
      await saveExerciseList(list1);

      const loaded2 = await loadExerciseList(list2.id);
      expect(loaded2!.config.globalRestTime).toBe(5);
      expect(loaded2!.config.groups).toEqual({});

      const loaded1 = await loadExerciseList(list1.id);
      expect(loaded1!.config.globalRestTime).toBe(120);
      expect(loaded1!.config.groups).toHaveProperty('New Group');

      // Nettoyer : supprimer les listes de test
      await deleteExerciseList(list1.id);
      await deleteExerciseList(list2.id);
    });
  });

  describe('Exercise Preservation During Additions', () => {
    it('should preserve existing exercises when adding new ones to custom lists', async () => {
      const list = await createTrackedExerciseList('Preservation Test List');

      const initialExercises = [
        { id: 'preserve1', name: 'Exercise to Preserve 1', type: 'reps' as const, value: 10 },
        { id: 'preserve2', name: 'Exercise to Preserve 2', type: 'time' as const, value: 30 },
        { id: 'preserve3', name: 'Exercise to Preserve 3', type: 'reps' as const, value: 10 }
      ];

      list.config = createCustomTestConfig({
        'Existing Group': initialExercises
      }, 45);
      await saveExerciseList(list);

      const originalLoaded = await loadExerciseList(list.id);
      const originalExercises = originalLoaded!.config.groups['Existing Group'].exercises;

      const newExercises = [
        { id: 'new1', name: 'New Exercise 1', type: 'reps' as const, value: 15 },
        { id: 'new2', name: 'New Exercise 2', type: 'time' as const, value: 45 }
      ];

      list.config.groups['Existing Group'].exercises.push(...newExercises);
      await saveExerciseList(list);

      const updatedLoaded = await loadExerciseList(list.id);
      const updatedExercises = updatedLoaded!.config.groups['Existing Group'].exercises;

      expect(updatedExercises).toHaveLength(5);

      expect(updatedExercises[0]).toEqual(originalExercises[0]);
      expect(updatedExercises[1]).toEqual(originalExercises[1]);
      expect(updatedExercises[2]).toEqual(originalExercises[2]);

      expect(updatedExercises[3]).toEqual(newExercises[0]);
      expect(updatedExercises[4]).toEqual(newExercises[1]);

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(list.id);
    });

    it('should preserve exercises when adding new groups to custom lists', async () => {
      const list = await createTrackedExerciseList('Group Addition Test');

      const originalGroup = [
        { id: 'orig1', name: 'Original Exercise', type: 'reps' as const, value: 12 }
      ];

      list.config = createCustomTestConfig({
        'Original Group': originalGroup
      }, 30);
      await saveExerciseList(list);

      const cardioGroup = [
        { id: 'cardio1', name: 'Burpees', type: 'reps' as const, value: 8 },
        { id: 'cardio2', name: 'Jumping Jacks', type: 'reps' as const, value: 20 }
      ];

      const strengthGroup = [
        { id: 'strength1', name: 'Pull-ups', type: 'reps' as const, value: 6 },
        { id: 'strength2', name: 'Dips', type: 'reps' as const, value: 10 }
      ];

      list.config = createCustomTestConfig({
        'Original Group': originalGroup,
        'Cardio': cardioGroup,
        'Strength': strengthGroup
      }, 30);
      await saveExerciseList(list);

      const loadedList = await loadExerciseList(list.id);
      expect(Object.keys(loadedList!.config.groups)).toHaveLength(3);

      expect(loadedList!.config.groups['Original Group'].exercises).toEqual(originalGroup);
      expect(loadedList!.config.groups['Cardio'].exercises).toEqual(cardioGroup);
      expect(loadedList!.config.groups['Strength'].exercises).toEqual(strengthGroup);

      // Nettoyer : supprimer la liste de test
      await deleteExerciseList(list.id);
    });
  });
});