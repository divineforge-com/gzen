## 2024-05-18 - Exposing Keyboard Shortcuts for Discoverability and Accessibility
**Learning:** Custom keyboard shortcuts implemented via JavaScript (like the Theme Toggle `T` and Path Cards `K`, `I`, `L`, `O`) are hidden from screen readers and sighted users by default. This makes the interactions undiscoverable.
**Action:** Always include the `aria-keyshortcuts` attribute on the interactive element to expose the shortcut to assistive tech, and provide a visual hint in the `title` attribute for sighted users.
