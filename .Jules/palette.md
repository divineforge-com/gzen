## 2024-05-18 - Keyboard Shortcut Accessibility
**Learning:** Interactive elements with custom keyboard shortcuts (such as the Theme Toggle or Door Cards) need the `aria-keyshortcuts` attribute for accessibility, and should provide a visual hint in the `title` attribute for sighted users when appropriate.
**Action:** When adding custom keyboard interactions, always include `aria-keyshortcuts` and a visual hint in the `title` or tooltip to ensure both screen reader and sighted users can discover the shortcuts.
