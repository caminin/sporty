import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals';
import { tempFilesystemSetup } from '../../__tests__/shared/test-helpers';
import { importCatalogFromJson, importGroupsFromJson } from '../lists-actions';
import { exportCatalogToJson, exportGroupsToJson } from '../workout-config';
import { createTestConfig } from '../../__tests__/shared/exercise-lists-helpers';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('catalog import actions', () => {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'sporty';

  it('creates a new list from catalog JSON', async () => {
    const config = createTestConfig();
    const json = exportCatalogToJson(config);

    const result = await importCatalogFromJson(json, adminPassword, {
      listName: 'Liste catalogue test',
    });

    expect(result.success).toBe(true);
    expect(result.listId).toBeDefined();
  });

  it('imports groups onto existing list', async () => {
    const config = createTestConfig();
    const catalogResult = await importCatalogFromJson(
      exportCatalogToJson(config),
      adminPassword,
      { listName: 'Liste pour groupes' }
    );
    expect(catalogResult.listId).toBeDefined();

    const groupsResult = await importGroupsFromJson(
      exportGroupsToJson(config),
      catalogResult.listId!,
      adminPassword
    );
    expect(groupsResult.success).toBe(true);
  });

  it('rejects groups import with orphan exerciseId', async () => {
    const config = createTestConfig();
    const catalogResult = await importCatalogFromJson(
      exportCatalogToJson(config),
      adminPassword,
      { listName: 'Liste orphan test' }
    );

    const badGroups = {
      groups: {
        Bad: {
          id: 'bad',
          name: 'Bad',
          icon: 'zap',
          color: 'red',
          createdAt: new Date().toISOString(),
          exercises: [{ refId: 'r1', exerciseId: 'does-not-exist' }],
        },
      },
    };

    const result = await importGroupsFromJson(
      JSON.stringify(badGroups),
      catalogResult.listId!,
      adminPassword
    );
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/catalogue/);
  });

  it('replaceAll fails when group refs would be orphan', async () => {
    const config = createTestConfig();
    const created = await importCatalogFromJson(
      exportCatalogToJson(config),
      adminPassword,
      { listName: 'Liste replace' }
    );

    const groupsResult = await importGroupsFromJson(
      exportGroupsToJson(config),
      created.listId!,
      adminPassword
    );
    expect(groupsResult.success).toBe(true);

    const replaceJson = exportCatalogToJson({
      globalRestTime: 10,
      exercises: {
        solo: { id: 'solo', name: 'Solo', type: 'reps', value: 5, muscleGroup: 'jambes' },
      },
      groups: {},
    });

    const replaced = await importCatalogFromJson(replaceJson, adminPassword, {
      listId: created.listId,
      replaceAll: true,
    });
    expect(replaced.success).toBe(false);
    expect(replaced.error).toMatch(/catalogue/);
  });
});
