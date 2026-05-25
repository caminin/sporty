import fs from 'fs/promises';
import path from 'path';
import { WorkoutConfig } from './types';
import {
  parseWorkoutConfig,
  validateWorkoutConfig,
} from './workout-config';
import { isGroupColorKey } from './group-colors';

function validateExerciseList(list: unknown): list is ExerciseList {
  if (!list || typeof list !== 'object') {
    return false;
  }

  const l = list as Record<string, unknown>;

  if (!l.id || typeof l.id !== 'string') return false;
  if (!l.name || typeof l.name !== 'string') return false;
  if (!l.createdAt || typeof l.createdAt !== 'string') return false;
  if (!l.updatedAt || typeof l.updatedAt !== 'string') return false;
  if (!l.config || typeof l.config !== 'object') return false;

  const parsed = parseWorkoutConfig(l.config);
  return !parsed.error && Boolean(parsed.config);
}

export interface ExerciseListMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseList extends ExerciseListMetadata {
  config: WorkoutConfig;
}

const DEFAULT_DATA_DIR = '/tmp/sporty-data';
const EXERCISE_LISTS_DIR_NAME = 'exercise-lists';
const MANUAL_LISTS_DIR_NAME = 'manual-lists';

function getListsDir(): string {
  const dataDir = process.env.DATA_DIR || DEFAULT_DATA_DIR;
  return path.join(dataDir, EXERCISE_LISTS_DIR_NAME);
}

export function getManualListsDir(): string {
  const dataDir = process.env.DATA_DIR || DEFAULT_DATA_DIR;
  return path.join(dataDir, MANUAL_LISTS_DIR_NAME);
}

async function ensureListsDir(): Promise<void> {
  const listsDir = getListsDir();
  try {
    await fs.access(listsDir);
  } catch {
    await fs.mkdir(listsDir, { recursive: true });
  }
}

async function ensureManualListsDir(): Promise<void> {
  const manualListsDir = getManualListsDir();
  try {
    await fs.access(manualListsDir);
  } catch {
    await fs.mkdir(manualListsDir, { recursive: true });
  }
}

function generateListId(): string {
  return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getListFilePath(listId: string): string {
  return path.join(getListsDir(), `${listId}.json`);
}

export async function listExerciseLists(): Promise<ExerciseListMetadata[]> {
  await ensureListsDir();

  try {
    const files = await fs.readdir(getListsDir());
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const lists: ExerciseListMetadata[] = [];
    for (const file of jsonFiles) {
      const listId = file.replace('.json', '');
      try {
        const list = await loadExerciseList(listId);
        if (list) {
          lists.push({
            id: list.id,
            name: list.name,
            description: list.description,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
          });
        } else {
          console.warn(`Skipping corrupted list ${listId}`);
        }
      } catch (error) {
        console.warn(`Failed to load list ${listId}, skipping:`, error);
      }
    }

    return lists.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to list exercise lists:', error);
    return [];
  }
}

export async function listManualListFiles(): Promise<string[]> {
  await ensureManualListsDir();
  try {
    const files = await fs.readdir(getManualListsDir());
    return files
      .filter((file) => file.toLowerCase().endsWith('.json'))
      .filter((file) => !file.startsWith('.'));
  } catch {
    return [];
  }
}

function getSafeManualFilePath(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    throw new Error('Nom de fichier invalide');
  }

  const normalized = path.basename(fileName);
  if (normalized !== fileName || normalized.includes('..')) {
    throw new Error('Nom de fichier invalide');
  }

  return path.join(getManualListsDir(), normalized);
}

export function validateImportedConfig(config: WorkoutConfig): string | null {
  return validateWorkoutConfig(config);
}

export async function loadManualListConfig(fileName: string): Promise<WorkoutConfig> {
  const filePath = getSafeManualFilePath(fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(data);

  const rawConfig = parsed && typeof parsed === 'object' && 'config' in parsed
    ? (parsed as { config: unknown }).config
    : parsed;

  const result = parseWorkoutConfig(rawConfig);
  if (result.error || !result.config) {
    throw new Error(result.error ?? 'Configuration invalide');
  }

  return result.config;
}

export async function loadExerciseList(listId: string): Promise<ExerciseList | null> {
  await ensureListsDir();

  try {
    const filePath = getListFilePath(listId);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(data) as ExerciseList;

    if (parsedData.config) {
      const result = parseWorkoutConfig(parsedData.config);
      if (result.error || !result.config) {
        console.error(`Invalid exercise list structure for ${listId}: ${result.error}`);
        return null;
      }
      parsedData.config = result.config;
    }

    if (!validateExerciseList(parsedData)) {
      console.error(`Invalid exercise list structure for ${listId}`);
      return null;
    }

    return parsedData;
  } catch (error) {
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      console.error(`Failed to load exercise list ${listId}:`, error);
    }
    return null;
  }
}

export async function saveExerciseList(list: ExerciseList): Promise<void> {
  await ensureListsDir();

  const validationError = validateWorkoutConfig(list.config);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const filePath = getListFilePath(list.id);
    list.updatedAt = new Date().toISOString();
    await fs.writeFile(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to save exercise list ${list.id}:`, error);
    throw new Error(`Impossible de sauvegarder la liste d'exercices '${list.name}'. Vérifiez les permissions d'écriture et l'espace disque disponible.`);
  }
}

export async function createExerciseList(name: string, description?: string): Promise<ExerciseList> {
  const list: ExerciseList = {
    id: generateListId(),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      globalRestTime: 5,
      exercises: {},
      groups: {},
    },
  };

  await saveExerciseList(list);
  return list;
}

export async function deleteExerciseList(listId: string): Promise<void> {
  await ensureListsDir();

  try {
    const filePath = getListFilePath(listId);
    await fs.unlink(filePath);
  } catch (error) {
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      console.error(`Failed to delete exercise list ${listId}:`, error);
    }
    throw new Error('Failed to delete exercise list');
  }
}

export async function initializeExerciseLists(): Promise<void> {
  await ensureListsDir();
  await ensureManualListsDir();
  console.log('Exercise lists system initialized');
}
