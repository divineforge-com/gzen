## 2026-08-03 - Keyboard Shortcuts Accessibility
**Learning:** Interactive elements with custom keyboard shortcuts (such as the Theme Toggle or Door Cards in the Astro portal) often lack accessible hints. Screen reader users need to be informed of these shortcuts through `aria-keyshortcuts`, while sighted users benefit from visual hints in the `title` attribute.
**Action:** When creating or modifying interactive elements with custom keyboard shortcuts, ensure they include the `aria-keyshortcuts` attribute and a visual hint in the `title` attribute when appropriate.
