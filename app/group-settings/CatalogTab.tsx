'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Dumbbell, List, Plus, Timer, Trash2 } from 'lucide-react';
import type { ExerciseListMetadata } from '../exercises/lists';
import type { ExerciseDefinition, ExerciseType, WorkoutConfig } from '../exercises/types';
import {
    addCatalogExercise,
    deleteCatalogExercise,
    updateCatalogExercise,
} from '../exercises/actions';
import { MUSCLE_GROUPS, type MuscleGroupKey } from '../exercises/muscle-groups';
import { renderIconByName } from '../exercises/icons';
import ListSelector from './ListSelector';
import JsonImportExportPanel from './JsonImportExportPanel';
import { exportCatalogToJson } from '../exercises/workout-config';
import { importCatalogFromJson, getExerciseList } from '../exercises/lists-actions';

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

type CatalogTabProps = {
    lists: ExerciseListMetadata[];
    selectedListId: string;
    currentListName?: string;
    config: WorkoutConfig | null;
    adminPassword: string;
    onListSelect: (listId: string) => void;
    onConfigChange: (config: WorkoutConfig) => void;
    onListImported: (listId: string) => void;
};

export default function CatalogTab({
    lists,
    selectedListId,
    currentListName,
    config,
    adminPassword,
    onListSelect,
    onConfigChange,
    onListImported,
}: CatalogTabProps) {
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<CatalogFormState>(DEFAULT_CATALOG_FORM);
    const [error, setError] = useState<string | null>(null);
    const [importListName, setImportListName] = useState('');

    const exercisesByGroup = useMemo(() => {
        if (!config) return [];
        const map = new Map<MuscleGroupKey, typeof config.exercises[string][]>();
        for (const meta of MUSCLE_GROUPS) {
            map.set(meta.key, []);
        }
        for (const def of Object.values(config.exercises)) {
            const list = map.get(def.muscleGroup) ?? map.get('autre')!;
            list.push(def);
        }
        return MUSCLE_GROUPS.map((meta) => ({
            meta,
            exercises: (map.get(meta.key) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'fr')),
        })).filter((section) => section.exercises.length > 0);
    }, [config]);

    const handleAdd = () => {
        if (!selectedListId) return;
        const name = form.name.trim();
        const value = parseInt(form.value, 10);
        if (!name || isNaN(value) || value <= 0) return;

        startTransition(async () => {
            try {
                const updated = await addCatalogExercise(
                    { name, type: form.type, value, muscleGroup: form.muscleGroup },
                    selectedListId
                );
                onConfigChange(updated);
                setForm(DEFAULT_CATALOG_FORM);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur');
            }
        });
    };

    const handleDelete = (exerciseId: string) => {
        if (!selectedListId) return;
        startTransition(async () => {
            try {
                const updated = await deleteCatalogExercise(exerciseId, selectedListId);
                onConfigChange(updated);
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
        if (!selectedListId) return;
        startTransition(async () => {
            try {
                const updated = await updateCatalogExercise(exerciseId, updates, selectedListId);
                onConfigChange(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur');
            }
        });
    };

    const handleMuscleGroupChange = (exerciseId: string, muscleGroup: MuscleGroupKey) => {
        persistCatalogUpdate(exerciseId, { muscleGroup });
    };

    const handleTypeChange = (exerciseId: string, type: ExerciseType) => {
        persistCatalogUpdate(exerciseId, { type });
    };

    const handleValueBlur = (exerciseId: string, valueStr: string, currentValue: number) => {
        const value = parseInt(valueStr, 10);
        if (isNaN(value) || value <= 0 || value === currentValue) return;
        persistCatalogUpdate(exerciseId, { value });
    };

    const handleCatalogImport = async (json: string, listName?: string) => {
        const creatingNew = lists.length === 0 || !selectedListId;
        let replaceAll = false;

        if (!creatingNew) {
            const hasExercises = config && Object.keys(config.exercises).length > 0;
            if (hasExercises) {
                replaceAll = confirm(
                    'Supprimer tous les exercices actuels du catalogue avant import ?\n\nOK = tout remplacer\nAnnuler = fusionner par id d\'exercice'
                );
            }
        }

        const result = await importCatalogFromJson(json, adminPassword, {
            listName: creatingNew ? listName : undefined,
            listId: creatingNew ? undefined : selectedListId,
            replaceAll,
        });

        if (result.success && result.listId) {
            if (creatingNew) {
                onListImported(result.listId);
            } else {
                const loaded = await getExerciseList(result.listId);
                if (loaded.success && loaded.list) {
                    onConfigChange(loaded.list.config);
                }
            }
        }

        return result;
    };

    if (lists.length === 0) {
        return (
            <div className="space-y-8">
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-8 text-center">
                    <Dumbbell className="w-12 h-12 text-[#13ec5b] mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Aucune liste</h2>
                    <p className="text-sm text-neutral-400">
                        Créez une liste en important un JSON catalogue ci-dessous.
                    </p>
                </div>
                <JsonImportExportPanel
                    title="Import / export catalogue"
                    description="JSON avec « exercises » (et optionnellement « globalRestTime »). Les groupes de séance s'importent dans l'onglet Listes de groupes."
                    showListName
                    listName={importListName}
                    onListNameChange={setImportListName}
                    exportDisabled
                    onExport={() => null}
                    onImport={handleCatalogImport}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ListSelector lists={lists} selectedListId={selectedListId} onSelect={onListSelect} />

            {currentListName && (
                <p className="text-sm text-neutral-400 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Catalogue : <span className="text-white">{currentListName}</span>
                </p>
            )}

            {!selectedListId || !config ? (
                <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center text-neutral-400 text-sm">
                    Sélectionnez une liste pour gérer les exercices du catalogue.
                </div>
            ) : (
                <>
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
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            {def.type === 'time' ? (
                                                <Timer className="w-4 h-4 text-blue-400 shrink-0" />
                                            ) : (
                                                <Dumbbell className="w-4 h-4 text-orange-400 shrink-0" />
                                            )}
                                            <span className="text-sm font-medium truncate">{def.name}</span>
                                        </div>
                                        <select
                                            value={def.type}
                                            onChange={(e) =>
                                                handleTypeChange(def.id, e.target.value as ExerciseType)
                                            }
                                            disabled={isPending}
                                            className="bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                            aria-label={`Type pour ${def.name}`}
                                        >
                                            <option value="reps">Répétitions</option>
                                            <option value="time">Durée</option>
                                        </select>
                                        <input
                                            type="number"
                                            min={1}
                                            defaultValue={def.value}
                                            key={`${def.id}-${def.value}-${def.type}`}
                                            onBlur={(e) => handleValueBlur(def.id, e.target.value, def.value)}
                                            disabled={isPending}
                                            className="w-20 bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                            aria-label={
                                                def.type === 'time'
                                                    ? `Durée par défaut pour ${def.name}`
                                                    : `Répétitions par défaut pour ${def.name}`
                                            }
                                        />
                                        <span className="text-xs text-neutral-500 shrink-0 hidden sm:inline">
                                            {def.type === 'time' ? 'sec' : 'reps'}
                                        </span>
                                        <select
                                            value={def.muscleGroup}
                                            onChange={(e) =>
                                                handleMuscleGroupChange(def.id, e.target.value as MuscleGroupKey)
                                            }
                                            disabled={isPending}
                                            className="bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                            aria-label={`Groupe musculaire pour ${def.name}`}
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
                                            className="text-neutral-400 hover:text-red-500 p-1 self-end sm:self-center"
                                            aria-label="Supprimer du catalogue"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {Object.keys(config.exercises).length === 0 && (
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
                            Object.keys(config.exercises).length > 0
                                ? 'À l\'import, vous pourrez remplacer tout le catalogue ou fusionner par id.'
                                : undefined
                        }
                        exportDisabled={!config}
                        onExport={() => (config ? exportCatalogToJson(config) : null)}
                        onImport={handleCatalogImport}
                    />
                </>
            )}
        </div>
    );
}
