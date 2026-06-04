import fs from "fs/promises";
import path from "path";
import { saveGlobalCatalog } from "./catalog";
import {
    BUNDLED_TRAINING_IDS,
    readBundledCatalog,
    readBundledTrainingPayload,
    trainingFromBundle,
} from "./bundled-data";
import { getTrainingsDir, saveTraining } from "./lists";

async function clearTrainingsDir(): Promise<void> {
    const dir = getTrainingsDir();
    try {
        const files = await fs.readdir(dir);
        await Promise.all(
            files
                .filter((f) => f.endsWith(".json"))
                .map((f) => fs.unlink(path.join(dir, f)))
        );
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function resetBundledData(): Promise<void> {
    const catalog = await readBundledCatalog();
    await saveGlobalCatalog(catalog);
    await clearTrainingsDir();

    const globalPayload = await readBundledTrainingPayload("global");
    await saveTraining(trainingFromBundle(BUNDLED_TRAINING_IDS.global, globalPayload));

    const dynamismePayload = await readBundledTrainingPayload("dynamisme");
    await saveTraining(
        trainingFromBundle(BUNDLED_TRAINING_IDS.dynamisme, dynamismePayload)
    );
}

export async function initFromBundleIfEmpty(): Promise<void> {
    const { loadGlobalCatalog } = await import("./catalog");
    const { listTrainings } = await import("./lists");
    const catalog = await loadGlobalCatalog();
    const trainings = await listTrainings();
    if (Object.keys(catalog.exercises).length === 0 && trainings.length === 0) {
        await resetBundledData();
    }
}
