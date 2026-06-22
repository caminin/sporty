"use client";

import React from "react";
import { SeriesProgressBadge } from "./SeriesProgressBadge";

interface NextExercisePreviewProps {
    exerciseName: string;
    group: string;
    seriesIndex?: number;
    seriesTotal?: number;
    isNextSeriesOfSameExercise?: boolean;
    className?: string;
}

export function NextExercisePreview({
    exerciseName,
    group,
    seriesIndex,
    seriesTotal,
    isNextSeriesOfSameExercise = false,
    className = "",
}: NextExercisePreviewProps) {
    const showSeriesContinuation =
        isNextSeriesOfSameExercise &&
        seriesIndex !== undefined &&
        seriesTotal !== undefined &&
        seriesTotal > 1;

    return (
        <div
            className={`text-center py-4 px-5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 max-w-md mx-auto ${className}`}
        >
            <div className="text-base text-white/80 font-semibold mb-2 tracking-wide uppercase">
                {showSeriesContinuation ? "Série suivante" : "Suivant"}
            </div>
            {showSeriesContinuation ? (
                <>
                    <div className="flex justify-center mb-2">
                        <SeriesProgressBadge
                            seriesIndex={seriesIndex}
                            seriesTotal={seriesTotal}
                            className="text-base px-4 py-1.5"
                        />
                    </div>
                    <div className="text-lg text-white/80 font-medium">{exerciseName}</div>
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold text-white mb-1 break-words">{exerciseName}</div>
                    <div className="text-base text-white/70 font-medium">{group}</div>
                </>
            )}
        </div>
    );
}
