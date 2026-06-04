import type { GroupColorKey } from "./types";

export type MuscleGroupKey =
    | "jambes"
    | "mollets"
    | "epaules"
    | "bras"
    | "abdos"
    | "pecs"
    | "autre";

/** Legacy keys normalized to `autre` on import. */
export const REMOVED_MUSCLE_GROUP_KEYS = ["fessiers", "dos"] as const;

export const DEFAULT_MUSCLE_GROUP: MuscleGroupKey = "autre";

export const MUSCLE_GROUP_KEYS: MuscleGroupKey[] = [
    "jambes",
    "mollets",
    "epaules",
    "bras",
    "abdos",
    "pecs",
    "autre",
];

export const MUSCLE_GROUP_COLORS: Record<MuscleGroupKey, GroupColorKey> = {
    jambes: "orange",
    mollets: "cyan",
    epaules: "purple",
    bras: "emerald",
    abdos: "yellow",
    pecs: "red",
    autre: "blue",
};

export interface MuscleGroupMeta {
    key: MuscleGroupKey;
    label: string;
    icon: string;
}

export const MUSCLE_GROUPS: MuscleGroupMeta[] = [
    { key: "jambes", label: "Jambes", icon: "footprints" },
    { key: "mollets", label: "Mollets", icon: "footprints" },
    { key: "epaules", label: "Épaules", icon: "target" },
    { key: "bras", label: "Bras", icon: "dumbbell" },
    { key: "abdos", label: "Abdos", icon: "zap" },
    { key: "pecs", label: "Pectoraux", icon: "shield" },
    { key: "autre", label: "Autre", icon: "star" },
];

export function isMuscleGroupKey(value: string): value is MuscleGroupKey {
    return (MUSCLE_GROUP_KEYS as string[]).includes(value);
}

export function normalizeMuscleGroup(raw: unknown): MuscleGroupKey {
    if (typeof raw === "string") {
        if ((REMOVED_MUSCLE_GROUP_KEYS as readonly string[]).includes(raw)) {
            return DEFAULT_MUSCLE_GROUP;
        }
        if (isMuscleGroupKey(raw)) return raw;
    }
    return DEFAULT_MUSCLE_GROUP;
}

export function getMuscleGroupColor(key: MuscleGroupKey): GroupColorKey {
    return MUSCLE_GROUP_COLORS[key];
}

export function getMuscleGroupMeta(key: MuscleGroupKey): MuscleGroupMeta {
    return MUSCLE_GROUPS.find((g) => g.key === key) ?? MUSCLE_GROUPS[MUSCLE_GROUPS.length - 1];
}
