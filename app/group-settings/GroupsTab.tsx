'use client';

import React, { useState, useTransition } from 'react';
import { Dumbbell, List, Plus, RotateCcw, Settings, Timer, Trash2 } from 'lucide-react';
import type { ExerciseListMetadata } from '../exercises/lists';
import type { GroupColorKey, WorkoutConfig } from '../exercises/types';
import { groupPlacementsByMuscleGroup } from '../exercises/workout-config';
import {
    updateCustomGroup,
    deleteCustomGroup,
    addExerciseToCustomGroup,
    deleteExerciseFromCustomGroup,
    updateGlobalRestTime,
} from '../exercises/actions';
import IconPicker from '../components/IconPicker';
import { renderIconByName } from '../exercises/icons';
import { GROUP_COLOR_KEYS } from '../exercises/group-colors';
import { MUSCLE_GROUPS, type MuscleGroupKey } from '../exercises/muscle-groups';
import ListSelector from './ListSelector';
import JsonImportExportPanel from './JsonImportExportPanel';
import { exportGroupsToJson } from '../exercises/workout-config';
import { importGroupsFromJson, getExerciseList } from '../exercises/lists-actions';

const GROUP_COLOR_LABELS: Record<GroupColorKey, string> = {
    red: 'Rouge',
    blue: 'Bleu',
    purple: 'Violet',
    yellow: 'Jaune',
    emerald: 'Emeraude',
    primary: 'Primaire',
    orange: 'Orange',
    cyan: 'Cyan',
};

function pickerKey(groupName: string, muscleGroup: MuscleGroupKey): string {
    return `${groupName}::${muscleGroup}`;
}

type GroupsTabProps = {
    lists: ExerciseListMetadata[];
    selectedListId: string;
    config: WorkoutConfig | null;
    restTime: string;
    onListSelect: (listId: string) => void;
    onConfigChange: (config: WorkoutConfig) => void;
    onRestTimeChange: (value: string) => void;
    onDeleteList: (listId: string) => void;
    adminPassword: string;
};

