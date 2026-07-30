## 2024-07-30 - Keyboard Shortcut Discoverability
**Learning:** Custom keyboard shortcuts exist in `portal.ts` (T for theme, K/I/L/O for paths) but are entirely invisible to users. Screen readers lack `aria-keyshortcuts` and sighted users have no visual hints.
**Action:** Always pair custom JS keyboard event listeners with explicit `aria-keyshortcuts` attributes for screen readers, and append the shortcut to `title` attributes for sighted user discoverability.
