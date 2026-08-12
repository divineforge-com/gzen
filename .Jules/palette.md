## 2024-05-15 - [Add Accessible Keyboard Shortcuts Hints]
**Learning:** For interactive elements with custom keyboard shortcuts (such as the Theme Toggle or Path Cards), providing an `aria-keyshortcuts` attribute exposes the shortcut to assistive technologies while adding a `title` provides a visual hint for sighted users.
**Action:** Always include `aria-keyshortcuts` and descriptive `title` attributes on elements bound to custom keyboard shortcuts.
