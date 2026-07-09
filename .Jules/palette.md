## 2026-07-09 - Language Switcher Accessibility
**Learning:** Screen readers will incorrectly pronounce non-native language names (e.g. reading "日本語" with English pronunciation rules) unless the elements are tagged with proper `lang` attributes. Adding `hreflang` helps with overall document outline semantics for translations.
**Action:** Always add `lang` and `hreflang` to any multilingual language toggle links or inline translations so assistive tech handles them correctly.
