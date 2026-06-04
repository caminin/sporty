import path from "path";
import { fileURLToPath } from "url";
import tools from "./bundled-exercice-list-tools.cjs";

const { verifyBundledExerciceListSync } = tools;
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  const result = await verifyBundledExerciceListSync(root);
  console.log(
    `Bundled exercice list synchronisée (${result.files.length} fichiers vérifiés)`
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Échec de la vérification du bundle"
  );
  process.exitCode = 1;
}
