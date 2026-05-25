## Why

L’onglet **Import / Export** mélange catalogue et groupes de séance dans un seul JSON `WorkoutConfig`, ce qui complique les échanges ciblés (mettre à jour uniquement les exercices ou uniquement les groupes). De plus, l’import catalogue ne propose pas de remplacer le catalogue existant, et les références orphelines dans les groupes sont parfois ignorées silencieusement au lieu d’échouer clairement.

## What Changes

- **BREAKING** : la page admin n’expose plus que **deux onglets** — **Liste d’exercices** et **Listes de groupes** ; l’onglet **Import / Export** est supprimé.
- **Import / export catalogue** (onglet Liste d’exercices) : JSON dédié au catalogue (`exercises` + optionnellement `globalRestTime`) ; export et import (collage ou fichier) dans cet onglet uniquement.
- **Import / export groupes** (onglet Listes de groupes) : JSON dédié aux groupes de séance (`groups` + optionnellement `globalRestTime`) ; export et import dans cet onglet uniquement.
- **BREAKING** : `importListFromJson` / export monolithique `WorkoutConfig` ne sont plus le flux principal admin ; remplacés par des actions distinctes catalogue vs groupes.
- À l’**import catalogue** sur une liste existante : confirmation « Supprimer tous les exercices actuels avant import ? » — si oui, le catalogue local est vidé puis remplacé ; si non, fusion par `exerciseId` (comportement merge actuel).
- À l’**import groupes** : validation stricte — toute référence dont `exerciseId` est absent du catalogue **échoue** avec un message d’erreur explicite (groupe + id manquant) ; aucune création silencieuse de références invalides.
- Création d’une **nouvelle liste** : uniquement via import catalogue (nom requis), comme aujourd’hui mais depuis l’onglet catalogue.
- Mise à jour de tous les appels UI (`CatalogTab`, `GroupsTab`, `page.tsx`), suppression de `ImportExportTab.tsx` et des liens « Aller à Import / Export ».

## Capabilities

### New Capabilities

_Aucune — évolution des capacités existantes._

### Modified Capabilities

- `group-settings` : deux onglets seulement ; import/export intégrés dans chaque onglet selon son périmètre.
- `catalog-export-import-merge` : formats et flux séparés catalogue / groupes ; règles de remplacement catalogue ; validation stricte des références à l’import groupes.
- `json-import-list` : import liste complète remplacé par import catalogue (création liste) ; import groupes sur liste active.
- `exercise-catalog` : export/import catalogue depuis l’onglet dédié.
- `group-exercise-references` : erreur explicite si `exerciseId` absent du catalogue à l’import ou à la validation.
- `list-system-testing` : scénarios mis à jour (deux formats, confirmation remplacement, rejet références orphelines).
- `manual-list-import-folder` : alignement si le dossier manuel importe encore un fichier complet (à préciser en design).

## Impact

- `app/group-settings/page.tsx`, `CatalogTab.tsx`, `GroupsTab.tsx` — suppression `ImportExportTab.tsx`
- `app/exercises/workout-config.ts` — `exportCatalogToJson`, `exportGroupsToJson`, parse/merge séparés, validation références
- `app/exercises/lists-actions.ts` — actions `importCatalogFromJson`, `importGroupsFromJson`, `replaceCatalog` flag
- `app/exercises/actions.ts` — si mutations serveur nécessaires
- Tests : `app/exercises/__tests__/migration.test.ts`, `app/__tests__/entities/exercise-lists/`
- Specs OpenSpec : `group-settings`, `catalog-export-import-merge`, `json-import-list`, `exercise-catalog`, `group-exercise-references`, `list-system-testing`
- `.cursor/skills/create-exercise-list/SKILL.md` — documenter les deux formats JSON
