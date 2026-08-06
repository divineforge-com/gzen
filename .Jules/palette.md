## 2025-02-23 - Keyboard Shortcuts Accessibility
**Learning:** Interactive elements with custom keyboard shortcuts (such as Theme Toggle or Door Cards) lack accessibility hints for both screen readers and sighted users if they don't explicitly declare them.
**Action:** Always include `aria-keyshortcuts` for screen readers and a `title` attribute to provide a visual hint for sighted users when implementing custom keyboard interactions in the app's components.
