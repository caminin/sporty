import { saveTraining, loadTraining, deleteTraining } from '../../../exercises/lists';
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

describe('Trainings - Custom Training Operations', () => {
  describe('Adding Exercises to Custom Trainings', () => {
    it('should add exercises to an empty custom training', async () => {
      const training = await createTrackedExerciseList(
        'My Custom Workout',
        'A personalized training plan'
      );

      expect(training.exerciseRefs).toEqual([]);

      const view = createCustomTestWorkoutView(
        {
          'Warm-up': [
            { id: 'warm1', name: 'Jumping Jacks', type: 'reps', value: 20 },
            { id: 'warm2', name: 'Arm Circles', type: 'time', value: 30 },
          ],
          'Main Workout': [
            { id: 'main1', name: 'Push-ups', type: 'reps', value: 15 },
            { id: 'main2', name: 'Squats', type: 'reps', value: 20 },
            { id: 'main3', name: 'Plank', type: 'time', value: 60 },
          ],
        },
        45
      );

      await saveTrainingWithView(training, view);

      const loaded = await loadTraining(training.id);
      const workout = await getWorkoutView(training.id);
      expect(loaded).toBeDefined();
      expect(loaded!.globalRestTime).toBe(45);
      expect(loaded!.exerciseRefs).toHaveLength(5);
      expect(workout.exercises['main1'].name).toBe('Push-ups');
      expect(workout.exercises['main2'].name).toBe('Squats');
      expect(workout.exercises['main3'].name).toBe('Plank');
    });

    it('should allow different exercise configurations in custom trainings', async () => {
      const cardio = await createTrackedExerciseList('Cardio Focused', 'High intensity cardio workout');
      const strength = await createTrackedExerciseList('Strength Training', 'Heavy lifting session');

      const cardioView = createCustomTestWorkoutView(
        {
          HIIT: [
            { id: 'hiit1', name: 'Burpees', type: 'reps', value: 10 },
            { id: 'hiit2', name: 'Mountain Climbers', type: 'time', value: 30 },
          ],
        },
        20
      );

      const strengthView = createCustomTestWorkoutView(
        {
          'Compound Lifts': [
            { id: 'comp1', name: 'Deadlift', type: 'reps', value: 5 },
            { id: 'comp2', name: 'Bench Press', type: 'reps', value: 8 },
          ],
        },
        120
      );

      await saveTrainingWithView(cardio, cardioView);
      await saveTrainingWithView(strength, strengthView);

      const loadedCardio = await getWorkoutView(cardio.id);
      const loadedStrength = await getWorkoutView(strength.id);

      expect(loadedCardio.globalRestTime).toBe(20);
      expect(loadedStrength.globalRestTime).toBe(120);
      expect(loadedCardio.exercises['hiit1'].name).toBe('Burpees');
      expect(loadedStrength.exercises['comp1'].name).toBe('Deadlift');

      await deleteTraining(cardio.id);
      await deleteTraining(strength.id);
    });

    it('should add exercises to an existing custom training with exercises', async () => {
      const training = await createTrackedExerciseList('Progressive Training', 'Building up over time');

      const initialView = createCustomTestWorkoutView(
        {
          Foundation: [
            { id: 'found1', name: 'Bodyweight Squats', type: 'reps', value: 15 },
            { id: 'found2', name: 'Wall Push-ups', type: 'reps', value: 10 },
          ],
        },
        60
      );

      await saveTrainingWithView(training, initialView);
      expect((await loadTraining(training.id))!.exerciseRefs).toHaveLength(2);

      const expandedView = createCustomTestWorkoutView(
        {
          Foundation: [
            { id: 'found1', name: 'Bodyweight Squats', type: 'reps', value: 15 },
            { id: 'found2', name: 'Wall Push-ups', type: 'reps', value: 10 },
          ],
          Progression: [
            { id: 'prog1', name: 'Regular Squats', type: 'reps', value: 20 },
            { id: 'prog2', name: 'Knee Push-ups', type: 'reps', value: 12 },
            { id: 'prog3', name: 'Plank Hold', type: 'time', value: 45 },
          ],
          Advanced: [
            { id: 'adv1', name: 'Pistol Squats', type: 'reps', value: 8 },
            { id: 'adv2', name: 'Full Push-ups', type: 'reps', value: 15 },
          ],
        },
        60
      );

      await saveTrainingWithView(training, expandedView);

      const updated = await loadTraining(training.id);
      const workout = await getWorkoutView(training.id);

      expect(updated!.exerciseRefs).toHaveLength(7);
      expect(updated!.exerciseRefs.filter((r) => r.exerciseId.startsWith('found'))).toHaveLength(2);
      expect(updated!.exerciseRefs.filter((r) => r.exerciseId.startsWith('prog'))).toHaveLength(3);
      expect(updated!.exerciseRefs.filter((r) => r.exerciseId.startsWith('adv'))).toHaveLength(2);
      expect(workout.exercises['prog3'].name).toBe('Plank Hold');
      expect(workout.exercises['adv2'].name).toBe('Full Push-ups');

      await deleteTraining(training.id);
    });

    it('should preserve existing exercises when adding new ones', async () => {
      const training = await createTrackedExerciseList('Preservation Test');

      const initialExercises = [
        { id: 'preserve1', name: 'Exercise to Preserve 1', type: 'reps' as const, value: 10 },
        { id: 'preserve2', name: 'Exercise to Preserve 2', type: 'time' as const, value: 30 },
        { id: 'preserve3', name: 'Exercise to Preserve 3', type: 'reps' as const, value: 10 },
      ];

      const initialView = createCustomTestWorkoutView({ Existing: initialExercises }, 45);
      await saveTrainingWithView(training, initialView);

      const originalRefs = (await loadTraining(training.id))!.exerciseRefs;

      const expandedView = createCustomTestWorkoutView(
        {
          Existing: [
            ...initialExercises,
            { id: 'new1', name: 'New Exercise 1', type: 'reps', value: 15 },
            { id: 'new2', name: 'New Exercise 2', type: 'time', value: 45 },
          ],
        },
        45
      );
      await saveTrainingWithView(training, expandedView);

      const updatedRefs = (await loadTraining(training.id))!.exerciseRefs;
      expect(updatedRefs).toHaveLength(5);
      expect(updatedRefs.slice(0, 3)).toEqual(originalRefs);

      await deleteTraining(training.id);
    });
  });

  describe('Data Isolation Between Custom Trainings', () => {
    it('should maintain separate exercise data between different custom trainings', async () => {
      const trainingA = await createTrackedExerciseList('List A', 'First custom training');
      const trainingB = await createTrackedExerciseList('List B', 'Second custom training');
      const trainingC = await createTrackedExerciseList('List C', 'Third custom training');

      await saveTrainingWithView(
        trainingA,
        createCustomTestWorkoutView(
          {
            'Upper Body': [
              { id: 'a1', name: 'Push-ups A', type: 'reps', value: 10 },
              { id: 'a2', name: 'Rows A', type: 'reps', value: 12 },
            ],
          },
          30
        )
      );
      await saveTrainingWithView(
        trainingB,
        createCustomTestWorkoutView(
          {
            'Lower Body': [
              { id: 'b1', name: 'Squats B', type: 'reps', value: 20 },
              { id: 'b2', name: 'Lunges B', type: 'reps', value: 15 },
            ],
          },
          60
        )
      );
      await saveTrainingWithView(
        trainingC,
        createCustomTestWorkoutView(
          {
            Core: [
              { id: 'c1', name: 'Plank C', type: 'time', value: 60 },
              { id: 'c2', name: 'Russian Twists C', type: 'reps', value: 25 },
            ],
          },
          90
        )
      );

      const viewA = await getWorkoutView(trainingA.id);
      const viewB = await getWorkoutView(trainingB.id);
      const viewC = await getWorkoutView(trainingC.id);

      expect(viewA.globalRestTime).toBe(30);
      expect(viewB.globalRestTime).toBe(60);
      expect(viewC.globalRestTime).toBe(90);
      expect(viewA.exercises['a1'].name).toBe('Push-ups A');
      expect(viewB.exercises['b1'].name).toBe('Squats B');
      expect(viewC.exercises['c1'].name).toBe('Plank C');

      expect(viewA.exerciseRefs.every((r) => !['b1', 'b2', 'c1', 'c2'].includes(r.exerciseId))).toBe(true);
      expect(viewB.exerciseRefs.every((r) => !['a1', 'a2', 'c1', 'c2'].includes(r.exerciseId))).toBe(true);
      expect(viewC.exerciseRefs.every((r) => !['a1', 'a2', 'b1', 'b2'].includes(r.exerciseId))).toBe(true);

      await deleteTraining(trainingA.id);
      await deleteTraining(trainingB.id);
      await deleteTraining(trainingC.id);
    });

    it('should allow same exercise names in different custom trainings', async () => {
      const training1 = await createTrackedExerciseList('Morning Workout');
      const training2 = await createTrackedExerciseList('Evening Workout');

      const exerciseName = 'Push-ups';

      await saveTrainingWithView(
        training1,
        createCustomTestWorkoutView(
          { Morning: [{ id: 'morn1', name: exerciseName, type: 'reps', value: 15 }] },
          30
        )
      );
      await saveTrainingWithView(
        training2,
        createCustomTestWorkoutView(
          { Evening: [{ id: 'eve1', name: exerciseName, type: 'reps', value: 10 }] },
          45
        )
      );

      const view1 = await getWorkoutView(training1.id);
      const view2 = await getWorkoutView(training2.id);

      expect(view1.exercises['morn1'].name).toBe(exerciseName);
      expect(view1.exercises['morn1'].value).toBe(15);
      expect(view2.exercises['eve1'].name).toBe(exerciseName);
      expect(view2.exercises['eve1'].value).toBe(10);
      expect(view1.exerciseRefs[0].refId).not.toBe(view2.exerciseRefs[0].refId);

      await deleteTraining(training1.id);
      await deleteTraining(training2.id);
    });

    it('should prevent interference when modifying one custom training', async () => {
      const training1 = await createTrackedExerciseList('List 1');
      const training2 = await createTrackedExerciseList('List 2');

      await saveTrainingWithView(training1, createCustomTestWorkoutView({}, 5));
      training2.globalRestTime = 5;
      await saveTraining(training2);

      await saveTrainingWithView(
        training1,
        createCustomTestWorkoutView(
          {
            Push: [
              { id: 'push1', name: 'Push-ups', type: 'reps' as const, value: 10 },
              { id: 'push2', name: 'Bench Press', type: 'reps' as const, value: 8 },
            ],
            Pull: [
              { id: 'pull1', name: 'Pull-ups', type: 'reps' as const, value: 8 },
              { id: 'pull2', name: 'Rows', type: 'reps' as const, value: 10 },
            ],
            Legs: [
              { id: 'legs1', name: 'Squats', type: 'reps' as const, value: 12 },
              { id: 'legs2', name: 'Lunges', type: 'reps' as const, value: 10 },
            ],
            New: [{ id: 'new1', name: 'New Exercise', type: 'reps' as const, value: 25 }],
          },
          120
        )
      );

      const loaded2 = await loadTraining(training2.id);
      expect(loaded2!.globalRestTime).toBe(5);
      expect(loaded2!.exerciseRefs).toEqual([]);

      const loaded1 = await loadTraining(training1.id);
      expect(loaded1!.globalRestTime).toBe(120);
      expect(loaded1!.exerciseRefs).toHaveLength(7);

      await deleteTraining(training1.id);
      await deleteTraining(training2.id);
    });
  });

  describe('Exercise Preservation During Additions', () => {
    it('should preserve exercises when adding new refs to custom trainings', async () => {
      const training = await createTrackedExerciseList('Ref Addition Test');

      const originalGroup = [
        { id: 'orig1', name: 'Original Exercise', type: 'reps' as const, value: 12 },
      ];

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({ Original: originalGroup }, 30)
      );

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          {
            Original: originalGroup,
            Cardio: [
              { id: 'cardio1', name: 'Burpees', type: 'reps' as const, value: 8 },
              { id: 'cardio2', name: 'Jumping Jacks', type: 'reps' as const, value: 20 },
            ],
            Strength: [
              { id: 'strength1', name: 'Pull-ups', type: 'reps' as const, value: 6 },
              { id: 'strength2', name: 'Dips', type: 'reps' as const, value: 10 },
            ],
          },
          30
        )
      );

      const loaded = await loadTraining(training.id);
      const workout = await getWorkoutView(training.id);

      expect(loaded!.exerciseRefs).toHaveLength(5);
      expect(workout.exercises['orig1'].name).toBe('Original Exercise');

      await deleteTraining(training.id);
    });
  });
});
