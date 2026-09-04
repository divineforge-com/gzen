## 2024-09-04 - Keyboard Accessibility For Shortcuts
**Learning:** Interactive elements with custom keyboard shortcuts (like the Z, E, N elements in gZen portal) must surface these shortcuts to users. Without explicit attributes, screen reader users and sighted users might not discover the shortcuts, hurting accessibility and UX.
**Action:** Always add the `aria-keyshortcuts` attribute for screen readers and a non-intrusive `title` attribute (e.g. `(Shortcut: [Key])`) for sighted users on elements that have custom keyboard shortcuts mapped to them.
