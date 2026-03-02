'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { getExerciseLists } from '../exercises/lists-actions';
import { ExerciseListMetadata } from '../exercises/lists';

// Icônes pour les différentes listes
const LIST_ICONS: Record<string, string> = {
  default: 'list_alt',
  cardio: 'favorite',
  strength: 'fitness_center',
  flexibility: 'accessibility_new',
  general: 'sports_soccer',
};

interface ExerciseListSelectorProps {
  selectedListId: string;
  onListChange: (listId: string) => void;
}

export function ExerciseListSelector({ selectedListId, onListChange }: ExerciseListSelectorProps) {
  const [lists, setLists] = useState<ExerciseListMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLists();
  }, []);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getExerciseLists();

      if (result.success && result.lists) {
        setLists(result.lists);

        // Si aucune liste n'est sélectionnée ou que la liste sélectionnée n'existe pas,
        // sélectionner la première liste disponible ou 'default'
        if (!selectedListId || !result.lists.find(list => list.id === selectedListId)) {
          const defaultList = result.lists.find(list => list.id === 'default') || result.lists[0];
          if (defaultList) {
            onListChange(defaultList.id);
          }
        }
      } else {
        setError(result.error || 'Erreur lors du chargement des listes');
      }
    } catch (err) {
      setError('Erreur lors du chargement des listes');
      console.error('Failed to load exercise lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedList = lists.find(list => list.id === selectedListId);

  const getListIcon = (listId: string): string => {
    // Essayer de deviner l'icône basée sur le nom ou utiliser l'icône par défaut
    if (listId === 'default') return LIST_ICONS.default;
    if (listId.toLowerCase().includes('cardio')) return LIST_ICONS.cardio;
    if (listId.toLowerCase().includes('force') || listId.toLowerCase().includes('strength')) return LIST_ICONS.strength;
    if (listId.toLowerCase().includes('flexibilité') || listId.toLowerCase().includes('souplesse')) return LIST_ICONS.flexibility;
    return LIST_ICONS.general;
  };

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">list_alt</span>
          Liste d'exercices
        </h3>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-white/10">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 dark:border-white/20 border-t-primary" />
          <span className="text-sm text-slate-500 dark:text-text-muted-dark">Chargement des listes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">list_alt</span>
          Liste d'exercices
        </h3>
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">list_alt</span>
          Liste d'exercices
        </h3>
        <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-text-muted-dark">Aucune liste d'exercices disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-base">list_alt</span>
        Liste d'exercices
      </h3>

      <div className="relative" ref={dropdownRef}>
        {/* Bouton du sélecteur */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-sm">
                {selectedList ? getListIcon(selectedList.id) : LIST_ICONS.default}
              </span>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {selectedList?.name || 'Sélectionner une liste'}
              </p>
              {selectedList?.description && (
                <p className="text-xs text-slate-500 dark:text-text-muted-dark truncate">
                  {selectedList.description}
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 dark:text-text-muted-dark transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => {
                  onListChange(list.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  list.id === selectedListId ? 'bg-primary/5 border-l-2 border-primary' : ''
                }`}
                role="option"
                aria-selected={list.id === selectedListId}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                  list.id === selectedListId
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {getListIcon(list.id)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {list.name}
                  </p>
                  {list.description && (
                    <p className="text-xs text-slate-500 dark:text-text-muted-dark truncate">
                      {list.description}
                    </p>
                  )}
                </div>
                {list.id === selectedListId && (
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}