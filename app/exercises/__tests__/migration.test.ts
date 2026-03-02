import { describe, it, expect } from '@jest/globals';
import { migrateWorkoutConfig, validateGroup, exportWorkoutConfigToJson } from '../workout-config';

describe('Migration Functionality', () => {
  describe('validateGroup', () => {
    it('should validate a correct Group object', () => {
      const validGroup = {
        id: 'test-group',
        name: 'Test Group',
        icon: 'dumbbell',
        createdAt: new Date().toISOString(),
        exercises: [
          {
            id: 'ex1',
            name: 'Test Exercise',
            type: 'time' as const,
            value: 45
          }
        ]
      };

      expect(validateGroup(validGroup, 'Test Group')).toBe(true);
    });

    it('should reject invalid Group objects', () => {
      const invalidGroups = [
        null,
        {},
        { id: 'test', name: 'test' }, // Missing required fields
        { id: 'test', name: 'test', icon: 'test', createdAt: 'test', exercises: 'not-array' }, // exercises not array
        {
          id: 'test',
          name: 'test',
          icon: 'test',
          createdAt: 'test',
          exercises: [{ id: 'ex1', name: 'ex', type: 'invalid', value: 10 }] // invalid exercise type
        }
      ];

      invalidGroups.forEach(invalidGroup => {
        expect(validateGroup(invalidGroup, 'Test Group')).toBe(false);
      });
    });
  });

  describe('migrateWorkoutConfig', () => {
    it('should not migrate old format predefined groups (only custom groups)', () => {
      const oldConfig = {
        globalRestTime: 15,
        groups: {
          "Cardio endurance": [
            { id: 'ce1', name: 'Burpees', type: 'time' as const, value: 45 }
          ],
          "Épaules et frappe": [
            { id: 'ef1', name: 'Pompes', type: 'reps' as const, value: 15 }
          ]
        }
      };

      const migrated = migrateWorkoutConfig(oldConfig);

      expect(migrated.globalRestTime).toBe(15);
      // Predefined groups in old format are no longer migrated
      expect(Object.keys(migrated.groups)).toHaveLength(0);
    });

    it('should migrate old format with custom groups only', () => {
      const oldConfig = {
        globalRestTime: 20,
        groups: {
          "Cardio endurance": [
            { id: 'ce1', name: 'Burpees', type: 'time' as const, value: 45 }
          ]
        },
        customGroups: {
          'custom1': {
            id: 'custom1',
            name: 'Mon Groupe',
            icon: 'star',
            createdAt: '2023-01-01T00:00:00.000Z',
            exercises: [
              { id: 'cg1', name: 'Custom Exercise', type: 'reps' as const, value: 10 }
            ]
          }
        }
      };

      const migrated = migrateWorkoutConfig(oldConfig);

      // Only custom groups are migrated, predefined groups in old format are ignored
      expect(Object.keys(migrated.groups)).toHaveLength(1);
      expect(migrated.groups["Mon Groupe"]).toBeDefined();

      const customGroup = migrated.groups["Mon Groupe"];
      expect(customGroup.id).toBe('custom1');
      expect(customGroup.icon).toBe('star');
      expect(customGroup.exercises).toHaveLength(1);
    });

    it('should return already migrated config unchanged', () => {
      const alreadyMigratedConfig = {
        globalRestTime: 15,
        groups: {
          "Cardio endurance": {
            id: 'predefined-cardio-endurance',
            name: "Cardio endurance",
            icon: "Heart",
            createdAt: "2023-01-01T00:00:00.000Z",
            exercises: [
              { id: 'ce1', name: 'Burpees', type: 'time' as const, value: 45 }
            ]
          }
        }
      };

      const result = migrateWorkoutConfig(alreadyMigratedConfig);
      expect(result).toEqual(alreadyMigratedConfig);
    });

    it('should handle empty config gracefully', () => {
      const emptyConfig = { globalRestTime: 15 };
      const migrated = migrateWorkoutConfig(emptyConfig);

      expect(migrated.globalRestTime).toBe(15);
      expect(migrated.groups).toEqual({});
    });
  });

  describe('exportWorkoutConfigToJson', () => {
    it('should export complete config including all groups', () => {
      const config = {
        globalRestTime: 15,
        groups: {
          "Cardio": {
            id: "predefined-cardio",
            name: "Cardio",
            icon: "Heart",
            createdAt: "2023-01-01T00:00:00.000Z",
            exercises: [{ id: "ex1", name: "Burpees", type: "time" as const, value: 45 }]
          },
          "Mon Groupe": {
            id: "custom_123",
            name: "Mon Groupe",
            icon: "Star",
            createdAt: "2023-01-02T00:00:00.000Z",
            exercises: [{ id: "ex2", name: "Squats", type: "reps" as const, value: 10 }]
          }
        }
      };
      const json = exportWorkoutConfigToJson(config);
      const parsed = JSON.parse(json);
      expect(parsed.globalRestTime).toBe(15);
      expect(Object.keys(parsed.groups)).toHaveLength(2);
      expect(parsed.groups["Cardio"].exercises).toHaveLength(1);
      expect(parsed.groups["Mon Groupe"].exercises).toHaveLength(1);
    });
  });
});