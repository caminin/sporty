"use client";

import React from "react";

interface NextExercisePreviewProps {
    exerciseName: string;
    group: string;
    className?: string;
}

export function NextExercisePreview({ exerciseName, group, className = "" }: NextExercisePreviewProps) {
    return (
        <div className={`text-center py-3 px-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 ${className}`}>
            <div className="text-sm text-white/80 font-semibold mb-2 tracking-wide uppercase">Suivant</div>
            <div className="text-lg font-bold text-white mb-1">{exerciseName}</div>
            <div className="text-sm text-white/70 font-medium">{group}</div>
        </div>
    );
}