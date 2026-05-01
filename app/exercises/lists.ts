import fs from 'fs/promises';
import path from 'path';
import { WorkoutConfig } from './types';
import { migrateWorkoutConfig, validateGroup } from './workout-config';
import { isGroupColorKey } from './group-colors';

const DEFAULT_DATA_DIR = '/tmp/sporty-data';
const EXERCISE_LISTS_DIR_NAME = 'exercise-lists';
const MANUAL_LISTS_DIR_NAME = 'manual-lists';

// Valider l'intégrité d'une liste d'exercices
function validateExerciseList(list: any): list is ExerciseList {
  if (!list || typeof list !== 'object') {
    return false;
  }

  // Vérifier les propriétés requises
  if (!list.id || typeof list.id !== 'string') {
    return false;
  }

  if (!list.name || typeof list.name !== 'string') {
    return false;
  }

  if (!list.createdAt || typeof list.createdAt !== 'string') {
    return false;
  }

  if (!list.updatedAt || typeof list.updatedAt !== 'string') {
    return false;
  }

  if (!list.config || typeof list.config !== 'object') {
    return false;
  }

  // Valider la configuration
  const config = list.config;
  if (typeof config.globalRestTime !== 'number' || config.globalRestTime < 0) {
    return false;
  }

  if (!config.groups || typeof config.groups !== 'object') {
    return false;
  }

  // Valider que les groupes sont des Group valides (structure unifiée)
  for (const [groupName, group] of Object.entries(config.groups)) {
    if (typeof groupName !== 'string' || !group || typeof group !== 'object') {
      return false;
    }

    const g = group as Record<string, unknown>;
    if (!g.id || typeof g.id !== 'string') return false;
    if (!g.name || typeof g.name !== 'string') return false;
    if (!g.icon || typeof g.icon !== 'string') return false;
    if (!isGroupColorKey(g.color)) return false;
    if (!g.createdAt || typeof g.createdAt !== 'string') return false;
    if (!Array.isArray(g.exercises)) return false;

    for (const exercise of g.exercises as unknown[]) {
      if (!exercise || typeof exercise !== 'object') return false;
      const ex = exercise as Record<string, unknown>;
      if (!ex.id || typeof ex.id !== 'string') return false;
      if (!ex.name || typeof ex.name !== 'string') return false;
      if (!ex.type || typeof ex.type !== 'string') return false;
      if (typeof ex.value !== 'number' || ex.value <= 0) return false;
    }
  }

  return true;
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

// Configuration du stockage (lu à l'exécution pour permettre DATA_DIR en tests)
function getListsDir(): string {
  const dataDir = process.env.DATA_DIR || DEFAULT_DATA_DIR;
  return path.join(dataDir, EXERCISE_LISTS_DIR_NAME);
}

// Dossier dédié aux imports manuels (non scanné automatiquement)
export function getManualListsDir(): string {
  const dataDir = process.env.DATA_DIR || DEFAULT_DATA_DIR;
  return path.join(dataDir, MANUAL_LISTS_DIR_NAME);
}

// S'assurer que le répertoire existe
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

// Générer un ID unique pour une liste
function generateListId(): string {
  return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Obtenir le chemin d'un fichier de liste
function getListFilePath(listId: string): string {
  return path.join(getListsDir(), `${listId}.json`);
}

// Lister toutes les listes disponibles
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

// Liste les fichiers JSON disponibles dans le dossier d'import manuel (sans effet secondaire)
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

export async function loadManualListConfig(fileName: string): Promise<WorkoutConfig> {
  const filePath = getSafeManualFilePath(fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(data);

  const rawConfig = parsed && typeof parsed === 'object' && 'config' in parsed
    ? (parsed as { config: unknown }).config
    : parsed;

  const migratedConfig = migrateWorkoutConfig(rawConfig);
  const validationError = validateImportedConfig(migratedConfig);
  if (validationError) {
    throw new Error(validationError);
  }

  return migratedConfig;
}

// Charger une liste spécifique
export async function loadExerciseList(listId: string): Promise<ExerciseList | null> {
  await ensureListsDir();

  try {
    const filePath = getListFilePath(listId);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(data);

    // Appliquer la migration si nécessaire (ancien format -> structure unifiée)
    if (parsedData.config) {
      const { migrateWorkoutConfig } = await import('./workout-config');
      parsedData.config = migrateWorkoutConfig(parsedData.config);
    }

    // Valider l'intégrité de la liste
    if (!validateExerciseList(parsedData)) {
      console.error(`Invalid exercise list structure for ${listId}`);
      return null;
    }

    return parsedData as ExerciseList;
  } catch (error) {
    // Ne logger que les erreurs autres que "fichier non trouvé" pour réduire le bruit
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      console.error(`Failed to load exercise list ${listId}:`, error);
    }
    return null;
  }
}

// Sauvegarder une liste
export async function saveExerciseList(list: ExerciseList): Promise<void> {
  await ensureListsDir();

  try {
    const filePath = getListFilePath(list.id);
    list.updatedAt = new Date().toISOString();
    await fs.writeFile(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to save exercise list ${list.id}:`, error);
    throw new Error(`Impossible de sauvegarder la liste d'exercices '${list.name}'. Vérifiez les permissions d'écriture et l'espace disque disponible.`);
  }
}

// Créer une nouvelle liste
export async function createExerciseList(name: string, description?: string): Promise<ExerciseList> {
  const list: ExerciseList = {
    id: generateListId(),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      globalRestTime: 5,
      groups: {},
    },
  };

  await saveExerciseList(list);
  return list;
}

// Supprimer une liste
export async function deleteExerciseList(listId: string): Promise<void> {
  await ensureListsDir();

  try {
    const filePath = getListFilePath(listId);
    await fs.unlink(filePath);
  } catch (error) {
    // Ne logger que les erreurs autres que "fichier non trouvé" pour réduire le bruit
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      console.error(`Failed to delete exercise list ${listId}:`, error);
    }
    throw new Error('Failed to delete exercise list');
  }
}

// Charger le seed par défaut depuis default-seed.json
async function loadDefaultSeedConfig(): Promise<WorkoutConfig> {
  try {
    const seedPath = path.join(process.cwd(), 'app', 'exercises', 'default-seed.json');
    const seedData = await fs.readFile(seedPath, 'utf-8');
    const rawConfig = JSON.parse(seedData);
    const groups = rawConfig.groups as Record<string, unknown>;
    if (groups && typeof groups === 'object') {
      const validGroups: Record<string, import('./types').Group> = {};
      for (const [groupName, group] of Object.entries(groups)) {
        if (validateGroup(group, groupName)) {
          validGroups[groupName] = group as import('./types').Group;
        }
      }
      return {
        globalRestTime: typeof rawConfig.globalRestTime === 'number' ? rawConfig.globalRestTime : 15,
        groups: validGroups,
      };
    }
    throw new Error('Invalid groups');
  } catch {
    console.warn('Default seed (default-seed.json) absent ou invalide');
    return {
      globalRestTime: 15,
      groups: {},
    };
  }
}

// Réinitialiser une liste cible avec le contenu du seed explicite
export async function seedExerciseList(listId: string): Promise<void> {
  const list = await loadExerciseList(listId);
  if (!list) {
    throw new Error('Liste introuvable');
  }
  const config = await loadDefaultSeedConfig();
  list.config = config;
  list.description = config.groups && Object.keys(config.groups).length > 0
    ? 'Liste d\'exercices migrée automatiquement'
    : 'Liste d\'exercices vide - à configurer';
  await saveExerciseList(list);
}

// Initialisation du système de listes (sans création implicite de liste par défaut)
export async function initializeExerciseLists(): Promise<void> {
  await ensureListsDir();
  await ensureManualListsDir();
  console.log('Exercise lists system initialized');
}