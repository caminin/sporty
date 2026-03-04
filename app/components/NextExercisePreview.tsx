"use client";

import React from "react";

interface NextExercisePreviewProps {
    exerciseName: string;
    group: string;
    className?: string;
}

export function NextExercisePreview({ exerciseName, group, className = "" }: NextExercisePreviewProps) {
    return (
        <div className={`text-center py-4 px-5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 ${className}`}>
            <div className="text-base text-white/80 font-semibold mb-2 tracking-wide uppercase">Suivant</div>
            <div className="text-2xl font-bold text-white mb-1">{exerciseName}</div>
            <div className="text-base text-white/70 font-medium">{group}</div>
        </div>
    );
}