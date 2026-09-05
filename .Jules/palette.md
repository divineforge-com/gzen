## 2024-05-24 - Undiscoverable Global Shortcuts

**Learning:** When global keyboard shortcuts are mapped via global event listeners (e.g., keystroke listeners in `portal.ts`), the interactive UI elements that correspond to those actions often lack screen-reader hints (`aria-keyshortcuts`) and visual tooltips (`title`). This makes the feature completely undiscoverable to both sighted users and assistive technology users.

**Action:** Whenever implementing or reviewing custom keystroke event listeners mapping to UI elements, ensure the corresponding DOM elements include both `aria-keyshortcuts="[Key]"` and `title="... (Shortcut: [Key])"` attributes to maintain accessibility and discoverability.