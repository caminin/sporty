'use server';

import {
  listExerciseLists,
  loadExerciseList,
  saveExerciseList,
  createExerciseList,
  deleteExerciseList,
  initializeExerciseLists,
  listManualListFiles,
  loadManualListConfig,
} from './lists';
import { WorkoutConfig } from './types';
import {
  parseWorkoutConfig,
  parseCatalogJson,
  parseGroupsJson,
  applyCatalogImport,
  mergeImportedGroups,
} from './workout-config';
import { validateImportedConfig } from './lists';

// Vérifier l'authentification admin (mot de passe depuis ADMIN_PASSWORD, fallback 'sporty' en dev)
function verifyAdminAuth(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'sporty';
  return password === expected;
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

export async function getManualListFiles(password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  try {
    const files = await listManualListFiles();
    return { success: true, files };
  } catch (error) {
    console.error('Failed to list manual list files:', error);
    return { success: false, error: 'Impossible de lister les fichiers d\'import manuel' };
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

  try {
    await deleteExerciseList(listId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete exercise list:', error);
    return { success: false, error: 'Failed to delete list' };
  }
}

// Importer un fichier ciblé depuis manual-lists (sans scan automatique)
export async function importListFromManualFolder(fileName: string, listName: string, password: string): Promise<{ success: boolean; listId?: string; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  if (!listName.trim()) {
    return { success: false, error: 'Le nom de la liste est requis' };
  }
  if (!fileName.trim()) {
    return { success: false, error: 'Le fichier à importer est requis' };
  }

  try {
    const config = await loadManualListConfig(fileName.trim());
    const list = await createExerciseList(listName.trim());
    list.config = config;
    await saveExerciseList(list);
    return { success: true, listId: list.id };
  } catch (error) {
    console.error('Failed to import list from manual folder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Impossible d\'importer la liste depuis le dossier manuel'
    };
  }
}

// Vérifier l'authentification admin
export async function verifyAdmin(password: string) {
  const isValid = verifyAdminAuth(password);
  return { success: isValid };
}

export async function importCatalogFromJson(
  json: string,
  password: string,
  options: { listName?: string; listId?: string; replaceAll?: boolean }
): Promise<{ success: boolean; listId?: string; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Mot de passe admin invalide' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON invalide' };
  }

  const raw =
    parsed && typeof parsed === 'object' && 'config' in parsed
      ? (parsed as { config: unknown }).config
      : parsed;

  const parseResult = parseCatalogJson(raw);
  if (parseResult.error || !parseResult.payload) {
    return { success: false, error: parseResult.error ?? 'Catalogue invalide' };
  }

  const { listId, listName, replaceAll = false } = options;

  try {
    if (!listId) {
      if (!listName?.trim()) {
        return { success: false, error: 'Le nom de la liste est requis' };
      }
      const list = await createExerciseList(listName.trim());
      list.config = {
        globalRestTime: parseResult.payload.globalRestTime ?? 30,
        exercises: parseResult.payload.exercises,
        groups: {},
      };
      await saveExerciseList(list);
      return { success: true, listId: list.id };
    }

    const existingList = await loadExerciseList(listId);
    if (!existingList) {
      return { success: false, error: 'Liste introuvable' };
    }

    existingList.config = applyCatalogImport(
      existingList.config,
      parseResult.payload,
      replaceAll
    );
    await saveExerciseList(existingList);
    return { success: true, listId: existingList.id };
  } catch (error) {
    console.error('Failed to import catalog:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Impossible d\'importer le catalogue',
    };
  }
}

export async function importGroupsFromJson(
  json: string,
  listId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Mot de passe admin invalide' };
  }

  if (!listId.trim()) {
    return { success: false, error: 'Sélectionnez une liste active' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON invalide' };
  }

  const raw =
    parsed && typeof parsed === 'object' && 'config' in parsed
      ? (parsed as { config: unknown }).config
      : parsed;

  const parseResult = parseGroupsJson(raw);
  if (parseResult.error || !parseResult.payload) {
    return { success: false, error: parseResult.error ?? 'Groupes invalides' };
  }

  try {
    const existingList = await loadExerciseList(listId);
    if (!existingList) {
      return { success: false, error: 'Liste introuvable' };
    }

    if (Object.keys(existingList.config.exercises).length === 0) {
      return {
        success: false,
        error: 'Importez d\'abord un catalogue d\'exercices dans l\'onglet Liste d\'exercices.',
      };
    }

    existingList.config = mergeImportedGroups(
      existingList.config,
      parseResult.payload.groups,
      parseResult.payload.globalRestTime
    );
    await saveExerciseList(existingList);
    return { success: true };
  } catch (error) {
    console.error('Failed to import groups:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Impossible d\'importer les groupes',
    };
  }
}

/** Import complet — utilisé par import manuel dossier uniquement */
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

  const parseResult = parseWorkoutConfig(rawConfig);
  if (parseResult.error || !parseResult.config) {
    return { success: false, error: parseResult.error ?? 'Configuration invalide' };
  }
  const config = parseResult.config;
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