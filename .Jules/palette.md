## 2026-08-14 - Custom Keyboard Shortcut Accessibility
**Learning:** Interactive elements with custom keyboard shortcuts (like Theme Toggle or Path Cards) often lack discoverability for sighted users and fail to announce shortcuts to screen readers.
**Action:** Always add the `aria-keyshortcuts` attribute for screen readers and append `(Shortcut: [Key])` to the `title` attribute for visual tooltips to maintain non-intrusive accessibility.
