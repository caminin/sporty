## Context

The current group settings page was initially intended for configuring general group parameters such as notifications and privacy. The requirements have changed: this page must now serve as a configuration tool to manage specific groups of exercises for badminton. The goal is to define exercises categorized by groups, specifically: Cardio endurance, Épaules et frappe, adbos, Explosivité jambes, and Agilité et déplacements. This configuration needs to be exported into a format compatible with `exercices.json`.

## Goals / Non-Goals

**Goals:**
- Provide a UI that lists the 5 predefined groups of exercises.
- Allow users to add or remove exercises within any of these groups.
- Sort or organize the exercises.
- Export the complete configuration as a JSON object formatted for `exercices.json`.

**Non-Goals:**
- Managing group privacy, notifications, or member management.
- Backend persistence (data is meant to be exported to JSON for use elsewhere).

## Decisions

- **State Structure**: We will use a React state object or array containing the 5 predefined groups. Each group will have an array of exercise names (strings).
- **UI Implementation**: We will build lists for each group, with a text input field to add new exercises. We will include basic delete buttons for each exercise.
- **Export Action**: The export button will serialize the state into the required JSON structure and trigger a `navigator.clipboard.writeText` action with visual feedback.
- **Data persistence**: We can consider `localStorage` to avoid losing the list upon page refresh, although exporting is the primary goal.

## Risks / Trade-offs

- **Data loss on refresh**: If the user refreshes without exporting or if we don't implement local storage, the state is lost. 
  - **Mitigation**: Implement `localStorage` to persist the state locally.
- **JSON format compatibility**: The exported format must exactly match what the consumer of `exercices.json` expects.
  - **Mitigation**: Ensure the serialization closely matches the requested structure.
