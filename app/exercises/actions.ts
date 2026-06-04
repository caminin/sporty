"use server";

import type { ExerciseDefinition, GlobalCatalog, Training, WorkoutView } from "./types";
import { loadGlobalCatalog, saveGlobalCatalog } from "./catalog";
import {
    createTraining,
    loadTraining,
    listTrainings,
    saveTraining,
    initializeExerciseLists,
} from "./lists";
import {
    buildWorkoutView,
    getCatalogExerciseIdsUsedInTrainings,
    getEffectiveValue,
} from "./workout-config";

function requireTrainingId(trainingId: string | undefined): string {
    if (!trainingId?.trim()) {
        throw new Error(
            "Aucun entraînement sélectionné. Sélectionnez un entraînement avant d’effectuer cette action."
        );
    }
    return trainingId;
}

export async function getGlobalCatalog(): Promise<GlobalCatalog> {
    await initializeExerciseLists();
    return loadGlobalCatalog();
}

export async function getWorkoutView(trainingId: string): Promise<WorkoutView> {
    const id = requireTrainingId(trainingId);
    const [catalog, training] = await Promise.all([
        getGlobalCatalog(),
        loadTraining(id),
    ]);
    if (!training) {
        throw new Error(`Entraînement '${id}' introuvable.`);
    }
    return buildWorkoutView(catalog, training);
}

/** @deprecated Use getWorkoutView */
export async function getWorkoutConfig(trainingId: string): Promise<WorkoutView> {
    return getWorkoutView(trainingId);
}

export async function updateGlobalRestTime(
    restTime: number,
    trainingId: string
): Promise<WorkoutView> {
    const id = requireTrainingId(trainingId);
    const training = await loadTraining(id);
    if (!training) throw new Error("Entraînement introuvable");
    training.globalRestTime = restTime;
    await saveTraining(training);
    const catalog = await getGlobalCatalog();
    return buildWorkoutView(catalog, training);
}

export async function addCatalogExercise(
    exercise: Omit<ExerciseDefinition, "id">,
    _trainingId?: string,
    id?: string
): Promise<GlobalCatalog> {
    const catalog = await getGlobalCatalog();
    const exerciseId = id ?? `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    if (catalog.exercises[exerciseId]) {
        throw new Error(`Un exercice avec l'id '${exerciseId}' existe déjà`);
    }
    catalog.exercises[exerciseId] = { id: exerciseId, ...exercise };
    await saveGlobalCatalog(catalog);
    return catalog;
}

export async function updateCatalogExercise(
    exerciseId: string,
    updates: Partial<Pick<ExerciseDefinition, "name" | "type" | "value" | "muscleGroup">>,
    _trainingId?: string
): Promise<GlobalCatalog> {
    const catalog = await getGlobalCatalog();
    const def = catalog.exercises[exerciseId];
    if (!def) throw new Error(`Exercice '${exerciseId}' introuvable`);
    if (updates.name !== undefined) def.name = updates.name;
    if (updates.type !== undefined) def.type = updates.type;
    if (updates.value !== undefined) {
        if (updates.value <= 0) throw new Error("La valeur doit être positive");
        def.value = updates.value;
    }
    if (updates.muscleGroup !== undefined) def.muscleGroup = updates.muscleGroup;
    await saveGlobalCatalog(catalog);
    return catalog;
}

export async function deleteCatalogExercise(
    exerciseId: string,
    _trainingId?: string
): Promise<GlobalCatalog> {
    if (!exerciseId?.trim()) {
        throw new Error("Exercice invalide pour suppression");
    }
    const catalog = await getGlobalCatalog();
    if (!catalog.exercises[exerciseId]) {
        throw new Error(`Exercice '${exerciseId}' introuvable`);
    }
    const loaded = await Promise.all(
        (await listTrainings()).map((m) => loadTraining(m.id))
    );
    const validTrainings = loaded.filter((t): t is Training => t !== null);
    const usage = getCatalogExerciseIdsUsedInTrainings(validTrainings);
    const trainingNames = usage.get(exerciseId);
    if (trainingNames?.length) {
        throw new Error(
            `Impossible de supprimer : exercice utilisé dans ${trainingNames.join(", ")}`
        );
    }
    delete catalog.exercises[exerciseId];
    await saveGlobalCatalog(catalog);
    return catalog;
}

export async function addExerciseToTraining(
    trainingId: string,
    exerciseId: string,
    valueOverride?: number
): Promise<WorkoutView> {
    const id = requireTrainingId(trainingId);
    const [catalog, training] = await Promise.all([
        getGlobalCatalog(),
        loadTraining(id),
    ]);
    if (!training) throw new Error("Entraînement introuvable");
    if (!catalog.exercises[exerciseId]) {
        throw new Error(`Exercice '${exerciseId}' absent du catalogue`);
    }
    const refId = `ref-${exerciseId}-${Date.now()}`;
    training.exerciseRefs.push({
        refId,
        exerciseId,
        ...(valueOverride !== undefined && valueOverride > 0 ? { value: valueOverride } : {}),
    });
    await saveTraining(training);
    return buildWorkoutView(catalog, training);
}

export async function updateTrainingExerciseRef(
    trainingId: string,
    refId: string,
    valueOverride?: number | null
): Promise<WorkoutView> {
    const id = requireTrainingId(trainingId);
    const [catalog, training] = await Promise.all([
        getGlobalCatalog(),
        loadTraining(id),
    ]);
    if (!training) throw new Error("Entraînement introuvable");
    const ref = training.exerciseRefs.find((r) => r.refId === refId);
    if (!ref) throw new Error(`Référence '${refId}' introuvable`);
    if (valueOverride === null || valueOverride === undefined) {
        delete ref.value;
    } else {
        if (valueOverride <= 0) throw new Error("La valeur doit être positive");
        ref.value = valueOverride;
    }
    await saveTraining(training);
    return buildWorkoutView(catalog, training);
}

export async function deleteExerciseFromTraining(
    trainingId: string,
    refId: string
): Promise<WorkoutView> {
    const id = requireTrainingId(trainingId);
    const [catalog, training] = await Promise.all([
        getGlobalCatalog(),
        loadTraining(id),
    ]);
    if (!training) throw new Error("Entraînement introuvable");
    training.exerciseRefs = training.exerciseRefs.filter((r) => r.refId !== refId);
    await saveTraining(training);
    return buildWorkoutView(catalog, training);
}

