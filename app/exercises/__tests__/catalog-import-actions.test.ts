import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals';
import { tempFilesystemSetup } from '../../__tests__/shared/test-helpers';
import { importGlobalCatalogFromJson, importTrainingFromJson } from '../lists-actions';
import { exportCatalogToJson, exportTrainingToJson } from '../workout-config';
import {
  createTestCatalog,
  createTestTraining,
  persistTestCatalogAndTraining,
} from '../../__tests__/shared/exercise-lists-helpers';
import { loadGlobalCatalog } from '../catalog';
import { loadTraining } from '../lists';

beforeEach(tempFilesystemSetup.beforeEach);
afterEach(tempFilesystemSetup.afterEach);
afterAll(tempFilesystemSetup.afterAll);

describe('catalog import actions', () => {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'sporty';

  it('imports global catalog from JSON', async () => {
    const catalog = createTestCatalog();
    const json = exportCatalogToJson(catalog);

    const result = await importGlobalCatalogFromJson(json, adminPassword, {});

    expect(result.success).toBe(true);
    const loaded = await loadGlobalCatalog();
    expect(loaded.exercises.push1).toBeDefined();
  });

  it('imports training refs onto existing training', async () => {
    const catalog = createTestCatalog();
    const training = createTestTraining('Liste pour refs');
    await persistTestCatalogAndTraining(training, catalog);

    const catalogResult = await importGlobalCatalogFromJson(
      exportCatalogToJson(catalog),
      adminPassword,
      {}
    );
    expect(catalogResult.success).toBe(true);

    const trainingJson = exportTrainingToJson(training);
    const refsResult = await importTrainingFromJson(trainingJson, adminPassword, {
      trainingId: training.id,
      replaceRefs: true,
    });
    expect(refsResult.success).toBe(true);

    const loaded = await loadTraining(training.id);
    expect(loaded!.exerciseRefs.length).toBe(training.exerciseRefs.length);
  });

  it('rejects training import with orphan exerciseId', async () => {
    const catalog = createTestCatalog();
    await importGlobalCatalogFromJson(exportCatalogToJson(catalog), adminPassword, {});

    const training = createTestTraining('Liste orphan test');
    await persistTestCatalogAndTraining(training, catalog);

    const badTraining = {
      globalRestTime: 30,
      exerciseRefs: [{ refId: 'r1', exerciseId: 'does-not-exist' }],
    };

    const result = await importTrainingFromJson(
      JSON.stringify(badTraining),
      adminPassword,
      { trainingId: training.id, replaceRefs: true }
    );
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/catalogue/);
  });

  it('replaceAll fails when training refs would be orphan', async () => {
    const catalog = createTestCatalog();
    const training = createTestTraining('Liste replace');
    await persistTestCatalogAndTraining(training, catalog);

    await importGlobalCatalogFromJson(exportCatalogToJson(catalog), adminPassword, {});
    await importTrainingFromJson(exportTrainingToJson(training), adminPassword, {
      trainingId: training.id,
      replaceRefs: true,
    });

    const replaceJson = exportCatalogToJson({
      exercises: {
        solo: { id: 'solo', name: 'Solo', type: 'reps', value: 5, muscleGroup: 'jambes' },
      },
    });

    const replaced = await importGlobalCatalogFromJson(replaceJson, adminPassword, {
      replaceAll: true,
    });
    expect(replaced.success).toBe(false);
    expect(replaced.error).toMatch(/catalogue|manquant/i);
  });
});
