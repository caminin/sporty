'use server';

import {
  listTrainings,
  loadTraining,
  saveTraining,
  createTraining,
  deleteTraining,
  initializeExerciseLists,
  listManualListFiles,
  loadManualFileRaw,
} from './lists';
import { loadGlobalCatalog, saveGlobalCatalog } from './catalog';
import {
  parseCatalogJson,
  parseTrainingJson,
  applyGlobalCatalogImport,
  applyTrainingImport,
  validateTrainingRefsAgainstCatalog,
} from './workout-config';
import { resetBundledData, initFromBundleIfEmpty } from './reset-bundled';
import { verifyAdminAuth } from './admin-auth';
import type { GlobalCatalog, Training } from './types';

export { verifyAdminAuth };

export async function initializeLists() {
  try {
    await initializeExerciseLists();
    await initFromBundleIfEmpty();
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize:', error);
    return { success: false, error: 'Failed to initialize' };
  }
}

export async function getManualListFiles(password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }
  try {
    const files = await listManualListFiles();
    return { success: true, files };
  } catch {
    return { success: false, error: 'Impossible de lister les fichiers d\'import manuel' };
  }
}

export async function getExerciseLists() {
  try {
    await initializeExerciseLists();
    await initFromBundleIfEmpty();
    const lists = await listTrainings();
    return { success: true, lists };
  } catch {
    return { success: false, error: 'Failed to load trainings' };
  }
}

export async function getExerciseList(trainingId: string) {
  try {
    const training = await loadTraining(trainingId);
    if (!training) {
      return { success: false, error: 'Training not found' };
    }
    return { success: true, list: training };
  } catch {
    return { success: false, error: 'Failed to load training' };
  }
}

export async function removeList(trainingId: string, password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }
  try {
    await deleteTraining(trainingId);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete training' };
  }
}

export async function verifyAdmin(password: string) {
  return { success: verifyAdminAuth(password) };
}

export async function importGlobalCatalogFromJson(
  json: string,
  password: string,
  options: { replaceAll?: boolean }
): Promise<{ success: boolean; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Mot de passe admin invalide' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON invalide' };
  }

  const parseResult = parseCatalogJson(parsed);
  if (parseResult.error || !parseResult.payload) {
    return { success: false, error: parseResult.error ?? 'Catalogue invalide' };
  }

  try {
    const local = await loadGlobalCatalog();
    const { replaceAll = false } = options;

    if (replaceAll) {
      const loaded = await Promise.all(
        (await listTrainings()).map((m) => loadTraining(m.id))
      );
      const valid = loaded.filter((t): t is Training => t !== null);
      for (const t of valid) {
        for (const ref of t.exerciseRefs) {
          if (!parseResult.payload.exercises[ref.exerciseId]) {
            return {
              success: false,
              error: `Impossible de remplacer : « ${ref.exerciseId} » manquant (entraînement « ${t.name} »).`,
            };
          }
        }
      }
    }

    const updated = applyGlobalCatalogImport(
      local,
      parseResult.payload,
      replaceAll
    );
    await saveGlobalCatalog(updated);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Impossible d\'importer le catalogue',
    };
  }
}

/** @deprecated */
export const importCatalogFromJson = importGlobalCatalogFromJson;

export async function importTrainingFromJson(
  json: string,
  password: string,
  options: { trainingName?: string; trainingId?: string; replaceRefs?: boolean }
): Promise<{ success: boolean; trainingId?: string; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Mot de passe admin invalide' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON invalide' };
  }

  const parseResult = parseTrainingJson(parsed);
  if (parseResult.error || !parseResult.payload) {
    return { success: false, error: parseResult.error ?? 'Entraînement invalide' };
  }

  const catalog = await loadGlobalCatalog();
  const refError = validateTrainingRefsAgainstCatalog(
    catalog,
    parseResult.payload.exerciseRefs
  );
  if (refError) {
    return { success: false, error: refError };
  }

  const { trainingId, trainingName, replaceRefs = false } = options;

  try {
    if (!trainingId) {
      if (!trainingName?.trim() && !parseResult.payload.name?.trim()) {
        return { success: false, error: 'Le nom de l\'entraînement est requis' };
      }
      const training = await createTraining(
        (trainingName ?? parseResult.payload.name)!.trim()
      );
      const updated = applyTrainingImport(training, parseResult.payload, true);
      await saveTraining(updated);
      return { success: true, trainingId: updated.id };
    }

    const existing = await loadTraining(trainingId);
    if (!existing) {
      return { success: false, error: 'Entraînement introuvable' };
    }

    const updated = applyTrainingImport(
      existing,
      parseResult.payload,
      replaceRefs
    );
    await saveTraining(updated);
    return { success: true, trainingId: updated.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Impossible d\'importer l\'entraînement',
    };
  }
}

export async function resetToBundledDefaults(password: string) {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Mot de passe admin invalide' };
  }
  try {
    await resetBundledData();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Échec de la réinitialisation',
    };
  }
}

export async function importListFromManualFolder(
  fileName: string,
  _listName: string,
  password: string
): Promise<{ success: boolean; trainingId?: string; error?: string }> {
  if (!verifyAdminAuth(password)) {
    return { success: false, error: 'Invalid admin password' };
  }

  try {
    const raw = await loadManualFileRaw(fileName.trim());
    const catalogResult = parseCatalogJson(raw);
    if (!catalogResult.error && catalogResult.payload) {
      const local = await loadGlobalCatalog();
      await saveGlobalCatalog(
        applyGlobalCatalogImport(local, catalogResult.payload, false)
      );
      return { success: true };
    }

    const trainingResult = parseTrainingJson(raw);
    if (!trainingResult.error && trainingResult.payload) {
      return importTrainingFromJson(JSON.stringify(raw), password, {
        trainingName: trainingResult.payload.name,
        replaceRefs: true,
      });
    }

    return { success: false, error: catalogResult.error ?? trainingResult.error ?? 'Format invalide' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Import manuel impossible',
    };
  }
}
