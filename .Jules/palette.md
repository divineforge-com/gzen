## 2024-05-18 - Missing ARIA Keyboard Shortcut
**Learning:** Element Cards in the Astro portal map to the keys Z, E, N for quick navigation. However, the `<a>` tags for the cards are missing the `aria-keyshortcuts` property and a tool-tipped `title` property, which creates an accessibility gap for screen reader users and those looking for tooltips.
**Action:** When implementing custom keyboard event listeners, always attach `aria-keyshortcuts` and a non-intrusive tooltip to the interactive DOM element so the association is programmatically exposed to AT and easily discoverable.
