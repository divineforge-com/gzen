## 2026-06-27 - Improve Language Switcher Accessibility
**Learning:** Language switchers need `lang` and `hreflang` attributes matching the target language code. Without these, screen readers will incorrectly attempt to read the foreign language text using the current page's language pronunciation profile, resulting in incomprehensible gibberish for users.
**Action:** Always include `hreflang` and `lang` attributes on language switcher links to ensure proper screen reader pronunciation profiles are applied.
