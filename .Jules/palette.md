## 2024-05-24 - Interactive Element Keyboard Shortcut Hints
**Learning:** When custom keyboard shortcuts (like Z, E, N) are wired up to interactive elements via global event listeners, adding `aria-keyshortcuts` ensures screen readers announce the binding, while a native `title` attribute containing '(Shortcut: [Key])' provides a non-intrusive, discoverable visual tooltip for sighted users without altering the core visual layout.
**Action:** Always pair global keystroke event bindings with explicit `aria-keyshortcuts` and visual tooltip hints on their corresponding focusable elements.
