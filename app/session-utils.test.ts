import { optimizeExerciseSequence, buildSessionSteps } from './session-utils';

describe('optimizeExerciseSequence', () => {
    it('should return exercises unchanged if only one exercise', () => {
        const exercises = [{ name: 'Push-ups', group: 'Chest', type: 'reps' as const, value: 10 }];
        const result = optimizeExerciseSequence(exercises);
        expect(result).toEqual(exercises);
    });

    it('should alternate between two groups', () => {
        const exercises = [
            { name: 'Push-ups', group: 'Chest', type: 'reps' as const, value: 10 },
            { name: 'Pull-ups', group: 'Back', type: 'reps' as const, value: 8 },
            { name: 'Bench Press', group: 'Chest', type: 'reps' as const, value: 12 },
            { name: 'Rows', group: 'Back', type: 'reps' as const, value: 10 },
        ];
        const result = optimizeExerciseSequence(exercises);
        const groups = result.map(ex => ex.group);
        expect(groups).toEqual(['Chest', 'Back', 'Chest', 'Back']);
    });

    it('should maximize alternation with three groups', () => {
        const exercises = [
            { name: 'Squats', group: 'Legs', type: 'reps' as const, value: 15 },
            { name: 'Push-ups', group: 'Chest', type: 'reps' as const, value: 10 },
            { name: 'Rows', group: 'Back', type: 'reps' as const, value: 10 },
            { name: 'Lunges', group: 'Legs', type: 'reps' as const, value: 12 },
            { name: 'Bench Press', group: 'Chest', type: 'reps' as const, value: 12 },
            { name: 'Pull-ups', group: 'Back', type: 'reps' as const, value: 8 },
        ];
        const result = optimizeExerciseSequence(exercises);

        // Check that no group appears more than once consecutively (allowing for uneven distribution)
        let consecutiveCount = 0;
        for (let i = 1; i < result.length; i++) {
            if (result[i].group === result[i-1].group) {
                consecutiveCount++;
            }
        }
        expect(consecutiveCount).toBeLessThanOrEqual(1);
    });

    it('should preserve all exercises', () => {
        const exercises = [
            { name: 'Ex1', group: 'A', type: 'reps' as const, value: 10 },
            { name: 'Ex2', group: 'B', type: 'reps' as const, value: 10 },
            { name: 'Ex3', group: 'A', type: 'reps' as const, value: 10 },
        ];
        const result = optimizeExerciseSequence(exercises);
        expect(result).toHaveLength(3);
        expect(result.map(ex => ex.name)).toEqual(expect.arrayContaining(['Ex1', 'Ex2', 'Ex3']));
    });
});

describe('buildSessionSteps with optimized sequencing', () => {
    it('should start with a work step', () => {
        const config = {
            globalRestTime: 30,
            groups: {
                'Group A': [{ id: '1', name: 'Ex1', type: 'reps' as const, value: 10 }],
                'Group B': [{ id: '2', name: 'Ex2', type: 'reps' as const, value: 10 }],
            }
        };
        const steps = buildSessionSteps(config);
        expect(steps[0].kind).toBe('work');
    });

    it('should include all exercises in optimized order', () => {
        const config = {
            globalRestTime: 30,
            groups: {
                'Chest': [
                    { id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 },
                    { id: '3', name: 'Bench Press', type: 'reps' as const, value: 12 },
                ],
                'Back': [
                    { id: '2', name: 'Pull-ups', type: 'reps' as const, value: 8 },
                    { id: '4', name: 'Rows', type: 'reps' as const, value: 10 },
                ],
            }
        };
        const steps = buildSessionSteps(config);
        const workSteps = steps.filter(s => s.kind === 'work');
        expect(workSteps).toHaveLength(4);
        expect(workSteps.map(s => s.name)).toEqual(
            expect.arrayContaining(['Push-ups', 'Pull-ups', 'Bench Press', 'Rows'])
        );
    });

    it('should never have consecutive rest steps', () => {
        const config = {
            globalRestTime: 30,
            groups: {
                'Chest': [
                    { id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 },
                    { id: '3', name: 'Bench Press', type: 'reps' as const, value: 12 },
                ],
                'Back': [
                    { id: '2', name: 'Pull-ups', type: 'reps' as const, value: 8 },
                    { id: '4', name: 'Rows', type: 'reps' as const, value: 10 },
                ],
            }
        };
        const steps = buildSessionSteps(config);

        // Check that no two rest steps appear consecutively
        for (let i = 1; i < steps.length; i++) {
            expect(steps[i].kind !== 'rest' || steps[i-1].kind !== 'rest').toBe(true);
        }
    });
});