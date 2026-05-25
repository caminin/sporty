import type { MuscleGroupKey } from "./muscle-groups";

export type ExerciseType = "time" | "reps";
export type GroupColorKey = "red" | "blue" | "purple" | "yellow" | "emerald" | "primary" | "orange" | "cyan";

/** Catalogue entry — default name, type, value, and muscle group for an exercise. */
export interface ExerciseDefinition {
    id: string;
    name: string;
    type: ExerciseType;
    /** Duration in seconds if type="time", repetition count if type="reps" */
    value: number;
    /** Anatomical muscle group (e.g. split step → jambes), not a session group */
    muscleGroup: MuscleGroupKey;
}

/** Placement of a catalog exercise inside a group (optional value override). */
export interface GroupExerciseRef {
    refId: string;
    exerciseId: string;
    value?: number;
}

/** Resolved placement for UI and session (effective value). */
export interface ResolvedExercise {
    refId: string;
    exerciseId: string;
    name: string;
    type: ExerciseType;
    value: number;
}

/** @deprecated Use ExerciseDefinition — kept for gradual import updates */
export type Exercise = ResolvedExercise;

export interface WorkoutConfig {
    globalRestTime: number;
    exercises: Record<string, ExerciseDefinition>;
    groups: Record<string, Group>;
}

export interface Group {
    id: string;
    name: string;
    icon: string;
    color: GroupColorKey;
    createdAt: string;
    exercises: GroupExerciseRef[];
}

export interface CustomGroup extends Group {}

export type SessionStep =
    | { kind: "work"; name: string; group: string; type: "time"; duration: number }
    | { kind: "work"; name: string; group: string; type: "reps"; reps: number }
    | { kind: "rest"; duration: number };

export type SessionState = "running" | "paused" | "finished" | "preparing";
