import { optimizeExerciseSequence, buildSessionSteps, estimateSessionDuration, encodeSession, decodeSession, seriesRestDuration } from './session-utils';
import { createCustomTestWorkoutView } from './__tests__/shared/exercise-lists-helpers';

describe('optimizeExerciseSequence', () => {
    it('should return exercises unchanged if only one exercise', () => {
        const exercises = [{ name: 'Push-ups', group: 'Chest', type: 'reps' as const, value: 10 }];
        const result = optimizeExerciseSequence(exercises);
        expect(result).toEqual([{ ...exercises[0], series: 1 }]);
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

    it('should never have two consecutive exercises from the same group (4 tasks in 3 groups)', () => {
        const exercises = [
            { name: 'Ex1', group: 'A', type: 'reps' as const, value: 10 },
            { name: 'Ex2', group: 'B', type: 'reps' as const, value: 12 },
            { name: 'Ex3', group: 'C', type: 'reps' as const, value: 8 },
            { name: 'Ex4', group: 'C', type: 'reps' as const, value: 15 },
        ];
        const result = optimizeExerciseSequence(exercises);

        expect(result).toHaveLength(4);
        expect(result.map(ex => ex.name)).toEqual(expect.arrayContaining(['Ex1', 'Ex2', 'Ex3', 'Ex4']));

        for (let i = 1; i < result.length; i++) {
            expect(result[i].group).not.toBe(result[i - 1].group);
        }
    });
});

describe('buildSessionSteps with optimized sequencing', () => {
    it('should start with a work step', () => {
        const config = createCustomTestWorkoutView({
            'Group A': [{ id: '1', name: 'Ex1', type: 'reps' as const, value: 10 }],
            'Group B': [{ id: '2', name: 'Ex2', type: 'reps' as const, value: 10 }],
        });
        const steps = buildSessionSteps(config);
        expect(steps[0].kind).toBe('work');
    });

    it('should include all exercises in optimized order', () => {
        const config = createCustomTestWorkoutView({
            'Chest': [
                { id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 },
                { id: '3', name: 'Bench Press', type: 'reps' as const, value: 12 },
            ],
            'Back': [
                { id: '2', name: 'Pull-ups', type: 'reps' as const, value: 8 },
                { id: '4', name: 'Rows', type: 'reps' as const, value: 10 },
            ],
        });
        const steps = buildSessionSteps(config);
        const workSteps = steps.filter(s => s.kind === 'work');
        expect(workSteps).toHaveLength(4);
        expect(workSteps.map(s => s.name)).toEqual(
            expect.arrayContaining(['Push-ups', 'Pull-ups', 'Bench Press', 'Rows'])
        );
    });

    it('should never have consecutive rest steps', () => {
        const config = createCustomTestWorkoutView({
            'Chest': [
                { id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 },
                { id: '3', name: 'Bench Press', type: 'reps' as const, value: 12 },
            ],
            'Back': [
                { id: '2', name: 'Pull-ups', type: 'reps' as const, value: 8 },
                { id: '4', name: 'Rows', type: 'reps' as const, value: 10 },
            ],
        });
        const steps = buildSessionSteps(config);

        for (let i = 1; i < steps.length; i++) {
            expect(steps[i].kind !== 'rest' || steps[i-1].kind !== 'rest').toBe(true);
        }
    });

    it('should expand multiple series back-to-back with rest between', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
            Back: [{ id: '2', name: 'Rows', type: 'reps' as const, value: 8 }],
        });
        config.exerciseRefs = [
            { refId: '1', exerciseId: '1', series: 2 },
            { refId: '2', exerciseId: '2' },
        ];

        const steps = buildSessionSteps(config);
        const workSteps = steps.filter((s) => s.kind === 'work');
        const restSteps = steps.filter((s) => s.kind === 'rest');

        expect(workSteps).toHaveLength(3);
        expect(workSteps[0].name).toBe('Push-ups');
        expect(workSteps[1].name).toBe('Push-ups');
        expect(workSteps[2].name).toBe('Rows');
        expect(workSteps[0]).toMatchObject({ seriesIndex: 1, seriesTotal: 2 });
        expect(workSteps[1]).toMatchObject({ seriesIndex: 2, seriesTotal: 2 });
        expect(workSteps[2].seriesIndex).toBeUndefined();
        expect(restSteps).toHaveLength(2);
        expect(restSteps[0].duration).toBe(seriesRestDuration(config.globalRestTime));
        expect(restSteps[1].duration).toBe(config.globalRestTime);
        expect(steps[steps.length - 1].kind).toBe('work');
    });

    it('should use half rest between series and full rest before next exercise (3 series)', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
            Back: [{ id: '2', name: 'Rows', type: 'reps' as const, value: 8 }],
        }, 20);
        config.exerciseRefs = [
            { refId: '1', exerciseId: '1', series: 3 },
            { refId: '2', exerciseId: '2' },
        ];

        const steps = buildSessionSteps(config);
        const restSteps = steps.filter((s) => s.kind === 'rest');

        expect(restSteps).toHaveLength(3);
        expect(restSteps[0].duration).toBe(10);
        expect(restSteps[1].duration).toBe(10);
        expect(restSteps[2].duration).toBe(20);
    });

    it('should round odd globalRestTime for intra-series rest', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        }, 15);
        config.exerciseRefs = [{ refId: '1', exerciseId: '1', series: 2 }];

        const steps = buildSessionSteps(config);
        const restSteps = steps.filter((s) => s.kind === 'rest');

        expect(restSteps).toHaveLength(1);
        expect(restSteps[0].duration).toBe(8);
    });

    it('should expand catalog default series without ref override', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        });
        config.exercises['1'] = { ...config.exercises['1'], series: 3 };

        const steps = buildSessionSteps(config);
        const workSteps = steps.filter((s) => s.kind === 'work');
        const restSteps = steps.filter((s) => s.kind === 'rest');

        expect(workSteps).toHaveLength(3);
        expect(workSteps.every((s) => s.name === 'Push-ups')).toBe(true);
        expect(workSteps[0]).toMatchObject({ seriesIndex: 1, seriesTotal: 3 });
        expect(workSteps[1]).toMatchObject({ seriesIndex: 2, seriesTotal: 3 });
        expect(workSteps[2]).toMatchObject({ seriesIndex: 3, seriesTotal: 3 });
        expect(restSteps).toHaveLength(2);
        expect(restSteps.every((s) => s.duration === seriesRestDuration(config.globalRestTime))).toBe(true);
    });

    it('should preserve series metadata through encode and decode', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        });
        config.exerciseRefs = [{ refId: '1', exerciseId: '1', series: 2 }];
        const steps = buildSessionSteps(config);
        const encoded = encodeSession(steps);
        const decoded = decodeSession(encoded);
        expect(decoded?.[0]).toMatchObject({ seriesIndex: 1, seriesTotal: 2 });
        expect(decoded?.[2]).toMatchObject({ seriesIndex: 2, seriesTotal: 2 });
    });

    it('should keep single series behavior unchanged', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        });
        const steps = buildSessionSteps(config);
        expect(steps).toEqual([
            { kind: 'work', name: 'Push-ups', group: expect.any(String), type: 'reps', reps: 10 },
        ]);
    });
});

