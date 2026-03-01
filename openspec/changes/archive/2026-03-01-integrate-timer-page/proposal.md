## Why

The application currently has a session view, but we are lacking a dedicated and responsive timer page to guide users through their training sessions. Implementing this timer page is essential for providing real-time feedback and controlling the flow of a workout, allowing users to focus on exercises like "Shadow Footwork" with automated visual cues for "Work Interval" and resting periods.

## What Changes

- Add a new full-screen, responsive Timer view based on `timer.html`.
- Display current exercise information (e.g., "Shadow Footwork", "Group 2 - Speed").
- Display a massive countdown timer in the center of the screen.
- Include playback controls ("Stop" and "Passer/Skip next") fixed to the bottom.
- Incorporate volume/audio controls in the header.
- Use a dynamic background color that changes depending on the interval state (e.g., green for work, blue for rest) as hinted by the CSS variables `work-bg` and `rest-bg`.

## Capabilities

### New Capabilities
- `timer-view`: The core capability to present an active exercise countdown with playback controls and dynamic states (work vs rest).

### Modified Capabilities

## Impact

- Adds new UI components and a dedicated page/route for the active session timer.
- Requires state management for the timer (countdown logic) and handling transitions between different exercises in a session.
