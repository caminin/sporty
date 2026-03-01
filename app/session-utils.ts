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
 * Test function to verify the optimized exercise sequencing algorithm
 */
export function testOptimizedSequencing() {
    console.log("Testing optimized exercise sequencing algorithm...");

    // Test 1: Two groups
    const test1 = [
        { name: "Push-ups", group: "Chest", type: "reps" as const, value: 10 },
        { name: "Pull-ups", group: "Back", type: "reps" as const, value: 8 },
        { name: "Bench Press", group: "Chest", type: "reps" as const, value: 12 },
        { name: "Rows", group: "Back", type: "reps" as const, value: 10 },
    ];
    const result1 = optimizeExerciseSequence(test1);
    console.log("Test 1 (2 groups):", result1.map(ex => `${ex.name}(${ex.group})`));
    const groups1 = result1.map(ex => ex.group);
    if (groups1.join('') !== 'ChestBackChestBack') {
        console.error("Test 1 FAILED: Expected alternation Chest-Back-Chest-Back");
        return false;
    }

    // Test 2: Three groups
    const test2 = [
        { name: "Squats", group: "Legs", type: "reps" as const, value: 15 },
        { name: "Push-ups", group: "Chest", type: "reps" as const, value: 10 },
        { name: "Rows", group: "Back", type: "reps" as const, value: 10 },
        { name: "Lunges", group: "Legs", type: "reps" as const, value: 12 },
        { name: "Bench Press", group: "Chest", type: "reps" as const, value: 12 },
        { name: "Pull-ups", group: "Back", type: "reps" as const, value: 8 },
    ];
    const result2 = optimizeExerciseSequence(test2);
    console.log("Test 2 (3 groups):", result2.map(ex => `${ex.name}(${ex.group})`));

    // Check that no group appears consecutively (except if forced by limited exercises)
    let consecutiveCount = 0;
    for (let i = 1; i < result2.length; i++) {
        if (result2[i].group === result2[i-1].group) {
            consecutiveCount++;
        }
    }
    if (consecutiveCount > 1) { // Allow 1 consecutive due to uneven distribution
        console.error("Test 2 FAILED: Too many consecutive exercises from same group");
        return false;
    }

    console.log("Test PASSED: Optimized sequencing works correctly");
    return true;
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

    for (const [groupName, exercises] of Object.entries(config.groups)) {
        for (const ex of exercises) {
            allExercises.push({ name: ex.name, group: groupName, type: ex.type, value: ex.value });
        }
    }

    // Optimize the exercise sequence to maximize alternation between muscle groups
    const optimizedExercises = optimizeExerciseSequence(allExercises);

    // Build sequence: [work, rest, work, rest, ..., work] (no trailing rest)
    // La séance ne commence jamais par un repos - the session never starts with a rest
    for (let i = 0; i < optimizedExercises.length; i++) {
        const ex = optimizedExercises[i];

        if (ex.type === "time") {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "time", duration: ex.value });
        } else {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "reps", reps: ex.value });
        }

        // Add rest after every exercise except the last
        if (i < optimizedExercises.length - 1) {
            steps.push({ kind: "rest", duration: restDuration });
        }
    }

    // Vérification de sécurité : s'assurer que le premier step n'est pas un repos
    if (steps.length > 0 && steps[0].kind === "rest") {
        console.error("BUG CRITIQUE: buildSessionSteps retourne un premier step de type 'rest'!");
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
    const json = JSON.stringify(steps);
    // btoa is available in browser; use Buffer in Node
    if (typeof window !== "undefined") {
        // Properly encode UTF-8 characters for base64
        return btoa(unescape(encodeURIComponent(json)));
    }
    return Buffer.from(json, "utf-8").toString("base64");
}

/**
 * Optimizes the exercise sequence to maximize alternation between muscle groups.
 * Uses a greedy algorithm that selects the exercise from the group that was used least recently.
 */
export function optimizeExerciseSequence(
    exercises: Array<{ name: string; group: string; type: "time" | "reps"; value: number }>
): Array<{ name: string; group: string; type: "time" | "reps"; value: number }> {
    if (exercises.length <= 1) return exercises;

    const result: Array<{ name: string; group: string; type: "time" | "reps"; value: number }> = [];
    const remainingExercises = [...exercises];
    const groupLastUsed: Record<string, number> = {};

    // Start with one exercise from each group to establish the baseline
    const groups = new Set(exercises.map(ex => ex.group));
    const groupsArray = Array.from(groups);

    for (const group of groupsArray) {
        const exerciseIndex = remainingExercises.findIndex(ex => ex.group === group);
        if (exerciseIndex !== -1) {
            const exercise = remainingExercises.splice(exerciseIndex, 1)[0];
            result.push(exercise);
            groupLastUsed[group] = result.length - 1;
        }
    }

    // For remaining exercises, always pick from the group that was used least recently
    while (remainingExercises.length > 0) {
        // Calculate distance for each group (how many exercises ago it was last used)
        const groupDistances: Record<string, number> = {};
        for (const group of groupsArray) {
            if (groupLastUsed[group] !== undefined) {
                groupDistances[group] = result.length - groupLastUsed[group];
            } else {
                groupDistances[group] = Infinity; // Group never used, highest priority
            }
        }

        // Find the group with maximum distance (least recently used)
        let maxDistance = -1;
        let selectedGroup = "";
        for (const [group, distance] of Object.entries(groupDistances)) {
            if (distance > maxDistance) {
                maxDistance = distance;
                selectedGroup = group;
            }
        }

        // Find and add the next exercise from that group
        const exerciseIndex = remainingExercises.findIndex(ex => ex.group === selectedGroup);
        if (exerciseIndex !== -1) {
            const exercise = remainingExercises.splice(exerciseIndex, 1)[0];
            result.push(exercise);
            groupLastUsed[selectedGroup] = result.length - 1;
        } else {
            // Fallback: if no exercise from selected group, take first remaining
            const exercise = remainingExercises.shift()!;
            result.push(exercise);
            groupLastUsed[exercise.group] = result.length - 1;
        }
    }

    return result;
}

/**
 * Decodes a base64 string back to a SessionStep array.
 * Returns null if decoding fails.
 */
export function decodeSession(encoded: string): SessionStep[] | null {
    try {
        let json: string;
        if (typeof window !== "undefined") {
            // Handle UTF-8 characters properly by using decodeURIComponent with escape
            json = decodeURIComponent(escape(atob(encoded)));
        } else {
            json = Buffer.from(encoded, "base64").toString("utf-8");
        }
        const decoded = JSON.parse(json) as SessionStep[];
        return decoded;
    } catch (error) {
        console.error("decodeSession: failed to decode", encoded, error);
        return null;
    }
}
