export type ExerciseType = "time" | "reps";

export interface Exercise {
    id: string;
    name: string;
    type: ExerciseType;
    /** Duration in seconds if type="time", repetition count if type="reps" */
    value: number;
}

export interface WorkoutConfig {
    globalRestTime: number;
    groups: Record<string, Group>;
}

export interface Group {
    id: string;
    name: string;
    icon: string; // nom de l'icône Lucide
    createdAt: string;
    exercises: Exercise[];
}

export interface CustomGroup extends Group {} // Backward compatibility

/** A single step in a workout session sequence. */
export type SessionStep =
    | { kind: "work"; name: string; group: string; type: "time"; duration: number }
    | { kind: "work"; name: string; group: string; type: "reps"; reps: number }
    | { kind: "rest"; duration: number };

/** Timer state machine states. */
export type SessionState = "running" | "paused" | "finished" | "preparing";