export default function GroupsTab({
    lists,
    selectedListId,
    config,
    restTime,
    onListSelect,
    onConfigChange,
    onRestTimeChange,
    onDeleteList,
    adminPassword,
}: GroupsTabProps) {
    const [isPending, startTransition] = useTransition();
    const [savedRestTime, setSavedRestTime] = useState(false);
    const [editingCustomGroup, setEditingCustomGroup] = useState<string | null>(null);
    const [groupPicker, setGroupPicker] = useState<Record<string, string>>({});

    const ensureActiveList = () => {
        if (!selectedListId) {
            alert('Sélectionnez une liste avant cette action.');
            return false;
        }
        return true;
    };

    const handleRestTimeSave = () => {
        if (!ensureActiveList()) return;
        const val = parseInt(restTime, 10);
        if (isNaN(val) || val < 0) return;
        startTransition(async () => {
            const updated = await updateGlobalRestTime(val, selectedListId);
            onConfigChange(updated);
            setSavedRestTime(true);
            setTimeout(() => setSavedRestTime(false), 2000);
        });
    };

    const handleUpdateCustomGroup = (
        groupName: string,
        updates: { name?: string; icon?: string; color?: GroupColorKey }
    ) => {
        if (!ensureActiveList()) return;
        startTransition(async () => {
            const updated = await updateCustomGroup(groupName, updates, selectedListId);
            onConfigChange(updated);
        });
    };

    const handleDeleteCustomGroup = (groupName: string) => {
        if (!ensureActiveList()) return;
        const group = config?.groups?.[groupName];
        const hasExercises = group && group.exercises.length > 0;
        if (hasExercises && !confirm(`Ce groupe contient ${group.exercises.length} exercice(s). Supprimer ?`)) {
            return;
        }
        if (!hasExercises && !confirm('Supprimer ce groupe de séance ?')) return;
        startTransition(async () => {
            const updated = await deleteCustomGroup(groupName, selectedListId);
            onConfigChange(updated);
        });
    };

    const handleAddFromCatalogToGroup = (groupName: string, muscleGroup: MuscleGroupKey) => {
        if (!ensureActiveList() || !config) return;
        const key = pickerKey(groupName, muscleGroup);
        const exerciseId = groupPicker[key];
        if (!exerciseId) return;
        startTransition(async () => {
            const updated = await addExerciseToCustomGroup(groupName, exerciseId, selectedListId);
            onConfigChange(updated);
            setGroupPicker((prev) => ({ ...prev, [key]: '' }));
        });
    };

    const handleDeleteExerciseFromCustomGroup = (groupName: string, refId: string) => {
        if (!ensureActiveList()) return;
        startTransition(async () => {
            const updated = await deleteExerciseFromCustomGroup(groupName, refId, selectedListId);
            onConfigChange(updated);
        });
    };

    const updateGroupPicker = (groupName: string, muscleGroup: MuscleGroupKey, exerciseId: string) => {
        const key = pickerKey(groupName, muscleGroup);
        setGroupPicker((prev) => ({ ...prev, [key]: exerciseId }));
    };

    const catalogOptionsForSection = (
        cfg: WorkoutConfig,
        groupName: string,
        muscleGroup: MuscleGroupKey
    ) => {
        const usedIds = new Set(cfg.groups[groupName]?.exercises.map((r) => r.exerciseId) ?? []);
        return Object.values(cfg.exercises)
            .filter((def) => def.muscleGroup === muscleGroup && !usedIds.has(def.id))
            .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    };

    const catalogEmpty = !config || Object.keys(config.exercises).length === 0;
    const groupsImportDisabled = !selectedListId || catalogEmpty;

    const handleGroupsImport = async (json: string) => {
        const result = await importGroupsFromJson(json, selectedListId, adminPassword);
        if (result.success) {
            const loaded = await getExerciseList(selectedListId);
            if (loaded.success && loaded.list) {
                onConfigChange(loaded.list.config);
            }
        }
        return result;
    };

    if (lists.length === 0) {
        return (
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-8 text-center">
                <Dumbbell className="w-12 h-12 text-[#13ec5b] mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Aucune liste</h2>
                <p className="text-sm text-neutral-400">
                    Importez d&apos;abord un catalogue dans l&apos;onglet Liste d&apos;exercices.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ListSelector lists={lists} selectedListId={selectedListId} onSelect={onListSelect} title="Changer de liste" />

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
                        className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                        placeholder="Durée en secondes"
                    />
                    <span className="text-neutral-400 text-sm whitespace-nowrap">sec</span>
                    <button
                        type="button"
                        onClick={handleRestTimeSave}
                        disabled={isPending || !selectedListId}
                        className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm"
                    >
                        {savedRestTime ? 'Sauvegardé ✓' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            {!config ? (
                <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">
                    <List className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-sm text-neutral-400">Sélectionnez une liste pour gérer les groupes de séance.</p>
                </div>
            ) : Object.entries(config.groups).length === 0 ? (
                <p className="text-sm text-neutral-500 italic text-center">
                    Aucun groupe de séance — importez un JSON groupes ci-dessous.
                </p>
            ) : (
                Object.entries(config.groups).map(([groupName, group]) => {
                    const sections = groupPlacementsByMuscleGroup(config, groupName);

                    return (
                        <div key={groupName} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg">
                                        {renderIconByName(group.icon, { className: 'w-5 h-5 text-[#13ec5b]' }) ?? (
                                            <Dumbbell className="w-5 h-5 text-[#13ec5b]" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                                        {group.name}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingCustomGroup(editingCustomGroup === groupName ? null : groupName)
                                        }
                                        className="text-neutral-400 hover:text-white p-2"
                                        aria-label="Modifier le groupe"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCustomGroup(groupName)}
                                        disabled={isPending}
                                        className="text-neutral-400 hover:text-red-500 p-2"
                                        aria-label="Supprimer le groupe"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {editingCustomGroup === groupName && (
                                <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nouveau nom"
                                        defaultValue={group.name}
                                        onBlur={(e) => {
                                            const newName = e.target.value.trim();
                                            if (newName && newName !== groupName) {
                                                handleUpdateCustomGroup(groupName, { name: newName });
                                            }
                                        }}
                                        className="w-full bg-neutral-700 border-none rounded-lg p-3 text-white text-sm"
                                    />
                                    <IconPicker
                                        value={group.icon}
                                        onChange={(icon) => handleUpdateCustomGroup(groupName, { icon })}
                                    />
                                    <select
                                        value={group.color}
                                        onChange={(e) =>
                                            handleUpdateCustomGroup(groupName, {
                                                color: e.target.value as GroupColorKey,
                                            })
                                        }
                                        className="w-full bg-neutral-700 border-none rounded-lg p-3 text-white text-sm"
                                    >
                                        {GROUP_COLOR_KEYS.map((colorKey) => (
                                            <option key={colorKey} value={colorKey}>
                                                {GROUP_COLOR_LABELS[colorKey]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-6">
                                {sections.map(({ meta, placements }) => {
                                    const pickerId = pickerKey(groupName, meta.key);
                                    const pickerValue = groupPicker[pickerId] ?? '';
                                    const addOptions = catalogOptionsForSection(config, groupName, meta.key);
                                    const muscleMeta = MUSCLE_GROUPS.find((g) => g.key === meta.key) ?? meta;

                                    return (
                                        <section
                                            key={meta.key}
                                            className="border border-neutral-800 rounded-lg p-4 space-y-3"
                                        >
                                            <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                                                {muscleMeta.label}
                                            </h4>
                                            {placements.length === 0 && (
                                                <p className="text-sm text-neutral-500 italic">
                                                    Aucun exercice dans cette section.
                                                </p>
                                            )}
                                            {placements.map(({ ref, resolved }) => {
                                                const def = config.exercises[resolved.exerciseId];
                                                const displayType = def?.type ?? resolved.type;
                                                const displayValue = def?.value ?? resolved.value;
                                                return (
                                                    <div
                                                        key={ref.refId}
                                                        className="flex justify-between items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700"
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            {displayType === 'time' ? (
                                                                <Timer className="w-4 h-4 text-blue-400 shrink-0" />
                                                            ) : (
                                                                <Dumbbell className="w-4 h-4 text-orange-400 shrink-0" />
                                                            )}
                                                            <span className="text-sm font-medium truncate">
                                                                {resolved.name}
                                                            </span>
                                                            <span className="text-xs text-neutral-500 shrink-0">
                                                                {displayType === 'time'
                                                                    ? `${displayValue}s`
                                                                    : `${displayValue} reps`}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteExerciseFromCustomGroup(
                                                                    groupName,
                                                                    ref.refId
                                                                )
                                                            }
                                                            disabled={isPending}
                                                            className="text-neutral-400 hover:text-red-500 p-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex gap-3">
                                                <select
                                                    value={pickerValue}
                                                    onChange={(e) =>
                                                        updateGroupPicker(groupName, meta.key, e.target.value)
                                                    }
                                                    disabled={addOptions.length === 0}
                                                    className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white text-sm disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        {addOptions.length === 0
                                                            ? 'Aucun exercice disponible'
                                                            : 'Choisir un exercice…'}
                                                    </option>
                                                    {addOptions.map((def) => (
                                                        <option key={def.id} value={def.id}>
                                                            {def.name} (
                                                            {def.type === 'time'
                                                                ? `${def.value}s`
                                                                : `${def.value} reps`}
                                                            )
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddFromCatalogToGroup(groupName, meta.key)}
                                                    disabled={!pickerValue || isPending}
                                                    className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black p-3 rounded-lg"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}

            <JsonImportExportPanel
                title="Import / export groupes de séance"
                description={
                    catalogEmpty
                        ? "Importez d'abord le catalogue dans l'onglet Liste d'exercices."
                        : 'JSON avec « groups » (références refId + exerciseId). Chaque exerciseId doit exister dans le catalogue.'
                }
                exportDisabled={!config || Object.entries(config?.groups ?? {}).length === 0}
                importDisabled={groupsImportDisabled}
                onExport={() => (config ? exportGroupsToJson(config) : null)}
                onImport={handleGroupsImport}
            />

            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                <h2 className="text-lg font-semibold text-red-400 mb-4 uppercase tracking-wider">
                    Supprimer des listes
                </h2>
                <div className="space-y-3">
                    {lists.map((list) => (
                        <div
                            key={list.id}
                            className="flex justify-between items-center bg-neutral-800 p-4 rounded-lg"
                        >
                            <div>
                                <h3 className="font-semibold">{list.name}</h3>
                                {list.description && (
                                    <p className="text-sm text-neutral-400">{list.description}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => onDeleteList(list.id)}
                                className="text-red-400 hover:text-red-300 p-2"
                                aria-label="Supprimer la liste"
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
