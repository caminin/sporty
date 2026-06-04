const fs = require("fs/promises");
const path = require("path");

const JSON_EXTENSION = ".json";

function resolvePaths(rootDir = process.cwd()) {
  return {
    srcDir: path.join(rootDir, "exercice_list"),
    destDir: path.join(rootDir, "public", "bundled-exercice-list"),
  };
}

async function listJsonFiles(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(JSON_EXTENSION))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function syncBundledExerciceList(rootDir = process.cwd()) {
  const { srcDir, destDir } = resolvePaths(rootDir);
  const sourceFiles = await listJsonFiles(srcDir);
  if (sourceFiles.length === 0) {
    throw new Error("Aucun fichier JSON trouvé dans exercice_list/");
  }

  await fs.mkdir(destDir, { recursive: true });

  const destFiles = await listJsonFiles(destDir);
  const sourceSet = new Set(sourceFiles);

  await Promise.all(
    destFiles
      .filter((name) => !sourceSet.has(name))
      .map((name) => fs.unlink(path.join(destDir, name)))
  );

  await Promise.all(
    sourceFiles.map((name) =>
      fs.copyFile(path.join(srcDir, name), path.join(destDir, name))
    )
  );

  return { srcDir, destDir, files: sourceFiles };
}

async function verifyBundledExerciceListSync(rootDir = process.cwd()) {
  const { srcDir, destDir } = resolvePaths(rootDir);
  const sourceFiles = await listJsonFiles(srcDir);
  const destFiles = await listJsonFiles(destDir);

  if (sourceFiles.length === 0) {
    throw new Error("Aucun fichier JSON trouvé dans exercice_list/");
  }

  const sourceSet = new Set(sourceFiles);
  const destSet = new Set(destFiles);
  const errors = [];

  for (const name of sourceFiles) {
    if (!destSet.has(name)) {
      errors.push(`Fichier manquant dans le bundle: ${name}`);
    }
  }
  for (const name of destFiles) {
    if (!sourceSet.has(name)) {
      errors.push(`Fichier en trop dans le bundle: ${name}`);
    }
  }

  for (const name of sourceFiles) {
    if (!destSet.has(name)) continue;
    const [sourceContent, destContent] = await Promise.all([
      fs.readFile(path.join(srcDir, name), "utf-8"),
      fs.readFile(path.join(destDir, name), "utf-8"),
    ]);
    if (sourceContent !== destContent) {
      errors.push(`Contenu différent pour ${name}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Bundle désynchronisé avec exercice_list/.\n${errors.join("\n")}\n` +
        "Exécutez `npm run bundle:sync` pour régénérer le bundle."
    );
  }

  return { srcDir, destDir, files: sourceFiles };
}

module.exports = {
  listJsonFiles,
  syncBundledExerciceList,
  verifyBundledExerciceListSync,
};
