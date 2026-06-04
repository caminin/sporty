import fs from "fs/promises";
import path from "path";
import type { GroupExerciseRef, Training } from "./types";
import { parseTrainingJson } from "./workout-config";
import { loadGlobalCatalog } from "./catalog";

export interface TrainingMetadata {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

/** @deprecated Use TrainingMetadata */
export type ExerciseListMetadata = TrainingMetadata;

export type { Training };

const DEFAULT_DATA_DIR = "/tmp/sporty-data";
const TRAININGS_DIR_NAME = "trainings";
const MANUAL_LISTS_DIR_NAME = "manual-lists";

function getDataDir(): string {
    return process.env.DATA_DIR || DEFAULT_DATA_DIR;
}

export function getTrainingsDir(): string {
    return path.join(getDataDir(), TRAININGS_DIR_NAME);
}

export function getManualListsDir(): string {
    return path.join(getDataDir(), MANUAL_LISTS_DIR_NAME);
}

async function ensureTrainingsDir(): Promise<void> {
    await fs.mkdir(getTrainingsDir(), { recursive: true });
}

async function ensureManualListsDir(): Promise<void> {
    await fs.mkdir(getManualListsDir(), { recursive: true });
}

function generateTrainingId(): string {
    return `training_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getTrainingFilePath(trainingId: string): string {
    return path.join(getTrainingsDir(), `${trainingId}.json`);
}

function validateTrainingRecord(raw: unknown): raw is Training {
    if (!raw || typeof raw !== "object") return false;
    const t = raw as Record<string, unknown>;
    if (typeof t.id !== "string" || typeof t.name !== "string") return false;
    if (typeof t.createdAt !== "string" || typeof t.updatedAt !== "string") return false;
    if (typeof t.globalRestTime !== "number" || t.globalRestTime < 0) return false;
    if (!Array.isArray(t.exerciseRefs)) return false;
    if ("exercises" in t || "groups" in t || "config" in t) return false;
    return t.exerciseRefs.every(
        (r) =>
            r &&
            typeof r === "object" &&
            typeof (r as GroupExerciseRef).refId === "string" &&
            typeof (r as GroupExerciseRef).exerciseId === "string"
    );
}

export async function listTrainings(): Promise<TrainingMetadata[]> {
    await ensureTrainingsDir();
    try {
        const files = await fs.readdir(getTrainingsDir());
        const trainings: TrainingMetadata[] = [];
        for (const file of files.filter((f) => f.endsWith(".json"))) {
            const id = file.replace(".json", "");
            const t = await loadTraining(id);
            if (t) {
                trainings.push({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                });
            }
        }
        return trainings.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch {
        return [];
    }
}

/** @deprecated Use listTrainings */
export const listExerciseLists = listTrainings;

export async function loadTraining(trainingId: string): Promise<Training | null> {
    await ensureTrainingsDir();
    try {
        const data = await fs.readFile(getTrainingFilePath(trainingId), "utf-8");
        const parsed = JSON.parse(data) as Training;
        if (!validateTrainingRecord(parsed)) {
            console.error(`Invalid training structure for ${trainingId}`);
            return null;
        }
        const catalog = await loadGlobalCatalog();
        for (const ref of parsed.exerciseRefs) {
            if (!catalog.exercises[ref.exerciseId]) {
                console.error(
                    `Training ${trainingId}: exerciseId ${ref.exerciseId} absent du catalogue`
                );
                return null;
            }
        }
        return parsed;
    } catch (error) {
        if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
            return null;
        }
        console.error(`Failed to load training ${trainingId}:`, error);
        return null;
    }
}

/** @deprecated Use loadTraining */
export const loadExerciseList = loadTraining;

export async function saveTraining(training: Training): Promise<void> {
    await ensureTrainingsDir();
    const catalog = await loadGlobalCatalog();
    for (const ref of training.exerciseRefs) {
        if (!catalog.exercises[ref.exerciseId]) {
            throw new Error(
                `Référence invalide : exercice « ${ref.exerciseId} » absent du catalogue global`
            );
        }
    }
    training.updatedAt = new Date().toISOString();
    await fs.writeFile(
        getTrainingFilePath(training.id),
        JSON.stringify(training, null, 2),
        "utf-8"
    );
}

/** @deprecated Use saveTraining */
export const saveExerciseList = saveTraining;

export async function createTraining(name: string, description?: string): Promise<Training> {
    const training: Training = {
        id: generateTrainingId(),
        name,
        description,
        globalRestTime: 30,
        exerciseRefs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveTraining(training);
    return training;
}

/** @deprecated Use createTraining */
export const createExerciseList = createTraining;

export async function deleteTraining(trainingId: string): Promise<void> {
    await ensureTrainingsDir();
    await fs.unlink(getTrainingFilePath(trainingId));
}

/** @deprecated Use deleteTraining */
export const deleteExerciseList = deleteTraining;

export async function listManualListFiles(): Promise<string[]> {
    await ensureManualListsDir();
    try {
        const files = await fs.readdir(getManualListsDir());
        return files
            .filter((file) => file.toLowerCase().endsWith(".json"))
            .filter((file) => !file.startsWith("."));
    } catch {
        return [];
    }
}

function getSafeManualFilePath(fileName: string): string {
    const normalized = path.basename(fileName);
    if (normalized !== fileName || normalized.includes("..")) {
        throw new Error("Nom de fichier invalide");
    }
    return path.join(getManualListsDir(), normalized);
}

export async function loadManualFileRaw(fileName: string): Promise<unknown> {
    const data = await fs.readFile(getSafeManualFilePath(fileName), "utf-8");
    return JSON.parse(data);
}

export async function initializeExerciseLists(): Promise<void> {
    await ensureTrainingsDir();
    await ensureManualListsDir();
}
