## 2026-08-27 - [Keyboard Shortcuts Accessibility]
**Learning:** Interactive elements with custom keyboard shortcuts (like Z, E, N for Path Cards) lack native discoverability and screen reader announcements without explicit attributes.
**Action:** Always add `aria-keyshortcuts` for screen readers and a `title` attribute appending `(Shortcut: [Key])` to provide a non-intrusive visual tooltip for sighted users.
