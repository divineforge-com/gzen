## 2024-06-01 - CSS-Only Keyboard Accessible Dropdown
**Learning:** Dropdowns created purely with CSS hover states are entirely inaccessible to keyboard users because `hover` does not trigger on focus. Users navigating with Tab cannot open the menu or access its links.
**Action:** Use `.trigger:focus-visible + .dropdown` and `.dropdown:focus-within` to maintain CSS-only implementation while providing full keyboard access, without needing JavaScript.
