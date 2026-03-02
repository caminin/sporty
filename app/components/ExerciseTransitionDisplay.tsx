"use client";

import React from "react";
import { ExerciseGroupBadge } from "./ExerciseGroupBadge";

interface ExerciseTransitionDisplayProps {
    exerciseName: string;
    group: string;
    countdown: number;
    onSkip?: () => void;
    onQuit?: () => void;
}

export function ExerciseTransitionDisplay({
    exerciseName,
    group,
    countdown,
    onSkip,
    onQuit
}: ExerciseTransitionDisplayProps) {
    return (
        <div className="h-screen flex flex-col items-center justify-center w-full px-4 overflow-hidden relative bg-orange-500 text-white font-display antialiased">
            {/* Header */}
            <div className="flex items-center justify-between w-full p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-white/90 text-sm font-semibold tracking-wider uppercase">
                        Chrono Entraînement
                    </h2>
                    <span className="text-white/70 text-xs">Préparation</span>
                </div>
                {onQuit && (
                    <button
                        onClick={onQuit}
                        className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors size-10 backdrop-blur-sm"
                        aria-label="Quitter la séance"
                    >
                        <span className="material-symbols-outlined text-2xl text-white">close</span>
                    </button>
                )}
            </div>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center w-full overflow-hidden relative">
                <div className="text-center z-10 w-full mb-8">
                    <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md mb-4">
                        Préparez-vous !
                    </h1>
                    <div className="text-white/80 text-lg mb-6">
                        Prochain exercice dans...
                    </div>
                </div>

                {/* Countdown timer */}
                <div className="flex justify-center items-center py-2 z-10 w-full mb-8">
                    <div className="tabular-nums font-black text-[12rem] sm:text-[16rem] leading-none tracking-tighter drop-shadow-lg select-none">
                        {countdown}
                    </div>
                </div>

                <div className="text-white/60 text-xl font-medium uppercase tracking-[0.2em] mb-8">
                    seconde{countdown > 1 ? "s" : ""}
                </div>

                {/* Next exercise info */}
                <div className="text-center z-10 w-full mb-8">
                    <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md mb-4">
                        {exerciseName}
                    </h2>
                    <div className="mt-2">
                        <ExerciseGroupBadge group={group} />
                    </div>
                </div>

                {/* Background icon */}
                <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[30rem]">
                        timer
                    </span>
                </div>
            </main>

            {/* Footer controls */}
            <footer className="w-full px-8 pb-12 pt-4 z-20">
                <div className="flex items-center justify-center max-w-sm mx-auto w-full">
                    <button
                        onClick={onSkip}
                        className="flex-1 h-20 rounded-2xl bg-black/20 text-white backdrop-blur-md border border-white/20 hover:bg-black/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-xl font-bold uppercase tracking-wide">Passer</span>
                        <span className="material-symbols-outlined text-3xl">skip_next</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}