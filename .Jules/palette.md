## 2025-02-12 - Language Switcher Screen Reader Pronunciation
**Learning:** Multilingual sites (like this Hugo/Blowfish app) need `hreflang` and `lang` explicitly set on language switcher `<a>` tags. Without them, screen readers may use the current page's language pronunciation engine for the translated names (e.g., trying to read "日本語" with an English voice), resulting in incomprehensible audio.
**Action:** Always ensure `hreflang` and `lang` attributes are added to language toggle links pointing to localized routes.
