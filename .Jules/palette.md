## 2024-05-18 - Element Card Keyboard Accessibility
**Learning:** Custom interactive cards with `outline: none` require explicitly mirrored `:focus-visible` states to preserve keyboard accessibility, otherwise focus is invisible. Furthermore, adding `aria-keyshortcuts` with a `title` tooltip helps both screen readers and sighted users discover keyboard shortcuts without cluttering the UI.
**Action:** Always mirror `:hover` states to `:focus-visible` when `outline: none` is used, and use `aria-keyshortcuts` along with `title` to provide discoverable shortcuts on interactive elements.
