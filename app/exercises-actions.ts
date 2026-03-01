"use server";

import fs from "fs/promises";
import path from "path";
import type { Exercise, WorkoutConfig } from "./workout-types";

const EXERCISES_PATH = path.join(process.cwd(), "app", "exercises.json");

export async function getWorkoutConfig(): Promise<WorkoutConfig> {
    const raw = await fs.readFile(EXERCISES_PATH, "utf-8");
    return JSON.parse(raw) as WorkoutConfig;
}

async function saveWorkoutConfig(config: WorkoutConfig): Promise<void> {
    await fs.writeFile(EXERCISES_PATH, JSON.stringify(config, null, 4), "utf-8");
}

export async function addExercise(
    groupName: string,
    exercise: Omit<Exercise, "id">
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig();
    if (!config.groups[groupName]) {
        config.groups[groupName] = [];
    }
    const id = `${groupName.slice(0, 2).toLowerCase()}-${Date.now()}`;
    config.groups[groupName].push({ id, ...exercise });
    await saveWorkoutConfig(config);
    return config;
}

export async function deleteExercise(
    groupName: string,
    exerciseId: string
): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig();
    if (config.groups[groupName]) {
        config.groups[groupName] = config.groups[groupName].filter(
            (ex) => ex.id !== exerciseId
        );
    }
    await saveWorkoutConfig(config);
    return config;
}

export async function updateGlobalRestTime(restTime: number): Promise<WorkoutConfig> {
    const config = await getWorkoutConfig();
    config.globalRestTime = restTime;
    await saveWorkoutConfig(config);
    return config;
}
