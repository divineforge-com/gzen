## 2024-07-27 - Keyboard Shortcuts for Portal Components
**Learning:** Custom interactive elements (Theme Toggle, Door Cards) in the Astro portal had keyboard bindings defined in JS (`T`, `K`, `I`, `L`, `O`), but no a11y semantic attributes or visual hints for these shortcuts. This left screen reader and sighted users unaware of the quick navigation bindings.
**Action:** Always add `aria-keyshortcuts` attributes to interactive elements that have custom JS keydown listeners attached, and provide a visual hint using the `title` attribute for sighted users where appropriate.
