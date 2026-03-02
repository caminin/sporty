import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createCustomGroup, updateCustomGroup, deleteCustomGroup } from '../../actions';
import { initializeExerciseLists, createExerciseList, saveExerciseList } from '../../lists';
import { tempFilesystemSetup } from '../../../__tests__/shared/test-helpers';

const TEST_LIST_ID = 'test-custom-groups-list';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);

describe('Custom Groups Actions', () => {
  beforeEach(async () => {
    await initializeExerciseLists();
    const list = await createExerciseList('Test List', 'For custom groups');
    list.id = TEST_LIST_ID;
    await saveExerciseList(list);
  });

  it('should create a custom group', async () => {
    const result = await createCustomGroup('Test Group', 'dumbbell', TEST_LIST_ID);

    expect(result.groups['Test Group']).toBeDefined();
    const createdGroup = result.groups['Test Group'];
    expect(createdGroup.name).toBe('Test Group');
    expect(createdGroup.icon).toBe('dumbbell');
    expect(createdGroup.exercises).toEqual([]);
    expect(createdGroup.createdAt).toBeDefined();
  });

  it('should update a custom group', async () => {
    // Créer un groupe d'abord
    await createCustomGroup('Original Name', 'dumbbell', TEST_LIST_ID);

    // Mettre à jour le groupe
    const updateResult = await updateCustomGroup('Original Name', { name: 'Updated Name', icon: 'heart' }, TEST_LIST_ID);

    const updatedGroup = updateResult.groups['Updated Name'];
    expect(updatedGroup.name).toBe('Updated Name');
    expect(updatedGroup.icon).toBe('heart');
  });

  it('should delete a custom group', async () => {
    // Créer un groupe d'abord
    const createResult = await createCustomGroup('Group to Delete', 'dumbbell', TEST_LIST_ID);

    // Vérifier que le groupe existe
    expect(createResult.groups['Group to Delete']).toBeDefined();

    // Supprimer le groupe
    const deleteResult = await deleteCustomGroup('Group to Delete', TEST_LIST_ID);

    // Vérifier que le groupe a été supprimé
    expect(deleteResult.groups['Group to Delete']).toBeUndefined();
  });

  it('should throw error when updating non-existent group', async () => {
    await expect(
      updateCustomGroup('non-existent-group-name', { name: 'New Name' }, TEST_LIST_ID)
    ).rejects.toThrow('Groupe');
  });

  it('should throw error when deleting non-existent group', async () => {
    await expect(
      deleteCustomGroup('non-existent-group-name', TEST_LIST_ID)
    ).rejects.toThrow('Groupe');
  });
});