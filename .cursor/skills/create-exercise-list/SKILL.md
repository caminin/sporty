---
name: create-exercise-list
description: Create global catalog and training JSON files in exercice_list for Sporty.
license: MIT
compatibility: Expects split catalog.json + entrainement-*.json (exerciseRefs, no groups).
metadata:
  author: user
  version: "3.0"
  generatedBy: "admin-exercises-trainings"
---

Create or update files under `exercice_list/` for import and Docker bundle reset.

**Input**: Optional description containing:

- training name (for `entrainement-*.json`)
- which catalog exercises to include (`refId`, `exerciseId`)
- optional `globalRestTime` on the training file
- optional: extend `catalog.json` or templates `entrainement-global.json` (**Haut du corps**), `entrainement-dynamisme-jambes-mollets-core.json` (**Jambes**)

Reject vague requests; ask clarifying questions first.

## What to produce

### `exercice_list/catalog.json` (global, shared)

```json
{
  "exercises": {
    "ex-id": {
      "id": "ex-id",
      "name": "Nom",
      "type": "time",
      "value": 30,
      "muscleGroup": "jambes"
    }
  }
}
```

### `exercice_list/entrainement-<slug>.json` (one training)

```json
{
  "name": "Nom affiché",
  "globalRestTime": 20,
  "exerciseRefs": [
    { "refId": "ex-id", "exerciseId": "ex-id" }
  ]
}
```

No `exercises` or `groups` keys in training files. Every `exerciseId` MUST exist in `catalog.json`.

### Admin import (runtime)

- **Exercices** tab: catalog JSON (`exercises` only)
- **Entraînements** tab: training JSON (`exerciseRefs` + optional `globalRestTime`)

Legacy combined `WorkoutConfig` with `groups` is rejected.

## Rules

- `muscleGroup`: `jambes | mollets | epaules | bras | abdos | pecs | autre` (not `fessiers` or `dos`)
- `type`: `time` (seconds) or `reps`
- `value` > 0
- `refId` unique within the training file
- Default bundle: `catalog.json` + `entrainement-global.json` (name **Haut du corps**) + `entrainement-dynamisme-jambes-mollets-core.json` (name **Jambes**)
- Deduplicate catalog entries; use `mollets` for calf work, `jambes` for dynamism / squats / lunges

## Execution

1. Confirm training name, rest time, exercise list with muscle groups.
2. Update `catalog.json` first, then training `exerciseRefs`.
3. Validate all refs resolve against catalog.
4. Output JSON in fenced blocks; write files when asked.

## Response style

Short, actionable, validation summary at the end.
