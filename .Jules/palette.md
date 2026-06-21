## 2024-06-21 - CSS Hover Menus and Keyboard Focus
**Learning:** Using `visibility: hidden` on a dropdown menu means it cannot receive keyboard focus naturally. Applying `:focus-within` to the hidden menu itself doesn't work because elements inside it cannot be tabbed to.
**Action:** Always apply `:focus-within` to the visible parent container (like `.gzen-nav-dropdown`) so that when the visible trigger receives focus, the menu becomes visible, allowing users to tab into its contents.
