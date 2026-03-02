import fs from 'fs/promises';
import path from 'path';
import { deleteExerciseList } from '../../exercises/lists';

/**
 * Configuration Jest pour les tests avec système de fichiers temporaire
 */
export function getTestDataDir(): string {
  const testName = expect.getState().currentTestName?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
  return path.join(process.cwd(), 'tmp', 'test-data', testName, Date.now().toString());
}

/**
 * Liste des IDs de listes créées pendant le test pour nettoyage automatique
 */
const createdListIds: string[] = [];

/**
 * Fonction utilitaire pour créer une liste de test avec suivi automatique
 */
export async function createTrackedExerciseList(name: string, description?: string) {
  const { createExerciseList } = await import('../../exercises/lists');
  const list = await createExerciseList(name, description);
  createdListIds.push(list.id);
  return list;
}

/**
 * Setup commun pour les tests nécessitant un système de fichiers temporaire
 */
export const tempFilesystemSetup = {
  beforeEach: async () => {
    // Définir DATA_DIR dès le départ pour éviter l'utilisation du répertoire par défaut
    const testDataDir = getTestDataDir();
    process.env.DATA_DIR = testDataDir;

    // Vider la liste des IDs créés
    createdListIds.length = 0;

    await fs.mkdir(path.dirname(testDataDir), { recursive: true });

    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch {
      // Ignore si le répertoire n'existe pas
    }
    await fs.mkdir(testDataDir, { recursive: true });
  },

  afterEach: async () => {
    // Nettoyer automatiquement toutes les listes créées pendant le test
    for (const listId of createdListIds) {
      try {
        await deleteExerciseList(listId);
      } catch {
        // Ignore les erreurs de suppression
      }
    }
    createdListIds.length = 0;

    const testDataDir = process.env.DATA_DIR;
    if (testDataDir && testDataDir.includes('tmp/test-data')) {
      try {
        await fs.rm(testDataDir, { recursive: true, force: true });
      } catch {
        // Ignore si le nettoyage échoue
      }
    }
    delete process.env.DATA_DIR;

    // Nettoyage : supprimer uniquement les répertoires de test temporaires
    // Ne jamais toucher à /tmp/sporty-data (données utilisateur en dev)
    try {
      const tmpDir = path.join(process.cwd(), 'tmp', 'test-data');
      const entries = await fs.readdir(tmpDir);
      for (const entry of entries) {
        const entryPath = path.join(tmpDir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
          await fs.rm(entryPath, { recursive: true, force: true });
        }
      }
    } catch {
      // Ignore les erreurs de nettoyage
    }
  },

  afterAll: async () => {
    try {
      const tmpDir = path.join(process.cwd(), 'tmp', 'test-data');
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore les erreurs de nettoyage final
    }
  }
};