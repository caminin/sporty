'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { ArrowLeft, RotateCcw, Plus, Trash2, Dumbbell, Timer, List, Settings, Copy, FileUp } from 'lucide-react';
import Link from 'next/link';
import type { Exercise, WorkoutConfig, ExerciseType } from '../exercises/types';
import {
    getWorkoutConfig,
    updateGlobalRestTime,
} from '../exercises/actions';
import { exportWorkoutConfigToJson } from '../exercises/workout-config';
import {
    getExerciseLists,
    getExerciseList,
    createList,
    removeList,
    saveList,
    verifyAdmin,
    importListFromJson,
    resetListToDefault,
} from '../exercises/lists-actions';
import type { ExerciseList, ExerciseListMetadata } from '../exercises/lists';
import { useExerciseList } from '../contexts/ExerciseListContext';
import IconPicker from '../components/IconPicker';
import { DEFAULT_ICON, renderIconByName } from '../exercises/icons';
import {
    createCustomGroup,
    updateCustomGroup,
    deleteCustomGroup,
    addExerciseToCustomGroup,
    deleteExerciseFromCustomGroup,
} from '../exercises/actions';

type AddFormState = {
    name: string;
    type: ExerciseType;
    value: string;
};

const DEFAULT_FORM: AddFormState = { name: '', type: 'reps', value: '' };

// États pour les onglets
type Tab = 'groups' | 'lists';

const ADMIN_SESSION_KEY = 'sporty_admin_authenticated';
const ADMIN_PASSWORD_KEY = 'sporty_admin_password';

