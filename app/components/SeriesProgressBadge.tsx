"use client";

import React from "react";
import type { SessionWorkStep } from "../exercises/types";

type SeriesProgressBadgeProps = {
    seriesIndex: number;
    seriesTotal: number;
    variant?: "default" | "compact";
    className?: string;
};

export function hasSeriesProgress(
    step: SessionWorkStep | null | undefined
): step is SessionWorkStep & { seriesIndex: number; seriesTotal: number } {
    if (!step || step.kind !== "work") return false;
    return (step.seriesTotal ?? 0) > 1 && (step.seriesIndex ?? 0) > 0;
}

export function SeriesProgressBadge({
    seriesIndex,
    seriesTotal,
    variant = "default",
    className = "",
}: SeriesProgressBadgeProps) {
    if (seriesTotal <= 1 || seriesIndex <= 0) return null;

    const label =
        variant === "compact"
            ? `${seriesIndex}/${seriesTotal}`
            : `Série ${seriesIndex}/${seriesTotal}`;

    return (
        <span
            className={`inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/95 tracking-wide ${className}`}
            data-testid="series-progress-badge"
        >
            {label}
        </span>
    );
}
