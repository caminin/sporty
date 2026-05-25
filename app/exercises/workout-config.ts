import type {
    ExerciseDefinition,
    Group,
    GroupExerciseRef,
    ResolvedExercise,
    WorkoutConfig,
} from "./types";
import { isGroupColorKey } from "./group-colors";
import {
    DEFAULT_MUSCLE_GROUP,
    isMuscleGroupKey,
    MUSCLE_GROUPS,
    type MuscleGroupKey,
    type MuscleGroupMeta,
} from "./muscle-groups";

export const LEGACY_FORMAT_ERROR =
    'Format invalide : le JSON doit contenir "exercises" (catalogue) et des références { refId, exerciseId } dans chaque groupe (pas d\'exercices embarqués avec "name").';

function isEmbeddedGroupExercise(item: unknown): boolean {
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

    const rawGroup = d.muscleGroup;
    const muscleGroup: MuscleGroupKey =
        typeof rawGroup === "string" && isMuscleGroupKey(rawGroup)
            ? rawGroup
            : DEFAULT_MUSCLE_GROUP;

    return {
        id,
        name: d.name,
        type: d.type,
        value: d.value,
        muscleGroup,
    };
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

export function validateExerciseDefinition(def: unknown): def is ExerciseDefinition {
    return normalizeExerciseDefinition(def) !== null;
}

export function validateCatalog(exercises: unknown): exercises is Record<string, ExerciseDefinition> {
    return normalizeCatalog(exercises) !== null;
}

export function validateGroupRef(
    ref: unknown,
    catalog: Record<string, ExerciseDefinition>,
    groupName: string
): ref is GroupExerciseRef {
    if (!ref || typeof ref !== "object") return false;
    const r = ref as GroupExerciseRef;
    if (typeof r.refId !== "string" || typeof r.exerciseId !== "string") {
        return false;
    }
    if (isEmbeddedGroupExercise(ref)) {
        return false;
    }
    if (!catalog[r.exerciseId]) {
        console.warn(`Groupe '${groupName}' : exerciseId '${r.exerciseId}' absent du catalogue`);
        return false;
    }
    if (r.value !== undefined && (typeof r.value !== "number" || r.value <= 0)) {
        return false;
    }
    return true;
}

export function validateGroup(
    group: unknown,
    groupName: string,
    catalog?: Record<string, ExerciseDefinition>
): boolean {
    if (typeof group !== "object" || group === null) return false;
    const g = group as Group;
    if (
        typeof g.id !== "string" ||
        typeof g.name !== "string" ||
        typeof g.icon !== "string" ||
        !isGroupColorKey(g.color) ||
        typeof g.createdAt !== "string" ||
        !Array.isArray(g.exercises)
    ) {
        return false;
    }
    if (g.exercises.some(isEmbeddedGroupExercise)) {
        return false;
    }
    if (catalog) {
        return g.exercises.every((ref) => validateGroupRef(ref, catalog, groupName));
    }
    return g.exercises.every(
        (ref) =>
            typeof ref === "object" &&
            ref !== null &&
            typeof (ref as GroupExerciseRef).refId === "string" &&
            typeof (ref as GroupExerciseRef).exerciseId === "string"
    );
}

export function detectLegacyConfig(raw: unknown): string | null {
    const c = raw as Record<string, unknown>;
    if (!c || typeof c !== "object") {
        return "Configuration invalide";
    }
    if (!c.exercises || typeof c.exercises !== "object" || Array.isArray(c.exercises)) {
        return LEGACY_FORMAT_ERROR;
    }
    const groups = c.groups as Record<string, unknown> | undefined;
    if (!groups || typeof groups !== "object") {
        return "Structure des groupes incorrecte";
    }
    for (const [groupName, group] of Object.entries(groups)) {
        if (!group || typeof group !== "object") continue;
        const exercises = (group as Group).exercises;
        if (Array.isArray(exercises) && exercises.some(isEmbeddedGroupExercise)) {
            return LEGACY_FORMAT_ERROR;
        }
    }
    return null;
}

export function parseWorkoutConfig(raw: unknown): { config?: WorkoutConfig; error?: string } {
    const legacyError = detectLegacyConfig(raw);
    if (legacyError) {
        return { error: legacyError };
    }

    const c = raw as WorkoutConfig;
    if (typeof c.globalRestTime !== "number" || c.globalRestTime < 0) {
        return { error: "globalRestTime invalide (doit être un nombre >= 0)" };
    }
    const catalog = normalizeCatalog(c.exercises);
    if (!catalog) {
        return { error: "Catalogue exercises invalide" };
    }
    if (!c.groups || typeof c.groups !== "object") {
        return { error: "Structure des groupes incorrecte" };
    }
    for (const [groupName, group] of Object.entries(c.groups)) {
        if (!validateGroup(group, groupName, catalog)) {
            return { error: `Groupe '${groupName}' invalide ou références orphelines` };
        }
    }

    return {
        config: {
            globalRestTime: c.globalRestTime,
            exercises: catalog,
            groups: c.groups,
        },
    };
}

/** @deprecated Use parseWorkoutConfig — throws on invalid format */
export function migrateWorkoutConfig(config: unknown): WorkoutConfig {
    const result = parseWorkoutConfig(config);
    if (result.error || !result.config) {
        throw new Error(result.error ?? LEGACY_FORMAT_ERROR);
    }
    return result.config;
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
    };
}

