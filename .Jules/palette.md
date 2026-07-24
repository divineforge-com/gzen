## 2024-07-23 - [Keyboard Shortcuts Accessibility]
**Learning:** The portal uses custom keyboard shortcuts (T for theme, K I L O for doors) implemented via global event listeners, but fails to communicate these shortcuts semantically to screen readers via the `aria-keyshortcuts` attribute, missing an opportunity for better accessibility and discoverability.
**Action:** Enhance interactive elements (buttons and links) with `aria-keyshortcuts` and `role="switch"` (for toggle buttons) to surface custom keyboard handlers to assistive technologies.
