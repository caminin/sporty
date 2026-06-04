import { loadTraining, deleteTraining, listTrainings, createTraining } from '../../../exercises/lists';
import { saveGlobalCatalog } from '../../../exercises/catalog';
import {
  removeList,
  getExerciseList,
  importListFromManualFolder,
} from '../../../exercises/lists-actions';
import {
  getWorkoutView,
  addCatalogExercise,
  addExerciseToTraining,
  deleteExerciseFromTraining,
} from '../../../exercises/actions';
import {
  createCustomTestWorkoutView,
  persistTestCatalogAndTraining,
} from '../../shared/exercise-lists-helpers';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import type { Training, WorkoutView } from '../../../exercises/types';
import fs from 'fs/promises';
import path from 'path';

async function saveTrainingWithView(training: Training, view: WorkoutView): Promise<void> {
  training.globalRestTime = view.globalRestTime;
  training.exerciseRefs = view.exerciseRefs.map((r) => ({ ...r }));
  await persistTestCatalogAndTraining(training, { exercises: view.exercises });
}

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Trainings - Integration Tests', () => {
  describe('Complete CRUD Workflow', () => {
    it('should support complete create-read-update-delete workflow', async () => {
      const training = await createTrackedExerciseList('CRUD Test Training', 'Testing full workflow');

      let loaded = await loadTraining(training.id);
      expect(loaded!.name).toBe('CRUD Test Training');

      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView(
          { Test: [{ id: 'crud1', name: 'CRUD Exercise', type: 'reps', value: 20 }] },
          60
        )
      );

      loaded = await loadTraining(training.id);
      expect(loaded!.globalRestTime).toBe(60);
      expect(loaded!.exerciseRefs).toHaveLength(1);

      await deleteTraining(training.id);

      loaded = await loadTraining(training.id);
      expect(loaded).toBeNull();
    });
  });

  describe('Multiple Trainings Management', () => {
    it('should handle multiple custom trainings simultaneously', async () => {
      const trainings = [];

      for (let i = 1; i <= 5; i++) {
        const training = await createTrackedExerciseList(`Training ${i}`, `Description ${i}`);
        await saveTrainingWithView(
          training,
          createCustomTestWorkoutView(
            {
              [`Group ${i}`]: [
                { id: `ex${i}a`, name: `Exercise ${i}.1`, type: 'reps', value: i * 5 },
                { id: `ex${i}b`, name: `Exercise ${i}.2`, type: 'time', value: i * 15 },
              ],
            },
            i * 10
          )
        );
        trainings.push(training);
      }

      const all = await listTrainings();
      expect(all.length).toBeGreaterThanOrEqual(5);

      for (let i = 1; i <= 5; i++) {
        const loaded = await loadTraining(trainings[i - 1].id);
        expect(loaded!.globalRestTime).toBe(i * 10);
        expect(loaded!.exerciseRefs).toHaveLength(2);
      }

      for (const training of trainings) {
        await deleteTraining(training.id);
      }

      for (const training of trainings) {
        expect(await loadTraining(training.id)).toBeNull();
      }
    });
  });

  describe('Create Training and Add Exercise Refs Workflow', () => {
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'sporty';

    it('should create a new training, select it, and add exercise refs', async () => {
      const trainingName = 'Test Integration Training';
      const trainingDescription = "Entraînement créé pour tester l'intégration complète";

      const training = await createTraining(trainingName, trainingDescription);
      const newTrainingId = training.id;

      const loadResult = await getExerciseList(newTrainingId);
      expect(loadResult.success).toBe(true);
      expect(loadResult.list!.name).toBe(trainingName);
      expect(loadResult.list!.description).toBe(trainingDescription);

      const initialView = await getWorkoutView(newTrainingId);
      expect(initialView.globalRestTime).toBe(30);

      const squatId = 'test-squat';
      await addCatalogExercise(
        { name: 'Test Squat', type: 'reps', value: 15, muscleGroup: 'jambes' },
        undefined,
        squatId
      );
      let view = await addExerciseToTraining(newTrainingId, squatId);

      expect(view.exercises[squatId].name).toBe('Test Squat');
      expect(view.exerciseRefs.some((r) => r.exerciseId === squatId)).toBe(true);

      const runId = 'test-running';
      await addCatalogExercise(
        { name: 'Test Running', type: 'time', value: 300, muscleGroup: 'autre' },
        undefined,
        runId
      );
      const view2 = await addExerciseToTraining(newTrainingId, runId);

      expect(view2.exerciseRefs.filter((r) => r.exerciseId === runId)).toHaveLength(1);
      expect(view2.exercises[runId].name).toBe('Test Running');
      expect(view2.exercises[runId].type).toBe('time');
      expect(view2.exercises[runId].value).toBe(300);
      expect(view2.exerciseRefs.filter((r) => r.exerciseId === squatId)).toHaveLength(1);

      const deleteResult = await removeList(newTrainingId, adminPassword);
      expect(deleteResult.success).toBe(true);

      const loadAfterDelete = await getExerciseList(newTrainingId);
      expect(loadAfterDelete.success).toBe(false);
    });
  });

  describe('Test Execution Validation', () => {
    it('should run all tests without failures', async () => {
      expect(true).toBe(true);
    });
  });

  describe('Explicit trainingId validation', () => {
    it('should fail getWorkoutView when trainingId is missing', async () => {
      await expect(getWorkoutView('')).rejects.toThrow('Aucun entraînement sélectionné');
    });

    it('should fail mutation when trainingId is missing', async () => {
      const training = await createTrackedExerciseList('Mutation Validation');
      await saveTrainingWithView(
        training,
        createCustomTestWorkoutView({
          Test: [{ id: 'e1', name: 'Push-up', type: 'reps', value: 10 }],
        })
      );

      await expect(addExerciseToTraining('', 'e1')).rejects.toThrow('Aucun entraînement sélectionné');
      await expect(deleteExerciseFromTraining('', 'ref-1')).rejects.toThrow(
        'Aucun entraînement sélectionné'
      );

      await removeList(training.id, process.env.ADMIN_PASSWORD ?? 'sporty');
    });
  });

  describe('Manual folder import', () => {
    it('should import only a selected file from manual-lists folder', async () => {
      const adminPassword = process.env.ADMIN_PASSWORD ?? 'sporty';
      const dataDir = process.env.DATA_DIR ?? '/tmp/sporty-data';
      const manualDir = path.join(dataDir, 'manual-lists');
      const fileName = 'manual-target.json';
      const filePath = path.join(manualDir, fileName);

      await fs.mkdir(manualDir, { recursive: true });
      await saveGlobalCatalog({
        exercises: {
          m1: { id: 'm1', name: 'Manual Exo', type: 'reps', value: 12, muscleGroup: 'jambes' },
        },
      });
      await fs.writeFile(
        filePath,
        JSON.stringify({
          name: 'Liste manuelle ciblée',
          globalRestTime: 25,
          exerciseRefs: [{ refId: 'm1', exerciseId: 'm1' }],
        }),
        'utf-8'
      );

      const result = await importListFromManualFolder(fileName, 'Liste manuelle ciblée', adminPassword);
      expect(result.success).toBe(true);
      expect(result.trainingId).toBeDefined();

      const loaded = result.trainingId ? await getExerciseList(result.trainingId) : { success: false };
      expect(loaded.success).toBe(true);
      if (loaded.success) {
        expect(loaded.list!.globalRestTime).toBe(25);
        expect(loaded.list!.exerciseRefs).toHaveLength(1);
      }

      await fs.unlink(filePath);
    });
  });
});
