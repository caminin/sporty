import type {
    ExerciseDefinition,
    GlobalCatalog,
    GroupExerciseRef,
    ResolvedExercise,
    Training,
    WorkoutView,
} from "./types";
import {
    MUSCLE_GROUPS,
    normalizeMuscleGroup,
    type MuscleGroupKey,
    type MuscleGroupMeta,
} from "./muscle-groups";

export const INVALID_JSON_SHAPE =
    'Format invalide : attendu catalogue { "exercises" } ou entraînement { "exerciseRefs" }.';

function isEmbeddedExercise(item: unknown): boolean {
    if (!item || typeof item !== "object") return false;
    const o = item as Record<string, unknown>;
    return typeof o.name === "string" && !("exerciseId" in o);
}

export function normalizeExerciseDefinition(
    raw: unknown,
    fallbackId?: string
): ExerciseDefinition | null {
    if (!raw || typeof raw !== "object") return null;
    const d = raw as Record<string, unknown>;
    const id = typeof d.id === "string" ? d.id : fallbackId;
    if (!id || typeof d.name !== "string") return null;
    if (d.type !== "time" && d.type !== "reps") return null;
    if (typeof d.value !== "number" || d.value <= 0) return null;

    const muscleGroup = normalizeMuscleGroup(d.muscleGroup);

    const series = d.series;
    if (series != null) {
        if (typeof series !== "number" || !Number.isInteger(series) || series < 2) {
            return null;
        }
    }

    const def: ExerciseDefinition = {
        id,
        name: d.name,
        type: d.type,
        value: d.value,
        muscleGroup,
    };
    if (typeof series === "number" && series >= 2) {
        def.series = series;
    }
    return def;
}

export function normalizeCatalogExercise(def: ExerciseDefinition): ExerciseDefinition {
    const normalized: ExerciseDefinition = {
        id: def.id,
        name: def.name,
        type: def.type,
        value: def.value,
        muscleGroup: def.muscleGroup,
    };
    if (def.series !== undefined && Number.isInteger(def.series) && def.series >= 2) {
        normalized.series = def.series;
    }
    return normalized;
}

export function normalizeCatalog(
    exercises: unknown
): Record<string, ExerciseDefinition> | null {
    if (!exercises || typeof exercises !== "object" || Array.isArray(exercises)) {
        return null;
    }
    const catalog: Record<string, ExerciseDefinition> = {};
    for (const [key, raw] of Object.entries(exercises)) {
        const def = normalizeExerciseDefinition(raw, key);
        if (!def) return null;
        catalog[def.id] = def;
    }
    return catalog;
}

export function getEffectiveSeries(
    def: ExerciseDefinition,
    ref: GroupExerciseRef
): number {
    return ref.series ?? def.series ?? 1;
}

export function normalizeGroupRef(ref: GroupExerciseRef): GroupExerciseRef {
    const normalized: GroupExerciseRef = {
        refId: ref.refId,
        exerciseId: ref.exerciseId,
    };
    if (ref.value !== undefined && ref.value > 0) {
        normalized.value = ref.value;
    }
    if (ref.series !== undefined && Number.isInteger(ref.series) && ref.series >= 2) {
        normalized.series = ref.series;
    }
    return normalized;
}

export function validateGroupRef(
    ref: unknown,
    catalog: Record<string, ExerciseDefinition>
): ref is GroupExerciseRef {
    if (!ref || typeof ref !== "object") return false;
    const r = ref as GroupExerciseRef;
    if (typeof r.refId !== "string" || typeof r.exerciseId !== "string") return false;
    if (isEmbeddedExercise(ref)) return false;
    if (!catalog[r.exerciseId]) return false;
    if (r.value !== undefined && (typeof r.value !== "number" || r.value <= 0)) {
        return false;
    }
    if (
        r.series !== undefined &&
        (!Number.isInteger(r.series) || r.series < 2)
    ) {
        return false;
    }
    return true;
}

export function getEffectiveValue(
    def: ExerciseDefinition,
    ref: GroupExerciseRef
): number {
    return ref.value ?? def.value;
}

export function resolveRef(
    catalog: Record<string, ExerciseDefinition>,
    ref: GroupExerciseRef
): ResolvedExercise | null {
    const def = catalog[ref.exerciseId];
    if (!def) return null;
    return {
        refId: ref.refId,
        exerciseId: ref.exerciseId,
        name: def.name,
        type: def.type,
        value: getEffectiveValue(def, ref),
        series: getEffectiveSeries(def, ref),
        muscleGroup: def.muscleGroup,
    };
}

