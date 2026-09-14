## 2026-09-13 - [Interactive Card Keyboard Shortcuts]
**Learning:** When adding keyboard shortcuts to interactive card components (like ElementCard in the portal), sighted users may not realize a shortcut exists, and screen readers need programmatic association.
**Action:** Use both the `aria-keyshortcuts` attribute for screen readers and a non-intrusive `title` attribute appended with `(Shortcut: [Key])` to provide a discoverable tooltip for sighted users.
