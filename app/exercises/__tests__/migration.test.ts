import { describe, it, expect } from '@jest/globals';
import {
  parseWorkoutConfig,
  parseCatalogJson,
  parseGroupsJson,
  validateWorkoutConfig,
  exportWorkoutConfigToJson,
  exportCatalogToJson,
  exportGroupsToJson,
  mergeImportedConfig,
  mergeImportedGroups,
  applyCatalogImport,
  collectOrphanGroupReferences,
  formatOrphanReferencesError,
  resolveGroupExercises,
  groupPlacementsByMuscleGroup,
  LEGACY_FORMAT_ERROR,
} from '../workout-config';
import { createTestConfig } from '../../__tests__/shared/exercise-lists-helpers';

describe('workout-config', () => {
  describe('parseWorkoutConfig', () => {
    it('should accept valid catalog + reference config', () => {
      const config = createTestConfig();
      const result = parseWorkoutConfig(config);
      expect(result.error).toBeUndefined();
      expect(result.config?.exercises.push1).toBeDefined();
      expect(result.config?.groups.Push.exercises[0].refId).toBe('push1');
    });

    it('should reject legacy embedded exercises', () => {
      const legacy = {
        globalRestTime: 15,
        groups: {
          Test: {
            id: 'g1',
            name: 'Test',
            icon: 'zap',
            color: 'blue',
            createdAt: '2025-01-01T00:00:00.000Z',
            exercises: [{ id: 'e1', name: 'Burpees', type: 'reps', value: 10 }],
          },
        },
      };
      const result = parseWorkoutConfig(legacy);
      expect(result.error).toBe(LEGACY_FORMAT_ERROR);
    });

    it('should reject missing exercises catalog', () => {
      const result = parseWorkoutConfig({ globalRestTime: 10, groups: {} });
      expect(result.error).toContain('exercises');
    });

    it('should default muscleGroup to autre when omitted', () => {
      const result = parseWorkoutConfig({
        globalRestTime: 10,
        exercises: {
          e1: { id: 'e1', name: 'Test', type: 'reps', value: 5 },
        },
        groups: {},
      });
      expect(result.config?.exercises.e1.muscleGroup).toBe('autre');
    });
  });

  describe('exportWorkoutConfigToJson', () => {
    it('should export exercises and groups', () => {
      const config = createTestConfig();
      const json = exportWorkoutConfigToJson(config);
      const parsed = JSON.parse(json);
      expect(parsed.exercises).toBeDefined();
      expect(parsed.groups.Push.exercises[0].exerciseId).toBe('push1');
    });
  });

  describe('resolveGroupExercises', () => {
    it('should resolve effective values', () => {
      const config = createTestConfig();
      config.groups.Push.exercises[0].value = 20;
      const resolved = resolveGroupExercises(config, 'Push');
      expect(resolved.find((r) => r.refId === 'push1')?.value).toBe(20);
    });
  });

  describe('groupPlacementsByMuscleGroup', () => {
    it('should group placements by catalog muscleGroup', () => {
      const config = createTestConfig();
      const sections = groupPlacementsByMuscleGroup(config, 'Push');
      expect(sections.length).toBeGreaterThan(0);
      const pushSection = sections.find((s) => s.placements.some((p) => p.resolved.exerciseId === 'push1'));
      expect(pushSection).toBeDefined();
    });
  });

  describe('exportCatalogToJson / exportGroupsToJson', () => {
    it('should export catalog without groups', () => {
      const config = createTestConfig();
      const parsed = JSON.parse(exportCatalogToJson(config));
      expect(parsed.exercises).toBeDefined();
      expect(parsed.groups).toBeUndefined();
    });

    it('should export groups without exercises', () => {
      const config = createTestConfig();
      const parsed = JSON.parse(exportGroupsToJson(config));
      expect(parsed.groups.Push).toBeDefined();
      expect(parsed.exercises).toBeUndefined();
    });
  });

  describe('parseCatalogJson / parseGroupsJson', () => {
    it('should parse catalog-only JSON', () => {
      const config = createTestConfig();
      const result = parseCatalogJson({ exercises: config.exercises, globalRestTime: 25 });
      expect(result.payload?.exercises.push1).toBeDefined();
      expect(result.payload?.globalRestTime).toBe(25);
    });

    it('should reject catalog JSON without exercises', () => {
      const result = parseCatalogJson({ globalRestTime: 10 });
      expect(result.error).toBeDefined();
    });

    it('should parse groups-only JSON', () => {
      const config = createTestConfig();
      const result = parseGroupsJson({ groups: config.groups });
      expect(result.payload?.groups.Push).toBeDefined();
    });
  });

  describe('applyCatalogImport', () => {
    it('should replace all catalog entries when replaceAll is true and no group refs', () => {
      const local = createTestConfig();
      local.groups = {};
      const merged = applyCatalogImport(
        local,
        {
          exercises: {
            only: { id: 'only', name: 'Only', type: 'reps', value: 3, muscleGroup: 'jambes' },
          },
        },
        true
      );
      expect(merged.exercises.only).toBeDefined();
      expect(merged.exercises.push1).toBeUndefined();
    });

    it('should fail replace when group refs become orphan', () => {
      const local = createTestConfig();
      expect(() =>
        applyCatalogImport(local, { exercises: {} }, true)
      ).toThrow(/absent du catalogue/);
    });
  });

  describe('mergeImportedGroups', () => {
    it('should reject orphan exerciseId', () => {
      const local = createTestConfig();
      expect(() =>
        mergeImportedGroups(local, {
          Bad: {
            id: 'bad-grp',
            name: 'Bad',
            icon: 'zap',
            color: 'red',
            createdAt: new Date().toISOString(),
            exercises: [{ refId: 'orphan', exerciseId: 'missing-id' }],
          },
        })
      ).toThrow(/n'existe pas dans le catalogue/);
    });

    it('should merge valid groups', () => {
      const local = createTestConfig();
      const merged = mergeImportedGroups(local, {
        Extra: {
          id: 'extra-grp',
          name: 'Extra',
          icon: 'zap',
          color: 'cyan',
          createdAt: new Date().toISOString(),
          exercises: [{ refId: 'push1-ref2', exerciseId: 'push1' }],
        },
      });
      expect(merged.groups.Extra).toBeDefined();
    });
  });

  describe('collectOrphanGroupReferences', () => {
    it('should detect missing catalog ids', () => {
      const config = createTestConfig();
      config.groups.Push.exercises.push({
        refId: 'orphan',
        exerciseId: 'ghost',
      });
      const orphans = collectOrphanGroupReferences(config);
      expect(orphans).toHaveLength(1);
      expect(formatOrphanReferencesError(orphans)).toContain('ghost');
    });
  });

  describe('mergeImportedConfig', () => {
    it('should merge catalog and append group refs', () => {
      const local = createTestConfig();
      const imported = createTestConfig();
      imported.exercises.newEx = { id: 'newEx', name: 'New', type: 'reps', value: 5, muscleGroup: 'bras' };
      imported.groups.Extra = {
        id: 'extra-grp',
        name: 'Extra',
        icon: 'zap',
        color: 'cyan',
        createdAt: new Date().toISOString(),
        exercises: [{ refId: 'newRef', exerciseId: 'newEx' }],
      };
      delete (imported.groups as Record<string, unknown>).Push;

      const merged = mergeImportedConfig(local, imported);
      expect(merged.exercises.newEx).toBeDefined();
      expect(merged.groups.Extra).toBeDefined();
      expect(validateWorkoutConfig(merged)).toBeNull();
    });

    it('should throw on orphan refs in full merge', () => {
      const local = createTestConfig();
      const imported = createTestConfig();
      imported.groups.Orphan = {
        id: 'orphan-grp',
        name: 'Orphan',
        icon: 'zap',
        color: 'red',
        createdAt: new Date().toISOString(),
        exercises: [{ refId: 'x', exerciseId: 'not-in-catalog' }],
      };
      delete (imported.exercises as Record<string, unknown>).push1;
      delete (imported.exercises as Record<string, unknown>).squat1;

      expect(() => mergeImportedConfig(local, imported)).toThrow(
        /n'existe pas dans le catalogue/
      );
    });
  });
});