export function buildWorkoutView(
    catalog: GlobalCatalog,
    training: Training
): WorkoutView {
    return {
        globalRestTime: training.globalRestTime,
        exercises: catalog.exercises,
        exerciseRefs: training.exerciseRefs.map((r) => normalizeGroupRef({ ...r })),
    };
}

export function resolveTrainingExercises(
    catalog: GlobalCatalog,
    training: Training,
    selectedRefIds?: Set<string>
): ResolvedExercise[] {
    const resolved: ResolvedExercise[] = [];
    for (const ref of training.exerciseRefs) {
        if (selectedRefIds && !selectedRefIds.has(ref.refId)) continue;
        const ex = resolveRef(catalog.exercises, ref);
        if (ex) resolved.push(ex);
    }
    return resolved;
}

export type PlacementRow = {
    ref: GroupExerciseRef;
    resolved: ResolvedExercise;
};

export type PlacementsByMuscleSection = {
    meta: MuscleGroupMeta;
    placements: PlacementRow[];
};

export type PlacementsByMuscleGroupOptions = {
    includeEmpty?: boolean;
};

export function placementsByMuscleGroup(
    catalog: GlobalCatalog,
    refs: GroupExerciseRef[],
    options: PlacementsByMuscleGroupOptions = {}
): PlacementsByMuscleSection[] {
    const { includeEmpty = false } = options;
    const byMuscle = new Map<MuscleGroupKey, PlacementRow[]>();
    for (const meta of MUSCLE_GROUPS) {
        byMuscle.set(meta.key, []);
    }

    for (const ref of refs) {
        const resolved = resolveRef(catalog.exercises, ref);
        if (!resolved) continue;
        const list = byMuscle.get(resolved.muscleGroup) ?? byMuscle.get("autre")!;
        list.push({ ref, resolved });
    }

    return MUSCLE_GROUPS.filter((meta) => includeEmpty || (byMuscle.get(meta.key)?.length ?? 0) > 0).map(
        (meta) => ({
            meta,
            placements: (byMuscle.get(meta.key) ?? []).sort((a, b) =>
                a.resolved.name.localeCompare(b.resolved.name, "fr")
            ),
        })
    );
}

export function getCatalogExerciseIdsUsedInTraining(
    training: Training
): Set<string> {
    return new Set(training.exerciseRefs.map((r) => r.exerciseId));
}

export function getCatalogExerciseIdsUsedInTrainings(
    trainings: Training[]
): Map<string, string[]> {
    const usage = new Map<string, string[]>();
    for (const training of trainings) {
        for (const ref of training.exerciseRefs) {
            const list = usage.get(ref.exerciseId) ?? [];
            list.push(training.name);
            usage.set(ref.exerciseId, list);
        }
    }
    return usage;
}

export type CatalogImportPayload = {
    exercises: Record<string, ExerciseDefinition>;
};

export type TrainingImportPayload = {
    name?: string;
    globalRestTime: number;
    exerciseRefs: GroupExerciseRef[];
};

export type OrphanTrainingReference = {
    exerciseId: string;
};

export function collectOrphanTrainingReferences(
    catalog: GlobalCatalog,
    refs: GroupExerciseRef[]
): OrphanTrainingReference[] {
    return refs
        .filter((r) => !catalog.exercises[r.exerciseId])
        .map((r) => ({ exerciseId: r.exerciseId }));
}

export function formatOrphanTrainingReferencesError(
    orphans: OrphanTrainingReference[]
): string {
    if (orphans.length === 0) return "";
    const ids = [...new Set(orphans.map((o) => o.exerciseId))];
    if (ids.length === 1) {
        return `L'exercice « ${ids[0]} » n'existe pas dans le catalogue global.`;
    }
    return `Exercices absents du catalogue : ${ids.map((id) => `« ${id} »`).join(", ")}`;
}

export function parseCatalogJson(raw: unknown): {
    payload?: CatalogImportPayload;
    error?: string;
} {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return { error: 'Format catalogue invalide : objet avec clé « exercises » requis.' };
    }
    const o = raw as Record<string, unknown>;
    if ("groups" in o || "exerciseRefs" in o) {
        return { error: INVALID_JSON_SHAPE };
    }
    if (!o.exercises) {
        return { error: 'Format catalogue invalide : clé « exercises » requise.' };
    }
    const catalog = normalizeCatalog(o.exercises);
    if (!catalog) {
        return { error: "Catalogue « exercises » invalide." };
    }
    return { payload: { exercises: catalog } };
}

