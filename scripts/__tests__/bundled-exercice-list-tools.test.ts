import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";

const {
  syncBundledExerciceList,
  verifyBundledExerciceListSync,
} = require("../bundled-exercice-list-tools.cjs") as {
  syncBundledExerciceList: (rootDir: string) => Promise<{
    files: string[];
  }>;
  verifyBundledExerciceListSync: (rootDir: string) => Promise<{
    files: string[];
  }>;
};

describe("bundled exercice list tooling", () => {
  let rootDir: string;
  let sourceDir: string;
  let bundleDir: string;

  async function writeJson(dir: string, fileName: string, content: unknown) {
    await fs.writeFile(
      path.join(dir, fileName),
      `${JSON.stringify(content, null, 2)}\n`,
      "utf-8"
    );
  }

  beforeEach(async () => {
    rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "sporty-bundle-"));
    sourceDir = path.join(rootDir, "exercice_list");
    bundleDir = path.join(rootDir, "public", "bundled-exercice-list");
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(bundleDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(rootDir, { recursive: true, force: true });
  });

  it("synchronise les fichiers source et supprime les JSON obsolètes", async () => {
    await writeJson(sourceDir, "catalog.json", { exercises: { squat: { id: "squat" } } });
    await writeJson(sourceDir, "jambes.json", { name: "Jambes", exerciseRefs: [] });
    await writeJson(bundleDir, "catalog.json", { exercises: { old: { id: "old" } } });
    await writeJson(bundleDir, "obsolete.json", { legacy: true });

    const syncResult = await syncBundledExerciceList(rootDir);
    expect(syncResult.files).toEqual(["catalog.json", "jambes.json"]);

    const files = (await fs.readdir(bundleDir)).sort((a, b) => a.localeCompare(b));
    expect(files).toEqual(["catalog.json", "jambes.json"]);

    const [sourceCatalog, bundledCatalog] = await Promise.all([
      fs.readFile(path.join(sourceDir, "catalog.json"), "utf-8"),
      fs.readFile(path.join(bundleDir, "catalog.json"), "utf-8"),
    ]);
    expect(bundledCatalog).toBe(sourceCatalog);
  });

  it("échoue avec un message explicite si le bundle est désynchronisé", async () => {
    await writeJson(sourceDir, "catalog.json", { exercises: { squat: { id: "squat" } } });
    await writeJson(sourceDir, "jambes.json", { name: "Jambes", exerciseRefs: [] });

    await writeJson(bundleDir, "catalog.json", { exercises: { squat: { id: "squat", x: 1 } } });
    await writeJson(bundleDir, "extra.json", { stale: true });

    await expect(verifyBundledExerciceListSync(rootDir)).rejects.toThrow(
      /Bundle désynchronisé/
    );
    await expect(verifyBundledExerciceListSync(rootDir)).rejects.toThrow(
      /Fichier manquant dans le bundle: jambes\.json/
    );
    await expect(verifyBundledExerciceListSync(rootDir)).rejects.toThrow(
      /Fichier en trop dans le bundle: extra\.json/
    );
    await expect(verifyBundledExerciceListSync(rootDir)).rejects.toThrow(
      /Contenu différent pour catalog\.json/
    );
  });
});
