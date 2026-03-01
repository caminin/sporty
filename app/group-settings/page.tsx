'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { ArrowLeft, Clock, RotateCcw, Plus, Trash2, Dumbbell, Timer } from 'lucide-react';
import Link from 'next/link';
import type { Exercise, WorkoutConfig, ExerciseType } from '../workout-types';
import {
    getWorkoutConfig,
    addExercise,
    deleteExercise,
    updateGlobalRestTime,
} from '../exercises-actions';

type AddFormState = {
    name: string;
    type: ExerciseType;
    value: string;
};

const DEFAULT_FORM: AddFormState = { name: '', type: 'reps', value: '' };

export default function GroupSettingsPage() {
    const [config, setConfig] = useState<WorkoutConfig | null>(null);
    const [inputs, setInputs] = useState<Record<string, AddFormState>>({});
    const [restTime, setRestTime] = useState<string>('30');
    const [isPending, startTransition] = useTransition();
    const [savedRestTime, setSavedRestTime] = useState(false);

    useEffect(() => {
        getWorkoutConfig().then((c) => {
            setConfig(c);
            setRestTime(String(c.globalRestTime));
        });
    }, []);

    const handleAddExercise = (groupName: string) => {
        const form = inputs[groupName] || DEFAULT_FORM;
        const name = form.name.trim();
        const value = parseInt(form.value, 10);
        if (!name || isNaN(value) || value <= 0) return;

        startTransition(async () => {
            const updated = await addExercise(groupName, { name, type: form.type, value });
            setConfig(updated);
            setInputs((prev) => ({ ...prev, [groupName]: DEFAULT_FORM }));
        });
    };

    const handleDeleteExercise = (groupName: string, exerciseId: string) => {
        startTransition(async () => {
            const updated = await deleteExercise(groupName, exerciseId);
            setConfig(updated);
        });
    };

    const handleRestTimeSave = () => {
        const val = parseInt(restTime, 10);
        if (isNaN(val) || val < 0) return;
        startTransition(async () => {
            const updated = await updateGlobalRestTime(val);
            setConfig(updated);
            setSavedRestTime(true);
            setTimeout(() => setSavedRestTime(false), 2000);
        });
    };

    const updateInput = (groupName: string, partial: Partial<AddFormState>) => {
        setInputs((prev) => ({
            ...prev,
            [groupName]: { ...(prev[groupName] || DEFAULT_FORM), ...partial },
        }));
    };

    if (!config) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
                <div className="flex items-center gap-3 text-neutral-400">
                    <div className="w-5 h-5 border-2 border-neutral-600 border-t-[#13ec5b] rounded-full animate-spin" />
                    Chargement…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-lexend p-4 md:p-8 max-w-2xl mx-auto pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-800">
                <Link href="/" className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">Réglages des groupes</h1>
            </div>

            {/* Global Rest Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <RotateCcw className="w-5 h-5 text-[#13ec5b]" />
                    <h2 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                        Repos entre exercices
                    </h2>
                </div>
                <div className="flex gap-3 items-center">
                    <input
                        type="number"
                        min={0}
                        value={restTime}
                        onChange={(e) => setRestTime(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRestTimeSave()}
                        className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                        placeholder="Durée en secondes"
                    />
                    <span className="text-neutral-400 text-sm whitespace-nowrap">sec</span>
                    <button
                        onClick={handleRestTimeSave}
                        disabled={isPending}
                        className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                    >
                        {savedRestTime ? 'Sauvegardé ✓' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            {/* Groups */}
            <div className="space-y-8">
                {Object.entries(config.groups).map(([groupName, exercises]) => {
                    const form = inputs[groupName] || DEFAULT_FORM;
                    const valueLabel = form.type === 'time' ? 'Durée (sec)' : 'Répétitions';
                    return (
                        <div key={groupName} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                            <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider">{groupName}</h2>

                            {/* Exercise list */}
                            <div className="space-y-3 mb-6">
                                {exercises.length === 0 && (
                                    <p className="text-sm text-neutral-500 italic px-2">Aucun exercice dans ce groupe.</p>
                                )}
                                {exercises.map((exercise: Exercise) => (
                                    <div
                                        key={exercise.id}
                                        className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg border border-neutral-700 gap-3"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {exercise.type === 'time' ? (
                                                <Timer className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            ) : (
                                                <Dumbbell className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                            )}
                                            <span className="text-sm font-medium truncate">{exercise.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-xs text-neutral-400 bg-neutral-700 px-2 py-1 rounded">
                                                {exercise.type === 'time'
                                                    ? `${exercise.value}s`
                                                    : `${exercise.value} reps`}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteExercise(groupName, exercise.id)}
                                                disabled={isPending}
                                                className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                                aria-label="Supprimer l'exercice"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add exercise form */}
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder={`Nom de l'exercice…`}
                                    value={form.name}
                                    onChange={(e) => updateInput(groupName, { name: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddExercise(groupName)}
                                    className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                                />
                                <div className="flex gap-3">
                                    <select
                                        value={form.type}
                                        onChange={(e) => updateInput(groupName, { type: e.target.value as ExerciseType })}
                                        className="bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                                    >
                                        <option value="reps">Répétitions</option>
                                        <option value="time">Durée (temps)</option>
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder={valueLabel}
                                        value={form.value}
                                        onChange={(e) => updateInput(groupName, { value: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddExercise(groupName)}
                                        className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddExercise(groupName)}
                                        disabled={!form.name.trim() || !form.value || isPending}
                                        className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 disabled:hover:bg-[#13ec5b] text-black p-3 rounded-lg font-medium transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
