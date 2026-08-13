import type { WorkoutView } from "./exercises/types";

export const SESSION_SELECTION_STORAGE_KEY = "sporty_session_selection";

type SelectionStore = Record<string, string[]>;

function getAllRefIds(view: WorkoutView): Set<string> {
    return new Set(view.exerciseRefs.map((ref) => ref.refId));
}

function parseStore(raw: string | null): SelectionStore {
    if (!raw) return {};
    try {
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
        const store: SelectionStore = {};
        for (const [listId, value] of Object.entries(parsed)) {
            if (Array.isArray(value) && value.every((id) => typeof id === "string")) {
                store[listId] = value;
            }
        }
        return store;
    } catch {
        return {};
    }
}

export function loadSelection(listId: string, view: WorkoutView): Set<string> {
    const store = parseStore(
        typeof localStorage !== "undefined" ? localStorage.getItem(SESSION_SELECTION_STORAGE_KEY) : null
    );
    const allIds = getAllRefIds(view);
    const saved = store[listId];
    if (!saved) return allIds;
    return new Set(saved.filter((id) => allIds.has(id)));
}

export function saveSelection(listId: string, selectedIds: Set<string>, view: WorkoutView): void {
    if (typeof localStorage === "undefined") return;
    const store = parseStore(localStorage.getItem(SESSION_SELECTION_STORAGE_KEY));
    const allIds = getAllRefIds(view);
    store[listId] = [...selectedIds].filter((id) => allIds.has(id));
    localStorage.setItem(SESSION_SELECTION_STORAGE_KEY, JSON.stringify(store));
}
