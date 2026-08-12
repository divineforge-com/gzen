
## 2026-08-12 - [Accessibility] Discoverable Custom Global Keyboard Shortcuts
**Learning:** Custom global keyboard shortcuts mapped in javascript (like T for theme, and K/I/L/O for portal paths) are completely invisible to users unless properly documented in the DOM. Sighted users won't know they exist, and screen readers won't announce them.
**Action:** When adding global JS event listeners for shortcut keys on interactive elements, always pair them with the `aria-keyshortcuts` attribute for assistive technology, and expose the shortcut text visibly (e.g., via `title` attribute) so sighted users can also learn and utilize the shortcut.
