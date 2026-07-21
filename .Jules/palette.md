## 2024-07-22 - Missing Focus Visible Styles on Custom Components
 **Learning:** Custom navigation links, buttons, and cards (`.gzen-nav a`, `.gzen-primary-link`, etc.) lacked `:focus-visible` states, making keyboard navigation difficult to track for users navigating with Tab.
 **Action:** Always ensure that any custom component with a `:hover` state also has a corresponding `:focus-visible` state (often utilizing `outline` or ring styles) to guarantee keyboard accessibility.
