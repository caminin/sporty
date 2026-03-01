"use client";

import React from "react";

interface ExerciseGroupBadgeProps {
    group: string;
    className?: string;
}

export function ExerciseGroupBadge({ group, className = "" }: ExerciseGroupBadgeProps) {
    return (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ${className}`}>
            {group}
        </div>
    );
}