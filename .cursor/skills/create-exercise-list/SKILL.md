---
name: create-exercise-list
description: Create new workout exercise lists in `exercice_list` with valid catalog + group reference structure.
license: MIT
compatibility: Expects `WorkoutConfig` with `exercises` catalog and `groups` containing references.
metadata:
  author: user
  version: "2.3"
  generatedBy: "split-catalog-groups-io"
---

Create an exercise list that can be saved in `exercice_list/*.json` and imported by the app.

**Input**: Optional description from user containing:

- list name (required)
- one or more **session groups** (e.g. *Explosivité jambes*, *Cardio*) — defined in JSON `groups`, not via admin UI
- for each group: which catalog exercises to include (`refId`, `exerciseId`); default duration/reps come from the catalog
- optional: source template (`global`, `dynamisme-jambes-mollets-core`, custom JSON)

Reject vague requests and ask clarifying questions first.

## What to produce

### Fichier complet (`exercice_list/*.json` ou import manuel dossier)

Single JSON object:

- `globalRestTime`: number `>= 0`
- `exercises`: object keyed by exercise `id` (catalog)
- `groups`: object keyed by session group display name

### Admin — deux exports/imports séparés

**Catalogue** (onglet Liste d'exercices):

```json
{
  "globalRestTime": 30,
  "exercises": {
    "ex-id": { "id", "name", "type", "value", "muscleGroup" }
  }
}
```

**Groupes de séance** (onglet Listes de groupes, après catalogue importé):

```json
{
  "globalRestTime": 30,
  "groups": {
    "Nom affiché": {
      "id", "name", "icon", "color", "createdAt",
      "exercises": [{ "refId", "exerciseId", "value?" }]
    }
  }
}
```

### Catalog entry rules

- each entry: `{ id, name, type, value, muscleGroup }` where `type` is `time` or `reps`, `value` is positive
- `muscleGroup` is anatomical (e.g. *Split step rapide* → `jambes`), **not** the session group name
- allowed keys: `jambes | mollets | fessiers | dos | epaules | bras | abdos | pecs | autre`

### Group reference rules

- `exercises` in a group is an array of **references**:
  - `{ refId, exerciseId }` — omit `value` unless intentional override in JSON
  - `refId` unique within the group
  - every `exerciseId` **must** exist in the list catalog — import fails with an explicit error otherwise

**Do not** embed `{ id, name, type, value }` directly in group `exercises` arrays (legacy format — rejected).

## Execution rules

1. Ask missing details before generating output:
   - Nom de la liste
   - Temps de repos global
   - Groupes de séance à créer (nom, icône, couleur)
   - Exercices du catalogue (nom, type, valeur par défaut, **groupe musculaire**)
   - Quels exercices dans quels groupes de séance (par `muscleGroup` si besoin)
   - Nouvelles listes : import catalogue JSON dans l'admin (pas de formulaire « liste vide »)

2. Use existing files as templates when user asks explicitly:
   - `exercice_list/global.json`, `exercice_list/dynamisme-jambes-mollets-core.json`
   - Extend only where requested; keep catalog ids and refIds unless user asks to regenerate.

3. Generate deterministic IDs:
   - `grp-<slug>` for session groups
   - `ex-<slug>` for catalog exercises
   - `refId` = `exerciseId` when a single placement per group

4. Validate before finalizing:
   - `exercises` map present with `muscleGroup` on every entry
   - every group ref resolves to a catalog `exerciseId`
   - no embedded exercises with `name` in group arrays
   - `color` in allowed palette: `red | blue | purple | yellow | emerald | primary | orange | cyan`

5. Output format:
   - Return full JSON in a markdown fenced block + short validation summary
   - If asked to write file: `exercice_list/<slug-list-name>.json` (format complet)

6. Error handling:
   - If input cannot map to valid structure, explain what is missing
   - Prefer asking for minimal correction instead of inventing assumptions

## Suggested response style

- Short and actionable
- Explicitly list required user confirmations when a field is missing
- No extra design or UI prose unless requested
