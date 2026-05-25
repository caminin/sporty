'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Layers, List } from 'lucide-react';
import Link from 'next/link';
import type { WorkoutConfig } from '../exercises/types';
import { getWorkoutConfig } from '../exercises/actions';
import {
    getExerciseLists,
    getExerciseList,
    removeList,
    verifyAdmin,
} from '../exercises/lists-actions';
import type { ExerciseList, ExerciseListMetadata } from '../exercises/lists';
import { useExerciseList } from '../contexts/ExerciseListContext';
import CatalogTab from './CatalogTab';
import GroupsTab from './GroupsTab';

type Tab = 'catalog' | 'groups';

const ADMIN_SESSION_KEY = 'sporty_admin_authenticated';
const ADMIN_PASSWORD_KEY = 'sporty_admin_password';

export default function GroupSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('catalog');
    const [config, setConfig] = useState<WorkoutConfig | null>(null);
    const [restTime, setRestTime] = useState<string>('30');
    const [isConfigLoading, setIsConfigLoading] = useState(false);

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

    const { selectedListId, setSelectedListId } = useExerciseList();

    useEffect(() => {
        loadWorkoutConfig();
        loadCurrentListInfo();
    }, [selectedListId]);

    useEffect(() => {
        if (isAdminAuthenticated) {
            loadLists();
        }
    }, [isAdminAuthenticated]);

    const loadCurrentListInfo = async () => {
        try {
            if (!selectedListId) {
                setCurrentList(null);
                return;
            }
            const listInfo = await getExerciseList(selectedListId);
            if (listInfo.success && listInfo.list) {
                setCurrentList(listInfo.list);
            } else {
                setSelectedListId('');
                setCurrentList(null);
            }
        } catch {
            setCurrentList(null);
        }
    };

    const loadWorkoutConfig = async () => {
        setIsConfigLoading(true);
        if (!selectedListId) {
            setConfig(null);
            setIsConfigLoading(false);
            return;
        }
        try {
            const c = await getWorkoutConfig(selectedListId);
            setConfig(c);
            setRestTime(String(c.globalRestTime));
        } catch {
            setConfig(null);
        } finally {
            setIsConfigLoading(false);
        }
    };

    const loadLists = async () => {
        const result = await getExerciseLists();
        if (result.success && result.lists) {
            setLists(result.lists);
            if (result.lists.length === 0) {
                setCurrentList(null);
                setConfig(null);
                setSelectedListId('');
            }
            if (selectedListId && !result.lists.find((l) => l.id === selectedListId)) {
                setSelectedListId('');
                setCurrentList(null);
                setConfig(null);
            }
            return;
        }
        setLists([]);
        setCurrentList(null);
        setConfig(null);
        setSelectedListId('');
    };

    const loadList = async (listId: string) => {
        const result = await getExerciseList(listId);
        if (result.success && result.list) {
            setCurrentList(result.list);
            setConfig(result.list.config);
            setRestTime(String(result.list.config.globalRestTime));
        } else {
            setCurrentList(null);
            setConfig(null);
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

    const handleListChange = async (listId: string) => {
        setSelectedListId(listId);
        await loadList(listId);
    };

    const handleDeleteList = async (listId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) return;
        const result = await removeList(listId, adminPassword);
        if (result.success) {
            await loadLists();
            if (selectedListId === listId) {
                setSelectedListId('');
                setCurrentList(null);
                setConfig(null);
            }
        } else {
            alert('Erreur lors de la suppression de la liste');
        }
    };

    const handleConfigChange = (updated: WorkoutConfig) => {
        setConfig(updated);
        setRestTime(String(updated.globalRestTime));
    };

    const handleListImported = async (listId: string) => {
        await loadLists();
        setSelectedListId(listId);
        await loadList(listId);
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-2 text-center">Paramètres</h2>
                    <p className="text-sm text-neutral-400 mb-4 text-center">
                        Mot de passe requis pour accéder aux paramètres
                    </p>
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
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-lg font-medium text-sm text-center"
                        >
                            Annuler
                        </Link>
                        <button
                            type="button"
                            onClick={handleAdminAuth}
                            className="flex-1 bg-[#13ec5b] hover:bg-[#10d452] text-black px-4 py-3 rounded-lg font-medium text-sm"
                        >
                            Accéder
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isConfigLoading && selectedListId) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <div className="flex items-center gap-3 text-neutral-400">
                    <div className="w-5 h-5 border-2 border-neutral-600 border-t-[#13ec5b] rounded-full animate-spin" />
                    Chargement…
                </div>
            </div>
        );
    }

    const tabClass = (tab: Tab) =>
        `flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
            activeTab === tab ? 'bg-[#13ec5b] text-black' : 'text-neutral-400 hover:text-white'
        }`;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-lexend p-4 md:p-8 max-w-2xl mx-auto pb-24">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-800">
                <Link href="/" className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">Paramètres</h1>
            </div>

            <div className="flex gap-1 mb-8 bg-neutral-900 rounded-xl p-1 border border-neutral-800">
                <button type="button" onClick={() => setActiveTab('catalog')} className={tabClass('catalog')}>
                    <List className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Liste d&apos;exercices</span>
                    <span className="sm:hidden">Exercices</span>
                </button>
                <button type="button" onClick={() => setActiveTab('groups')} className={tabClass('groups')}>
                    <Layers className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Listes de groupes</span>
                    <span className="sm:hidden">Groupes</span>
                </button>
            </div>

            {activeTab === 'catalog' && (
                <CatalogTab
                    lists={lists}
                    selectedListId={selectedListId}
                    currentListName={currentList?.name}
                    config={config}
                    adminPassword={adminPassword}
                    onListSelect={handleListChange}
                    onConfigChange={handleConfigChange}
                    onListImported={handleListImported}
                />
            )}

            {activeTab === 'groups' && (
                <GroupsTab
                    lists={lists}
                    selectedListId={selectedListId}
                    config={config}
                    restTime={restTime}
                    adminPassword={adminPassword}
                    onListSelect={handleListChange}
                    onConfigChange={handleConfigChange}
                    onRestTimeChange={setRestTime}
                    onDeleteList={handleDeleteList}
                />
            )}
        </div>
    );
}
