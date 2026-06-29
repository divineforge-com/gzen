## 2024-06-29 - Language Switcher Accessibility
**Learning:** Screen readers require `lang` and `hreflang` attributes on language switcher links to correctly switch pronunciation profiles when reading the link text (e.g. reading "日本語" with a Japanese voice instead of an English one).
**Action:** Always include `hreflang="{{ .Language.Lang }}" lang="{{ .Language.Lang }}"` on language toggle links in multilingual Hugo sites.