export function parseTrainingJson(raw: unknown): {
    payload?: TrainingImportPayload;
    error?: string;
} {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return { error: 'Format entraînement invalide : objet avec « exerciseRefs » requis.' };
    }
    const o = raw as Record<string, unknown>;
    if ("groups" in o || "exercises" in o) {
        return { error: INVALID_JSON_SHAPE };
    }
    if (!Array.isArray(o.exerciseRefs)) {
        return { error: 'Format entraînement invalide : « exerciseRefs » doit être un tableau.' };
    }
    if (o.exerciseRefs.some(isEmbeddedExercise)) {
        return { error: INVALID_JSON_SHAPE };
    }

    let globalRestTime = 30;
    if (o.globalRestTime !== undefined) {
        if (typeof o.globalRestTime !== "number" || o.globalRestTime < 0) {
            return { error: "globalRestTime invalide (nombre >= 0)." };
        }
        globalRestTime = o.globalRestTime;
    }

    const name = typeof o.name === "string" ? o.name : undefined;
    const exerciseRefs: GroupExerciseRef[] = [];
    for (const item of o.exerciseRefs) {
        if (!item || typeof item !== "object") {
            return { error: "Référence exercice invalide dans exerciseRefs." };
        }
        const r = item as GroupExerciseRef;
        if (typeof r.refId !== "string" || typeof r.exerciseId !== "string") {
            return { error: "Chaque référence doit avoir refId et exerciseId." };
        }
        if (
            r.series !== undefined &&
            (!Number.isInteger(r.series) || r.series < 2)
        ) {
            return { error: "series invalide (entier >= 2 si présent)." };
        }
        exerciseRefs.push(
            normalizeGroupRef({
                refId: r.refId,
                exerciseId: r.exerciseId,
                ...(r.value !== undefined && r.value > 0 ? { value: r.value } : {}),
                ...(r.series !== undefined && r.series >= 2 ? { series: r.series } : {}),
            })
        );
    }

    return {
        payload: { name, globalRestTime, exerciseRefs },
    };
}

export function validateTrainingRefsAgainstCatalog(
    catalog: GlobalCatalog,
    refs: GroupExerciseRef[]
): string | null {
    const orphans = collectOrphanTrainingReferences(catalog, refs);
    if (orphans.length > 0) {
        return formatOrphanTrainingReferencesError(orphans);
    }
    for (const ref of refs) {
        if (!validateGroupRef(ref, catalog.exercises)) {
            return "Référence exercice invalide.";
        }
    }
    return null;
}

export function applyGlobalCatalogImport(
    local: GlobalCatalog,
    imported: CatalogImportPayload,
    replaceAll: boolean
): GlobalCatalog {
    const exercises: Record<string, ExerciseDefinition> = replaceAll
        ? {}
        : { ...local.exercises };

    for (const def of Object.values(imported.exercises)) {
        exercises[def.id] = normalizeCatalogExercise(def);
    }
    return { exercises };
}

export function applyTrainingImport(
    local: Training,
    payload: TrainingImportPayload,
    replaceRefs: boolean
): Training {
    const exerciseRefs = replaceRefs
        ? payload.exerciseRefs.map((r) => normalizeGroupRef({ ...r }))
        : [
              ...local.exerciseRefs.map((r) => normalizeGroupRef({ ...r })),
              ...payload.exerciseRefs.map((r) => normalizeGroupRef({ ...r })),
          ];

    return {
        ...local,
        name: payload.name ?? local.name,
        globalRestTime: payload.globalRestTime,
        exerciseRefs,
    };
}

export function exportCatalogToJson(catalog: GlobalCatalog): string {
    const exercises: Record<string, ExerciseDefinition> = {};
    for (const [id, def] of Object.entries(catalog.exercises)) {
        exercises[id] = normalizeCatalogExercise(def);
    }
    return JSON.stringify({ exercises }, null, 2);
}

export function exportTrainingToJson(training: Training): string {
    return JSON.stringify(
        {
            name: training.name,
            globalRestTime: training.globalRestTime,
            exerciseRefs: training.exerciseRefs.map((r) => normalizeGroupRef(r)),
        },
        null,
        2
    );
}
