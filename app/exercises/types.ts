import type { MuscleGroupKey } from "./muscle-groups";

export type ExerciseType = "time" | "reps";
export type GroupColorKey =
    | "red"
    | "blue"
    | "purple"
    | "yellow"
    | "emerald"
    | "primary"
    | "orange"
    | "cyan";

/** Catalogue entry — default name, type, value, and muscle group for an exercise. */
export interface ExerciseDefinition {
    id: string;
    name: string;
    type: ExerciseType;
    /** Duration in seconds if type="time", repetition count if type="reps" */
    value: number;
    muscleGroup: MuscleGroupKey;
}

/** Placement of a catalog exercise inside a training (optional value override). */
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
    /** Catalog muscle group — used as session group label */
    muscleGroup: MuscleGroupKey;
}

/** @deprecated Use ExerciseDefinition */
export type Exercise = ResolvedExercise;

export interface GlobalCatalog {
    exercises: Record<string, ExerciseDefinition>;
}

export interface Training {
    id: string;
    name: string;
    description?: string;
    globalRestTime: number;
    exerciseRefs: GroupExerciseRef[];
    createdAt: string;
    updatedAt: string;
}

/** Runtime view: global catalog + active training refs (replaces per-list WorkoutConfig). */
export interface WorkoutView {
    globalRestTime: number;
    exercises: Record<string, ExerciseDefinition>;
    exerciseRefs: GroupExerciseRef[];
}

export type SessionStep =
    | { kind: "work"; name: string; group: string; type: "time"; duration: number }
    | { kind: "work"; name: string; group: string; type: "reps"; reps: number }
    | { kind: "rest"; duration: number };

export type SessionState = "running" | "paused" | "finished" | "preparing";
