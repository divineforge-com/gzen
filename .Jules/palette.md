## 2024-08-21 - Accessible Keyboard Shortcuts

**Learning:** When creating interactive UI components with custom keyboard shortcuts (like ElementCard mapping to element shortcuts Z, E, N), screen readers and sighted users need visual/auditory cues.
**Action:** Always include `aria-keyshortcuts` to expose the binding programmatically and add a non-intrusive `title` (e.g., `Shortcut: [Key]`) attribute to display a hover tooltip for mouse users.
