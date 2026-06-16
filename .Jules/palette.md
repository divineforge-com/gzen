## 2026-04-05 - Dropdown Accessibility Pattern
**Learning:** Found an ecosystem dropdown that relies purely on CSS hover/focus but has static ARIA attributes that don't update on interaction. This breaks screen reader expectations.
**Action:** Add a small JS script to toggle aria-expanded on focus/blur/mouseenter/mouseleave to match the visual state driven by CSS, maintaining accessibility without needing heavy JS frameworks.
