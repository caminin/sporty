'use client';

import { List } from 'lucide-react';
import type { ExerciseListMetadata } from '../exercises/lists';

type ListSelectorProps = {
    lists: ExerciseListMetadata[];
    selectedListId: string;
    onSelect: (listId: string) => void;
    title?: string;
};

export default function ListSelector({
    lists,
    selectedListId,
    onSelect,
    title = 'Entraînement actif',
}: ListSelectorProps) {
    if (lists.length === 0) return null;

    return (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-[#13ec5b]" />
                <h2 className="text-lg font-semibold text-[#13ec5b] uppercase tracking-wider">{title}</h2>
            </div>
            <div className="space-y-3">
                {lists.map((list) => (
                    <button
                        key={list.id}
                        type="button"
                        onClick={() => onSelect(list.id)}
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
                            <div className="text-xs text-[#13ec5b] mt-2">Actif</div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
