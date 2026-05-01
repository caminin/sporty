---
name: create-exercise-list
description: Create new workout exercise lists in `exercice_list` with valid structure.
license: MIT
compatibility: Expects app/workout-config shape (`WorkoutConfig` with `Group` objects).
metadata:
  author: user
  version: "1.0"
  generatedBy: "skill-generation"
---

Create an exercise list that can be saved in `exercice_list/*.json` and later imported by the app.

**Input**: Optional description from user containing:

- list name (required)
- one or more groups
- for each group: exercise type and value
- optional: source template (`calm`, `global`, custom JSON)

Reject vague requests and ask clarifying questions first.

## What to produce

When requested, generate a JSON object matching:

- `globalRestTime`: number `>= 0`
- `groups`: object keyed by group display name
- each group object with:
  - `id`: string
  - `name`: string
  - `icon`: valid lucide icon name (e.g. `activity`, `target`, `zap`, `footprints`)
  - `color`: palette key (required) in: `red | blue | purple | yellow | emerald | primary | orange | cyan`
  - `createdAt`: ISO datetime string
  - `exercises`: array of `{ id, name, type, value }`
- each exercise:
  - `id`: string
  - `name`: string
  - `type`: `time` or `reps`
  - `value`: positive number

## Execution rules

1. Ask missing details before generating output:
   - Nom de la liste
   - Temps de repos global
   - Groupes à créer
   - Pour chaque groupe: nom, icône, exercices
   - Pour chaque exercice: nom, type (`time`/`reps`), valeur

2. Use existing files as seed when user asks explicitly:
   - Source `calm` → base on `exercice_list/calm.json`
   - Source `global` → base on `exercice_list/global.json`
   - Extend only where requested; keep original order and ids unless user asks to regenerate.

3. Generate deterministic IDs:
   - Keep existing exercise IDs if copied from source
   - For new entries, prefix with safe group code:
     - `grp-<slug>` for groups
     - `ex-<slug>-<index>` for new exercises
   - Keep consistency if user re-runs generation from same input.

4. Validate before finalizing:
   - `globalRestTime` is a number and non-negative
   - every group has id/name/icon/color/createdAt/exercises
   - `color` must be one of: `red`, `blue`, `purple`, `yellow`, `emerald`, `primary`, `orange`, `cyan`
   - every exercise has id/name/type/value and type is `time` or `reps`
   - `value` is a positive number

5. Output format:
   - Return the full JSON in markdown fenced block.
   - Include a short validation summary.
   - If asked to write file, create/update:
     - `exercice_list/<slug-list-name>.json`

6. Error handling:
   - If the input cannot map to valid structure, explain exactly what is missing/invalid.
   - Prefer asking for minimal correction instead of inventing assumptions.

## Suggested response style

- Short and actionable
- Explicitly list required user confirmations when a field is missing
- No extra design or UI prose unless requested
