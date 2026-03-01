import type { WorkoutConfig, SessionStep } from "./workout-types";


/**
 * Builds a flat sequence of SessionSteps from a WorkoutConfig.
 * Groups with no exercises are skipped.
 * Sequence: [work, rest, work, rest, ..., work] (no trailing rest).
 */
/**
 * Constants for session time estimation.
 * - STARTUP_SECONDS: warmup/positioning time before each exercise
 * - SECONDS_PER_REP: average time in seconds per repetition
 */
const STARTUP_SECONDS = 5;
const SECONDS_PER_REP = 3;

/**
 * Estimates the total session duration in seconds for the given selection.
 * Formula per exercise: STARTUP_SECONDS + (reps × SECONDS_PER_REP) or duration (time-based)
 * Plus globalRestTime between each exercise (not after the last).
 */
export function estimateSessionDuration(config: WorkoutConfig, selectedIds: Set<string>): number {
    const selected: Array<{ type: "time" | "reps"; value: number }> = [];

    for (const exercises of Object.values(config.groups)) {
        for (const ex of exercises) {
            if (selectedIds.has(ex.id)) {
                selected.push({ type: ex.type, value: ex.value });
            }
        }
    }

    if (selected.length === 0) return 0;

    let total = 0;
    for (const ex of selected) {
        total += STARTUP_SECONDS;
        total += ex.type === "reps" ? ex.value * SECONDS_PER_REP : ex.value;
    }
    // Add rest between exercises (N-1 rests)
    total += (selected.length - 1) * config.globalRestTime;

    return total;
}

/**
 * Formats a duration in seconds to a human-readable string.
 * Returns "Xm Ys" if ≥ 60s, otherwise "Xs".
 */
export function formatDuration(seconds: number): string {
    if (seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/**
 * Test function to verify buildSessionSteps works correctly
 */
export function testBuildSessionSteps() {
    const testConfig: WorkoutConfig = {
        globalRestTime: 30,
        groups: {
            "Test Group 1": [
                { id: "test-1", name: "Test Exercise 1", type: "reps", value: 10 }
            ],
            "Test Group 2": [
                { id: "test-2", name: "Test Exercise 2", type: "time", value: 45 }
            ]
        }
    };

    const steps = buildSessionSteps(testConfig);
    console.log("Test buildSessionSteps result:", steps);

    if (steps.length === 0) {
        console.error("Test FAILED: No steps generated");
        return false;
    }

    if (steps[0].kind !== "work") {
        console.error("Test FAILED: First step is not work", steps[0]);
        return false;
    }

    console.log("Test PASSED: buildSessionSteps works correctly");
    return true;
}

export function buildSessionSteps(config: WorkoutConfig): SessionStep[] {
    const steps: SessionStep[] = [];
    const restDuration = config.globalRestTime;

    // Flatten all exercises from all non-empty groups
    const allExercises: Array<{ name: string; group: string; type: "time" | "reps"; value: number }> = [];

    console.log("buildSessionSteps: processing groups in order", Object.keys(config.groups));
    for (const [groupName, exercises] of Object.entries(config.groups)) {
        console.log(`Processing group: ${groupName} (${exercises.length} exercises)`);
        for (const ex of exercises) {
            allExercises.push({ name: ex.name, group: groupName, type: ex.type, value: ex.value });
        }
    }

    console.log("buildSessionSteps: allExercises", allExercises);
    console.log("buildSessionSteps: first exercise", allExercises[0]);

    // Build sequence: [work, rest, work, rest, ..., work] (no trailing rest)
    // La séance ne commence jamais par un repos - the session never starts with a rest
    for (let i = 0; i < allExercises.length; i++) {
        const ex = allExercises[i];

        if (ex.type === "time") {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "time", duration: ex.value });
        } else {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "reps", reps: ex.value });
        }

        console.log(`Step ${steps.length - 1}: Added work step for ${ex.name} (${ex.type})`);

        // Add rest after every exercise except the last
        if (i < allExercises.length - 1) {
            steps.push({ kind: "rest", duration: restDuration });
            console.log(`Step ${steps.length - 1}: Added rest step (${restDuration}s)`);
        }
    }

    console.log("buildSessionSteps: final steps", steps);
    console.log("buildSessionSteps: first step", steps[0]);
    console.log("buildSessionSteps: first step kind", steps[0]?.kind);

    // Vérification de sécurité : s'assurer que le premier step n'est pas un repos
    if (steps.length > 0 && steps[0].kind === "rest") {
        console.error("BUG CRITIQUE: buildSessionSteps retourne un premier step de type 'rest'!", steps);
        // Correction d'urgence : supprimer le premier repos si présent
        if (steps[0].kind === "rest") {
            steps.shift();
        }
    }

    return steps;
}

/**
 * Encodes a SessionStep array to a base64 URL-safe string.
 */
export function encodeSession(steps: SessionStep[]): string {
    console.log("encodeSession: input steps", steps);
    console.log("encodeSession: first step", steps[0]);
    const json = JSON.stringify(steps);
    console.log("encodeSession: json length", json.length);
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
        const decoded = JSON.parse(json) as SessionStep[];
        console.log("decodeSession: decoded steps", decoded);
        console.log("decodeSession: first step", decoded[0]);
        return decoded;
    } catch {
        console.error("decodeSession: failed to decode", encoded);
        return null;
    }
}