export function resolveGroupExercises(
    config: WorkoutConfig,
    groupName: string
): ResolvedExercise[] {
    const group = config.groups[groupName];
    if (!group) return [];
    const resolved: ResolvedExercise[] = [];
    for (const ref of group.exercises) {
        const ex = resolveRef(config.exercises, ref);
        if (ex) resolved.push(ex);
    }
    return resolved;
}

export type GroupPlacementRow = {
    ref: GroupExerciseRef;
    resolved: ResolvedExercise;
};

export type GroupPlacementsByMuscleSection = {
    meta: MuscleGroupMeta;
    placements: GroupPlacementRow[];
};

/** Session group exercises grouped by catalog muscleGroup (MUSCLE_GROUPS order). */
export function groupPlacementsByMuscleGroup(
    config: WorkoutConfig,
    groupName: string
): GroupPlacementsByMuscleSection[] {
    const group = config.groups[groupName];
    if (!group) return [];

    const byMuscle = new Map<MuscleGroupKey, GroupPlacementRow[]>();
    for (const meta of MUSCLE_GROUPS) {
        byMuscle.set(meta.key, []);
    }

    for (const ref of group.exercises) {
        const resolved = resolveRef(config.exercises, ref);
        if (!resolved) continue;
        const def = config.exercises[ref.exerciseId];
        const muscleGroup = def?.muscleGroup ?? DEFAULT_MUSCLE_GROUP;
        const list = byMuscle.get(muscleGroup) ?? byMuscle.get("autre")!;
        list.push({ ref, resolved });
    }

    const catalogMuscleGroups = new Set<MuscleGroupKey>();
    for (const def of Object.values(config.exercises)) {
        catalogMuscleGroups.add(def.muscleGroup);
    }

    return MUSCLE_GROUPS.filter(
        (meta) => (byMuscle.get(meta.key)?.length ?? 0) > 0 || catalogMuscleGroups.has(meta.key)
    ).map((meta) => ({
        meta,
        placements: (byMuscle.get(meta.key) ?? []).sort((a, b) =>
            a.resolved.name.localeCompare(b.resolved.name, "fr")
        ),
    }));
}

export function resolveAllPlacements(config: WorkoutConfig): ResolvedExercise[] {
    const all: ResolvedExercise[] = [];
    for (const groupName of Object.keys(config.groups)) {
        all.push(...resolveGroupExercises(config, groupName));
    }
    return all;
}

export function getCatalogExerciseIdsUsedInGroups(config: WorkoutConfig): Map<string, string[]> {
    const usage = new Map<string, string[]>();
    for (const [groupName, group] of Object.entries(config.groups)) {
        for (const ref of group.exercises) {
            const list = usage.get(ref.exerciseId) ?? [];
            list.push(groupName);
            usage.set(ref.exerciseId, list);
        }
    }
    return usage;
}

export function validateWorkoutConfig(config: WorkoutConfig): string | null {
    return parseWorkoutConfig(config).error ?? null;
}

export type CatalogImportPayload = {
    exercises: Record<string, ExerciseDefinition>;
    globalRestTime?: number;
};

export type GroupsImportPayload = {
    groups: Record<string, Group>;
    globalRestTime?: number;
};

export type OrphanGroupReference = {
    groupKey: string;
    groupDisplayName: string;
    exerciseId: string;
};

export function collectOrphanGroupReferences(config: WorkoutConfig): OrphanGroupReference[] {
    const orphans: OrphanGroupReference[] = [];
    for (const [groupKey, group] of Object.entries(config.groups)) {
        for (const ref of group.exercises) {
            if (!config.exercises[ref.exerciseId]) {
                orphans.push({
                    groupKey,
                    groupDisplayName: group.name,
                    exerciseId: ref.exerciseId,
                });
            }
        }
    }
    return orphans;
}

