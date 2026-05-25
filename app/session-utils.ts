import type { WorkoutConfig, SessionStep, ResolvedExercise } from "./exercises/types";
import { resolveRef } from "./exercises/workout-config";

const STARTUP_SECONDS = 5;
const SECONDS_PER_REP = 3;

function collectResolved(
    config: WorkoutConfig,
    selectedRefIds?: Set<string>
): ResolvedExercise[] {
    const resolved: ResolvedExercise[] = [];
    for (const group of Object.values(config.groups)) {
        for (const ref of group.exercises) {
            if (selectedRefIds && !selectedRefIds.has(ref.refId)) continue;
            const ex = resolveRef(config.exercises, ref);
            if (ex) resolved.push(ex);
        }
    }
    return resolved;
}

export function estimateSessionDuration(
    config: WorkoutConfig,
    selectedIds: Set<string>
): number {
    const selected = collectResolved(config, selectedIds);

    if (selected.length === 0) return 0;

    let total = 0;
    for (const ex of selected) {
        total += STARTUP_SECONDS;
        const value = Math.round(ex.value);
        total += ex.type === "reps" ? value * SECONDS_PER_REP : value;
    }
    total += (selected.length - 1) * config.globalRestTime;

    return total;
}

export function formatDuration(seconds: number): string {
    if (seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function testOptimizedSequencing() {
    console.log("Testing optimized exercise sequencing algorithm...");

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

    console.log("Test PASSED: Optimized sequencing works correctly");
    return true;
}

export function testBuildSessionSteps() {
    const testConfig: WorkoutConfig = {
        globalRestTime: 30,
        exercises: {
            "test-1": { id: "test-1", name: "Test Exercise 1", type: "reps", value: 10 },
            "test-2": { id: "test-2", name: "Test Exercise 2", type: "time", value: 45 },
        },
        groups: {
            "Test Group 1": {
                id: "test-group-1",
                name: "Test Group 1",
                icon: "Dumbbell",
                color: "emerald",
                createdAt: new Date().toISOString(),
                exercises: [{ refId: "test-1", exerciseId: "test-1" }],
            },
            "Test Group 2": {
                id: "test-group-2",
                name: "Test Group 2",
                icon: "Activity",
                color: "blue",
                createdAt: new Date().toISOString(),
                exercises: [{ refId: "test-2", exerciseId: "test-2" }],
            },
        },
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

    const allExercises: Array<{ name: string; group: string; type: "time" | "reps"; value: number }> = [];

    for (const [groupName, group] of Object.entries(config.groups)) {
        for (const ref of group.exercises) {
            const ex = resolveRef(config.exercises, ref);
            if (ex) {
                allExercises.push({
                    name: ex.name,
                    group: groupName,
                    type: ex.type,
                    value: ex.value,
                });
            }
        }
    }

    const optimizedExercises = optimizeExerciseSequence(allExercises);

    for (let i = 0; i < optimizedExercises.length; i++) {
        const ex = optimizedExercises[i];
        const value = Math.round(ex.value);

        if (ex.type === "time") {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "time", duration: value });
        } else {
            steps.push({ kind: "work", name: ex.name, group: ex.group, type: "reps", reps: value });
        }

        if (i < optimizedExercises.length - 1) {
            steps.push({ kind: "rest", duration: restDuration });
        }
    }

    if (steps.length > 0 && steps[0].kind === "rest") {
        steps.shift();
    }

    return steps;
}

export function encodeSession(steps: SessionStep[]): string {
    const json = JSON.stringify(steps);
    if (typeof window !== "undefined") {
        return btoa(unescape(encodeURIComponent(json)));
    }
    return Buffer.from(json, "utf-8").toString("base64");
}

export function optimizeExerciseSequence(
    exercises: Array<{ name: string; group: string; type: "time" | "reps"; value: number }>
): Array<{ name: string; group: string; type: "time" | "reps"; value: number }> {
    if (exercises.length <= 1) return exercises;

    const result: Array<{ name: string; group: string; type: "time" | "reps"; value: number }> = [];
    const remainingExercises = [...exercises];
    const groupLastUsed: Record<string, number> = {};

    const groupCounts: Record<string, number> = {};
    for (const ex of exercises) {
        groupCounts[ex.group] = (groupCounts[ex.group] ?? 0) + 1;
    }
    const groupsArray = Array.from(new Set(exercises.map(ex => ex.group))).sort(
        (a, b) => (groupCounts[b] ?? 0) - (groupCounts[a] ?? 0)
    );

    for (const group of groupsArray) {
        const exerciseIndex = remainingExercises.findIndex(ex => ex.group === group);
        if (exerciseIndex !== -1) {
            const exercise = remainingExercises.splice(exerciseIndex, 1)[0];
            result.push(exercise);
            groupLastUsed[group] = result.length - 1;
        }
    }

    while (remainingExercises.length > 0) {
        let maxDistance = -1;
        let selectedGroup = "";
        for (const group of groupsArray) {
            const hasRemaining = remainingExercises.some(ex => ex.group === group);
            if (!hasRemaining) continue;

            const distance =
                groupLastUsed[group] !== undefined
                    ? result.length - groupLastUsed[group]
                    : Infinity;
            if (distance > maxDistance) {
                maxDistance = distance;
                selectedGroup = group;
            }
        }

        const exerciseIndex = remainingExercises.findIndex(ex => ex.group === selectedGroup);
        if (exerciseIndex !== -1) {
            const exercise = remainingExercises.splice(exerciseIndex, 1)[0];
            result.push(exercise);
            groupLastUsed[selectedGroup] = result.length - 1;
        } else {
            const exercise = remainingExercises.shift()!;
            result.push(exercise);
            groupLastUsed[exercise.group] = result.length - 1;
        }
    }

    return result;
}

export function decodeSession(encoded: string): SessionStep[] | null {
    try {
        let json: string;
        if (typeof window !== "undefined") {
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
