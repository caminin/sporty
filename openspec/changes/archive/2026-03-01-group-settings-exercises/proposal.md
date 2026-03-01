## Why

The current group settings page needs to be modified to manage the specific groups of exercises for badminton. This will allow the configuration to generate a structured `exercices.json` file. The goal is to let users organize their exercises by specific categories (groups).

## What Changes

- Redesign the group settings page to manage exercise groups.
- Create 5 predefined groups: Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements.
- Allow users to add multiple exercises within each group and sort them.
- Export mechanism needs to output a valid `exercices.json` reflecting the structure.

## Capabilities

### New Capabilities

### Modified Capabilities

- `group-settings`: Changed requirements from configuring notifications, privacy to managing exercise groups (Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, Agilité et déplacements) and adding multiple exercises to each.

## Impact

- `app/group-settings/page.tsx` (The UI needs to be overhauled to support lists of groups and the exercises within).
- The exported JSON data structure will need to accommodate the hierarchical structure of groups containing nested exercises.