export function formatOrphanReferencesError(orphans: OrphanGroupReference[]): string {
    if (orphans.length === 0) return "";
    if (orphans.length === 1) {
        const o = orphans[0];
        return `Le groupe « ${o.groupDisplayName} » référence l'exercice « ${o.exerciseId} » qui n'existe pas dans le catalogue.`;
    }
    const lines = orphans.map(
        (o) =>
            `• « ${o.groupDisplayName} » → exercice « ${o.exerciseId} » absent du catalogue`
    );
    return `Références invalides dans les groupes :\n${lines.join("\n")}`;
}

export function parseCatalogJson(raw: unknown): { payload?: CatalogImportPayload; error?: string } {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return { error: "Le JSON catalogue doit être un objet avec une clé « exercises »." };
    }
    const o = raw as Record<string, unknown>;
    if (!o.exercises) {
        return { error: 'Format catalogue invalide : clé « exercises » requise.' };
    }
    const catalog = normalizeCatalog(o.exercises);
    if (!catalog) {
        return { error: "Catalogue « exercises » invalide (id, name, type, value requis)." };
    }
    let globalRestTime: number | undefined;
    if (o.globalRestTime !== undefined) {
        if (typeof o.globalRestTime !== "number" || o.globalRestTime < 0) {
            return { error: "globalRestTime invalide (nombre >= 0)." };
        }
        globalRestTime = o.globalRestTime;
    }
    return { payload: { exercises: catalog, globalRestTime } };
}

export function parseGroupsJson(raw: unknown): { payload?: GroupsImportPayload; error?: string } {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return { error: "Le JSON groupes doit être un objet avec une clé « groups »." };
    }
    const o = raw as Record<string, unknown>;
    if (!o.groups || typeof o.groups !== "object" || Array.isArray(o.groups)) {
        return { error: 'Format groupes invalide : clé « groups » requise.' };
    }
    const groups = o.groups as Record<string, Group>;
    for (const [groupName, group] of Object.entries(groups)) {
        if (!validateGroup(group, groupName)) {
            if (group?.exercises?.some(isEmbeddedGroupExercise)) {
                return { error: LEGACY_FORMAT_ERROR };
            }
            return { error: `Groupe « ${groupName} » invalide (structure ou références mal formées).` };
        }
    }
    let globalRestTime: number | undefined;
    if (o.globalRestTime !== undefined) {
        if (typeof o.globalRestTime !== "number" || o.globalRestTime < 0) {
            return { error: "globalRestTime invalide (nombre >= 0)." };
        }
        globalRestTime = o.globalRestTime;
    }
    return { payload: { groups, globalRestTime } };
}

export function applyCatalogImport(
    local: WorkoutConfig,
    imported: CatalogImportPayload,
    replaceAll: boolean
): WorkoutConfig {
    const exercises: Record<string, ExerciseDefinition> = replaceAll
        ? {}
        : { ...local.exercises };

    for (const [, def] of Object.entries(imported.exercises)) {
        exercises[def.id] = { ...def };
    }

    const result: WorkoutConfig = {
        globalRestTime: imported.globalRestTime ?? local.globalRestTime,
        exercises,
        groups: Object.fromEntries(
            Object.entries(local.groups).map(([key, group]) => [
                key,
                { ...group, exercises: group.exercises.map((r) => ({ ...r })) },
            ])
        ),
    };

    const orphans = collectOrphanGroupReferences(result);
    if (orphans.length > 0) {
        throw new Error(formatOrphanReferencesError(orphans));
    }

    const validationError = validateWorkoutConfig(result);
    if (validationError) {
        throw new Error(validationError);
    }

    return result;
}

