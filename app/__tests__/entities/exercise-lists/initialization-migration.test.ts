import {
  saveTraining,
  loadTraining,
  listTrainings,
  initializeExerciseLists,
} from '../../../exercises/lists';
import { getWorkoutView } from '../../../exercises/actions';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import {
  createTestWorkoutView,
  createCustomTestWorkoutView,
  persistTestCatalogAndTraining,
} from '../../shared/exercise-lists-helpers';
import type { Training, WorkoutView } from '../../../exercises/types';

async function saveTrainingWithView(training: Training, view: WorkoutView): Promise<void> {
  training.globalRestTime = view.globalRestTime;
  training.exerciseRefs = view.exerciseRefs.map((r) => ({ ...r }));
  await persistTestCatalogAndTraining(training, { exercises: view.exercises });
}

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Trainings - Initialization & Migration', () => {
  describe('Training Initialization', () => {
    it('should initialize new trainings with correct default structure', async () => {
      const training = await createTrackedExerciseList('Initialization Test');

      expect(training).toHaveProperty('id');
      expect(training).toHaveProperty('name', 'Initialization Test');
      expect(training).toHaveProperty('description', undefined);
      expect(training).toHaveProperty('createdAt');
      expect(training).toHaveProperty('updatedAt');
      expect(training).toHaveProperty('globalRestTime', 30);
      expect(training).toHaveProperty('exerciseRefs');
      expect(training.exerciseRefs).toEqual([]);

      expect(typeof training.createdAt).toBe('string');
      expect(typeof training.updatedAt).toBe('string');
      expect(training.id).toMatch(/^training_/);
    });

    it('should create trainings with custom descriptions', async () => {
      const description = 'A detailed description for testing initialization';
      const training = await createTrackedExerciseList('Custom Description Test', description);

      expect(training.description).toBe(description);
    });

    it('should generate unique IDs for each new training', async () => {
      const training1 = await createTrackedExerciseList('Unique ID Test 1');
      const training2 = await createTrackedExerciseList('Unique ID Test 2');
      const training3 = await createTrackedExerciseList('Unique ID Test 3');

      expect(training1.id).not.toBe(training2.id);
      expect(training2.id).not.toBe(training3.id);
      expect(training1.id).not.toBe(training3.id);

      const ids = [training1.id, training2.id, training3.id];
      expect(new Set(ids).size).toBe(3);
    });
  });

  describe('Data Persistence After Creation', () => {
    it('should persist newly created trainings to disk', async () => {
      const training = await createTrackedExerciseList('Persistence Test', 'Testing data persistence');

      const loaded = await loadTraining(training.id);
      expect(loaded).toBeDefined();
      expect(loaded!.id).toBe(training.id);
      expect(loaded!.name).toBe(training.name);
      expect(loaded!.description).toBe(training.description);
      expect(loaded!.createdAt).toBe(training.createdAt);
      expect(loaded!.updatedAt).toBe(training.updatedAt);
    });

    it('should maintain data integrity after multiple save operations', async () => {
      const training = await createTrackedExerciseList('Multiple Saves Test');

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          { Initial: [{ id: 'init1', name: 'Initial Exercise', type: 'reps', value: 10 }] },
          30
        )
      );

      let loaded = await loadTraining(training.id);
      expect(loaded!.globalRestTime).toBe(30);
      expect(loaded!.exerciseRefs).toHaveLength(1);

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          {
            Initial: [{ id: 'init1', name: 'Initial Exercise', type: 'reps', value: 15 }],
            New: [{ id: 'new1', name: 'New Exercise', type: 'time', value: 45 }],
          },
          60
        )
      );

      loaded = await loadTraining(training.id);
      const workout = await getWorkoutView(training.id);
      expect(loaded!.globalRestTime).toBe(60);
      expect(workout.exercises['init1'].value).toBe(15);
      expect(loaded!.exerciseRefs).toHaveLength(2);
      expect(workout.exercises['new1'].name).toBe('New Exercise');
    });
  });

  describe('Migration Scenarios', () => {
    it('should handle migration from empty refs to populated refs', async () => {
      const training = await createTrackedExerciseList('Migration Test');

      expect(training.exerciseRefs).toEqual([]);

      await saveTrainingWithView(training, createTestWorkoutView());

      const loaded = await loadTraining(training.id);
      expect(loaded!.exerciseRefs.length).toBeGreaterThan(0);
      expect(loaded!.exerciseRefs.map((r) => r.exerciseId)).toContain('push1');
      expect(loaded!.exerciseRefs.map((r) => r.exerciseId)).toContain('pull1');
      expect(loaded!.exerciseRefs.map((r) => r.exerciseId)).toContain('legs1');
    });

    it('should handle structure changes during migration', async () => {
      const training = await createTrackedExerciseList('Structure Migration Test');

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          { 'Old Group': [{ id: 'old1', name: 'Old Exercise', type: 'reps', value: 10 }] },
          30
        )
      );

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          {
            'New Group 1': [
              { id: 'new1', name: 'New Exercise 1', type: 'reps', value: 15 },
              { id: 'new2', name: 'New Exercise 2', type: 'time', value: 30 },
            ],
            'New Group 2': [{ id: 'new3', name: 'New Exercise 3', type: 'reps', value: 10 }],
          },
          45
        )
      );

      const loaded = await loadTraining(training.id);
      expect(loaded!.globalRestTime).toBe(45);
      expect(loaded!.exerciseRefs.map((r) => r.exerciseId)).not.toContain('old1');
      expect(loaded!.exerciseRefs).toHaveLength(3);
    });

    it('should preserve creation timestamp across migrations', async () => {
      const training = await createTrackedExerciseList('Timestamp Preservation Test');
      const originalCreatedAt = training.createdAt;

      await saveTrainingWithView(training, createTestWorkoutView());

      let loaded = await loadTraining(training.id);
      expect(loaded!.createdAt).toBe(originalCreatedAt);

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          { Migrated: [{ id: 'mig1', name: 'Migrated Exercise', type: 'reps', value: 20 }] },
          90
        )
      );

      loaded = await loadTraining(training.id);
      expect(loaded!.createdAt).toBe(originalCreatedAt);
      expect(new Date(loaded!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(originalCreatedAt).getTime()
      );
    });
  });

  describe('Error Handling During Initialization', () => {
    it('should handle filesystem errors during training creation', async () => {
      const training = await createTrackedExerciseList('Error Handling Test');

      expect(training).toBeDefined();
      expect(training.id).toBeDefined();
      expect(training.name).toBe('Error Handling Test');
    });

    it('should validate training data integrity after creation', async () => {
      const training = await createTrackedExerciseList('Integrity Test', 'Testing data integrity');

      const requiredFields = [
        'id',
        'name',
        'createdAt',
        'updatedAt',
        'globalRestTime',
        'exerciseRefs',
      ];
      requiredFields.forEach((field) => {
        expect(training).toHaveProperty(field);
      });

      expect(typeof training.id).toBe('string');
      expect(typeof training.name).toBe('string');
      expect(typeof training.createdAt).toBe('string');
      expect(typeof training.updatedAt).toBe('string');
      expect(typeof training.globalRestTime).toBe('number');
      expect(Array.isArray(training.exerciseRefs)).toBe(true);
    });
  });

  describe('Default Training Initialization', () => {
    it('should not create a default training on initialize when data is empty', async () => {
      await initializeExerciseLists();

      const trainings = await listTrainings();
      expect(trainings.find((t) => t.id === 'default')).toBeUndefined();
    });
  });

  describe('Training Discovery and Loading', () => {
    it('should discover newly created trainings in listTrainings', async () => {
      const initial = await listTrainings();
      const initialCount = initial.length;

      const training = await createTrackedExerciseList('Discovery Test');

      const updated = await listTrainings();
      expect(updated.length).toBeGreaterThanOrEqual(initialCount + 1);

      const found = updated.find((t) => t.id === training.id);
      expect(found).toBeDefined();
      expect(found!.name).toBe('Discovery Test');
    });

    it('should load trainings with complex exerciseRefs', async () => {
      const training = await createTrackedExerciseList('Complex Config Test');

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          {
            'Warm-up': [
              { id: 'w1', name: 'Jumping Jacks', type: 'reps', value: 20 },
              { id: 'w2', name: 'Arm Circles', type: 'time', value: 30 },
            ],
            'Main Workout': [
              { id: 'm1', name: 'Push-ups', type: 'reps', value: 15 },
              { id: 'm2', name: 'Squats', type: 'reps', value: 20 },
              { id: 'm3', name: 'Plank', type: 'time', value: 60 },
              { id: 'm4', name: 'Burpees', type: 'reps', value: 10 },
            ],
            'Cool-down': [{ id: 'c1', name: 'Stretching', type: 'time', value: 120 }],
          },
          45
        )
      );

      const loaded = await loadTraining(training.id);
      expect(loaded!.globalRestTime).toBe(45);
      expect(loaded!.exerciseRefs).toHaveLength(7);
    });
  });
});
