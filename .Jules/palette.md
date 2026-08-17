
## 2026-08-17 - Keyboard Shortcut Discoverability
**Learning:** Hidden keyboard shortcuts in custom JS implementations often go unnoticed by users and are invisible to screen readers, causing accessibility gaps and missed UX opportunities.
**Action:** When adding global JS keydown event listeners for specific actions (like "Z", "E", "N" for elements or "Escape" to close modals), always add `aria-keyshortcuts` for screen readers and append `(Shortcut: [Key])` to the `title` attribute for visual hover discovery.
