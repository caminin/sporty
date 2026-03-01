## Context

The application currently has an `exercises.json` file which defines exercises, and a `group-settings` component/page which allows importing/exporting categorized groups of exercises. However, the `exercises.json` format isn't fully compatible natively with the export format, and `group-settings` does not load `exercises.json` as its primary default data source. The user wants them to be unified for badminton with specific default groups.

## Goals / Non-Goals

**Goals:**
- Unify `exercises.json` schema to match `group-settings` export format.
- Define default exercise categories specifically for Badminton: "Cardio endurance", "Épaules et frappe", "adbos", "Explosivité jambes", "Agilité et déplacements".
- Ensure `group-settings` component/page uses `exercises.json` as the default state instead of an empty or different initial state.

**Non-Goals:**
- Making dynamic groups feature from scratch. We will populate the existing 5 specific groups as defaults in `exercises.json`.

## Decisions

- **Modify `exercises.json` format:** `exercises.json` currently might have a different format. We will overwrite it to contain a json object mapping the 5 specific group names to arrays of exercises.
- **Import `exercises.json` in `group-settings`:** In the `group-settings` code, we will import the `exercises.json` and initialize the default state to this imported JSON object, so that when the page is loaded, the existing exercises are already there.

## Risks / Trade-offs

- **Risk: Pre-existing exercises mapping:** Overwriting `exercises.json` might remove old exercises if they aren't migrated to the new groups.
  → Mitigation: We will map any existing dummy exercises if requested or just provide empty arrays for the required groups.
