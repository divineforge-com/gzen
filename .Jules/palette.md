## 2026-07-26 - Keyboard Shortcut Accessibility
**Learning:** When interactive elements have custom global keyboard shortcuts (like ThemeToggle 'T' or DoorCards 'K/I/L/O' triggered in a global window 'keydown' listener), screen reader users or sighted keyboard users won't know they exist. It's critical to include `aria-keyshortcuts` and visual tooltips via `title` to communicate this affordance.
**Action:** Always verify custom JS keyboard shortcuts map directly to `aria-keyshortcuts` and `title` tags on the corresponding trigger elements.
