## Context

The application needs a Timer page for guiding users through their workouts. We have a provided HTML template `timer.html` that uses a dark theme, custom fonts (Lexend), Material Symbols as icons, and custom colors (work-bg: emerald-500, rest-bg: blue-500) representing workout interval states. We need to integrate this pure HTML and Tailwind-based design into our Next.js/React application as a dedicated component/route (`/timer` or similar session route).

## Goals / Non-Goals

**Goals:**
- Migrate `timer.html` structure and classes to a React functional component (`TimerPage` or similar).
- Implement basic timer state management to show how the page transitions between a "work" interval and a "rest" interval.
- Use the existing Next.js framework and Tailwind setup to render the components exactly as the provided HTML design.

**Non-Goals:**
- Connecting directly to complex backend session logic immediately (mocking is fine for the base integration).
- Implementing complete workout audio playback initially (the button will exist but won't play sound).

## Decisions

- **State Management**: We will use React `useState` and `useEffect` hooks for the countdown logic and interval phase switching.
- **Styling Context**: We will add the custom Tailwind configuration colors ("work-bg", "work-text", "rest-bg", "rest-text") from `timer.html` into our Next.js `tailwind.config.ts`.
- **Componentization**: The timer view can be built as a single monolithic page component first since it's highly specialized and visually integrated, rather than splitting it too much, though controls could be split out later.

## Risks / Trade-offs

- **Performance of timer**: React `setInterval` can sometimes drift if not careful. We will mitigate this by either trusting a simple countdown or computing deltas against `Date.now()`. For the initial UI integration, a basic `setInterval` countdown is acceptable.
- **Responsiveness**: The original HTML relies closely on `dvh` and container queries. We will ensure our global CSS accommodates `max(884px, 100dvh)` or simply rely on standard `h-screen`, adapting slightly if it conflicts with existing layouts.
