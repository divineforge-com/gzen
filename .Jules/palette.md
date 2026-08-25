# Critical UX Learnings

## 2026-08-25 - Element Card Focus States & Shortcuts

**Learning:** Custom interactive components like `ElementCard` that explicitly set `outline: none;` without providing a `:focus-visible` alternative completely break keyboard navigation visibility. Additionally, while JS shortcuts exist for components, users without sight or hover capability cannot discover them without proper ARIA markup (`aria-keyshortcuts`) and visually-hidden hints.

**Action:** Always map `:focus-visible` to `:hover` styles when removing default browser outlines to ensure keyboard navigators receive proper feedback. Inject `aria-keyshortcuts` into the DOM and use attributes like `title` or visually hidden `.sr-only` spans to expose JS-bound hotkeys explicitly for screen readers and pointer devices.
