## 2024-05-18 - ElementCard Keyboard Accessibility
**Learning:** The ElementCard component had custom keyboard shortcuts implemented via JavaScript (Z, E, N) and visual hints, but lacked semantic `aria-keyshortcuts` attributes and adequate `:focus-visible` states to mirror `:hover` states, leaving keyboard users without sufficient interactive feedback.
**Action:** Always ensure that components with keyboard-triggered behaviors include `aria-keyshortcuts` and have explicit `:focus-visible` styling (often mirroring `:hover` states for complex interactive cards) to maintain full accessibility.
