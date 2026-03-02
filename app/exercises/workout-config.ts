import type { Exercise, WorkoutConfig, CustomGroup, Group } from "./types";

/**
 * Validates a Group object structure
 */
export function validateGroup(group: unknown, groupName: string): boolean {
    return (
        typeof group === "object" &&
        group !== null &&
        typeof (group as Group).id === "string" &&
        typeof (group as Group).name === "string" &&
        typeof (group as Group).icon === "string" &&
        typeof (group as Group).createdAt === "string" &&
        Array.isArray((group as Group).exercises) &&
        (group as Group).exercises.every(
            (exercise: unknown) =>
                typeof exercise === "object" &&
                exercise !== null &&
                typeof (exercise as Exercise).id === "string" &&
                typeof (exercise as Exercise).name === "string" &&
                ((exercise as Exercise).type === "time" ||
                    (exercise as Exercise).type === "reps") &&
                typeof (exercise as Exercise).value === "number"
        )
    );
}

/**
 * Migration function to convert old WorkoutConfig format to unified Group structure
 */
export function migrateWorkoutConfig(config: unknown): WorkoutConfig {
    const c = config as Record<string, unknown>;
    const groups = c?.groups as Record<string, unknown> | undefined;
    const customGroups = c?.customGroups as Record<string, CustomGroup> | undefined;

    const firstGroupValue = groups ? Object.values(groups)[0] : undefined;
    const alreadyMigrated =
        firstGroupValue &&
        typeof firstGroupValue === "object" &&
        firstGroupValue !== null &&
        "id" in firstGroupValue;

    if (alreadyMigrated) {
        Object.entries(groups || {}).forEach(([groupName, group]) => {
            if (!validateGroup(group, groupName)) {
                console.warn(
                    `Groupe '${groupName}' invalide détecté, il sera régénéré`
                );
            }
        });
        return config as WorkoutConfig;
    }

    const migratedGroups: Record<string, Group> = {};

    // Ne plus créer de groupes prédéfinis depuis l'ancien format
    if (customGroups) {
        Object.values(customGroups).forEach((customGroup) => {
            if (validateGroup(customGroup, customGroup.name)) {
                migratedGroups[customGroup.name] = customGroup;
            } else {
                console.error(
                    `Échec de validation du groupe personnalisé '${customGroup.name}'`
                );
            }
        });
    }

    return {
        globalRestTime: typeof c?.globalRestTime === 'number' ? c.globalRestTime : 15,
        groups: migratedGroups,
    };
}

/**
 * Exporte la configuration au format JSON (structure unifiée).
 * Compatible avec le chargement via migrateWorkoutConfig.
 */
export function exportWorkoutConfigToJson(config: WorkoutConfig): string {
    return JSON.stringify(config, null, 2);
}
