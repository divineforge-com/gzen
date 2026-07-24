## 2026-07-24 - Expose custom keyboard shortcuts
**Learning:** Custom interactive keyboard shortcuts are currently hidden from screen reader users and sighted users relying on tooltips.
**Action:** When custom interactive shortcuts are present (e.g. for ThemeToggle or DoorCard components), explicitly declare them using `aria-keyshortcuts="<key>"` on the relevant interactive elements and provide a visual hint in the `title` attribute for sighted users when appropriate.
