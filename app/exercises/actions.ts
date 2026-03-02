"use server";

import type { Exercise, WorkoutConfig, Group } from "./types";
import { loadExerciseList, saveExerciseList, initializeExerciseLists } from "./lists";
import { migrateWorkoutConfig } from "./workout-config";

// Fonction pour charger une liste d'exercices
export async function getWorkoutConfig(listId: string = 'default'): Promise<WorkoutConfig> {
    // Initialiser le système de listes si nécessaire
    await initializeExerciseLists();

    // Charger la liste spécifiée
    const list = await loadExerciseList(listId);
    if (list) {
        // Apply migration if needed
        const migratedConfig = migrateWorkoutConfig(list.config);

        // Save migrated config if it was changed
        if (JSON.stringify(migratedConfig) !== JSON.stringify(list.config)) {
            list.config = migratedConfig;
            await saveExerciseList(list);
        }

        return migratedConfig;
    }

    // Lever une erreur explicite si la liste n'existe pas
    throw new Error(`Liste d'exercices '${listId}' introuvable. Vérifiez que le système de listes est correctement initialisé ou sélectionnez une liste différente.`);
}

// Fonction helper pour sauvegarder une liste
async function saveWorkoutConfigForList(config: WorkoutConfig, listId: string = 'default'): Promise<void> {
    const list = await loadExerciseList(listId);
    if (list) {
        list.config = config;
        await saveExerciseList(list);
    } else {
        // Créer une nouvelle liste si elle n'existe pas
        const { createExerciseList } = await import('./lists');
        const newList = await createExerciseList('Liste par défaut', 'Liste créée automatiquement');
        // Forcer l'ID à 'default' pour la compatibilité
        newList.id = 'default';
        newList.config = config;
        await saveExerciseList(newList);
    }
}

export async function addExercise(
    groupName: string,
    exercise: Omit<Exercise, "id">,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable. Créez d'abord le groupe.`);
    }
    const id = `${groupName.slice(0, 2).toLowerCase()}-${Date.now()}`;
    group.exercises.push({ id, ...exercise });

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteExercise(
    groupName: string,
    exerciseId: string,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    const group = config.groups[groupName];
    if (group) {
        group.exercises = group.exercises.filter((ex) => ex.id !== exerciseId);
    }
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function updateGlobalRestTime(
    restTime: number,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);
    config.globalRestTime = restTime;
    await saveWorkoutConfigForList(config, listId);
    return config;
}

// Fonctions CRUD unifiées pour tous les groupes

export async function createGroup(
    name: string,
    icon: string,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    // Vérifier que le nom du groupe n'existe pas déjà
    if (config.groups[name]) {
        throw new Error(`Un groupe nommé '${name}' existe déjà`);
    }

    // Générer un ID unique
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Créer le groupe
    const group: Group = {
        id,
        name,
        icon,
        createdAt: new Date().toISOString(),
        exercises: []
    };

    config.groups[name] = group;
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function updateGroup(
    groupName: string,
    updates: Partial<Pick<Group, 'name' | 'icon'>>,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    // Appliquer les mises à jour
    if (updates.name !== undefined && updates.name !== groupName) {
        // Renommage du groupe - vérifier que le nouveau nom n'existe pas
        if (config.groups[updates.name]) {
            throw new Error(`Un groupe nommé '${updates.name}' existe déjà`);
        }

        // Créer le groupe avec le nouveau nom et les autres mises à jour
        const updatedGroup = {
            ...group,
            name: updates.name,
            ...(updates.icon !== undefined && { icon: updates.icon })
        };
        config.groups[updates.name] = updatedGroup;

        // Supprimer l'ancien groupe
        delete config.groups[groupName];
    } else {
        // Mise à jour simple
        if (updates.name !== undefined) {
            group.name = updates.name;
        }
        if (updates.icon !== undefined) {
            group.icon = updates.icon;
        }
    }

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteGroup(
    groupName: string,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    // Supprimer le groupe
    delete config.groups[groupName];
    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function addExerciseToGroup(
    groupName: string,
    exercise: Omit<Exercise, "id">,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    // Générer un ID unique pour l'exercice
    const id = `${groupName.slice(0, 2).toLowerCase()}-${Date.now()}`;
    group.exercises.push({ id, ...exercise });

    await saveWorkoutConfigForList(config, listId);
    return config;
}

export async function deleteExerciseFromGroup(
    groupName: string,
    exerciseId: string,
    listId: string = 'default'
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig(listId);

    const group = config.groups[groupName];
    if (!group) {
        throw new Error(`Groupe '${groupName}' introuvable`);
    }

    // Supprimer l'exercice du groupe
    group.exercises = group.exercises.filter(ex => ex.id !== exerciseId);

    await saveWorkoutConfigForList(config, listId);
    return config;
}

// Fonctions de compatibilité (backward compatibility)
export const createCustomGroup = createGroup;
export const updateCustomGroup = updateGroup;
export const deleteCustomGroup = deleteGroup;
export const addExerciseToCustomGroup = addExerciseToGroup;
export const deleteExerciseFromCustomGroup = deleteExerciseFromGroup;
