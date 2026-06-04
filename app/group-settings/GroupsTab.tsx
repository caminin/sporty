'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Dumbbell, List, Plus, RotateCcw, Timer, Trash2 } from 'lucide-react';
import type { TrainingMetadata } from '../exercises/lists';
import type { GlobalCatalog, WorkoutView } from '../exercises/types';
import { placementsByMuscleGroup, exportTrainingToJson } from '../exercises/workout-config';
import {
    addExerciseToTraining,
    deleteExerciseFromTraining,
    getGlobalCatalog,
    updateGlobalRestTime,
    updateTrainingExerciseRef,
} from '../exercises/actions';
import { MUSCLE_GROUPS, type MuscleGroupKey } from '../exercises/muscle-groups';
import { renderIconByName } from '../exercises/icons';
import ListSelector from './ListSelector';
import JsonImportExportPanel from './JsonImportExportPanel';
import {
    importTrainingFromJson,
    resetToBundledDefaults,
    getExerciseList,
} from '../exercises/lists-actions';

type TrainingsTabProps = {
    lists: TrainingMetadata[];
    selectedListId: string;
    view: WorkoutView | null;
    catalog: GlobalCatalog | null;
    restTime: string;
    adminPassword: string;
    onListSelect: (listId: string) => void;
    onViewChange: (view: WorkoutView) => void;
    onRestTimeChange: (value: string) => void;
    onDeleteList: (listId: string) => void;
    onListsChanged: () => void;
};

function sectionPickerKey(muscleGroup: MuscleGroupKey): string {
    return muscleGroup;
}

