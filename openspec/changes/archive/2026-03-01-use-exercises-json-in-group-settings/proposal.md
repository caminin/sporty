## Why

We currently export group settings, but we fall back to an empty selection or hardcoded fallback. The user wants `exercises.json` to be natively compatible with the `group-settings` export format and for `group-settings` to use `exercises.json` as its baseline. This allows pre - defining exercises mapped to specific badminton-focused groups ("Cardio endurance", "Épaules et frappe", "adbos", "Explosivité jambes", "Agilité et déplacements").

## What Changes

- Modify `exercises.json` to align with the schema expected by `group-settings` export/import format.
- Populate `exercises.json` with the requested grouped categories for a badminton context.
- Update `group-settings` component/page to load `exercises.json` as its default initial state instead of an empty/mock state.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
None.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `group-settings`: Load predefined exercises from `exercises.json` on startup as the default state.

## Impact

- `app/exercises.json` file completely reworked to be compatible with group settings structure.
- `app/group-settings` page/logic (initial state initialization is updated).
