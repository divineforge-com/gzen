
## 2026-05-28 - Language Switcher Screen Reader Accessibility
**Learning:** For multilingual applications, language switcher links must include both `lang` and `hreflang` attributes corresponding to the target language code. Without these attributes, screen readers may read the localized name (e.g., "English", "日本語") using the current page's default pronunciation profile (e.g., trying to read "English" using a Chinese pronunciation profile), which causes confusing user experiences.
**Action:** Always include `lang` and `hreflang` when creating or modifying language switchers or any links that transition to a different language.
