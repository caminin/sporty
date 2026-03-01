## Context

Currently, the `exercises.json` file holds a simple mapping of groups to arrays of string names. The application uses this directly as the source of truth for group exercises. To make the application an actual usable workout helper, we need more behavior tied to each exercise (time-based vs. repetitions) and the ability to manage these entries in real-time from the UI (home page), instead of manually modifying the `exercises.json` file. The group settings will track a global rest duration to apply between individual exercise sets.

## Goals / Non-Goals

**Goals:**
- Migrate `exercises.json` format to handle objects representing exercises (`{ id, name, type, durationOrReps }`).
- Allow the home page to read, add, and remove exercises from arbitrary groups in this JSON.
- Allow configuring the global rest time in the JSON via a settings menu.
- Enable the timer page and upcoming workout execution page to decipher which logic to use (timeout beep vs. manual 'OK' to proceed) based on the specific exercise.

**Non-Goals:**
- Building out the entire workout execution module (this is likely a separate change or builds onto the timer view).
- Creating complex personalized exercise plans per user. We stick to a global `exercises.json` configuration for simplicity.

## Decisions

- **Data structure:**
  We will introduce an overarching JSON object:
  ```json
  {
    "globalRestTime": 30,
    "groups": {
      "Cardio endurance": [
        { "id": "uuid-1", "name": "Burpees", "type": "time", "value": 45 },
        { "id": "uuid-2", "name": "Montées de genoux", "type": "reps", "value": 50 }
      ]
    }
  }
  ```
  *Rationale:* This structure makes it explicitly clear that settings apply to all groups while maintaining the grouped organization for UI presentation. `id` is required for safe deletion/selection in React.

- **Storage / Update mechanism:**
  Next.js Server Actions or dedicated API routes will be required to write back to `exercises.json` since the client cannot write to the file system directly. Given the existing setup, Server Actions in Next.js 14+ is typically the cleanest choice for simple file-based updates.

- **Component Management on Home Page:**
  The home page will pull in groups and display them. For each group, we'll provide an "Add Exercise" button which spawns a neat inline form (or a dialog) capturing Name, Type (Reps/Time), and Value. A "Delete" button (trash icon) will exist beside each exercise.

## Risks / Trade-offs

- **Risk:** Existing code dependent on the simple string-array format of `exercises.json` will break completely.
  *Mitigation:* A thorough sweep of the codebase (`page.tsx`, `timer.html` if integrated, and group-settings component) to refactor all mapping of the group items.
- **Risk:** Concurrent or rapid writes could corrupt the JSON file.
  *Mitigation:* This is currently a single-user local file so race conditions are highly unlikely. For safety, we can read first, append, and overwrite synchronously.
