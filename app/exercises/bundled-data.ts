import fs from "fs/promises";
import path from "path";
import type { GlobalCatalog, GroupExerciseRef, Training } from "./types";
import { normalizeCatalog, parseTrainingJson } from "./workout-config";

const BUNDLED_DIR = path.join(process.cwd(), "public", "bundled-exercice-list");

export const BUNDLED_TRAINING_SLUGS = {
    global: "entrainement-global",
    dynamisme: "entrainement-dynamisme-jambes-mollets-core",
} as const;

export const BUNDLED_TRAINING_IDS = {
    global: "training_global",
    dynamisme: "training_dynamisme",
} as const;

export async function readBundledCatalog(): Promise<GlobalCatalog> {
    const raw = await fs.readFile(path.join(BUNDLED_DIR, "catalog.json"), "utf-8");
    const parsed = JSON.parse(raw) as { exercises: unknown };
    const exercises = normalizeCatalog(parsed.exercises);
    if (!exercises) {
        throw new Error("Bundle catalogue invalide");
    }
    return { exercises };
}

export async function readBundledTrainingPayload(
    slug: keyof typeof BUNDLED_TRAINING_SLUGS
): Promise<{ name: string; globalRestTime: number; exerciseRefs: GroupExerciseRef[] }> {
    const fileName = `${BUNDLED_TRAINING_SLUGS[slug]}.json`;
    const raw = await fs.readFile(path.join(BUNDLED_DIR, fileName), "utf-8");
    const parsed = parseTrainingJson(JSON.parse(raw));
    if (parsed.error || !parsed.payload) {
        throw new Error(parsed.error ?? `Bundle entraînement invalide: ${fileName}`);
    }
    const p = parsed.payload;
    return {
        name: p.name ?? slug,
        globalRestTime: p.globalRestTime,
        exerciseRefs: p.exerciseRefs,
    };
}

export function trainingFromBundle(
    id: string,
    payload: { name: string; globalRestTime: number; exerciseRefs: GroupExerciseRef[] }
): Training {
    const now = new Date().toISOString();
    return {
        id,
        name: payload.name,
        globalRestTime: payload.globalRestTime,
        exerciseRefs: payload.exerciseRefs.map((r) => ({ ...r })),
        createdAt: now,
        updatedAt: now,
    };
}
