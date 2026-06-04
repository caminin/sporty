'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Dumbbell, List } from 'lucide-react';
import Link from 'next/link';
import type { GlobalCatalog, Training, WorkoutView } from '../exercises/types';
import { getWorkoutView, getGlobalCatalog } from '../exercises/actions';
import {
    getExerciseLists,
    getExerciseList,
    removeList,
    verifyAdmin,
    initializeLists,
} from '../exercises/lists-actions';
import type { TrainingMetadata } from '../exercises/lists';
import { useExerciseList } from '../contexts/ExerciseListContext';
import ExercisesTab from './CatalogTab';
import TrainingsTab from './GroupsTab';

type Tab = 'exercises' | 'trainings';

const ADMIN_SESSION_KEY = 'sporty_admin_authenticated';
const ADMIN_PASSWORD_KEY = 'sporty_admin_password';

export default function GroupSettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('exercises');
    const [view, setView] = useState<WorkoutView | null>(null);
    const [catalog, setCatalog] = useState<GlobalCatalog | null>(null);
    const [restTime, setRestTime] = useState<string>('30');
    const [isViewLoading, setIsViewLoading] = useState(false);

    const [lists, setLists] = useState<TrainingMetadata[]>([]);
    const [currentTraining, setCurrentTraining] = useState<Training | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const { selectedListId, setSelectedListId } = useExerciseList();

    useEffect(() => {
        setIsAdminAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === '1');
        setAdminPassword(sessionStorage.getItem(ADMIN_PASSWORD_KEY) ?? '');
        setAuthReady(true);
    }, []);

    useEffect(() => {
        if (!authReady || !isAdminAuthenticated) return;
        void initializeLists();
        void loadLists();
    }, [authReady, isAdminAuthenticated]);

    useEffect(() => {
        if (!authReady) return;
        void loadTrainingView();
    }, [authReady, selectedListId, isAdminAuthenticated]);

    const loadTrainingView = async () => {
        if (!isAdminAuthenticated) return;
        setIsViewLoading(true);
        try {
            const cat = await getGlobalCatalog();
            setCatalog(cat);
            if (!selectedListId) {
                setView(null);
                setCurrentTraining(null);
                return;
            }
            const [workoutView, listInfo] = await Promise.all([
                getWorkoutView(selectedListId),
                getExerciseList(selectedListId),
            ]);
            setView(workoutView);
            setRestTime(String(workoutView.globalRestTime));
            if (listInfo.success && listInfo.list) {
                setCurrentTraining(listInfo.list);
            } else {
                setCurrentTraining(null);
                setSelectedListId('');
            }
        } catch {
            setView(null);
            setCurrentTraining(null);
        } finally {
            setIsViewLoading(false);
        }
    };

    const loadLists = async () => {
        const result = await getExerciseLists();
        if (result.success && result.lists) {
            setLists(result.lists);
            if (result.lists.length === 0) {
                setSelectedListId('');
                setView(null);
                setCurrentTraining(null);
            }
            if (selectedListId && !result.lists.find((l) => l.id === selectedListId)) {
                setSelectedListId('');
                setView(null);
                setCurrentTraining(null);
            }
            return;
        }
        setLists([]);
    };

    const handleAdminAuth = async () => {
        const result = await verifyAdmin(adminPassword);
        if (result.success) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
            sessionStorage.setItem(ADMIN_PASSWORD_KEY, adminPassword);
            setIsAdminAuthenticated(true);
            await initializeLists();
            await loadLists();
        } else {
            alert('Mot de passe incorrect');
        }
    };

    const handleTrainingChange = async (trainingId: string) => {
        setSelectedListId(trainingId);
    };

    const handleDeleteTraining = async (trainingId: string) => {
        if (!confirm('Supprimer cet entraînement ?')) return;
        const result = await removeList(trainingId, adminPassword);
        if (result.success) {
            await loadLists();
            if (selectedListId === trainingId) {
                setSelectedListId('');
                setView(null);
                setCurrentTraining(null);
            }
        } else {
            alert('Erreur lors de la suppression');
        }
    };

    if (!authReady) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4" />
        );
    }

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-2 text-center">Paramètres</h2>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                        className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white text-sm mb-4"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-lg text-sm text-center"
                        >
                            Annuler
                        </Link>
                        <button
                            type="button"
                            onClick={handleAdminAuth}
                            className="flex-1 bg-[#13ec5b] hover:bg-[#10d452] text-black px-4 py-3 rounded-lg text-sm font-medium"
                        >
                            Accéder
                        </button>
                    </div>
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
                <button type="button" onClick={() => setActiveTab('exercises')} className={tabClass('exercises')}>
                    <List className="w-4 h-4 shrink-0" />
                    Exercices
                </button>
                <button type="button" onClick={() => setActiveTab('trainings')} className={tabClass('trainings')}>
                    <Dumbbell className="w-4 h-4 shrink-0" />
                    Entraînements
                </button>
            </div>

            {activeTab === 'exercises' && <ExercisesTab adminPassword={adminPassword} />}

            {activeTab === 'trainings' && (
                <TrainingsTab
                    lists={lists}
                    selectedListId={selectedListId}
                    view={isViewLoading ? null : view}
                    catalog={catalog}
                    restTime={restTime}
                    adminPassword={adminPassword}
                    onListSelect={handleTrainingChange}
                    onViewChange={(v) => {
                        setView(v);
                        setRestTime(String(v.globalRestTime));
                    }}
                    onRestTimeChange={setRestTime}
                    onDeleteList={handleDeleteTraining}
                    onListsChanged={async () => {
                        await loadLists();
                        await loadTrainingView();
                    }}
                />
            )}
        </div>
    );
}
