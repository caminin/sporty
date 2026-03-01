"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { SessionStep, SessionState } from "../workout-types";
import { decodeSession } from "../session-utils";
import { ExerciseGroupBadge } from "../components/ExerciseGroupBadge";
import { NextExercisePreview } from "../components/NextExercisePreview";

/* ─── Inner component (needs Suspense for useSearchParams) ────────────────── */

function TimerInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // ── Decode the session from URL ──────────────────────────────────────
    const [steps, setSteps] = useState<SessionStep[] | null>(null);
    const [decodeError, setDecodeError] = useState(false);

    useEffect(() => {
        const encoded = searchParams.get("session");
        if (!encoded) {
            setDecodeError(true);
            return;
        }
        const decoded = decodeSession(encoded);
        if (!decoded || decoded.length === 0) {
            setDecodeError(true);
            return;
        }
        console.log("Timer: decoded steps", decoded);
        console.log("Timer: first step", decoded[0]);
        console.log("Timer: first step kind", decoded[0]?.kind);
        setSteps(decoded);
    }, [searchParams]);

    // ── Session state ────────────────────────────────────────────────────
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [sessionState, setSessionState] = useState<SessionState>("running");
    // Initialize timeLeft based on the first step when steps are available
    const initialTimeLeft = useMemo(() => {
        if (!steps || steps.length === 0) return 0;
        const firstStep = steps[0];
        if (firstStep.kind === "work" && firstStep.type === "time") {
            return firstStep.duration;
        } else if (firstStep.kind === "rest") {
            return firstStep.duration;
        }
        return 0; // For reps steps, timeLeft is unused
    }, [steps]);

    const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    const currentStep = steps ? steps[currentStepIndex] : null;

    // Log first exercise when session starts
    useEffect(() => {
        if (steps && steps.length > 0 && currentStepIndex === 0) {
            const firstStep = steps[0];
            if (firstStep.kind === "work") {
                const timing = firstStep.type === "time"
                    ? `${firstStep.duration}s`
                    : `${firstStep.reps} reps`;
                console.log(`🚀 Début de la session - Premier exercice: ${firstStep.name} (${firstStep.group}) - ${timing}`);
            } else {
                console.log(`🚀 Début de la session - Premier repos: ${firstStep.duration}s`);
            }
        }
    }, [steps, currentStepIndex]);

    // Count of "work" steps only (for progress display)
    const totalWorkSteps = steps ? steps.filter(s => s.kind === "work").length : 0;
    const completedWorkSteps = steps
        ? steps.slice(0, currentStepIndex).filter(s => s.kind === "work").length
        : 0;

    // Find next work step for preview
    const nextWorkStep = steps ? steps.slice(currentStepIndex + 1).find(s => s.kind === "work") : null;

    // Initialise timeLeft whenever the step changes (but skip first step since it's handled by initial state)
    useEffect(() => {
        if (!currentStep || currentStepIndex === 0) return;

        // Normal step transitions (not the first step)
        if (currentStep.kind === "work" && currentStep.type === "time") {
            console.log(`⏱️ Setting timeLeft to ${currentStep.duration}s for ${currentStep.name}`);
            setTimeLeft(currentStep.duration);
        } else if (currentStep.kind === "rest") {
            console.log(`⏱️ Setting timeLeft to ${currentStep.duration}s for rest`);
            setTimeLeft(currentStep.duration);
        }
        // For reps steps, timeLeft is unused
    }, [currentStep, currentStepIndex]);

    // ── Audio functions ──────────────────────────────────────────────────
    const playBeep = useCallback(() => {
        if (!isAudioEnabled) return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency in Hz
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.warn("Audio playback failed:", error);
        }
    }, [isAudioEnabled]);

    // ── Advance to next step ─────────────────────────────────────────────
    const advanceStep = useCallback(() => {
        if (!steps) return;

        console.log(`🔄 advanceStep called: currentStepIndex=${currentStepIndex}, currentStep=${currentStep?.name || 'rest'}`);

        // Play beep sound when advancing to next step
        playBeep();

        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= steps.length) {
            console.log("🏁 Session terminée");
            setSessionState("finished");
        } else {
            const nextStep = steps[nextIndex];
            if (nextStep.kind === "work") {
                const timing = nextStep.type === "time"
                    ? `${nextStep.duration}s`
                    : `${nextStep.reps} reps`;
                console.log(`💪 Début de l'exercice: ${nextStep.name} (${nextStep.group}) - ${timing}`);
            } else {
                console.log(`⏰ Début du repos: ${nextStep.duration}s`);
            }
            console.log(`🔄 Setting currentStepIndex to ${nextIndex}`);
            setCurrentStepIndex(nextIndex);
            setSessionState("running");
        }
    }, [currentStepIndex, steps, playBeep, currentStep]);

    // ── Countdown timer (only for time-based steps) ──────────────────────
    useEffect(() => {
        if (!currentStep) return;
        const isTimeBased =
            (currentStep.kind === "work" && currentStep.type === "time") ||
            currentStep.kind === "rest";

        if (!isTimeBased) return;
        if (sessionState !== "running") return;

        console.log(`⏳ Timer check: ${currentStep.name || 'rest'} - timeLeft=${timeLeft}, isTimeBased=${isTimeBased}, sessionState=${sessionState}`);

        if (timeLeft <= 0) {
            console.log(`⏳ Time is up for ${currentStep.name || 'rest'}, advancing...`);
            // Use setTimeout to avoid immediate recursion
            const timeoutId = setTimeout(() => {
                advanceStep();
            }, 0);
            return () => clearTimeout(timeoutId);
        }

        console.log(`⏳ Starting countdown for ${currentStep.name || 'rest'}: ${timeLeft}s`);
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                console.log(`⏳ Tick: ${newTime}s remaining`);
                if (newTime <= 0) {
                    console.log(`⏳ Countdown reached 0, scheduling advance...`);
                    // Schedule advanceStep for next tick to avoid state update conflicts
                    setTimeout(() => {
                        advanceStep();
                    }, 0);
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => {
            console.log(`⏳ Clearing countdown interval`);
            clearInterval(interval);
        };
    }, [timeLeft, sessionState, currentStep]);

    // ── Controls ─────────────────────────────────────────────────────────
    const handleSkip = () => {
        advanceStep();
    };

    const handleTogglePause = () => {
        setSessionState(prev => prev === "running" ? "paused" : "running");
    };

    const handleValidateReps = () => {
        playBeep();
        advanceStep();
    };

    const handleReplay = () => {
        setCurrentStepIndex(0);
        setSessionState("running");
    };

    const handleFinish = () => {
        router.push("/");
    };

    // ── Error state ──────────────────────────────────────────────────────
    if (decodeError) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 px-8 text-center">
                <span className="material-symbols-outlined text-6xl text-red-400">error</span>
                <h1 className="text-2xl font-bold">Aucune séance configurée</h1>
                <p className="text-white/60 text-base">Lance d&apos;abord ta séance depuis la page d&apos;accueil.</p>
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-6 py-3 text-base font-semibold transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Retour à l&apos;accueil
                </button>
            </div>
        );
    }

    if (!steps || !currentStep) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // ── Visual style based on step kind ─────────────────────────────────
    const isRest = currentStep.kind === "rest";
    const isWork = currentStep.kind === "work";
    const isReps = isWork && currentStep.type === "reps";

    const bgColorClass = isRest ? "bg-blue-600" : "bg-emerald-500";
    const phaseLabel = isRest ? "Phase de repos" : "Work Interval";
    const exerciseName = isWork ? currentStep.name : "Repos";
    const groupName = isWork ? currentStep.group : "Prépare-toi pour la suite";

    // ── Finished screen ──────────────────────────────────────────────────
    if (sessionState === "finished") {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-8 px-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                            emoji_events
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Séance terminée ! 🎉</h1>
                    <p className="text-white/60 text-lg">
                        {totalWorkSteps} exercice{totalWorkSteps > 1 ? "s" : ""} complété{totalWorkSteps > 1 ? "s" : ""}
                    </p>
                </div>

                <p className="text-xl font-semibold text-white/80">Refaire une autre boucle ?</p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={handleReplay}
                        id="replay-btn"
                        className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25"
                    >
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>replay</span>
                        Oui, refaire !
                    </button>
                    <button
                        onClick={handleFinish}
                        id="finish-btn"
                        className="w-full h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
                    >
                        <span className="material-symbols-outlined text-2xl">home</span>
                        Terminer
                    </button>
                </div>
            </div>
        );
    }

    // ── Timer display value ──────────────────────────────────────────────
    const timerDisplay = isReps
        ? (currentStep as Extract<SessionStep, { kind: "work"; type: "reps" }>).reps
        : timeLeft;

    const timerSuffix = isReps ? "reps" : "sec";


    // ── Progress numbers ─────────────────────────────────────────────────
    const displayedWorkStep = completedWorkSteps + (isWork ? 1 : 0);

    return (
        <div
            className={`${bgColorClass} text-white font-display antialiased overflow-hidden h-screen flex flex-col transition-colors duration-500 ease-in-out`}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-white/90 text-sm font-semibold tracking-wider uppercase">
                        Chrono Entraînement
                    </h2>
                    <span className="text-white/70 text-xs">{phaseLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Progress indicator */}
                    <span className="text-white/80 text-sm font-bold bg-white/10 rounded-full px-3 py-1">
                        {isWork ? `${displayedWorkStep} / ${totalWorkSteps}` : "Repos"}
                    </span>
                    <button
                        onClick={() => setIsAudioEnabled(a => !a)}
                        className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors size-10 backdrop-blur-sm"
                        aria-label="Basculer le son"
                    >
                        <span className="material-symbols-outlined text-2xl text-white">
                            {isAudioEnabled ? "volume_up" : "volume_off"}
                        </span>
                    </button>
                </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="w-full px-6">
                <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                    <div
                        className="h-full bg-white/80 rounded-full transition-all duration-500"
                        style={{ width: `${totalWorkSteps > 0 ? (completedWorkSteps / totalWorkSteps) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* ── Main content ── */}
            <main className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden relative">
                <div className="text-center z-10 w-full mb-4">
                    <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                        {exerciseName}
                    </h1>
                    {isWork && (
                        <div className="mt-2">
                            <ExerciseGroupBadge group={currentStep.group} />
                        </div>
                    )}
                </div>

                <div className="flex justify-center items-center py-2 z-10 w-full">
                    <div className="tabular-nums font-black text-[10rem] sm:text-[14rem] leading-none tracking-tighter drop-shadow-lg select-none">
                        {timerDisplay}
                    </div>
                </div>
                <p className="text-white/60 text-lg font-medium uppercase tracking-[0.2em] mb-8">
                    {timerSuffix}
                </p>

                {/* Next exercise preview */}
                {nextWorkStep && (
                    <div className="mt-4">
                        <NextExercisePreview
                            exerciseName={nextWorkStep.name}
                            group={nextWorkStep.group}
                        />
                    </div>
                )}

                {/* Background icon */}
                <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[30rem]">
                        {isRest ? "hourglass_top" : isReps ? "fitness_center" : "timer"}
                    </span>
                </div>
            </main>

            {/* ── Footer controls ── */}
            <footer className="w-full px-8 pb-12 pt-4 z-20">
                {isReps ? (
                    /* Validate button for reps exercises */
                    <div className="flex items-center justify-center max-w-sm mx-auto w-full">
                        <button
                            onClick={handleValidateReps}
                            id="validate-reps-btn"
                            className="flex-1 h-20 rounded-2xl bg-white text-emerald-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <span
                                className="material-symbols-outlined text-3xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                check_circle
                            </span>
                            <span className="text-xl font-bold uppercase tracking-wide">Terminé !</span>
                        </button>
                    </div>
                ) : (
                    /* Stop + Skip buttons for timed steps */
                    <div className="flex items-center justify-center gap-6 max-w-sm mx-auto w-full">
                        <button
                            onClick={handleTogglePause}
                            id="pause-resume-btn"
                            className={`flex-1 h-20 rounded-2xl bg-white hover:bg-gray-100 ${isRest ? "text-blue-600" : "text-emerald-600"} active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2`}
                        >
                            <span
                                className="material-symbols-outlined text-3xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                {sessionState === "running" ? "pause_circle" : "play_circle"}
                            </span>
                            <span className="text-xl font-bold uppercase tracking-wide">
                                {sessionState === "running" ? "Pause" : "Reprendre"}
                            </span>
                        </button>
                        <button
                            onClick={handleSkip}
                            id="skip-btn"
                            className="flex-1 h-20 rounded-2xl bg-black/20 text-white backdrop-blur-md border border-white/20 hover:bg-black/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="text-xl font-bold uppercase tracking-wide">Passer</span>
                            <span className="material-symbols-outlined text-3xl">skip_next</span>
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
}

/* ─── Page wrapper with Suspense for useSearchParams ─────────────────────── */

export default function TimerPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <TimerInner />
        </Suspense>
    );
}
