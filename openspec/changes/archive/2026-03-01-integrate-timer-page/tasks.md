## 1. Setup

- [x] 1.1 Add 'work-bg', 'work-text', 'rest-bg', and 'rest-text' custom colors to `tailwind.config.ts`.
- [x] 1.2 Add the 'Lexend' font family to `tailwind.config.ts` if not already present, and import it in the global CSS or layout.
- [x] 1.3 Add any necessary global CSS overrides from `timer.html` (e.g., `h-screen`, `.no-scrollbar`).

## 2. Core Implementation

- [x] 2.1 Create a new `TimerPage` React component in `app/timer/page.tsx` (or `app/(routes)/timer/page.tsx` as appropriate) using the `timer.html` structure.
- [x] 2.2 Replicate the exact HTML structure, replacing class attributes with `className` and converting inline styles as needed.
- [x] 2.3 Implement the state variables: `timeLeft` (number), `phase` ('work' | 'rest' or similar enum), and `exerciseName` and `groupName`.
- [x] 2.4 Bind the state variables to the JSX so that the countdown number, phase text, exercise text, and background color (`bg-work-bg` vs `bg-rest-bg`) dynamically update based on the state.
- [x] 2.5 Ensure the "Material Symbols Outlined" icons render correctly in the Next.js React component context.

## 3. Interactivity & Verification

- [x] 3.1 Implement a `useEffect` hook to tick the countdown timer down every second and switch phases when it reaches 0.
- [x] 3.2 Add `onClick` handlers to the "Stop" and "Passer" buttons to update the state or mock an event log (using `console.log` or alert for now).
- [x] 3.3 Add `onClick` handler to the volume toggler.
- [x] 3.4 Open the new timer page in the browser and verify that the timer counts down, phase colors transition, and it precisely matches the `timer.html` reference visually.