export function mergeImportedGroups(
    local: WorkoutConfig,
    importedGroups: Record<string, Group>,
    importedGlobalRestTime?: number
): WorkoutConfig {
    const catalog = local.exercises;

    for (const [importKey, importGroup] of Object.entries(importedGroups)) {
        if (!validateGroup(importGroup, importKey)) {
            if (importGroup.exercises?.some(isEmbeddedGroupExercise)) {
                throw new Error(LEGACY_FORMAT_ERROR);
            }
            throw new Error(`Groupe « ${importGroup.name || importKey} » invalide.`);
        }
        for (const ref of importGroup.exercises) {
            if (!catalog[ref.exerciseId]) {
                throw new Error(
                    formatOrphanReferencesError([
                        {
                            groupKey: importKey,
                            groupDisplayName: importGroup.name,
                            exerciseId: ref.exerciseId,
                        },
                    ])
                );
            }
        }
    }

    const mergedGroups: Record<string, Group> = {};

    for (const [key, group] of Object.entries(local.groups)) {
        mergedGroups[key] = {
            ...group,
            exercises: group.exercises.map((r) => ({ ...r })),
        };
    }

    for (const [importKey, importGroup] of Object.entries(importedGroups)) {
        const existingById = Object.entries(mergedGroups).find(
            ([, g]) => g.id === importGroup.id
        );

        if (!existingById) {
            let recordKey = importKey;
            if (mergedGroups[recordKey]) {
                recordKey = `${importKey} (import)`;
            }
            mergedGroups[recordKey] = {
                ...importGroup,
                exercises: importGroup.exercises.map((r) => ({ ...r })),
            };
            continue;
        }

        const [existingKey, existingGroup] = existingById;
        const refById = new Map(existingGroup.exercises.map((r) => [r.refId, r]));

        for (const importRef of importGroup.exercises) {
            const existing = refById.get(importRef.refId);
            if (existing) {
                existing.value = importRef.value;
            } else {
                existingGroup.exercises.push({ ...importRef });
            }
        }

        mergedGroups[existingKey] = existingGroup;
    }

    const result: WorkoutConfig = {
        globalRestTime: importedGlobalRestTime ?? local.globalRestTime,
        exercises: { ...local.exercises },
        groups: mergedGroups,
    };

    const validationError = validateWorkoutConfig(result);
    if (validationError) {
        throw new Error(validationError);
    }

    return result;
}

export function mergeImportedConfig(
    local: WorkoutConfig,
    imported: WorkoutConfig
): WorkoutConfig {
    const mergedCatalog: Record<string, ExerciseDefinition> = { ...local.exercises };

    for (const [id, def] of Object.entries(imported.exercises)) {
        mergedCatalog[id] = { ...def };
    }

    const mergedGroups: Record<string, Group> = {};

    for (const [key, group] of Object.entries(local.groups)) {
        mergedGroups[key] = {
            ...group,
            exercises: group.exercises.map((r) => ({ ...r })),
        };
    }

    for (const [importKey, importGroup] of Object.entries(imported.groups)) {
        const existingById = Object.entries(mergedGroups).find(
            ([, g]) => g.id === importGroup.id
        );

        if (!existingById) {
            let recordKey = importKey;
            if (mergedGroups[recordKey]) {
                recordKey = `${importKey} (import)`;
            }
            for (const ref of importGroup.exercises) {
                if (!mergedCatalog[ref.exerciseId]) {
                    throw new Error(
                        formatOrphanReferencesError([
                            {
                                groupKey: importKey,
                                groupDisplayName: importGroup.name,
                                exerciseId: ref.exerciseId,
                            },
                        ])
                    );
                }
            }
            mergedGroups[recordKey] = {
                ...importGroup,
                exercises: importGroup.exercises.map((r) => ({ ...r })),
            };
            continue;
        }

        const [existingKey, existingGroup] = existingById;
        const refById = new Map(existingGroup.exercises.map((r) => [r.refId, r]));

        for (const importRef of importGroup.exercises) {
            if (!mergedCatalog[importRef.exerciseId]) {
                throw new Error(
                    formatOrphanReferencesError([
                        {
                            groupKey: importKey,
                            groupDisplayName: importGroup.name,
                            exerciseId: importRef.exerciseId,
                        },
                    ])
                );
            }
            const existing = refById.get(importRef.refId);
            if (existing) {
                existing.value = importRef.value;
            } else {
                existingGroup.exercises.push({ ...importRef });
            }
        }

        mergedGroups[existingKey] = existingGroup;
    }

    const result: WorkoutConfig = {
        globalRestTime: imported.globalRestTime ?? local.globalRestTime,
        exercises: mergedCatalog,
        groups: mergedGroups,
    };

    const validationError = validateWorkoutConfig(result);
    if (validationError) {
        throw new Error(validationError);
    }

    return result;
}

export function exportCatalogToJson(config: WorkoutConfig): string {
    return JSON.stringify(
        {
            globalRestTime: config.globalRestTime,
            exercises: config.exercises,
        },
        null,
        2
    );
}

export function exportGroupsToJson(config: WorkoutConfig): string {
    return JSON.stringify(
        {
            globalRestTime: config.globalRestTime,
            groups: config.groups,
        },
        null,
        2
    );
}

export function exportWorkoutConfigToJson(config: WorkoutConfig): string {
    return JSON.stringify(
        {
            globalRestTime: config.globalRestTime,
            exercises: config.exercises,
            groups: config.groups,
        },
        null,
        2
    );
}
