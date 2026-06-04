import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "exercice_list");
const dest = path.join(root, "public", "bundled-exercice-list");

fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  if (!name.endsWith(".json")) continue;
  fs.copyFileSync(path.join(src, name), path.join(dest, name));
}
console.log("Copied exercice_list → public/bundled-exercice-list/");
