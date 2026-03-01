import type { WorkoutConfig, SessionStep } from "./workout-types";

/**
 * Builds a flat sequence of SessionSteps from a WorkoutConfig.
 * Groups with no exercises are skipped.
 * Sequence: [work, rest, work, rest, ..., work] (no trailing rest).
 */
export function buildSessionSteps(config: WorkoutConfig): SessionStep[] {
    const steps: SessionStep[] = [];
    const restDuration = config.globalRestTime;

    // Flatten all exercises from all non-empty groups
    const allExercises: Array<{ name: string; group: string; type: "time" | "reps"; value: number }> = [];

    for (const [groupName, exercises] of Object.entries(config.groups)) {
        for (const ex of exercises) {
            allExercises.push({ name: ex.name, group: groupName, type: ex.type, value: ex.value });
        }
    }

    for (let i = 0; i < allExercises.length; i++) {
        const ex = allExercises[i];

        if (ex.type === "time") {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "time", duration: ex.value });
        } else {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "reps", reps: ex.value });
        }

        // Add rest after every exercise except the last
        if (i < allExercises.length - 1) {
            steps.push({ kind: "rest", duration: restDuration });
        }
    }

    return steps;
}

/**
 * Encodes a SessionStep array to a base64 URL-safe string.
 */
export function encodeSession(steps: SessionStep[]): string {
    const json = JSON.stringify(steps);
    // btoa is available in browser; use Buffer in Node
    if (typeof window !== "undefined") {
        return btoa(json);
    }
    return Buffer.from(json, "utf-8").toString("base64");
}

/**
 * Decodes a base64 string back to a SessionStep array.
 * Returns null if decoding fails.
 */
export function decodeSession(encoded: string): SessionStep[] | null {
    try {
        let json: string;
        if (typeof window !== "undefined") {
            json = atob(encoded);
        } else {
            json = Buffer.from(encoded, "base64").toString("utf-8");
        }
        return JSON.parse(json) as SessionStep[];
    } catch {
        return null;
    }
}
