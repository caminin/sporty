## 1. Update `exercises.json` Data Format

- [x] 1.1 Overwrite `app/exercises.json` with a JSON object containing the badminton groups: "Cardio endurance", "Épaules et frappe", "adbos", "Explosivité jambes", "Agilité et déplacements", each mapped to an array of exercises (initially empty or populated with default ones if requested).

## 2. Update Group Settings State

- [x] 2.1 Identify the component or route handling `group-settings` state (likely `app/group-settings/page.tsx` or similar).
- [x] 2.2 Import the new `exercises.json` object.
- [x] 2.3 Initialize the group settings' default data source to the imported JSON object so the UI dynamically displays these categories as its baseline.
