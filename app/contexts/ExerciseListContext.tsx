'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeLists } from '../exercises/lists-actions';
import { getExerciseList } from '../exercises/lists-actions';

interface ExerciseListContextType {
  selectedListId: string;
  setSelectedListId: (listId: string) => void;
}

const ExerciseListContext = createContext<ExerciseListContextType | undefined>(undefined);

interface ExerciseListProviderProps {
  children: ReactNode;
}

export function ExerciseListProvider({ children }: ExerciseListProviderProps) {
  const [selectedListId, setSelectedListId] = useState<string>('default');

  // Initialiser le système de listes et charger la liste sélectionnée depuis le localStorage au montage
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        await initializeLists();
      } catch (error) {
        console.error('Failed to initialize lists:', error);
      }

      const savedListId = localStorage.getItem('selectedExerciseListId');
      if (savedListId) {
        // Vérifier si la liste existe
        const result = await getExerciseList(savedListId);
        if (result.success) {
          setSelectedListId(savedListId);
        } else {
          // Si la liste n'existe pas, revenir à la liste par défaut
          console.warn(`Liste d'exercices '${savedListId}' introuvable, retour à la liste par défaut`);
          localStorage.removeItem('selectedExerciseListId'); // Nettoyer le localStorage
          setSelectedListId('default');
        }
      }
    };

    initializeAndLoad();
  }, []);

  // Sauvegarder la liste sélectionnée dans le localStorage
  const handleSetSelectedListId = (listId: string) => {
    setSelectedListId(listId);
    localStorage.setItem('selectedExerciseListId', listId);
  };

  const value: ExerciseListContextType = {
    selectedListId,
    setSelectedListId: handleSetSelectedListId,
  };

  return (
    <ExerciseListContext.Provider value={value}>
      {children}
    </ExerciseListContext.Provider>
  );
}

export function useExerciseList(): ExerciseListContextType {
  const context = useContext(ExerciseListContext);
  if (context === undefined) {
    throw new Error('useExerciseList must be used within an ExerciseListProvider');
  }
  return context;
}