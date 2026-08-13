"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Dumbbell } from "lucide-react";
import type { ResolvedExercise, WorkoutView } from "./exercises/types";
import { getWorkoutView } from "./exercises/actions";
import { placementsByMuscleGroup } from "./exercises/workout-config";
import { buildSessionSteps, encodeSession, estimateSessionDuration, formatDuration, testBuildSessionSteps } from "./session-utils";
import { useExerciseList } from "./contexts/ExerciseListContext";
import { ExerciseListSelector } from "./components/ExerciseListSelector";
import { renderIconByName } from "./exercises/icons";
import { GROUP_COLOR_STYLES, isGroupColorKey } from "./exercises/group-colors";
import { getMuscleGroupColor } from "./exercises/muscle-groups";
import type { MuscleGroupKey } from "./exercises/muscle-groups";
import { loadSelection, saveSelection } from "./session-selection-storage";

const DEFAULT_STYLE = { colorClass: "bg-slate-100 text-slate-600", borderClass: "" };

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
    color,
}: {
    groupName: string;
    exercises: ResolvedExercise[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    isCustom?: boolean;
    icon?: string;
    color?: string;
}) {
    const style = color && isGroupColorKey(color) ? GROUP_COLOR_STYLES[color] : DEFAULT_STYLE;
    const selectedCount = exercises.filter((ex) => selectedIds.has(ex.refId)).length;

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
                        <Dumbbell className="w-5 h-5" />
                    )}
                </div>
                <h3 className={`font-bold ${isCustom ? "" : "text-inherit"}`}>{groupName}</h3>
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
                    const isSelected = selectedIds.has(ex.refId);
                    return (
                        <button
                            key={ex.refId}
                            id={`toggle-exercise-${ex.refId}`}
                            onClick={() => onToggle(ex.refId)}
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
                                {ex.type === "time" ? `${ex.value}s` : `${ex.value} reps`}
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
    view,
    selectedIds,
}: {
    view: WorkoutView | null;
    selectedIds: Set<string>;
}) {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLaunch = () => {
        if (!view) return;

        const filteredView: WorkoutView = {
            ...view,
            exerciseRefs: view.exerciseRefs.filter((ref) => selectedIds.has(ref.refId)),
        };

        const steps = buildSessionSteps(filteredView);

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
                disabled={!view}
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
    const [view, setView] = useState<WorkoutView | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const { selectedListId, setSelectedListId } = useExerciseList();

    useEffect(() => {
        testBuildSessionSteps();
        loadWorkoutView();
    }, [selectedListId]);

    const loadWorkoutView = async () => {
        if (!selectedListId) {
            setView(null);
            setSelectedIds(new Set());
            return;
        }

        try {
            const cfg = await getWorkoutView(selectedListId);
            setView(cfg);
            setSelectedIds(loadSelection(selectedListId, cfg));
        } catch (error) {
            console.error('Failed to load workout view:', error);
            setView(null);
        }
    };

    const handleToggle = (refId: string) => {
        if (!view) return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(refId)) {
                next.delete(refId);
            } else {
                next.add(refId);
            }
            saveSelection(selectedListId, next, view);
            return next;
        });
    };

    const totalSelected = view
        ? view.exerciseRefs.filter((ref) => selectedIds.has(ref.refId)).length
        : 0;

    const estimatedSeconds = view ? estimateSessionDuration(view, selectedIds) : 0;

    const muscleSections =
        view && view.exerciseRefs.length > 0
            ? placementsByMuscleGroup(
                  { exercises: view.exercises },
                  view.exerciseRefs
              )
            : [];

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

                    <section className="rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
                        <SessionSummary
                            restTime={view?.globalRestTime ?? 30}
                            totalExercises={totalSelected}
                            estimatedSeconds={estimatedSeconds}
                        />
                    </section>

                    {/* Exercise groups */}
                    <section>
                        {!selectedListId && (
                            <div className="flex flex-col items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-6 text-center text-sm text-amber-700 dark:text-amber-200">
                                <span className="material-symbols-outlined text-2xl">info</span>
                                <p className="font-semibold">Aucun entraînement sélectionné</p>
                                <p className="text-xs text-amber-600 dark:text-amber-300/90">Choisissez un entraînement dans le sélecteur ci-dessus.</p>
                            </div>
                        )}

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Séquence du jour</h2>
                            <span className="text-sm font-medium text-slate-500 dark:text-text-muted-dark">
                                {muscleSections.length} groupes musculaires
                            </span>
                        </div>

                        {!view ? (
                            <div className="flex items-center justify-center py-16 text-slate-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-slate-300 dark:border-white/20 border-t-primary rounded-full animate-spin" />
                                    <span className="text-sm">Chargement…</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {muscleSections.map(({ meta, placements }) => (
                                    <ExerciseGroupBlock
                                        key={meta.key}
                                        groupName={meta.label}
                                        exercises={placements.map((p) => p.resolved)}
                                        selectedIds={selectedIds}
                                        onToggle={handleToggle}
                                        icon={meta.icon}
                                        color={getMuscleGroupColor(meta.key as MuscleGroupKey)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <FloatingActionButton view={view} selectedIds={selectedIds} />
            </div>
        </div>
    );
}
