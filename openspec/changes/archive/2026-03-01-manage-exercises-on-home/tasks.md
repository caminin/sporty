## 1. Data Model and Infrastructure

- [x] 1.1 Migrate `exercises.json` manually or via script to the new structure incorporating `globalRestTime` and objects for exercises `{ id, name, type, value }`.
- [x] 1.2 Create or update TypeScript interfaces/types (`Exercise`, `ExerciseGroup`, `WorkoutConfig`) to reflect the new structure.
- [x] 1.3 Implement Server Actions (or API routes) to safely parse, read, and save the full newly structured `exercises.json` content.

## 2. Group Settings

- [x] 2.1 Refactor the Group Settings page to read the new object-based format of exercises without crashing.
- [x] 2.2 Add an input field for configuring `globalRestTime` and wire it up to save to the JSON on change/blur.
- [x] 2.3 Refactor the existing exercise addition/editing logic in Group Settings to capture `type` (reps/time) and `value` (count/duration).

## 3. Home Page Integration

- [x] 3.1 Fetch and display the categorized exercises cleanly on the home page, showing exercise name, type, and specific duration or repetition count.
- [x] 3.2 Implement a "Delete" button (trash icon) for each exercise on the home page that removes it from the JSON via the Server Action.
- [x] 3.3 Implement an "Add Exercise" inline form or modal for each group on the home page, capturing name, type, and value before saving to JSON.

## 4. Quality Assurance

- [x] 4.1 Verify timer pages or downstream components that consume `exercises.json` don't crash when loading the new structure.
- [x] 4.2 Ensure UI properly distinguishes visually between time-based exercises (e.g. showing a clock icon) and rep-based exercises.
