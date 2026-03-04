"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Dumbbell } from "lucide-react";
import type { Exercise, WorkoutConfig } from "./exercises/types";
import { getWorkoutConfig } from "./exercises/actions";
import { buildSessionSteps, encodeSession, estimateSessionDuration, formatDuration, testBuildSessionSteps } from "./session-utils";
import { useExerciseList } from "./contexts/ExerciseListContext";
import { ExerciseListSelector } from "./components/ExerciseListSelector";
import { renderIconByName } from "./exercises/icons";

const STORAGE_KEY = "sporty_session_selection";

/** Visual config per group */
const GROUP_STYLES: Record<string, { icon: string; colorClass: string; borderClass: string }> = {
    "Cardio endurance": { icon: "favorite", colorClass: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", borderClass: "" },
    "Explosivité jambes": { icon: "bolt", colorClass: "bg-primary/10 text-primary", borderClass: "border-l-4 border-primary" },
    "Adbos": { icon: "fitness_center", colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", borderClass: "" },
    "Épaules et frappe": { icon: "sports_tennis", colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", borderClass: "" },
    "Agilité et déplacements": { icon: "directions_run", colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400", borderClass: "" },
};
const DEFAULT_STYLE = { icon: "accessibility_new", colorClass: "bg-slate-100 text-slate-600", borderClass: "" };

/* ─── localStorage helpers ───────────────────────────────────────────────── */

function loadSelection(config: WorkoutConfig): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return getAllIds(config);
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return getAllIds(config);
        const allIds = getAllIds(config);
        // Keep only IDs that still exist in the catalogue
        const valid = (parsed as string[]).filter((id) => allIds.has(id));
        return new Set(valid);
    } catch {
        return getAllIds(config);
    }
}

function getAllIds(config: WorkoutConfig): Set<string> {
    const ids = new Set<string>();
    for (const group of Object.values(config.groups)) {
        for (const ex of group.exercises) ids.add(ex.id);
    }
    return ids;
}

function saveSelection(selectedIds: Set<string>, config: WorkoutConfig) {
    // Only persist IDs that exist in the current catalogue (clean up stale IDs)
    const allIds = getAllIds(config);
    const toSave = [...selectedIds].filter((id) => allIds.has(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Header() {
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 px-5 py-4 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background-dark shadow-sm shadow-primary/20">
                    <span className="material-symbols-outlined">airport_shuttle</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight">Ma Séance</h1>
                    <p className="text-xs font-medium text-slate-500 dark:text-text-muted-dark">Entraînement à la maison</p>
                </div>
            </div>
            <Link
                href="/group-settings"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
                <span className="material-symbols-outlined">settings</span>
            </Link>
        </header>
    );
}

function IntensityControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">speed</span>
                    <h2 className="text-lg font-bold">Intensité Globale</h2>
                </div>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">x{value}</span>
            </div>
            <div className="relative mb-8 pt-2">
                <input
                    className="w-full bg-transparent appearance-none cursor-pointer focus:outline-none"
                    max="2" min="0.5" step="0.1" type="range"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                />
                <div className="mt-3 flex justify-between text-xs font-medium text-slate-400 dark:text-text-muted-dark px-1">
                    <span>0.5x</span><span>1x</span><span>1.5x</span><span>2x</span>
                </div>
            </div>
        </>
    );
}

function SessionSummary({ restTime, totalExercises, estimatedSeconds }: { restTime: number; totalExercises: number; estimatedSeconds: number }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-background-light dark:bg-background-dark p-4">
            <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-text-muted-dark">Exercices</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {totalExercises} <span className="text-sm font-normal">sélectionnés</span>
                </p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-text-muted-dark">Repos / Exo</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {restTime} <span className="text-sm font-normal">sec</span>
                </p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-text-muted-dark">Durée est.</p>
                <p className="text-xl font-bold text-primary">{formatDuration(estimatedSeconds)}</p>
            </div>
        </div>
    );
}

/* ─── Group block ─────────────────────────────────────────────────────────── */

function ExerciseGroupBlock({
    groupName,
    exercises,
    selectedIds,
    onToggle,
    isCustom = false,
    icon,
    intensity = 1.0,
}: {
    groupName: string;
    exercises: Exercise[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    isCustom?: boolean;
    icon?: string;
    intensity?: number;
}) {
    const style = GROUP_STYLES[groupName] || DEFAULT_STYLE;
    const selectedCount = exercises.filter((ex) => selectedIds.has(ex.id)).length;

    return (
        <div className={`overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${style.borderClass}`}>
            {/* Group header */}
            <div className={`flex items-center gap-3 px-4 py-3 ${isCustom ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : style.colorClass + ' bg-opacity-20'}`}>
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${isCustom ? 'bg-[#13ec5b]/20' : style.colorClass}`}>
                    {icon ? (
                        renderIconByName(icon, {
                            className: isCustom ? "w-5 h-5 text-[#13ec5b]" : "w-5 h-5"
                        }) || <Dumbbell className="w-5 h-5" />
                    ) : (
                        <span className="material-symbols-outlined text-base">{style.icon}</span>
                    )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{groupName}</h3>
                <span className="ml-auto text-xs font-medium text-slate-400 dark:text-text-muted-dark">
                    {selectedCount}/{exercises.length}
                </span>
            </div>

            {/* Exercises */}
            <div className="px-4 py-2">
                {exercises.length === 0 && (
                    <p className="py-3 text-sm italic text-slate-400 dark:text-text-muted-dark">Aucun exercice dans ce groupe.</p>
                )}
                {exercises.map((ex) => {
                    const isSelected = selectedIds.has(ex.id);
                    return (
                        <button
                            key={ex.id}
                            id={`toggle-exercise-${ex.id}`}
                            onClick={() => onToggle(ex.id)}
                            aria-pressed={isSelected}
                            aria-label={`${isSelected ? "Retirer" : "Ajouter"} ${ex.name}`}
                            className={`group w-full flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0 text-left transition-opacity ${isSelected ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            {/* Type icon */}
                            {ex.type === "time" ? (
                                <Clock className="w-4 h-4 flex-shrink-0 text-blue-400" aria-label="Exercice chronométré" />
                            ) : (
                                <Dumbbell className="w-4 h-4 flex-shrink-0 text-orange-400" aria-label="Exercice en répétitions" />
                            )}
                            <span className={`flex-1 text-sm font-medium transition-colors ${isSelected ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500 line-through"}`}>
                                {ex.name}
                            </span>
                            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-text-muted-dark">
                                {ex.type === "time" ? `${Math.round(ex.value * intensity)}s` : `${Math.round(ex.value * intensity)} reps`}
                            </span>
                            {/* Toggle indicator */}
                            <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                    ? "border-primary bg-primary"
                                    : "border-slate-300 dark:border-white/20 bg-transparent"
                                    }`}
                            >
                                {isSelected && (
                                    <svg className="w-3 h-3 text-background-dark" fill="none" viewBox="0 0 12 12">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    );
                })}
                <div className="pb-2" />
            </div>
        </div>
    );
}

function FloatingActionButton({
    config,
    selectedIds,
    intensity = 1.0,
}: {
    config: WorkoutConfig | null;
    selectedIds: Set<string>;
    intensity?: number;
}) {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLaunch = () => {
        if (!config) return;

        // Build a filtered config with only selected exercises
        const filteredGroups: WorkoutConfig["groups"] = {};
        for (const [groupName, group] of Object.entries(config.groups)) {
            const selected = group.exercises.filter((ex) => selectedIds.has(ex.id));
            if (selected.length > 0) {
                filteredGroups[groupName] = { ...group, exercises: selected };
            }
        }
        const filteredConfig: WorkoutConfig = { ...config, groups: filteredGroups };

        console.log("Debug: filteredConfig", filteredConfig);
        console.log("Debug: selectedIds", Array.from(selectedIds));
        console.log("Debug: config.groups keys", Object.keys(config.groups));

        const steps = buildSessionSteps(filteredConfig, intensity);
        console.log("Debug: steps", steps);

        if (steps.length === 0) {
            setErrorMsg("Aucun exercice sélectionné ! Cochez des exercices avant de lancer la séance.");
            setTimeout(() => setErrorMsg(null), 4000);
            return;
        }

        // Debug: vérifier que la première étape n'est pas un repos
        if (steps[0]?.kind === "rest") {
            console.error("BUG: La séance commence par un repos!", steps);
            setErrorMsg("Erreur technique: la séance commence par un repos. Contactez le support.");
            setTimeout(() => setErrorMsg(null), 4000);
            return;
        }
        const encoded = encodeSession(steps);
        router.push(`/timer?session=${encoded}`);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 p-4 pb-8">
            {errorMsg && (
                <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 text-center">
                    {errorMsg}
                </div>
            )}
            <button
                onClick={handleLaunch}
                disabled={!config}
                id="launch-session-btn"
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-background-dark shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:brightness-110 disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-2xl">play_arrow</span>
                Lancer la séance
            </button>
        </div>
    );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function BadmintonSessionPage() {
    const [config, setConfig] = useState<WorkoutConfig | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [intensity, setIntensity] = useState(1.0);
    const { selectedListId, setSelectedListId } = useExerciseList();

    useEffect(() => {
        // Test buildSessionSteps function
        testBuildSessionSteps();

        loadWorkoutConfig();
    }, [selectedListId]);

    const loadWorkoutConfig = async () => {
        try {
            const cfg = await getWorkoutConfig(selectedListId);
            setConfig(cfg);
            setSelectedIds(loadSelection(cfg));
        } catch (error) {
            console.error('Failed to load workout config:', error);
            // En cas d'erreur, essayer avec la liste par défaut
            if (selectedListId !== 'default') {
                try {
                    const defaultCfg = await getWorkoutConfig('default');
                    setConfig(defaultCfg);
                    setSelectedIds(loadSelection(defaultCfg));
                    setSelectedListId('default'); // Revenir à la liste par défaut
                } catch (defaultError) {
                    console.error('Failed to load default workout config:', defaultError);
                }
            }
        }
    };

    const handleToggle = (exerciseId: string) => {
        if (!config) return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(exerciseId)) {
                next.delete(exerciseId);
            } else {
                next.add(exerciseId);
            }
            saveSelection(next, config);
            return next;
        });
    };

    // Count only selected exercises for the summary
    const totalSelected = config
        ? Object.values(config.groups).reduce(
            (sum, group) => sum + group.exercises.filter((ex) => selectedIds.has(ex.id)).length,
            0
        )
        : 0;

    // Estimate session duration based on selected exercises and intensity
    const estimatedSeconds = config ? estimateSessionDuration(config, selectedIds, intensity) : 0;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-text-main-dark antialiased">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32">
                <Header />

                <main className="flex flex-col gap-6 p-5">
                    {/* Exercise List Selector */}
                    <section className="rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
                        <ExerciseListSelector
                            selectedListId={selectedListId}
                            onListChange={setSelectedListId}
                        />
                    </section>

                    {/* Intensity + Summary card */}
                    <section className="rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
                        <IntensityControl value={intensity} onChange={setIntensity} />
                        <SessionSummary
                            restTime={config?.globalRestTime ?? 30}
                            totalExercises={totalSelected}
                            estimatedSeconds={estimatedSeconds}
                        />
                    </section>

                    {/* Exercise groups */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Séquence du jour</h2>
                            <span className="text-sm font-medium text-slate-500 dark:text-text-muted-dark">
                                {config ? Object.keys(config.groups).length : 0} groupes
                            </span>
                        </div>

                        {!config ? (
                            <div className="flex items-center justify-center py-16 text-slate-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-slate-300 dark:border-white/20 border-t-primary rounded-full animate-spin" />
                                    <span className="text-sm">Chargement…</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {Object.entries(config.groups).map(([groupName, group]) => (
                                    <ExerciseGroupBlock
                                        key={groupName}
                                        groupName={groupName}
                                        exercises={group.exercises}
                                        selectedIds={selectedIds}
                                        onToggle={handleToggle}
                                        isCustom={group.id.startsWith("custom_")}
                                        icon={group.icon}
                                        intensity={intensity}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <FloatingActionButton config={config} selectedIds={selectedIds} intensity={intensity} />
            </div>
        </div>
    );
}
