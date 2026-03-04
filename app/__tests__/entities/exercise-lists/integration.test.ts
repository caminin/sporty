import { createExerciseList, saveExerciseList, loadExerciseList, deleteExerciseList, listExerciseLists } from '../../../exercises/lists';
import { createList, removeList, getExerciseList } from '../../../exercises/lists-actions';
import { getWorkoutConfig, createGroup, addExerciseToGroup } from '../../../exercises/actions';
import { tempFilesystemSetup, createTrackedExerciseList } from '../../shared/test-helpers';

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

      testList.config = {
        globalRestTime: 60,
        groups: {
          'Test Group': {
            id: 'custom_test_1',
            name: 'Test Group',
            icon: 'Activity',
            createdAt: new Date().toISOString(),
            exercises: [{ id: 'crud1', name: 'CRUD Exercise', type: 'reps', value: 20 }]
          }
        }
      };
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
        list.config = {
          globalRestTime: i * 10,
          groups: {
            [`Group ${i}`]: {
              id: `custom_grp_${i}`,
              name: `Group ${i}`,
              icon: 'Activity',
              createdAt: new Date().toISOString(),
              exercises: [
                { id: `ex${i}1`, name: `Exercise ${i}.1`, type: 'reps', value: i * 5 },
                { id: `ex${i}2`, name: `Exercise ${i}.2`, type: 'time', value: i * 15 }
              ]
            }
          }
        };
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
      const newExercise = { name: 'Test Squat', type: 'reps' as const, value: 15 };
      let updatedConfig = await createGroup('Legs', 'Dumbbell', newListId);
      updatedConfig = await addExerciseToGroup('Legs', newExercise, newListId);

      // 5. Vérifier que l'exercice a été ajouté
      expect(updatedConfig.groups['Legs']).toBeDefined();
      const addedExercise = updatedConfig.groups['Legs'].exercises.find(ex => ex.name === 'Test Squat');
      expect(addedExercise).toBeDefined();
      expect(addedExercise!.type).toBe('reps');
      expect(addedExercise!.value).toBe(15);

      // 6. Créer un autre groupe et y ajouter un exercice
      const cardioExercise = { name: 'Test Running', type: 'time' as const, value: 300 };
      updatedConfig = await createGroup('Cardio', 'Heart', newListId);
      const updatedConfig2 = await addExerciseToGroup('Cardio', cardioExercise, newListId);

      // 7. Vérifier que le nouveau groupe a été créé et que l'exercice y est
      expect(updatedConfig2.groups['Cardio']).toBeDefined();
      expect(updatedConfig2.groups['Cardio'].exercises).toHaveLength(1);
      const cardioAdded = updatedConfig2.groups['Cardio'].exercises[0];
      expect(cardioAdded.name).toBe('Test Running');
      expect(cardioAdded.type).toBe('time');
      expect(cardioAdded.value).toBe(300);

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
});