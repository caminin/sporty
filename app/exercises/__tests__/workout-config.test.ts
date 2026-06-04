import { describe, expect, it } from '@jest/globals';
import { placementsByMuscleGroup } from '../workout-config';
import type { GlobalCatalog, GroupExerciseRef } from '../types';

const catalog: GlobalCatalog = {
  exercises: {
    squat1: { id: 'squat1', name: 'Squat', type: 'reps', value: 12, muscleGroup: 'jambes' },
    plank1: { id: 'plank1', name: 'Planche', type: 'time', value: 45, muscleGroup: 'abdos' },
  },
};

describe('placementsByMuscleGroup', () => {
  it('should keep previous behavior by default (only non-empty groups)', () => {
    const refs: GroupExerciseRef[] = [{ refId: 'r1', exerciseId: 'squat1' }];
    const sections = placementsByMuscleGroup(catalog, refs);

    expect(sections).toHaveLength(1);
    expect(sections[0].meta.key).toBe('jambes');
  });

  it('should return all groups when includeEmpty is true', () => {
    const sections = placementsByMuscleGroup(catalog, [], { includeEmpty: true });

    expect(sections.length).toBeGreaterThan(1);
    expect(sections.every((section) => Array.isArray(section.placements))).toBe(true);
    expect(sections.find((section) => section.meta.key === 'jambes')?.placements).toHaveLength(0);
    expect(sections.find((section) => section.meta.key === 'abdos')?.placements).toHaveLength(0);
  });
});
