## 2024-09-12 - Missing Focus Indicators for Custom UI components
**Learning:** Custom UI components (like the ElementCards or micro-practice buttons) often use `outline: none;` to remove default browser styling but forget to add custom `:focus-visible` states. This makes keyboard navigation impossible for screen readers and power users as they cannot see which element has focus.
**Action:** Always ensure that when `outline: none;` is used, a corresponding `:focus-visible` state is added (e.g., mirroring the `:hover` style) to maintain keyboard accessibility and visual focus indicators.
