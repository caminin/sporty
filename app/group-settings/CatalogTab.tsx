'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Dumbbell, Plus, Timer, Trash2 } from 'lucide-react';
import type { ExerciseDefinition, ExerciseType, GlobalCatalog } from '../exercises/types';
import {
    addCatalogExercise,
    deleteCatalogExercise,
    getGlobalCatalog,
    updateCatalogExercise,
} from '../exercises/actions';
import { MUSCLE_GROUPS, type MuscleGroupKey } from '../exercises/muscle-groups';
import { renderIconByName } from '../exercises/icons';
import JsonImportExportPanel from './JsonImportExportPanel';
import { exportCatalogToJson } from '../exercises/workout-config';
import { importGlobalCatalogFromJson } from '../exercises/lists-actions';

type CatalogFormState = {
    name: string;
    type: ExerciseType;
    value: string;
    muscleGroup: MuscleGroupKey;
};

const DEFAULT_CATALOG_FORM: CatalogFormState = {
    name: '',
    type: 'reps',
    value: '',
    muscleGroup: 'jambes',
};

type ExercisesTabProps = {
    adminPassword: string;
};

export default function ExercisesTab({ adminPassword }: ExercisesTabProps) {
    const [catalog, setCatalog] = useState<GlobalCatalog | null>(null);
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<CatalogFormState>(DEFAULT_CATALOG_FORM);
    const [error, setError] = useState<string | null>(null);

    const loadCatalog = async () => {
        const c = await getGlobalCatalog();
        setCatalog(c);
    };

    useEffect(() => {
        loadCatalog();
    }, []);

    const exercisesByGroup = useMemo(() => {
        if (!catalog) return [];
        const map = new Map<MuscleGroupKey, ExerciseDefinition[]>();
        for (const meta of MUSCLE_GROUPS) {
            map.set(meta.key, []);
        }
        for (const def of Object.values(catalog.exercises)) {
            const list = map.get(def.muscleGroup) ?? map.get('autre')!;
            list.push(def);
        }
        return MUSCLE_GROUPS.map((meta) => ({
            meta,
            exercises: (map.get(meta.key) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'fr')),
        })).filter((section) => section.exercises.length > 0);
    }, [catalog]);

    const handleAdd = () => {
        const name = form.name.trim();
        const value = parseInt(form.value, 10);
        if (!name || isNaN(value) || value <= 0) return;

        startTransition(async () => {
            try {
                const updated = await addCatalogExercise({
                    name,
                    type: form.type,
                    value,
                    muscleGroup: form.muscleGroup,
                });
                setCatalog(updated);
                setForm(DEFAULT_CATALOG_FORM);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur');
            }
        });
    };

    const handleDelete = (exerciseId: string) => {
        if (!confirm('Supprimer cet exercice du catalogue ?')) return;
        startTransition(async () => {
            try {
                const updated = await deleteCatalogExercise(exerciseId);
                setCatalog(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur');
            }
        });
    };

    const persistCatalogUpdate = (
        exerciseId: string,
        updates: Partial<Pick<ExerciseDefinition, 'name' | 'type' | 'value' | 'muscleGroup'>>
    ) => {
        startTransition(async () => {
            try {
                const updated = await updateCatalogExercise(exerciseId, updates);
                setCatalog(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur');
            }
        });
    };

    const handleCatalogImport = async (json: string) => {
        const hasExercises = catalog && Object.keys(catalog.exercises).length > 0;
        let replaceAll = false;
        if (hasExercises) {
            replaceAll = confirm(
                'Supprimer tous les exercices du catalogue avant import ?\n\nOK = tout remplacer\nAnnuler = fusionner par id'
            );
        }
        const result = await importGlobalCatalogFromJson(json, adminPassword, { replaceAll });
        if (result.success) {
            await loadCatalog();
        }
        return result;
    };

    if (!catalog) {
        return (
            <div className="text-neutral-400 text-sm text-center py-8">Chargement du catalogue…</div>
        );
    }

    return (
        <div className="space-y-8">
            {exercisesByGroup.map(({ meta, exercises }) => (
                <section key={meta.key} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-9 h-9 bg-neutral-800 rounded-lg">
                            {renderIconByName(meta.icon, { className: 'w-5 h-5 text-[#13ec5b]' }) ?? (
                                <Dumbbell className="w-5 h-5 text-[#13ec5b]" />
                            )}
                        </div>
                        <h2 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                            {meta.label}
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {exercises.map((def) => (
                            <div
                                key={def.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700"
                            >
                                <div className="flex items-start gap-2 min-w-0 flex-1 sm:min-w-[12rem]">
                                    {def.type === 'time' ? (
                                        <Timer className="w-4 h-4 text-blue-400 shrink-0" />
                                    ) : (
                                        <Dumbbell className="w-4 h-4 text-orange-400 shrink-0" />
                                    )}
                                    <span className="text-sm font-medium break-words min-w-0 flex-1">{def.name}</span>
                                </div>
                                <select
                                    value={def.type}
                                    onChange={(e) =>
                                        persistCatalogUpdate(def.id, {
                                            type: e.target.value as ExerciseType,
                                        })
                                    }
                                    disabled={isPending}
                                    className="bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                >
                                    <option value="reps">Répétitions</option>
                                    <option value="time">Durée</option>
                                </select>
                                <input
                                    type="number"
                                    min={1}
                                    defaultValue={def.value}
                                    key={`${def.id}-${def.value}-${def.type}`}
                                    onBlur={(e) => {
                                        const value = parseInt(e.target.value, 10);
                                        if (!isNaN(value) && value > 0 && value !== def.value) {
                                            persistCatalogUpdate(def.id, { value });
                                        }
                                    }}
                                    disabled={isPending}
                                    className="w-20 bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                />
                                <select
                                    value={def.muscleGroup}
                                    onChange={(e) =>
                                        persistCatalogUpdate(def.id, {
                                            muscleGroup: e.target.value as MuscleGroupKey,
                                        })
                                    }
                                    disabled={isPending}
                                    className="bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                >
                                    {MUSCLE_GROUPS.map((g) => (
                                        <option key={g.key} value={g.key}>
                                            {g.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(def.id)}
                                    disabled={isPending}
                                    className="text-neutral-400 hover:text-red-500 p-1"
                                    aria-label={`Supprimer ${def.name}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {Object.keys(catalog.exercises).length === 0 && (
                <p className="text-sm text-neutral-500 italic text-center">Catalogue vide.</p>
            )}

            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider">
                    Ajouter un exercice
                </h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Nom de l'exercice"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                    />
                    <select
                        value={form.muscleGroup}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, muscleGroup: e.target.value as MuscleGroupKey }))
                        }
                        className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                    >
                        {MUSCLE_GROUPS.map((g) => (
                            <option key={g.key} value={g.key}>
                                {g.label}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-3">
                        <select
                            value={form.type}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, type: e.target.value as ExerciseType }))
                            }
                            className="bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                        >
                            <option value="reps">Répétitions</option>
                            <option value="time">Durée</option>
                        </select>
                        <input
                            type="number"
                            min={1}
                            placeholder="Valeur par défaut"
                            value={form.value}
                            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                            className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!form.name.trim() || !form.value || isPending}
                            className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black p-3 rounded-lg"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
            </div>

            <JsonImportExportPanel
                title="Import / export catalogue"
                description={
                    Object.keys(catalog.exercises).length > 0
                        ? 'À l\'import : remplacer tout le catalogue ou fusionner par id.'
                        : 'JSON avec « exercises » uniquement.'
                }
                exportDisabled={Object.keys(catalog.exercises).length === 0}
                onExport={() => exportCatalogToJson(catalog)}
                onImport={handleCatalogImport}
            />
        </div>
    );
}