describe('estimateSessionDuration with series', () => {
    it('should count extra work and half rest for multiple series', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        }, 20);
        config.exerciseRefs = [{ refId: '1', exerciseId: '1', series: 3 }];

        const duration = estimateSessionDuration(config, new Set(['1']));
        // 3 × (5s startup + 10×3s reps) + 2 × 10s half rest = 3×35 + 20 = 125
        expect(duration).toBe(125);
    });

    it('should use catalog default series when ref has no override', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
        }, 20);
        config.exercises['1'] = { ...config.exercises['1'], series: 3 };

        const duration = estimateSessionDuration(config, new Set(['1']));
        expect(duration).toBe(125);
    });

    it('should use full rest between two single-series exercises', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
            Back: [{ id: '2', name: 'Rows', type: 'reps' as const, value: 8 }],
        }, 30);

        const duration = estimateSessionDuration(config, new Set(['1', '2']));
        // (5+30) + (5+24) + 30 rest inter-exercice = 94
        expect(duration).toBe(94);
    });

    it('should match buildSessionSteps rest totals', () => {
        const config = createCustomTestWorkoutView({
            Chest: [{ id: '1', name: 'Push-ups', type: 'reps' as const, value: 10 }],
            Back: [{ id: '2', name: 'Rows', type: 'reps' as const, value: 8 }],
        }, 20);
        config.exerciseRefs = [
            { refId: '1', exerciseId: '1', series: 3 },
            { refId: '2', exerciseId: '2' },
        ];

        const steps = buildSessionSteps(config);
        const restFromSteps = steps
            .filter((s) => s.kind === 'rest')
            .reduce((sum, s) => sum + s.duration, 0);

        const workFromSteps = steps
            .filter((s) => s.kind === 'work')
            .reduce((sum, s) => {
                const startup = 5;
                const work = s.type === 'reps' ? s.reps! * 3 : s.duration!;
                return sum + startup + work;
            }, 0);

        const duration = estimateSessionDuration(config, new Set(['1', '2']));
        expect(duration).toBe(workFromSteps + restFromSteps);
    });
});
