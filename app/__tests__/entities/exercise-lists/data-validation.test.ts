import { saveTraining, loadTraining } from '../../../exercises/lists';
import { getWorkoutView } from '../../../exercises/actions';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import {
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

describe('Trainings - Data Validation', () => {
  describe('Exercise Data Integrity', () => {
    it('should handle exercises with all required fields', async () => {
      const training = await createTrackedExerciseList('Validation Test');

      const validExercises = [
        { id: 'ex1', name: 'Push-ups', type: 'reps' as const, value: 10 },
        { id: 'ex2', name: 'Plank', type: 'time' as const, value: 30 },
        { id: 'ex3', name: 'Running', type: 'reps' as const, value: 100 },
      ];

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({ Valid: validExercises })
      );

      const loaded = await loadTraining(training.id);
      const workout = await getWorkoutView(training.id);

      expect(loaded!.exerciseRefs).toHaveLength(3);
      loaded!.exerciseRefs.forEach((ref, index) => {
        expect(ref.refId).toBe(validExercises[index].id);
        expect(ref.exerciseId).toBe(validExercises[index].id);
        const def = workout.exercises[validExercises[index].id];
        expect(def.name).toBe(validExercises[index].name);
        expect(def.type).toBe(validExercises[index].type);
        expect(def.value).toBe(validExercises[index].value);
      });
    });

    it('should preserve exercise data types', async () => {
      const training = await createTrackedExerciseList('Data Types Test');

      const exercisesWithTypes = [
        { id: 'int', name: 'Integer Reps', type: 'reps' as const, value: 15 },
        { id: 'float', name: 'Float Time', type: 'time' as const, value: 45 },
        { id: 'large', name: 'Large Reps', type: 'reps' as const, value: 5000 },
      ];

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({ 'Data Types': exercisesWithTypes })
      );

      const workout = await getWorkoutView(training.id);
      expect(workout.exercises['int'].value).toBe(15);
      expect(workout.exercises['float'].value).toBe(45);
      expect(workout.exercises['large'].value).toBe(5000);
    });

    it('should handle empty exerciseRefs array', async () => {
      const training = await createTrackedExerciseList('Empty Exercises Test');
      training.exerciseRefs = [];
      await saveTraining(training);

      const loaded = await loadTraining(training.id);
      expect(loaded!.exerciseRefs).toEqual([]);
    });

    it('should handle special characters in exercise names', async () => {
      const training = await createTrackedExerciseList('Special Characters Test');

      const exercisesWithSpecialChars = [
        { id: 'special1', name: 'Push-ups (Modified)', type: 'reps' as const, value: 10 },
        { id: 'special2', name: 'Plank - Advanced', type: 'time' as const, value: 60 },
        { id: 'special3', name: 'Running: 5K', type: 'reps' as const, value: 10 },
        { id: 'special4', name: 'Squats & Lunges', type: 'reps' as const, value: 15 },
      ];

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({ Special: exercisesWithSpecialChars })
      );

      const workout = await getWorkoutView(training.id);
      expect(workout.exercises['special1'].name).toBe('Push-ups (Modified)');
      expect(workout.exercises['special2'].name).toBe('Plank - Advanced');
      expect(workout.exercises['special3'].name).toBe('Running: 5K');
      expect(workout.exercises['special4'].name).toBe('Squats & Lunges');
    });
  });

  describe('Configuration Data Integrity', () => {
    it('should preserve globalRestTime values', async () => {
      const testCases = [0, 30, 120, 300, 999];

      for (const restTime of testCases) {
        const training = await createTrackedExerciseList(`Rest Time ${restTime}`);
        training.globalRestTime = restTime;
        await saveTraining(training);

        const loaded = await loadTraining(training.id);
        expect(loaded!.globalRestTime).toBe(restTime);
      }
    });

    it('should handle empty exerciseRefs on training', async () => {
      const training = await createTrackedExerciseList('Empty Refs Test');
      training.exerciseRefs = [];
      training.globalRestTime = 30;
      await saveTraining(training);

      const loaded = await loadTraining(training.id);
      expect(loaded!.exerciseRefs).toEqual([]);
      expect(loaded!.exerciseRefs).toHaveLength(0);
    });

    it('should preserve multiple exercise refs in order', async () => {
      const training = await createTrackedExerciseList('Refs Order Test');

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({
          'Basic Exercises': [{ id: 'basic1', name: 'Push-up', type: 'reps', value: 10 }],
          'Advanced (Level 2)': [{ id: 'adv1', name: 'Pistol Squat', type: 'reps', value: 5 }],
          'Cardio & Core': [{ id: 'cardio1', name: 'Burpee', type: 'reps', value: 8 }],
        })
      );

      const loaded = await loadTraining(training.id);
      expect(loaded!.exerciseRefs).toHaveLength(3);
      expect(loaded!.exerciseRefs.map((r) => r.exerciseId)).toEqual(['basic1', 'adv1', 'cardio1']);
    });
  });

  describe('Training Metadata Integrity', () => {
    it('should preserve training names with special characters', async () => {
      const testNames = [
        'My Workout (Advanced)',
        'Morning Routine - Week 1',
        'Cardio: HIIT Session',
        'Strength & Power',
        'Recovery + Mobility',
      ];

      const trainings = [];

      for (const name of testNames) {
        const training = await createTrackedExerciseList(name, `Description for ${name}`);
        await saveTraining(training);
        trainings.push(training);
      }

      for (const training of trainings) {
        const loaded = await loadTraining(training.id);
        expect(loaded!.name).toBe(training.name);
        expect(loaded!.description).toBe(training.description);
      }
    });

    it('should handle very long training names and descriptions', async () => {
      const longName = 'A'.repeat(200);
      const longDescription = 'B'.repeat(1000);

      const training = await createTrackedExerciseList(longName, longDescription);
      await saveTraining(training);

      const loaded = await loadTraining(training.id);
      expect(loaded!.name).toBe(longName);
      expect(loaded!.description).toBe(longDescription);
    });

    it('should preserve timestamps correctly', async () => {
      const training = await createTrackedExerciseList('Timestamp Test');

      const createdAt = training.createdAt;
      const updatedAt = training.updatedAt;

      await saveTraining(training);

      const loaded = await loadTraining(training.id);
      expect(new Date(loaded!.createdAt).getTime()).toBeCloseTo(new Date(createdAt).getTime(), -2);
      expect(new Date(loaded!.updatedAt).getTime()).toBeCloseTo(new Date(updatedAt).getTime(), -2);

      await new Promise((resolve) => setTimeout(resolve, 10));

      training.globalRestTime = 60;
      await saveTraining(training);

      const reloaded = await loadTraining(training.id);
      expect(reloaded!.createdAt).toBe(createdAt);
      expect(reloaded!.updatedAt).not.toBe(updatedAt);
      expect(new Date(reloaded!.updatedAt).getTime()).toBeGreaterThan(new Date(updatedAt).getTime());
    });
  });

  describe('File System Resilience', () => {
    it('should handle concurrent file operations', async () => {
      const trainings = [];

      const promises = [];
      for (let i = 1; i <= 10; i++) {
        promises.push(createTrackedExerciseList(`Concurrent ${i}`));
      }

      const created = await Promise.all(promises);

      for (const training of created) {
        const view = createCustomTestWorkoutView({
          [`Group ${training.name}`]: [
            {
              id: `ex${training.name.replace(/\s/g, '')}`,
              name: `Exercise ${training.name}`,
              type: 'reps' as const,
              value: 10,
            },
          ],
        });
        await saveTrainingWithView(training, view);
      }

      const loadPromises = created.map((t) => loadTraining(t.id));
      const loaded = await Promise.all(loadPromises);

      loaded.forEach((item, index) => {
        expect(item).toBeDefined();
        expect(item!.name).toBe(created[index].name);
        expect(item!.exerciseRefs).toHaveLength(1);
      });
    });

    it('should handle file system race conditions', async () => {
      const training1 = await createTrackedExerciseList('Race Condition Test 1');
      const training2 = await createTrackedExerciseList('Race Condition Test 2');

      await saveTrainingWithView(
        training1,
        createCustomTestWorkoutView({
          'Group 1': [{ id: 'r1', name: 'Race Exercise 1', type: 'reps', value: 5 }],
        })
      );
      await saveTrainingWithView(
        training2,
        createCustomTestWorkoutView({
          'Group 2': [{ id: 'r2', name: 'Race Exercise 2', type: 'reps', value: 10 }],
        })
      );

      const [view1, view2] = await Promise.all([
        getWorkoutView(training1.id),
        getWorkoutView(training2.id),
      ]);

      expect(view1.exercises['r1'].value).toBe(5);
      expect(view2.exercises['r2'].value).toBe(10);
    });
  });
});
