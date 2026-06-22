## 2024-05-18 - Keyboard Navigation Enhancements
**Learning:** Found that custom buttons, interactive anchor tags, and custom widgets in this Hugo setup often lack `focus-visible` styling, making them difficult to use for keyboard navigators. This affects the accessibility of the site, particularly for the language toggles and custom dropdown menus.
**Action:** Adding global `focus-visible` styles to `assets/css/custom.css` to ensure all interactive elements receive a clear, thematic outline when focused via keyboard.
