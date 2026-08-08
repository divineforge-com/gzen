
## 2026-08-08 - Keyboard Hints on Global Shortcuts
**Learning:** Found a recurring pattern where interactive elements that trigger global shortcuts (like 'T' for theme toggle, or 'K/I/L/O' for path cards) lack structural communication of these bindings.
**Action:** When adding global keyboard shortcuts via event listeners in components, explicitly surface them via `aria-keyshortcuts` on the interactive element and incorporate a text hint in the visual `title` attribute for accessibility.
