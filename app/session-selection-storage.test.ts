import type { WorkoutView } from "./exercises/types";
import {
    SESSION_SELECTION_STORAGE_KEY,
    loadSelection,
    saveSelection,
} from "./session-selection-storage";

const storage = new Map<string, string>();

function createView(refIds: string[]): WorkoutView {
    const exercises: WorkoutView["exercises"] = {};
    const exerciseRefs = refIds.map((refId) => {
        exercises[refId] = {
            id: refId,
            name: refId,
            type: "reps",
            value: 10,
            muscleGroup: "jambes",
        };
        return { refId, exerciseId: refId };
    });
    return { globalRestTime: 30, exercises, exerciseRefs };
}

describe("session-selection-storage", () => {
    beforeEach(() => {
        storage.clear();
        Object.defineProperty(globalThis, "localStorage", {
            value: {
                getItem: (key: string) => storage.get(key) ?? null,
                setItem: (key: string, value: string) => {
                    storage.set(key, value);
                },
                removeItem: (key: string) => {
                    storage.delete(key);
                },
                clear: () => {
                    storage.clear();
                },
            },
            configurable: true,
        });
    });

    it("returns all exercises when no saved selection exists", () => {
        const view = createView(["a", "b"]);
        expect(loadSelection("training-a", view)).toEqual(new Set(["a", "b"]));
    });

    it("keeps independent selections per training", () => {
        const viewA = createView(["a1", "a2"]);
        const viewB = createView(["b1", "b2"]);

        saveSelection("training-a", new Set(["a1"]), viewA);
        saveSelection("training-b", new Set(["b2"]), viewB);

        expect(loadSelection("training-a", viewA)).toEqual(new Set(["a1"]));
        expect(loadSelection("training-b", viewB)).toEqual(new Set(["b2"]));
    });

    it("ignores legacy flat array format without throwing", () => {
        localStorage.setItem(SESSION_SELECTION_STORAGE_KEY, JSON.stringify(["a1"]));
        const view = createView(["a1", "a2"]);
        expect(loadSelection("training-a", view)).toEqual(new Set(["a1", "a2"]));
    });

    it("filters invalid ref ids on load and save", () => {
        const view = createView(["a1", "a2"]);
        localStorage.setItem(
            SESSION_SELECTION_STORAGE_KEY,
            JSON.stringify({ "training-a": ["a1", "removed"] })
        );

        expect(loadSelection("training-a", view)).toEqual(new Set(["a1"]));

        saveSelection("training-a", new Set(["a2", "removed"]), view);
        const stored = JSON.parse(localStorage.getItem(SESSION_SELECTION_STORAGE_KEY) ?? "{}");
        expect(stored["training-a"]).toEqual(["a2"]);
    });
});
