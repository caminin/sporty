"use server";

import type {
    ExerciseDefinition,
    ExerciseType,
    Group,
    GroupColorKey,
    WorkoutConfig,
} from "./types";
import { loadExerciseList, saveExerciseList, initializeExerciseLists } from "./lists";
import {
    getCatalogExerciseIdsUsedInGroups,
    parseWorkoutConfig,
    resolveRef,
} from "./workout-config";

function requireActiveListId(listId: string | undefined): string {
  if (!listId || listId.trim().length === 0) {
    throw new Error('Aucune liste sélectionnée. Sélectionnez une liste avant d’effectuer cette action.');
  }
  return listId;
}

async function loadValidConfig(listId: string): Promise<WorkoutConfig> {
    const list = await loadExerciseList(listId);
    if (!list) {
        throw new Error(`Liste d'exercices '${listId}' introuvable.`);
    }
    return list.config;
}

export async function getWorkoutConfig(listId: string): Promise<WorkoutConfig> {
    const activeListId = requireActiveListId(listId);
    await initializeExerciseLists();
    return loadValidConfig(activeListId);
}

async function saveWorkoutConfigForList(config: WorkoutConfig, listId: string): Promise<void> {
    const activeListId = requireActiveListId(listId);
    const list = await loadExerciseList(activeListId);
    if (list) {
        list.config = config;
        await saveExerciseList(list);
    } else {
        throw new Error('La liste cible est introuvable. Sélectionnez une liste existante.');
    }
}

export async function updateGlobalRestTime(
    restTime: number,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    config.globalRestTime = restTime;
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function addCatalogExercise(
    exercise: Omit<ExerciseDefinition, "id">,
    listId: string,
    id?: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const exerciseId = id ?? `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    if (config.exercises[exerciseId]) {
        throw new Error(`Un exercice avec l'id '${exerciseId}' existe déjà dans le catalogue`);
    }
    config.exercises[exerciseId] = { id: exerciseId, ...exercise };
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function updateCatalogExercise(
    exerciseId: string,
    updates: Partial<Pick<ExerciseDefinition, "name" | "type" | "value" | "muscleGroup">>,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const def = config.exercises[exerciseId];
    if (!def) {
        throw new Error(`Exercice catalogue '${exerciseId}' introuvable`);
    }
    if (updates.name !== undefined) def.name = updates.name;
    if (updates.type !== undefined) def.type = updates.type;
    if (updates.value !== undefined) {
        if (updates.value <= 0) throw new Error('La valeur doit être positive');
        def.value = updates.value;
    }
    if (updates.muscleGroup !== undefined) def.muscleGroup = updates.muscleGroup;
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteCatalogExercise(
    exerciseId: string,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const usage = getCatalogExerciseIdsUsedInGroups(config);
    const groups = usage.get(exerciseId);
    if (groups && groups.length > 0) {
        throw new Error(
            `Impossible de supprimer : exercice utilisé dans ${groups.join(', ')}`
        );
    }
    delete config.exercises[exerciseId];
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function createGroup(
    name: string,
    icon: string,
    color: GroupColorKey,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    if (config.groups[name]) {
        throw new Error(`Un groupe nommé '${name}' existe déjà`);
    }

    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const group: Group = {
        id,
        name,
        icon,
        color,
        createdAt: new Date().toISOString(),
        exercises: [],
    };

    config.groups[name] = group;
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function updateGroup(
    groupName: string,
    updates: Partial<Pick<Group, 'name' | 'icon' | 'color'>>,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    if (updates.name !== undefined && updates.name !== groupName) {
        if (config.groups[updates.name]) {
            throw new Error(`Un groupe nommé '${updates.name}' existe déjà`);
        }

        const updatedGroup = {
            ...group,
            name: updates.name,
            ...(updates.icon !== undefined && { icon: updates.icon }),
            ...(updates.color !== undefined && { color: updates.color }),
        };
        config.groups[updates.name] = updatedGroup;
        delete config.groups[groupName];
    } else {
        if (updates.name !== undefined) group.name = updates.name;
        if (updates.icon !== undefined) group.icon = updates.icon;
        if (updates.color !== undefined) group.color = updates.color;
    }

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteGroup(
    groupName: string,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    delete config.groups[groupName];
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function addExerciseToGroup(
    groupName: string,
    exerciseId: string,
    listId: string,
    valueOverride?: number
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    if (!config.exercises[exerciseId]) {
        throw new Error(`Exercice '${exerciseId}' absent du catalogue`);
    }

    const refId = `ref-${exerciseId}-${Date.now()}`;
    const ref = {
        refId,
        exerciseId,
        ...(valueOverride !== undefined && valueOverride > 0 ? { value: valueOverride } : {}),
    };

    group.exercises.push(ref);
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function updateGroupExerciseRef(
    groupName: string,
    refId: string,
    listId: string,
    valueOverride?: number | null
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    const ref = group.exercises.find((r) => r.refId === refId);
    if (!ref) {
        throw new Error(`Référence '${refId}' introuvable dans le groupe`);
    }

    if (valueOverride === null || valueOverride === undefined) {
        delete ref.value;
    } else {
        if (valueOverride <= 0) throw new Error('La valeur doit être positive');
        ref.value = valueOverride;
    }

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteExerciseFromGroup(
    groupName: string,
    refId: string,
    listId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    group.exercises = group.exercises.filter((r) => r.refId !== refId);

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export const createCustomGroup = createGroup;
export const updateCustomGroup = updateGroup;
export const deleteCustomGroup = deleteGroup;
export const addExerciseToCustomGroup = addExerciseToGroup;
export const deleteExerciseFromCustomGroup = deleteExerciseFromGroup;
