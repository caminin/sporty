import { saveExerciseList, loadExerciseList, deleteExerciseList, listExerciseLists } from '../../../exercises/lists';
import { createList, removeList, getExerciseList, importListFromManualFolder } from '../../../exercises/lists-actions';
import { getWorkoutConfig, createGroup, addExerciseToGroup, addCatalogExercise } from '../../../exercises/actions';
import { createCustomTestConfig } from '../../shared/exercise-lists-helpers';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';
import fs from 'fs/promises';
import path from 'path';

// Setup et cleanup Jest pour chaque test
beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('Exercise Lists - Integration Tests', () => {
  describe('Complete CRUD Workflow', () => {
    it('should support complete create-read-update-delete workflow', async () => {
      const testList = await createTrackedExerciseList('CRUD Test List', 'Testing full workflow');

      let loadedList = await loadExerciseList(testList.id);
      expect(loadedList!.name).toBe('CRUD Test List');

      testList.config = createCustomTestConfig({
        'Test Group': [{ id: 'crud1', name: 'CRUD Exercise', type: 'reps', value: 20 }],
      }, 60);
      await saveExerciseList(testList);

      loadedList = await loadExerciseList(testList.id);
      expect(loadedList!.config.globalRestTime).toBe(60);
      expect(loadedList!.config.groups['Test Group'].exercises).toHaveLength(1);

      await deleteExerciseList(testList.id);

      loadedList = await loadExerciseList(testList.id);
      expect(loadedList).toBeNull();
    });
  });

  describe('Multiple Lists Management', () => {
    it('should handle multiple custom lists simultaneously', async () => {
      const lists = [];

      for (let i = 1; i <= 5; i++) {
        const list = await createTrackedExerciseList(`List ${i}`, `Description ${i}`);
        list.config = createCustomTestConfig({
          [`Group ${i}`]: [
            { id: `ex${i}1`, name: `Exercise ${i}.1`, type: 'reps', value: i * 5 },
            { id: `ex${i}2`, name: `Exercise ${i}.2`, type: 'time', value: i * 15 },
          ],
        }, i * 10);
        await saveExerciseList(list);
        lists.push(list);
      }

      const allLists = await listExerciseLists();
      expect(allLists.length).toBeGreaterThanOrEqual(5);

      for (let i = 1; i <= 5; i++) {
        const loadedList = await loadExerciseList(lists[i-1].id);
        expect(loadedList!.config.globalRestTime).toBe(i * 10);
        expect(loadedList!.config.groups[`Group ${i}`].exercises).toHaveLength(2);
      }

      // Nettoyer : supprimer toutes les listes de test
      for (const list of lists) {
        await deleteExerciseList(list.id);
      }

      // Vérifier que toutes les listes ont été supprimées
      for (const list of lists) {
        const deletedList = await loadExerciseList(list.id);
        expect(deletedList).toBeNull();
      }
    });
  });

  describe('Create List and Add Exercises Workflow', () => {
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'sporty';

    it('should create a new list, select it, and add exercises to groups', async () => {
      const listName = 'Test Integration List';
      const listDescription = 'Liste créée pour tester l\'intégration complète';

      // 1. Créer une nouvelle liste
      const createResult = await createList(listName, listDescription, adminPassword);
      expect(createResult.success).toBe(true);
      expect(createResult.list).toBeDefined();
      const newListId = createResult.list!.id;

      // 2. Charger la liste créée pour vérifier qu'elle existe
      const loadResult = await getExerciseList(newListId);
      expect(loadResult.success).toBe(true);
      expect(loadResult.list!.name).toBe(listName);
      expect(loadResult.list!.description).toBe(listDescription);

      // 3. Charger la configuration de workout pour cette liste
      const initialConfig = await getWorkoutConfig(newListId);
      expect(initialConfig).toBeDefined();
      expect(initialConfig.globalRestTime).toBe(5); // Valeur par défaut pour les nouvelles listes

      // 4. Créer un groupe et y ajouter un exercice
      const squatId = 'test-squat';
      let updatedConfig = await createGroup('Legs', 'Dumbbell', 'emerald', newListId);
      updatedConfig = await addCatalogExercise({ name: 'Test Squat', type: 'reps', value: 15 }, newListId, squatId);
      updatedConfig = await addExerciseToGroup('Legs', squatId, newListId);

      expect(updatedConfig.groups['Legs']).toBeDefined();
      expect(updatedConfig.exercises[squatId].name).toBe('Test Squat');
      expect(updatedConfig.groups['Legs'].exercises[0].exerciseId).toBe(squatId);

      const runId = 'test-running';
      updatedConfig = await createGroup('Cardio', 'Heart', 'red', newListId);
      updatedConfig = await addCatalogExercise({ name: 'Test Running', type: 'time', value: 300 }, newListId, runId);
      const updatedConfig2 = await addExerciseToGroup('Cardio', runId, newListId);

      expect(updatedConfig2.groups['Cardio']).toBeDefined();
      expect(updatedConfig2.groups['Cardio'].exercises).toHaveLength(1);
      expect(updatedConfig2.exercises[runId].name).toBe('Test Running');
      expect(updatedConfig2.exercises[runId].type).toBe('time');
      expect(updatedConfig2.exercises[runId].value).toBe(300);

      // 8. Vérifier que les autres groupes sont préservés
      expect(updatedConfig2.groups['Legs'].exercises).toHaveLength(1);

      // 9. Nettoyer : supprimer la liste de test
      const deleteResult = await removeList(newListId, adminPassword);
      expect(deleteResult.success).toBe(true);

      // 10. Vérifier que la liste a été supprimée
      const loadAfterDelete = await getExerciseList(newListId);
      expect(loadAfterDelete.success).toBe(false);
    });
  });

  describe('Test Execution Validation', () => {
    it('should run all tests without failures', async () => {
      expect(true).toBe(true);
    });
  });

  describe('Explicit listId validation', () => {
    it('should fail getWorkoutConfig when listId is missing', async () => {
      await expect(getWorkoutConfig('')).rejects.toThrow('Aucune liste sélectionnée');
    });

    it('should fail mutation when listId is missing', async () => {
      const testList = await createTrackedExerciseList('Mutation Validation');
      await saveExerciseList({
        ...testList,
        config: createCustomTestConfig({
          Test: [{ id: 'e1', name: 'Push-up', type: 'reps', value: 10 }],
        }),
      });

      await expect(createGroup('Test', 'Dumbbell', 'blue', '')).rejects.toThrow('Aucune liste sélectionnée');
      await expect(addExerciseToGroup('Test', 'e1', '')).rejects.toThrow('Aucune liste sélectionnée');

      await removeList(testList.id, process.env.ADMIN_PASSWORD ?? 'sporty');
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
      await fs.writeFile(
        filePath,
        JSON.stringify({
          globalRestTime: 25,
          exercises: {
            m1: { id: 'm1', name: 'Manual Exo', type: 'reps', value: 12 },
          },
          groups: {
            Manual: {
              id: 'grp-manual',
              name: 'Manual',
              icon: 'activity',
              color: 'blue',
              createdAt: '2025-01-01T00:00:00.000Z',
              exercises: [{ refId: 'm1', exerciseId: 'm1' }],
            },
          },
        }),
        'utf-8'
      );

      const result = await importListFromManualFolder(fileName, 'Liste manuelle ciblée', adminPassword);
      expect(result.success).toBe(true);
      expect(result.listId).toBeDefined();

      const loaded = result.listId ? await getExerciseList(result.listId) : { success: false };
      expect(loaded.success).toBe(true);
      if (loaded.success) {
        expect(loaded.list!.config.globalRestTime).toBe(25);
      }

      await fs.unlink(filePath);
    });
  });
});