export default function TrainingsTab({
    lists,
    selectedListId,
    view,
    catalog,
    restTime,
    adminPassword,
    onListSelect,
    onViewChange,
    onRestTimeChange,
    onDeleteList,
    onListsChanged,
}: TrainingsTabProps) {
    const [isPending, startTransition] = useTransition();
    const [savedRestTime, setSavedRestTime] = useState(false);
    const [sectionPicker, setSectionPicker] = useState<Record<string, string>>({});
    const [importTrainingName, setImportTrainingName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const sections = useMemo(() => {
        if (!view || !catalog) return [];
        return placementsByMuscleGroup(catalog, view.exerciseRefs, { includeEmpty: true });
    }, [view, catalog]);

    const usedExerciseIds = useMemo(() => {
        if (!view) return new Set<string>();
        return new Set(view.exerciseRefs.map((r) => r.exerciseId));
    }, [view]);

    const catalogEmpty = !catalog || Object.keys(catalog.exercises).length === 0;

    const handleRestTimeSave = () => {
        if (!selectedListId) return;
        const val = parseInt(restTime, 10);
        if (isNaN(val) || val < 0) return;
        startTransition(async () => {
            try {
                const updated = await updateGlobalRestTime(val, selectedListId);
                onViewChange(updated);
                setSavedRestTime(true);
                setError(null);
                setTimeout(() => setSavedRestTime(false), 2000);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur de sauvegarde');
            }
        });
    };

    const handleAddToTraining = (muscleGroup: MuscleGroupKey) => {
        if (!selectedListId) return;
        const exerciseId = sectionPicker[sectionPickerKey(muscleGroup)];
        if (!exerciseId) return;
        startTransition(async () => {
            try {
                const updated = await addExerciseToTraining(selectedListId, exerciseId);
                onViewChange(updated);
                setSectionPicker((prev) => ({ ...prev, [sectionPickerKey(muscleGroup)]: '' }));
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur lors de l’ajout');
            }
        });
    };

    const handleRemoveRef = (refId: string) => {
        if (!selectedListId) return;
        startTransition(async () => {
            try {
                const updated = await deleteExerciseFromTraining(selectedListId, refId);
                onViewChange(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur lors de la suppression');
            }
        });
    };

    const handleRefValueBlur = (refId: string, catalogValue: number, raw: string) => {
        if (!selectedListId) return;
        const value = parseInt(raw, 10);
        if (isNaN(value) || value <= 0) return;
        if (value === catalogValue) return;
        startTransition(async () => {
            try {
                const updated = await updateTrainingExerciseRef(selectedListId, refId, value);
                onViewChange(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur de mise à jour');
            }
        });
    };

    const handleRefValueReset = (refId: string) => {
        if (!selectedListId) return;
        startTransition(async () => {
            try {
                const updated = await updateTrainingExerciseRef(selectedListId, refId, null);
                onViewChange(updated);
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Erreur de réinitialisation');
            }
        });
    };

    const handleTrainingImport = async (json: string) => {
        const creatingNew = !selectedListId;
        let replaceRefs = false;
        if (!creatingNew && view && view.exerciseRefs.length > 0) {
            replaceRefs = confirm(
                'Remplacer tous les exercices de l\'entraînement ?\n\nOK = remplacer\nAnnuler = ajouter les nouvelles refs'
            );
        }
        const result = await importTrainingFromJson(json, adminPassword, {
            trainingName: creatingNew ? importTrainingName : undefined,
            trainingId: creatingNew ? undefined : selectedListId,
            replaceRefs,
        });
        if (result.success) {
            onListsChanged();
            if (result.trainingId) {
                onListSelect(result.trainingId);
                const loaded = await getExerciseList(result.trainingId);
                if (loaded.success && loaded.list) {
                    const cat = await getGlobalCatalog();
                    onViewChange({
                        globalRestTime: loaded.list.globalRestTime,
                        exercises: cat.exercises,
                        exerciseRefs: loaded.list.exerciseRefs,
                    });
                }
            }
        }
        return result;
    };

    const handleReset = async () => {
        if (
            !confirm(
                'Réinitialiser le catalogue et les deux entraînements par défaut ? Les données locales seront écrasées.'
            )
        ) {
            return;
        }
        const result = await resetToBundledDefaults(adminPassword);
        if (result.success) {
            onListsChanged();
        }
    };

    const catalogOptionsForSection = (muscleGroup: MuscleGroupKey) => {
        if (!catalog) return [];
        return Object.values(catalog.exercises)
            .filter((def) => def.muscleGroup === muscleGroup && !usedExerciseIds.has(def.id))
            .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    };

    if (lists.length === 0) {
        return (
            <div className="space-y-8">
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-8 text-center">
                    <Dumbbell className="w-12 h-12 text-[#13ec5b] mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Aucun entraînement</h2>
                    <p className="text-sm text-neutral-400 mb-6">
                        Importez un entraînement (JSON « exerciseRefs ») ou réinitialisez les données par défaut.
                    </p>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Réinitialiser (bundle)
                    </button>
                </div>
                <JsonImportExportPanel
                    title="Import entraînement"
                    description="JSON avec « exerciseRefs » — chaque exerciseId doit exister dans le catalogue (onglet Exercices)."
                    showListName
                    listName={importTrainingName}
                    onListNameChange={setImportTrainingName}
                    exportDisabled
                    importDisabled={catalogEmpty}
                    onExport={() => null}
                    onImport={handleTrainingImport}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ListSelector
                lists={lists}
                selectedListId={selectedListId}
                onSelect={onListSelect}
                title="Changer d'entraînement"
            />

            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
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
                        onChange={(e) => onRestTimeChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRestTimeSave()}
                        disabled={!selectedListId}
                        className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white text-sm"
                    />
                    <span className="text-neutral-400 text-sm">sec</span>
                    <button
                        type="button"
                        onClick={handleRestTimeSave}
                        disabled={isPending || !selectedListId}
                        className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg text-sm font-semibold"
                    >
                        {savedRestTime ? 'Sauvegardé ✓' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            {!view ? (
                <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center text-neutral-400 text-sm">
                    Sélectionnez un entraînement.
                </div>
            ) : (
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}
                    {sections.map(({ meta, placements }) => {
                        const pickerValue = sectionPicker[sectionPickerKey(meta.key)] ?? '';
                        const addOptions = catalogOptionsForSection(meta.key);
                        return (
                            <section
                                key={meta.key}
                                className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    {renderIconByName(meta.icon, { className: 'w-5 h-5 text-[#13ec5b]' }) ?? (
                                        <Dumbbell className="w-5 h-5 text-[#13ec5b]" />
                                    )}
                                    <h3 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                                        {meta.label}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {placements.length === 0 && (
                                        <p className="text-sm text-neutral-500 italic">
                                            Aucun exercice dans ce groupe.
                                        </p>
                                    )}
                                    {placements.map(({ ref, resolved }) => {
                                        const catalogDef = catalog?.exercises[ref.exerciseId];
                                        const catalogValue = catalogDef?.value ?? resolved.value;
                                        const hasOverride = ref.value !== undefined;
                                        return (
                                            <div
                                                key={ref.refId}
                                                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700"
                                            >
                                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                                    {resolved.type === 'time' ? (
                                                        <Timer className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Dumbbell className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                                    )}
                                                    <span className="text-sm font-medium break-words min-w-0 flex-1">
                                                        {resolved.name}
                                                    </span>
                                                    {hasOverride && (
                                                        <span className="text-xs text-[#13ec5b] shrink-0">perso</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        defaultValue={resolved.value}
                                                        key={`${ref.refId}-${resolved.value}-${ref.value ?? 'c'}`}
                                                        onBlur={(e) =>
                                                            handleRefValueBlur(
                                                                ref.refId,
                                                                catalogValue,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={isPending}
                                                        className="w-20 bg-neutral-700 border-none rounded-lg p-2 text-white text-sm"
                                                        aria-label={`Valeur pour ${resolved.name}`}
                                                    />
                                                    <span className="text-xs text-neutral-500 w-8">
                                                        {resolved.type === 'time' ? 'sec' : 'rep'}
                                                    </span>
                                                    {hasOverride && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRefValueReset(ref.refId)}
                                                            disabled={isPending}
                                                            className="text-xs text-neutral-400 hover:text-white px-2 py-1"
                                                        >
                                                            Défaut
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRef(ref.refId)}
                                                        disabled={isPending}
                                                        className="text-neutral-400 hover:text-red-500 p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex gap-3">
                                        <select
                                            value={pickerValue}
                                            onChange={(e) =>
                                                setSectionPicker((prev) => ({
                                                    ...prev,
                                                    [sectionPickerKey(meta.key)]: e.target.value,
                                                }))
                                            }
                                            disabled={addOptions.length === 0 || catalogEmpty}
                                            className="flex-1 bg-neutral-800 rounded-lg p-3 text-white text-sm"
                                        >
                                            <option value="">
                                                {addOptions.length === 0
                                                    ? 'Aucun exercice disponible'
                                                    : 'Ajouter un exercice…'}
                                            </option>
                                            {addOptions.map((def) => (
                                                <option key={def.id} value={def.id}>
                                                    {def.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleAddToTraining(meta.key)}
                                            disabled={!pickerValue || isPending}
                                            className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black p-3 rounded-lg"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                    {view.exerciseRefs.length === 0 && (
                        <p className="text-sm text-neutral-500 italic text-center">
                            Aucun exercice — ajoutez-en par groupe musculaire ou importez un JSON.
                        </p>
                    )}
                </div>
            )}

            <JsonImportExportPanel
                title="Import / export entraînement"
                description={
                    catalogEmpty
                        ? "Remplissez d'abord le catalogue (onglet Exercices)."
                        : 'JSON : exerciseRefs + globalRestTime optionnel.'
                }
                showListName={!selectedListId}
                listName={importTrainingName}
                onListNameChange={setImportTrainingName}
                exportDisabled={!view || view.exerciseRefs.length === 0}
                importDisabled={catalogEmpty}
                onExport={() => {
                    if (!view) return null;
                    const training = lists.find((l) => l.id === selectedListId);
                    return exportTrainingToJson({
                        id: selectedListId,
                        name: training?.name ?? 'Entraînement',
                        globalRestTime: view.globalRestTime,
                        exerciseRefs: view.exerciseRefs,
                        createdAt: '',
                        updatedAt: '',
                    });
                }}
                onImport={handleTrainingImport}
            />

            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider">
                    Réinitialiser
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                    Restaure le catalogue et les deux entraînements embarqués (Jambes, Haut du corps).
                </p>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg text-sm font-medium"
                >
                    Réinitialiser depuis le bundle
                </button>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                <h2 className="text-lg font-semibold text-red-400 mb-4 uppercase tracking-wider">
                    Supprimer des entraînements
                </h2>
                <div className="space-y-3">
                    {lists.map((list) => (
                        <div
                            key={list.id}
                            className="flex justify-between items-center bg-neutral-800 p-4 rounded-lg"
                        >
                            <h3 className="font-semibold">{list.name}</h3>
                            <button
                                type="button"
                                onClick={() => onDeleteList(list.id)}
                                className="text-red-400 hover:text-red-300 p-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
