"use client";

import React from "react";

interface NextExercisePreviewProps {
    exerciseName: string;
    group: string;
    className?: string;
}

export function NextExercisePreview({ exerciseName, group, className = "" }: NextExercisePreviewProps) {
    return (
        <div className={`text-center py-2 ${className}`}>
            <div className="text-sm text-gray-600 mb-1">Suivant</div>
            <div className="text-base font-medium text-gray-900">{exerciseName}</div>
            <div className="text-xs text-gray-500">{group}</div>
        </div>
    );
}