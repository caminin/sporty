## Context

The badminton application requires a settings page for exercise groups. The design for this page has been determined via a Stitch project titled "Exercise Group Settings". We need to integrate this design into our current Next.js application frontend.

## Goals / Non-Goals

**Goals:**
- Create a new route `app/badminton/group-settings` (or similar).
- Implement the UI components based on the Stitch mockup.
- Ensure the page is responsive and matches the thematic design (Dark Mode, Lexend font, etc., based on Stitch metadata).

**Non-Goals:**
- Implementing the full backend API for saving and loading these settings if it doesn't exist yet. We will focus on the UI and use mock data or local state for now.

## Decisions

- **Routing:** Place the page at `app/badminton/group-settings/page.tsx` to keep it within the badminton domain.
- **Styling:** Use Tailwind CSS or existing global CSS modules to match the dark theme and green accents (#13ec5b) specified in the design.
- **State Management:** Local React state will be used for toggles and form inputs initially. 
- **Export:** Implement a simple "Export State" button that uses `JSON.stringify` on the current settings state and copies the result to the clipboard using the Clipboard API, to permit manual transfer of settings without a backend.

## Risks / Trade-offs

- [Risk] Hardcoded state might require a substantial refactor when connecting to a real backend. → Mitigation: Extract state into a custom hook (e.g., `useGroupSettings`) from the start so the UI components remain decoupled from the data fetching logic.
- [Risk] Clipboard API might be blocked by some browser policies. → Mitigation: Provide a fallback text area to display the JSON if clipboard copying fails.
