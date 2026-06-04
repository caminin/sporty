import {
    parseCatalogJson,
    parseTrainingJson,
    applyGlobalCatalogImport,
    validateTrainingRefsAgainstCatalog,
    exportCatalogToJson,
    exportTrainingToJson,
    normalizeExerciseDefinition,
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
});

describe('parseCatalogJson', () => {
    it('accepts valid catalog JSON', () => {
        const catalog = createTestCatalog();
        const result = parseCatalogJson({ exercises: catalog.exercises });
        expect(result.payload?.exercises).toBeDefined();
        expect(result.error).toBeUndefined();
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

    it('exports training without exercises map', () => {
        const training = createTestTraining();
        const json = exportTrainingToJson(training);
        const parsed = JSON.parse(json);
        expect(parsed.exerciseRefs).toBeDefined();
        expect(parsed.exercises).toBeUndefined();
    });
});
