import {
    parseCatalogJson,
    parseTrainingJson,
    applyGlobalCatalogImport,
    validateTrainingRefsAgainstCatalog,
    exportCatalogToJson,
    exportTrainingToJson,
    normalizeExerciseDefinition,
    getEffectiveSeries,
    resolveRef,
} from '../workout-config';
import { createTestCatalog, createTestTraining } from '../../__tests__/shared/exercise-lists-helpers';

describe('normalizeExerciseDefinition', () => {
    it('maps legacy fessiers and dos to autre', () => {
        const fromFessiers = normalizeExerciseDefinition({
            id: 'x',
            name: 'Test',
            type: 'reps',
            value: 10,
            muscleGroup: 'fessiers',
        });
        expect(fromFessiers?.muscleGroup).toBe('autre');

        const fromDos = normalizeExerciseDefinition({
            id: 'y',
            name: 'Row',
            type: 'reps',
            value: 8,
            muscleGroup: 'dos',
        });
        expect(fromDos?.muscleGroup).toBe('autre');
    });

    it('keeps series when >= 2 and rejects invalid series', () => {
        const withSeries = normalizeExerciseDefinition({
            id: 'x',
            name: 'Test',
            type: 'reps',
            value: 10,
            muscleGroup: 'pecs',
            series: 3,
        });
        expect(withSeries?.series).toBe(3);

        const withoutSeries = normalizeExerciseDefinition({
            id: 'y',
            name: 'Test',
            type: 'reps',
            value: 10,
            muscleGroup: 'pecs',
        });
        expect(withoutSeries?.series).toBeUndefined();

        expect(
            normalizeExerciseDefinition({
                id: 'z',
                name: 'Test',
                type: 'reps',
                value: 10,
                muscleGroup: 'pecs',
                series: 1,
            })
        ).toBeNull();
    });
});

describe('getEffectiveSeries', () => {
    it('uses ref override, then catalog default, then 1', () => {
        const def = {
            id: 'push1',
            name: 'Push-ups',
            type: 'reps' as const,
            value: 10,
            muscleGroup: 'pecs' as const,
            series: 3,
        };
        expect(getEffectiveSeries(def, { refId: 'r1', exerciseId: 'push1' })).toBe(3);
        expect(
            getEffectiveSeries(def, { refId: 'r1', exerciseId: 'push1', series: 2 })
        ).toBe(2);
        expect(
            getEffectiveSeries(
                { ...def, series: undefined },
                { refId: 'r1', exerciseId: 'push1' }
            )
        ).toBe(1);
    });
});

describe('resolveRef with catalog series', () => {
    it('resolves effective series from catalog when ref has no override', () => {
        const catalog = createTestCatalog({
            push1: {
                id: 'push1',
                name: 'Push-ups',
                type: 'reps',
                value: 10,
                muscleGroup: 'pecs',
                series: 4,
            },
        });
        const resolved = resolveRef(catalog.exercises, {
            refId: 'r1',
            exerciseId: 'push1',
        });
        expect(resolved?.series).toBe(4);
    });
});

describe('parseCatalogJson', () => {
    it('accepts valid catalog JSON', () => {
        const catalog = createTestCatalog();
        const result = parseCatalogJson({ exercises: catalog.exercises });
        expect(result.payload?.exercises).toBeDefined();
        expect(result.error).toBeUndefined();
    });

    it('accepts series on catalog entries when >= 2', () => {
        const result = parseCatalogJson({
            exercises: {
                push1: {
                    id: 'push1',
                    name: 'Push-ups',
                    type: 'reps',
                    value: 10,
                    muscleGroup: 'pecs',
                    series: 3,
                },
            },
        });
        expect(result.error).toBeUndefined();
        expect(result.payload?.exercises.push1.series).toBe(3);
    });

    it('rejects JSON with groups', () => {
        const result = parseCatalogJson({
            exercises: {},
            groups: {},
        });
        expect(result.error).toBeDefined();
    });
});

describe('parseTrainingJson', () => {
    it('accepts valid training JSON', () => {
        const training = createTestTraining();
        const result = parseTrainingJson({
            name: training.name,
            globalRestTime: training.globalRestTime,
            exerciseRefs: training.exerciseRefs,
        });
        expect(result.payload?.exerciseRefs.length).toBe(training.exerciseRefs.length);
    });

    it('rejects JSON with embedded exercises catalog', () => {
        const result = parseTrainingJson({
            exercises: { a: { id: 'a', name: 'X', type: 'reps', value: 1 } },
            exerciseRefs: [],
        });
        expect(result.error).toBeDefined();
    });

    it('accepts series on exerciseRefs when >= 2', () => {
        const result = parseTrainingJson({
            name: 'Test',
            globalRestTime: 20,
            exerciseRefs: [{ refId: 'r1', exerciseId: 'push1', series: 3 }],
        });
        expect(result.error).toBeUndefined();
        expect(result.payload?.exerciseRefs[0].series).toBe(3);
    });

    it('rejects series < 2', () => {
        const result = parseTrainingJson({
            exerciseRefs: [{ refId: 'r1', exerciseId: 'push1', series: 1 }],
        });
        expect(result.error).toBeDefined();
    });
});

describe('catalog import', () => {
    it('merges catalog by id', () => {
        const local = createTestCatalog();
        const updated = applyGlobalCatalogImport(
            local,
            {
                exercises: {
                    new1: {
                        id: 'new1',
                        name: 'New',
                        type: 'reps',
                        value: 5,
                        muscleGroup: 'jambes',
                    },
                },
            },
            false
        );
        expect(updated.exercises.new1).toBeDefined();
        expect(updated.exercises.push1).toBeDefined();
    });
});

describe('training validation', () => {
    it('detects orphan refs', () => {
        const catalog = createTestCatalog();
        const err = validateTrainingRefsAgainstCatalog(catalog, [
            { refId: 'x', exerciseId: 'missing-id' },
        ]);
        expect(err).toContain('missing-id');
    });
});

describe('export', () => {
    it('exports catalog without exerciseRefs', () => {
        const json = exportCatalogToJson(createTestCatalog());
        const parsed = JSON.parse(json);
        expect(parsed.exercises).toBeDefined();
        expect(parsed.exerciseRefs).toBeUndefined();
    });

    it('exports catalog series only when greater than 1', () => {
        const catalog = createTestCatalog({
            push1: {
                id: 'push1',
                name: 'Push-ups',
                type: 'reps',
                value: 10,
                muscleGroup: 'pecs',
                series: 2,
            },
        });
        const parsed = JSON.parse(exportCatalogToJson(catalog));
        expect(parsed.exercises.push1.series).toBe(2);
    });

    it('exports training without exercises map', () => {
        const training = createTestTraining();
        training.exerciseRefs[0] = { ...training.exerciseRefs[0], series: 2 };
        const json = exportTrainingToJson(training);
        const parsed = JSON.parse(json);
        expect(parsed.exerciseRefs).toBeDefined();
        expect(parsed.exerciseRefs[0].series).toBe(2);
        expect(parsed.exercises).toBeUndefined();
    });

    it('omits series from export when single series', () => {
        const training = createTestTraining();
        const json = exportTrainingToJson(training);
        const parsed = JSON.parse(json);
        expect(parsed.exerciseRefs[0].series).toBeUndefined();
    });
});
