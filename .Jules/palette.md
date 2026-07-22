## 2026-07-22 - Add focus-visible states to custom interactive components
**Learning:** The custom interactive elements in the gZen monorepo (such as `.gzen-sec-card` and `.gallery-filter-btn`) lack default browser outlines or explicit focus states, making keyboard navigation difficult for accessibility.
**Action:** Always ensure that custom interactive UI components have an explicit `:focus-visible` state defined (e.g., matching the hover state styles or adding an outline) to preserve keyboard accessibility.
