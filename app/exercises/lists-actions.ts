'use server';

import { listExerciseLists, loadExerciseList, saveExerciseList, createExerciseList, deleteExerciseList, initializeExerciseLists } from './lists';
import { WorkoutConfig } from './types';
import { migrateWorkoutConfig, validateGroup } from './workout-config';

// Vérifier l'authentification admin
function verifyAdminAuth(password: string): boolean {
  return password === 'sporty';
}

// Initialiser le système de listes
export async function initializeLists() {
  try {
    await initializeExerciseLists();
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize lists:', error);
    return { success: false, error: 'Failed to initialize lists' };
  }
}

// Lister toutes les listes disponibles
export async function getExerciseLists() {
  try {
    const lists = await listExerciseLists();
    return { success: true, lists };
  } catch (error) {
    console.error('Failed to get exercise lists:', error);
    return { success: false, error: 'Failed to load lists' };
  }
}

// Charger une liste spécifique
export async function getExerciseList(listId: string) {
  try {
    const list = await loadExerciseList(listId);
    if (!list) {
      return { success: false, error: 'List not found' };
    }
    return { success: true, list };
  } catch (error) {
    console.error('Failed to load exercise list:', error);
    return { success: false, error: 'Failed to load list' };
  }
}

// Sauvegarder une liste (nécessite authentification admin)
export async function saveList(listId: string, config: WorkoutConfig, password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  try {
    // Charger la liste existante pour préserver les métadonnées
    const existingList = await loadExerciseList(listId);
    if (!existingList) {
      return { success: false, error: 'List not found' };
    }

    // Mettre à jour la configuration
    existingList.config = config;
    await saveExerciseList(existingList);

    return { success: true };
  } catch (error) {
    console.error('Failed to save exercise list:', error);
    return { success: false, error: 'Failed to save list' };
  }
}

// Créer une nouvelle liste (nécessite authentification admin)
export async function createList(name: string, description: string | undefined, password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  try {
    const list = await createExerciseList(name, description);
    return { success: true, list };
  } catch (error) {
    console.error('Failed to create exercise list:', error);
    return { success: false, error: 'Failed to create list' };
  }
}

// Supprimer une liste (nécessite authentification admin)
export async function removeList(listId: string, password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  // Ne pas permettre la suppression de la liste par défaut
  if (listId === 'default') {
    return { success: false, error: 'Cannot delete default list' };
  }

  try {
    await deleteExerciseList(listId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete exercise list:', error);
    return { success: false, error: 'Failed to delete list' };
  }
}

// Vérifier l'authentification admin
export async function verifyAdmin(password: string) {
  const isValid = verifyAdminAuth(password);
  return { success: isValid };
}

function validateImportedConfig(config: WorkoutConfig): string | null {
  if (typeof config.globalRestTime !== 'number' || config.globalRestTime < 0) {
    return 'globalRestTime invalide (doit être un nombre >= 0)';
  }
  if (!config.groups || typeof config.groups !== 'object') {
    return 'Structure des groupes incorrecte';
  }
  for (const [groupName, group] of Object.entries(config.groups)) {
    if (!validateGroup(group, groupName)) {
      return `Groupe '${groupName}' invalide : structure incorrecte`;
    }
  }
  return null;
}

export async function importListFromJson(
  json: string,
  listName: string,
  password: string
): Promise<{ success: boolean; listId?: string; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  if (!listName.trim()) {
    return { success: false, error: 'Le nom de la liste est requis' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON invalide' };
  }

  const rawConfig =
    parsed && typeof parsed === 'object' && 'config' in parsed
      ? (parsed as { config: unknown }).config
      : parsed;

  const config = migrateWorkoutConfig(rawConfig);
  const validationError = validateImportedConfig(config);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const list = await createExerciseList(listName.trim());
    list.config = config;
    await saveExerciseList(list);
    return { success: true, listId: list.id };
  } catch (error) {
    console.error('Failed to import list:', error);
    return { success: false, error: 'Impossible de créer la liste' };
  }
}