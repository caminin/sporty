## Why

Our users need the ability to customize their workouts dynamically directly from the home page. Currently, the list of exercises is static and tied to group settings without providing details on how the exercises should be executed. Introducing exercise types (time-based vs. repetitions) and managing them from the home page makes the application much more flexible and actionable for users.

## What Changes

- Redesign of the `exercises.json` structure to not only handle exercise names but also their types (repetitions vs. time) and specific duration/reps.
- Modification of the home page to allow adding, editing, and deleting exercises from the workout list.
- Addition of an exercise type parameter (either "reps" requiring a manual "OK" to proceed, or "time" which automatically progresses with a beep).
- Addition of a common global rest time setting, configurable in the group settings and saved in the JSON.
- **BREAKING**: The format of `exercises.json` will shift from an array of strings per group to an array of objects per group.

## Capabilities

### New Capabilities
- `home-page-exercise-management`: Manage, add, and remove exercises directly from the home page.

### Modified Capabilities
- `group-settings`: Expand settings to include a global rest time and adapt to handle structured exercise objects (with `type`, and `value` for timing/reps) instead of simple strings.

## Impact

- `app/exercises.json`: The schema will be updated to include an array of objects with exercise behavior details and global settings.
- `app/page.tsx`: Significant UI/UX updates to handle list modifications (add, delete, select types).
- Component functions dealing with `exercises.json` will need to parse the new structure.
- The timer logic or task execution page will need to diverge handling depending on whether the exercise is time-based or repetition-based.