export default function GroupSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('groups');
    const [config, setConfig] = useState<WorkoutConfig | null>(null);
    const [restTime, setRestTime] = useState<string>('30');
    const [isPending, startTransition] = useTransition();
    const [savedRestTime, setSavedRestTime] = useState(false);
    const [exportedToClipboard, setExportedToClipboard] = useState(false);

    // États pour la gestion des listes
    const [lists, setLists] = useState<ExerciseListMetadata[]>([]);
    const [currentList, setCurrentList] = useState<ExerciseList | null>(null);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        if (typeof window === 'undefined') return false;
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
    });
    const [adminPassword, setAdminPassword] = useState(() => {
        if (typeof window === 'undefined') return '';
        return sessionStorage.getItem(ADMIN_PASSWORD_KEY) ?? '';
    });
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [importListName, setImportListName] = useState('');
    const [importJson, setImportJson] = useState('');
    const [importError, setImportError] = useState<string | null>(null);

    // États pour les groupes personnalisés
    const [customGroupForm, setCustomGroupForm] = useState({ name: '', icon: DEFAULT_ICON });
    const [editingCustomGroup, setEditingCustomGroup] = useState<string | null>(null);
    const [customGroupInputs, setCustomGroupInputs] = useState<Record<string, AddFormState>>({});

    const { selectedListId, setSelectedListId } = useExerciseList();

    useEffect(() => {
        loadWorkoutConfig();
        loadCurrentListInfo();
    }, [selectedListId]);

    const loadCurrentListInfo = async () => {
        try {
            if (selectedListId && selectedListId !== 'default') {
                const listInfo = await getExerciseList(selectedListId);
                if (listInfo.success && listInfo.list) {
                    setCurrentList(listInfo.list);
                } else {
                    console.error('Failed to load list:', listInfo.error);
                    // Si la liste sélectionnée n'existe pas, revenir à la liste par défaut
                    if (listInfo.error === 'List not found') {
                        console.log('Selected list not found, falling back to default list');
                        setSelectedListId('default');
                        setCurrentList(null);
                    } else {
                        setCurrentList(null);
                    }
                }
            } else {
                setCurrentList(null); // Liste par défaut
            }
        } catch (error) {
            console.error('Failed to load current list info:', error);
            setCurrentList(null);
        }
    };

    const loadWorkoutConfig = async () => {
        try {
            const c = await getWorkoutConfig(selectedListId);
            setConfig(c);
            setRestTime(String(c.globalRestTime));
        } catch (error) {
            console.error('Failed to load workout config:', error);
            // En cas d'erreur, essayer avec la liste par défaut
            if (selectedListId !== 'default') {
                try {
                    const defaultConfig = await getWorkoutConfig('default');
                    setConfig(defaultConfig);
                    setRestTime(String(defaultConfig.globalRestTime));
                } catch (defaultError) {
                    console.error('Failed to load default workout config:', defaultError);
                }
            }
        }
    };

    // Charger les listes quand on est authentifié
    useEffect(() => {
        if (isAdminAuthenticated) {
            loadLists();
        }
    }, [isAdminAuthenticated]);

    const handleRestTimeSave = () => {
        const val = parseInt(restTime, 10);
        if (isNaN(val) || val < 0) return;
        startTransition(async () => {
            const updated = await updateGlobalRestTime(val, selectedListId);
            setConfig(updated);
            setSavedRestTime(true);
            setTimeout(() => setSavedRestTime(false), 2000);
        });
    };

    // Fonctions pour la gestion des listes
    const loadLists = async () => {
        const result = await getExerciseLists();
        if (result.success && result.lists) {
            setLists(result.lists);
        }
    };

    const loadList = async (listId: string) => {
        const result = await getExerciseList(listId);
        if (result.success && result.list) {
            setCurrentList(result.list);
            setConfig(result.list.config);
            setRestTime(String(result.list.config.globalRestTime));
        } else {
            console.error('Failed to load list:', result.error);
            // Si la liste n'existe pas, essayer la liste par défaut
            if (listId !== 'default') {
                console.log('Falling back to default list');
                await loadList('default');
            }
        }
    };

    const handleAdminAuth = async () => {
        const result = await verifyAdmin(adminPassword);
        if (result.success) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
            sessionStorage.setItem(ADMIN_PASSWORD_KEY, adminPassword);
            setIsAdminAuthenticated(true);
            await loadLists();
        } else {
            alert('Mot de passe incorrect');
        }
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;

        const result = await createList(newListName.trim(), newListDescription.trim() || undefined, adminPassword);
        if (result.success) {
            await loadLists();
            setNewListName('');
            setNewListDescription('');
        } else {
            alert('Erreur lors de la création de la liste');
        }
    };

    const handleImportList = async () => {
        setImportError(null);
        const json = importJson.trim();
        if (!importListName.trim()) {
            setImportError('Le nom de la liste est requis');
            return;
        }
        if (!json) {
            setImportError('Collez du JSON ou sélectionnez un fichier');
            return;
        }

        const result = await importListFromJson(json, importListName.trim(), adminPassword);
        if (result.success && result.listId) {
            await loadLists();
            setSelectedListId(result.listId);
            setImportListName('');
            setImportJson('');
            setImportError(null);
        } else {
            setImportError(result.error ?? 'Erreur lors de l\'import');
        }
    };

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            if (text) setImportJson(text);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleResetDefaultList = async () => {
        if (!confirm('Réinitialiser la liste par défaut avec le contenu d\'origine ? Les modifications seront perdues.')) return;

        const result = await resetListToDefault(adminPassword);
        if (result.success) {
            await loadWorkoutConfig();
        } else {
            alert(result.error ?? 'Erreur lors de la réinitialisation');
        }
    };

    const handleDeleteList = async (listId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) return;

        const result = await removeList(listId, adminPassword);
        if (result.success) {
            await loadLists();
            // Si la liste supprimée était celle en cours, revenir à la liste par défaut
            if (selectedListId === listId) {
                await loadList('default');
            }
        } else {
            alert('Erreur lors de la suppression de la liste');
        }
    };

    const handleListChange = async (listId: string) => {
        setSelectedListId(listId);
        await loadList(listId);
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    // Fonctions pour les groupes personnalisés
    const handleCreateCustomGroup = () => {
        const name = customGroupForm.name.trim();
        const icon = customGroupForm.icon;

        if (!name) return;

        startTransition(async () => {
            const updated = await createCustomGroup(name, icon, selectedListId);
            setConfig(updated);
            setCustomGroupForm({ name: '', icon: DEFAULT_ICON });
        });
    };

    const handleUpdateCustomGroup = (groupName: string, updates: { name?: string; icon?: string }) => {
        startTransition(async () => {
            const updated = await updateCustomGroup(groupName, updates, selectedListId);
            setConfig(updated);
        });
    };

    const handleDeleteCustomGroup = (groupName: string) => {
        const group = config?.groups?.[groupName];
        const hasExercises = group && group.exercises.length > 0;

        if (hasExercises && !confirm(`Ce groupe contient ${group.exercises.length} exercice(s). Voulez-vous vraiment le supprimer ?`)) {
            return;
        }

        if (!hasExercises && !confirm('Voulez-vous vraiment supprimer ce groupe personnalisé ?')) {
            return;
        }

        startTransition(async () => {
            const updated = await deleteCustomGroup(groupName, selectedListId);
            setConfig(updated);
        });
    };

    const handleAddExerciseToCustomGroup = (groupName: string) => {
        const form = customGroupInputs[groupName] || DEFAULT_FORM;
        const name = form.name.trim();
        const value = parseInt(form.value, 10);

        if (!name || isNaN(value) || value <= 0) return;

        startTransition(async () => {
            const updated = await addExerciseToCustomGroup(groupName, { name, type: form.type, value }, selectedListId);
            setConfig(updated);
            setCustomGroupInputs((prev) => ({ ...prev, [groupName]: DEFAULT_FORM }));
        });
    };

    const handleDeleteExerciseFromCustomGroup = (groupName: string, exerciseId: string) => {
        startTransition(async () => {
            const updated = await deleteExerciseFromCustomGroup(groupName, exerciseId, selectedListId);
            setConfig(updated);
        });
    };

    const updateCustomGroupInput = (groupName: string, partial: Partial<AddFormState>) => {
        setCustomGroupInputs((prev) => ({
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

    // Mot de passe requis pour accéder à tout paramètre
    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-2 text-center">Paramètres</h2>
                    <p className="text-sm text-neutral-400 mb-4 text-center">Mot de passe requis pour accéder aux paramètres</p>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                        className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm mb-4"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors text-center"
                        >
                            Annuler
                        </Link>
                        <button
                            onClick={handleAdminAuth}
                            className="flex-1 bg-[#13ec5b] hover:bg-[#10d452] text-black px-4 py-3 rounded-lg font-medium text-sm transition-colors"
                        >
                            Accéder
                        </button>
                    </div>
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
                <h1 className="text-2xl font-bold">Paramètres</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-neutral-900 rounded-xl p-1 border border-neutral-800">
                <button
                    onClick={() => handleTabChange('groups')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                        activeTab === 'groups'
                            ? 'bg-[#13ec5b] text-black'
                            : 'text-neutral-400 hover:text-white'
                    }`}
                >
                    <Dumbbell className="w-4 h-4" />
                    <span className="hidden sm:inline">Groupes d'exercices</span>
                    <span className="sm:hidden">Groupes</span>
                </button>
                <button
                    onClick={() => handleTabChange('lists')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                        activeTab === 'lists'
                            ? 'bg-[#13ec5b] text-black'
                            : 'text-neutral-400 hover:text-white'
                    }`}
                >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Gestion des listes</span>
                    <span className="sm:hidden">Listes</span>
                </button>
            </div>

            {/* Tab Content - Groupes d'exercices (unique onglet groupes) */}
            {activeTab === 'groups' && (
                <div className="space-y-8">
                    {/* Liste active */}
                    <div className="mb-6 flex items-center justify-between gap-2 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                            <List className="w-4 h-4" />
                            <span>Liste : {currentList?.name ?? 'Liste par défaut'}</span>
                        </div>
                        {selectedListId === 'default' && isAdminAuthenticated && (
                            <button
                                onClick={handleResetDefaultList}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-sm transition-colors border border-neutral-700"
                                title="Réinitialiser avec le contenu d'origine"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {/* Global Rest Time */}
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

                    {/* Export JSON */}
                    <div>
                        <button
                            onClick={async () => {
                                if (!config) return;
                                const json = exportWorkoutConfigToJson(config);
                                await navigator.clipboard.writeText(json);
                                setExportedToClipboard(true);
                                setTimeout(() => setExportedToClipboard(false), 2000);
                            }}
                            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors border border-neutral-700"
                        >
                            <Copy className="w-4 h-4" />
                            {exportedToClipboard ? 'Copié ✓' : 'Exporter en JSON'}
                        </button>
                    </div>

                    {/* Formulaire de création de groupe */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Dumbbell className="w-5 h-5 text-[#13ec5b]" />
                            <h2 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                                Créer un groupe
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom du groupe (ex: HIIT, Yoga, Cardio…)"
                                value={customGroupForm.name}
                                onChange={(e) => setCustomGroupForm(prev => ({ ...prev, name: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateCustomGroup()}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                            />
                            <IconPicker
                                value={customGroupForm.icon}
                                onChange={(icon) => setCustomGroupForm(prev => ({ ...prev, icon }))}
                            />
                            <button
                                onClick={handleCreateCustomGroup}
                                disabled={!customGroupForm.name.trim() || isPending}
                                className="w-full bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                            >
                                Créer le groupe
                            </button>
                        </div>
                    </div>

                    {/* Liste des groupes */}
                    <div className="space-y-6">
                        {Object.entries(config.groups).length === 0 ? (
                            <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">
                                <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-neutral-300 mb-2">Aucun groupe</h3>
                                <p className="text-sm text-neutral-400">
                                    Créez votre premier groupe pour organiser vos exercices.
                                </p>
                            </div>
                        ) : (
                            Object.entries(config.groups).map(([groupName, group]) => {
                                const form = customGroupInputs[groupName] || DEFAULT_FORM;
                                const valueLabel = form.type === 'time' ? 'Durée (sec)' : 'Répétitions';
                                return (
                                    <div key={groupName} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg">
                                                    {renderIconByName(group.icon, { className: "w-5 h-5 text-[#13ec5b]" }) || <Dumbbell className="w-5 h-5 text-[#13ec5b]" />}
                                                </div>
                                                <h3 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">{group.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingCustomGroup(editingCustomGroup === groupName ? null : groupName)}
                                                    className="text-neutral-400 hover:text-white transition-colors p-2"
                                                    aria-label="Modifier le groupe"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomGroup(groupName)}
                                                    disabled={isPending}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors p-2"
                                                    aria-label="Supprimer le groupe"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {editingCustomGroup === groupName && (
                                            <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                                                <h4 className="text-sm font-semibold text-white mb-3">Modifier le groupe</h4>
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Nouveau nom du groupe"
                                                        defaultValue={group.name}
                                                        onBlur={(e) => {
                                                            const newName = e.target.value.trim();
                                                            if (newName && newName !== groupName) handleUpdateCustomGroup(groupName, { name: newName });
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const newName = (e.target as HTMLInputElement).value.trim();
                                                                if (newName && newName !== groupName) handleUpdateCustomGroup(groupName, { name: newName });
                                                            }
                                                        }}
                                                        className="w-full bg-neutral-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                                                    />
                                                    <IconPicker value={group.icon} onChange={(icon) => handleUpdateCustomGroup(groupName, { icon })} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 mb-6">
                                            {group.exercises.length === 0 && (
                                                <p className="text-sm text-neutral-500 italic px-2">Aucun exercice dans ce groupe.</p>
                                            )}
                                            {group.exercises.map((exercise) => (
                                                <div key={exercise.id} className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg border border-neutral-700 gap-3">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {exercise.type === 'time' ? <Timer className="w-4 h-4 text-blue-400 flex-shrink-0" /> : <Dumbbell className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                                                        <span className="text-sm font-medium truncate">{exercise.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <span className="text-xs text-neutral-400 bg-neutral-700 px-2 py-1 rounded">
                                                            {exercise.type === 'time' ? `${exercise.value}s` : `${exercise.value} reps`}
                                                        </span>
                                                        <button onClick={() => handleDeleteExerciseFromCustomGroup(groupName, exercise.id)} disabled={isPending} className="text-neutral-400 hover:text-red-500 transition-colors p-1" aria-label="Supprimer l'exercice">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Nom de l'exercice…"
                                                value={form.name}
                                                onChange={(e) => updateCustomGroupInput(groupName, { name: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddExerciseToCustomGroup(groupName)}
                                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                                            />
                                            <div className="flex gap-3">
                                                <select value={form.type} onChange={(e) => updateCustomGroupInput(groupName, { type: e.target.value as ExerciseType })} className="bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm">
                                                    <option value="reps">Répétitions</option>
                                                    <option value="time">Durée (temps)</option>
                                                </select>
                                                <input type="number" min={1} placeholder={valueLabel} value={form.value} onChange={(e) => updateCustomGroupInput(groupName, { value: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleAddExerciseToCustomGroup(groupName)} className="flex-1 bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm" />
                                                <button onClick={() => handleAddExerciseToCustomGroup(groupName)} disabled={!form.name.trim() || !form.value || isPending} className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 disabled:hover:bg-[#13ec5b] text-black p-3 rounded-lg font-medium transition-colors">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Lists Management Tab */}
            {activeTab === 'lists' && isAdminAuthenticated && (
                <div className="space-y-8">
                    {/* Current List Info */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="flex items-center gap-2 mb-4">
                            <List className="w-5 h-5 text-[#13ec5b]" />
                            <h2 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">
                                Liste active
                            </h2>
                        </div>
                        <div className="bg-neutral-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{currentList?.name || 'Liste par défaut'}</h3>
                                    {currentList?.description && (
                                        <p className="text-sm text-neutral-400 mt-1">{currentList.description}</p>
                                    )}
                                </div>
                                <div className="text-xs text-neutral-500">
                                    Modifié: {currentList ? new Date(currentList.updatedAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List Selection */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider">
                            Changer de liste
                        </h2>
                        <div className="space-y-3">
                            {lists.map((list) => (
                                <button
                                    key={list.id}
                                    onClick={() => handleListChange(list.id)}
                                    className={`w-full text-left bg-neutral-800 hover:bg-neutral-700 p-4 rounded-lg transition-colors border ${
                                        selectedListId === list.id
                                            ? 'border-[#13ec5b] bg-neutral-700'
                                            : 'border-neutral-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{list.name}</h3>
                                            {list.description && (
                                                <p className="text-sm text-neutral-400 mt-1">{list.description}</p>
                                            )}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {new Date(list.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {selectedListId === list.id && (
                                        <div className="text-xs text-[#13ec5b] mt-2">Liste active</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Create New List */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider">
                            Créer une nouvelle liste
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom de la liste"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Description (optionnel)"
                                value={newListDescription}
                                onChange={(e) => setNewListDescription(e.target.value)}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                            />
                            <button
                                onClick={handleCreateList}
                                disabled={!newListName.trim()}
                                className="w-full bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                            >
                                Créer la liste
                            </button>
                        </div>
                    </div>

                    {/* Import JSON */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h2 className="text-lg font-semibold text-[#13ec5b] mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FileUp className="w-5 h-5" />
                            Importer JSON
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom de la liste"
                                value={importListName}
                                onChange={(e) => setImportListName(e.target.value)}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm"
                            />
                            <textarea
                                placeholder="Collez le JSON ici…"
                                value={importJson}
                                onChange={(e) => setImportJson(e.target.value)}
                                rows={6}
                                className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#13ec5b] text-sm font-mono resize-y"
                            />
                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".json,application/json"
                                        onChange={handleImportFileChange}
                                        className="hidden"
                                    />
                                    <span className="inline-flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors border border-neutral-700">
                                        <FileUp className="w-4 h-4" />
                                        Choisir un fichier .json
                                    </span>
                                </label>
                                <button
                                    onClick={handleImportList}
                                    disabled={!importListName.trim() || !importJson.trim()}
                                    className="bg-[#13ec5b] hover:bg-[#10d452] disabled:opacity-50 text-black px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                                >
                                    Importer
                                </button>
                            </div>
                            {importError && (
                                <p className="text-sm text-red-400">{importError}</p>
                            )}
                        </div>
                    </div>

                    {/* Delete Lists */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <h2 className="text-lg font-semibold text-red-400 mb-4 uppercase tracking-wider">
                            Supprimer des listes
                        </h2>
                        <div className="space-y-3">
                            {lists.filter(list => list.id !== 'default').map((list) => (
                                <div key={list.id} className="flex justify-between items-center bg-neutral-800 p-4 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">{list.name}</h3>
                                        {list.description && (
                                            <p className="text-sm text-neutral-400">{list.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteList(list.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                                        aria-label="Supprimer la liste"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {lists.filter(list => list.id !== 'default').length === 0 && (
                                <p className="text-sm text-neutral-500 italic">Aucune liste supprimable (la liste par défaut ne peut pas être supprimée).</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
