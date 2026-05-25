export type MuscleGroupKey =
    | "jambes"
    | "mollets"
    | "fessiers"
    | "dos"
    | "epaules"
    | "bras"
    | "abdos"
    | "pecs"
    | "autre";

export const DEFAULT_MUSCLE_GROUP: MuscleGroupKey = "autre";

export const MUSCLE_GROUP_KEYS: MuscleGroupKey[] = [
    "jambes",
    "mollets",
    "fessiers",
    "dos",
    "epaules",
    "bras",
    "abdos",
    "pecs",
    "autre",
];

export interface MuscleGroupMeta {
    key: MuscleGroupKey;
    label: string;
    icon: string;
}

export const MUSCLE_GROUPS: MuscleGroupMeta[] = [
    { key: "jambes", label: "Jambes", icon: "footprints" },
    { key: "mollets", label: "Mollets", icon: "footprints" },
    { key: "fessiers", label: "Fessiers", icon: "activity" },
    { key: "dos", label: "Dos", icon: "mountain" },
    { key: "epaules", label: "Épaules", icon: "target" },
    { key: "bras", label: "Bras", icon: "dumbbell" },
    { key: "abdos", label: "Abdos", icon: "zap" },
    { key: "pecs", label: "Pectoraux", icon: "shield" },
    { key: "autre", label: "Autre", icon: "star" },
];

export function isMuscleGroupKey(value: string): value is MuscleGroupKey {
    return (MUSCLE_GROUP_KEYS as string[]).includes(value);
}

export function getMuscleGroupMeta(key: MuscleGroupKey): MuscleGroupMeta {
    return MUSCLE_GROUPS.find((g) => g.key === key) ?? MUSCLE_GROUPS[MUSCLE_GROUPS.length - 1];
}
