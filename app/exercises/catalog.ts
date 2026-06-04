import fs from "fs/promises";
import path from "path";
import type { GlobalCatalog } from "./types";
import { normalizeCatalog } from "./workout-config";

const DEFAULT_DATA_DIR = "/tmp/sporty-data";
const CATALOG_FILE_NAME = "catalog.json";

function getDataDir(): string {
    return process.env.DATA_DIR || DEFAULT_DATA_DIR;
}

export function getCatalogFilePath(): string {
    return path.join(getDataDir(), CATALOG_FILE_NAME);
}

export async function loadGlobalCatalog(): Promise<GlobalCatalog> {
    try {
        const data = await fs.readFile(getCatalogFilePath(), "utf-8");
        const parsed = JSON.parse(data) as unknown;
        const catalog = normalizeCatalog(
            parsed && typeof parsed === "object" && "exercises" in parsed
                ? (parsed as GlobalCatalog).exercises
                : (parsed as GlobalCatalog)?.exercises ?? parsed
        );
        if (!catalog) {
            throw new Error("Catalogue global invalide");
        }
        return { exercises: catalog };
    } catch (error) {
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            (error as NodeJS.ErrnoException).code === "ENOENT"
        ) {
            return { exercises: {} };
        }
        throw error;
    }
}

export async function saveGlobalCatalog(catalog: GlobalCatalog): Promise<void> {
    const normalized = normalizeCatalog(catalog.exercises);
    if (!normalized) {
        throw new Error("Catalogue invalide");
    }
    const dir = getDataDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
        getCatalogFilePath(),
        JSON.stringify({ exercises: normalized }, null, 2),
        "utf-8"
    );
}
