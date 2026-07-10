## 2026-07-10 - Screen Reader Pronunciation Profiles for Multilingual Sites
**Learning:** Language switchers require `hreflang` and `lang` attributes set to the target language code. Without these, screen readers will try to read the target language's name using the current page's pronunciation profile, causing confusion (e.g., an English screen reader trying to pronounce '中文' or '日本語').
**Action:** Always include `hreflang` and `lang` on <a> tags for language switchers to trigger the screen reader to switch its pronunciation engine appropriately.
