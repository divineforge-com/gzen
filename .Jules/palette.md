## 2024-10-24 - Element Card Focus States
**Learning:** When creating custom UI components with `outline: none;`, ensure they include explicit `:focus-visible` states to maintain proper keyboard accessibility, and interactive elements with custom keybindings must include `aria-keyshortcuts`.
**Action:** Add `:focus-visible` styles matching `:hover` styles to custom interactive elements lacking default focus outlines, and add `aria-keyshortcuts` to components with keyboard shortcuts.
